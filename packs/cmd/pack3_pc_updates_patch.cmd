@echo off
setlocal
echo Resetting update services
net stop wuauserv >nul 2>nul
net stop bits >nul 2>nul
net stop cryptsvc >nul 2>nul
ren %WINDIR%\SoftwareDistribution SoftwareDistribution.bak 2>nul
ren %WINDIR%\System32\catroot2 catroot2.bak 2>nul
net start wuauserv >nul
net start bits >nul
net start cryptsvc >nul
echo Running DISM and SFC
Dism /Online /Cleanup-Image /RestoreHealth >nul
sfc /scannow >nul
echo Triggering update detection
wuauclt /detectnow >nul
UsoClient StartScan >nul
reg query "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\WindowsUpdate\\Auto Update\\RebootRequired" >nul 2>nul && echo Pending reboot detected
schtasks /Create /TN "PatchWindow" /TR "UsoClient StartInstall" /SC DAILY /ST 03:00 /F >nul
echo Update pack completed
endlocal
