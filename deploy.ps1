# === GitHub Pages Deploy Script (Minimal, Safe) ===

Set-Location -Path $PSScriptRoot

# Ensure you're on dynamic-source
$currentBranch = git branch --show-current
if ($currentBranch -ne "dynamic-source") {
    Write-Host "You must be on 'dynamic-source' to deploy. Aborting."
    exit 1
}

git pull origin dynamic-source
npm install
npm run build

# Backup dist
$tempDist = "$env:TEMP\_deploy_dist"
if (Test-Path $tempDist) { Remove-Item -Recurse -Force $tempDist }
Copy-Item -Recurse -Force .\dist $tempDist

# Create or switch to dynamic-2
if (-not (git show-ref --quiet refs/heads/dynamic-2)) {
    git checkout -b dynamic-2
} else {
    git checkout dynamic-2
    git pull origin dynamic-2
}

# Clean all except .git, .idea, deploy.ps1
Get-ChildItem -Force | Where-Object {
    $_.Name -ne '.git' -and
            $_.Name -ne '.idea' -and
            $_.Name -ne 'deploy.ps1'
} | Remove-Item -Recurse -Force

# Copy dist contents to root
Copy-Item -Recurse -Force "$tempDist\*" .

# Cleanup
Remove-Item -Recurse -Force $tempDist

# Commit and push
git add .
$time = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
git commit -m "Deploy from dynamic-source at $time"
git push -u origin dynamic-2

Write-Host "Deployment done."
