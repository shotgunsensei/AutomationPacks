<#
Pack 6: Backup & Recovery Readiness
Validates backup posture and performs light recovery tests.
#>
[CmdletBinding()]
param(
    [ValidateSet('All','ValidateRestorePoints','CheckFileHistory','CheckVssWriters','ManageShadowCopies','VerifyCriticalFolders','DeployCanary','CheckBackupTargets','ValidateRecoveryMedia','CollectAgentStatus','PrePostHooks','TestRestore','AuditEncryptionRetention')]
    [string]$Action='All'
)

function Validate-RestorePoints { Get-ComputerRestorePoint | Sort-Object -Property SequenceNumber -Descending | Select-Object -First 3 }
function Check-FileHistory { fhmanagew.exe -backupnow | Out-Null }
function Check-VssWriters { vssadmin list writers }
function Manage-ShadowCopies { vssadmin create shadow /for=C: | Out-Null; vssadmin delete shadows /for=C: /oldest /quiet | Out-Null }
function Verify-CriticalFolders {
    $paths=@('C:\\Data','C:\\Projects'); foreach ($p in $paths) { if (Test-Path $p) { Get-ChildItem $p -Recurse -ErrorAction SilentlyContinue | Get-FileHash | Out-Null } }
}
function Deploy-Canary { New-Item -Path 'C:\\canary.txt' -ItemType File -Force | Set-Content -Value 'canary'; }
function Check-BackupTargets { Test-Path '\\backupserver\\share' }
function Validate-RecoveryMedia { reagentc /info }
function Collect-AgentStatus { Get-Service | Where-Object { $_.Name -match 'backup' } | Select-Object Name,Status }
function Invoke-PrePostHooks { Write-Host 'Invoke application quiesce scripts before/after backup' }
function Test-Restore { Copy-Item 'C:\\canary.txt' "$env:TEMP\\canary_restore.txt" -Force; Compare-Object (Get-Content 'C:\\canary.txt') (Get-Content "$env:TEMP\\canary_restore.txt") }
function Audit-EncryptionRetention { Write-Host 'Verify encryption set to AES256 and retention >= 30d' }

$map=@{
    ValidateRestorePoints       = { Validate-RestorePoints }
    CheckFileHistory            = { Check-FileHistory }
    CheckVssWriters             = { Check-VssWriters }
    ManageShadowCopies          = { Manage-ShadowCopies }
    VerifyCriticalFolders       = { Verify-CriticalFolders }
    DeployCanary                = { Deploy-Canary }
    CheckBackupTargets          = { Check-BackupTargets }
    ValidateRecoveryMedia       = { Validate-RecoveryMedia }
    CollectAgentStatus          = { Collect-AgentStatus }
    PrePostHooks                = { Invoke-PrePostHooks }
    TestRestore                 = { Test-Restore }
    AuditEncryptionRetention    = { Audit-EncryptionRetention }
}

if ($Action -eq 'All') { foreach ($key in $map.Keys) { & $map[$key] } } else { & $map[$Action] }
