# ========================================================
# PANDUAN UPLOAD WEBSITE ke cPanel - kesa.co.id
# PT. Kharisma Elsyadai Sukses Abadi
# ========================================================

## LANGKAH 1: Login ke cPanel
- Buka browser, akses: https://kesa.co.id:2083
  (atau URL cPanel dari provider hosting Anda)
- Login dengan username & password dari provider hosting

## LANGKAH 2: Setting Domain (jika belum)
- Di cPanel, cari menu "Domains" atau "Addon Domains"
- Pastikan domain kesa.co.id sudah terpasang dan 
  mengarah ke folder: /public_html/
- Jika domain baru dibeli, pastikan nameserver sudah 
  diarahkan ke hosting (cek di panel domain registrar)

## LANGKAH 3: Upload File
### Cara A - Via cPanel File Manager (Paling Mudah):
1. Di cPanel, klik "File Manager"
2. Navigasi ke folder "public_html"
3. HAPUS file default (index.html bawaan cPanel jika ada)
4. Klik "Upload" di toolbar atas
5. Upload semua file berikut:
   - index.html
   - .htaccess
   - robots.txt
   - css/style.css
   - js/main.js
6. Pastikan struktur folder di public_html:
   public_html/
   ├── index.html
   ├── .htaccess
   ├── robots.txt
   ├── css/
   │   └── style.css
   └── js/
       └── main.js

### Cara B - Via FTP (FileZilla):
1. Download & install FileZilla: https://filezilla-project.org
2. Buka FileZilla, masukkan:
   - Host: kesa.co.id (atau IP server)
   - Username: (username cPanel)
   - Password: (password cPanel)
   - Port: 21
3. Klik "Quickconnect"
4. Di panel kanan (server), navigasi ke /public_html/
5. Di panel kiri (lokal), navigasi ke folder project ini
6. Pilih semua file → drag ke panel kanan
7. Overwrite jika diminta

### Cara C - Via Terminal PowerShell (Script otomatis):
Jalankan file deploy.ps1 yang sudah disiapkan:
   .\deploy.ps1

## LANGKAH 4: Setting SSL (HTTPS)
1. Di cPanel, cari "SSL/TLS" atau "Let's Encrypt"
2. Klik "Manage SSL Sites" atau "Issue Certificate"
3. Pilih domain kesa.co.id
4. Klik "Issue" / "Install"
5. Tunggu beberapa menit, SSL akan aktif

## LANGKAH 5: Cek Website
- Buka https://kesa.co.id di browser
- Pastikan semua halaman tampil dengan benar
- Cek di mobile juga untuk responsiveness

## LANGKAH 6: Setting DNS (jika domain baru)
Jika domain baru didaftarkan, atur DNS di panel registrar:
- Nameserver 1: (dari provider hosting)
- Nameserver 2: (dari provider hosting)
  Contoh Niagahoster: ns1.niagahoster.com, ns2.niagahoster.com
  Contoh Domainesia: ns1.domainesia.com, ns2.domainesia.com

DNS propagation membutuhkan waktu 1-48 jam.

## TROUBLESHOOTING
- Jika 404: Pastikan file index.html ada di root public_html
- Jika CSS/JS tidak load: Cek path folder css/ dan js/
- Jika domain belum aktif: Tunggu DNS propagation
- Jika HTTP, bukan HTTPS: Aktifkan SSL di cPanel
