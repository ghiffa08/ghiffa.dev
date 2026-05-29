export const articlesData = [
  {
    id: '01',
    type: 'article',
    title: 'Membangun Pengalaman Immersive dengan WebAR',
    img: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=2070&auto=format&fit=crop',
    desc: 'Eksplorasi integrasi Augmented Reality langsung ke dalam browser web.',
    content: 'Teknologi WebAR memungkinkan kita membawa objek 3D ke dunia nyata hanya melalui tautan web. Dalam artikel ini, saya membahas bagaimana kombinasi Three.js, WebXR API, dan React dapat menghasilkan interaksi spasial yang ringan namun powerful untuk kampanye pemasaran, edukasi, maupun presentasi arsitektural. Kendala terbesar biasanya berada pada optimasi ukuran model 3D (GLTF/GLB) agar tidak membebani render browser smartphone.',
    date: 'MARCH 2026',
    readTime: '5 MIN READ'
  },
  {
    id: '02',
    type: 'article',
    title: 'Arsitektur Modular dalam Laravel & React Integration',
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
    desc: 'Praktik terbaik memisahkan backend Laravel sebagai API dan React sebagai layer presentasi.',
    content: 'Meninggalkan arsitektur monolitik (seperti Blade templating standar) menuju ekosistem Headless sangat penting untuk skalabilitas tim developer. Saya menguraikan pola desain API RESTful, cara menangani autentikasi menggunakan state dari Laravel Sanctum, dan merancang state management global di React menggunakan Redux Toolkit. Pemisahan fokus (Separation of Concerns) ini secara drastis mempercepat proses deployment berulang dan mempermudah kerja sama lintas tim.',
    date: 'FEBRUARY 2026',
    readTime: '7 MIN READ'
  },
  {
    id: '03',
    type: 'article',
    title: 'Implementasi Telemetri IoT & Efisiensi Sistem',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
    desc: 'Bagaimana mikrokontroler ESP32 dan LoRa mengubah paradigma transmisi data.',
    content: 'Dalam proyek Smart Irrigation System, tantangan terbesar kami adalah mengirim data kelembaban tanah presisi di area pertanian yang tidak memiliki cakupan seluler sama sekali. Solusinya adalah membangun jaringan topologi star menggunakan modul telemetri LoRa. ESP32 bertugas sebagai end-node hemat daya yang membaca sensor, lalu secara periodik mengirimkan paket data kecil via frekuensi radio ke gateway pusat. Artikel ini merinci kalkulasi konsumsi daya baterai dan format efisiensi payload.',
    date: 'JANUARY 2026',
    readTime: '8 MIN READ'
  }
];
