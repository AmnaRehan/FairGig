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
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  @media print {{ @page {{ margin: 1.5cm; }} @media print {{ .print-btn {{ display: none; }} }} }}

  * {{ box-sizing: border-box; margin: 0; padding: 0; }}

  body {{
    font-family: 'Inter', 'Segoe UI', sans-serif;
    background: radial-gradient(circle at 20% 10%, #0f172a, #020617 60%, #000);
    color: #e2e8f0;
    min-height: 100vh;
    padding: 40px 20px 60px;
  }}

  .shell {{
    max-width: 820px;
    margin: 0 auto;
    animation: fadeup 0.4s ease;
  }}

  @keyframes fadeup {{ from {{ opacity:0; transform:translateY(10px); }} to {{ opacity:1; transform:translateY(0); }} }}
  @keyframes shimmer {{ 0% {{ background-position:200% center; }} 100% {{ background-position:-200% center; }} }}

  /* ambient glows */
  .glow-tl {{
    position: fixed; width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(99,102,241,0.18), transparent 65%);
    top: -150px; left: -150px; pointer-events: none; z-index: 0;
  }}
  .glow-br {{
    position: fixed; width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(236,72,153,0.12), transparent 65%);
    bottom: -100px; right: -100px; pointer-events: none; z-index: 0;
  }}

  /* print button */
  .print-btn {{
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #6366f1, #ec4899);
    color: white; border: none; border-radius: 12px;
    padding: 11px 24px; font-size: 14px; font-weight: 700;
    cursor: pointer; margin-bottom: 28px;
    box-shadow: 0 10px 28px rgba(99,102,241,0.35);
    transition: all 0.2s;
  }}
  .print-btn:hover {{ opacity: 0.88; transform: translateY(-1px); }}

  /* header card */
  .header-card {{
    background: rgba(15,23,42,0.9);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(148,163,184,0.12);
    border-radius: 20px;
    padding: 32px 36px;
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 30px 80px rgba(0,0,0,0.6);
    text-align: center;
  }}

  .shimmer-line {{
    position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.8), rgba(236,72,153,0.8), transparent);
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
  }}

  .logo {{
    font-size: 30px; font-weight: 700; letter-spacing: -0.03em;
    background: linear-gradient(135deg, #6366f1, #ec4899);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 4px;
  }}

  .tagline {{ font-size: 13px; color: #475569; margin-bottom: 20px; }}

  .cert-title {{
    font-size: 18px; font-weight: 700; color: #e2e8f0;
    letter-spacing: -0.02em;
  }}

  /* worker info card */
  .info-card {{
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.2);
    border-left: 3px solid #6366f1;
    border-radius: 0 14px 14px 0;
    padding: 18px 22px;
    margin-bottom: 16px;
  }}

  .info-card p {{ font-size: 13px; color: #94a3b8; margin: 5px 0; line-height: 1.6; }}
  .info-card p strong {{ color: #c7d2fe; font-weight: 600; }}

  /* summary grid */
  .summary-grid {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 16px;
  }}

  .summary-card {{
    background: rgba(15,23,42,0.8);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(148,163,184,0.1);
    border-radius: 16px;
    padding: 20px 16px;
    text-align: center;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
  }}

  .summary-card .value {{
    font-size: 22px; font-weight: 700; letter-spacing: -0.03em;
    background: linear-gradient(135deg, #6366f1, #ec4899);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 6px;
  }}

  .summary-card .label {{
    font-size: 11px; color: #475569; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
  }}

  /* table card */
  .table-card {{
    background: rgba(15,23,42,0.9);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(148,163,184,0.12);
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 16px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.6);
  }}

  table {{ width: 100%; border-collapse: collapse; font-size: 13px; }}

  thead tr {{
    background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(236,72,153,0.15));
  }}

  th {{
    padding: 13px 16px; text-align: left;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: #94a3b8;
    border-bottom: 1px solid rgba(148,163,184,0.1);
  }}

  td {{
    padding: 11px 16px;
    border-bottom: 1px solid rgba(148,163,184,0.07);
    color: #cbd5e1;
  }}

  tbody tr:last-child td {{ border-bottom: none; }}
  tbody tr:nth-child(even) {{ background: rgba(255,255,255,0.02); }}
  tbody tr:hover {{ background: rgba(99,102,241,0.06); }}

  .verified {{ color: #34d399; font-weight: 600; }}
  .pending  {{ color: #fbbf24; font-weight: 600; }}
  .disputed {{ color: #f87171; font-weight: 600; }}

  /* disclaimer */
  .disclaimer {{
    background: rgba(251,191,36,0.08);
    border: 1px solid rgba(251,191,36,0.2);
    border-radius: 14px;
    padding: 14px 18px;
    font-size: 12px;
    color: #fbbf24;
    line-height: 1.7;
    margin-bottom: 16px;
  }}

  .disclaimer strong {{ color: #fde68a; }}

  /* footer */
  .footer {{
    text-align: center;
    font-size: 11px;
    color: #334155;
    padding-top: 8px;
    letter-spacing: 0.04em;
  }}
</style>
</head>
<body>
<div class="glow-tl"></div>
<div class="glow-br"></div>

<div class="shell">
  <button class="print-btn" onclick="window.print()">🖨 Print / Save as PDF</button>

  <!-- header -->
  <div class="header-card">
    <div class="shimmer-line"></div>
    <div class="logo">FairGig</div>
    <div class="tagline">Gig Worker Income Verification Platform</div>
    <div class="cert-title">Income Certificate</div>
  </div>

  <!-- worker info -->
  <div class="info-card">
    <p><strong>Worker Name:</strong> {worker_name}</p>
    <p><strong>Worker ID:</strong> {worker_id}</p>
    <p><strong>Period:</strong> {date_from} &rarr; {date_to}</p>
    <p><strong>Generated:</strong> {generated_at}</p>
  </div>

  <!-- summary -->
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

  <!-- table -->
  <div class="table-card">
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
  </div>

  <!-- disclaimer -->
  <div class="disclaimer">
    <strong>Note:</strong> This certificate is generated from self-reported earnings verified through the FairGig platform.
    Verified entries have been reviewed by a FairGig verifier against platform screenshots.
    Intended for landlords, microfinance institutions, and informal credit assessments.
  </div>

  <div class="footer">FairGig &middot; FAST-NU SOFTEC 2026 &middot; Generated {generated_at}</div>
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