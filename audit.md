# Laporan Audit Komprehensif Web Production (ghiffa.dev)

**Target URL:** [ghiffa.dev](https://www.ghiffa.dev/)  
**Role:** Senior QA Automation & Test Engineer  
**Tanggal Audit:** 28 Oktober 2026  
**Lingkungan Pengujian:** Desktop Browser (Chrome/WebKit 1920x1080), Tablet (iPad Air / 768px - 1024px), Mobile Viewport (iPhone / Pixel 375px - 430px)  
**Status Evaluasi:** Needs Attention (Memiliki 1 Bug Critical Blocker & 2 Bug Major)

---

## 1. Executive Summary

Audit teknis menyeluruh telah dilakukan pada website production [ghiffa.dev](https://www.ghiffa.dev/) milik Haikal Jibran Al-Ghiffarry. Evaluasi mencakup fungsionalitas end-to-end, stabilitas runtime, audit responsif pada tablet dan smartphone, efisiensi arsitektur kuota Supabase Free Tier, postur keamanan (security & RLS), serta konsistensi desain sistem.

Secara visual dan arsitektur, website ini memiliki estetika tinggi dengan konsep *Figma-like interactive canvas*, cursor tags interaktif, dynamic *AI Mode*, dan animasi modern. Namun, audit menemukan sebuah **kegagalan fatal (P0 Blocker)** di mana scroll halaman memicu unmount total pada React akibat uncaught exception Three.js WebGL, navigasi mobile yang terputus pada subhalaman, gambar thumbnail proyek yang ter-hardcode, dan potensi kebocoran kuota database jika fitur interaktif tidak diamankan dengan tepat.

---

## 2. Master Test Matrix

| Modul / Area Pengujian | Status | Severity | Catatan Hasil Audit |
| :--- | :--- | :--- | :--- |
| **Hero Canvas & AI Mode** | Warning | Medium | Interaksi toggle AI Mode mulus; kartu Instagram tidak memiliki link; layout bertabrakan di mobile. |
| **Runtime & Scroll Engine** | FAILED | CRITICAL | Uncaught Three.js WebGL context creation error meruntuhkan root DOM menjadi blank white screen. |
| **Navigasi Global & Routing** | FAILED | High | Navbar subhalaman (`/works`) kehilangan menu `ARTICLES`, `ABOUT`, `LINKS` dan ikon hamburger mobile. |
| **Katalog Proyek (`/works`)** | FAILED | High | Fitur search & filter counter akurat; semua kartu proyek me-render gambar thumbnail yang identik (AgriNex). |
| **Artikel & Detail Post** | PASSED | Low | Routing detail dinamis berjalan lancar; animasi counter clap berfungsi responsif. |
| **Modal Kontak ("Let's talk")** | Warning | Medium | Validasi form HTML5 berjalan baik; close button touch target < 30px; container terpotong keyboard mobile. |
| **Responsive Mobile (< 430px)** | FAILED | High | Terdapat horizontal overflow pada hero canvas; filter proyek menumpuk 5 baris padat. |
| **Responsive Tablet (768px)** | PASSED | Low | Grid 2 kolom berjalan rapi; navigasi tablet proporsional. |
| **Keamanan & RLS** | Warning | High | Risiko client-side mutation; rentan bot spam pada form kontak dan claps; belum ada rate limiting. |
| **Optimalisasi Kuota Supabase** | Needs Work | High | Pola client-side fetch berisiko menguras Egress & Pooler; belum ada atomic increment RPC untuk claps. |
| **Konsistensi Desain & Konten** | Warning | Low | Inkonsistensi multibahasa (Spanyol, Inggris, Indonesia) dan variasi badge read-time artikel. |

---

## 3. Laporan Rinci Defek & Bug Fungsional

### BUG-01: Blank Screen Crash saat Scroll Halaman Utama (WebGL Context Failure)
* **Severity:** **CRITICAL (P0 - Blocker)**
* **Halaman Terdampak:** `https://www.ghiffa.dev/`
* **Log Error Konsol:**
  ```text
  THREE.WebGLRenderer: Error creating WebGL context.
  Uncaught Error: Error creating WebGL context at vendor-three-BpxWuwcD.js:4104
  ```
* **Langkah Reproduksi:**
  1. Akses halaman utama [ghiffa.dev](https://www.ghiffa.dev/).
  2. Lakukan scroll ke bawah melewati hero canvas menuju section *Services* (area IoT & Hardware).
  3. Perhatikan area viewport.
* **Hasil Aktual:** Komponen `PcbViewer3D` gagal menginisialisasi context WebGL. Karena tidak dibungkus dalam *React Error Boundary*, exception yang tidak tertangkap ini mematikan seluruh React root node (`<div id="root">`), menyebabkan layar berubah menjadi putih bersih (*blank screen*) dan tidak dapat dipulihkan tanpa refresh halaman penuh.
* **Hasil yang Diharapkan:** Aplikasi mendeteksi ketersediaan WebGL secara graceful. Jika WebGL tidak tersedia atau gagal dibuat, sistem harus menyajikan gambar statis/skema PCB sebagai fallback tanpa merusak jalannya aplikasi.

### BUG-02: Hilangnya Menu Navigasi & Hamburger pada Subhalaman
* **Severity:** **MAJOR (P1 - High)**
* **Halaman Terdampak:** `https://www.ghiffa.dev/works`, `https://www.ghiffa.dev/project/*`
* **Langkah Reproduksi:**
  1. Dari homepage, buka menu navigasi dan klik tautan **WORKS**.
  2. Perhatikan bagian header di halaman `/works` baik pada desktop maupun mobile.
* **Hasil Aktual:** 
  * Pada desktop: Tautan navigasi utama (`ARTICLES`, `ABOUT`, `LINKS`) hilang, hanya tersisa breadcrumb `ghiffa.dev / WORKS` dan tombol `Let's talk`.
  * Pada mobile (< 768px): Ikon hamburger menu (`≡`) hilang sepenuhnya. Pengguna terjebak di halaman works tanpa opsi navigasi selain menekan logo untuk kembali ke home.
* **Hasil yang Diharapkan:** Seluruh halaman mewarisi header global yang konsisten, mempertahankan daftar navigasi lengkap di desktop dan hamburger drawer di mobile.

### BUG-03: Duplikasi Gambar Thumbnail Hardcoded pada Semua Proyek
* **Severity:** **MAJOR (P1 - High)**
* **Halaman Terdampak:** [ghiffa.dev/works](https://www.google.com/url?sa=E&source=gmail&q=https://www.ghiffa.dev/works) dan halaman rute dinamis `/project/[slug]`
* **Langkah Reproduksi:**
  1. Buka halaman `/works`.
  2. Bandingkan kartu proyek 1 (*AgriNex Smart Drip System*), proyek 2 (*PASTII - Platform Absensi HIMA-TI*), dan proyek 3 (*Game Edukasi Harta Karun Angka*).
* **Hasil Aktual:** Semua kartu proyek menampilkan grafis spanduk yang identik bertuliskan *"AGRINEX SMART DRIP SYSTEM"*.
* **Hasil yang Diharapkan:** Setiap kartu proyek dan halaman detail menampilkan gambar screenshot atau representasi visual unik sesuai field `thumbnail_url` dari data proyek masing-masing.

### BUG-04: Kartu Instagram Hero Canvas Non-Clickable
* **Severity:** **MINOR (P2)**
* **Halaman Terdampak:** [ghiffa.dev](https://www.ghiffa.dev/) (Hero Section)
* **Langkah Reproduksi:**
  1. Arahkan kursor atau tap pada badge kartu Instagram (`@haikaljibraan`).
  2. Lakukan klik.
* **Hasil Aktual:** Tidak ada event navigasi yang dipicu, berbeda dengan kartu LinkedIn, GitHub, Skillstreak, dan Email yang langsung membuka link eksternal di tab baru.
* **Hasil yang Diharapkan:** Kartu dibungkus dengan anchor tag valid yang mengarah ke `https://instagram.com/haikaljibraan` dengan atribut `target="_blank"` dan `rel="noopener noreferrer"`.

### BUG-05: Inkonsistensi Label Format Read-Time Artikel
* **Severity:** **TRIVIAL (P3 - Cosmetic)**
* **Halaman Terdampak:** `https://www.ghiffa.dev/articles`
* **Hasil Aktual:** Artikel pertama menampilkan estimasi waktu baca dengan format `"3 MIN"`, sementara artikel kedua menampilkan `"3 MIN READ"`.
* **Hasil yang Diharapkan:** Standarisasi string formatting di seluruh metadata artikel menjadi `"3 MIN READ"`.

---

## 4. Audit Responsif Mendalam (Mobile & Tablet)

### A. Viewport Smartphone (< 640px)
1. **Hero Canvas Collision & Overflow-X:**
   * Elemen kartu melayang (GitHub contributions heatmap, LinkedIn, Email) saling bertumpuk langsung di atas teks utama `"ghiffa.dev"`.
   * Elemen absolute pada canvas meluber keluar batas kanan layar pada viewport 375px–390px, memicu scrollbar horizontal (*overflow-x* liar).
2. **Filter Kategori Padat pada Halaman `/works`:**
   * Kategori pill filter membungkus (*wrap*) ke bawah hingga 5 baris padat.
   * Tinggi pill kurang dari 36px, sangat rentan memicu salah sentuh (*misclick*) pada layar sentuh ponsel.
3. **Modal "Let's talk" Terpotong Keyboard:**
   * Kontainer modal memiliki tinggi tetap (*fixed height*) tanpa `max-height: 85vh; overflow-y: auto;`.
   * Saat keyboard virtual ponsel muncul untuk mengisi field pesan, tombol *"Send message"* terdorong ke bawah dan terpotong di luar viewport.
   * Ukuran tombol close modal (`X`) hanya berukuran ~24px × 24px, melanggar standar kenyamanan sentuhan jari (minimal 44px × 44px).

### B. Viewport Tablet (768px - 1024px)
1. **Grid Responsif:** Daftar proyek dan layanan beradaptasi dengan baik ke dalam grid 2 kolom.
2. **Keterbacaan Teks:** Spasi dan hierarki tipografi tetap proporsional dan mudah dibaca.
3. **Navigasi:** Navigasi horizontal tablet terlihat rapi, namun tetap mengalami isu hilangnya link navigasi saat berpindah ke subhalaman `/works`.

---

## 5. Blueprint Optimalisasi Kuota Supabase (Free Tier Survival Guide)

Supabase Free Tier menetapkan batas ketat: **Database Egress (2–5 GB)**, **Direct DB Connection Pool (maksimal 60 koneksi)**, **Realtime Messages (2 Juta/bulan)**, dan **Database Storage (500 MB)**. Berikut arsitektur untuk menekan pemakaian kuota hingga mendekati 0%:

### A. Eliminasi Database Egress via Next.js ISR (Server-Side Caching)
* **Masalah:** Jika data proyek dan artikel di-fetch dari browser menggunakan `supabase.from('...').select('*')`, setiap kunjungan visitor dan web crawler memicu query langsung ke Supabase, menghabiskan batas egress dan koneksi pool.
* **Arsitektur Solusi:** Alihkan seluruh read query ke Next.js Server Components dengan **Incremental Static Regeneration (ISR)**:
  ```typescript
  // app/works/page.tsx
  import { createClient } from '@supabase/supabase-js';

  export const revalidate = 86400; // Cache di Edge CDN selama 24 jam

  export default async function WorksPage() {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    const { data: projects } = await supabase
      .from('projects')
      .select('id, slug, title, summary, thumbnail_url, tech_stack')
      .order('featured_order', { ascending: true });

    return <WorksClientView initialProjects={projects} />;
  }
  ```
  *Dampak:* Dari 10.000 kunjungan halaman per hari, query yang sampai ke database Supabase hanya **1 request per hari**. Sisanya disajikan instan dari cache Vercel/Cloudflare Edge, menghemat >99.9% kuota egress.

### B. Arsitektur Clap Counter (Mencegah Database Bloat)
* **Masalah:** Menyimpan 1 baris record baru setiap kali tombol ditekan (`INSERT INTO article_claps`) akan menciptakan puluhan ribu baris log, menghabiskan storage 500 MB dan memicu *write amplification*.
* **Arsitektur Solusi:**
  1. **Debounce di Client Browser:** Kumpulkan klik pengguna selama jeda 1 detik sebelum mengirim request batch tunggal:
     ```typescript
     // Debounced payload: { slug: 'skillstreak-id', amount: 8 }
     ```
  2. **Atomic Increment via PostgreSQL RPC:** Update nilai pada satu baris data tanpa perlu membaca data terlebih dahulu:
     ```sql
     -- Jalankan di SQL Editor Supabase:
     create or replace function increment_article_claps(target_slug text, amount int)
     returns void as $$
     begin
       update articles
       set claps = coalesce(claps, 0) + amount
       where slug = target_slug;
     end;
     $$ language plpgsql security definer;
     ```
     Panggil dari aplikasi: `await supabase.rpc('increment_article_claps', { target_slug, amount });`.

### C. Proteksi Form Kontak ("Let's talk")
* **Masalah:** Mengizinkan client langsung melakukan `INSERT` ke tabel database tanpa validasi server rentan diserang script bot yang membanjiri baris database dan kuota email.
* **Arsitektur Solusi:**
  * Alihkan pengiriman form ke **Next.js Server Action** (`app/actions/contact.ts`).
  * Pasang **Honeypot Input** (input tersembunyi dengan CSS `opacity: 0; position: absolute; pointer-events: none`). Jika input ini terisi nilai oleh bot, request langsung ditolak tanpa menyentuh database.
  * Pasang **Rate Limiting** menggunakan `@upstash/ratelimit` (maksimal 3 pengiriman pesan per alamat IP per 10 menit).
  * Teruskan pesan langsung ke email pemilik menggunakan webhook Resend / SendGrid daripada menyalakan polling database terus-menerus.

### D. Manajemen Connection Pooler & Realtime Quota
* Pada konfigurasi database URL di environment production, selalu arahkan ke **Supavisor Transaction Pooler** pada port `6543`, bukan port default direct session `5432`. Hal ini mencegah error fatal `remaining connection slots are reserved` saat terjadi lonjakan traffic simultan.
* Buka dashboard Supabase (*Database -> Publications -> supabase_realtime*) dan pastikan tabel statis (`projects`, `articles`, `certificates`) dikeluarkan dari publikasi Realtime. Jangan membuka WebSocket channel jika data tidak memerlukan sinkronisasi live detik-per-detik.

---

## 6. Audit Keamanan & Proteksi Data (Security QA)

### A. Klasifikasi API Key
* Pastikan `SUPABASE_SERVICE_ROLE_KEY` tidak pernah diberi prefix `NEXT_PUBLIC_`. Kunci service role memiliki hak akses bypass seluruh aturan keamanan dan hanya boleh diakses di sisi server (Node.js runtime).
* Kunci `NEXT_PUBLIC_SUPABASE_ANON_KEY` aman berada di client bundle dengan syarat **Row Level Security (RLS)** telah aktif dan dikonfigurasi secara ketat pada setiap tabel.

### B. Konfigurasi Row Level Security (RLS) Wajib
Eksekusi kebijakan RLS berikut di dashboard Supabase:
```sql
-- 1. Kunci semua tabel
alter table projects enable row level security;
alter table articles enable row level security;
alter table messages enable row level security;

-- 2. Publik hanya boleh membaca data yang berstatus dipublikasikan
create policy "Allow public read-only for published projects"
on projects for select using (is_published = true);

create policy "Allow public read-only for published articles"
on articles for select using (is_published = true);

-- 3. Larang keras publik melakukan UPDATE atau DELETE langsung
create policy "Deny public modifications"
on articles for update using (false);

-- 4. Pengiriman pesan hanya melalui validasi terstruktur
create policy "Allow insert messages with valid content"
on messages for insert with check (
  length(sender_name) >= 2 and
  length(sender_email) >= 5 and
  length(message_body) >= 10
);
```

### C. HTTP Security Headers
Tambahkan konfigurasi header keamanan pada `next.config.js`:
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co;"
          }
        ],
      },
    ];
  },
};
```

---

## 7. Audit Kesesuaian Desain Sistem & Konsistensi UI/UX

### A. Inkonsistensi Percampuran Bahasa (Multilingual Mixing)
* **Temuan:** Di bagian profil homepage, terdapat pencampuran tiga bahasa sekaligus:
  * Istilah Spanyol: `"Educación/ Education"` dan `"Idiomas & Specialization"`.
  * Istilah Inggris: `"professional journey"`, `"about me"`, `"selected works"`.
  * Teks Bahasa Indonesia: Uraian tugas pekerjaan pada PT Bengkel Aplikasi Nusantara dan LSP SMKN 2 Kuningan (*"Mengembangkan modul aplikasi web dinamis...", "Merancang dan membangun aplikasi..."*).
* **Rekomendasi:** Terapkan standar satu bahasa yang konsisten di seluruh bagian web. Jika menargetkan klien internasional, terjemahkan seluruh uraian pengalaman kerja ke Bahasa Inggris profesional.

### B. Aksesibilitas Warna & Kontras (WCAG AA Compliance)
* Mayoritas teks utama kontras dengan baik di atas latar belakang gelap. Namun, teks sekunder berwarna abu-abu redup (pada deskripsi kartu sertifikat, tanggal pengalaman kerja, dan footer copyright) perlu dipastikan memiliki rasio kontras minimum **4.5:1** agar tetap nyaman dibaca pada perangkat mobile dengan kecerahan rendah di luar ruangan.

---

## 8. Kode Perbaikan Responsif & Runtime (Actionable Code Snippets)

### A. Fallback WebGL & Error Boundary untuk `PcbViewer3D`
```tsx
// components/PcbViewerWrapper.tsx
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const PcbViewer3D = dynamic(() => import('./PcbViewer3D'), { ssr: false });

export function PcbViewerWrapper() {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(Boolean(gl));
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  if (hasWebGL === false) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-zinc-800 rounded-2xl bg-zinc-950/60 text-center">
        <div className="w-12 h-12 mb-3 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400">
          ⚙️
        </div>
        <p className="text-sm font-medium text-zinc-300">3D Interactive Preview Unavailable</p>
        <p className="text-xs text-zinc-500 mt-1 max-w-xs">
          Your browser does not support hardware acceleration. Showing static hardware schematic instead.
        </p>
      </div>
    );
  }

  if (hasWebGL === null) return <div className="h-48 animate-pulse bg-zinc-900 rounded-2xl" />;

  return <PcbViewer3D />;
}
```

### B. Perbaikan CSS Responsif Hero Canvas & Filter Pills
```css
/* styles/responsive-fixes.css */

/* 1. Mencegah Canvas Meluber di Layar Ponsel */
@media (max-width: 640px) {
  .hero-canvas-viewport {
    overflow-x: hidden;
    width: 100%;
    max-width: 100vw;
  }

  .hero-canvas-content {
    transform: scale(0.85);
    transform-origin: top center;
  }

  /* Sembunyikan badge kursor dekoratif sekunder di layar kecil */
  .cursor-badge-secondary {
    display: none !important;
  }

  /* 2. Ubah Filter Proyek Menjadi Horizontal Scrollable Pills */
  .project-filter-container {
    display: flex !important;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    gap: 0.5rem;
    padding-bottom: 0.75rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .project-filter-container::-webkit-scrollbar {
    display: none;
  }

  .project-filter-pill {
    white-space: nowrap;
    flex-shrink: 0;
    min-height: 40px;
    padding: 0 1rem;
  }

  /* 3. Perbaikan Modal Kontak pada Mobile Viewport */
  .contact-modal-content {
    max-height: 85vh !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch;
  }

  .contact-modal-close {
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

---

## 9. Prioritas Roadmap Perbaikan Rekayasa (Actionable Roadmap)

### Fase 1: Hotfix Kritis (Wajib Diselesaikan Segera)
1. Pasang pengecekan WebGL dan Error Boundary pada komponen 3D PCB Viewer untuk menghentikan insiden *blank screen crash* saat pengunjung melakukan scroll.
2. Pasang anchor link valid `href="https://instagram.com/haikaljibraan"` pada kartu Instagram di hero canvas.
3. Sambungkan gambar thumbnail kartu proyek pada `/works` ke data dinamis masing-masing proyek untuk menggantikan placeholder AgriNex yang terduplikasi.

### Fase 2: Perbaikan Navigasi & Responsif Mobile (2–3 Hari)
1. Integrasikan komponen header ke dalam shared layout global (`app/layout.tsx`) agar hamburger menu drawer mobile dan daftar link hadir seragam di semua rute halaman.
2. Terapkan horizontal scroll pada filter kategori di halaman `/works` dan pasang `max-height: 85vh; overflow-y: auto;` pada modal form kontak.
3. Skalakan elemen hero canvas pada layar ponsel `< 640px` untuk mengeliminasi tabrakan teks dan isu *horizontal scrollbar*.

### Fase 3: Hardening Database Supabase & Keamanan (3–5 Hari)
1. Migrasikan seluruh fetch data baca ke Next.js Server Components dengan ISR (`revalidate = 3600`) untuk memangkas penggunaan kuota Egress hingga mendekati 0%.
2. Implementasikan fungsi PostgreSQL RPC `increment_article_claps` disertai debouncing di browser untuk fitur clap counter.
3. Lindungi endpoint pengiriman form kontak dengan honeypot dan rate limiting (`@upstash/ratelimit`).
4. Aktifkan dan audit aturan Row Level Security (RLS) pada semua tabel database Supabase.

### Fase 4: Polish Desain & Lokalisasi (Finishing)
1. Seragamkan bahasa tampilan (pilih Bahasa Inggris penuh atau Bahasa Indonesia penuh) untuk menghilangkan percampuran istilah Spanyol/Inggris/Indonesia.
2. Seragamkan penulisan label estimasi waktu baca artikel (`"3 MIN READ"`).
