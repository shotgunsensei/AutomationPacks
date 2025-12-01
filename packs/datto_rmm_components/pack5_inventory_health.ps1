<#
Pack 5: Inventory & Health Monitoring
Collects device inventory and health telemetry.
#>
[CmdletBinding()]
param(
    [ValidateSet('All','HardwareInventory','SoftwareInventory','ServiceHealth','DiskSmart','Performance','EventDigest','PrinterAudit','BatteryHealth','FirmwareCheck','UserAudit','CrashReport','ExportReports')]
    [string]$Action='All'
)

function Get-HardwareInventory { Get-CimInstance -ClassName Win32_ComputerSystem | Select-Object Manufacturer,Model,TotalPhysicalMemory }
function Get-SoftwareInventory { Get-ItemProperty 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' | Select-Object DisplayName,Publisher,InstallDate }
function Get-ServiceHealth { Get-Service | Where-Object {$_.Status -ne 'Running' -and $_.StartType -eq 'Automatic'} }
function Get-DiskSmart { Get-PhysicalDisk | Select-Object FriendlyName,HealthStatus,SerialNumber,Usage }
function Get-Performance { Get-Counter '\\Processor(_Total)\\% Processor Time','\\Memory\\Available MBytes' -SampleInterval 1 -MaxSamples 3 }
function Get-EventDigest { Get-WinEvent -LogName Application -MaxEvents 50 | Group-Object ProviderName | Select-Object Name,Count }
function Get-PrinterAudit { Get-Printer | Select-Object Name,DriverName,Shared }
function Get-BatteryHealth { powercfg /batteryreport /output "$env:TEMP\\batteryreport.html" | Out-Null }
function Get-FirmwareCheck { Get-WmiObject -Class Win32_BIOS | Select-Object SMBIOSBIOSVersion,ReleaseDate }
function Get-UserAudit { Get-LocalUser | Select-Object Name,Enabled,LastLogon }
function Get-CrashReport { Get-WinEvent -LogName Application -MaxEvents 20 | Where-Object {$_.LevelDisplayName -eq 'Error'} }
function Export-Reports {
    $report = [PSCustomObject]@{
        Hardware = Get-HardwareInventory
        Services = Get-ServiceHealth
    }
    $report | ConvertTo-Json | Set-Content -Path "$env:TEMP\\inventory_report.json"
}

$map = @{
    HardwareInventory = { Get-HardwareInventory }
    SoftwareInventory = { Get-SoftwareInventory }
    ServiceHealth     = { Get-ServiceHealth }
    DiskSmart         = { Get-DiskSmart }
    Performance       = { Get-Performance }
    EventDigest       = { Get-EventDigest }
    PrinterAudit      = { Get-PrinterAudit }
    BatteryHealth     = { Get-BatteryHealth }
    FirmwareCheck     = { Get-FirmwareCheck }
    UserAudit         = { Get-UserAudit }
    CrashReport       = { Get-CrashReport }
    ExportReports     = { Export-Reports }
}

if ($Action -eq 'All') { foreach ($key in $map.Keys) { & $map[$key] } } else { & $map[$Action] }
