import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  useEffect(() => {
    // Disable missing target warnings from GSAP globally
    gsap.config({ nullTargetWarn: false });

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    window.lenis = lenis; // Keep for global access if needed by modal

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);

    const initAnimations = () => {
      // Hero text lines or intro elements
      const heroLines = gsap.utils.toArray('.anim-fade-up:not(.gsap-anim-done)');
      if (heroLines.length > 0) {
        heroLines.forEach(el => el.classList.add('gsap-anim-done'));
        gsap.fromTo(heroLines, 
          { y: '100%', opacity: 0 }, 
          { y: '0%', opacity: 1, duration: 1.5, stagger: 0.1, ease: 'power4.out', delay: 0.2 }
        );
      }

      // Parallax images
      const parallaxImgs = gsap.utils.toArray('.parallax-img:not(.gsap-anim-done)');
      if (parallaxImgs.length > 0) {
        parallaxImgs.forEach(img => {
          img.classList.add('gsap-anim-done');
          gsap.to(img, {
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
      }

      // Fade up sections (both old and new class names)
      const fadeSections = gsap.utils.toArray('.fade-up:not(.gsap-anim-done), .scroll-fade:not(.gsap-anim-done)');
      if (fadeSections.length > 0) {
        fadeSections.forEach(section => {
          section.classList.add('gsap-anim-done');
          gsap.fromTo(section, 
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
      }
      
      ScrollTrigger.refresh();
    };

    // Run initially for any already-rendered elements
    let initTimeout = setTimeout(() => {
      initAnimations();
    }, 100);

    // Use ResizeObserver for high performance layout watching
    let debounceTimer;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        initAnimations();
      }, 250);
    });

    resizeObserver.observe(document.body);

    return () => {
      clearTimeout(initTimeout);
      clearTimeout(debounceTimer);
      resizeObserver.disconnect();
      lenis.destroy();
      window.lenis = null;
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);
}
