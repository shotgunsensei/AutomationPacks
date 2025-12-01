<#
Pack 4: Security Hardening
Applies baseline security controls and audits local posture.
#>
[CmdletBinding()]
param(
    [ValidateSet('All','DefenderBaseline','EnableAsr','AuditLocalAdmins','ValidateVbs','CheckBitLocker','FirewallBaseline','HardeningSmbNtlm','AuditPolicy','DisableLegacyProtocols','DeployAppControl','BrowserBaseline','UsbControl')]
    [string]$Action = 'All'
)

function Set-DefenderBaseline { Set-MpPreference -DisableRealtimeMonitoring $false -MAPSReporting Advanced -SubmitSamplesConsent SendSafeSamples }
function Enable-AsrRules { Add-MpPreference -AttackSurfaceReductionRules_Ids 'D4F940AB-401B-4EFC-AADC-AD5F3C50688A' -AttackSurfaceReductionRules_Actions Enabled }
function Audit-LocalAdmins { Get-LocalGroupMember -Group 'Administrators' }
function Validate-Vbs { Get-CimInstance -ClassName Win32_DeviceGuard | Select-Object RequiredSecurityProperties,VirtualizationBasedSecurityStatus }
function Check-BitLocker { manage-bde -status }
function Baseline-Firewall { Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True }
function Hardening-SmbNtlm { 
    $path='HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Lsa';
    New-Item -Path $path -Force | Out-Null;
    Set-ItemProperty -Path $path -Name LmCompatibilityLevel -Value 5 -Type DWord;
    Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol -NoRestart -ErrorAction SilentlyContinue;
}
function Set-AuditPolicy { auditpol /set /subcategory:* /success:enable /failure:enable | Out-Null }
function Disable-LegacyProtocols { Set-ItemProperty -Path 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.0\\Server' -Name Enabled -Value 0 -Type DWord -Force }
function Deploy-AppControl { Write-Host 'Stage WDAC/AppLocker policies from \\share\\policies' }
function Baseline-Browser { Write-Host 'Apply SmartScreen/extension baselines via registry preference' }
function Control-Usb { Set-ItemProperty -Path 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeviceInstall\\Restrictions' -Name DenyRemovableDevices -Value 1 -Type DWord -Force }

$map = @{
    DefenderBaseline     = { Set-DefenderBaseline }
    EnableAsr            = { Enable-AsrRules }
    AuditLocalAdmins     = { Audit-LocalAdmins }
    ValidateVbs          = { Validate-Vbs }
    CheckBitLocker       = { Check-BitLocker }
    FirewallBaseline     = { Baseline-Firewall }
    HardeningSmbNtlm     = { Hardening-SmbNtlm }
    AuditPolicy          = { Set-AuditPolicy }
    DisableLegacyProtocols = { Disable-LegacyProtocols }
    DeployAppControl     = { Deploy-AppControl }
    BrowserBaseline      = { Baseline-Browser }
    UsbControl           = { Control-Usb }
}

if ($Action -eq 'All') { foreach ($key in $map.Keys) { & $map[$key] } } else { & $map[$Action] }
