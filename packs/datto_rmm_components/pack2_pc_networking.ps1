<#
Pack 2: PC Networking
Switch-driven automation for 12 network repair and tuning tasks.
#>
[CmdletBinding()]
param(
    [ValidateSet('All','ResetStack','TuneNicPower','ValidateBindings','CleanupWlan','AuditDhcpStatic','OptimizeMtu','RepairFirewall','ResetProxy','RepairVpn','CleanRoutes','CleanNetbios','NetworkTest')]
    [string]$Action = 'All'
)

function Reset-NetworkStack {
    ipconfig /flushdns | Out-Null
    netsh winsock reset | Out-Null
    netsh int ip reset | Out-Null
}

function Tune-NicPower {
    Get-NetAdapter | ForEach-Object { Set-NetAdapterPowerManagement -Name $_.Name -AllowComputerToTurnOffDevice $false -ErrorAction SilentlyContinue }
}

function Validate-Bindings {
    Get-NetAdapterBinding -ComponentID ms_tcpip6 | Where-Object { -not $_.Enabled } | Enable-NetAdapterBinding -ErrorAction SilentlyContinue
    Get-NetAdapterBinding -ComponentID ms_tcpip | Where-Object { -not $_.Enabled } | Enable-NetAdapterBinding -ErrorAction SilentlyContinue
}

function Cleanup-WlanProfiles {
    netsh wlan show profiles | Select-String ':' | ForEach-Object { $_.ToString().Split(':')[1].Trim() } | ForEach-Object { netsh wlan delete profile name="$_" | Out-Null }
}

function Audit-DhcpStatic {
    Get-NetIPConfiguration | ForEach-Object {
        if ($_.IPv4DefaultGateway -and $_.NetAdapter.Status -eq 'Up') {
            if ($_.NetProfile.Name) { Write-Host "DHCP mode for $($_.NetAdapter.InterfaceDescription): $($_.NetIPv4Interface.Dhcp)" }
        }
    }
}

function Optimize-Mtu {
    $adapters = Get-NetAdapter | Where-Object Status -eq 'Up'
    foreach ($adapter in $adapters) {
        Set-NetIPInterface -InterfaceAlias $adapter.Name -NlMtuBytes 1500 -ErrorAction SilentlyContinue
    }
}

function Repair-Firewall {
    netsh advfirewall reset | Out-Null
    Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True -ErrorAction SilentlyContinue
}

function Reset-Proxy {
    netsh winhttp reset proxy | Out-Null
    Remove-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -Name ProxyServer -ErrorAction SilentlyContinue
}

function Repair-Vpn {
    $rasPhone = "$env:APPDATA\\Microsoft\\Network\\Connections\\Pbk\\rasphone.pbk"
    if (Test-Path $rasPhone) { Remove-Item $rasPhone -Force }
    rasdial /disconnect | Out-Null
}

function Clean-Routes {
    Get-NetRoute | Where-Object { $_.RouteMetric -gt 500 } | Remove-NetRoute -Confirm:$false -ErrorAction SilentlyContinue
}

function Clean-Netbios {
    nbtstat -R | Out-Null
    nbtstat -RR | Out-Null
}

function Invoke-NetworkTest {
    Test-NetConnection -ComputerName 1.1.1.1 -InformationLevel Detailed
    Test-NetConnection -ComputerName www.microsoft.com -CommonTCPPort HTTP
}

$map = @{
    ResetStack      = { Reset-NetworkStack }
    TuneNicPower    = { Tune-NicPower }
    ValidateBindings= { Validate-Bindings }
    CleanupWlan     = { Cleanup-WlanProfiles }
    AuditDhcpStatic = { Audit-DhcpStatic }
    OptimizeMtu     = { Optimize-Mtu }
    RepairFirewall  = { Repair-Firewall }
    ResetProxy      = { Reset-Proxy }
    RepairVpn       = { Repair-Vpn }
    CleanRoutes     = { Clean-Routes }
    CleanNetbios    = { Clean-Netbios }
    NetworkTest     = { Invoke-NetworkTest }
}

if ($Action -eq 'All') {
    foreach ($key in $map.Keys) { & $map[$key] }
} else {
    & $map[$Action]
}
