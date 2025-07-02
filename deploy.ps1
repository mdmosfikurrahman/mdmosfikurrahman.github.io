# ============================
# GitHub Pages Deploy Script
# ============================

# Ensure script runs from its directory
Set-Location -Path $PSScriptRoot

# Step 0: Ensure you're on the correct source branch
$currentBranch = git branch --show-current
if ($currentBranch -ne "dynamic-source") {
    Write-Host "ERROR: You must run this script from 'dynamic-source' branch. Current branch: $currentBranch"
    exit 1
}

Write-Host "Step 1: Pull latest from dynamic-source"
git pull origin dynamic-source

Write-Host "Step 2: Install dependencies"
npm install

Write-Host "Step 3: Build the project"
npm run build

Write-Host "Step 4: Checkout or create dynamic-2 branch"
git checkout dynamic-2 2>$null
if ($LASTEXITCODE -ne 0) {
    git checkout -b dynamic-2
}

Write-Host "Step 5: Pull latest from remote dynamic-2"
git pull origin dynamic-2

Write-Host "Step 6: Clean all files except .git and dist"
Get-ChildItem -Force | Where-Object {
    $_.Name -ne '.git' -and $_.Name -ne 'dist'
} | Remove-Item -Recurse -Force

Write-Host "Step 7: Move contents of dist to root"
Get-ChildItem -Path .\dist -Force | ForEach-Object {
    Move-Item -Path $_.FullName -Destination . -Force
}

Write-Host "Step 8: Delete dist folder"
Remove-Item -Recurse -Force .\dist

Write-Host "Step 9: Commit and push to origin/dynamic-2"
git add .
$time = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
git commit -m "Deploy from dynamic-source at $time"
git push origin dynamic-2

Write-Host "Deployment completed successfully."
