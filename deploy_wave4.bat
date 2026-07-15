@echo off
cd /d "C:\Users\suhae\.gemini\antigravity\scratch\whiteout-survival-dashboard"
echo ==== PUSH ==== > scratch\deploy_wave4_log.txt 2>&1
git push origin HEAD >> scratch\deploy_wave4_log.txt 2>&1
echo ==== DEPLOY ==== >> scratch\deploy_wave4_log.txt 2>&1
call npx --yes vercel --prod --yes >> scratch\deploy_wave4_log.txt 2>&1
echo ==== DONE exit %errorlevel% ==== >> scratch\deploy_wave4_log.txt 2>&1
