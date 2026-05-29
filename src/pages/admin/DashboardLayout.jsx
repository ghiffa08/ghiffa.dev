import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { 
  LogOut, 
  LayoutDashboard, 
  Type, 
  Briefcase, 
  FileText,
  User,
  History,
  GraduationCap,
  Mail
} from 'lucide-react';

export default function DashboardLayout() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        navigate('/admin');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/admin" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/panel/dashboard', icon: LayoutDashboard },
    { name: 'Hero Section', path: '/admin/panel/hero', icon: Type },
    { name: 'About Section', path: '/admin/panel/about', icon: User },
    { name: 'Experiences', path: '/admin/panel/experiences', icon: History },
    { name: 'Projects', path: '/admin/panel/projects', icon: Briefcase },
    { name: 'Education & Honors', path: '/admin/panel/qualifications', icon: GraduationCap },
    { name: 'Articles', path: '/admin/panel/articles', icon: FileText },
    { name: 'Contact', path: '/admin/panel/contact', icon: Mail },
  ];

  return (
    <div className="flex h-screen bg-[#FAFAFA] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E5E5] flex flex-col">
        <div className="p-6 border-b border-[#E5E5E5]">
          <h2 className="text-xl font-black tracking-tighter uppercase text-[#111111]">CMS Panel</h2>
          <p className="text-xs text-gray-500 font-mono mt-1">{session.user.email}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-[#111111] text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <item.icon size={18} />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#E5E5E5]">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
