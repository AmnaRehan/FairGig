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
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FairGig Income Certificate</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
  @media print {{
    @page {{ margin: 1.2cm; }}
    .print-btn {{ display: none !important; }}
    .no-print {{ display: none !important; }}
    body {{ background: #fff !important; padding: 0 !important; }}
    .shell {{ box-shadow: none !important; }}
  }}

  * {{ box-sizing: border-box; margin: 0; padding: 0; }}

  body {{
    font-family: 'Nunito', 'Segoe UI', sans-serif;
    background: linear-gradient(160deg, #FDF2F8 0%, #FFF1F5 45%, #F0F4FF 100%);
    color: #1E293B;
    min-height: 100vh;
    padding: 36px 20px 60px;
  }}

  .shell {{
    max-width: 860px;
    margin: 0 auto;
    animation: fadeup 0.45s ease;
  }}

  @keyframes fadeup {{ from {{ opacity:0; transform:translateY(12px); }} to {{ opacity:1; transform:translateY(0); }} }}
  @keyframes floatY {{ 0%,100% {{ transform: translateY(0) rotate(0deg); }} 50% {{ transform: translateY(-14px) rotate(5deg); }} }}

  /* floating decorations */
  .floatie {{
    position: fixed;
    pointer-events: none;
    user-select: none;
    opacity: 0.12;
    animation: floatY 7s ease-in-out infinite;
    font-size: 56px;
    filter: blur(0.5px);
    z-index: 0;
  }}

  /* print button */
  .print-btn {{
    display: inline-flex;
    align-items: center;
    gap: 9px;
    background: #2563EB;
    color: #fff;
    border: none;
    border-radius: 14px;
    padding: 14px 28px;
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
    margin-bottom: 24px;
    box-shadow: 0 8px 24px rgba(37,99,235,0.3);
    transition: all 0.18s;
    font-family: 'Nunito', sans-serif;
    letter-spacing: -0.01em;
  }}
  .print-btn:hover {{ background: #1D4ED8; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(37,99,235,0.4); }}

  /* ── CERTIFICATE CARD ── */
  .cert-card {{
    background: #fff;
    border-radius: 24px;
    border: 2px solid #FBCFE8;
    box-shadow: 0 8px 48px rgba(236,72,153,0.1), 0 2px 8px rgba(0,0,0,0.04);
    overflow: hidden;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
  }}

  /* top gradient banner */
  .cert-banner {{
    background: linear-gradient(135deg, #EC4899 0%, #F43F5E 55%, #A855F7 100%);
    padding: 32px 36px 26px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }}

  .cert-banner::before {{
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
  }}

  .cert-banner::after {{
    content: '';
    position: absolute;
    bottom: -60px; left: -30px;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }}

  .cert-seal {{
    width: 72px; height: 72px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    border: 3px solid rgba(255,255,255,0.5);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
    font-size: 34px;
    position: relative; z-index: 1;
  }}

  .cert-platform {{
    font-size: 11px;
    font-weight: 800;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 5px;
    position: relative; z-index: 1;
  }}

  .cert-heading {{
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 30px;
    font-weight: 900;
    color: #fff;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
    position: relative; z-index: 1;
  }}

  .cert-period {{
    font-size: 14px;
    font-weight: 700;
    color: rgba(255,255,255,0.85);
    position: relative; z-index: 1;
  }}

  /* wave divider */
  .wave-divider {{
    display: block;
    width: 100%;
    height: 36px;
    margin-top: -1px;
  }}

  /* worker info block */
  .worker-block {{
    padding: 24px 32px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    border-bottom: 2px solid #FDF2F8;
    background: #FFFBFE;
  }}

  .worker-field {{
    display: flex;
    flex-direction: column;
    gap: 3px;
  }}

  .worker-field .wf-label {{
    font-size: 11px;
    font-weight: 800;
    color: #94A3B8;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }}

  .worker-field .wf-value {{
    font-size: 16px;
    font-weight: 800;
    color: #1E293B;
  }}

  /* summary stats */
  .summary-grid {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    border-bottom: 2px solid #FDF2F8;
  }}

  .summary-card {{
    padding: 22px 20px;
    text-align: center;
    border-right: 2px solid #FDF2F8;
    background: #fff;
  }}

  .summary-card:last-child {{ border-right: none; }}

  .summary-card .sc-icon {{
    font-size: 24px;
    margin-bottom: 8px;
  }}

  .summary-card .sc-value {{
    font-size: 24px;
    font-weight: 900;
    color: #EC4899;
    letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 5px;
  }}

  .summary-card:nth-child(2) .sc-value {{ color: #2563EB; }}
  .summary-card:nth-child(3) .sc-value {{ color: #7C3AED; }}

  .summary-card .sc-label {{
    font-size: 11px;
    font-weight: 800;
    color: #94A3B8;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }}

  /* table */
  .table-wrap {{
    overflow-x: auto;
  }}

  table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }}

  thead tr {{
    background: #FFF1F5;
  }}

  th {{
    padding: 13px 16px;
    text-align: left;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #64748B;
    border-bottom: 2px solid #FBCFE8;
    white-space: nowrap;
  }}

  td {{
    padding: 13px 16px;
    border-bottom: 1.5px solid #FDF2F8;
    color: #334155;
    font-weight: 600;
    font-size: 13px;
  }}

  tbody tr:last-child td {{ border-bottom: none; }}
  tbody tr:nth-child(even) {{ background: #FFFBFE; }}
  tbody tr:hover {{ background: #FDF2F8; }}

  .badge-verified {{
    display: inline-flex; align-items: center; gap: 5px;
    background: #ECFDF5; color: #065F46;
    border: 1.5px solid #6EE7B7;
    padding: 4px 11px; border-radius: 20px;
    font-size: 11px; font-weight: 800;
  }}

  .badge-pending {{
    display: inline-flex; align-items: center; gap: 5px;
    background: #FFFBEB; color: #78350F;
    border: 1.5px solid #FCD34D;
    padding: 4px 11px; border-radius: 20px;
    font-size: 11px; font-weight: 800;
  }}

  .badge-disputed {{
    display: inline-flex; align-items: center; gap: 5px;
    background: #FEF2F2; color: #7F1D1D;
    border: 1.5px solid #FCA5A5;
    padding: 4px 11px; border-radius: 20px;
    font-size: 11px; font-weight: 800;
  }}

  /* footer strip */
  .cert-footer-strip {{
    background: #FFF1F5;
    border-top: 2px solid #FBCFE8;
    padding: 14px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }}

  .lock-badge {{
    display: flex; align-items: center; gap: 7px;
    font-size: 12px; font-weight: 800; color: #64748B;
  }}

  /* disclaimer */
  .disclaimer {{
    background: #fff;
    border: 2px solid #FCD34D;
    border-radius: 16px;
    padding: 16px 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    position: relative; z-index: 1;
  }}

  .disclaimer .disc-icon {{
    font-size: 22px; flex-shrink: 0; margin-top: 1px;
  }}

  .disclaimer p {{
    font-size: 13px;
    color: #78350F;
    font-weight: 700;
    line-height: 1.65;
  }}

  .disclaimer p strong {{ color: #451A03; }}

  /* page footer */
  .page-footer {{
    text-align: center;
    font-size: 12px;
    color: #94A3B8;
    font-weight: 700;
    padding-top: 4px;
    position: relative; z-index: 1;
    letter-spacing: 0.03em;
  }}

  .page-footer span {{ color: #EC4899; }}
</style>
</head>
<body>

<!-- floating decorations -->
<div class="floatie" style="top:3%;left:1%;animation-delay:0s;animation-duration:6s;">🌸</div>
<div class="floatie" style="top:7%;right:2%;animation-delay:1.2s;animation-duration:8s;">💗</div>
<div class="floatie" style="top:25%;left:0%;animation-delay:2s;animation-duration:7s;">🌺</div>
<div class="floatie" style="top:45%;right:1%;animation-delay:0.5s;animation-duration:9s;">✨</div>
<div class="floatie" style="top:65%;left:1%;animation-delay:3s;animation-duration:6.5s;">💐</div>
<div class="floatie" style="top:80%;right:2%;animation-delay:1.8s;animation-duration:7.5s;">🌷</div>
<div class="floatie" style="bottom:5%;left:4%;animation-delay:2.5s;animation-duration:5.5s;">🫧</div>

<div class="shell">

  <!-- print button -->
  <button class="print-btn no-print" onclick="window.print()">
    🖨️ Print / Save as PDF
  </button>

  <!-- ── MAIN CERTIFICATE CARD ── -->
  <div class="cert-card">

    <!-- banner -->
    <div class="cert-banner">
      <div class="cert-seal">🏅</div>
      <div class="cert-platform">FairGig · Worker Income Platform</div>
      <div class="cert-heading">Certificate of Income</div>
      <div class="cert-period">📅 {date_from} &rarr; {date_to}</div>
    </div>

    <!-- wave -->
    <svg class="wave-divider" viewBox="0 0 860 36" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,0 C215,36 645,0 860,36 L860,0 Z" fill="url(#waveGrad)"/>
      <defs>
        <linearGradient id="waveGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stop-color="#EC4899"/>
          <stop offset="55%" stop-color="#F43F5E"/>
          <stop offset="100%" stop-color="#A855F7"/>
        </linearGradient>
      </defs>
    </svg>

    <!-- worker info -->
    <div class="worker-block">
      <div class="worker-field">
        <span class="wf-label">👤 Worker Name</span>
        <span class="wf-value">{worker_name}</span>
      </div>
      <div class="worker-field">
        <span class="wf-label">🪪 Worker ID</span>
        <span class="wf-value" style="font-size:13px;color:#64748B;font-family:monospace;">{worker_id}</span>
      </div>
      <div class="worker-field">
        <span class="wf-label">📅 Certificate Period</span>
        <span class="wf-value">{date_from} → {date_to}</span>
      </div>
      <div class="worker-field">
        <span class="wf-label">🕐 Generated On</span>
        <span class="wf-value" style="font-size:14px;">{generated_at}</span>
      </div>
    </div>

    <!-- summary stats -->
    <div class="summary-grid">
      <div class="summary-card">
        <div class="sc-icon">💰</div>
        <div class="sc-value">PKR {total_net:,.0f}</div>
        <div class="sc-label">Total Net Earnings</div>
      </div>
      <div class="summary-card">
        <div class="sc-icon">✅</div>
        <div class="sc-value">{total_shifts}</div>
        <div class="sc-label">Verified Shifts</div>
      </div>
      <div class="summary-card">
        <div class="sc-icon">📈</div>
        <div class="sc-value">PKR {avg_per_shift:,.0f}</div>
        <div class="sc-label">Avg. per Shift</div>
      </div>
    </div>

    <!-- shift table -->
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>📅 Date</th>
            <th>📱 Platform</th>
            <th>⏱ Hours</th>
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

    <!-- footer strip -->
    <div class="cert-footer-strip">
      <div class="lock-badge">
        🔒 Digitally verified by FairGig · Valid for official use
      </div>
      <div style="font-size:11px;color:#94A3B8;font-weight:800;letter-spacing:0.05em;">
        FAST-NU SOFTEC 2026
      </div>
    </div>

  </div>
  <!-- end cert-card -->

  <!-- disclaimer -->
  <div class="disclaimer">
    <span class="disc-icon">⚠️</span>
    <p>
      <strong>Important Notice:</strong> This certificate is generated from self-reported earnings
      verified through the FairGig platform. Verified entries have been reviewed by a FairGig verifier
      against platform screenshots. This document is intended for use with
      <strong>landlords, microfinance institutions, and informal credit assessments</strong>.
    </p>
  </div>

  <!-- page footer -->
  <div class="page-footer">
    FairGig &middot; FAST-NU SOFTEC 2026 &middot; Generated <span>{generated_at}</span>
  </div>

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