# Dokumentasi Personal Website: ghiffa.dev

Dokumen ini berisi informasi lengkap mengenai arsitektur, desain, tech stack, dan struktur direktori dari personal website **Haikal Jibran Al-Ghiffarry** (`ghiffa.dev`).

---

## 1. Konsep & Pendekatan Desain
Website ini menggunakan pendekatan desain **Premium Minimalist, Swiss Design (International Typographic Style)**, dan bernuansa **Editorial Magazine**.

### Karakteristik Visual
- **Kesan:** Eksklusif, *avant-garde*, presisi tinggi, dan *engineer-focused*.
- **Grid System:** Memanfaatkan grid yang kaku namun asimetris dengan *white space* yang luas untuk menonjolkan konten utama.
- **Ornamen:** Ornamen dekoratif diminimalisir. Hanya menggunakan garis tipis (*hairlines*) berwarna abu-abu untuk memisahkan bagian konten layaknya kolom majalah cetak.

### Palet Warna
- **Background (Off-white):** `#FAFAFA` (Memberikan kesan kertas majalah premium).
- **Text / Ink (Dark):** `#111111` (Hampir hitam penuh untuk kontras tinggi yang tajam).
- **Grid Lines:** `#E5E5E5` (Garis abu-abu terang pembentuk struktur).
- **Accent:** `#3B82F6` (Biru elegan, digunakan sangat tipis untuk merepresentasikan elemen modern/teknis).

### Tipografi
- **Primary / Display:** *Inter* atau *Neue Haas Grotesk* (Tegas, netral, modern).
- **Secondary / Serif:** *Playfair Display* (Digunakan untuk kutipan atau *sub-headline* agar terkesan *high-end*).
- **Technical / Monospace:** *JetBrains Mono* (Untuk tag teknologi, nomor urut, metadata editorial).

---

## 2. Tech Stack & Ekosistem Teknologi
Aplikasi ini dibangun menggunakan arsitektur *Modern Frontend* dengan ekosistem React.

### Frontend Framework & Build Tool
- **React 19** & **React DOM 19**
- **Vite** (Build tool yang sangat cepat dengan HMR)
- **React Router DOM v7** (Untuk *client-side routing*)

### Styling & UI
- **Tailwind CSS v4** (Utility-first framework untuk mempermudah implementasi grid dan *hairlines* presisi)
- **Tailwind Typography** (Plugin untuk format konten artikel)
- **Lucide React** (Ikon SVG yang minimalis)

### Animasi & 3D (Immersive Experience)
- **GSAP (GreenSock) v3** (Untuk animasi *text reveal*, *parallax*, dan *scroll trigger*)
- **Lenis** (Untuk *smooth scrolling* yang terasa *buttery* layaknya membalik halaman majalah)
- **Three.js** (Digunakan untuk merender objek 3D interaktif yang abstrak di latar belakang)

### Backend, Database & Data Fetching
- **Supabase** (`@supabase/supabase-js`) (Sebagai Backend-as-a-Service / BaaS untuk database)
- **SWR** (Untuk *data fetching*, *caching*, dan revalidasi data)

### Editor & Markdown
- **React Markdown** (Untuk me-render konten artikel berbasis markdown)
- **EasyMDE / React SimpleMDE** (Editor teks untuk fitur admin panel)

### Linting & Konfigurasi
- **ESLint** (Untuk standar kualitas kode)
- **Vercel.json** (Konfigurasi *deployment* di Vercel)

---

## 3. Struktur Direktori
Proyek ini mengadopsi pola struktur *React* modern dengan pemisahan *components* berbasis *Atomic Design* atau modular (*atoms, molecules, organisms*).

```text
/home/ghiffa/Documents/personal-web/ghiffa.dev
├── .env.local.example     # Contoh variabel environment
├── .gitignore             # File yang diabaikan oleh Git
├── eslint.config.js       # Konfigurasi ESLint
├── index.html             # Entry point HTML utama
├── package.json           # Konfigurasi proyek & dependency (NPM)
├── package-lock.json      # Dependency lock
├── README.md              # Dokumentasi bawaan
├── vercel.json            # Konfigurasi deployment Vercel
├── vite.config.js         # Konfigurasi Vite builder
│
├── public/                # Static assets yang tidak di-compile
│   ├── favicon.png
│   ├── favicon.svg
│   ├── icons.svg
│   ├── robots.txt
│   └── sitemap.xml
│
├── scripts/               # Skrip pendukung (Build/SEO)
│   └── generate-seo.js
│
├── src/                   # Source code utama React
│   ├── App.jsx            # Komponen root aplikasi
│   ├── main.jsx           # Entry point React
│   ├── index.css          # Global CSS (Tailwind imports)
│   ├── App.css            # Styling tambahan spesifik
│   │
│   ├── assets/            # Gambar dan media internal
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/        # UI Components (Reusable)
│   │   ├── atoms/         # Komponen terkecil (Button, Input, dll)
│   │   ├── molecules/     # Gabungan atoms (Card, Form Group)
│   │   └── organisms/     # Komponen kompleks (Navbar, Footer, Section)
│   │
│   ├── data/              # Static data / Mock data
│   │   ├── articles.js
│   │   └── projects.js
│   │
│   ├── hooks/             # Custom React Hooks
│   │   ├── useMousePosition.js
│   │   ├── useSmoothScroll.js
│   │   ├── useSupabaseData.js
│   │   └── useThreeBackground.js
│   │
│   ├── lib/               # Konfigurasi library eksternal
│   │   └── supabaseClient.js
│   │
│   ├── pages/             # Komponen level Halaman (View)
│   │   ├── admin/         # Halaman untuk dashboard panel admin
│   │   └── Portfolio.jsx
│   │
│   └── utils/             # Helper / Utility functions
│       └── slugify.js
│
└── supabase/              # File terkait Database Supabase
    └── schema.sql         # Skema struktur database utama
```

---

## 4. Struktur Konten (Halaman Utama)

Aplikasi dibangun sebagai SPA (*Single Page Application*) dengan *sectioning* yang responsif:
1. **Hero Section (`/`)**: Menampilkan *headline* besar dengan tipografi dominan dan animasi 3D background interaktif (Three.js) yang bereaksi terhadap posisi kursor.
2. **About & Expertise**: Pengenalan profil, latar belakang, dan spesialisasi teknis (Tech Stack Marquee / daftar vertikal monospace).
3. **Selected Works (Projects)**: Galeri portofolio (seperti *Digital Bank Raksa*, *LSP SCADA*, *RETHREEE*), tata letak asimetris dan *hover image reveal*.
4. **Professional Journey**: Pengalaman bekerja dan riwayat karir menggunakan sistem navigasi vertikal tab interaktif.
5. **Education & Honors**: Riwayat pendidikan dan penghargaan dalam format desain tabel/grid.
6. **Journal / Articles**: Daftar tulisan/artikel teknis dengan gaya editorial, foto *grayscale*, dan font *Serif*.
7. **Contact / Footer**: CTA (Call To Action) besar *inverted* (latar hitam, teks putih) dengan tautan media sosial.

## 5. Deployment
Berdasarkan ketersediaan `vercel.json` dan struktur proyek, aplikasi ini dioptimasi dan dikonfigurasi untuk *deploy* ke platform **Vercel**. Skrip kustom `generate-seo.js` akan dijalankan sebelum proses *build* (`prebuild`) untuk memastikan metadata SEO sudah ter-*generate* dengan benar.
