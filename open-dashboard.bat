@echo off
rem Whiteout Survival Dashboard - local review server (Windows)
cd /d "%~dp0"
start "" http://localhost:5173/
python -m http.server 5173
