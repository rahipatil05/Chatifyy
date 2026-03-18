$packages = Invoke-RestMethod -Uri "http://localhost:2000/api/v2/packages" -Method Get
$total = $packages.Count
$i = 0

foreach ($pkg in $packages) {
    $i++
    $lang = $pkg.language
    $ver = $pkg.language_version
    $installed = $pkg.installed

    if ($installed) {
        Write-Host "[$i/$total] SKIP (already installed): $lang $ver"
        continue
    }

    Write-Host "[$i/$total] Installing: $lang $ver ..."
    try {
        $body = @{ language = $lang; version = $ver } | ConvertTo-Json
        $result = Invoke-RestMethod -Uri "http://localhost:2000/api/v2/packages" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
        Write-Host "  -> OK: $($result.language) $($result.language_version)"
    } catch {
        Write-Host "  -> FAILED: $_"
    }
}

Write-Host ""
Write-Host "Done! Installed runtimes:"
Invoke-RestMethod -Uri "http://localhost:2000/api/v2/runtimes" -Method Get | ForEach-Object {
    Write-Host "  - $($_.language) $($_.version)"
}
