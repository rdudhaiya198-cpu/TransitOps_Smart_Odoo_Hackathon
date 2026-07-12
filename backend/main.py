from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, vehicles, drivers

app = FastAPI(title="TransitOps API", description="Smart Transport Operations Platform")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8000"], # In production, restrict to frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(drivers.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to TransitOps API"}
