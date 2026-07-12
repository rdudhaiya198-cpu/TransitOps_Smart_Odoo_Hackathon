# TransitOps Smart Odoo Hackathon

## Project Overview

TransitOps is a smart transport operations platform built as a hackathon project. It pairs a Python/FastAPI backend with a React + Vite frontend to manage fleet operations, drivers, trips, maintenance, expenses, and dashboards.

The backend uses Supabase for data and auth integration, while the frontend is a modern React app styled with Tailwind CSS.

## Repository Structure

- `backend/` - FastAPI backend service
  - `main.py` - application entrypoint
  - `requirements.txt` - Python dependencies
  - `core/` - configuration and shared backend utilities
  - `models/` - Pydantic schemas and API routers
  - `routers/` - API route modules for auth, vehicles, drivers, trips, maintenance, expenses, and dashboard
- `frontend/` - React + Vite frontend
  - `package.json` - frontend dependencies and scripts
  - `src/` - React application source files
  - `public/` - static assets
- `start_app.py` - root runner that installs dependencies and launches backend and frontend servers together
- `pyproject.toml` - project metadata

## Tech Stack

- Backend: Python, FastAPI, Uvicorn, Pydantic, Supabase
- Frontend: React, Vite, Tailwind CSS, Lucide icons
- Deployment / Local development: `start_app.py` orchestrates both services

## Prerequisites

- Python 3.12+
- Node.js 18+ / npm
- Git (optional)

## Environment Variables

Create a root `.env` file with the following values:

```env
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_KEY=your-supabase-service-key
FRONTEND_URL=http://localhost:5173
BACKEND_PORT=8000
FRONTEND_PORT=5173
```

> `start_app.py` and the backend configuration both load environment values from the root `.env` file.

## Setup and Run

### Run using `start_app.py`

From the repository root:

```powershell
python start_app.py
```

This script will:

- create `backend/.venv` if missing
- install backend dependencies from `backend/requirements.txt`
- install frontend dependencies in `frontend/`
- start the FastAPI backend and Vite frontend together

### Manual Backend Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### Manual Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

## Local URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

## API Modules

The backend exposes routers for:

- Authentication
- Vehicles
- Drivers
- Trips
- Maintenance
- Expenses
- Dashboard KPIs

## Notes

- The backend is configured with CORS to allow the frontend origin and local development URLs.
- The frontend is built with React 19 and Tailwind CSS 4.
- Supabase is used to store and authenticate application data.

## Helpful Commands

- `python start_app.py` - install dependencies and launch both servers
- `cd backend && .\.venv\Scripts\activate && uvicorn main:app --reload --port 8000` - run backend only
- `cd frontend && npm run dev` - run frontend only

## License

This project is licensed under the terms defined by the hackathon or your organization.
