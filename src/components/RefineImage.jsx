'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RefineFrame } from './RefineFrame';

/**
 * Reusable high-level image component integrated with React Bits RefineFrame.
 * Provides progressive stage resolution ('generating' -> 'refining' -> 'complete'),
 * pixelated canvas sweep glint, error fallback, and zero layout shift.
 */
// Global cache of resolved images so images only refine once and stay crisp on scroll
const RESOLVED_IMAGES = new Set();

export function RefineImage({
  src,
  alt = '',
  aspectRatio = '4 / 3',
  width = '100%',
  radius = 16,
  background = 'transparent',
  color = '#f5f5f5',
  className = '',
  imgClassName = '',
  style = {},
  showStatus = false,
  sweep = true,
  stageDuration = 400,
  hideAfter = 1200,
  onClick,
  loading = 'lazy',
  priority = false,
  crossOrigin = 'anonymous',
  fallbackSrc,
  ...rest
}) {
  const isAlreadyLoaded = Boolean(src && RESOLVED_IMAGES.has(src));
  const [status, setStatus] = useState(isAlreadyLoaded ? 'complete' : 'generating');
  const imgRef = useRef(null);
  const timersRef = useRef([]);

  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const startSequence = () => {
    if (!src || RESOLVED_IMAGES.has(src)) {
      setStatus('complete');
      return;
    }
    clearAllTimers();
    setStatus('generating');
    const t1 = setTimeout(() => {
      setStatus('refining');
      const t2 = setTimeout(() => {
        if (src) RESOLVED_IMAGES.add(src);
        setStatus('complete');
      }, stageDuration);
      timersRef.current.push(t2);
    }, stageDuration);
    timersRef.current.push(t1);
  };

  useEffect(() => {
    if (!src || RESOLVED_IMAGES.has(src)) {
      setStatus('complete');
      return;
    }
    if (imgRef.current?.complete && imgRef.current?.naturalWidth) {
      startSequence();
    } else {
      setStatus('generating');
    }
    return clearAllTimers;
  }, [src, stageDuration]);

  const handleLoad = (e) => {
    if (src && RESOLVED_IMAGES.has(src)) {
      setStatus('complete');
    } else {
      startSequence();
    }
    if (rest.onLoad) rest.onLoad(e);
  };

  const handleError = (e) => {
    if (fallbackSrc && e.target.src !== fallbackSrc) {
      e.target.src = fallbackSrc;
      setStatus('generating');
      return;
    }
    setStatus('error');
    if (rest.onError) rest.onError(e);
  };

  return (
    <RefineFrame
      status={status}
      aspectRatio={aspectRatio}
      width={width}
      radius={radius}
      background={background}
      color={color}
      stageDuration={stageDuration}
      sweep={sweep}
      showStatus={showStatus}
      hideAfter={hideAfter}
      className={className}
      style={style}
      onRetry={() => {
        setStatus('generating');
        if (imgRef.current) {
          const currentSrc = imgRef.current.src;
          imgRef.current.src = '';
          imgRef.current.src = currentSrc;
        }
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : loading}
        decoding="async"
        crossOrigin={crossOrigin}
        className={`w-full h-full object-cover ${imgClassName}`}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        {...rest}
      />
    </RefineFrame>
  );
}

export default RefineImage;
