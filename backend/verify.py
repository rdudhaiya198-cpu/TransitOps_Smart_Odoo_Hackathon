import sys
import os

# Try importing the components
try:
    print("Attempting to import main app...")
    from main import app
    print("Successfully imported main app!")
    
    print("\nRegistered routes:")
    for route in app.routes:
        methods = getattr(route, "methods", None)
        print(f"Path: {route.path:35} | Methods: {methods} | Name: {route.name}")
    print("\nImport verification: PASSED")
    sys.exit(0)
except Exception as e:
    import traceback
    print("Error during import verification:")
    traceback.print_exc()
    sys.exit(1)
