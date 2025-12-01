@echo off
setlocal
echo Hardware inventory
systeminfo > "%TEMP%\hardware.txt"
echo Software inventory
wmic product get name,version > "%TEMP%\software.txt"
echo Service health
sc query type= service state= all > "%TEMP%\services.txt"
echo Disk SMART
wmic diskdrive get status,model > "%TEMP%\disk.txt"
echo Event digest
wevtutil qe System /c:20 /f:text > "%TEMP%\events.txt"
echo Battery health
powercfg /batteryreport /output "%TEMP%\battery.html" >nul
echo Inventory pack completed
endlocal
