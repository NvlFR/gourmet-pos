# Gourmet POS 🍲

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

Aplikasi Point-of-Sale (POS) modern dan komprehensif yang dirancang khusus untuk bisnis F&B seperti restoran, kafe, dan katering. Fitur unggulannya adalah manajemen inventaris hingga level bahan baku, memungkinkan kontrol biaya dan efisiensi operasional yang presisi.

---

### ✨ Demo & Screenshot

[**(Link ke Live Demo akan ada di sini)**](...)

![Gourmet POS Screenshot](https://via.placeholder.com/800x450.png?text=Screenshot+Aplikasi+Anda+di+Sini)
_Ganti gambar placeholder di atas dengan screenshot aplikasi Anda jika sudah jadi._

---

### 🎯 Filosofi & Tujuan Proyek

Proyek ini dibangun dengan filosofi **"Efisiensi & Kejelasan"**. Tujuannya adalah untuk menciptakan sebuah alat kerja yang powerful namun tetap intuitif, membantu pemilik usaha membuat keputusan berdasarkan data yang akurat, mulai dari perhitungan _food cost_ per porsi hingga analisis profitabilitas menu.

---

### 🚀 Fitur Utama

- **📦 Manajemen Inventaris:** CRUD untuk bahan baku dan data supplier.
- **📖 Manajemen Menu & Resep:** Menautkan produk jadi dengan resep bahan baku (Bill of Materials).
- **💳 Transaksi Kasir (POS):** Antarmuka kasir yang cepat dan efisien dengan pengurangan stok otomatis.
- **🚚 Manajemen Pembelian:** Membuat Purchase Order (PO) ke supplier dan mencatat penerimaan barang.
- **🍳 Kitchen Display System (KDS):** Tampilan pesanan real-time untuk staf dapur.
- **📊 Dasbor & Laporan:** Laporan penjualan, analisis profitabilitas per menu, dan laporan stok.
- **👥 Manajemen Pengguna:** Sistem otentikasi dan hak akses berbasis peran (Admin, Kasir, Dapur).
- **🔔 Peringatan Stok Rendah:** Notifikasi otomatis untuk bahan baku yang akan habis.
- **⚙️ Pengaturan:** Konfigurasi profil usaha, pajak, dan biaya layanan.

---

### 🛠️ Tumpukan Teknologi (Tech Stack)

| Kategori       | Teknologi                                                               |
| :------------- | :---------------------------------------------------------------------- |
| **Frontend**   | React.js, Chakra UI, React Router, Zustand, TanStack Query, Axios       |
| **Backend**    | Supabase (PostgreSQL, Authentication, Functions) / Node.js (Express.js) |
| **Deployment** | Vercel (Frontend), Supabase Cloud (Backend)                             |
| **Tools**      | Vite, ESLint, Prettier, Git                                             |

---

### ⚙️ Persiapan & Instalasi

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

1.  **Clone repositori ini:**

    ```bash
    git clone [https://github.com/](https://github.com/)[NamaUsernameAnda]/gourmet-pos.git
    cd gourmet-pos
    ```

2.  **Install dependensi:**

    ```bash
    npm install
    ```

    _atau jika Anda menggunakan Yarn:_

    ```bash
    yarn install
    ```

3.  **Setup Environment Variables:**
    Buat file baru bernama `.env.local` di root folder proyek dan salin konten dari `.env.example` (jika ada). Isi dengan kunci API dari Supabase Anda.
    ```env
    VITE_SUPABASE_URL="https://[ID_PROYEK_ANDA].supabase.co"
    VITE_SUPABASE_ANON_KEY="[KUNCI_ANON_ANDA]"
    ```

---

### ▶️ Menjalankan Aplikasi

- **Menjalankan mode development:**

  ```bash
  npm run dev
  ```

  Aplikasi akan berjalan di `http://localhost:5173` (atau port lain yang tersedia).

- **Mem-build untuk produksi:**
  ```bash
  npm run build
  ```

---

### 📁 Struktur Folder

```
src/
├── assets/
├── components/
├── features/
├── hooks/
├── lib/
├── pages/
└── store/
```

---

### 🤝 Kontribusi

Kontribusi, isu, dan permintaan fitur sangat diterima! Jangan ragu untuk membuat _pull request_ atau membuka _issue_ baru.

---

### 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.
