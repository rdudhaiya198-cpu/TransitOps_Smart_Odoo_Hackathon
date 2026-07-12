import os
import sqlite3
import uuid
from datetime import datetime
from supabase import create_client, Client
from .config import settings

# Custom response classes to mock Supabase client behavior
class SupabaseResponse:
    def __init__(self, data):
        self.data = data

class SupabaseUser:
    def __init__(self, id, email):
        self.id = id
        self.email = email

class SupabaseUserResponse:
    def __init__(self, user):
        self.user = user

class SupabaseSession:
    def __init__(self, access_token):
        self.access_token = access_token

class SupabaseAuthResponse:
    def __init__(self, session, user):
        self.session = session
        self.user = user

class SQLiteQuery:
    def __init__(self, db_path, table_name):
        self.db_path = db_path
        self.table_name = table_name
        self.select_columns = "*"
        self.filters = []
        self.insert_data = None
        self.update_data = None
        self.is_delete = False

    def select(self, cols="*"):
        self.select_columns = cols
        return self

    def eq(self, column, value):
        self.filters.append((column, "=", value))
        return self

    def insert(self, data):
        self.insert_data = data
        return self

    def update(self, data):
        self.update_data = data
        return self

    def delete(self):
        self.is_delete = True
        return self

    def execute(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        result_data = []

        try:
            if self.insert_data is not None:
                # Handle single dictionary insert vs list of dictionaries
                records = self.insert_data if isinstance(self.insert_data, list) else [self.insert_data]
                inserted_records = []
                
                for record in records:
                    rec = dict(record)
                    if "id" not in rec or not rec["id"]:
                        rec["id"] = str(uuid.uuid4())
                    if "created_at" not in rec:
                        rec["created_at"] = datetime.utcnow().isoformat()
                        
                    keys = list(rec.keys())
                    placeholders = ", ".join(["?"] * len(keys))
                    sql = f"INSERT INTO {self.table_name} ({', '.join(keys)}) VALUES ({placeholders})"
                    cursor.execute(sql, list(rec.values()))
                    
                    # Fetch back the inserted record
                    cursor.execute(f"SELECT * FROM {self.table_name} WHERE id = ?", (rec["id"],))
                    row = cursor.fetchone()
                    if row:
                        inserted_records.append(dict(row))
                        
                conn.commit()
                result_data = inserted_records

            elif self.update_data is not None:
                # Build SET clause
                set_keys = list(self.update_data.keys())
                set_clause = ", ".join([f"{k} = ?" for k in set_keys])
                sql = f"UPDATE {self.table_name} SET {set_clause}"
                params = list(self.update_data.values())
                
                # Build WHERE clause
                if self.filters:
                    where_clause = " AND ".join([f"{col} {op} ?" for col, op, val in self.filters])
                    sql += f" WHERE {where_clause}"
                    params.extend([val for col, op, val in self.filters])
                    
                # Fetch targets first to return them as updated records
                select_sql = f"SELECT * FROM {self.table_name}"
                select_params = []
                if self.filters:
                    select_sql += f" WHERE {where_clause}"
                    select_params = [val for col, op, val in self.filters]
                
                cursor.execute(select_sql, select_params)
                affected_ids = [dict(row)["id"] for row in cursor.fetchall()]
                
                cursor.execute(sql, params)
                conn.commit()
                
                # Fetch final updated rows
                updated_records = []
                for aid in affected_ids:
                    cursor.execute(f"SELECT * FROM {self.table_name} WHERE id = ?", (aid,))
                    row = cursor.fetchone()
                    if row:
                        updated_records.append(dict(row))
                        
                result_data = updated_records

            elif self.is_delete:
                # Fetch targets first to return them
                sql = f"DELETE FROM {self.table_name}"
                params = []
                where_clause = ""
                if self.filters:
                    where_clause = " AND ".join([f"{col} {op} ?" for col, op, val in self.filters])
                    sql += f" WHERE {where_clause}"
                    params = [val for col, op, val in self.filters]
                    
                select_sql = f"SELECT * FROM {self.table_name}"
                if self.filters:
                    select_sql += f" WHERE {where_clause}"
                    
                cursor.execute(select_sql, params)
                deleted_records = [dict(row) for row in cursor.fetchall()]
                
                cursor.execute(sql, params)
                conn.commit()
                result_data = deleted_records

            else:
                # SELECT query
                sql = f"SELECT {self.select_columns} FROM {self.table_name}"
                params = []
                if self.filters:
                    where_clause = " AND ".join([f"{col} {op} ?" for col, op, val in self.filters])
                    sql += f" WHERE {where_clause}"
                    params = [val for col, op, val in self.filters]
                    
                cursor.execute(sql, params)
                result_data = [dict(row) for row in cursor.fetchall()]

        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

        return SupabaseResponse(result_data)

class SQLiteAuth:
    def __init__(self, db_path):
        self.db_path = db_path

    def sign_up(self, credentials):
        email = credentials.get("email")
        password = credentials.get("password")
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT id FROM auth_users WHERE email = ?", (email,))
            if cursor.fetchone():
                raise Exception("User already registered")
                
            user_id = str(uuid.uuid4())
            cursor.execute("INSERT INTO auth_users (id, email, password) VALUES (?, ?, ?)", (user_id, email, password))
            conn.commit()
            
            user = SupabaseUser(user_id, email)
            return SupabaseUserResponse(user)
        finally:
            conn.close()

    def sign_in_with_password(self, credentials):
        email = credentials.get("email")
        password = credentials.get("password")
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT id, email, password FROM auth_users WHERE email = ?", (email,))
            row = cursor.fetchone()
            if not row or row[2] != password:
                raise Exception("Invalid credentials")
                
            user_id, user_email, _ = row
            token = f"mock-jwt-token-{user_id}"
            user = SupabaseUser(user_id, user_email)
            session = SupabaseSession(token)
            return SupabaseAuthResponse(session, user)
        finally:
            conn.close()

    def get_user(self, token):
        if not token.startswith("mock-jwt-token-"):
            raise Exception("Invalid mock token format")
            
        user_id = token.replace("mock-jwt-token-", "")
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT id, email FROM auth_users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            if not row:
                raise Exception("User not found")
                
            user = SupabaseUser(row[0], row[1])
            return SupabaseUserResponse(user)
        finally:
            conn.close()

class SQLiteSupabaseClient:
    def __init__(self, db_path):
        self.db_path = db_path
        self.auth = SQLiteAuth(db_path)

    def table(self, name):
        return SQLiteQuery(self.db_path, name)

# Initialization function for local SQLite database schema
def init_sqlite_db(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Auth Mock Users
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS auth_users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )""")
    
    # 2. Profiles
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL
    )""")
    
    # 3. Vehicles
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS vehicles (
        id TEXT PRIMARY KEY,
        registration_number TEXT UNIQUE NOT NULL,
        name_model TEXT NOT NULL,
        type TEXT NOT NULL,
        max_load_capacity REAL NOT NULL,
        odometer REAL NOT NULL DEFAULT 0,
        acquisition_cost REAL NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'Available',
        created_at TEXT NOT NULL
    )""")
    
    # 4. Drivers
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS drivers (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        name TEXT NOT NULL,
        license_number TEXT UNIQUE NOT NULL,
        license_category TEXT NOT NULL,
        license_expiry_date TEXT NOT NULL,
        contact_number TEXT NOT NULL,
        safety_score REAL DEFAULT 100,
        status TEXT NOT NULL DEFAULT 'Available',
        created_at TEXT NOT NULL
    )""")
    
    # 5. Trips
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY,
        trip_id TEXT UNIQUE,
        vehicle_id TEXT,
        driver_id TEXT,
        source TEXT,
        destination TEXT,
        cargo_weight REAL,
        planned_distance REAL,
        eta TEXT,
        status TEXT NOT NULL DEFAULT 'Draft',
        created_at TEXT NOT NULL
    )""")
    
    # 6. Maintenance Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS maintenance_logs (
        id TEXT PRIMARY KEY,
        vehicle_id TEXT,
        type TEXT,
        cost REAL,
        status TEXT NOT NULL DEFAULT 'Active',
        start_date TEXT,
        end_date TEXT,
        notes TEXT,
        created_at TEXT NOT NULL
    )""")
    
    # 7. Fuel Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS fuel_logs (
        id TEXT PRIMARY KEY,
        vehicle_id TEXT,
        liters REAL,
        cost REAL,
        log_date TEXT,
        created_at TEXT NOT NULL
    )""")
    
    # 8. Expenses
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        vehicle_id TEXT,
        trip_id TEXT,
        type TEXT,
        amount REAL,
        date TEXT,
        notes TEXT,
        created_at TEXT NOT NULL
    )""")
    
    conn.commit()
    conn.close()

def get_supabase():
    # Check if credentials exist, otherwise load SQLite
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        # Fallback to local SQLite database
        db_path = settings.SQLITE_DB_PATH
        init_sqlite_db(db_path)
        return SQLiteSupabaseClient(db_path)
        
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
