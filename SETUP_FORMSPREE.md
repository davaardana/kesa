# Setup Formspree untuk Contact Form

## Langkah-langkah Setup:

### 1. Daftar di Formspree
- Buka https://formspree.io
- Klik "Sign Up" dan daftar dengan email
- Verify email Anda

### 2. Buat Form Baru
- Di dashboard Formspree, klik "New Project"
- Pilih email: `info@kesa.co.id`
- Nama project: `KESA Website Contact Form`
- Anda akan mendapat Form ID (misal: `f/xxxxx`)

### 3. Update Contact Form
- Buka file `contact.html`
- Cari line yang berisi: `<form id="contactForm" action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST">`
- Ganti `YOUR_FORMSPREE_ID` dengan ID Anda dari Formspree
- Contoh: `<form id="contactForm" action="https://formspree.io/f/f12ab34cd" method="POST">`

### 4. Test Form
- Buka website Anda di https://kesa.co.id/contact.html
- Isi dan kirim form test
- Cek email `info@kesa.co.id` untuk konfirmasi

### 5. Deploy
- Setelah berhasil test, deploy website ke server

## Catatan:
- WhatsApp fallback sudah built-in (jika Formspree tidak responsif)
- Form akan otomatis redirect ke WhatsApp jika email gagal
- Contact info WhatsApp: +6283808925282

## Troubleshooting:
- Jika email tidak diterima, check spam folder
- Pastikan CORS allowed di Formspree settings
- Cek console browser (F12) untuk error messages
