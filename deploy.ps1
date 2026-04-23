$ErrorActionPreference = 'Stop'

$TMP = if ($env:TMPDIR) { $env:TMPDIR } else { $env:TEMP }
$BACKUP_PATH = "$TMP\dist-backup"

Write-Host "🚀 Starting deployment..."

# --- SOURCE ---
git checkout dynamic-source-2

if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..."
    npm install --prefer-offline --no-audit --progress=false
}

Write-Host "🏗️ Building..."
npm run build

# Backup dist
if (Test-Path $BACKUP_PATH) {
    Remove-Item -Recurse -Force $BACKUP_PATH
}
Copy-Item -Recurse -Force .\dist $BACKUP_PATH

# --- TARGET ---
git checkout dynamic-2

# --- WRITE .gitignore FIRST ---
Write-Host "🛡️ Writing .gitignore..."

@"
# Dependencies
node_modules/
.pnpm-store/
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
.yarn-integrity
jspm_packages/

# Build output
dist/
dist-ssr/
build/
out/
.next/
.nuxt/
.cache/
.parcel-cache/
.turbo/

# Vite
.vite/
*.local

# TypeScript
*.tsbuildinfo

# Testing
coverage/
.nyc_output/
.vitest-cache/

# Env
.env
.env.local
.env.*.local
.env.development.local
.env.test.local
.env.production.local
!.env.example

# Logs
*.log
logs/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# IDE
.idea/
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json.sample

# AI tooling
.claude/
.cursor/
.aider*
.roo/

# OS
.DS_Store
Thumbs.db
desktop.ini
$RECYCLE.BIN/

# Misc
tmp/
temp/
*.tmp
*.pid
*.pid.lock
*.seed
"@ | Set-Content -Encoding UTF8 .gitignore

# --- HARD RESET WORKING TREE ---
Write-Host "💣 Removing ALL tracked files..."
git rm -rf . > $null 2>&1

# --- REMOVE IGNORED FILES FROM HISTORY (CRITICAL) ---
Write-Host "🧨 Removing ignored files even if tracked..."

git ls-files -i --exclude-standard | ForEach-Object {
    git rm -r --cached --ignore-unmatch $_
}

# --- RESTORE BUILD ONLY ---
Write-Host "📂 Restoring dist..."
Copy-Item -Recurse -Force "$BACKUP_PATH\*" .

Remove-Item -Recurse -Force $BACKUP_PATH

# --- ADD ONLY WHAT IS ALLOWED ---
git add -A

# Extra safety: ensure ignored never staged
git ls-files --cached -i --exclude-standard | ForEach-Object {
    git rm --cached $_
}

# --- COMMIT ---
if (git diff --cached --quiet) {
    Write-Host "⚠️ No changes to commit"
} else {
    git commit -m "Clean deploy from dynamic-source-2 at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git push origin dynamic-2
}

git checkout dynamic-source-2

Write-Host "✅ Clean deployment done"