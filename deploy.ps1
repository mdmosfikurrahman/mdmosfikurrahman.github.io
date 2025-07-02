# ===============================================
# 🔁 Automated Deployment Script (GitHub Pages)
# ===============================================

# 1. Ensure you're in the current script's directory
Set-Location -Path $PSScriptRoot

Write-Host "✅ Checking out dynamic-source..."
git checkout dynamic-source
git pull origin dynamic-source

Write-Host "🛠 Installing dependencies..."
npm install

Write-Host "🔨 Building project..."
npm run build

Write-Host "🌿 Switching to dynamic-2..."
git checkout -B dynamic-2

Write-Host "🧹 Cleaning up old files (except .git and dist)..."
Get-ChildItem -Force | Where-Object {
    $_.Name -ne '.git' -and $_.Name -ne 'dist'
} | Remove-Item -Recurse -Force

Write-Host "📦 Moving new dist files to root..."
Get-ChildItem -Path .\dist | ForEach-Object {
    Move-Item -Path $_.FullName -Destination . -Force
}

Write-Host "🗑 Removing dist folder..."
Remove-Item -Recurse -Force .\dist

Write-Host "📤 Committing and pushing to dynamic-2..."
git add .
git commit -m "🚀 Deploy from dynamic-source at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push -u origin dynamic-2

Write-Host "✅ Deployment completed successfully!"
