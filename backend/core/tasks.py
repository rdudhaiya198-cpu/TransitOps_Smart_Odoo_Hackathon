import asyncio
from core.database import get_supabase
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

async def predictive_maintenance_job():
    """
    Periodically checks vehicles and maintenance logs to generate alerts.
    """
    while True:
        try:
            supabase = get_supabase()
            
            # 1. Check Odometer Thresholds (e.g., Alert if odometer is a multiple of 10,000)
            vehicles_res = supabase.table("vehicles").select("*").execute()
            vehicles = vehicles_res.data
            
            for vehicle in vehicles:
                # Example logic: if odometer > 10000 and no open alert exists
                odometer = vehicle.get("odometer", 0)
                if odometer > 0 and odometer % 10000 < 500: # Close to a 10k interval
                    
                    # Check if an alert already exists for this vehicle in the last 7 days
                    seven_days_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()
                    existing_alerts = supabase.table("alerts").select("id").eq("vehicle_id", vehicle["id"]).eq("type", "Maintenance Required").gte("created_at", seven_days_ago).execute()
                    
                    if not existing_alerts.data:
                        # Create alert
                        supabase.table("alerts").insert({
                            "vehicle_id": vehicle["id"],
                            "type": "Maintenance Required",
                            "severity": "Medium",
                            "message": f"Vehicle {vehicle['registration_number']} is approaching a 10,000 unit odometer milestone (Current: {odometer}). Schedule maintenance."
                        }).execute()
                        logger.info(f"Generated maintenance alert for vehicle {vehicle['id']}")
                        
        except Exception as e:
            logger.error(f"Error in predictive_maintenance_job: {str(e)}")
            
        # Run check every 1 hour (3600 seconds), but for testing we can run it every 60 seconds
        # Using 60s so it triggers during the hackathon demo
        await asyncio.sleep(60)
