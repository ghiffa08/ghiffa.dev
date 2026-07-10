import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function CVDownloadModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
      // Reset state
      setName('');
      setEmail('');
      setCompany('');
      setStatus('idle');
      setErrorMessage('');
    } else {
      document.body.style.overflow = 'auto';
      if (window.lenis) window.lenis.start();
    }
    return () => {
      document.body.style.overflow = 'auto';
      if (window.lenis) window.lenis.start();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setStatus('error');
      setErrorMessage(t('cvModal.invalidFields', 'Please fill out Name and Email.'));
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/send-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, company }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || t('cvModal.error', 'Failed to send resume. Please try again.'));
      }

      setStatus('success');
    } catch (err) {
      console.error('CV request error:', err);
      setStatus('error');
      setErrorMessage(err.message || t('cvModal.error', 'Failed to send resume. Please try again.'));
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[200] bg-[#111111]/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#FAFAFA] border-4 border-[#111111] p-6 md:p-8 max-w-md w-full relative shadow-[8px_8px_0px_0px_#111111] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 font-mono text-sm font-bold tracking-widest hover:text-[#666666] transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full border-4 border-[#111111] bg-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">
              ✓
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-tight text-[#111111] mb-4">
              {t('cvModal.successHeader', 'SUCCESS')}
            </h3>
            <p className="font-mono text-xs font-medium text-gray-600 leading-relaxed max-w-xs mx-auto">
              {t('cvModal.success', 'Resume has been sent to your email!')}
            </p>
            <button
              onClick={onClose}
              className="mt-8 px-6 py-3 border-2 border-[#111111] bg-[#111111] text-white hover:bg-white hover:text-[#111111] font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-[4px_4px_0px_0px_#666666] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#666666]"
            >
              {t('detail.close', 'CLOSE')}
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-[#111111] mb-6 border-b-2 border-[#111111] pb-2 font-mono">
              [ {t('cvModal.title', 'REQUEST CV / RESUME')} ]
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block font-mono text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-1">
                  {t('cvModal.name', 'NAME')} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  disabled={status === 'loading'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border-2 border-[#111111] bg-white focus:bg-[#FAFAFA] font-mono text-xs outline-none transition-colors"
                  placeholder="e.g. John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-mono text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-1">
                  {t('cvModal.email', 'EMAIL')} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  required
                  disabled={status === 'loading'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border-2 border-[#111111] bg-white focus:bg-[#FAFAFA] font-mono text-xs outline-none transition-colors"
                  placeholder="e.g. john@company.com"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block font-mono text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-1">
                  {t('cvModal.company', 'COMPANY / ORGANIZATION')}
                </label>
                <input 
                  type="text" 
                  disabled={status === 'loading'}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full p-3 border-2 border-[#111111] bg-white focus:bg-[#FAFAFA] font-mono text-xs outline-none transition-colors"
                  placeholder="e.g. Acme Corp (Optional)"
                />
              </div>

              {/* Error Alert */}
              {status === 'error' && (
                <div className="p-3 bg-red-100 border-2 border-red-500 font-mono text-[10px] font-semibold text-red-700 uppercase tracking-wider">
                  ⚠ {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full py-3 bg-[#111111] text-white border-2 border-[#111111] font-mono text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-[#111111] transition-all duration-300 shadow-[4px_4px_0px_0px_#666666] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#666666] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? t('cvModal.sending', 'SENDING...') : t('cvModal.submit', 'SUBMIT')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
