import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  useEffect(() => {
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

    gsap.fromTo('.hero-text-line', 
      { y: '100%', opacity: 0 }, 
      { y: '0%', opacity: 1, duration: 1.5, stagger: 0.1, ease: 'power4.out', delay: 0.5 }
    );

    gsap.utils.toArray('.parallax-img').forEach(img => {
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

    gsap.utils.toArray('.fade-up').forEach(section => {
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

    return () => {
      lenis.destroy();
      window.lenis = null;
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);
}
