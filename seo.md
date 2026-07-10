# Sistem SEO & AIO (Artificial Intelligence Optimization)

Dokumentasi ini menjelaskan bagaimana sistem **Search Engine Optimization (SEO)** dan **Artificial Intelligence Optimization (AIO)** diimplementasikan pada proyek portofolio `ghiffa.dev`.

## 1. Komponen SEO Dinamis (`<SEO>`)
Proyek ini menggunakan komponen kustom `<SEO>` (terletak di `src/components/atoms/SEO.jsx`) yang dibangun di atas `react-helmet-async`. Komponen ini mengatur tag-tag meta krusial pada halaman secara dinamis:

* **Standard Metadata:** `title`, `description`, `author`, dan `canonical url`.
* **Open Graph (OG):** Menyesuaikan tampilan link ketika dibagikan di platform seperti Facebook dan LinkedIn (`og:title`, `og:image`, `og:type`).
* **Twitter Card:** Menyesuaikan tampilan link ketika dibagikan di Twitter (`twitter:card`, `twitter:creator`).
* **Metadata Artikel:** Untuk tipe konten `article`, otomatis menyertakan tag `article:published_time`.
* **JSON-LD Schema Markup:** Mendukung penambahan *Structured Data* untuk membantu mesin pencari mengerti konteks konten halaman dengan lebih baik (Rich Snippets).

Komponen ini dipanggil pada halaman publik (seperti `Portfolio.jsx` dan modal detail) sehingga konten SEO akan selalu relevan dengan informasi yang sedang diakses.

## 2. Pengaturan SEO dari Admin Panel
Data untuk global SEO (seperti `seo_title` dan `seo_description`) tidak di-*hardcode*, melainkan dapat diatur secara langsung melalui Admin Dashboard (di `src/pages/admin/SettingsManager.jsx`). Ini memudahkan perubahan strategi SEO tanpa perlu melakukan *re-deploy* kode.

## 3. AIO (Artificial Intelligence Optimization)
Mengingat tren pencarian yang mulai bergeser ke AI (seperti ChatGPT, Perplexity, Claude), proyek ini telah dioptimasi agar ramah terhadap *crawler AI*.

Di dalam `scripts/generate-seo.js`, sistem secara eksplisit mengizinkan (melalui `Allow: /`) berbagai bot AI di `robots.txt` yang dihasilkan:
* `Google-Extended` (Gemini)
* `GPTBot` (OpenAI / ChatGPT)
* `PerplexityBot` (Perplexity AI)
* `OAI-SearchBot` (OpenAI Search)
* `ClaudeBot` (Anthropic / Claude)
* `CCBot` (Common Crawl - sering digunakan sebagai dataset AI)

Dengan mengizinkan bot-bot ini, informasi mengenai portofolio, proyek, dan artikel ghiffa.dev dapat diindeks dan dijadikan konteks jawaban oleh berbagai model AI, meningkatkan visibilitas profil di era *generative search*. Selain itu, direktori `/admin` diblokir (`Disallow: /admin`) untuk menjaga keamanan rute privat.

## 4. Automasi Sitemap & Robots.txt
Pembuatan `sitemap.xml` dan `robots.txt` berjalan secara otomatis sebelum proses *build* (`npm run prebuild`) melalui *script* `scripts/generate-seo.js`.

**Alur kerjanya:**
1. Script melakukan *query* ke database Supabase untuk mengambil seluruh data **Projects** dan **Articles** (yang berstatus `published`).
2. Script merakit `sitemap.xml` yang mendaftarkan URL inti (`/`), seluruh proyek (`/project/...`), dan seluruh artikel (`/article/...`) lengkap dengan informasi `lastmod` dari database.
3. Men-generate file `robots.txt` dan `sitemap.xml` ke dalam folder `public/`, sehingga siap didistribusikan ketika di-deploy ke Vercel atau *hosting* lainnya.
