$ErrorActionPreference = 'Stop'

$TMP = if ($env:TMPDIR) { $env:TMPDIR } else { $env:TEMP }
$BUILD_PATH = "$TMP\deploy-dist"

Write-Host "Starting ultra-clean deployment..."

# --- SOURCE BRANCH ---
git checkout dynamic-source-2

if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..."
    npm install --prefer-offline --no-audit --progress=false
}

Write-Host "Building project..."
npm run build

# Prepare clean temp folder
if (Test-Path $BUILD_PATH) {
    Remove-Item -Recurse -Force $BUILD_PATH
}
New-Item -ItemType Directory -Path $BUILD_PATH | Out-Null

# Copy ONLY dist contents (not the dist folder itself)
Copy-Item -Recurse -Force ".\dist\*" $BUILD_PATH

# --- TARGET BRANCH ---
git checkout dynamic-2

Write-Host "Cleaning branch completely..."

# Remove tracked files (safe even if empty)
git rm -rf . 2>$null

# Remove ALL untracked files
git clean -fdx

# Copy ONLY build output
Write-Host "Copying dist content..."
Copy-Item -Recurse -Force "$BUILD_PATH\*" .

# Cleanup temp
Remove-Item -Recurse -Force $BUILD_PATH

# Stage everything
git add -A

# Commit if needed
if (git diff --cached --quiet) {
    Write-Host "No changes to commit."
} else {
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    git commit -m "Deploy build at $timestamp"
    git push origin dynamic-2 --force
}

# Switch back
git checkout dynamic-source-2

Write-Host "Deployment completed successfully."