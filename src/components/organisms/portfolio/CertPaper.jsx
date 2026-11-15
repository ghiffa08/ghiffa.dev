import React from 'react';

// Fine paper fibre noise (high-frequency turbulence)
const FIBER_NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.15' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.3 0 0 0 0 0.22 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`;

// Low-frequency cotton/linen mottling typical of certificate stock
const COTTON_MOTTLE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.018 0.06' numOctaves='4' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.48 0 0 0 0 0.35 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23m)'/%3E%3C/svg%3E")`;

/**
 * Borderless certificate sheet: original image shape + real paper texture.
 * The wrapper sizes itself to the image so the cert keeps its natural ratio.
 */
export function CertPaper({ src, alt = '', className = '', imgClassName = '', loading = 'lazy', shadow = true, style }) {
  return (
    <div
      className={`relative overflow-hidden bg-[#FBF8F1] ${className}`}
      style={{
        boxShadow: shadow
          ? '0 1px 1px rgba(60,45,20,0.08), 0 6px 14px -4px rgba(60,45,20,0.18), 0 18px 32px -14px rgba(0,0,0,0.22)'
          : undefined,
        ...style
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          draggable={false}
          className={`block select-none ${imgClassName || 'w-full h-auto'}`}
        />
      ) : (
        <div className="w-full aspect-[1.414/1]" />
      )}

      {/* Warm cotton-stock tint */}
      <div className="absolute inset-0 pointer-events-none mix-blend-multiply bg-[#F3E9D2] opacity-[0.22]" />
      {/* Cotton mottling */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.28]"
        style={{ backgroundImage: COTTON_MOTTLE, backgroundSize: '400px 400px' }}
      />
      {/* Paper fibres */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.18]"
        style={{ backgroundImage: FIBER_NOISE, backgroundSize: '240px 240px' }}
      />
      {/* Soft light sheen + slight edge darkening (paper thickness) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(125deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 38%, rgba(0,0,0,0) 70%, rgba(80,60,30,0.07) 100%)',
          boxShadow: 'inset 0 0 0 0.5px rgba(80,60,30,0.10), inset 0 0 18px rgba(120,95,50,0.08)'
        }}
      />
    </div>
  );
}
