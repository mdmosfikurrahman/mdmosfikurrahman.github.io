$ErrorActionPreference = 'Stop'  # Exit on error

# Ensure TMP is set, default to $env:TEMP
$TMP = if ($env:TMPDIR) { $env:TMPDIR } else { $env:TEMP }

# Checkout source branch and build
git checkout dynamic-source-2
git pull origin dynamic-source-2

npm install
npm run build

# Backup dist
Copy-Item -Recurse -Force .\dist "$TMP\dist-backup"

# Switch to target branch
git checkout dynamic-2
git pull origin dynamic-2

# Remove everything except .git and .idea
Get-ChildItem -Force | Where-Object {
    $_.Name -ne '.git' -and
    $_.Name -ne '.idea'
} | Remove-Item -Recurse -Force

# Restore dist backup
Copy-Item -Recurse -Force "$TMP\dist-backup\*" .
Remove-Item -Recurse -Force "$TMP\dist-backup"

# Commit and push
git add .
git commit -m "Deploy from dynamic-source-2 at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push -u origin dynamic-2

# Switch back
git checkout dynamic-source-2
