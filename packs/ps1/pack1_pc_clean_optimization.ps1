<#
Pack 1: PC Clean & Optimization
Provides a switch-based runner for 12 maintenance actions. Use -Action to target a specific task or -Action All to run every task.
#>
[CmdletBinding()]
param(
    [ValidateSet('All','ClearTemp','DiskCleanup','DisableStartupBloat','OptimizeDisks','ResetBrowsers','ResetStore','TuneServices','CreateRestorePoint','OptimizePagefile','CleanScheduledTasks','PruneShadowCopies','ReduceTelemetry')]
    [string]$Action = 'All'
)

function Invoke-ClearTemp {
    Get-ChildItem "C:\\Users" -Directory | ForEach-Object {
        $paths = @(
            Join-Path $_.FullName 'AppData\\Local\\Temp',
            Join-Path $_.FullName 'AppData\\Local\\Microsoft\\Windows\\INetCache'
        )
        foreach ($path in $paths) {
            if (Test-Path $path) {
                Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
                New-Item -ItemType Directory -Path $path -Force | Out-Null
            }
        }
    }
}

function Invoke-DiskCleanup {
    $sageset = 19
    Start-Process -FilePath cleanmgr.exe -ArgumentList "/sageset:$sageset" -Wait
    Start-Process -FilePath cleanmgr.exe -ArgumentList "/sagerun:$sageset" -Wait
    Get-ChildItem 'C:\\$Recycle.Bin' -Force -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
}

function Disable-StartupBloat {
    $bloatPatterns = 'OneDriveStandaloneUpdater','Xbox','Teams','Adobe Updater'
    Get-ScheduledTask | Where-Object { $bloatPatterns -match $_.TaskName } | Unregister-ScheduledTask -Confirm:$false -ErrorAction SilentlyContinue
}

function Invoke-OptimizeDisks {
    Get-Volume | ForEach-Object {
        Optimize-Volume -DriveLetter $_.DriveLetter -Analyze -ErrorAction SilentlyContinue
        Optimize-Volume -DriveLetter $_.DriveLetter -Defrag -ErrorAction SilentlyContinue
    }
}

function Reset-Browsers {
    $profiles = @('Chrome','Edge','Firefox')
    foreach ($profile in $profiles) {
        Get-ChildItem "$env:LOCALAPPDATA\\$profile\\User Data" -Directory -ErrorAction SilentlyContinue |
            ForEach-Object { Remove-Item $_.FullName -Recurse -Force -ErrorAction SilentlyContinue }
    }
}

function Reset-Store {
    Start-Process wsreset.exe -Wait
    Get-AppxPackage -AllUsers Microsoft.WindowsStore | Reset-AppxPackage
}

function Tune-Services {
    $services = 'DiagTrack','WSearch','WbioSrvc'
    foreach ($name in $services) {
        if (Get-Service -Name $name -ErrorAction SilentlyContinue) {
            Set-Service -Name $name -StartupType Manual -ErrorAction SilentlyContinue
        }
    }
}

function New-RestorePointWrapper {
    Checkpoint-Computer -Description 'AutomationPack_PreMaintenance' -RestorePointType MODIFY_SETTINGS
}

function Optimize-Pagefile {
    $regPath = 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management'
    Set-ItemProperty -Path $regPath -Name 'PagingFiles' -Value 'C:\\pagefile.sys 1024 4096'
    Get-ChildItem 'C:\\Windows\\Minidump' -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
}

function Clean-ScheduledTasks {
    $targets = 'GoogleUpdateTaskMachineUA','MicrosoftEdgeUpdateTaskMachineUA'
    foreach ($task in $targets) {
        Unregister-ScheduledTask -TaskName $task -Confirm:$false -ErrorAction SilentlyContinue
    }
}

function Prune-ShadowCopies {
    vssadmin list shadows | Out-Null
    vssadmin delete shadows /oldest /quiet | Out-Null
    vssadmin resize shadowstorage /on=C: /for=C: /maxsize=10GB | Out-Null
}

function Reduce-Telemetry {
    $paths = @(
        'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection',
        'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\AdvertisingInfo'
    )
    foreach ($path in $paths) {
        New-Item -Path $path -Force | Out-Null
    }
    Set-ItemProperty -Path $paths[0] -Name AllowTelemetry -Value 0 -Type DWord
    Set-ItemProperty -Path $paths[1] -Name Enabled -Value 0 -Type DWord
}

$map = @{
    ClearTemp          = { Invoke-ClearTemp }
    DiskCleanup        = { Invoke-DiskCleanup }
    DisableStartupBloat= { Disable-StartupBloat }
    OptimizeDisks      = { Invoke-OptimizeDisks }
    ResetBrowsers      = { Reset-Browsers }
    ResetStore         = { Reset-Store }
    TuneServices       = { Tune-Services }
    CreateRestorePoint = { New-RestorePointWrapper }
    OptimizePagefile   = { Optimize-Pagefile }
    CleanScheduledTasks= { Clean-ScheduledTasks }
    PruneShadowCopies  = { Prune-ShadowCopies }
    ReduceTelemetry    = { Reduce-Telemetry }
}

if ($Action -eq 'All') {
    foreach ($key in $map.Keys) { & $map[$key] }
} else {
    & $map[$Action]
}
