import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import auth, vehicles, drivers, trips, maintenance, expenses, analytics

app = FastAPI(title="TransitOps API", description="Smart Transport Operations Platform")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(drivers.router)
app.include_router(trips.router)
app.include_router(maintenance.router)
app.include_router(expenses.router)
app.include_router(analytics.router)

# Mount static files to serve the frontend
current_dir = os.path.dirname(os.path.abspath(__file__))
frontend_dir = os.path.normpath(os.path.join(current_dir, "..", "..", "frontend", "public"))

# Ensure static files directory exists (create basic paths if needed)
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="static")
else:
    @app.get("/")
    def read_root():
        return {"message": "Welcome to TransitOps API (Warning: Static frontend directory not found)"}

