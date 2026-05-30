import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [activeDetail, setActiveDetail] = useState(null);
  const [activeExp, setActiveExp] = useState(0);
  const [hoveredProject, setHoveredProject] = useState(null);
  
  // Referensi yang aman untuk elemen canvas 3D
  const canvasRef = useRef(null);

  // Data Proyek
  const projectsData = {
    p1: {
      type: 'project',
      category: 'WEBSITE DESIGN',
      title: 'Digital Bank Raksa',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
      desc: 'Sistem perbankan online komprehensif untuk pengaduan, kredit, dan pembukaan rekening.',
      content: 'Digital Bank Raksa dikembangkan secara khusus untuk memodernisasi infrastruktur internal perbankan di PT. BPR Raksa Wacana Agri Purnama. Sistem ini secara komprehensif mendigitalisasi alur pengajuan kredit, mulai dari pengisian form secara daring, validasi berkas otomatis, hingga dasbor evaluasi bagi analis bank. Arsitektur aplikasi ini dibangun menggunakan framework Laravel.',
      stack: ['PHP', 'LARAVEL', 'TAILWIND', 'MYSQL'],
      client: 'PT. BPR Raksa Wacana',
      year: '2023',
      link: '#'
    },
    p2: {
      type: 'project',
      category: 'SYSTEM DEVELOPMENT',
      title: 'LSP SCADA App',
      img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
      desc: 'Aplikasi administrasi dan manajemen sertifikasi profesi online yang terintegrasi secara real-time.',
      content: 'Aplikasi web ini bertujuan mendigitalisasi seluruh proses sertifikasi profesi di Lingkungan Lembaga Sertifikasi Profesi (LSP-P1) SMKN 2 Kuningan. Termasuk di dalamnya adalah digitalisasi dokumen pendaftaran APL-01 dan asesmen mandiri APL-02, evaluasi portofolio asesi secara langsung di platform.',
      stack: ['PHP', 'LARAVEL', 'MYSQL'],
      client: 'LSP-P1 SMKN 2 Kuningan',
      year: '2024',
      link: '#'
    },
    p3: {
      type: 'project',
      category: 'WEB APP & UI/UX',
      title: 'RETHREEE Eco-Market',
      img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2074&auto=format&fit=crop',
      desc: 'Platform marketplace produk daur ulang dengan sistem reward poin hijau untuk keberlanjutan ekologis.',
      content: 'RETHREEE lahir sebagai inovasi platform e-commerce masa depan yang berfokus penuh pada keberlanjutan lingkungan. Berbeda dari marketplace biasa, setiap transaksi produk daur ulang di sini akan dikonversi menjadi "Eco-Points" yang dapat ditukarkan dengan berbagai penawaran menarik.',
      stack: ['REACT', 'SUPABASE', 'TAILWIND'],
      client: 'Personal Project',
      year: '2025',
      link: '#'
    }
  };

  // Data Artikel (Ditampilkan sebagai Cards dengan Vibe Editorial)
  const articlesData = [
    {
      id: '01',
      type: 'article',
      title: 'Membangun Pengalaman Immersive dengan WebAR',
      img: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=2070&auto=format&fit=crop',
      desc: 'Eksplorasi integrasi Augmented Reality langsung ke dalam browser web.',
      content: 'Teknologi WebAR memungkinkan kita membawa objek 3D ke dunia nyata hanya melalui tautan web. Dalam artikel ini, saya membahas bagaimana kombinasi Three.js, WebXR API, dan React dapat menghasilkan interaksi spasial yang ringan namun powerful.',
      date: 'MAR 2026',
      readTime: '5 MIN READ'
    },
    {
      id: '02',
      type: 'article',
      title: 'Arsitektur Modular dalam Laravel & React',
      img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
      desc: 'Praktik terbaik memisahkan backend Laravel sebagai API dan React sebagai layer presentasi.',
      content: 'Meninggalkan arsitektur monolitik menuju ekosistem Headless sangat penting untuk skalabilitas tim developer. Saya menguraikan pola desain API RESTful, cara menangani autentikasi menggunakan state dari Laravel Sanctum, dan merancang state management global di React.',
      date: 'FEB 2026',
      readTime: '7 MIN READ'
    },
    {
      id: '03',
      type: 'article',
      title: 'Implementasi Telemetri IoT & Efisiensi Sistem',
      img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
      desc: 'Bagaimana mikrokontroler ESP32 dan LoRa mengubah paradigma transmisi data.',
      content: 'Dalam proyek Smart Irrigation System, tantangan terbesar kami adalah mengirim data kelembaban tanah presisi di area pertanian yang tidak memiliki cakupan seluler sama sekali. Solusinya adalah membangun jaringan topologi star menggunakan modul telemetri LoRa.',
      date: 'JAN 2026',
      readTime: '8 MIN READ'
    }
  ];

  // Data Pengalaman (Process Section Layout)
  const experienceData = [
    {
      company: 'PT. Bengkel Aplikasi Nusantara',
      role: 'Web Developer',
      period: 'Okt 2024 - Feb 2025',
      desc: 'Mengembangkan modul aplikasi web dinamis sesuai kebutuhan spesifik klien perusahaan. Merancang dan mengoptimalkan API internal serta melakukan pemeliharaan database guna menjaga skalabilitas sistem.',
      tech: 'React, Node.js, Express, PostgreSQL'
    },
    {
      company: 'LSP-P1 SMKN 2 Kuningan',
      role: 'System Designer & Developer',
      period: 'Mei 2024 - Jun 2024',
      desc: 'Merancang dan membangun aplikasi manajemen sertifikasi profesi online. Mengintegrasikan alur registrasi asesi, form pengisian asesmen mandiri (APL-02), evaluasi portofolio, hingga persetujuan asesor secara real-time.',
      tech: 'PHP, Laravel, MySQL'
    },
    {
      company: 'PT. BPR Raksa Wacana',
      role: 'Web Developer Intern',
      period: 'Okt 2023 - Des 2023',
      desc: 'Berkontribusi dalam digitalisasi sistem perbankan internal melalui pengembangan platform "E-Digital Bank Raksa" dan "Kredit Raksa Analytica". Membangun fitur penanganan pengaduan nasabah dan pengajuan kredit online.',
      tech: 'PHP, Bootstrap, JavaScript, ChartJS'
    }
  ];

  const skills = [
    "REACT", "NEXT.JS", "TAILWIND CSS", "LARAVEL", "NODE.JS", "EXPRESS", 
    "POSTGRESQL", "MYSQL", "SUPABASE", "GSAP", "WEB DESIGN", "UI/UX"
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
      smooth: true,
    });

    function raf(time) {
      window.lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    window.gsap.registerPlugin(window.ScrollTrigger);

    // Hero Reveal
    window.gsap.fromTo('.anim-fade-up', 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'power4.out', delay: 0.2 }
    );

    // Scroll Fade
    window.gsap.utils.toArray('.scroll-fade').forEach(section => {
      window.gsap.fromTo(section, 
        { y: 40, opacity: 0 },
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

  // 3. Initialize Three.js Background (Diperbarui agar aman dari Crash WebGL Context)
  useEffect(() => {
    if (!scriptsLoaded || !window.THREE) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer;
    try {
      renderer = new window.THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (error) {
      console.warn("WebGL tidak didukung atau terjadi penumpukan konteks. Melewati render 3D.", error);
      return; 
    }

    const scene = new window.THREE.Scene();
    const camera = new window.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const geometry = new window.THREE.IcosahedronGeometry(2, 1);
    const material = new window.THREE.MeshBasicMaterial({ 
      color: 0x3B82F6, 
      wireframe: true,
      transparent: true,
      opacity: 0.08 // Sangat tipis dan elegan
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
      opacity: 0.15
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

    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
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
      cancelAnimationFrame(animationFrameId);
      
      // Cleanup WebGL secara paksa agar tidak bentrok saat hot-reloading di React Strict Mode
      if (renderer) {
        renderer.forceContextLoss();
        renderer.dispose();
      }
    };
  }, [scriptsLoaded]);

  // Handle Modal Active State (Pause Scrolling)
  useEffect(() => {
    if (activeDetail) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = 'auto';
      if (window.lenis) window.lenis.start();
    }
  }, [activeDetail]);

  // Reusable Section Header Component untuk konsistensi Swiss Design
  const SectionHeader = ({ number, title }) => (
    <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8 mb-16 md:mb-24 px-6 md:px-12">
      <h2 className="text-7xl md:text-[8rem] font-light text-gray-200 tracking-tighter leading-none select-none">
        {number}.
      </h2>
      <h3 className="font-mono text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#111111] pb-2 md:pb-4 border-b border-[#111111] flex-1">
        [ {title} ]
      </h3>
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;800;900&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
        
        :root {
          --bg-light: #FAFAFA;
          --bg-card: #FFFFFF;
          --text-dark: #111111;
          --border: #E5E5E5;
          --accent: #3B82F6;
        }

        body {
          background-color: var(--bg-light);
          color: var(--text-dark);
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-serif-editorial { font-family: 'Playfair Display', serif; }
        
        .hairline-b { border-bottom: 1px solid var(--border); }
        .hairline-t { border-top: 1px solid var(--border); }
        .hairline-l { border-left: 1px solid var(--border); }
        
        ::selection { background: var(--text-dark); color: var(--bg-light); }

        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: scroll 20s linear infinite;
        }

        .drop-cap::first-letter {
          font-family: 'Playfair Display', serif;
          font-size: 5.5rem;
          font-weight: 700;
          float: left;
          line-height: 0.8;
          padding-right: 0.75rem;
          padding-top: 0.25rem;
          color: #111111;
        }
      `}} />

      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-60" />

      {/* --- SINGLE / DETAIL MODAL (EDITORIAL MAGAZINE) --- */}
      {activeDetail && (
        <div id="detail-modal" className="fixed inset-0 z-[100] bg-[#FAFAFA] text-[#111111] overflow-y-auto animate-fade-in">
          
          <div className="sticky top-0 w-full px-6 py-4 flex justify-between items-center bg-[#FAFAFA]/95 backdrop-blur-md z-50 hairline-b">
            <div className="font-mono text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
              {activeDetail.type === 'project' ? 'Featured Project' : 'Editorial Article'}
            </div>
            <button 
              onClick={() => setActiveDetail(null)} 
              className="font-mono text-[10px] md:text-xs font-bold tracking-[0.2em] hover:text-[#3B82F6] transition-colors flex items-center gap-2 group uppercase"
            >
              Close <span className="group-hover:rotate-90 transition-transform text-base md:text-lg leading-none">✕</span>
            </button>
          </div>

          <div className="w-full max-w-screen-2xl mx-auto px-6 md:px-12 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-16">
              <div className="md:col-span-8 lg:col-span-9">
                <h1 className={`text-5xl md:text-[6vw] leading-[0.9] tracking-tighter uppercase ${activeDetail.type === 'article' ? 'font-serif-editorial font-bold normal-case' : 'font-black'}`}>
                  {activeDetail.title}
                </h1>
              </div>
              <div className="md:col-span-4 lg:col-span-3 font-mono text-[10px] md:text-xs uppercase md:border-l border-[#E5E5E5] pt-6 md:pt-0 md:pl-8 space-y-8 tracking-widest">
                {activeDetail.type === 'project' ? (
                  <>
                    <div>
                      <p className="text-gray-400 mb-1">CLIENT</p>
                      <p className="font-bold text-[#111111]">{activeDetail.client || activeDetail.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">YEAR</p>
                      <p className="font-bold text-[#111111]">{activeDetail.year}</p>
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
                      <p className="font-bold text-[#111111]">{activeDetail.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">READ TIME</p>
                      <p className="font-bold text-[#111111]">{activeDetail.readTime}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="w-full h-[40vh] md:h-[70vh] bg-[#E5E5E5] mb-16 overflow-hidden border border-[#E5E5E5] p-1 shadow-sm">
              <img src={activeDetail.img} alt={activeDetail.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 hairline-t pt-16">
              <div className="md:col-span-4 lg:col-span-3">
                <p className="text-xl md:text-2xl font-serif-editorial font-medium italic leading-relaxed text-gray-900 border-l-4 border-[#111111] pl-6 py-2">
                  "{activeDetail.desc}"
                </p>
                {activeDetail.link && (
                  <div className="mt-16 hidden md:block">
                    <a href={activeDetail.link} className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase hover:text-[#3B82F6] transition-colors border-b border-[#111111] hover:border-[#3B82F6] pb-1">
                      <span>Visit Live Link</span>
                      <span className="text-sm leading-none">↗</span>
                    </a>
                  </div>
                )}
              </div>
              <div className="md:col-span-8 lg:col-span-9">
                <div className="columns-1 md:columns-2 gap-12 text-base md:text-lg text-gray-700 leading-relaxed drop-cap text-justify">
                  {activeDetail.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN PAGE CONTENT --- */}
      <div className="w-full relative z-10 selection:bg-[#111111] selection:text-[#FAFAFA]">
        
        {/* NAVIGATION BAR */}
        <nav className="w-full flex justify-between items-center px-6 md:px-12 py-6 bg-[#FAFAFA]/90 backdrop-blur-md z-40 fixed top-0 hairline-b">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#111111] text-white flex items-center justify-center text-base font-serif-editorial italic font-bold">
              H
            </div>
            <span className="font-mono text-xs font-bold tracking-[0.2em] hidden md:block uppercase">Vol. 01</span>
          </div>
          
          <div className="hidden md:flex space-x-12 font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">
            <a href="#about" className="hover:text-[#111111] transition-colors">About</a>
            <a href="#works" className="hover:text-[#111111] transition-colors">Works</a>
            <a href="#process" className="hover:text-[#111111] transition-colors">Experience</a>
            <a href="#journal" className="hover:text-[#111111] transition-colors">Journal</a>
          </div>

          <a href="#contact" className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold hover:text-[#3B82F6] transition-colors flex items-center gap-2">
            LET'S CONNECT <span className="text-base leading-none">↗</span>
          </a>
        </nav>

        {/* SECTION: HERO */}
        <section className="min-h-[100svh] flex flex-col justify-end px-6 md:px-12 pt-32 pb-16 md:pb-24 relative">
          <div className="max-w-screen-2xl">
            <h1 className="text-[15vw] md:text-[10vw] font-black leading-[0.8] tracking-tighter uppercase anim-fade-up text-[#111111] mb-2">
              Building the<br />bridge between<br />bits and atoms.
            </h1>
            
            <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-end anim-fade-up">
              <div className="md:col-span-5 lg:col-span-4 flex items-center gap-4">
                <a href="#contact" className="inline-flex items-center gap-3 rounded-full border border-[#E5E5E5] bg-white px-6 md:px-8 py-4 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold hover:border-[#111111] shadow-sm transition-all duration-300">
                  <span>Let's Connect With Me</span>
                </a>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#111111] text-[#111111] flex items-center justify-center transform -rotate-45 font-mono text-sm hover:bg-[#111111] hover:text-white transition-colors cursor-pointer">
                  →
                </div>
              </div>
              <div className="md:col-span-7 lg:col-span-8 md:pl-12 lg:border-l border-[#E5E5E5]">
                <p className="text-gray-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed max-w-lg">
                  <strong className="text-[#111111]">Haikal Jibran Al-Ghiffarry</strong><br/>
                  IoT Engineer & Fullstack Developer.<br/>
                  Merancang arsitektur web modern, integrasi perangkat keras, & desain antarmuka.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: ABOUT */}
        <section id="about" className="py-24 md:py-32 hairline-t scroll-fade bg-white">
          <SectionHeader number="01" title="About & Expertise" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 px-6 md:px-12 items-start">
            <div className="md:col-span-6 lg:col-span-5">
              <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-[1.1] mb-8 text-[#111111]">
                Transforming your digital ideas into scalable reality.
              </h2>
              {/* Profile Capsule Badge */}
              <div className="inline-flex items-center gap-3 bg-[#FAFAFA] rounded-full px-4 py-2 border border-[#E5E5E5]">
                <span className="font-mono text-sm text-gray-400">+</span>
                <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white font-serif-editorial italic text-sm">H</div>
                <span className="font-mono text-sm text-gray-400">*</span>
              </div>
            </div>
            
            <div className="md:col-span-6 lg:col-span-7 lg:pl-12">
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-10 text-justify md:text-left">
                <span className="text-[#111111] font-bold">Saya Haikal Jibran Al-Ghiffarry,</span> mahasiswa Teknik Informatika Universitas Kuningan dengan fokus mendalam pada rekayasa perangkat lunak, arsitektur sistem, dan pengembangan web modern. Memiliki rekam jejak dalam merancang serta mengimplementasikan aplikasi web komersial maupun platform administrasi digital. Dedikasi tinggi untuk menghadirkan solusi yang bersih, efisien, dan berdampak nyata bagi industri.
              </p>
              
              <a href="#" className="inline-flex items-center gap-3 border-b-2 border-[#111111] pb-1 font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] hover:text-[#3B82F6] hover:border-[#3B82F6] transition-colors">
                <span>Download Resume</span>
                <span className="text-sm leading-none">↓</span>
              </a>
            </div>
          </div>
        </section>

        {/* SECTION: MARQUEE (SKILLS) */}
        <section className="py-8 md:py-12 hairline-t hairline-b overflow-hidden bg-[#FAFAFA]">
          <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
            {[...skills, ...skills].map((skill, index) => (
              <span key={index} className="text-4xl md:text-6xl font-black tracking-tighter text-[#E5E5E5] hover:text-[#111111] transition-colors duration-300 cursor-default uppercase">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* SECTION: LATEST WORKS (LIST LAYOUT) */}
        <section id="works" className="py-24 md:py-32 scroll-fade bg-white">
          <SectionHeader number="02" title="Selected Works" />
          
          <div className="flex flex-col hairline-t">
            {Object.values(projectsData).map((project, idx) => (
              <div 
                key={project.id || idx}
                onMouseEnter={() => setHoveredProject(project.title)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => setActiveDetail(project)}
                className="group flex flex-col md:flex-row md:items-center justify-between hairline-b py-10 md:py-16 cursor-pointer relative hover:bg-[#111111] transition-colors duration-500 px-6 md:px-12"
              >
                {/* Project Title */}
                <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-[#111111] group-hover:text-white transition-colors duration-500 z-10 relative uppercase">
                  {project.title}
                </h3>
                
                {/* Project Category & Hover Reveal Image */}
                <div className="flex items-center justify-end mt-6 md:mt-0 z-10 relative">
                  {/* Image Reveal on Hover (Desktop) */}
                  <div className={`hidden md:block absolute right-[280px] top-1/2 transform -translate-y-1/2 w-72 h-48 overflow-hidden transition-all duration-500 ease-out pointer-events-none origin-right border border-[#E5E5E5] p-1 bg-white ${hoveredProject === project.title ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <img src={project.img} alt={project.title} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0" />
                  </div>

                  <span className="font-mono text-gray-500 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold group-hover:text-gray-300 transition-colors duration-300 mr-8">
                    {project.category}
                  </span>
                  
                  {/* Circular Arrow Button */}
                  <div className="w-12 h-12 rounded-full border border-[#E5E5E5] group-hover:border-white text-[#111111] group-hover:text-white flex items-center justify-center transition-all duration-300 transform group-hover:rotate-45 font-mono">
                    ↗
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: EXPERIENCE (VERTICAL PROCESS LAYOUT) */}
        <section id="process" className="py-24 md:py-32 hairline-t scroll-fade bg-[#FAFAFA]">
          <SectionHeader number="03" title="Professional Journey" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 px-6 md:px-12">
            <div className="lg:col-span-4">
              {/* Dynamic Number Indicator */}
              <div className="text-[8rem] md:text-[12rem] font-light text-[#E5E5E5] tracking-tighter leading-none transition-all duration-500 select-none">
                0{activeExp + 1}/
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              {/* Vertical Navigation Tab */}
              <div className="flex flex-col space-y-6 md:space-y-10 hairline-l pl-6 md:pl-10">
                {experienceData.map((exp, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveExp(idx)}
                    className={`text-left text-2xl md:text-3xl font-medium tracking-tight transition-all duration-300 ${activeExp === idx ? 'text-[#111111]' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {exp.company}
                  </button>
                ))}
              </div>

              {/* Dynamic Content Detail */}
              <div className="pt-2 md:pt-0">
                <h4 className="text-xl md:text-2xl font-bold mb-2 text-[#111111] uppercase tracking-tight">
                  {experienceData[activeExp].role}
                </h4>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#3B82F6] mb-6 font-mono font-bold">
                  {experienceData[activeExp].period}
                </p>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
                  {experienceData[activeExp].desc}
                </p>
                
                <div className="pt-6 hairline-t">
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-3 font-mono font-bold">Tech Stack</p>
                  <p className="text-[10px] md:text-xs font-bold text-[#111111] font-mono tracking-widest uppercase">{experienceData[activeExp].tech}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: EDUCATION & HONORS (GRID TABULAR) */}
        <section className="py-24 md:py-32 hairline-t scroll-fade bg-white">
          <SectionHeader number="04" title="Education & Honors" />
          
          <div className="w-full px-6 md:px-12">
            {/* EDUCATION ROW */}
            <div className="grid grid-cols-1 md:grid-cols-12 hairline-t hairline-b hover:bg-[#FAFAFA] transition-colors py-12 md:py-16">
              <div className="md:col-span-3 font-mono text-[10px] md:text-xs text-gray-400 font-bold tracking-[0.2em] uppercase mb-8 md:mb-0">
                [ Education ]
              </div>
              <div className="md:col-span-9 space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-4 font-mono text-[10px] md:text-xs text-[#3B82F6] font-bold tracking-widest pt-1 uppercase">2024 - Sekarang</div>
                  <div className="md:col-span-8">
                    <h5 className="text-xl md:text-2xl font-bold uppercase mb-3 tracking-tight text-[#111111]">Universitas Kuningan</h5>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-xl">S1 Teknik Informatika. Fokus pada struktur data, algoritma tingkat lanjut, rekayasa komputasi, dan riset pengembangan sistem terpadu.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-4 font-mono text-[10px] md:text-xs text-[#3B82F6] font-bold tracking-widest pt-1 uppercase">2021 - 2024</div>
                  <div className="md:col-span-8">
                    <h5 className="text-xl md:text-2xl font-bold uppercase mb-3 tracking-tight text-[#111111]">SMKN 2 Kuningan</h5>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-xl">Rekayasa Perangkat Lunak (RPL). Fokus pada dasar analisis sistem, manajemen basis data relasional (RDBMS), dan pemrograman modular.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* HONORS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-12 hairline-b hover:bg-[#FAFAFA] transition-colors py-12 md:py-16">
              <div className="md:col-span-3 font-mono text-[10px] md:text-xs text-gray-400 font-bold tracking-[0.2em] uppercase mb-8 md:mb-0">
                [ Honors ]
              </div>
              <div className="md:col-span-9 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-4 font-mono text-[10px] md:text-xs text-[#3B82F6] font-bold tracking-widest pt-1 uppercase">2025</div>
                  <div className="md:col-span-8">
                    <h5 className="text-lg md:text-xl font-bold uppercase mb-2 tracking-tight text-[#111111]">Juara 3 Web Design IT Festival</h5>
                    <p className="text-sm text-gray-600 leading-relaxed max-w-xl">Fakultas Ilmu Komputer UNIKU. Penghargaan atas kualitas estetika UI/UX, arsitektur kode modular, dan optimasi performa web.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-4 font-mono text-[10px] md:text-xs text-[#3B82F6] font-bold tracking-widest pt-1 uppercase">2024</div>
                  <div className="md:col-span-8">
                    <h5 className="text-lg md:text-xl font-bold uppercase mb-2 tracking-tight text-[#111111]">Nilai Tertinggi ke-1 UKK</h5>
                    <p className="text-sm text-gray-600 leading-relaxed max-w-xl">SMKN 2 Kuningan. Pencapaian akademis dan praktis tertinggi pada evaluasi akhir kompetensi rekayasa perangkat lunak.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: ARTICLES & THOUGHTS (CARD LAYOUT - EDITORIAL) */}
        <section id="journal" className="py-24 md:py-32 hairline-t scroll-fade bg-[#FAFAFA]">
          <SectionHeader number="05" title="Articles & Journal" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12">
            {articlesData.map((article) => (
              <div 
                key={article.id}
                onClick={() => setActiveDetail(article)}
                className="group cursor-pointer flex flex-col bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#111111] transition-all duration-300 p-4 md:p-6 shadow-sm hover:shadow-xl"
              >
                <div className="w-full h-48 md:h-60 overflow-hidden mb-8 bg-[#E5E5E5] border border-[#E5E5E5]">
                  <img 
                    src={article.img} 
                    alt={article.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#3B82F6]">{article.date}</span>
                    <span className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] border border-[#E5E5E5] px-2 py-1">{article.readTime}</span>
                  </div>
                  {/* Menggunakan font Serif untuk judul Artikel agar berasa seperti Koran/Majalah */}
                  <h4 className="text-xl md:text-2xl font-serif-editorial font-bold tracking-tight mb-4 leading-snug text-[#111111] group-hover:text-[#3B82F6] transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-8">
                    {article.desc}
                  </p>
                  
                  <div className="mt-auto pt-4 hairline-t flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111]">
                    Read Article <span className="transform group-hover:translate-x-2 transition-transform text-sm leading-none">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: INVERTED FOOTER / CTA (MEGA CONTRAST) */}
        <section id="contact" className="bg-[#111111] text-[#FAFAFA] pt-32 pb-12 mt-12 scroll-fade">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
            
            <h2 className="text-[11vw] md:text-[8vw] font-black leading-[0.8] tracking-tighter mb-12 text-white uppercase">
              Communication matters<br/>to start good things/
            </h2>
            
            <p className="text-sm md:text-base text-gray-400 font-medium mb-16 max-w-md">
              I'm currently available for freelance worldwide. Feel free to contact me if you want to collaborate on future projects or have a little chat.
            </p>

            <a href="mailto:haikaljibran.dev@gmail.com" className="w-full max-w-xl rounded-full border border-white/20 bg-white/5 py-5 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-black transition-all duration-500 flex justify-center items-center gap-3">
              <span>Let's Connect With Me</span>
              <span className="text-base leading-none">↗</span>
            </a>

            <div className="w-full border-t border-white/10 mt-32 pt-8 flex flex-col md:flex-row justify-between items-center font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 gap-8">
              
              <div className="flex gap-8">
                <a href="https://linkedin.com/in/haikal-jibran-al-ghiffarry" className="hover:text-white transition-colors">LinkedIn ↗</a>
                <a href="https://instagram.com/haikaljibrn__" className="hover:text-white transition-colors">Instagram ↗</a>
                <a href="https://github.com" className="hover:text-white transition-colors">GitHub ↗</a>
              </div>
              
              <div className="text-center md:text-right">
                © 2026 Haikal Jibran. All Rights Reserved.
              </div>
              
            </div>

          </div>
        </section>

      </div>
    </>
  );
}