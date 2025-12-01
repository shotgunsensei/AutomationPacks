@echo off
setlocal enabledelayedexpansion
set ACTION=%1
if "%ACTION%"=="" set ACTION=ALL

call :ClearTemp
call :DiskCleanup
call :DisableStartup
call :OptimizeDisks
call :ResetStore
call :TuneServices
call :PruneShadow
call :Telemetry
call :Done
exit /b

:ClearTemp
if /I not "%ACTION%"=="ALL" if /I not "%ACTION%"=="ClearTemp" goto :eof
for /d %%U in ("C:\\Users\\*") do (
  del /q /f /s "%%U\\AppData\\Local\\Temp\\*" 2>nul
)
echo Temp cleared
if /I "%ACTION%"=="ClearTemp" goto :Done
exit /b

:DiskCleanup
if /I not "%ACTION%"=="ALL" if /I not "%ACTION%"=="DiskCleanup" goto :eof
cleanmgr /sagerun:19
if /I "%ACTION%"=="DiskCleanup" goto :Done
exit /b

:DisableStartup
if /I not "%ACTION%"=="ALL" if /I not "%ACTION%"=="DisableStartup" goto :eof
schtasks /Delete /TN "GoogleUpdateTaskMachineUA" /F 2>nul
if /I "%ACTION%"=="DisableStartup" goto :Done
exit /b

:OptimizeDisks
if /I not "%ACTION%"=="ALL" if /I not "%ACTION%"=="OptimizeDisks" goto :eof
defrag C: /O
if /I "%ACTION%"=="OptimizeDisks" goto :Done
exit /b

:ResetStore
if /I not "%ACTION%"=="ALL" if /I not "%ACTION%"=="ResetStore" goto :eof
wsreset.exe
if /I "%ACTION%"=="ResetStore" goto :Done
exit /b

:TuneServices
if /I not "%ACTION%"=="ALL" if /I not "%ACTION%"=="TuneServices" goto :eof
sc config DiagTrack start= demand
if /I "%ACTION%"=="TuneServices" goto :Done
exit /b

:PruneShadow
if /I not "%ACTION%"=="ALL" if /I not "%ACTION%"=="PruneShadow" goto :eof
vssadmin delete shadows /oldest /quiet
if /I "%ACTION%"=="PruneShadow" goto :Done
exit /b

:Telemetry
if /I not "%ACTION%"=="ALL" if /I not "%ACTION%"=="Telemetry" goto :eof
reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /t REG_DWORD /d 0 /f
if /I "%ACTION%"=="Telemetry" goto :Done
exit /b

:Done
echo Completed %ACTION%
exit /b
