import React, { useEffect } from 'react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl relative flex flex-col border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimal Clean Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-gray-100 bg-white">
          <div className="min-w-0 pr-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-950 truncate">
              {item.title}
            </h3>
            {(item.institution || item.period) && (
              <p className="text-xs text-gray-500 font-normal truncate mt-0.5">
                {[item.institution, item.period].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {item.document_url && (
              <a
                href={item.document_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black transition-colors"
                title="Buka dokumen asli"
              >
                <span>Dokumen Asli</span>
                <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Clean Image Viewport */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#F9FAFB] flex items-center justify-center">
          <img
            src={item.image}
            alt={item.title}
            className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl shadow-xs bg-white select-none"
          />
        </div>
      </div>
    </div>
  );
}

