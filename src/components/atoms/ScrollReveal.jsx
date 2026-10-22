import React, { useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * ScrollReveal Atom
 * Silky smooth scroll reveal with hardware acceleration and reduced-motion support.
 */
export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  y = 36,
  duration = 0.85,
  once = true,
  margin = '-60px 0px -40px 0px',
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin });

  return (
    <div
      ref={ref}
      className={`transition-all will-change-[opacity,transform] ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0'
      } ${className}`}
      style={{
        transform: isInView ? 'translateY(0px)' : `translateY(${y}px)`,
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      {...props}
    >
      {children}
    </div>
  );
}
