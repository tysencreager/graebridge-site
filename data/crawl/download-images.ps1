# Graebridge image archive (Windows PowerShell). Run from the folder where you want the images.
# 1) downloads the 37 images the crawl found (the -1920w versions)
# 2) tries the un-suffixed originals (Duda/Hibu usually keeps the full-size upload at the same path without /opt/ and -1920w)
# 3) probes the gallery series the crawler could not see (the gallery page loads them with JavaScript); 404s are expected and silent
$ErrorActionPreference = "SilentlyContinue"
New-Item -ItemType Directory -Force -Path found, originals, gallery-probe | Out-Null
function Grab($list, $dir) {
  Get-Content $list | ForEach-Object {
    $u = $_.Trim(); if (-not $u) { return }
    $name = [System.Uri]::UnescapeDataString(($u -split '/')[-1]) -replace '\+', ' '
    $out = Join-Path $dir $name
    try { Invoke-WebRequest -Uri $u -OutFile $out -UseBasicParsing -TimeoutSec 30
          if ((Get-Item $out).Length -lt 2000) { Remove-Item $out } } catch { }
  }
}
Grab "image-urls-found.txt" "found"
Grab "image-urls-originals-to-try.txt" "originals"
Grab "image-urls-gallery-probe.txt" "gallery-probe"
"Done. found: $((Get-ChildItem found).Count)  originals: $((Get-ChildItem originals).Count)  gallery-probe: $((Get-ChildItem gallery-probe).Count)"
