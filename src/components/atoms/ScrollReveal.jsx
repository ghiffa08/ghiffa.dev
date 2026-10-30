import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

/**
 * ScrollReveal Atom
 * Best practice: Only animates once on initial view after page load.
 * Once revealed, removes all transforms and transitions so elements are 100% static,
 * preventing any re-animation or re-render overhead when scrolling.
 */
export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  y = 36,
  duration = 0.85,
  once = true,
  margin = '-40px 0px -20px 0px',
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, (delay + duration) * 1000 + 50);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasAnimated, delay, duration]);

  if (hasAnimated) {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0'
      } ${className}`}
      style={{
        transform: isInView ? 'translate3d(0, 0px, 0)' : `translate3d(0, ${y}px, 0)`,
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
