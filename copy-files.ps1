# PowerShell Script untuk Copy Files ke Repository GitHub
# Jalankan script ini setelah clone repository Anda

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoPath
)

Write-Host "🚀 Copying Gowa Education News API files..." -ForegroundColor Green

# Validasi path repository
if (-not (Test-Path $RepoPath)) {
    Write-Host "❌ Repository path tidak ditemukan: $RepoPath" -ForegroundColor Red
    Write-Host "Pastikan Anda sudah clone repository dengan:" -ForegroundColor Yellow
    Write-Host "git clone https://github.com/ardiardi1995/berita-disdik-api.git" -ForegroundColor Yellow
    exit 1
}

# Buat folder struktur
$ApiPath = Join-Path $RepoPath "api"
$LibPath = Join-Path $RepoPath "lib"

if (-not (Test-Path $ApiPath)) { New-Item -ItemType Directory -Path $ApiPath }
if (-not (Test-Path $LibPath)) { New-Item -ItemType Directory -Path $LibPath }

# Copy root files
$RootFiles = @("package.json", "vercel.json", "README.md", ".gitignore")
foreach ($file in $RootFiles) {
    if (Test-Path $file) {
        Copy-Item $file -Destination $RepoPath -Force
        Write-Host "✅ Copied: $file" -ForegroundColor Green
    }
}

# Copy API files
$ApiFiles = @("index.js", "news.js", "scrape.js", "sources.js", "stats.js")
foreach ($file in $ApiFiles) {
    $SourcePath = Join-Path "api" $file
    if (Test-Path $SourcePath) {
        Copy-Item $SourcePath -Destination $ApiPath -Force
        Write-Host "✅ Copied: api/$file" -ForegroundColor Green
    }
}

# Copy Lib files
$LibFiles = @("database.js", "scraper.js")
foreach ($file in $LibFiles) {
    $SourcePath = Join-Path "lib" $file
    if (Test-Path $SourcePath) {
        Copy-Item $SourcePath -Destination $LibPath -Force
        Write-Host "✅ Copied: lib/$file" -ForegroundColor Green
    }
}

Write-Host "`n🎉 All files copied successfully!" -ForegroundColor Green
Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. cd $RepoPath" -ForegroundColor White
Write-Host "2. npm install" -ForegroundColor White
Write-Host "3. git add ." -ForegroundColor White
Write-Host "4. git commit -m 'Add Gowa Education News API'" -ForegroundColor White
Write-Host "5. git push origin main" -ForegroundColor White
Write-Host "6. vercel --prod" -ForegroundColor White