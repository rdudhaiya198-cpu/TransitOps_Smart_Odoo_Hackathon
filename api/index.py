import sys
import os

# Add the parent directory and backend directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

# Import the FastAPI app instance from backend/main.py
from backend.main import app
