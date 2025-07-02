# ============================
# GitHub Pages Deploy Script
# From dynamic-source to dynamic-2
# ============================

# Move to script's directory
Set-Location -Path $PSScriptRoot

Write-Host "Step 1: Checkout dynamic-source"
git checkout dynamic-source
git pull origin dynamic-source

Write-Host "Step 2: Install dependencies"
npm install

Write-Host "Step 3: Build the project"
npm run build

Write-Host "Step 4: Backup dist"
Copy-Item -Recurse -Force .\dist "$env:TEMP\dist-backup"

Write-Host "Step 5: Switch to dynamic-2"
git checkout dynamic-2
git pull origin dynamic-2

Write-Host "Step 6: Remove old files (except .git, .idea, deploy.ps1)"
Get-ChildItem -Force | Where-Object {
    $_.Name -ne '.git' -and
            $_.Name -ne '.idea' -and
            $_.Name -ne 'deploy.ps1'
} | Remove-Item -Recurse -Force

Write-Host "Step 7: Copy new build from backup"
Copy-Item -Recurse -Force "$env:TEMP\dist-backup\*" .

Write-Host "Step 8: Remove backup"
Remove-Item -Recurse -Force "$env:TEMP\dist-backup"

Write-Host "Step 9: Commit and push to dynamic-2"
git add .
$timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
git commit -m "Deploy from dynamic-source at $timestamp"
git push -u origin dynamic-2

Write-Host "Step 10: Switch back to dynamic-source"
git checkout dynamic-source

Write-Host "✅ Deployment completed successfully."
