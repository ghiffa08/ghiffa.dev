import React from 'react';
import { Menu, X, LogOut, ArrowLeft } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

export default function AppHeader({ userEmail }) {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const navigate = useNavigate();

  const handleToggle = () => {
    if (window.innerWidth >= 1280) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await supabase.auth.signOut();
      navigate('/admin');
    }
  };

  return (
    <header className="sticky top-0 bg-white border-b border-black/10 z-30 font-mono text-[#111111] h-16 flex items-center px-6 justify-between">
      <div className="flex items-center gap-4">
        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          className="p-1 hover:bg-gray-100 border border-black/10 transition-colors"
          aria-label="Toggle Sidebar"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link 
          to="/"
          className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#111111] transition-colors"
        >
          <ArrowLeft size={14} /> Back to Website
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <span className="hidden sm:inline-block text-[10px] text-gray-500 font-bold uppercase tracking-wider">
          Logged in as: <strong className="text-[#111111]">{userEmail}</strong>
        </span>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 border border-red-500 text-red-500 hover:bg-red-50 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </header>
  );
}
