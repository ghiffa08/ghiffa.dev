import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProjectRepository } from '../../repositories/ProjectRepository';
import { BioLinksRepository } from '../../repositories/BioLinksRepository';
import { 
  Briefcase, 
  Link as LinkIcon, 
  LayoutDashboard, 
  QrCode, 
  Link2, 
  BarChart3,
  ArrowRight
} from 'lucide-react';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    projects: 0,
    links: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projectsData, linksData] = await Promise.all([
          ProjectRepository.getAllProjects(),
          BioLinksRepository.getAllLinks()
        ]);

        setStats({
          projects: projectsData.length,
          links: linksData.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const apps = [
    {
      name: 'Portfolio CMS',
      description: 'Manage your website content, experiences, and projects.',
      icon: LayoutDashboard,
      path: '/admin/panel/personal',
      status: 'active',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      name: 'Link in Bio',
      description: 'Manage your bio links for social media profiles.',
      icon: LinkIcon,
      path: '/admin/panel/links',
      status: 'active',
      color: 'bg-green-50 text-green-600'
    },
    {
      name: 'URL Shortener',
      description: 'Create and track short links for your campaigns.',
      icon: Link2,
      path: '#',
      status: 'coming_soon',
      color: 'bg-gray-100 text-gray-400'
    },
    {
      name: 'QR Generator',
      description: 'Generate customized QR codes for your links.',
      icon: QrCode,
      path: '#',
      status: 'coming_soon',
      color: 'bg-gray-100 text-gray-400'
    },
    {
      name: 'Web Analytics',
      description: 'Track your portfolio and link-in-bio performance.',
      icon: BarChart3,
      path: '#',
      status: 'coming_soon',
      color: 'bg-gray-100 text-gray-400'
    }
  ];

  return (
    <div className="space-y-8 font-mono text-[#111111]">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black uppercase mb-2">Welcome Back!</h2>
        <p className="text-gray-500 text-sm">Here is an overview of your platform and apps.</p>
      </div>

      {/* Stats Overview */}
      <div>
        <h3 className="text-sm font-bold tracking-wider text-gray-700 mb-4 uppercase">System Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-none border border-black/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total Projects</p>
              <h4 className="text-3xl font-black">{loading ? '-' : stats.projects}</h4>
            </div>
            <div className="bg-orange-50 p-3 rounded-full text-orange-600">
              <Briefcase size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-none border border-black/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Bio Links</p>
              <h4 className="text-3xl font-black">{loading ? '-' : stats.links}</h4>
            </div>
            <div className="bg-green-50 p-3 rounded-full text-green-600">
              <LinkIcon size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* App Grid */}
      <div>
        <h3 className="text-sm font-bold tracking-wider text-gray-700 mb-4 uppercase">Your Applications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-none border border-black/10 shadow-sm overflow-hidden flex flex-col h-full transition-all duration-200 ${app.status === 'active' ? 'hover:border-[#111111]' : 'opacity-70'}`}
            >
              <div className="p-6 flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-none ${app.color}`}>
                    <app.icon size={24} />
                  </div>
                  {app.status === 'coming_soon' && (
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
                      Coming Soon
                    </span>
                  )}
                  {app.status === 'active' && (
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
                      Active
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-bold mb-2">{app.name}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{app.description}</p>
              </div>
              
              <div className="px-6 py-4 border-t border-black/10 bg-[#FAFAFA]">
                {app.status === 'active' ? (
                  <Link 
                    to={app.path}
                    className="flex items-center text-sm font-bold text-[#111111] hover:text-blue-600 transition-colors"
                  >
                    Open App <ArrowRight size={16} className="ml-2" />
                  </Link>
                ) : (
                  <span className="text-sm font-medium text-gray-400 flex items-center cursor-not-allowed">
                    In Development
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
