# ICT Taskflow

**ICT Taskflow** adalah sistem manajemen tugas berbasis web yang dirancang untuk lingkungan sekolah. Dibangun sebagai *Single-Page Application* (SPA) modern, sistem ini memungkinkan admin (guru) untuk mengelola tugas dan siswa untuk melihat serta mengumpulkan tugas secara *real-time*.

## ✨ Fitur Utama

- **Otentikasi Berbasis Peran**: Sistem login terpisah untuk **Admin** dan **Siswa**.
- **Manajemen Tugas (Admin)**: Admin dapat membuat, mengubah, dan menghapus tugas.
- **Dashboard Siswa**: Siswa dapat melihat daftar tugas yang ditujukan untuk kelasnya.
- **Pengumpulan Online**: Siswa mengumpulkan tugas dengan mengirimkan tautan (misalnya Google Drive, Canva), tanpa perlu unggah file.
- **Real-time Update**: Semua data—tugas baru, status pengumpulan—diperbarui secara otomatis tanpa perlu *refresh* halaman, berkat Firebase Firestore.
- **Responsif**: Tampilan yang optimal di berbagai perangkat, dari desktop hingga *mobile*.
- **Notifikasi**: Umpan balik instan untuk setiap aksi (misalnya, berhasil mengumpulkan tugas).

## 🚀 Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, Vue.js 3, Bootstrap 5
- **Backend & Database**: Firebase (Authentication & Firestore)
- **Hosting**: GitHub Pages

## 🛠️ Panduan Instalasi dan Setup

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/username/Taskflow.git](https://github.com/username/Taskflow.git)
    cd Taskflow
    ```

2.  **Buka `index.html`**
    Anda dapat membuka file `index.html` langsung di browser atau menggunakan *live server* (misalnya ekstensi Live Server di VS Code).

3.  **Setup Firebase**
    - Buka [Firebase Console](https://console.firebase.google.com/).
    - Buat proyek baru (misalnya, `ict-taskflow`).
    - Aktifkan **Authentication** (pilih metode Email/Password).
    - Buat **Firestore Database**.
    - **PENTING: Atur Aturan Keamanan (Security Rules) Firestore** untuk memastikan hanya pengguna yang berwenang yang dapat mengakses data.
    - Salin konfigurasi Firebase Anda dan tempelkan ke dalam file `js/firebase-config.js`.

4.  **Membuat Akun Admin**
    - Akun admin tidak dapat dibuat melalui pendaftaran publik.
    - Daftar menggunakan form registrasi siswa terlebih dahulu.
    - Buka Firebase Console > Firestore Database > collection `users`.
    - Temukan dokumen pengguna yang baru Anda buat, lalu ubah field `role` dari `"student"` menjadi `"admin"`.

5.  **Deployment ke GitHub Pages**
    - Pastikan semua file sudah di-*push* ke repository `Taskflow` Anda.
    - Di GitHub, buka **Settings** > **Pages**.
    - Pilih branch `main` sebagai sumber dan klik **Save**.
    - Aplikasi Anda akan tersedia di `https://<username>.github.io/Taskflow`.

## 📂 Struktur Proyek
