from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from datetime import datetime

app = FastAPI(title="FairGig Anomaly Detection Service")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"])

class EarningsEntry(BaseModel):
    id: str
    shift_date: str
    hours_worked: float
    gross_earned: float
    platform_deductions: float
    net_received: float
    platform: str
    city: Optional[str] = ""

class AnomalyRequest(BaseModel):
    worker_id: str
    earnings: List[EarningsEntry]

class AnomalyFlag(BaseModel):
    entry_id: str
    shift_date: str
    anomaly_type: str
    severity: str  # low, medium, high
    explanation: str
    affected_value: float
    expected_range: str

class AnomalyResponse(BaseModel):
    worker_id: str
    total_entries_analyzed: int
    anomalies_found: int
    flags: List[AnomalyFlag]
    summary: str

def calculate_commission_rate(entry: EarningsEntry) -> float:
    if entry.gross_earned == 0:
        return 0
    return (entry.platform_deductions / entry.gross_earned) * 100

def calculate_hourly_rate(entry: EarningsEntry) -> float:
    if entry.hours_worked == 0:
        return 0
    return entry.net_received / entry.hours_worked

@app.post("/anomaly/detect", response_model=AnomalyResponse)
def detect_anomalies(req: AnomalyRequest):
    if len(req.earnings) < 2:
        return AnomalyResponse(
            worker_id=req.worker_id,
            total_entries_analyzed=len(req.earnings),
            anomalies_found=0,
            flags=[],
            summary="Not enough data to perform anomaly detection. Need at least 2 entries."
        )

    flags = []
    earnings = req.earnings

    # 1. Deduction rate anomaly (commission spike detection)
    commission_rates = [calculate_commission_rate(e) for e in earnings if e.gross_earned > 0]
    if len(commission_rates) >= 3:
        mean_commission = np.mean(commission_rates)
        std_commission = np.std(commission_rates)
        for i, entry in enumerate(earnings):
            if entry.gross_earned == 0:
                continue
            rate = calculate_commission_rate(entry)
            z_score = (rate - mean_commission) / std_commission if std_commission > 0 else 0
            if z_score > 2.0:
                severity = "high" if z_score > 3 else "medium"
                flags.append(AnomalyFlag(
                    entry_id=entry.id,
                    shift_date=entry.shift_date,
                    anomaly_type="unusual_commission_rate",
                    severity=severity,
                    explanation=(
                        f"Platform deducted {rate:.1f}% on this shift, which is significantly higher "
                        f"than your usual {mean_commission:.1f}%. This could indicate a new commission "
                        f"structure, a penalty charge, or a calculation error. Check your platform app "
                        f"for fee breakdowns."
                    ),
                    affected_value=rate,
                    expected_range=f"{max(0, mean_commission - 2*std_commission):.1f}% – {mean_commission + 2*std_commission:.1f}%"
                ))

    # 2. Net income drop anomaly (month-on-month)
    if len(earnings) >= 4:
        sorted_earnings = sorted(earnings, key=lambda x: x.shift_date)
        mid = len(sorted_earnings) // 2
        recent_net = np.mean([e.net_received for e in sorted_earnings[mid:]])
        older_net = np.mean([e.net_received for e in sorted_earnings[:mid]])
        if older_net > 0:
            drop_pct = ((older_net - recent_net) / older_net) * 100
            if drop_pct > 20:
                flags.append(AnomalyFlag(
                    entry_id="summary",
                    shift_date=sorted_earnings[-1].shift_date,
                    anomaly_type="income_drop",
                    severity="high" if drop_pct > 40 else "medium",
                    explanation=(
                        f"Your average per-shift earnings dropped by {drop_pct:.1f}% in recent shifts "
                        f"compared to earlier. Average was PKR {older_net:.0f}, now PKR {recent_net:.0f}. "
                        f"Possible causes: reduced demand in your area, platform algorithm change, "
                        f"or seasonal variation."
                    ),
                    affected_value=drop_pct,
                    expected_range=f"Within 20% of PKR {older_net:.0f}"
                ))

    # 3. Zero-hour shift anomaly
    for entry in earnings:
        if entry.hours_worked == 0 and entry.gross_earned > 0:
            flags.append(AnomalyFlag(
                entry_id=entry.id,
                shift_date=entry.shift_date,
                anomaly_type="zero_hours_with_earnings",
                severity="low",
                explanation="This shift shows earnings but 0 hours worked. Please verify your entry.",
                affected_value=0,
                expected_range="hours_worked > 0"
            ))

    # 4. Unusually low hourly rate
    hourly_rates = [calculate_hourly_rate(e) for e in earnings if e.hours_worked > 0]
    if len(hourly_rates) >= 3:
        mean_hourly = np.mean(hourly_rates)
        std_hourly = np.std(hourly_rates)
        for entry in earnings:
            if entry.hours_worked == 0:
                continue
            rate = calculate_hourly_rate(entry)
            z_score = (mean_hourly - rate) / std_hourly if std_hourly > 0 else 0
            if z_score > 2.5:
                flags.append(AnomalyFlag(
                    entry_id=entry.id,
                    shift_date=entry.shift_date,
                    anomaly_type="low_hourly_rate",
                    severity="medium",
                    explanation=(
                        f"Your effective hourly rate on this shift was PKR {rate:.0f}/hr, "
                        f"much lower than your usual PKR {mean_hourly:.0f}/hr. "
                        f"This could mean a long shift with few orders, surge pricing removal, "
                        f"or an area with low demand."
                    ),
                    affected_value=rate,
                    expected_range=f"PKR {max(0, mean_hourly - 2*std_hourly):.0f} – {mean_hourly + 2*std_hourly:.0f}/hr"
                ))

    if not flags:
        summary = f"No anomalies detected across {len(earnings)} earnings entries. Your commission rates and income levels appear consistent."
    else:
        high_count = sum(1 for f in flags if f.severity == "high")
        summary = (
            f"Found {len(flags)} anomaly flag(s) across {len(earnings)} entries. "
            f"{high_count} high severity. Review flagged entries and compare with your platform's official records."
        )

    return AnomalyResponse(
        worker_id=req.worker_id,
        total_entries_analyzed=len(earnings),
        anomalies_found=len(flags),
        flags=flags,
        summary=summary
    )

@app.get("/anomaly/health")
def health():
    return {"status": "ok", "service": "anomaly"}

@app.get("/health")
def health_root():
    return {"status": "ok", "service": "anomaly"}