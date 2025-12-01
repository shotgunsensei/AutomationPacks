# Automation Pack Catalog

This catalog outlines six automation sub-topic packs for each main technology (Datto RMM component, PowerShell, CMD, and .PS1). Every pack contains 12 high-value scripts aligned to the sub-topic focus.

## Topics and Sub-topic Packs

### Datto RMM Components

#### Pack 1: PC Clean & Optimization
1. Temp file and cache purge across user profiles.
2. Disk cleanup with log rotation and recycle bin wipe.
3. Startup program audit and disablement for known bloatware.
4. Scheduled defrag/trim based on drive type.
5. Browser cache reset (Chrome/Edge/Firefox) with profile detection.
6. Windows Store cache reset (wsreset) and component repair.
7. Service tuning for background apps (Xbox, OneDrive placeholders, etc.).
8. Pre/post-maintenance system restore point creation.
9. Pagefile optimization and memory dump cleanup.
10. Scheduled task hygiene (remove orphaned vendor updaters).
11. Shadow copy size audit and pruning.
12. Telemetry and advertisement settings reduction.

#### Pack 2: PC Networking
1. Flush/reset DNS resolver cache and reset Winsock/TCP stack.
2. NIC power management tuning to prevent sleep-related drops.
3. IPv6/IPv4 binding validation and remediation.
4. WLAN profile cleanup and preferred network ordering.
5. DHCP vs static audit with compliant enforcement.
6. MTU discovery and optimization per adapter.
7. Firewall profile sanity check and repair to policy.
8. Proxy/WPAD detection and reset to default policy.
9. VPN adapter detection and repair (rasphone/rasdial configs).
10. Route table cleanup of stale static routes.
11. NetBIOS name resolution and LMHOSTS hygiene.
12. Network latency and throughput synthetic test with logging.

#### Pack 3: PC Updates & Patch Hygiene
1. Windows Update cache reset (SoftwareDistribution/Catroot2).
2. Pending reboot detection with remediation workflow.
3. Feature update readiness check (disk, drivers, blockers).
4. Cumulative update install with pre-checks and rollback point.
5. .NET and Visual C++ redistributable validation/repair.
6. Driver update scan for network/display/storage vendors.
7. Delivery Optimization cleanup and throttling policy.
8. Windows Update service dependency repair (BITS/cryptsvc).
9. Patch compliance reporting with CVE tagging.
10. Quality update deferment toggle for break/fix scenarios.
11. Scheduled maintenance window orchestration.
12. WSUS/SCCM agent health check and registration repair.

#### Pack 4: Security Hardening
1. Defender AV/ASR configuration audit and apply baselines.
2. Ransomware protection enablement with controlled folder access.
3. Local admin group audit and Just-in-Time remediation.
4. Credential guard/LSA protection validation.
5. BitLocker status check and escrow verification.
6. Firewall rule baseline deployment per profile.
7. SMB signing/NTLM hardening enforcement.
8. Audit policy/Advanced Audit baseline application.
9. Disable legacy protocols (SMB1, TLS 1.0/1.1) where applicable.
10. AppLocker/WDAC policy presence check and staging.
11. Browser security baselines (SmartScreen, extensions, password manager).
12. USB storage restriction and device control policies.

#### Pack 5: Inventory & Health Monitoring
1. Hardware inventory with warranty/age estimation.
2. Software inventory with publisher and install age tagging.
3. Service health snapshot for critical agents (AV, backup, RMM).
4. Disk SMART health check with predictive alerts.
5. Memory pressure and commit charge trend collection.
6. CPU throttling/thermal detection with remediation steps.
7. Event log harvest for top error sources.
8. Installed printer audit with driver age check.
9. Battery health and charge cycle reporting (laptops).
10. Peripheral firmware checks (dock, monitor, BIOS/UEFI).
11. Local user account activity and last logon tracking.
12. Application crash frequency report with top offenders.

#### Pack 6: Backup & Recovery Readiness
1. Restore point creation schedule validation.
2. File History/OneDrive Known Folder Move status check.
3. VSS writer health check and auto-repair.
4. Shadow copy creation/cleanup schedule.
5. Critical folder backup verification (custom paths).
6. Ransomware canary file placement and monitoring.
7. Offline backup target reachability and capacity check.
8. Bare-metal recovery media freshness audit.
9. Backup agent heartbeat and job success trend.
10. SQL/Exchange/Line-of-business app backup hooks.
11. Rapid restore smoke test (sample file restore).
12. Backup encryption and retention policy validation.

### PowerShell

#### Pack 1: PC Clean & Optimization
1. Invoke-Command temp/cache cleanup across profiles.
2. Remove-AppxProvisionedPackage bloatware set.
3. Disable scheduled tasks for OEM updaters.
4. Optimize-Volume with tier-aware parameters.
5. Reset browser profiles via registry and filesystem.
6. Clear Windows Store cache using wsreset fallback.
7. Tune services via Set-Service and registry policies.
8. Create-CimSystemRestorePoint pre/post actions.
9. Configure pagefile with WMI and clear crash dumps.
10. Remove orphaned scheduled tasks via Get-ScheduledTask.
11. Manage ShadowStorage via vssadmin/WMI.
12. Apply privacy/telemetry registry baselines.

#### Pack 2: PC Networking
1. Reset-NetAdapterAdvancedProperty for power settings.
2. netsh winsock/ip reset wrappers with logging.
3. Test-NetConnection sweep for DNS/HTTP/SMB.
4. Manage NetTCPSetting/MTU for adapters.
5. Set-DnsClientServerAddress enforcement.
6. Get/Remove-NetIPConfiguration for stale configs.
7. Firewall baseline via Set-NetFirewallProfile/Rule.
8. Proxy auto-detect and registry repair.
9. WLAN profile export/cleanup with netsh wlan.
10. VPN rasphone.pbk repair and credential purge.
11. Clean static routes via Get-NetRoute filters.
12. Invoke-WebRequest throughput test with transcript.

#### Pack 3: PC Updates & Patch Hygiene
1. Reset-WUComponents helper function.
2. Get-WindowsUpdate pending reboot and install state.
3. Feature update readiness via Get-ComputerInfo checks.
4. Install-WindowsUpdate with driver exclusion toggle.
5. Repair-WindowsImage /RestoreHealth wrappers.
6. Validate Visual C++/DOTNET via registry queries.
7. Configure Delivery Optimization via Set-DOConfig.
8. BITS/cryptsvc dependency repair scripts.
9. Generate compliance CSV with KB/CVE mapping.
10. Toggle update deferment via policy keys.
11. Schedule maintenance windows with ScheduledTasks.
12. Detect/re-register WSUS/SCCM client settings.

#### Pack 4: Security Hardening
1. Defender Set-MpPreference baseline push.
2. Enable ASR rules with audit/Enforce switch.
3. Local admin group audit with Just Enough Admin.
4. Enable-VirtualizationBasedSecurity checks.
5. BitLocker status via manage-bde/PowerShell integration.
6. Firewall profiles/rules templating.
7. SMB/NTLM hardening registry enforcement.
8. Advanced audit policy via secedit imports.
9. Disable legacy protocols via Disable-WindowsOptionalFeature.
10. WDAC/AppLocker policy deployment in audit mode.
11. Browser baseline via registry/CSP settings.
12. USB device control via DeviceInstallation policies.

#### Pack 5: Inventory & Health Monitoring
1. Get-CimInstance hardware inventory with warranty lookup hooks.
2. Software inventory via Win32_Product alternatives (registry scan).
3. Service health report for AV/backup agents.
4. Get-PhysicalDisk/SMART data collection.
5. Memory and CPU telemetry via Get-Counter.
6. Event log digest using Get-WinEvent filters.
7. Printer inventory via WMI and driver age.
8. Battery health via powercfg /batteryreport parsing.
9. Peripheral firmware via vendor CLI invocation.
10. Local user audit via Get-LocalUser and logon times.
11. Crash dump analysis summary with Get-WinEvent Application errors.
12. Create reporting CSV/JSON and upload to share.

#### Pack 6: Backup & Recovery Readiness
1. Ensure scheduled restore points via scheduled tasks.
2. File History status check using fhmanagew.exe wrappers.
3. VSS writer health via vssadmin list writers parsing.
4. Automate shadow copy creation/cleanup with size limits.
5. Verify critical folder backups with checksum comparison.
6. Deploy ransomware canary files and watchers.
7. Validate network backup targets and quotas.
8. Refresh recovery media using vendor tools.
9. Agent heartbeat and job success ingestion.
10. Application-aware backup pre/post scripts.
11. Test restores for sample files with hash verification.
12. Validate encryption/retention settings and alert gaps.

### CMD

#### Pack 1: PC Clean & Optimization
1. del /q/f/s temp directories per user.
2. cleanmgr /sageset and /sagerun automation.
3. wmic startup listing and bloatware disable via reg.
4. defrag/optimize drives with sched tasks.
5. ipconfig /flushdns for browser cache side-effects.
6. wsreset.exe invocation.
7. sc config/service disable for background apps.
8. vssadmin list shadows and delete oldest.
9. wevtutil cl for noisy logs (post-export).
10. reg add for privacy/telemetry reductions.
11. schtasks /Delete for orphaned tasks.
12. netsh advfirewall set allprofiles state on.

#### Pack 2: PC Networking
1. ipconfig /release /renew with log capture.
2. netsh winsock reset and int ip reset.
3. netsh interface ipv4/6 set subinterface mtu=... .
4. netsh wlan show/profile cleanup sequence.
5. netsh interface set interface admin=enabled checks.
6. route print/prune stale entries.
7. netsh advfirewall reset/baseline import.
8. proxycfg/internet settings reset via reg add.
9. rasdial/rasphone reset for VPN profiles.
10. netstat -ano snapshot for port diagnostics.
11. nbtstat -R/-RR and lmhosts cleanup.
12. pathping/tracert latency tests to targets.

#### Pack 3: PC Updates & Patch Hygiene
1. net stop/start wuauserv bits cryptsvc with cache cleanup.
2. ren SoftwareDistribution/Catroot2 reset.
3. wuauclt /detectnow /reportnow sequences.
4. dism /online /cleanup-image /restorehealth.
5. sfc /scannow with log export.
6. install specific KB via wusa.exe.
7. reg add deferment keys for quality updates.
8. bitsadmin /reset /allusers cleanups.
9. UsoClient startscan/startdownload/startinstall.
10. pending reboot detection via registry query.
11. manage-bde -status check before feature updates.
12. net stop trustedinstaller repair cycles.

#### Pack 4: Security Hardening
1. powershell -Command "Set-MpPreference" wrappers.
2. reg add to enforce LSA protection.
3. net localgroup administrators audit.
4. manage-bde -status and -protectors checks.
5. netsh advfirewall import baseline rules.
6. reg add to disable SMB1/TLS1.0.
7. secedit /import for audit policy baselines.
8. reg add for credential guard/NTLM hardening.
9. taskkill and service disable for risky services.
10. icacls to lock down critical folders.
11. reg add for browser SmartScreen/defenses.
12. pnputil /disable-device for USB storage IDs.

#### Pack 5: Inventory & Health Monitoring
1. systeminfo and wmic csproduct for hardware.
2. wmic product/list via registry (export to CSV).
3. sc query type= service state= all for agent health.
4. wmic diskdrive get status and SMART via vendor tools.
5. typeperf counters for CPU/memory trends.
6. wevtutil qe for top application/system errors.
7. wmic printer/list status and driver version.
8. powercfg /batteryreport export.
9. wmic nic get power management settings.
10. quser/whoami for login tracking.
11. wevtutil qe Application /c:20 /f:text for crash logs.
12. compile reports into CSV via for /f loops.

#### Pack 6: Backup & Recovery Readiness
1. vssadmin list writers check and log.
2. wmic shadowcopy call create/delete rotation.
3. fhmanagew.exe -backupnow triggers.
4. robocopy validation to backup targets with hashes.
5. canary file creation and fc integrity checks.
6. wbadmin enable/disable/list status scripts.
7. manage-bde -protectors -get escrow verification.
8. reagentc /info to validate recovery environment.
9. vendor CLI checks for backup agents.
10. sample restore via robocopy back and hash verify.
11. schedule wbadmin backups via schtasks.
12. log rotation and alerting for failures.

### .PS1 Files

#### Pack 1: PC Clean & Optimization
1. Remove-Item temp/cache paths with -Recurse -Force and error handling.
2. Clean browser data via automation of known profile locations.
3. Debloat OEM apps via winget/uninstall registry targets.
4. Optimize-Volume scripts with SSD awareness.
5. Reset Microsoft Store components and Clear-EventLog.
6. Service tuning scripts parameterized per role.
7. Restore point creation and cleanup modules.
8. Pagefile sizing script with defaults per RAM.
9. Scheduled task cleanup and disable scripts.
10. Shadow copy pruning with size enforcement.
11. Privacy hardening script applying reg tweaks.
12. Telemetry blocker hosts file update.

#### Pack 2: PC Networking
1. Flush DNS/Winsock with transcript logging.
2. NetAdapter power setting script with profiles.
3. DHCP/static enforcement script with validation.
4. Wireless profile export/cleanup module.
5. Firewall baseline import from JSON.
6. Proxy repair script using registry and netsh.
7. VPN profile rebuild with stored credential purge.
8. MTU discovery and set per adapter.
9. Route table cleanup with safeguards.
10. SMB/NetBIOS hygiene script.
11. Network performance test harness (iperf/Test-NetConnection).
12. Network trace capture using pktmon/NetEventPacketCapture.

#### Pack 3: PC Updates & Patch Hygiene
1. Windows Update reset and diagnostics module.
2. Pending reboot detection and soft reboot orchestration.
3. Feature update pre-checker with disk/driver/report.
4. Install-WindowsUpdate wrapper with logging.
5. DISM/SFC remediation combo script.
6. Redistributable verification and install if missing.
7. Delivery Optimization cleanup and throttle set.
8. Repair BITS/cryptsvc/TrustedInstaller dependencies.
9. Compliance report generation to CSV/HTML.
10. Update deferment toggle script with rollback.
11. WSUS/SCCM client repair and detection script.
12. Maintenance window scheduler with deferrals.

#### Pack 4: Security Hardening
1. Defender/ASR baseline deployment script.
2. Just-in-Time local admin elevation workflow.
3. Credential Guard/LSA protections validator.
4. BitLocker check and recovery key backup.
5. Firewall profile/rule baseline importer.
6. SMB/NTLM hardening script with logging.
7. Audit policy baseline deployment.
8. Legacy protocol disablement (SMB1/TLS1.0/1.1).
9. WDAC/AppLocker audit policy deployment.
10. Browser baseline script (Edge/Chrome policies).
11. USB control via DeviceInstallation policies.
12. Ransomware protection enablement and test.

#### Pack 5: Inventory & Health Monitoring
1. Hardware inventory exporter (CSV/JSON).
2. Software inventory via registry scan and winget list fallback.
3. Agent/service health checker with restart logic.
4. Disk SMART poller with alert thresholds.
5. Performance counters collection and trending.
6. Event log aggregation and summarization.
7. Printer/Bluetooth/peripheral inventory scripts.
8. Battery health report collector.
9. Firmware/BIOS version checker with vendor CLIs.
10. Local user activity tracker and alerting.
11. Application crash reporter with Watson integration.
12. Upload consolidated reports to central share/API.

#### Pack 6: Backup & Recovery Readiness
1. Scheduled restore point enforcement script.
2. File History/OneDrive status checker.
3. VSS writer health and repair script.
4. Shadow copy management with retention policy.
5. Critical folder backup verifier with hashes.
6. Canary file deployment and monitor.
7. Network backup target check and quota alert.
8. Recovery media freshness validator.
9. Backup agent job status collector.
10. Application-aware pre/post backup scripts.
11. Sample restore tester with hash validation.
12. Encryption/retention compliance audit.
