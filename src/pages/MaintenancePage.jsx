import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Clock, AlertCircle, Mail, CheckCircle2, ShieldAlert, ArrowUpRight, Lock } from 'lucide-react';
import { DraggableItem } from '../components/atoms/DraggableItem';

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
            <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse"></span>
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
      <main className="relative flex-1 flex items-center justify-center py-12 sm:py-20 px-4 sm:px-6">
        {/* Floating Figma Multiplayer Cursors */}
        
        {/* Cursor 1: Ghiffa (Tech Lead) - Top Left */}
        <div className="hidden md:block absolute top-[18%] left-[10%] z-20 pointer-events-none animate-bounce" style={{ animationDuration: '4s' }}>
          <div className="relative">
            <svg className="w-4 h-4 text-[#10B981] drop-shadow-sm -ml-1 -mt-1" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
            </svg>
            <div className="inline-block bg-[#10B981] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm shadow-sm whitespace-nowrap ml-2">
              Ghiffa (Tech Lead)
            </div>
            <div className="mt-1 ml-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl rounded-tl-xs comment-shadow border border-gray-100 text-xs text-gray-800 font-sans max-w-[200px]">
              Deploying updates & fine-tuning CMS ✨
            </div>
          </div>
        </div>

        {/* Cursor 2: DevOps CI/CD - Bottom Right */}
        <div className="hidden lg:block absolute bottom-[22%] right-[10%] z-20 pointer-events-none animate-pulse" style={{ animationDuration: '3s' }}>
          <div className="relative">
            <svg className="w-4 h-4 text-[#FF5500] drop-shadow-sm -ml-1 -mt-1" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
            </svg>
            <div className="inline-block bg-[#FF5500] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm shadow-sm whitespace-nowrap ml-2">
              DevOps CI/CD
            </div>
            <div className="mt-1 ml-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl rounded-tl-xs comment-shadow border border-gray-100 text-xs text-gray-800 font-sans">
              Build #108 running • Tests passing ✓
            </div>
          </div>
        </div>

        {/* Floating Draggable Tool Chips */}
        {/* Chip 1: Urgent Contact */}
        <DraggableItem className="hidden sm:flex absolute top-[12%] right-[6%] z-30 bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-xs px-3.5 py-2 comment-shadow border border-gray-100 items-start gap-2.5 hover:border-gray-200 transition-colors group">
          <div className="w-6 h-6 rounded-full bg-[#EA4335] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Mail size={12} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="font-semibold text-gray-900">Urgent Inquiries?</span>
              <span className="text-gray-400 font-mono text-[9px]">live</span>
            </div>
            <a
              href="mailto:hello@ghiffa.dev"
              className="text-[11px] text-gray-700 font-medium hover:text-[#FF5500] transition-colors block mt-0.5"
            >
              hello@ghiffa.dev
            </a>
          </div>
        </DraggableItem>

        {/* Chip 2: Clock */}
        <DraggableItem className="hidden sm:flex absolute bottom-[14%] left-[6%] z-30 bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-xs px-3.5 py-2 comment-shadow border border-gray-100 items-center gap-2.5 hover:border-gray-200 transition-colors group">
          <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0">
            <Clock size={12} />
          </div>
          <div className="text-left font-mono">
            <span className="text-[9px] uppercase font-bold text-gray-400 block leading-tight">Server Time</span>
            <span className="text-xs font-bold text-[#141414]">{formattedTime}</span>
          </div>
        </DraggableItem>

        {/* CENTRAL HERO SELECTION BOUNDING BOX */}
        <div className="max-w-3xl w-full mx-auto relative z-20">
          <div className="relative figma-bbox bg-white/90 backdrop-blur-md p-6 sm:p-12 md:p-16 soft-card-shadow text-center">
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
            <div className="absolute -top-3.5 left-6 bg-[#FF5500] text-white text-[10px] font-mono px-2.5 py-0.5 rounded-[3px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1.5">
              <span>FRAME: SYSTEM_UPDATE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            </div>

            {/* Spinning Brand Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#141414] rounded-2xl flex items-center justify-center shadow-lg border border-gray-800">
                  <Settings className="text-white animate-spin" size={36} style={{ animationDuration: '6s' }} />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#FF5500] rounded-full flex items-center justify-center shadow-sm">
                  <AlertCircle className="text-white" size={14} />
                </div>
              </div>
            </div>

            {/* Giant Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-[-0.04em] text-[#141414] mb-4 leading-[1.08]">
              Under Maintenance
            </h1>

            {/* Descriptive Body */}
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
              We're currently fine-tuning core services, optimizing assets, and deploying updates. Everything will be back online shortly.
            </p>

            {/* Time / Status Monospace Pill for mobile */}
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200/90 rounded-full px-4 sm:px-5 py-2 font-mono text-xs text-gray-700 shadow-2xs mb-8">
              <Clock size={14} className="text-[#FF5500]" />
              <span className="font-semibold text-gray-500">LIVE TIME:</span>
              <span className="font-bold text-gray-900">{formattedTime}</span>
            </div>

            {/* Bento Detail Cards (Inside Selection) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left border-t border-gray-100 pt-8">
              <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100">
                <div className="font-mono text-[10px] uppercase font-bold text-gray-400 mb-1">
                  Status
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#141414] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  Maintenance Mode
                </div>
              </div>

              <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100">
                <div className="font-mono text-[10px] uppercase font-bold text-gray-400 mb-1">
                  Duration
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#141414]">
                  A few moments
                </div>
              </div>

              <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100">
                <div className="font-mono text-[10px] uppercase font-bold text-gray-400 mb-1">
                  Direct Line
                </div>
                <a 
                  href="mailto:hello@ghiffa.dev" 
                  className="text-xs sm:text-sm font-bold text-[#FF5500] hover:underline truncate block"
                >
                  hello@ghiffa.dev
                </a>
              </div>
            </div>
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
