import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env")

from core.database import get_supabase

def check_tables():
    try:
        supabase = get_supabase()
        print("Connected to Supabase successfully!")
        
        tables = ["profiles", "vehicles", "drivers", "trips", "maintenance_logs", "fuel_logs", "expenses"]
        for table in tables:
            try:
                res = supabase.table(table).select("id").limit(1).execute()
                print(f"Table '{table}': EXISTS (found {len(res.data)} records)")
            except Exception as e:
                print(f"Table '{table}': ERROR/MISSING ({str(e)})")
    except Exception as e:
        print(f"Failed to connect to Supabase: {str(e)}")

if __name__ == "__main__":
    check_tables()
