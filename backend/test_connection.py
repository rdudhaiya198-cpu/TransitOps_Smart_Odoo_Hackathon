import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

if not url or not key:
    print("Error: Missing Supabase credentials in .env file.")
    exit(1)

try:
    print(f"Connecting to Supabase at {url}...")
    supabase: Client = create_client(url, key)
    
    # Test connection by fetching from vehicles table
    print("Testing connection by fetching vehicles...")
    response = supabase.table("vehicles").select("*").limit(1).execute()
    print("Connection successful!")
    print(f"Data retrieved from vehicles table: {response.data}")
except Exception as e:
    print(f"Failed to connect or retrieve data: {e}")
