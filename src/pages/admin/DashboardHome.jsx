import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProjectRepository } from '../../repositories/ProjectRepository';
import { BioLinksRepository } from '../../repositories/BioLinksRepository';
import { supabase } from '../../lib/supabaseClient';
import { 
  Briefcase, 
  Link as LinkIcon, 
  LayoutDashboard, 
  QrCode, 
  Link2, 
  BarChart3,
  ArrowRight,
  RefreshCw,
  FileText
} from 'lucide-react';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    projects: 0,
    links: 0
  });
  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const [syncMessage, setSyncMessage] = useState('');

  useEffect(() => {
    async function loadResumeData() {
      try {
        const [infoRes, expRes, qualRes] = await Promise.all([
          supabase.from('personal_info').select('*').single(),
          supabase.from('experiences').select('*').order('order_index', { ascending: true }),
          supabase.from('qualifications').select('*').order('order_index', { ascending: true })
        ]);
        setResumeData({
          info: infoRes.data,
          experiences: expRes.data || [],
          qualifications: qualRes.data || []
        });
      } catch (error) {
        console.error('Error fetching resume data:', error);
      }
    }
    loadResumeData();
  }, []);

  const handleSyncResumes = async () => {
    if (!resumeData) {
      setSyncStatus('error');
      setSyncMessage('Resume data has not loaded yet.');
      return;
    }

    setSyncing(true);
    setSyncStatus('idle');
    setSyncMessage('Loading PDF generator...');

    try {
      // Lazy load PDF generator module (code splitting)
      const { generateResumeZip } = await import('../../utils/pdfGenerator');
      
      // Generate ZIP with progress callback
      const zipBlob = await generateResumeZip(resumeData, setSyncMessage);

      // Upload to Supabase Storage
      setSyncMessage('Uploading resumes.zip to storage...');
      const { error } = await supabase.storage
        .from('portfolio-media')
        .upload('resumes.zip', zipBlob, { upsert: true });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      setSyncStatus('success');
      setSyncMessage('Resumes synced and uploaded to Supabase Storage successfully!');
    } catch (error) {
      console.error('Error syncing resumes:', error);
      setSyncStatus('error');
      setSyncMessage(error.message || 'An error occurred during resume sync.');
    } finally {
      setSyncing(false);
    }
  };

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
      path: '/admin/panel/url-shortener',
      status: 'active',
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      name: 'QR Generator',
      description: 'Generate customized QR codes for your links.',
      icon: QrCode,
      path: '/admin/panel/qr-generator',
      status: 'active',
      color: 'bg-pink-50 text-pink-600'
    },
    {
      name: 'Web Analytics',
      description: 'Track your portfolio and link-in-bio performance with real-time visitor insights.',
      icon: BarChart3,
      path: 'https://analytics.google.com',
      status: 'external',
      color: 'bg-purple-50 text-purple-600',
      external: true
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
                  {app.status === 'external' && (
                    <span className="bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
                      External
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
                ) : app.status === 'external' ? (
                  <a 
                    href={app.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm font-bold text-[#111111] hover:text-purple-600 transition-colors"
                  >
                    Open Analytics ↗
                  </a>
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

      {/* Resume Synchronization Panel */}
      <div className="bg-white p-6 border border-black/10 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="text-gray-700" size={20} />
          <h3 className="text-sm font-bold tracking-wider text-gray-700 uppercase">Resume Synchronization</h3>
        </div>
        
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          Generate PDF versions of your ATS and Editorial resumes using the current CMS database entries, package them into a ZIP archive, and upload it directly to Supabase Storage to sync the public resume download links.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={handleSyncResumes}
            disabled={syncing || !resumeData}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#111111] text-white hover:bg-white hover:text-[#111111] border-2 border-[#111111] font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-[4px_4px_0px_0px_#666666] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#666666] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncing ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                SYNCING...
              </>
            ) : (
              <>
                <RefreshCw size={14} />
                GENERATE & SYNC RESUMES
              </>
            )}
          </button>
          
          {syncStatus !== 'idle' && (
            <span className={`text-[10px] font-bold uppercase tracking-wider ${syncStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {syncStatus === 'success' ? '✓' : '⚠'} {syncMessage}
            </span>
          )}
          
          {syncing && (
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider animate-pulse">
              {syncMessage}
            </span>
          )}
        </div>
      </div>


    </div>
  );
}
