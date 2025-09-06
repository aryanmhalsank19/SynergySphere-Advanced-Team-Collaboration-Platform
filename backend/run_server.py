#!/usr/bin/env python
"""
SynergySphere Backend Server
Run this script to start the Django development server
"""
import os
import sys
import subprocess

def main():
    """Run the Django development server"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'synergy.settings')
    
    # Run migrations first
    print("Running database migrations...")
    subprocess.run([sys.executable, 'manage.py', 'makemigrations'], check=True)
    subprocess.run([sys.executable, 'manage.py', 'migrate'], check=True)
    
    # Create superuser if needed (optional)
    # subprocess.run([sys.executable, 'manage.py', 'createsuperuser', '--noinput'], check=False)
    
    print("Starting SynergySphere backend server...")
    print("Server will be available at: http://127.0.0.1:8000")
    print("API endpoints available at: http://127.0.0.1:8000/api/")
    print("Admin panel available at: http://127.0.0.1:8000/admin/")
    print("\nPress Ctrl+C to stop the server\n")
    
    # Start the server
    subprocess.run([sys.executable, 'manage.py', 'runserver', '127.0.0.1:8000'])

if __name__ == '__main__':
    main()