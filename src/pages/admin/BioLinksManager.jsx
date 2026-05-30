import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit2, Trash2, Link as LinkIcon, Star, EyeOff, Eye } from 'lucide-react';

export default function BioLinksManager() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    url: '',
    featured: false,
    is_active: true,
    order_index: 0
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bio_links')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (data) {
      setLinks(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      url: '',
      featured: false,
      is_active: true,
      order_index: links.length + 1
    });
    setEditingId(null);
  };

  const handleEdit = (link) => {
    setFormData({
      title: link.title,
      subtitle: link.subtitle || '',
      url: link.url,
      featured: link.featured,
      is_active: link.is_active,
      order_index: link.order_index
    });
    setEditingId(link.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    
    const { error } = await supabase.from('bio_links').delete().eq('id', id);
    if (error) {
      setMessage('Error deleting: ' + error.message);
    } else {
      setMessage('Link deleted successfully!');
      fetchLinks();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    if (editingId) {
      const { error } = await supabase
        .from('bio_links')
        .update(formData)
        .eq('id', editingId);
        
      if (error) setMessage('Error updating: ' + error.message);
      else {
        setMessage('Link updated successfully!');
        resetForm();
        fetchLinks();
      }
    } else {
      const { error } = await supabase
        .from('bio_links')
        .insert([formData]);
        
      if (error) setMessage('Error inserting: ' + error.message);
      else {
        setMessage('Link created successfully!');
        resetForm();
        fetchLinks();
      }
    }
    setSaving(false);
  };

  if (loading && links.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-black mb-6 uppercase border-b border-[#E5E5E5] pb-4">Bio Links Manager</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded-md font-mono text-xs ${message.includes('Error') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
          {message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6 max-w-2xl bg-white p-6 border border-[#E5E5E5] rounded-md shadow-sm mb-12">
        <h3 className="font-bold text-lg mb-4 flex items-center">
          {editingId ? <><Edit2 size={18} className="mr-2" /> Edit Link</> : <><Plus size={18} className="mr-2" /> Add New Link</>}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">TITLE</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#666666] transition-colors rounded-sm"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. My Portfolio"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">SUBTITLE (Optional)</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#666666] transition-colors rounded-sm"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g. Check out my latest work"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">URL</label>
            <input
              type="url"
              required
              className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#666666] transition-colors rounded-sm"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">ORDER INDEX</label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#666666] transition-colors rounded-sm"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="flex flex-col gap-4 justify-center mt-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#111111]"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <span className="text-sm font-bold">Featured Link</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#111111]"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span className="text-sm font-bold">Active (Visible)</span>
            </label>
          </div>
        </div>

        <div className="flex space-x-4 pt-4 border-t border-[#E5E5E5]">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#111111] text-[#FAFAFA] font-bold font-mono text-sm px-8 py-3 hover:bg-[#666666] transition-colors disabled:opacity-50"
          >
            {saving ? 'SAVING...' : (editingId ? 'UPDATE LINK' : 'ADD LINK')}
          </button>
          
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 text-gray-800 font-bold font-mono text-sm px-8 py-3 hover:bg-gray-300 transition-colors"
            >
              CANCEL
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div>
        <h3 className="font-bold text-lg mb-4 flex items-center">
          <LinkIcon size={18} className="mr-2" /> Managed Links
        </h3>
        
        <div className="space-y-4">
          {links.length === 0 ? (
            <p className="text-gray-500 italic">No links found. Create one above.</p>
          ) : (
            links.map((link) => (
              <div 
                key={link.id} 
                className={`flex flex-col md:flex-row md:items-center justify-between p-5 bg-white border ${link.is_active ? 'border-[#E5E5E5]' : 'border-dashed border-gray-300 bg-gray-50'} rounded-md shadow-sm`}
              >
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex items-center mb-1">
                    <h4 className={`font-bold text-lg ${!link.is_active && 'text-gray-500'}`}>{link.title}</h4>
                    {link.featured && (
                      <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star size={10} className="mr-1" /> Featured
                      </span>
                    )}
                    {!link.is_active && (
                      <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
                        <EyeOff size={10} className="mr-1" /> Hidden
                      </span>
                    )}
                  </div>
                  {link.subtitle && <p className="text-sm text-gray-500 mb-2">{link.subtitle}</p>}
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center">
                    {link.url}
                  </a>
                  <div className="mt-2 text-xs font-mono text-gray-400">Order: {link.order_index}</div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(link)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
