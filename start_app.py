import os
import subprocess
import sys
import time

def run_command(command, cwd=None, shell=True):
    print(f"[*] Running: {command} in {cwd or os.getcwd()}")
    result = subprocess.run(command, cwd=cwd, shell=shell)
    if result.returncode != 0:
        print(f"[!] Command failed with exit code {result.returncode}")
    return result

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")
    frontend_dir = os.path.join(root_dir, "frontend")
    
    print("="*50)
    print("TransitOps Setup & Runner")
    print("="*50)
    
    # ---------------------------------------------------------
    # 1. Backend Setup
    # ---------------------------------------------------------
    venv_dir = os.path.join(backend_dir, ".venv")
    
    if sys.platform == "win32":
        python_exec = os.path.join(venv_dir, "Scripts", "python.exe")
        pip_exec = os.path.join(venv_dir, "Scripts", "pip.exe")
    else:
        python_exec = os.path.join(venv_dir, "bin", "python")
        pip_exec = os.path.join(venv_dir, "bin", "pip")

    if not os.path.exists(venv_dir):
        print("\n=> Creating Python virtual environment...")
        run_command(f'"{sys.executable}" -m venv .venv', cwd=backend_dir)
        
    print("\n=> Installing backend dependencies...")
    run_command(f'"{pip_exec}" install -r requirements.txt', cwd=backend_dir)
    
    # ---------------------------------------------------------
    # 2. Frontend Setup
    # ---------------------------------------------------------
    print("\n=> Installing frontend dependencies...")
    run_command("npm install", cwd=frontend_dir)
    
    # ---------------------------------------------------------
    # 3. Start Both Servers
    # ---------------------------------------------------------
    print("\n=> Starting Backend (FastAPI) and Frontend (Vite) servers...")
    
    backend_cmd = [python_exec, "-m", "uvicorn", "main:app", "--reload"]
    # We use shell=True for npm to let it resolve in the environment properly on Windows
    frontend_cmd = "npm run dev"
    
    backend_process = subprocess.Popen(backend_cmd, cwd=backend_dir)
    frontend_process = subprocess.Popen(frontend_cmd, cwd=frontend_dir, shell=True)
    
    print("\n" + "="*50)
    print("Services are up and running!")
    print("Frontend: http://localhost:5173")
    print("Backend API: http://localhost:8000")
    print("Press Ctrl+C to stop both servers.")
    print("="*50 + "\n")
    
    try:
        # Keep main thread alive while subprocesses run
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[!] Ctrl+C detected. Shutting down servers gracefully...")
        
        # Terminate backend
        backend_process.terminate()
        
        # Terminate frontend (Using taskkill on Windows to kill the entire process tree)
        if sys.platform == "win32":
            subprocess.run(f"taskkill /F /T /PID {frontend_process.pid}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            frontend_process.terminate()
            
        backend_process.wait()
        
        print("[*] Both servers have been stopped. Goodbye!")

if __name__ == "__main__":
    main()
