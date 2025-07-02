# ============================
# GitHub Pages Deploy Script
# ============================

# Step 0: Ensure we are in the script's directory
Set-Location -Path $PSScriptRoot

# Step 1: Confirm on dynamic-source
$currentBranch = git branch --show-current
if ($currentBranch -ne "dynamic-source") {
    Write-Host "ERROR: Must run from dynamic-source branch. Current: $currentBranch"
    exit 1
}

git pull origin dynamic-source

npm install

npm run build

# Step 5: Backup dist to a temp directory
$tempDist = "$env:TEMP\dist-backup"
if (Test-Path $tempDist) {
    Remove-Item -Recurse -Force $tempDist
}
Copy-Item -Recurse -Force .\dist $tempDist

# Step 6: Create or switch to dynamic-2
$dynamic2Exists = git show-ref --quiet refs/heads/dynamic-2
$newlyCreated = $false

if (-not $dynamic2Exists) {
    Write-Host "Creating dynamic-2 branch..."
    git checkout -b dynamic-2
    $newlyCreated = $true
} else {
    Write-Host "Switching to dynamic-2 branch..."
    git checkout dynamic-2
}

# Step 7: Verify switched correctly
$branchCheck = git branch --show-current
if ($branchCheck -ne "dynamic-2") {
    Write-Host "ERROR: Failed to switch to dynamic-2. Aborting."
    exit 1
}

# Step 8: Pull if not newly created
if (-not $newlyCreated) {
    Write-Host "Pulling latest from origin/dynamic-2..."
    $pullResult = git pull origin dynamic-2 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Could not pull origin/dynamic-2."
        Write-Host $pullResult
        exit 1
    }
} else {
    Write-Host "No need to pull — dynamic-2 is newly created."
}

# Step 9: Clean all files except .git, .idea, and deploy.ps1
Get-ChildItem -Force | Where-Object {
    $_.Name -ne '.git' -and
            $_.Name -ne '.idea' -and
            $_.Name -ne 'deploy.ps1'
} | Remove-Item -Recurse -Force

# Step 10: Move dist files to root
Copy-Item -Recurse -Force "$tempDist\*" .

# Step 11: Remove temp dist
Remove-Item -Recurse -Force $tempDist

# Step 12: Commit and push
git add .
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Deploy from dynamic-source at $timestamp"
git push -u origin dynamic-2