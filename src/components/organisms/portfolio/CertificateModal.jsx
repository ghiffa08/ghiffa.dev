import React, { useEffect } from 'react';
import { getOptimizedImageUrl } from '../../../utils/cloudinary';
import { CertPaper } from './CertPaper';

export function CertificateModal({ item, onClose }) {
  // Close on Escape key
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-10 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      {/* Ultra-clean: just the certificate sheet in its original shape */}
      <div onClick={(e) => e.stopPropagation()} className="relative max-w-[min(92vw,1100px)]">
        <CertPaper
          src={getOptimizedImageUrl(item.image, { width: 1600 })}
          alt={item.title}
          loading="eager"
          className="max-h-[88vh] w-auto"
          imgClassName="max-h-[88vh] w-auto max-w-full object-contain"
        />
      </div>

      {/* Icon-only controls (no text) */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
        {item.document_url && (
          <a
            href={item.document_url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
            aria-label="Buka dokumen asli"
          >
            <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        )}
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
