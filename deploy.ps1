# ========================================================
# Deploy Script - Upload ke cPanel via FTP
# PT. Kharisma Elsyadai Sukses Abadi - kesa.co.id
# ========================================================
# Jalankan: .\deploy.ps1

# --- KONFIGURASI (ISI DATA ANDA) ---
$FTP_HOST   = "kesa.co.id"          # Ganti dengan hostname/IP server
$FTP_USER   = "USERNAME_CPANEL"      # Ganti dengan username cPanel
$FTP_PASS   = "PASSWORD_CPANEL"      # Ganti dengan password cPanel
$FTP_PATH   = "/public_html"         # Path tujuan di server
$LOCAL_PATH = $PSScriptRoot          # Folder project ini
# ------------------------------------

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DEPLOY WEBSITE - kesa.co.id" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Validasi konfigurasi
if ($FTP_USER -eq "USERNAME_CPANEL") {
    Write-Host "[!] PERHATIAN: Edit file deploy.ps1 terlebih dahulu!" -ForegroundColor Yellow
    Write-Host "    Isi FTP_HOST, FTP_USER, dan FTP_PASS dengan data hosting Anda." -ForegroundColor Yellow
    Write-Host ""
    exit
}

# File yang akan di-upload
$files = @(
    @{ Local = "index.html";    Remote = "$FTP_PATH/index.html" },
    @{ Local = ".htaccess";     Remote = "$FTP_PATH/.htaccess" },
    @{ Local = "robots.txt";    Remote = "$FTP_PATH/robots.txt" },
    @{ Local = "css/style.css"; Remote = "$FTP_PATH/css/style.css" },
    @{ Local = "js/main.js";    Remote = "$FTP_PATH/js/main.js" }
)

# Buat credential
$secPass = ConvertTo-SecureString $FTP_PASS -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential($FTP_USER, $secPass)

# Fungsi upload FTP
function Upload-FtpFile {
    param (
        [string]$LocalFile,
        [string]$RemotePath
    )
    
    $ftpUri = "ftp://${FTP_HOST}${RemotePath}"
    
    try {
        $fileContent = [System.IO.File]::ReadAllBytes($LocalFile)
        
        $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUri)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FTP_USER, $FTP_PASS)
        $ftpRequest.UseBinary = $true
        $ftpRequest.UsePassive = $true
        $ftpRequest.ContentLength = $fileContent.Length
        
        $stream = $ftpRequest.GetRequestStream()
        $stream.Write($fileContent, 0, $fileContent.Length)
        $stream.Close()
        
        $response = $ftpRequest.GetResponse()
        $status = $response.StatusDescription
        $response.Close()
        
        Write-Host "  [OK] $LocalFile -> $RemotePath" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "  [GAGAL] $LocalFile : $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Buat folder di FTP
function Create-FtpDirectory {
    param ([string]$DirPath)
    
    $ftpUri = "ftp://${FTP_HOST}${DirPath}"
    
    try {
        $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUri)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FTP_USER, $FTP_PASS)
        $response = $ftpRequest.GetResponse()
        $response.Close()
        Write-Host "  [OK] Folder dibuat: $DirPath" -ForegroundColor Green
    }
    catch {
        # Folder mungkin sudah ada, lanjutkan
    }
}

# Mulai upload
Write-Host "[1/3] Membuat folder di server..." -ForegroundColor Cyan
Create-FtpDirectory "$FTP_PATH/css"
Create-FtpDirectory "$FTP_PATH/js"

Write-Host ""
Write-Host "[2/3] Mengupload file..." -ForegroundColor Cyan

$success = 0
$failed = 0

foreach ($file in $files) {
    $localPath = Join-Path $LOCAL_PATH $file.Local
    
    if (Test-Path $localPath) {
        $result = Upload-FtpFile -LocalFile $localPath -RemotePath $file.Remote
        if ($result) { $success++ } else { $failed++ }
    }
    else {
        Write-Host "  [SKIP] File tidak ditemukan: $($file.Local)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "[3/3] Selesai!" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Berhasil: $success file" -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "  Gagal: $failed file" -ForegroundColor Red
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Website Anda sekarang bisa diakses di:" -ForegroundColor White
Write-Host "  https://kesa.co.id" -ForegroundColor Yellow
Write-Host ""
