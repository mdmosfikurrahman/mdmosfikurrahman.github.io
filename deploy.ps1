#requires -Version 5.1
$ErrorActionPreference = 'Stop'

# -----------------------------------------------------------------------------
# Config
# -----------------------------------------------------------------------------
$SourceBranch = 'dynamic-source-2'
$TargetBranch = 'dynamic-2'
$Remote       = 'origin'

# Run from the script's own folder so relative paths work regardless of cwd.
Set-Location -LiteralPath (Split-Path -Parent $MyInvocation.MyCommand.Path)

# Unique backup path outside the repo (avoid collisions across runs).
$TempRoot  = [System.IO.Path]::GetTempPath()
$BackupDir = Join-Path $TempRoot ("deploy-dist-" + [guid]::NewGuid().ToString('N').Substring(0, 8))

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------
function Assert-LastExit {
    param([string]$Message)
    if ($LASTEXITCODE -ne 0) {
        throw "$Message (exit $LASTEXITCODE)"
    }
}

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host ">> $Message" -ForegroundColor Cyan
}

function Clear-TrackedWorkingTree {
    # Remove every tracked file from the index and working tree, but leave
    # untracked / gitignored items (node_modules, locked binaries, etc.) alone.
    # Avoids the Windows "esbuild.exe is locked" failure during deploys.
    git rm -rf --quiet . 2>$null
    # `git rm` on an orphan/empty index returns non-zero; treat as success.
    $LASTEXITCODE = 0
}

function Write-DeployGitignore {
    # Deploy branch carries built artifacts at the repo root. Make sure nothing
    # from the source toolchain (node_modules, leftover dist/, IDE folders)
    # accidentally gets committed when we `git add -A`.
    @(
        'node_modules/'
        'dist/'
        '.idea/'
        '.vscode/'
        '.claude/'
        '.DS_Store'
        'Thumbs.db'
        '*.log'
    ) | Set-Content -LiteralPath '.gitignore' -Encoding ascii
}

# -----------------------------------------------------------------------------
# 1. Build on the source branch
# -----------------------------------------------------------------------------
Write-Step "Switching to $SourceBranch and pulling latest"
git checkout $SourceBranch
Assert-LastExit "Failed to checkout $SourceBranch"
git pull $Remote $SourceBranch
Assert-LastExit "Failed to pull $SourceBranch"

# .env holds the VITE_JSONBIN_* values that get inlined at build time. It is
# gitignored and does not survive the branch-switch/clean cycle, so guarantee
# it exists BEFORE the build — otherwise remote template sync ships dead.
Write-Step "Ensuring .env exists for the build"
if (-not (Test-Path -LiteralPath '.\.env')) {
    if (Test-Path -LiteralPath '.\.env.example') {
        Copy-Item -LiteralPath '.\.env.example' -Destination '.\.env' -Force
        Write-Host "   .env was missing; restored from .env.example" -ForegroundColor DarkYellow
    } else {
        throw ".env and .env.example are both missing; cannot embed JSONBin config"
    }
} else {
    Write-Host "   .env present." -ForegroundColor DarkGray
}

Write-Step "Installing dependencies"
npm install
Assert-LastExit "npm install failed"

Write-Step "Building production bundle"
npm run build
Assert-LastExit "Build failed"

if (-not (Test-Path -LiteralPath '.\dist')) {
    throw "Build did not produce a dist/ folder"
}

# .env's values are already inlined into dist/ by Vite at this point (that's
# the whole reason it had to exist before the build). Remove it now so it
# can never leak onto the deploy branch as a stray untracked file when we
# switch branches below - the exact same class of problem this script
# already guards node_modules against, just for a different file. Nothing
# is lost: .env.example remains the source of truth and gets copied back
# next run. A genuinely different local override belongs in .env.local
# (Vite loads it too, and this script never touches it).
if (Test-Path -LiteralPath '.\.env') {
    Remove-Item -LiteralPath '.\.env' -Force
}

# -----------------------------------------------------------------------------
# 2. Back up dist outside the repo (so it survives branch switch + wipe)
# -----------------------------------------------------------------------------
Write-Step "Backing up dist -> $BackupDir"
if (Test-Path -LiteralPath $BackupDir) {
    Remove-Item -LiteralPath $BackupDir -Recurse -Force
}
# Copy contents of dist into a fresh backup dir.
New-Item -ItemType Directory -Path $BackupDir | Out-Null
Copy-Item -Path '.\dist\*' -Destination $BackupDir -Recurse -Force

# -----------------------------------------------------------------------------
# 3. Stash any uncommitted source-branch edits so checkout is clean
# -----------------------------------------------------------------------------
$Stashed = $false
$dirtyOutput = git status --porcelain
if ($LASTEXITCODE -ne 0) { throw "git status failed (exit $LASTEXITCODE)" }
if ($dirtyOutput) {
    Write-Step "Stashing uncommitted source-branch changes"
    git stash push -u -m "deploy-autostash-$(Get-Date -Format yyyyMMddHHmmss)" | Out-Null
    Assert-LastExit "git stash failed"
    $Stashed = $true
}

# -----------------------------------------------------------------------------
# 4. Switch to the target (deploy) branch
# -----------------------------------------------------------------------------
Write-Step "Switching to $TargetBranch"

# Local exists?
git rev-parse --verify --quiet "refs/heads/$TargetBranch" *> $null
$localExists = ($LASTEXITCODE -eq 0)
$LASTEXITCODE = 0

if ($localExists) {
    git checkout $TargetBranch
    Assert-LastExit "Failed to checkout $TargetBranch"
    # Pull only if it has an upstream configured.
    git rev-parse --abbrev-ref "$TargetBranch@{upstream}" *> $null
    if ($LASTEXITCODE -eq 0) {
        git pull $Remote $TargetBranch
        Assert-LastExit "Failed to pull $TargetBranch"
    } else {
        $LASTEXITCODE = 0
    }
} else {
    # Track remote if it exists, else create orphan.
    git ls-remote --exit-code --heads $Remote $TargetBranch *> $null
    $remoteExists = ($LASTEXITCODE -eq 0)
    $LASTEXITCODE = 0
    if ($remoteExists) {
        git checkout -B $TargetBranch "$Remote/$TargetBranch"
        Assert-LastExit "Failed to track $Remote/$TargetBranch"
    } else {
        git checkout --orphan $TargetBranch
        Assert-LastExit "Failed to create orphan $TargetBranch"
    }
}

# -----------------------------------------------------------------------------
# 4. Replace working tree with the built dist
# -----------------------------------------------------------------------------
Write-Step "Removing previously deployed files and restoring fresh dist"
Clear-TrackedWorkingTree

# Copy backup contents into repo root.
Copy-Item -Path (Join-Path $BackupDir '*') -Destination '.' -Recurse -Force

# Clean up backup.
Remove-Item -LiteralPath $BackupDir -Recurse -Force

# Write a fresh .gitignore tuned for the deploy branch.
Write-DeployGitignore

# -----------------------------------------------------------------------------
# 5. Commit & push (handle the no-change case)
# -----------------------------------------------------------------------------
Write-Step "Staging and committing"
git add -A
Assert-LastExit "git add failed"

# `git diff --cached --quiet` proved unreliable here (its exit code came out
# stale/wrong after `git add -A` emitted CRLF-conversion warnings on stderr),
# reporting "no changes" even when the build genuinely changed — which then
# left real, uncommitted differences sitting in the working tree and made
# the branch-return checkout below fail. `git status --porcelain` is a plain
# text check, immune to that: empty output unambiguously means nothing is
# staged. Same pattern as the dirty-check above.
$stagedOutput = git status --porcelain
if ($LASTEXITCODE -ne 0) { throw "git status failed (exit $LASTEXITCODE)" }
if (-not $stagedOutput) {
    Write-Host "   No changes to commit; skipping push." -ForegroundColor DarkYellow
} else {
    $stamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    git commit -m "Deploy from $SourceBranch at $stamp"
    Assert-LastExit "git commit failed"

    Write-Step "Pushing to $Remote/$TargetBranch"
    git push -u $Remote $TargetBranch
    Assert-LastExit "git push failed"
}

# -----------------------------------------------------------------------------
# 6. Return to the source branch and restore any stash
# -----------------------------------------------------------------------------
Write-Step "Returning to $SourceBranch"
git checkout $SourceBranch
Assert-LastExit "Failed to return to $SourceBranch"

if ($Stashed) {
    Write-Step "Restoring stashed source-branch changes"
    git stash pop
    Assert-LastExit "git stash pop failed (resolve manually with 'git stash list')"
}

Write-Host ""
Write-Host "Deploy complete." -ForegroundColor Green
