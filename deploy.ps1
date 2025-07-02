# ============================
# GitHub Pages Deploy Script
# ============================

# Set location to script's directory
Set-Location -Path $PSScriptRoot

Write-Host "Step 1: Checkout dynamic-source"
git checkout dynamic-source
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

Write-Host "Step 6: Move dist contents to root"
Get-ChildItem -Path .\dist | ForEach-Object {
    Move-Item -Path $_.FullName -Destination . -Force
}

Write-Host "Step 7: Delete dist folder"
Remove-Item -Recurse -Force .\dist

Write-Host "Step 8: Commit and push"
git add .
$time = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
git commit -m "Deploy from dynamic-source at $time"
git push -u origin dynamic-2

Write-Host "Deployment completed successfully."
