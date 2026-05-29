import React, { useState, useEffect } from 'react';

export default function App() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  // Link Data
  const mainLinks = [
    {
      id: '01',
      title: 'Main Portfolio Website',
      subtitle: 'ghiifa.dev',
      url: '#',
      featured: true,
    },
    {
      id: '02',
      title: 'LinkedIn Profile',
      subtitle: 'Professional Network',
      url: 'https://linkedin.com/in/haikal-jibran-al-ghiffarry',
      featured: false,
    },
    {
      id: '03',
      title: 'GitHub Repositories',
      subtitle: 'Open Source & Code',
      url: '#',
      featured: false,
    },
    {
      id: '04',
      title: 'Instagram',
      subtitle: '@haikaljibrn__',
      url: 'https://instagram.com/haikaljibrn__',
      featured: false,
    },
    {
      id: '05',
      title: 'Send an Email',
      subtitle: 'haikaljibran.dev@gmail.com',
      url: 'mailto:haikaljibran.dev@gmail.com',
      featured: false,
    }
  ];

  // Dynamic GSAP Loader for entrance animations
  useEffect(() => {
    const loadGSAP = async () => {
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

      await addScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
      setScriptsLoaded(true);
    };
    loadGSAP();
  }, []);

  // Initialize GSAP Animations
  useEffect(() => {
    if (!scriptsLoaded) return;

    // Animate Header & Hero
    window.gsap.fromTo('.anim-fade-down', 
      { y: -20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.1 }
    );

    // Animate Links
    window.gsap.fromTo('.anim-slide-up', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.3 }
    );

  }, [scriptsLoaded]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
        
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
          -webkit-font-smoothing: antialiased;
        }

        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .hairline-b { border-bottom: 1px solid var(--grid-line); }
        .hairline-t { border-top: 1px solid var(--grid-line); }
        .hairline-r { border-right: 1px solid var(--grid-line); }
        .hairline-l { border-left: 1px solid var(--grid-line); }
        
        ::selection { background: var(--text); color: var(--bg); }
        
        /* Noise Overlay for Editorial Vibe */
        .bg-noise {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          pointer-events: none;
          z-index: 50;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}} />

      <div className="bg-noise"></div>

      {/* Main Wrapper: Centered Mobile Container */}
      <div className="min-h-screen flex justify-center w-full bg-[#FAFAFA] p-0 sm:p-4 md:p-8">
        
        <div className="w-full max-w-[480px] bg-[#FAFAFA] flex flex-col relative sm:hairline-l sm:hairline-r sm:border-[#E5E5E5] sm:shadow-2xl sm:shadow-black/5 overflow-hidden">
          
          {/* 1. TOP BAR */}
          <header className="flex justify-between items-center p-4 hairline-b anim-fade-down font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase">
            <div>[ VOL. 01 ]</div>
            <div className="text-center">GHIIFA.DEV</div>
            <div className="text-right">KUNINGAN</div>
          </header>

          {/* 2. HERO / PROFILE */}
          <section className="pt-12 pb-8 px-6 text-center anim-fade-down">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-[0.85] mb-4">
              HAIKAL JIBRAN
              <br />
              <span className="text-gray-400">AL-GHIFFARRY</span>
            </h1>
            
            <div className="font-mono text-xs text-[#3B82F6] uppercase tracking-widest mb-4">
              Building the bridge between bits and atoms.
            </div>
            
            <p className="text-sm font-medium text-gray-600 px-4">
              IoT Engineer | Fullstack Developer
            </p>
          </section>

          {/* 3. LATEST HIGHLIGHT (Featured Link) */}
          <section className="px-6 py-4 anim-slide-up">
            <div className="font-mono text-[10px] text-gray-400 mb-2 uppercase tracking-widest">
              [ LATEST PROJECT ]
            </div>
            <a 
              href="#" 
              className="block relative overflow-hidden group hairline-t hairline-b hairline-l hairline-r bg-[#111111] text-[#FAFAFA] p-6 hover:bg-[#3B82F6] transition-colors duration-500"
            >
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2 relative z-10">
                RETHREEE <br/> Eco-Market
              </h2>
              <p className="font-mono text-xs text-gray-400 group-hover:text-blue-100 relative z-10 transition-colors">
                Marketplace daur ulang terintegrasi ↗
              </p>
              
              {/* Decorative Element */}
              <div className="absolute -right-4 -bottom-4 text-8xl font-black text-white opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12 pointer-events-none">
                01
              </div>
            </a>
          </section>

          {/* 4. LINK LIST */}
          <section className="flex-1 flex flex-col mt-4 anim-slide-up">
            <div className="px-6 font-mono text-[10px] text-gray-400 mb-2 uppercase tracking-widest">
              [ DIRECTORY ]
            </div>
            
            <div className="flex flex-col w-full hairline-t">
              {mainLinks.map((link) => (
                <a 
                  key={link.id}
                  href={link.url}
                  className="group flex items-center justify-between p-5 sm:p-6 hairline-b hover:bg-[#111111] hover:text-[#FAFAFA] transition-colors duration-300"
                >
                  <div className="flex items-center space-x-4 sm:space-x-6">
                    <span className="font-mono text-xs text-gray-400 group-hover:text-[#3B82F6] transition-colors">
                      {link.id}.
                    </span>
                    <div>
                      <h3 className="font-bold text-lg uppercase tracking-tight mb-0.5">
                        {link.title}
                      </h3>
                      <p className="font-mono text-[10px] text-gray-500 group-hover:text-gray-400 uppercase">
                        {link.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  {/* Arrow Icon */}
                  <div className="text-gray-300 group-hover:text-[#FAFAFA] transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 font-mono text-lg">
                    ↗
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* 5. FOOTER */}
          <footer className="mt-12 p-6 hairline-t flex flex-col items-center justify-center bg-[#FAFAFA] anim-slide-up">
            <div className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2 text-center">
              © 2026 HAIKAL JIBRAN AL-GHIFFARRY
            </div>
            <div className="flex space-x-4 font-mono text-[10px] text-[#111111] font-bold">
              <a href="mailto:haikaljibran.dev@gmail.com" className="hover:text-[#3B82F6] border-b border-transparent hover:border-[#3B82F6] transition-colors">EMAIL</a>
              <span>/</span>
              <a href="tel:+6285156958580" className="hover:text-[#3B82F6] border-b border-transparent hover:border-[#3B82F6] transition-colors">PHONE</a>
            </div>
          </footer>

        </div>
      </div>
    </>
  );
}