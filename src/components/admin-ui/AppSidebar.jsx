import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSidebar } from './SidebarContext';
import { 
  LayoutDashboard, 
  Settings, 
  User, 
  History, 
  Briefcase, 
  GraduationCap, 
  Link as LinkIcon,
  FileText
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/admin/panel/dashboard', icon: LayoutDashboard },
  { name: 'Settings', path: '/admin/panel/settings', icon: Settings },
  { name: 'Personal Info', path: '/admin/panel/personal', icon: User },
  { name: 'Experiences', path: '/admin/panel/experiences', icon: History },
  { name: 'Projects', path: '/admin/panel/projects', icon: Briefcase },
  { name: 'Education', path: '/admin/panel/qualifications', icon: GraduationCap },
  { name: 'Articles', path: '/admin/panel/articles', icon: FileText },
  { name: 'Bio Links', path: '/admin/panel/links', icon: LinkIcon },
];

export default function AppSidebar({ userEmail }) {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

  const showLabel = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 h-screen bg-white border-r border-black/10 text-[#111111] transition-all duration-300 ease-in-out z-50 flex flex-col font-mono
        ${showLabel ? "w-[260px]" : "w-[80px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        xl:translate-x-0`}
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-black/10 flex items-center justify-between">
        <Link to="/" className="flex flex-col">
          <span className="text-lg font-black tracking-tighter uppercase leading-none">CMS PANEL</span>
          {showLabel && (
            <span className="text-[10px] text-gray-500 truncate max-w-[200px] mt-1 font-bold">
              {userEmail}
            </span>
          )}
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 border border-transparent transition-all duration-200 uppercase text-xs font-bold tracking-wider ${
                isActive 
                  ? 'bg-[#111111] text-[#FAFAFA] border-[#111111]' 
                  : 'text-gray-600 hover:text-[#111111] hover:bg-gray-50'
              } ${!showLabel ? 'justify-center' : ''}`
            }
          >
            <item.icon size={18} className="shrink-0" />
            {showLabel && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer copyright or small badge */}
      {showLabel && (
        <div className="p-6 border-t border-black/10 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
          © GHIFFA.DEV
        </div>
      )}
    </aside>
  );
}
