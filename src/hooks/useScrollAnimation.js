import { useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * Custom hook for scroll-triggered animations
 * @param {Object} options - InView options
 * @returns {Object} - ref and isInView state
 */
export function useScrollAnimation(options = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px',
    ...options
  });

  return { ref, isInView };
}
