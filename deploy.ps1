$ErrorActionPreference = 'Stop'

$TMP = if ($env:TMPDIR) { $env:TMPDIR } else { $env:TEMP }

# --- SOURCE ---
git checkout dynamic-source-2
git pull origin dynamic-source-2

npm install
npm run build

# Backup dist
Copy-Item -Recurse -Force .\dist "$TMP\dist-backup"

# --- TARGET ---
git checkout dynamic-2
git pull origin dynamic-2

# Remove everything except .git
Get-ChildItem -Force | Where-Object {
    $_.Name -ne '.git'
} | Remove-Item -Recurse -Force

# Restore dist
Copy-Item -Recurse -Force "$TMP\dist-backup\*" .
Remove-Item -Recurse -Force "$TMP\dist-backup"

# Ignore .idea permanently
".idea/" | Out-File -Encoding utf8 -Append .gitignore

# Remove .idea if previously tracked
git rm -r --cached .idea 2>$null

# Commit & push
git add .
git commit -m "Deploy from dynamic-source-2 at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push -u origin dynamic-2

# Back to source
git checkout dynamic-source-2