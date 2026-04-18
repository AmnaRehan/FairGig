from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
import httpx, os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="FairGig Analytics Service")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"])

EARNINGS_DB = os.getenv("EARNINGS_DATABASE_URL", "postgresql://postgres:postgres@localhost/fairgig_earnings")
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8000")
engine = create_engine(EARNINGS_DB)

async def require_advocate(authorization: str):
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{AUTH_SERVICE_URL}/auth/verify-token",
            headers={"Authorization": authorization})
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid token")
    data = r.json()
    if data.get("role") not in ["advocate", "verifier"]:
        raise HTTPException(status_code=403, detail="Advocates only")
    return data

@app.get("/analytics/commission-trends")
async def commission_trends(authorization: str = Header(None)):
    await require_advocate(authorization)
    with engine.connect() as conn:
        rows = conn.execute(text("""
            SELECT platform,
                   DATE_TRUNC('week', shift_date) AS week,
                   AVG(platform_deductions / NULLIF(gross_earned, 0) * 100) AS avg_commission_pct,
                   COUNT(*) AS shift_count
            FROM earnings_logs
            WHERE gross_earned > 0
            GROUP BY platform, week
            ORDER BY week DESC
            LIMIT 100
        """)).fetchall()
    return [{"platform": r[0], "week": str(r[1]), "avg_commission_pct": round(float(r[2] or 0), 2), "shift_count": r[3]} for r in rows]

@app.get("/analytics/income-by-city")
async def income_by_city(authorization: str = Header(None)):
    await require_advocate(authorization)
    with engine.connect() as conn:
        rows = conn.execute(text("""
            SELECT city,
                   COUNT(DISTINCT worker_id) AS worker_count,
                   AVG(net_received) AS avg_net_per_shift,
                   PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY net_received) AS median_net,
                   AVG(net_received / NULLIF(hours_worked, 0)) AS avg_hourly
            FROM earnings_logs
            WHERE city IS NOT NULL AND city != ''
            GROUP BY city
            ORDER BY worker_count DESC
        """)).fetchall()
    return [{"city": r[0], "worker_count": r[1], "avg_net_per_shift": round(float(r[2] or 0), 2),
             "median_net": round(float(r[3] or 0), 2), "avg_hourly": round(float(r[4] or 0), 2)} for r in rows]

@app.get("/analytics/vulnerability-flags")
async def vulnerability_flags(authorization: str = Header(None)):
    await require_advocate(authorization)
    with engine.connect() as conn:
        rows = conn.execute(text("""
            WITH monthly AS (
                SELECT worker_id,
                       DATE_TRUNC('month', shift_date) AS month,
                       SUM(net_received) AS monthly_net
                FROM earnings_logs
                GROUP BY worker_id, month
            ),
            ranked AS (
                SELECT worker_id, month, monthly_net,
                       LAG(monthly_net) OVER (PARTITION BY worker_id ORDER BY month) AS prev_month_net
                FROM monthly
            )
            SELECT worker_id, month, monthly_net, prev_month_net,
                   ROUND(((prev_month_net - monthly_net) / NULLIF(prev_month_net, 0) * 100)::numeric, 1) AS drop_pct
            FROM ranked
            WHERE prev_month_net > 0
              AND ((prev_month_net - monthly_net) / prev_month_net * 100) > 20
            ORDER BY drop_pct DESC
            LIMIT 50
        """)).fetchall()
    return [{"worker_id": r[0], "month": str(r[1]), "monthly_net": float(r[2]),
             "prev_month_net": float(r[3]), "drop_pct": float(r[4])} for r in rows]

@app.get("/analytics/city-median/{category}")
async def city_median(category: str, authorization: str = Header(None)):
    """Returns anonymized city-wide median for worker dashboard comparison."""
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{AUTH_SERVICE_URL}/auth/verify-token",
            headers={"Authorization": authorization})
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid token")
    with engine.connect() as conn:
        rows = conn.execute(text("""
            SELECT city,
                   PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY net_received / NULLIF(hours_worked, 0)) AS median_hourly,
                   COUNT(*) AS sample_size
            FROM earnings_logs
            WHERE category = :cat AND hours_worked > 0
            GROUP BY city
            HAVING COUNT(*) >= 5
        """), {"cat": category}).fetchall()
    return [{"city": r[0], "median_hourly_rate": round(float(r[1] or 0), 2), "sample_size": r[2]} for r in rows]

@app.get("/health")
def health():
    return {"status": "ok", "service": "analytics"}
