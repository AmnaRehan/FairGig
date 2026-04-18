from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Float, DateTime, Integer, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional, List
import os, uuid, csv, io
import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="FairGig Earnings Service")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"])

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost/fairgig_earnings")
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8000")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class EarningsLog(Base):
    __tablename__ = "earnings_logs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    worker_id = Column(String, nullable=False)
    platform = Column(String, nullable=False)
    shift_date = Column(DateTime, nullable=False)
    hours_worked = Column(Float, nullable=False)
    gross_earned = Column(Float, nullable=False)
    platform_deductions = Column(Float, default=0.0)
    net_received = Column(Float, nullable=False)
    city = Column(String)
    category = Column(String)  # ride-hailing, food-delivery, etc.
    verification_status = Column(String, default="pending")  # pending, verified, disputed, unverifiable
    screenshot_path = Column(String)
    verifier_notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

class EarningsCreate(BaseModel):
    platform: str
    shift_date: str
    hours_worked: float
    gross_earned: float
    platform_deductions: float = 0.0
    net_received: float
    city: str = ""
    category: str = ""

class VerificationUpdate(BaseModel):
    status: str  # verified, disputed, unverifiable
    notes: str = ""

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_worker_id(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{AUTH_SERVICE_URL}/auth/verify-token",
            headers={"Authorization": authorization})
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid token")
    data = r.json()
    return data["user_id"], data["role"]

@app.post("/earnings/", status_code=201)
async def create_earning(entry: EarningsCreate, authorization: str = Header(None), db: Session = Depends(get_db)):
    worker_id, role = await get_worker_id(authorization)
    log = EarningsLog(
        worker_id=worker_id,
        platform=entry.platform,
        shift_date=datetime.fromisoformat(entry.shift_date),
        hours_worked=entry.hours_worked,
        gross_earned=entry.gross_earned,
        platform_deductions=entry.platform_deductions,
        net_received=entry.net_received,
        city=entry.city,
        category=entry.category,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

@app.get("/earnings/my")
async def get_my_earnings(authorization: str = Header(None), db: Session = Depends(get_db)):
    worker_id, role = await get_worker_id(authorization)
    logs = db.query(EarningsLog).filter(EarningsLog.worker_id == worker_id).order_by(EarningsLog.shift_date.desc()).all()
    return logs

@app.get("/earnings/all")
async def get_all_earnings(authorization: str = Header(None), db: Session = Depends(get_db)):
    worker_id, role = await get_worker_id(authorization)
    if role not in ["verifier", "advocate"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    logs = db.query(EarningsLog).order_by(EarningsLog.created_at.desc()).all()
    return logs

@app.put("/earnings/{log_id}/verify")
async def verify_earning(log_id: str, update: VerificationUpdate, authorization: str = Header(None), db: Session = Depends(get_db)):
    worker_id, role = await get_worker_id(authorization)
    if role not in ["verifier", "advocate"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    log = db.query(EarningsLog).filter(EarningsLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Entry not found")
    log.verification_status = update.status
    log.verifier_notes = update.notes
    db.commit()
    return log

from dateutil import parser

def safe_float(value, default=0.0):
    try:
        return float(value) if value not in [None, ""] else default
    except:
        return default

from dateutil import parser as dateparser

def safe_float(value, default=0.0):
    try:
        if value in [None, ""]:
            return default
        # Remove $ signs and commas
        return float(str(value).replace("$", "").replace(",", "").strip())
    except:
        return default

@app.post("/earnings/bulk-import")
async def bulk_import(file: UploadFile = File(...), authorization: str = Header(None), db: Session = Depends(get_db)):
    worker_id, role = await get_worker_id(authorization)
    content = await file.read()
    reader = csv.DictReader(io.StringIO(content.decode("utf-8-sig")))
    created = []
    skipped = []

    for row in reader:
        try:
            # Normalize headers — strip spaces, lowercase
            row = {k.strip().lower().replace(" ", "_"): str(v).strip() for k, v in row.items()}

            # Skip totals row
            if row.get("date", "").lower() in ["totals:", "total", ""]:
                continue

            # Parse date flexibly (handles MM/DD/YYYY, YYYY-MM-DD, etc.)
            shift_date = dateparser.parse(row.get("date") or row.get("shift_date", ""))
            if not shift_date:
                skipped.append(row)
                continue

            # Support both FairGig CSV and Uber-style CSV
            fares = safe_float(row.get("fares_($)") or row.get("gross_earned", 0))
            tips = safe_float(row.get("tips_($)", 0))
            bonuses = safe_float(row.get("bonuses_($)", 0))
            gross = fares + tips + bonuses if fares else safe_float(row.get("gross_earned", 0))
            deductions = safe_float(row.get("platform_deductions", 0))
            net = safe_float(row.get("net_received") or str(gross - deductions))
            platform = row.get("platform", "") or row.get("trip_type", "Uber")

            log = EarningsLog(
                worker_id=worker_id,
                platform=platform,
                shift_date=shift_date,
                hours_worked=safe_float(row.get("hours_worked", 1)),
                gross_earned=gross,
                platform_deductions=deductions,
                net_received=net,
                city=row.get("city", ""),
                category=row.get("category", "") or row.get("trip_type", "ride-hailing"),
            )
            db.add(log)
            created.append(log)

        except Exception as e:
            print(f"Skipping row: {row} | Error: {e}")
            skipped.append(str(row))

    db.commit()
    return {"imported": len(created), "skipped": len(skipped)}

@app.get("/earnings/summary/{worker_id}")
async def get_summary(worker_id: str, authorization: str = Header(None), db: Session = Depends(get_db)):
    requester_id, role = await get_worker_id(authorization)
    if requester_id != worker_id and role not in ["verifier", "advocate"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    logs = db.query(EarningsLog).filter(EarningsLog.worker_id == worker_id).all()
    if not logs:
        return {"total_shifts": 0, "total_net": 0, "avg_hourly": 0}
    total_hours = sum(l.hours_worked for l in logs)
    total_net = sum(l.net_received for l in logs)
    return {
        "total_shifts": len(logs),
        "total_hours": total_hours,
        "total_gross": sum(l.gross_earned for l in logs),
        "total_deductions": sum(l.platform_deductions for l in logs),
        "total_net": total_net,
        "avg_hourly": round(total_net / total_hours, 2) if total_hours else 0,
        "logs": [{"id": l.id, "platform": l.platform, "shift_date": str(l.shift_date),
                  "net_received": l.net_received, "verification_status": l.verification_status} for l in logs]
    }

@app.get("/health")
def health():
    return {"status": "ok", "service": "earnings"}