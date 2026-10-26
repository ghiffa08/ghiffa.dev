import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Clock, Mail, ArrowUpRight, Lock } from 'lucide-react';

export default function MaintenancePage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <div className="min-h-screen bg-white bg-architectural-dots flex flex-col justify-between text-[#141414] font-sans relative overflow-x-hidden select-none">
      {/* 1. TOP NAV BAR */}
      <header className="w-full z-40 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-lg sm:text-xl font-bold tracking-tight text-[#141414] hover:opacity-80 transition-opacity">
            ghiffa.dev
          </Link>
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 bg-gray-100 text-gray-600 rounded-sm uppercase tracking-wider font-semibold">
            Status: Maintenance
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Indicator Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-[11px] font-mono font-medium text-amber-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse" />
            <span className="font-semibold">SCHEDULED UPDATE</span>
          </div>

          {/* Admin Entry Link */}
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold bg-[#111111] text-white hover:bg-[#FF5500] transition-colors rounded-full"
            title="Admin Login"
          >
            <Lock size={12} />
            <span className="hidden sm:inline">ADMIN</span>
          </Link>
        </div>
      </header>

      {/* 2. MAIN FIGMA CANVAS WORKSPACE */}
      <main className="relative flex-1 flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6">
        {/* Subtle, Clean Multiplayer Cursors (Authentic to Portfolio Hero, No Chat Clutter) */}
        {/* Cursor 1: Ghiffa (Tech Lead) - Top Left */}
        <div className="hidden md:flex items-start gap-1 absolute top-[24%] left-[12%] z-10 pointer-events-none select-none animate-pulse" style={{ animationDuration: '4s' }}>
          <svg className="w-3.5 h-3.5 text-[#10B981] drop-shadow-xs -ml-1 -mt-0.5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
          </svg>
          <div className="bg-[#10B981] text-white text-[10px] font-mono font-medium px-2 py-0.5 rounded-[4px] shadow-xs">
            Ghiffa (Tech Lead)
          </div>
        </div>

        {/* Cursor 2: CI/CD System - Bottom Right */}
        <div className="hidden lg:flex items-start gap-1 absolute bottom-[26%] right-[14%] z-10 pointer-events-none select-none animate-pulse" style={{ animationDuration: '3s' }}>
          <svg className="w-3.5 h-3.5 text-[#FF5500] drop-shadow-xs -ml-1 -mt-0.5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
          </svg>
          <div className="bg-[#FF5500] text-white text-[10px] font-mono font-medium px-2 py-0.5 rounded-[4px] shadow-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>Deploying Updates</span>
          </div>
        </div>

        {/* SIGNATURE CLEAN CENTERPIECE */}
        <div className="max-w-2xl w-full mx-auto text-center relative z-20">
          {/* Brand Icon */}
          <div className="w-14 h-14 bg-[#141414] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md border border-gray-800">
            <Settings className="animate-spin text-white" size={26} style={{ animationDuration: '8s' }} />
          </div>

          {/* Snug Figma Selection Bounding Box around Title */}
          <div className="inline-block relative figma-bbox px-4 min-[400px]:px-8 sm:px-12 py-3 sm:py-5 mb-5 bg-white/50 backdrop-blur-xs">
            {/* 8 Signature Figma Handles */}
            <span className="figma-handle -top-1 -left-1" />
            <span className="figma-handle -top-1 left-1/2 -translate-x-1/2" />
            <span className="figma-handle -top-1 -right-1" />
            <span className="figma-handle top-1/2 -translate-y-1/2 -left-1" />
            <span className="figma-handle top-1/2 -translate-y-1/2 -right-1" />
            <span className="figma-handle -bottom-1 -left-1" />
            <span className="figma-handle -bottom-1 left-1/2 -translate-x-1/2" />
            <span className="figma-handle -bottom-1 -right-1" />

            {/* Figma Frame Layer Tag */}
            <div className="absolute -top-3.5 left-4 bg-[#FF5500] text-white text-[9px] sm:text-[10px] font-mono px-2.5 py-0.5 rounded-[3px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <span>SYSTEM UPDATE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>

            <h1 className="text-3xl min-[400px]:text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.04em] text-[#141414] leading-[1.08] select-none">
              Under Maintenance
            </h1>
          </div>

          {/* Clean Descriptive Message */}
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-lg mx-auto font-normal leading-relaxed mb-8 px-4">
            We're currently fine-tuning core services, optimizing assets, and deploying updates. Everything will be back online shortly.
          </p>

          {/* Minimalist Centered Info Pill Dock */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200/90 soft-card-shadow font-mono text-xs max-w-full">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 text-gray-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-gray-400 text-[10px] uppercase font-bold">Status:</span>
              <span className="font-bold text-[#141414]">In Progress</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 text-gray-700">
              <Clock size={13} className="text-[#FF5500]" />
              <span className="text-gray-400 text-[10px] uppercase font-bold">Live:</span>
              <span className="font-bold text-[#141414]">{formattedTime}</span>
            </div>

            <a
              href="mailto:hello@ghiffa.dev"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141414] text-white hover:bg-[#FF5500] transition-colors font-medium cursor-pointer"
            >
              <Mail size={13} />
              <span>hello@ghiffa.dev</span>
            </a>
          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="w-full z-40 px-4 sm:px-8 py-4 border-t border-gray-100 bg-white/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-gray-500">
        <div>
          © {currentTime.getFullYear()} <span className="font-bold text-gray-900">GHIFFA.DEV</span> • ALL SYSTEMS OPERATIONAL SHORTLY
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/ghiffa08"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://instagram.com/haikaljibraan"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors"
          >
            Instagram
          </a>
          <Link
            to="/admin"
            className="hover:text-[#FF5500] font-bold transition-colors inline-flex items-center gap-1"
          >
            Admin Panel <ArrowUpRight size={12} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
