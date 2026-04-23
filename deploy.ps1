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

# Copy dist to temp
if (Test-Path $BUILD_PATH) {
    Remove-Item -Recurse -Force $BUILD_PATH
}
Copy-Item -Recurse -Force .\dist $BUILD_PATH

# --- TARGET BRANCH ---
git checkout dynamic-2

Write-Host "Cleaning branch..."
git rm -rf . > $null 2>&1

# Copy only build output
Write-Host "Copying build files..."
Copy-Item -Recurse -Force "$BUILD_PATH\*" .

Remove-Item -Recurse -Force $BUILD_PATH

# Stage everything
git add -A

# Commit if changes exist
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