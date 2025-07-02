# ============================
# GitHub Pages Deploy Script
# ============================

# Ensure the script runs from its own directory
Set-Location -Path $PSScriptRoot

# Check that we're on dynamic-source branch
$currentBranch = git branch --show-current
if ($currentBranch -ne "dynamic-source") {
    Write-Host "ERROR: You must run this script from 'dynamic-source' branch. Current branch: '$currentBranch'"
    exit 1
}

Write-Host "Step 1: Pull latest from dynamic-source"
git pull origin dynamic-source

Write-Host "Step 2: Install dependencies"
npm install

Write-Host "Step 3: Build the project"
npm run build

Write-Host "Step 4: Switch to dynamic-2 branch"
git checkout -B dynamic-2

Write-Host "Step 5: Clean all files except .git and dist"
Get-ChildItem -Force | Where-Object {
    $_.Name -ne '.git' -and $_.Name -ne 'dist'
} | Remove-Item -Recurse -Force

Write-Host "Step 6: Move contents of dist to root"
Get-ChildItem -Path .\dist -Force | ForEach-Object {
    Move-Item -Path $_.FullName -Destination . -Force
}

Write-Host "Step 7: Delete dist folder"
Remove-Item -Recurse -Force .\dist

Write-Host "Step 8: Commit and push to origin/dynamic-2"
git add .
$time = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
git commit -m "Deploy from dynamic-source at $time"
git push -u origin dynamic-2

Write-Host "Deployment completed successfully."
