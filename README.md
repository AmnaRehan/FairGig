# FairGig

FairGig is a multi-service platform for gig workers in Pakistan to track income, verify shifts, detect anomalies, raise grievances, and generate income certificates.

It includes:

- A React frontend for workers, verifiers, and advocates
- Python FastAPI microservices for auth, earnings, anomaly detection, analytics, and certificates
- A Node.js grievance service

## Live Links

Frontend live link: add your deployed frontend URL here

Live API services currently configured in the frontend:

- Auth Service: https://fairgig-auth-ssmf.onrender.com
- Earnings Service: https://fairgig-earnings-o88z.onrender.com
- Anomaly Service: https://fairgig-anamoly.onrender.com
- Grievance Service: https://fairgig-grievance-ouua.onrender.com
- Analytics Service: https://fairgig-analytics-4akf.onrender.com
- Certificate Service: https://fairgig-certificate-1pnk.onrender.com

## Core Features

- Role-based access for Worker, Verifier, and Advocate
- Shift logging with gross, deductions, and net calculations
- Verification workflow for submitted shifts
- Bulk CSV import for earnings
- Anomaly detection on worker earnings trends
- Grievance board for complaints and advocate responses
- Income certificate generation for selected date ranges

## Project Structure

```
FairGig/
	frontend/                     # React + Vite frontend
	services/
		auth_service/               # FastAPI JWT auth and role management
		earnings_service/           # FastAPI earnings and verification APIs
		anamoly_service/            # FastAPI anomaly detection APIs
		analytics_service/          # FastAPI analytics endpoints
		certificate_service/        # FastAPI certificate generation
		grievance_service/          # Express grievance APIs
	database/
		schema.sql
	seed/
```

## Tech Stack

Frontend:

- React 19
- React Router
- Axios
- Recharts
- Vite

Backend:

- FastAPI (Python services)
- Express (Node grievance service)
- PostgreSQL (service-specific databases)

## Local Development Setup

### 1) Clone the repository

```bash
git clone https://github.com/SlippinZubair007/FairGig.git
cd FairGig
```

### 2) Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on Vite default port 5173 unless changed.

### 3) Python services setup

For each Python service directory under services (auth_service, earnings_service, anamoly_service, analytics_service, certificate_service):

```bash
cd services/<service_name>
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port <port>
```

Recommended local ports:

- auth_service: 8000
- earnings_service: 8001
- anamoly_service: 8002
- analytics_service: 8003
- certificate_service: 8004

### 4) Grievance service setup

```bash
cd services/grievance_service
npm install
npm run dev
```

Default grievance service port is 3001.

## Environment Notes

- Configure database and JWT secrets per service using local .env files
- Ensure CORS allows your frontend origin for all services
- The frontend currently points to deployed Render services in frontend/src/api/config.ts
- To run fully local, switch those base URLs to localhost endpoints

## API Service Responsibilities

- Auth Service: registration, login, JWT token validation, user profile
- Earnings Service: create/read earnings, verification state, CSV bulk import
- Anomaly Service: statistical anomaly detection on earnings patterns
- Analytics Service: aggregate trends (platform commission, city income, vulnerability)
- Grievance Service: post and manage worker complaints
- Certificate Service: generate printable income certificates

## Scripts Overview

Frontend:

- npm run dev
- npm run build
- npm run preview

Grievance service:

- npm run dev
- npm run start

## Deployment

Backend services are deployed independently (Render endpoints listed above).

For frontend deployment, you can use Vercel, Netlify, or Render Static Site and then update:

- Frontend live link in this README
- API base URLs in frontend/src/api/config.ts if needed

## Team / Project Context

FairGig is designed as a practical worker-first platform focused on transparency and rights protection for gig economy workers.

## License

Add your preferred license here (MIT, Apache-2.0, etc.).

