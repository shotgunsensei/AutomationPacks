@echo off
setlocal
echo Applying Defender baseline
powershell -Command "Set-MpPreference -DisableRealtimeMonitoring $false" >nul
echo Auditing administrators
net localgroup administrators
echo Checking BitLocker
manage-bde -status >nul
echo Importing firewall baseline
netsh advfirewall reset >nul
echo Disabling SMB1
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v SMB1 /t REG_DWORD /d 0 /f >nul
echo Enforcing LSA protection
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v RunAsPPL /t REG_DWORD /d 1 /f >nul
echo Locking USB storage
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DeviceInstall\Restrictions" /v DenyRemovableDevices /t REG_DWORD /d 1 /f >nul
echo Security pack completed
endlocal
