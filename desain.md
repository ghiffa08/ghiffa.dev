# 🎨 Sistem Desain Personal Website: Haikal Jibran Al-Ghiffary
**Pendekatan:** Premium Minimalist, Swiss Design, Editorial Magazine
**Tech Stack Utama:** React, Three.js, React Three Fiber, Tailwind CSS, GSAP, Lenis

---

## 1. Konsep Visual (Art Direction: Swiss Design / Editorial)
Pendekatan **Swiss Design (International Typographic Style)** berfokus pada kebersihan, keterbacaan, dan objektivitas. Desain ini mengandalkan *grid* yang kaku (namun asimetris), tipografi *sans-serif* yang tegas, dan hierarki visual yang sangat jelas layaknya tata letak majalah premium berskala internasional. 

* **Kesan:** Eksklusif, *avant-garde*, presisi tinggi, dan sangat *engineer-focused*.
* **Grid System:** Menggunakan grid 12-kolom atau 16-kolom yang ketat. Konten sering kali ditempatkan secara asimetris dengan memanfaatkan banyak ruang kosong (*negative space/white space*) agar mata audiens tertuju langsung pada informasi penting dan karya teknis.
* **Ornamen:** Dihilangkan. Mengandalkan garis (*hairlines*) tipis warna abu-abu untuk memisahkan grid dan bagian konten, mirip dengan garis kolom pada majalah cetak.

## 2. Sistem Desain (Design System)

### A. Tipografi (Kunci Utama Swiss Design)
Tipografi adalah elemen dekoratif sekaligus komunikatif utama dalam desain ini.
* **Primary / Display (Hero & Judul Besar):** *Neue Haas Grotesk*, *Helvetica Now*, atau *Inter (Tight Tracking)*. Font yang sangat netral, tebal (Bold/Black), dan kaku. 
* **Secondary / Body Text:** *Inter (Regular)* atau font berjenis *serif* editorial modern seperti *Playfair Display* (hanya untuk kutipan atau *sub-headline* pendek agar terkesan *high-end*).
* **Technical / Monospace:** *JetBrains Mono* atau *Geist Mono*. Digunakan untuk metadata editorial seperti nomor halaman (01, 02), tanggal, tag teknologi, dan potongan *code*.

### B. Palet Warna (Monokromatik + Aksen Halus)
* **Background:** `#FAFAFA` (Off-white, menyerupai warna kertas majalah premium).
* **Text / Ink:** `#111111` (Hampir hitam penuh untuk kontras tinggi).
* **Grid Lines:** `#E5E5E5` (Garis abu-abu terang pembentuk struktur majalah).
* **Accent:** Terbatas pada elemen 3D (Three.js) atau interaksi *hover*. Misal, warna monokrom dengan gradasi cahaya, atau biru keunguan `#3B82F6` yang sangat tipis untuk merepresentasikan elemen *modern stack*.

---

## 3. Arsitektur Teknologi & Interaksi (Modern Stack)

Kombinasi *Swiss Design* yang statis dan rapi akan dipecah secara elegan oleh interaksi *fluid* dari stack modern.

* **Framework Utama:** React (atau Next.js untuk performa SEO dan SSR).
* **Styling:** Tailwind CSS (untuk struktur grid asimetris dan garis tipis yang presisi).
* **3D & Visualisasi:** Three.js dipadukan dengan React Three Fiber. Digunakan di latar belakang *Hero Section* untuk merender model 3D interaktif (misalnya, representasi abstrak dari topologi *IoT/Node* atau *wireframe PCB* yang responsif terhadap pergerakan *mouse*).
* **Animasi & Scroll:**
    * **Lenis:** Untuk *smooth scrolling* yang terasa sangat *buttery* dan premium (seperti membalik halaman majalah berkualitas tinggi).
    * **GSAP (GreenSock):** Untuk animasi *text reveal* (teks muncul dari bawah garis), *parallax effects* pada gambar portofolio, dan transisi halaman yang *seamless*.

---

## 4. Struktur Tata Letak (Editorial Layout)

### A. Hero Section (Halaman Sampul)
* **Header (Atas):** Mirip *header* majalah. Kiri: `[ VOL. 01 ]` (Monospace). Tengah: `PORTFOLIO`. Kanan: `2026` / `KUNINGAN, ID`. Dipisahkan oleh garis horizontal dari ujung ke ujung.
* **Centerpiece:** Tipografi raksasa yang mendominasi layar: 
  **HAIKAL JIBRAN**
  **AL-GHIFFARY**
* **Interaksi 3D:** Di belakang atau di sela-sela tipografi raksasa tersebut, terdapat objek 3D abstrak dari **React Three Fiber** yang perlahan berotasi dan merespons kursor.
* **Sub-headline (Grid Bawah):** Blok teks rapi di salah satu sudut grid (misal kolom 9-12): *"Fullstack Web Developer & IoT Engineer. Merancang sistem cerdas dan arsitektur web modern."*

### B. Resume / Profil (Halaman Kolom)
* Disusun seperti artikel editorial.
* **Kiri (1/3 area):** Nomor urut besar `01.` dengan judul "ABOUT & EXPERTISE".
* **Kanan (2/3 area):** Teks paragraf editorial tentang latar belakang di Informatika Universitas Kuningan.
* **Tech Stack Grid:** Daftar minimalis menggunakan font monospace.
  * `WEB_DEV      : React, Next.js, Tailwind, Laravel`
  * `IOT_SYS      : ESP32, LoRa Telemetry, Flux/EasyEDA`
  * `IMMERSIVE    : WebAR, Meta Quest 2, Three.js`
  * `INFRA        : Ubuntu, Zsh, Shell Scripting`

### C. Selected Works (Galeri Portofolio)
* Tata letak asimetris (berbeda ukuran gambar untuk setiap proyek) untuk menghindari kebosanan, di-animasikan dengan *parallax* dari **GSAP**.
* **Proyek 01: LSP SCADA SMKN 2**
  * Gambar besar (mockup presisi).
  * Teks deskripsi di sampingnya dengan gaya *caption* majalah. 
  * Tech Tags: `[ REACT ] [ TAILWIND ] [ LARAVEL ]`
* **Proyek 02: Smart Irrigation System (DPPM Kemendiktisaintek)**
  * Gambar lebih kecil atau berformat *landscape*.
  * Tech Tags: `[ ESP32 ] [ LORA ] [ IOT ]`
* **Proyek 03: Arithmora (International Digital Math Game)**
  * Menampilkan elemen visual interaktif jika memungkinkan.

### D. Articles / Journal (Indeks Halaman)
* Dirancang menyerupai daftar isi (*Table of Contents*) sebuah jurnal akademik/majalah.
* Daftar vertikal padat:
  * `01.  Membangun Pengalaman Immersive dengan WebAR` ...... `[ READ ]`
  * `02.  Optimasi Rendering 3D menggunakan React Three Fiber` ...... `[ READ ]`
  * `03.  Integrasi Telemetri LoRa pada Sistem IoT` ...... `[ READ ]`
* Saat di-*hover*, gambar kover artikel (thumbnail) muncul perlahan mengikuti pergerakan kursor (*mouse trail image reveal* menggunakan GSAP).
