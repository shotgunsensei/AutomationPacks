<#
Pack 3: PC Updates & Patch Hygiene
Reset update components, install updates, and report compliance.
#>
[CmdletBinding()]
param(
    [ValidateSet('All','ResetUpdateCache','DetectPendingReboot','FeatureReadiness','InstallCumulative','ValidateRedistributables','ScanDrivers','TuneDeliveryOptimization','RepairServices','ReportCompliance','ToggleDeferral','ScheduleMaintenance','RepairWsusSccm')]
    [string]$Action = 'All'
)

function Reset-UpdateCache {
    Stop-Service -Name wuauserv,bits,cryptsvc -Force -ErrorAction SilentlyContinue
    Rename-Item -Path 'C:\\Windows\\SoftwareDistribution' -NewName 'SoftwareDistribution.bak' -ErrorAction SilentlyContinue
    Rename-Item -Path 'C:\\Windows\\System32\\catroot2' -NewName 'catroot2.bak' -ErrorAction SilentlyContinue
    Start-Service -Name wuauserv,bits,cryptsvc -ErrorAction SilentlyContinue
}

function Detect-PendingReboot {
    $keys = 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\WindowsUpdate\\Auto Update\\RebootRequired','HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager'
    foreach ($k in $keys) { if (Test-Path $k) { Write-Host "Pending reboot flag at $k" } }
}

function Test-FeatureReadiness {
    Get-ComputerInfo | Select-Object OsName,OsVersion,OsBuildNumber,WindowsInstallDateFromRegistry
    Get-Volume | Where-Object DriveType -eq 'Fixed' | Select-Object DriveLetter,SizeRemaining
}

function Install-CumulativeUpdate {
    Install-WindowsUpdate -AcceptAll -IgnoreReboot -ErrorAction SilentlyContinue | Out-Null
}

function Validate-Redistributables {
    $vcKeys = Get-ChildItem 'HKLM:\\SOFTWARE\\Microsoft\\VisualStudio\\14.0\\VC\\Runtimes' -ErrorAction SilentlyContinue
    if (-not $vcKeys) { Write-Host 'Visual C++ 2015-2022 not detected; install recommended.' }
    $dotnet = Get-ChildItem 'HKLM:\\SOFTWARE\\Microsoft\\NET Framework Setup\\NDP\\v4\\Full' -ErrorAction SilentlyContinue
    if ($dotnet) { Write-Host "DOTNET version $($dotnet.GetValue('Release')) detected" }
}

function Scan-Drivers {
    pnputil /enum-drivers | Select-String 'Published Name|Driver Date|Driver Version'
}

function Tune-DeliveryOptimization {
    $path = 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DeliveryOptimization\\Settings'
    New-Item -Path $path -Force | Out-Null
    Set-ItemProperty -Path $path -Name DOPercentageMaxDownload -Value 50 -Type DWord
}

function Repair-Services {
    sc.exe config bits start= delayed-auto | Out-Null
    sc.exe config cryptsvc start= auto | Out-Null
    sc.exe config wuauserv start= auto | Out-Null
}

function Report-Compliance {
    $updates = Get-WmiObject -Class win32_quickfixengineering | Select-Object HotFixID,InstalledOn,Description
    $updates | Export-Csv -Path "$env:TEMP\\update_compliance.csv" -NoTypeInformation
}

function Toggle-Deferral {
    $path = 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate'
    New-Item -Path $path -Force | Out-Null
    Set-ItemProperty -Path $path -Name DeferQualityUpdates -Value 1 -Type DWord
    Set-ItemProperty -Path $path -Name DeferQualityUpdatesPeriodInDays -Value 15 -Type DWord
}

function Schedule-Maintenance {
    $action = New-ScheduledTaskAction -Execute 'UsoClient.exe' -Argument 'StartInstall'
    $trigger = New-ScheduledTaskTrigger -Daily -At 3am
    Register-ScheduledTask -TaskName 'PatchWindow' -Action $action -Trigger $trigger -Force | Out-Null
}

function Repair-WsusSccm {
    UsoClient.exe RefreshSettings | Out-Null
    wuauclt /resetauthorization /detectnow | Out-Null
}

$map = @{
    ResetUpdateCache      = { Reset-UpdateCache }
    DetectPendingReboot   = { Detect-PendingReboot }
    FeatureReadiness      = { Test-FeatureReadiness }
    InstallCumulative     = { Install-CumulativeUpdate }
    ValidateRedistributables = { Validate-Redistributables }
    ScanDrivers           = { Scan-Drivers }
    TuneDeliveryOptimization = { Tune-DeliveryOptimization }
    RepairServices        = { Repair-Services }
    ReportCompliance      = { Report-Compliance }
    ToggleDeferral        = { Toggle-Deferral }
    ScheduleMaintenance   = { Schedule-Maintenance }
    RepairWsusSccm        = { Repair-WsusSccm }
}

if ($Action -eq 'All') {
    foreach ($key in $map.Keys) { & $map[$key] }
} else { & $map[$Action] }
