git checkout dynamic-source-2
git pull origin dynamic-source-2

npm install

npm run build

Copy-Item -Recurse -Force .\dist "$env:TEMP\dist-backup"

git checkout dynamic-2
git pull origin dynamic-2

Get-ChildItem -Force | Where-Object {
    $_.Name -ne '.git' -and
            $_.Name -ne '.idea'
} | Remove-Item -Recurse -Force

Copy-Item -Recurse -Force "$env:TEMP\dist-backup\*" .
Remove-Item -Recurse -Force "$env:TEMP\dist-backup"
git add .
git commit -m "Deploy from dynamic-source-2 at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push -u origin dynamic-2
git checkout dynamic-source-2