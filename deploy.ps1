# ============================
# GitHub Pages Deploy Script
# ============================

# Ensure script runs from its own directory
Set-Location -Path $PSScriptRoot

# Step 1: Ensure we are on dynamic-source
$currentBranch = git branch --show-current
if ($currentBranch -ne "dynamic-source") {
    Write-Host "ERROR: This script must be run from 'dynamic-source'. Current branch: $currentBranch"
    exit 1
}

Write-Host "Step 2: Pull latest from origin/dynamic-source"
git pull origin dynamic-source

Write-Host "Step 3: Install dependencies"
npm install

Write-Host "Step 4: Build the project"
npm run build

# Step 5: Backup dist to a temp directory
$tempDistPath = "$env:TEMP\deploy_dist_copy"
if (Test-Path $tempDistPath) { Remove-Item -Recurse -Force $tempDistPath }
Copy-Item -Recurse -Force .\dist $tempDistPath

# Step 6: Switch to or create dynamic-2 branch
$newlyCreated = $false
if (-not (git show-ref --quiet refs/heads/dynamic-2)) {
    Write-Host "Creating new branch: dynamic-2"
    git checkout -b dynamic-2
    $newlyCreated = $true
} else {
    Write-Host "Switching to existing dynamic-2"
    git checkout dynamic-2
}

# Step 7: Verify current branch is dynamic-2
$currentBranch = git branch --show-current
if ($currentBranch -ne "dynamic-2") {
    Write-Host "ERROR: Failed to switch to dynamic-2. Aborting to prevent accidental deletion."
    exit 1
}

# Step 8: Pull latest changes from origin/dynamic-2 if not new
if (-not $newlyCreated) {
    Write-Host "Pulling latest from origin/dynamic-2..."
    $pullResult = git pull origin dynamic-2 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Could not pull from origin/dynamic-2"
        Write-Host $pullResult
        Write-Host "Aborting to prevent data loss."
        exit 1
    }
} else {
    Write-Host "Skipping pull — dynamic-2 branch is newly created."
}

# Step 9: Clean all files except .git, .idea, and deploy.ps1
Write-Host "Cleaning workspace..."
Get-ChildItem -Force | Where-Object {
    $_.Name -ne '.git' -and
            $_.Name -ne '.idea' -and
            $_.Name -ne 'deploy.ps1'
} | Remove-Item -Recurse -Force

# Step 10: Copy dist files to root
Write-Host "Copying dist to root..."
Copy-Item -Recurse -Force "$tempDistPath\*" .

# Step 11: Delete temp dist backup
Remove-Item -Recurse -Force $tempDistPath

# Step 12: Commit and push
Write-Host "Committing and pushing changes..."
git add .
$time = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
git commit -m "Deploy from dynamic-source at $time"
git push -u origin dynamic-2

Write-Host "Deployment completed successfully."
