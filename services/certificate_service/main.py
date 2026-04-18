from fastapi import FastAPI, HTTPException, Header
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx, os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="FairGig Certificate Renderer")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"])

AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8000")
EARNINGS_SERVICE_URL = os.getenv("EARNINGS_SERVICE_URL", "http://localhost:8001")

class CertificateRequest(BaseModel):
    worker_id: str
    worker_name: str
    date_from: str
    date_to: str

CERTIFICATE_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>FairGig Income Certificate</title>
<style>
  @media print {{ @page {{ margin: 1.5cm; }} }}
  body {{ font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 40px 30px; }}
  .header {{ text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }}
  .logo {{ font-size: 28px; font-weight: 700; color: #2563eb; }}
  .tagline {{ font-size: 13px; color: #6b7280; margin-top: 4px; }}
  h2 {{ font-size: 20px; color: #111; margin-bottom: 4px; }}
  .worker-info {{ background: #f0f9ff; border-left: 4px solid #2563eb; padding: 16px 20px; margin: 24px 0; border-radius: 0 8px 8px 0; }}
  .worker-info p {{ margin: 4px 0; font-size: 14px; }}
  .summary-grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0; }}
  .summary-card {{ background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; }}
  .summary-card .value {{ font-size: 22px; font-weight: 700; color: #2563eb; }}
  .summary-card .label {{ font-size: 12px; color: #6b7280; margin-top: 4px; }}
  table {{ width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 13px; }}
  th {{ background: #2563eb; color: white; padding: 10px 12px; text-align: left; font-weight: 600; }}
  td {{ padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }}
  tr:nth-child(even) {{ background: #f8fafc; }}
  .verified {{ color: #059669; font-weight: 600; }}
  .pending {{ color: #d97706; }}
  .disputed {{ color: #dc2626; }}
  .footer {{ margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }}
  .disclaimer {{ background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px; font-size: 12px; margin-top: 20px; color: #92400e; }}
  .print-btn {{ background: #2563eb; color: white; border: none; padding: 10px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; margin-bottom: 20px; }}
  @media print {{ .print-btn {{ display: none; }} }}
</style>
</head>
<body>
<button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
<div class="header">
  <div class="logo">FairGig</div>
  <div class="tagline">Gig Worker Income Verification Platform</div>
  <h2 style="margin-top:16px">Income Certificate</h2>
</div>

<div class="worker-info">
  <p><strong>Worker Name:</strong> {worker_name}</p>
  <p><strong>Worker ID:</strong> {worker_id}</p>
  <p><strong>Period:</strong> {date_from} to {date_to}</p>
  <p><strong>Certificate Generated:</strong> {generated_at}</p>
</div>

<div class="summary-grid">
  <div class="summary-card">
    <div class="value">PKR {total_net:,.0f}</div>
    <div class="label">Total Net Earnings</div>
  </div>
  <div class="summary-card">
    <div class="value">{total_shifts}</div>
    <div class="label">Verified Shifts</div>
  </div>
  <div class="summary-card">
    <div class="value">PKR {avg_per_shift:,.0f}</div>
    <div class="label">Avg. per Shift</div>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Platform</th>
      <th>Hours</th>
      <th>Gross (PKR)</th>
      <th>Deductions (PKR)</th>
      <th>Net (PKR)</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {rows}
  </tbody>
</table>

<div class="disclaimer">
  <strong>Note:</strong> This certificate is generated from self-reported earnings verified through the FairGig platform.
  Verified entries have been reviewed by a FairGig verifier against platform screenshots.
  This document is intended for landlords, microfinance institutions, and informal credit assessments.
</div>

<div class="footer">
  FairGig · FAST-NU SOFTEC 2026 · Generated {generated_at}
</div>
</body>
</html>
"""

@app.post("/certificate/generate", response_class=HTMLResponse)
async def generate_certificate(req: CertificateRequest, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    async with httpx.AsyncClient() as client:
        auth_r = await client.get(f"{AUTH_SERVICE_URL}/auth/verify-token",
            headers={"Authorization": authorization})
        if auth_r.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid token")
        earnings_r = await client.get(
            f"{EARNINGS_SERVICE_URL}/earnings/summary/{req.worker_id}",
            headers={"Authorization": authorization}
        )
        if earnings_r.status_code != 200:
            raise HTTPException(status_code=404, detail="Earnings not found")
    
    data = earnings_r.json()
    logs = data.get("logs", [])
    
    # Filter by date range
    filtered = [l for l in logs if req.date_from <= l["shift_date"][:10] <= req.date_to
                and l["verification_status"] == "verified"]
    
    if not filtered:
        raise HTTPException(status_code=404, detail="No verified earnings in this date range")
    
    total_net = sum(l["net_received"] for l in filtered)
    rows_html = ""
    for l in filtered:
        status_class = l["verification_status"]
        rows_html += f"""<tr>
            <td>{l['shift_date'][:10]}</td>
            <td>{l['platform']}</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>{l['net_received']:,.0f}</td>
            <td class="{status_class}">{l['verification_status'].upper()}</td>
        </tr>"""
    
    html = CERTIFICATE_TEMPLATE.format(
        worker_name=req.worker_name,
        worker_id=req.worker_id,
        date_from=req.date_from,
        date_to=req.date_to,
        generated_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        total_net=total_net,
        total_shifts=len(filtered),
        avg_per_shift=total_net / len(filtered) if filtered else 0,
        rows=rows_html,
    )
    return HTMLResponse(content=html)

@app.get("/health")
def health():
    return {"status": "ok", "service": "certificate"}