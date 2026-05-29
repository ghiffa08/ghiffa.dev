import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [hoveredArticleImg, setHoveredArticleImg] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeDetail, setActiveDetail] = useState(null);

  // Data Proyek Lengkap
  const projectsData = {
    p1: {
      type: 'project',
      category: 'Komersial',
      title: 'Digital Bank Raksa',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
      desc: 'Sistem perbankan online komprehensif untuk pengaduan, kredit, dan pembukaan rekening.',
      content: 'Digital Bank Raksa dikembangkan secara khusus untuk memodernisasi infrastruktur internal perbankan di PT. BPR Raksa Wacana Agri Purnama. Sistem ini secara komprehensif mendigitalisasi alur pengajuan kredit, mulai dari pengisian form secara daring, validasi berkas otomatis, hingga dasbor evaluasi bagi analis bank. Arsitektur aplikasi ini dibangun menggunakan framework Laravel untuk menghasilkan backend yang solid dan aman, dipadukan dengan antarmuka berbasis Tailwind CSS yang responsif terhadap berbagai ukuran layar perangkat pegawai bank. Keberadaan platform ini secara signifikan mempercepat proses birokrasi internal.',
      stack: ['PHP', 'LARAVEL', 'TAILWIND', 'MYSQL'],
      client: 'PT. BPR Raksa Wacana Agri Purnama',
      year: '2023',
      link: '#'
    },
    p2: {
      type: 'project',
      category: 'Pendidikan',
      title: 'LSP SCADA App',
      img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
      desc: 'Aplikasi administrasi dan manajemen sertifikasi profesi online yang terintegrasi secara real-time.',
      content: 'Aplikasi web ini bertujuan mendigitalisasi seluruh proses sertifikasi profesi di Lingkungan Lembaga Sertifikasi Profesi (LSP-P1) SMKN 2 Kuningan. Termasuk di dalamnya adalah digitalisasi dokumen pendaftaran APL-01 dan asesmen mandiri APL-02, evaluasi portofolio asesi secara langsung di platform, serta manajemen persetujuan dari para asesor. Sistem ini terbukti mampu memangkas waktu administratif hingga 60% dan mendukung inisiatif ramah lingkungan dengan meminimalisir penggunaan kertas (paperless) dalam skala masif selama masa uji kompetensi.',
      stack: ['PHP', 'LARAVEL', 'MYSQL'],
      client: 'LSP-P1 SMKN 2 Kuningan',
      year: '2024',
      link: '#'
    },
    p3: {
      type: 'project',
      category: 'Personal',
      title: 'RETHREEE Eco-Market',
      img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2074&auto=format&fit=crop',
      desc: 'Platform marketplace produk daur ulang dengan sistem reward poin hijau untuk keberlanjutan ekologis.',
      content: 'RETHREEE lahir sebagai inovasi platform e-commerce masa depan yang berfokus penuh pada keberlanjutan lingkungan. Berbeda dari marketplace biasa, setiap transaksi produk daur ulang di sini akan dikonversi menjadi "Eco-Points" yang dapat ditukarkan dengan berbagai penawaran menarik. Aplikasi web ini dibangun menggunakan ekosistem modern: React.js untuk merender sisi klien yang interaktif dan cepat, serta Supabase sebagai Backend-as-a-Service (BaaS) guna mempercepat proses integrasi autentikasi aman dan sinkronisasi database secara real-time.',
      stack: ['REACT', 'SUPABASE', 'TAILWIND'],
      client: 'Personal Project / Business Plan',
      year: '2025',
      link: '#'
    }
  };

  // Data Artikel Lengkap
  const articlesData = [
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

  // 1. Dynamic Script Loader (Three.js, GSAP, Lenis)
  useEffect(() => {
    const loadScripts = async () => {
      const addScript = (src) =>
        new Promise((resolve) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
          const s = document.createElement('script');
          s.src = src;
          s.onload = resolve;
          document.head.appendChild(s);
        });

      await addScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
      await addScript('https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js');
      await addScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
      await addScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
      
      setScriptsLoaded(true);
    };
    loadScripts();
  }, []);

  // 2. Initialize Lenis & GSAP
  useEffect(() => {
    if (!scriptsLoaded) return;

    window.lenis = new window.Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      window.lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    window.gsap.registerPlugin(window.ScrollTrigger);

    window.gsap.fromTo('.hero-text-line', 
      { y: '100%', opacity: 0 }, 
      { y: '0%', opacity: 1, duration: 1.5, stagger: 0.1, ease: 'power4.out', delay: 0.5 }
    );

    window.gsap.utils.toArray('.parallax-img').forEach(img => {
      window.gsap.to(img, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    window.gsap.utils.toArray('.fade-up').forEach(section => {
      window.gsap.fromTo(section, 
        { y: 50, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
          }
        }
      );
    });

    return () => {
      if(window.lenis) window.lenis.destroy();
      window.ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [scriptsLoaded]);

  // 3. Initialize Three.js Background
  useEffect(() => {
    if (!scriptsLoaded) return;

    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    const scene = new window.THREE.Scene();
    const camera = new window.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new window.THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const geometry = new window.THREE.IcosahedronGeometry(2, 1);
    const material = new window.THREE.MeshBasicMaterial({ 
      color: 0x3B82F6, 
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    
    const sphere = new window.THREE.Mesh(geometry, material);
    scene.add(sphere);

    const particlesGeometry = new window.THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }
    
    particlesGeometry.setAttribute('position', new window.THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new window.THREE.PointsMaterial({
      size: 0.02,
      color: 0x111111,
      transparent: true,
      opacity: 0.3
    });
    
    const particlesMesh = new window.THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 5;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event) => {
      mouseX = (event.clientX - windowHalfX);
      mouseY = (event.clientY - windowHalfY);
    };
    document.addEventListener('mousemove', onDocumentMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      
      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;
      
      sphere.rotation.y += 0.005;
      sphere.rotation.x += 0.002;
      
      sphere.rotation.y += 0.05 * (targetX - sphere.rotation.y);
      sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x);
      
      particlesMesh.rotation.y = -mouseX * 0.0001;
      particlesMesh.rotation.x = -mouseY * 0.0001;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousemove', onDocumentMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [scriptsLoaded]);

  // Handle Global Mouse Move (Cursor Image)
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  // Handle Modal Active State
  useEffect(() => {
    if (activeDetail) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = 'auto';
      if (window.lenis) window.lenis.start();
    }
    const modalElement = document.getElementById('detail-modal');
    if (modalElement) modalElement.scrollTop = 0;
  }, [activeDetail]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        
        :root {
          --bg: #FAFAFA;
          --text: #111111;
          --grid-line: #E5E5E5;
          --accent: #3B82F6;
        }

        body {
          background-color: var(--bg);
          color: var(--text);
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-serif-editorial { font-family: 'Playfair Display', serif; }
        
        .hairline-b { border-bottom: 1px solid var(--grid-line); }
        .hairline-t { border-top: 1px solid var(--grid-line); }
        .hairline-r { border-right: 1px solid var(--grid-line); }
        .hairline-l { border-left: 1px solid var(--grid-line); }
        
        .clip-text { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%); }
        ::selection { background: var(--text); color: var(--bg); }

        .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* Magazine Drop Cap Styling */
        .drop-cap::first-letter {
          font-size: 5rem;
          font-weight: 900;
          float: left;
          line-height: 0.8;
          padding-right: 0.75rem;
          padding-top: 0.25rem;
          color: #111111;
        }
      `}} />

      <canvas id="three-canvas" className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />

      {/* CUSTOM CURSOR UNTUK ARTIKEL */}
      <div 
        className="fixed top-0 left-0 w-72 h-48 pointer-events-none z-[90] overflow-hidden rounded-lg shadow-2xl transition-opacity duration-300 transform -translate-x-1/2 -translate-y-1/2"
        style={{ 
          opacity: hoveredArticleImg && !activeDetail ? 1 : 0,
          left: mousePos.x,
          top: mousePos.y,
        }}
      >
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${hoveredArticleImg})` }}
        />
      </div>

      {/* --- SINGLE / DETAIL MODAL (EDITORIAL MAGAZINE THEME) --- */}
      {activeDetail && (
        <div id="detail-modal" className="fixed inset-0 z-[100] bg-[#FAFAFA] text-[#111111] overflow-y-auto animate-fade-in">
          
          {/* Modal Header Navbar */}
          <div className="sticky top-0 w-full p-4 md:p-6 flex justify-between items-center bg-[#FAFAFA]/95 backdrop-blur-md z-50 hairline-b">
            <div className="font-mono text-xs font-bold tracking-wider">
              {activeDetail.type === 'project' ? '[ FEATURED PROJECT ]' : '[ EDITORIAL ARTICLE ]'}
            </div>
            <button 
              onClick={() => setActiveDetail(null)} 
              className="font-mono text-xs font-bold tracking-wider hover:text-[#3B82F6] transition-colors group flex items-center gap-2"
            >
              [ CLOSE ] <span className="group-hover:rotate-90 transition-transform text-lg leading-none">✕</span>
            </button>
          </div>

          {/* Modal Content - Magazine Layout */}
          <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12 md:py-24">
            
            {/* Title & Meta Data Block */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start mb-12 md:mb-20">
              <div className="md:col-span-8 lg:col-span-9">
                <h1 className="text-5xl md:text-8xl lg:text-[8vw] font-black tracking-tighter uppercase leading-[0.85]">
                  {activeDetail.title}
                </h1>
              </div>
              <div className="md:col-span-4 lg:col-span-3 font-mono text-xs uppercase border-t md:border-t-0 md:border-l border-[#111111] pt-6 md:pt-0 md:pl-6 space-y-6">
                {activeDetail.type === 'project' ? (
                  <>
                    <div>
                      <p className="text-gray-400 mb-1">CLIENT</p>
                      <p className="font-bold">{activeDetail.client}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">ROLE / YEAR</p>
                      <p className="font-bold">Fullstack Dev — {activeDetail.year}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">TECH STACK</p>
                      <p className="font-bold text-[#3B82F6]">{activeDetail.stack.join(', ')}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-gray-400 mb-1">PUBLISHED</p>
                      <p className="font-bold">{activeDetail.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">READ TIME</p>
                      <p className="font-bold">{activeDetail.readTime}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Hero Image Block */}
            <div className="w-full h-[50vh] md:h-[75vh] bg-gray-200 mb-16 overflow-hidden relative group">
              <img 
                src={activeDetail.img} 
                alt={activeDetail.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
              />
            </div>

            {/* Article Content - Split Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 border-t border-[#111111] pt-12">
              {/* Left Pull-Quote / Abstract */}
              <div className="md:col-span-4 lg:col-span-3">
                <p className="text-xl md:text-2xl font-serif-editorial font-medium italic leading-snug text-gray-900 border-l-4 border-[#3B82F6] pl-6">
                  "{activeDetail.desc}"
                </p>
                {activeDetail.link && (
                  <div className="mt-12 hidden md:block">
                    <a href={activeDetail.link} className="inline-block font-mono text-xs border-b border-[#111111] pb-1 font-bold uppercase hover:text-[#3B82F6] hover:border-[#3B82F6] transition-colors">
                      [ VISIT LIVE LINK ↗ ]
                    </a>
                  </div>
                )}
              </div>
              
              {/* Right Body Text (Columns) */}
              <div className="md:col-span-8 lg:col-span-9">
                <div className="columns-1 md:columns-2 gap-12 text-base md:text-lg text-gray-800 leading-relaxed drop-cap text-justify">
                  {activeDetail.content}
                </div>
                
                {/* Mobile Link Fallback */}
                {activeDetail.link && (
                  <div className="mt-12 md:hidden">
                    <a href={activeDetail.link} className="inline-block font-mono text-xs border-b border-[#111111] pb-1 font-bold uppercase hover:text-[#3B82F6] hover:border-[#3B82F6] transition-colors">
                      [ VISIT LIVE LINK ↗ ]
                    </a>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- MAIN PAGE CONTENT --- */}
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto hairline-l hairline-r bg-transparent">
        
        {/* HEADER */}
        <header className="fixed top-0 w-full max-w-screen-2xl bg-[#FAFAFA]/90 backdrop-blur-md text-[#111111] z-40 hairline-b border-[#E5E5E5] transition-all">
          <div className="grid grid-cols-3 text-xs md:text-sm font-mono p-4 font-bold tracking-wider">
            <div>GHIIFA.DEV</div>
            <div className="text-center uppercase hidden md:block">PORTFOLIO & CV</div>
            <div className="text-right uppercase">KUNINGAN, ID</div>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="min-h-screen w-full flex flex-col justify-end pb-12 pt-32 px-4 md:px-8 relative">
          <div className="clip-text">
            <h1 className="hero-text-line text-[12vw] md:text-[9.5vw] font-black leading-[0.85] tracking-tighter uppercase text-[#111111]">
              HAIKAL JIBRAN
            </h1>
          </div>
          <div className="clip-text">
            <h1 className="hero-text-line text-[12vw] md:text-[9.5vw] font-black leading-[0.85] tracking-tighter uppercase text-[#111111]">
              AL-GHIFFARRY
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 mt-12 md:mt-24 font-mono text-xs md:text-sm fade-up">
            <div className="md:col-span-8"></div>
            <div className="md:col-span-4 border-t border-[#111111] pt-4">
              <p className="max-w-md leading-relaxed uppercase font-bold text-base md:text-lg">
                Building the bridge between bits and atoms.
              </p>
              <p className="mt-2 text-gray-500 tracking-wider">
                IoT Engineer | Fullstack Developer
              </p>
            </div>
          </div>
        </section>

        {/* 01. ABOUT & EXPERTISE (Diperbarui) */}
        <section className="hairline-t px-4 md:px-8 py-24 fade-up bg-[#FAFAFA]/90 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter">01.</h2>
              <h3 className="text-xl font-bold mt-4 uppercase tracking-widest">About & Expertise</h3>
            </div>
            
            <div className="md:col-span-8 lg:col-span-7">
              {/* Teks utama yang diperbesar posisinya */}
              <p className="text-xl md:text-3xl font-medium leading-relaxed max-w-4xl mb-6 text-gray-900 tracking-tight">
                Mahasiswa Teknik Informatika Universitas Kuningan dengan fokus mendalam pada rekayasa perangkat lunak, arsitektur sistem, dan pengembangan web modern.
              </p>
              
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mb-12 text-justify">
                Memiliki rekam jejak dalam merancang serta mengimplementasikan aplikasi web komersial maupun platform administrasi digital. Memiliki dedikasi tinggi untuk terus mempelajari arsitektur teknologi baru, beradaptasi dengan cepat, serta menghadirkan solusi digital yang bersih, efisien, aman, dan berdampak nyata bagi industri.
              </p>

              {/* Tombol Download CV - Swiss Minimalist Style */}
              <a 
                href="#" 
                className="inline-flex items-center space-x-4 bg-[#111111] text-[#FAFAFA] px-8 py-5 hover:bg-[#3B82F6] transition-colors duration-500 group"
              >
                <span className="font-mono text-xs font-bold tracking-widest uppercase">
                  [ Download CV / Resume ]
                </span>
                <span className="font-mono text-lg transform group-hover:translate-y-1 transition-transform duration-300 leading-none">
                  ↓
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* 02. EXPERIENCE */}
        <section className="hairline-t fade-up bg-[#FAFAFA]">
          <div className="px-4 md:px-8 py-12 hairline-b">
             <h2 className="text-5xl md:text-7xl font-black tracking-tighter">02.</h2>
             <h3 className="text-xl font-bold mt-4 uppercase tracking-widest">Professional Experience</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 hairline-b hover:bg-gray-50 transition-colors">
              <div className="md:col-span-3 p-4 md:p-8 font-mono text-sm text-gray-500 md:hairline-r">
                [ OKT 2024 - FEB 2025 ]
              </div>
              <div className="md:col-span-9 p-4 md:p-8">
                <h4 className="text-2xl font-bold uppercase mb-2">Web Developer</h4>
                <div className="font-mono text-sm text-[#3B82F6] mb-4">PT. Bengkel Aplikasi Nusantara</div>
                <p className="text-gray-700 max-w-3xl">
                  Mengembangkan modul aplikasi web dinamis sesuai kebutuhan spesifik klien perusahaan. Merancang dan mengoptimalkan API internal serta melakukan pemeliharaan database guna menjaga skalabilitas sistem.
                </p>
              </div>
            </div>

            <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 hairline-b hover:bg-gray-50 transition-colors">
              <div className="md:col-span-3 p-4 md:p-8 font-mono text-sm text-gray-500 md:hairline-r">
                [ MEI 2024 - JUN 2024 ]
              </div>
              <div className="md:col-span-9 p-4 md:p-8">
                <h4 className="text-2xl font-bold uppercase mb-2">Web Developer & System Designer</h4>
                <div className="font-mono text-sm text-[#3B82F6] mb-4">LSP-P1 SMKN 2 Kuningan</div>
                <p className="text-gray-700 max-w-3xl">
                  Merancang dan membangun aplikasi manajemen sertifikasi profesi online. Mengintegrasikan alur registrasi asesi, form pengisian asesmen mandiri (APL-02), evaluasi portofolio, hingga persetujuan asesor secara real-time.
                </p>
              </div>
            </div>

            <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 hover:bg-gray-50 transition-colors">
              <div className="md:col-span-3 p-4 md:p-8 font-mono text-sm text-gray-500 md:hairline-r">
                [ OKT 2023 - DES 2023 ]
              </div>
              <div className="md:col-span-9 p-4 md:p-8">
                <h4 className="text-2xl font-bold uppercase mb-2">Web Developer Intern</h4>
                <div className="font-mono text-sm text-[#3B82F6] mb-4">PT. BPR Raksa Wacana Agri Purnama</div>
                <p className="text-gray-700 max-w-3xl">
                  Berkontribusi dalam digitalisasi sistem perbankan internal melalui pengembangan platform "E-Digital Bank Raksa" dan "Kredit Raksa Analytica". Membangun fitur penanganan pengaduan nasabah, pengajuan kredit online, dan dasbor visualisasi kelayakan kredit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 03. SELECTED WORKS */}
        <section className="hairline-t fade-up bg-[#FAFAFA]">
          <div className="px-4 md:px-8 py-12 hairline-b">
             <h2 className="text-5xl md:text-7xl font-black tracking-tighter">03.</h2>
             <h3 className="text-xl font-bold mt-4 uppercase tracking-widest">Selected Works</h3>
          </div>

          {/* Project 01 */}
          <div className="grid grid-cols-1 md:grid-cols-12 hairline-b group cursor-pointer" onClick={() => setActiveDetail(projectsData.p1)}>
            <div className="md:col-span-8 hairline-r overflow-hidden h-[50vh] md:h-[80vh] relative bg-gray-200">
              <img 
                src={projectsData.p1.img} 
                className="parallax-img absolute top-[-20%] left-0 w-full h-[140%] object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700"
                alt="Digital Bank Raksa" 
              />
            </div>
            <div className="md:col-span-4 p-8 md:p-12 flex flex-col justify-between bg-[#FAFAFA] group-hover:bg-[#111111] group-hover:text-[#FAFAFA] transition-colors duration-500">
              <div>
                <div className="font-mono text-xs text-gray-500 mb-4">[ PROYEK KOMERSIAL ]</div>
                <h4 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 uppercase">{projectsData.p1.title}</h4>
                <p className="text-sm md:text-base text-gray-500 mb-8 font-serif-editorial italic">
                  Sistem perbankan online untuk penanganan pengaduan nasabah, pengajuan kredit secara digital, serta pembukaan rekening.
                </p>
              </div>
              <div className="flex justify-between items-end">
                <div className="font-mono text-xs space-x-2 text-[#3B82F6]">
                  <span>[ PHP ]</span><span>[ LARAVEL ]</span>
                </div>
                <div className="font-mono text-xs uppercase border-b border-transparent group-hover:border-[#FAFAFA] transition-colors pb-1">View Detail ↗</div>
              </div>
            </div>
          </div>

          {/* Project 02 */}
          <div className="grid grid-cols-1 md:grid-cols-12 hairline-b group cursor-pointer" onClick={() => setActiveDetail(projectsData.p2)}>
            <div className="md:col-span-4 p-8 md:p-12 flex flex-col justify-between bg-[#FAFAFA] group-hover:bg-[#111111] group-hover:text-[#FAFAFA] transition-colors duration-500 order-2 md:order-1 hairline-r">
              <div>
                <div className="font-mono text-xs text-gray-500 mb-4">[ PROYEK PENDIDIKAN ]</div>
                <h4 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 uppercase">{projectsData.p2.title}</h4>
                <p className="text-sm md:text-base text-gray-500 mb-8 font-serif-editorial italic">
                  Aplikasi administrasi dan manajemen sertifikasi profesi online yang terintegrasi secara real-time.
                </p>
              </div>
              <div className="flex justify-between items-end">
                <div className="font-mono text-xs space-x-2 text-[#3B82F6]">
                  <span>[ PHP ]</span><span>[ MYSQL ]</span>
                </div>
                <div className="font-mono text-xs uppercase border-b border-transparent group-hover:border-[#FAFAFA] transition-colors pb-1">View Detail ↗</div>
              </div>
            </div>
            <div className="md:col-span-8 overflow-hidden h-[40vh] md:h-[60vh] relative bg-gray-200 order-1 md:order-2">
              <img 
                src={projectsData.p2.img} 
                className="parallax-img absolute top-[-20%] left-0 w-full h-[140%] object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700"
                alt="LSP SCADA" 
              />
            </div>
          </div>

          {/* Project 03 */}
          <div className="grid grid-cols-1 md:grid-cols-12 hairline-b group cursor-pointer" onClick={() => setActiveDetail(projectsData.p3)}>
            <div className="md:col-span-8 hairline-r overflow-hidden h-[50vh] md:h-[70vh] relative bg-[#111111]">
              <div className="absolute inset-0 opacity-40 group-hover:opacity-80 transition-opacity duration-700" 
                    style={{ backgroundImage: `url('${projectsData.p3.img}')`, backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'luminosity' }}>
               </div>
            </div>
            <div className="md:col-span-4 p-8 md:p-12 flex flex-col justify-between bg-[#FAFAFA] group-hover:bg-[#111111] group-hover:text-[#FAFAFA] transition-colors duration-500">
              <div>
                <div className="font-mono text-xs text-gray-500 mb-4">[ PROYEK PERSONAL ]</div>
                <h4 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 uppercase">{projectsData.p3.title}</h4>
                <p className="text-sm md:text-base text-gray-500 mb-8 font-serif-editorial italic">
                  Platform marketplace produk daur ulang yang mengimplementasikan sistem reward poin hijau untuk keberlanjutan ekologis.
                </p>
              </div>
              <div className="flex justify-between items-end">
                <div className="font-mono text-xs space-x-2 text-[#3B82F6]">
                  <span>[ REACT ]</span><span>[ SUPABASE ]</span>
                </div>
                <div className="font-mono text-xs uppercase border-b border-transparent group-hover:border-[#FAFAFA] transition-colors pb-1">View Detail ↗</div>
              </div>
            </div>
          </div>

        </section>

        {/* 04. EDUCATION & HONORS */}
        <section className="hairline-t fade-up bg-[#FAFAFA]">
          <div className="px-4 md:px-8 py-12 hairline-b">
             <h2 className="text-5xl md:text-7xl font-black tracking-tighter">04.</h2>
             <h3 className="text-xl font-bold mt-4 uppercase tracking-widest">Education & Honors</h3>
          </div>
          
          <div className="w-full">
            {/* EDUCATION ROW */}
            <div className="grid grid-cols-1 md:grid-cols-12 hairline-b hover:bg-gray-50 transition-colors">
              <div className="md:col-span-3 p-4 md:p-8 font-mono text-sm text-gray-500 md:hairline-r tracking-widest uppercase">
                [ Education ]
              </div>
              <div className="md:col-span-9 p-4 md:p-8 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-3 font-mono text-xs text-[#3B82F6] pt-1">2024 - SEKARANG</div>
                  <div className="md:col-span-9">
                    <h5 className="text-xl md:text-2xl font-bold uppercase mb-2">Universitas Kuningan</h5>
                    <p className="text-base text-gray-600">S1 Teknik Informatika. Fokus pada struktur data, algoritma tingkat lanjut, rekayasa komputasi, dan riset pengembangan sistem terpadu.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-3 font-mono text-xs text-[#3B82F6] pt-1">2021 - 2024</div>
                  <div className="md:col-span-9">
                    <h5 className="text-xl md:text-2xl font-bold uppercase mb-2">SMKN 2 Kuningan</h5>
                    <p className="text-base text-gray-600">Rekayasa Perangkat Lunak (RPL). Fokus pada dasar analisis sistem, manajemen basis data relasional (RDBMS), dan pemrograman modular.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* HONORS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-12 hairline-b hover:bg-gray-50 transition-colors">
              <div className="md:col-span-3 p-4 md:p-8 font-mono text-sm text-gray-500 md:hairline-r tracking-widest uppercase">
                [ Honors ]
              </div>
              <div className="md:col-span-9 p-4 md:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-3 font-mono text-xs text-[#3B82F6] pt-1">2025</div>
                  <div className="md:col-span-9">
                    <h5 className="text-lg font-bold uppercase mb-1">Juara 3 Lomba Web Design IT Festival</h5>
                    <p className="text-sm text-gray-600">Fakultas Ilmu Komputer UNIKU. Penghargaan atas kualitas estetika UI/UX, arsitektur kode modular, dan optimasi performa web.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-3 font-mono text-xs text-[#3B82F6] pt-1">2025</div>
                  <div className="md:col-span-9">
                    <h5 className="text-lg font-bold uppercase mb-1">Juara 1 Business Plan Competition</h5>
                    <p className="text-sm text-gray-600">Uniku Business Community. Penyusunan rencana bisnis platform "RETHREEE" dengan analisis keberlanjutan ekologis komprehensif.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-3 font-mono text-xs text-[#3B82F6] pt-1">2024</div>
                  <div className="md:col-span-9">
                    <h5 className="text-lg font-bold uppercase mb-1">Nilai Tertinggi Pertama Uji Kompetensi Keahlian</h5>
                    <p className="text-sm text-gray-600">SMKN 2 Kuningan. Pencapaian akademis dan praktis tertinggi pada evaluasi rekayasa perangkat lunak akhir.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CERTIFICATIONS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-12 hover:bg-gray-50 transition-colors">
              <div className="md:col-span-3 p-4 md:p-8 font-mono text-sm text-gray-500 md:hairline-r tracking-widest uppercase">
                [ Certifications ]
              </div>
              <div className="md:col-span-9 p-4 md:p-8 space-y-4 font-mono text-sm">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border-b border-gray-200 pb-4">
                  <div className="md:col-span-8 font-bold text-gray-800">Junior Web Developer</div>
                  <div className="md:col-span-4 text-gray-500 md:text-right">BNSP & Kominfo (Okt 2024)</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border-b border-gray-200 pb-4">
                  <div className="md:col-span-8 font-bold text-gray-800">Vocational School Graduate Academy</div>
                  <div className="md:col-span-4 text-gray-500 md:text-right">Kemenkominfo (Ags 2024)</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-2">
                  <div className="md:col-span-8 font-bold text-gray-800">Junior Web Programmer</div>
                  <div className="md:col-span-4 text-gray-500 md:text-right">PT. Cakrawala Global Yaksa (Mei 2024)</div>
                </div>
              </div>
            </div>
            
          </div>
        </section>

        {/* 05. ARTICLES & THOUGHTS */}
        <section className="hairline-t fade-up bg-[#FAFAFA]">
          <div className="px-4 md:px-8 py-12 hairline-b">
             <h2 className="text-5xl md:text-7xl font-black tracking-tighter">05.</h2>
             <h3 className="text-xl font-bold mt-4 uppercase tracking-widest">Articles & Thoughts</h3>
          </div>
          
          <div className="font-mono text-xs md:text-base w-full">
            {articlesData.map((article) => (
              <div 
                key={article.id}
                onClick={() => setActiveDetail(article)}
                className="hairline-b flex flex-col md:flex-row md:items-center justify-between p-4 md:p-8 hover:bg-[#111111] hover:text-[#FAFAFA] transition-colors duration-300 cursor-pointer group relative overflow-hidden"
                onMouseEnter={() => setHoveredArticleImg(article.img)}
                onMouseLeave={() => setHoveredArticleImg(null)}
              >
                <div className="flex items-center space-x-6 md:space-x-12 relative z-10">
                  <span className="text-gray-400 group-hover:text-[#3B82F6] transition-colors">{article.id}.</span>
                  <span className="font-sans font-bold text-lg md:text-2xl tracking-tight">{article.title}</span>
                </div>
                <div className="mt-4 md:mt-0 text-gray-400 group-hover:text-[#FAFAFA] tracking-widest hidden md:block relative z-10">
                  ...... [ READ ARTICLE ]
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 06. CONTACT ME */}
        <section className="hairline-t fade-up bg-[#FAFAFA] min-h-[70vh] flex flex-col relative overflow-hidden">
          <div className="px-4 md:px-8 py-12 hairline-b relative z-10">
             <h2 className="text-5xl md:text-7xl font-black tracking-tighter">06.</h2>
             <h3 className="text-xl font-bold mt-4 uppercase tracking-widest">Contact Me</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-24 text-center relative z-10">
            <p className="font-mono text-sm md:text-base text-gray-500 mb-8 tracking-widest uppercase">
              [ Open for collaboration & freelance ]
            </p>
            <a 
              href="mailto:haikaljibran.dev@gmail.com" 
              className="text-[10vw] md:text-8xl font-black tracking-tighter hover:text-[#3B82F6] transition-colors inline-block relative group"
            >
              LET'S TALK.
              <span className="absolute left-0 -bottom-2 w-full h-[6px] md:h-[10px] bg-[#3B82F6] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="hairline-t px-4 md:px-8 py-12 bg-[#111111] text-[#FAFAFA] flex flex-col md:flex-row justify-between items-center font-mono text-xs relative z-10">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <p className="text-gray-400 mb-1">EMAIL ME DIRECTLY</p>
            <p className="text-sm md:text-lg">haikaljibran.dev@gmail.com</p>
          </div>
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="space-x-4 md:space-x-8 text-sm">
              <a href="https://linkedin.com/in/haikal-jibran-al-ghiffarry" target="_blank" rel="noreferrer" className="hover:text-[#3B82F6] transition-colors border-b border-transparent hover:border-[#3B82F6] pb-1">LINKEDIN</a>
              <a href="https://instagram.com/haikaljibrn__" target="_blank" rel="noreferrer" className="hover:text-[#3B82F6] transition-colors border-b border-transparent hover:border-[#3B82F6] pb-1">INSTAGRAM</a>
              <a href="tel:+6285156958580" className="hover:text-[#3B82F6] transition-colors border-b border-transparent hover:border-[#3B82F6] pb-1">PHONE</a>
            </div>
            <div className="text-gray-600">
              © 2026 GHIIFA.DEV. KUNINGAN, ID.
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}