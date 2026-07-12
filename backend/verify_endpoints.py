import sys
import os
from datetime import date, datetime
from fastapi.testclient import TestClient

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import app
from core.database import get_supabase
from core.security import get_current_user

# Mock User Class
class MockUser:
    def __init__(self, id, email):
        self.id = id
        self.email = email

# Mock database state
DB = {
    "profiles": [
        {"id": "U1", "email": "manager@transitops.com", "role": "Fleet Manager"}
    ],
    "vehicles": [
        {"id": "V1", "registration_number": "REG1", "name_model": "Truck A", "type": "Semi", "max_load_capacity": 10000.0, "odometer": 1000.0, "acquisition_cost": 50000.0, "status": "Available", "created_at": "2026-07-12T12:00:00Z"},
        {"id": "V2", "registration_number": "REG2", "name_model": "Truck B", "type": "Flatbed", "max_load_capacity": 5000.0, "odometer": 2000.0, "acquisition_cost": 30000.0, "status": "Retired", "created_at": "2026-07-12T12:00:00Z"},
        {"id": "V3", "registration_number": "REG3", "name_model": "Truck C", "type": "Box", "max_load_capacity": 8000.0, "odometer": 1500.0, "acquisition_cost": 40000.0, "status": "In Shop", "created_at": "2026-07-12T12:00:00Z"},
        {"id": "V4", "registration_number": "REG4", "name_model": "Truck D", "type": "Reefer", "max_load_capacity": 12000.0, "odometer": 500.0, "acquisition_cost": 60000.0, "status": "On Trip", "created_at": "2026-07-12T12:00:00Z"}
    ],
    "drivers": [
        {"id": "D1", "user_id": None, "name": "Driver A", "license_number": "LIC1", "license_category": "Class A", "license_expiry_date": "2027-12-31", "contact_number": "1234", "safety_score": 100.0, "status": "Available", "created_at": "2026-07-12T12:00:00Z"},
        {"id": "D2", "user_id": None, "name": "Driver B", "license_number": "LIC2", "license_category": "Class B", "license_expiry_date": "2028-12-31", "contact_number": "5678", "safety_score": 90.0, "status": "Suspended", "created_at": "2026-07-12T12:00:00Z"},
        {"id": "D3", "user_id": None, "name": "Driver C", "license_number": "LIC3", "license_category": "Class A", "license_expiry_date": "2026-12-31", "contact_number": "9012", "safety_score": 95.0, "status": "On Trip", "created_at": "2026-07-12T12:00:00Z"}
    ],
    "trips": [
        {"id": "T1", "vehicle_id": "V4", "driver_id": "D3", "cargo_weight": 5000.0, "status": "Dispatched", "start_location": "A", "destination": "B", "dispatch_time": "2026-07-12T12:00:00Z", "completion_time": None, "created_at": "2026-07-12T12:00:00Z"},
        {"id": "T2", "vehicle_id": "V1", "driver_id": "D1", "cargo_weight": 6000.0, "status": "Scheduled", "start_location": "A", "destination": "B", "dispatch_time": None, "completion_time": None, "created_at": "2026-07-12T12:00:00Z"}
    ],
    "maintenance_logs": [
        {"id": "M1", "vehicle_id": "V3", "description": "Engine check", "start_date": "2026-07-01", "end_date": None, "cost": 500.0, "status": "Open", "created_at": "2026-07-12T12:00:00Z"}
    ],
    "fuel_logs": [
        {"id": "F1", "vehicle_id": "V1", "liters": 100.0, "cost": 150.0, "date": "2026-07-02", "created_at": "2026-07-12T12:00:00Z"}
    ],
    "expenses": [
        {"id": "E1", "vehicle_id": "V1", "driver_id": None, "trip_id": None, "amount": 50.0, "category": "Toll", "description": "Highway toll", "date": "2026-07-02", "created_at": "2026-07-12T12:00:00Z"}
    ]
}

# Mock Result Wrapper
class MockResult:
    def __init__(self, data):
        self.data = data

# Mock Query Builder
class MockQuery:
    def __init__(self, table_name):
        self.table_name = table_name
        self.filters = []
        self.action = None  # select, insert, update, delete
        self.action_data = None

    def select(self, fields="*"):
        self.action = "select"
        self.action_data = fields
        return self

    def insert(self, data):
        self.action = "insert"
        self.action_data = data
        return self

    def update(self, data):
        self.action = "update"
        self.action_data = data
        return self

    def delete(self):
        self.action = "delete"
        return self

    def eq(self, column, value):
        self.filters.append(("eq", column, value))
        return self

    def neq(self, column, value):
        self.filters.append(("neq", column, value))
        return self

    def limit(self, limit_val):
        self.filters.append(("limit", None, limit_val))
        return self

    def execute(self):
        records = DB[self.table_name]
        
        # Apply filters
        filtered_records = records.copy()
        for op, col, val in self.filters:
            if op == "eq":
                filtered_records = [r for r in filtered_records if r.get(col) == val]
            elif op == "neq":
                filtered_records = [r for r in filtered_records if r.get(col) != val]
            elif op == "limit":
                filtered_records = filtered_records[:val]

        if self.action == "select" or self.action is None:
            return MockResult(filtered_records)

        elif self.action == "insert":
            # Helper to apply defaults
            def apply_defaults(item, table):
                res_item = item.copy()
                defaults = {
                    "vehicles": {"status": "Available", "odometer": 0.0, "acquisition_cost": 0.0},
                    "drivers": {"safety_score": 100.0, "status": "Available"},
                    "trips": {"status": "Scheduled", "dispatch_time": None, "completion_time": None},
                    "maintenance_logs": {"cost": 0.0, "status": "Open", "start_date": str(date.today()), "end_date": None},
                    "fuel_logs": {"date": str(date.today())},
                    "expenses": {"date": str(date.today()), "description": "", "vehicle_id": None, "driver_id": None, "trip_id": None}
                }
                table_defaults = defaults.get(table, {})
                for k, v in table_defaults.items():
                    if k not in res_item or res_item[k] is None:
                        res_item[k] = v
                return res_item

            new_data = self.action_data
            if isinstance(new_data, dict):
                new_data = apply_defaults(new_data, self.table_name)
                if "id" not in new_data:
                    new_data["id"] = f"{self.table_name[0].upper()}_NEW_{len(DB[self.table_name]) + 1}"
                if "created_at" not in new_data:
                    new_data["created_at"] = datetime.utcnow().isoformat() + "Z"
                for k, v in new_data.items():
                    if isinstance(v, (date, datetime)):
                        new_data[k] = v.isoformat()
                DB[self.table_name].append(new_data)
                return MockResult([new_data])
            elif isinstance(new_data, list):
                inserted = []
                for item in new_data:
                    item_copy = apply_defaults(item, self.table_name)
                    if "id" not in item_copy:
                        item_copy["id"] = f"{self.table_name[0].upper()}_NEW_{len(DB[self.table_name]) + 1}"
                    if "created_at" not in item_copy:
                        item_copy["created_at"] = datetime.utcnow().isoformat() + "Z"
                    for k, v in item_copy.items():
                        if isinstance(v, (date, datetime)):
                            item_copy[k] = v.isoformat()
                    DB[self.table_name].append(item_copy)
                    inserted.append(item_copy)
                return MockResult(inserted)
            else:
                return MockResult([])

        elif self.action == "update":
            updated = []
            for rec in DB[self.table_name]:
                # check if rec is in the set of filtered records (matched by id)
                matched = False
                for fr in filtered_records:
                    if fr.get("id") == rec.get("id"):
                        matched = True
                        break
                if matched:
                    for k, v in self.action_data.items():
                        if isinstance(v, (date, datetime)):
                            rec[k] = v.isoformat()
                        else:
                            rec[k] = v
                    updated.append(rec)
            return MockResult(updated)

        elif self.action == "delete":
            deleted = []
            # We must remove matched records from DB in-place
            ids_to_delete = {r.get("id") for r in filtered_records}
            DB[self.table_name] = [r for r in DB[self.table_name] if r.get("id") not in ids_to_delete]
            return MockResult(filtered_records)

# Mock Supabase Client
class MockSupabaseClient:
    def table(self, table_name):
        return MockQuery(table_name)

# Dependency overrides
app.dependency_overrides[get_supabase] = lambda: MockSupabaseClient()
app.dependency_overrides[get_current_user] = lambda: MockUser(id="U1", email="manager@transitops.com")

client = TestClient(app)

def run_tests():
    print("====================================================")
    print("STARTING WORKFLOW AND BUSINESS LOGIC TESTS")
    print("====================================================")

    # 1. Test GET /trips/
    print("\n[TEST 1] Listing trips...")
    res = client.get("/trips/")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    trips = res.json()
    assert len(trips) == 2, f"Expected 2 trips, got {len(trips)}"
    print("[OK] Successfully listed trips.")

    # 2. Test POST /trips/ (Create Trip Validation - Cargo Limit)
    print("\n[TEST 2] Creating a trip exceeding vehicle capacity...")
    trip_data = {
        "vehicle_id": "V1", # capacity 10000
        "driver_id": "D1",
        "cargo_weight": 12000.0, # exceeds 10000
        "start_location": "A",
        "destination": "B"
    }
    res = client.post("/trips/", json=trip_data)
    assert res.status_code == 400, f"Expected 400, got {res.status_code}"
    assert "exceeds vehicle max load capacity" in res.json()["detail"]
    print("[OK] Successfully caught cargo weight violation.")

    # 3. Test POST /trips/ (Create Trip Validation - In Shop vehicle)
    print("\n[TEST 3] Creating a trip with an 'In Shop' vehicle...")
    trip_data = {
        "vehicle_id": "V3", # status 'In Shop'
        "driver_id": "D1",
        "cargo_weight": 5000.0,
        "start_location": "A",
        "destination": "B"
    }
    res = client.post("/trips/", json=trip_data)
    assert res.status_code == 400, f"Expected 400, got {res.status_code}"
    assert "is currently 'In Shop'" in res.json()["detail"]
    print("[OK] Successfully caught 'In Shop' vehicle assignment violation.")

    # 4. Test POST /trips/ (Create Trip Validation - Suspended driver)
    print("\n[TEST 4] Creating a trip with a 'Suspended' driver...")
    trip_data = {
        "vehicle_id": "V1",
        "driver_id": "D2", # status 'Suspended'
        "cargo_weight": 5000.0,
        "start_location": "A",
        "destination": "B"
    }
    res = client.post("/trips/", json=trip_data)
    assert res.status_code == 400, f"Expected 400, got {res.status_code}"
    assert "Suspended" in res.json()["detail"]
    print("[OK] Successfully caught 'Suspended' driver assignment violation.")

    # 5. Test POST /trips/ (Create Trip - Success)
    print("\n[TEST 5] Creating a valid trip...")
    trip_data = {
        "vehicle_id": "V1", # capacity 10000, Available
        "driver_id": "D1", # Available
        "cargo_weight": 5000.0,
        "start_location": "A",
        "destination": "B"
    }
    res = client.post("/trips/", json=trip_data)
    if res.status_code != 201:
        print("DEBUG FAILURE RESPONSE:", res.status_code, res.json())
    assert res.status_code == 201, f"Expected 201, got {res.status_code}"
    new_trip = res.json()
    assert new_trip["status"] == "Scheduled"
    trip_id = new_trip["id"]
    print(f"[OK] Valid trip created successfully (ID: {trip_id}).")

    # 6. Test POST /trips/{id}/dispatch
    print("\n[TEST 6] Dispatching the trip...")
    res = client.post(f"/trips/{trip_id}/dispatch")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    dispatched_trip = res.json()
    assert dispatched_trip["status"] == "Dispatched"
    assert dispatched_trip["dispatch_time"] is not None
    
    # Verify vehicle and driver status is updated to 'On Trip'
    v1 = next(v for v in DB["vehicles"] if v["id"] == "V1")
    d1 = next(d for d in DB["drivers"] if d["id"] == "D1")
    assert v1["status"] == "On Trip", f"Expected vehicle status 'On Trip', got {v1['status']}"
    assert d1["status"] == "On Trip", f"Expected driver status 'On Trip', got {d1['status']}"
    print("[OK] Trip dispatched successfully. Vehicle and driver status updated to 'On Trip'.")

    # 7. Test POST /trips/{id}/complete
    print("\n[TEST 7] Completing the trip...")
    res = client.post(f"/trips/{trip_id}/complete")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    completed_trip = res.json()
    assert completed_trip["status"] == "Completed"
    assert completed_trip["completion_time"] is not None

    # Verify vehicle and driver status is updated to 'Available'
    assert v1["status"] == "Available", f"Expected vehicle status 'Available', got {v1['status']}"
    assert d1["status"] == "Available", f"Expected driver status 'Available', got {d1['status']}"
    print("[OK] Trip completed successfully. Vehicle and driver status restored to 'Available'.")

    # 8. Test Cancel Trip (dispatched trip)
    print("\n[TEST 8] Creating, dispatching, and cancelling a trip...")
    res = client.post("/trips/", json=trip_data)
    new_trip_2 = res.json()
    trip_id_2 = new_trip_2["id"]
    client.post(f"/trips/{trip_id_2}/dispatch")
    
    # Cancel it
    res = client.post(f"/trips/{trip_id_2}/cancel")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    cancelled_trip = res.json()
    assert cancelled_trip["status"] == "Cancelled"

    # Verify vehicle and driver status is updated back to 'Available'
    assert v1["status"] == "Available", f"Expected vehicle status 'Available', got {v1['status']}"
    assert d1["status"] == "Available", f"Expected driver status 'Available', got {d1['status']}"
    print("[OK] Trip cancelled successfully. Vehicle and driver status restored to 'Available'.")

    # 9. Test Maintenance Open and Close
    print("\n[TEST 9] Sending a vehicle to the maintenance shop...")
    maint_data = {
        "vehicle_id": "V1",
        "description": "Brake pad replacement",
        "cost": 150.0
    }
    res = client.post("/maintenance", json=maint_data)
    assert res.status_code == 201, f"Expected 201, got {res.status_code}"
    m_log = res.json()
    assert m_log["status"] == "Open"
    m_log_id = m_log["id"]

    # Verify vehicle status is updated to 'In Shop'
    assert v1["status"] == "In Shop", f"Expected vehicle status 'In Shop', got {v1['status']}"
    print("[OK] Vehicle logged for maintenance successfully. Vehicle status updated to 'In Shop'.")

    print("\n[TEST 10] Closing the maintenance log...")
    close_data = {
        "cost": 200.0,
        "end_date": "2026-07-12"
    }
    res = client.put(f"/maintenance/{m_log_id}/close", json=close_data)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    closed_log = res.json()
    assert closed_log["status"] == "Closed"
    assert closed_log["cost"] == 200.0

    # Verify vehicle status is updated to 'Available'
    assert v1["status"] == "Available", f"Expected vehicle status 'Available', got {v1['status']}"
    print("[OK] Maintenance closed successfully. Vehicle status restored to 'Available'.")

    # 10. Test Fuel Logs & General Expenses
    print("\n[TEST 11] Recording fuel log...")
    fuel_data = {
        "vehicle_id": "V1",
        "liters": 80.0,
        "cost": 120.0,
        "date": "2026-07-12"
    }
    res = client.post("/fuel-logs", json=fuel_data)
    assert res.status_code == 201, f"Expected 201, got {res.status_code}"
    print("[OK] Fuel log recorded successfully.")

    print("\n[TEST 12] Recording general expense...")
    expense_data = {
        "vehicle_id": "V1",
        "amount": 40.0,
        "category": "Toll",
        "description": "Bridge toll",
        "date": "2026-07-12"
    }
    res = client.post("/expenses/", json=expense_data)
    assert res.status_code == 201, f"Expected 201, got {res.status_code}"
    print("[OK] General expense recorded successfully.")

    # 11. Test Dashboard KPIs
    print("\n[TEST 13] Fetching Dashboard KPIs...")
    res = client.get("/dashboard/kpis")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    kpis = res.json()
    
    assert kpis["total_operational_costs"] == 1060.0, f"Expected 1060.0, got {kpis['total_operational_costs']}"
    print(f"Dashboard KPIs: {kpis}")
    print("[OK] Dashboard KPIs calculations verified successfully.")

    # 12. Test Export endpoints
    print("\n[TEST 14] Exporting trips CSV...")
    res = client.get("/trips/export/csv")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    assert res.headers["content-type"] == "text/csv; charset=utf-8"
    assert "trips.csv" in res.headers["content-disposition"]
    print("[OK] Trips CSV export verified.")

    print("\n[TEST 15] Exporting trips PDF...")
    res = client.get("/trips/export/pdf")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    assert res.headers["content-type"] == "application/pdf"
    print("[OK] Trips PDF export verified.")

    print("\n[TEST 16] Exporting expenses CSV...")
    res = client.get("/expenses/export/csv")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    assert res.headers["content-type"] == "text/csv; charset=utf-8"
    print("[OK] Expenses CSV export verified.")

    print("\n[TEST 17] Exporting expenses PDF...")
    res = client.get("/expenses/export/pdf")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    assert res.headers["content-type"] == "application/pdf"
    print("[OK] Expenses PDF export verified.")

    print("\n====================================================")
    print("ALL WORKFLOW AND BUSINESS LOGIC TESTS PASSED!")
    print("====================================================")

if __name__ == "__main__":
    run_tests()
