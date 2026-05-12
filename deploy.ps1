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

function Remove-WorkingTreeExceptGit {
    # Remove every entry in the working directory except .git.
    # Use ForEach-Object so a single locked file surfaces a clear error.
    Get-ChildItem -Force -LiteralPath '.' |
        Where-Object { $_.Name -ne '.git' } |
        ForEach-Object {
            Remove-Item -LiteralPath $_.FullName -Recurse -Force -ErrorAction Stop
        }
}

function Ensure-GitignoreLine {
    param([string]$Path, [string]$Line)
    if (-not (Test-Path -LiteralPath $Path)) {
        Set-Content -LiteralPath $Path -Value $Line -Encoding ascii
        return
    }
    $existing = Get-Content -LiteralPath $Path -ErrorAction SilentlyContinue
    if ($existing -notcontains $Line) {
        Add-Content -LiteralPath $Path -Value $Line -Encoding ascii
    }
}

# -----------------------------------------------------------------------------
# 1. Build on the source branch
# -----------------------------------------------------------------------------
Write-Step "Switching to $SourceBranch and pulling latest"
git checkout $SourceBranch
Assert-LastExit "Failed to checkout $SourceBranch"
git pull $Remote $SourceBranch
Assert-LastExit "Failed to pull $SourceBranch"

Write-Step "Installing dependencies"
npm install
Assert-LastExit "npm install failed"

Write-Step "Building production bundle"
npm run build
Assert-LastExit "Build failed"

if (-not (Test-Path -LiteralPath '.\dist')) {
    throw "Build did not produce a dist/ folder"
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
# 3. Switch to the target (deploy) branch
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
Write-Step "Wiping working tree (preserving .git) and restoring dist"
Remove-WorkingTreeExceptGit

# Copy backup contents into repo root.
Copy-Item -Path (Join-Path $BackupDir '*') -Destination '.' -Recurse -Force

# Clean up backup.
Remove-Item -LiteralPath $BackupDir -Recurse -Force

# Make sure .idea/ stays out of the deploy branch.
Ensure-GitignoreLine -Path '.gitignore' -Line '.idea/'

# Untrack .idea if it had ever slipped in. --ignore-unmatch keeps exit code 0.
git rm -r --cached --ignore-unmatch --quiet .idea 2>$null
$LASTEXITCODE = 0

# -----------------------------------------------------------------------------
# 5. Commit & push (handle the no-change case)
# -----------------------------------------------------------------------------
Write-Step "Staging and committing"
git add -A
Assert-LastExit "git add failed"

git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "   No changes to commit; skipping push." -ForegroundColor DarkYellow
    $LASTEXITCODE = 0
} else {
    $LASTEXITCODE = 0
    $stamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    git commit -m "Deploy from $SourceBranch at $stamp"
    Assert-LastExit "git commit failed"

    Write-Step "Pushing to $Remote/$TargetBranch"
    git push -u $Remote $TargetBranch
    Assert-LastExit "git push failed"
}

# -----------------------------------------------------------------------------
# 6. Return to the source branch
# -----------------------------------------------------------------------------
Write-Step "Returning to $SourceBranch"
git checkout $SourceBranch
Assert-LastExit "Failed to return to $SourceBranch"

Write-Host ""
Write-Host "Deploy complete." -ForegroundColor Green
