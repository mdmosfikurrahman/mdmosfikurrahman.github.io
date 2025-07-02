# ============================
# GitHub Pages Deploy Script
# ============================

# Step 0: Ensure script runs from its directory
Set-Location -Path $PSScriptRoot

# Step 1: Ensure we're on dynamic-source
$currentBranch = git branch --show-current
if ($currentBranch -ne "dynamic-source") {
    Write-Host "ERROR: This script must be run from 'dynamic-source'. Current branch: $currentBranch"
    exit 1
}

Write-Host "Step 2: Pull latest from dynamic-source"
git pull origin dynamic-source

Write-Host "Step 3: Install dependencies"
npm install

Write-Host "Step 4: Build the project"
npm run build

# Step 5: Backup dist folder to temp
$tempDistPath = "$env:TEMP\deploy_dist_copy"
if (Test-Path $tempDistPath) { Remove-Item -Recurse -Force $tempDistPath }
Copy-Item -Recurse -Force .\dist $tempDistPath

# Step 6: Switch to or create dynamic-2
if (-not (git show-ref --quiet refs/heads/dynamic-2)) {
    Write-Host "Creating new branch: dynamic-2"
    git checkout -b dynamic-2
} else {
    Write-Host "Switching to existing dynamic-2 branch"
    git checkout dynamic-2
}

# Step 7: Pull from remote to avoid push errors
$pullResult = git pull origin dynamic-2 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Could not pull from origin/dynamic-2"
    Write-Host $pullResult
    Write-Host "Aborting to prevent data loss."
    exit 1
}

# Step 8: Delete everything except .git, .idea, deploy.ps1
Get-ChildItem -Force | Where-Object {
    $_.Name -ne '.git' -and
            $_.Name -ne '.idea' -and
            $_.Name -ne 'deploy.ps1'
} | Remove-Item -Recurse -Force

# Step 9: Copy built files to root
Copy-Item -Recurse -Force "$tempDistPath\*" .

# Step 10: Clean up temp dist folder
Remove-Item -Recurse -Force $tempDistPath

# Step 11: Commit and push changes
git add .
$time = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
git commit -m "Deploy from dynamic-source at $time"
git push -u origin dynamic-2

Write-Host "Deployment completed successfully."
