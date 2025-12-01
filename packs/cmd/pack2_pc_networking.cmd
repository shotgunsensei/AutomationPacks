@echo off
setlocal
echo Resetting network stack
ipconfig /release >nul
ipconfig /flushdns >nul
netsh winsock reset >nul
netsh int ip reset >nul
echo Cleaning WLAN profiles
for /f "tokens=2 delims=:" %%p in ('netsh wlan show profiles ^| findstr /c":"') do netsh wlan delete profile name="%%p" >nul
echo Ensuring interfaces enabled
netsh interface set interface name="Ethernet" admin=ENABLED >nul 2>nul
echo Resetting firewall and proxy
netsh advfirewall reset >nul
netsh winhttp reset proxy >nul
echo Rebuilding VPN phonebook
set pbk=%APPDATA%\Microsoft\Network\Connections\Pbk\rasphone.pbk
if exist "%pbk%" del /f /q "%pbk%"
echo Removing stale routes
route -f >nul
echo NetBIOS refresh
nbtstat -R >nul
nbtstat -RR >nul
echo Running latency tests
ping -n 2 1.1.1.1 >nul
tracert -d -h 5 8.8.8.8 >nul
echo Networking pack completed
endlocal
