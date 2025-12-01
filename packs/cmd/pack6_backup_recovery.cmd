@echo off
setlocal
echo Checking restore points
vssadmin list shadows > "%TEMP%\shadows.txt"
echo Forcing File History check
fhmanagew.exe -backupnow >nul 2>nul
echo Creating canary file
echo canary>%TEMP%\canary.txt
echo Testing backup target
if exist "\\backupserver\share" echo Target reachable> "%TEMP%\backup_target.txt"
echo Validating recovery environment
reagentc /info > "%TEMP%\recovery.txt"
echo Sample restore copy
copy "%TEMP%\canary.txt" "%TEMP%\restore_test.txt" >nul
echo Backup pack completed
endlocal
