# PRD — Digital Wedding Invitation (Single Page)

## 1. Overview
Proyek ini bertujuan untuk membangun satu halaman **Undangan Pernikahan Digital (E-Invitation)** yang berperforma tinggi dan responsif. Fokus utamanya adalah kemudahan distribusi melalui WhatsApp dengan personalisasi nama tamu tanpa memerlukan sistem backend yang kompleks.

## 2. Requirements
- **Tech Stack:** HTML5, Tailwind CSS (via CDN), dan Vanilla JavaScript.
- **Hosting:** Platform hosting statis (seperti GitHub Pages, Netlify, atau Vercel) untuk memastikan *loading* cepat.
- **Data Input:** Google Sheets sebagai alat manajemen tamu dan generator tautan pesan WhatsApp.

## 3. Core Features
- **Personalisasi Nama Tamu:** Menggunakan URL Parameter (`?to=NamaTamu`) untuk menampilkan nama tamu secara dinamis di halaman undangan.
- **Desain Responsif:** Tampilan diutamakan untuk perangkat mobile (*mobile-first*).
- **Animasi Interaktif:** Menggunakan library **AOS (Animate On Scroll)** untuk efek elemen yang muncul saat di-scroll.
- **Background Music:** Pemutaran musik otomatis menggunakan library **Howler.js**.
- **Fitur RSVP:** Pop-up konfirmasi kehadiran menggunakan **SweetAlert2**.
- **Integrasi Peta:** Penempatan lokasi acara menggunakan Google Maps API atau Leaflet.

## 4. User Flow
### Admin (Pengguna):
- Menginput data Nama dan Nomor HP tamu di Google Sheets.
- Menghasilkan tautan WhatsApp otomatis melalui formula spreadsheet.
- Klik tautan untuk mengirim pesan berisi link undangan personal ke tamu.

### Tamu:
- Menerima pesan WhatsApp dan mengklik link (contoh: `domain.com/?to=Budi`).
- Membuka website dan melihat nama mereka tertera langsung di halaman.
- Menjelajahi konten undangan dengan animasi dan musik.

## 5. Architecture
- **Frontend Statis:** Seluruh logika tampilan dan pengambilan parameter URL ditangani di sisi klien (*client-side*) menggunakan JavaScript sederhana.
- **Zero Backend:** Tidak ada database server; data tamu bersifat pasif melalui URL parameter.
- **External Integration:** Mengandalkan CDN untuk library CSS dan JS guna mempercepat proses pengembangan.

## 6. Database Schema (Google Sheets)
Spreadsheet akan berfungsi sebagai panel kontrol dengan struktur kolom sebagai berikut:

| Nama Tamu (Kolom A) | No HP (Kolom B) | Link Undangan (Kolom C) | Link WA Generator (Kolom D) |
| :--- | :--- | :--- | :--- |
| Budi | 0812345678 | `domain.com/?to=Budi` | `[Link WhatsApp Auto]` |

## 7. Design & Technical Constraints
- **Performance:** Website harus ringan agar langsung terbuka saat diklik dari aplikasi WhatsApp.
- **Browser Compatibility:** Pemutaran musik otomatis harus mengikuti kebijakan *autoplay* browser (biasanya butuh satu interaksi klik dari user).
- **Mobile-First:** Fokus utama pada aspek rasio layar smartphone.