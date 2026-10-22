import React from 'react';

export function CertificateModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-200/90 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clean Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 bg-[#FAFAFA]">
          <div className="flex items-center gap-3 min-w-0 pr-3">
            <span className="bg-[#FF5500]/10 text-[#FF5500] text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
              <span>[ {item.tag || 'CERT'} ]</span>
            </span>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-gray-950 truncate">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 font-medium truncate">
                {item.institution} &bull; {item.period}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {item.document_url && (
              <a
                href={item.document_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3.5 py-1.5 rounded-full bg-gray-900 text-white hover:bg-black transition-colors shadow-xs"
              >
                <span className="hidden sm:inline">Original Document</span>
                <span className="sm:hidden">Document</span>
                <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Image Body with scroll */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 bg-[#F5F5F7] flex items-center justify-center">
          <img
            src={item.image}
            alt={item.title}
            className="max-h-[72vh] w-auto max-w-full object-contain rounded-2xl shadow-sm bg-white select-none"
          />
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-gray-100 bg-white flex items-center justify-between text-xs text-gray-500">
          <span className="font-mono text-[11px] text-gray-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Verified Credential &bull; ghiffa.dev</span>
          </span>
          <a
            href={item.image}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-[#FF5500] hover:underline flex items-center gap-1"
          >
            <span>Open Full Resolution</span>
            <span>&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
