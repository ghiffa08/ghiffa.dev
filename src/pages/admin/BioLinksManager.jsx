import React, { useState, useEffect } from 'react';
import { BioLinksRepository } from '../../repositories/BioLinksRepository';
import { Plus, Edit2, Trash2, Link as LinkIcon, Star, EyeOff } from 'lucide-react';
import Button from '../../components/admin-ui/Button';
import { Input } from '../../components/admin-ui/Input';
import Label from '../../components/admin-ui/Label';

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
    try {
      const data = await BioLinksRepository.getAllLinks();
      setLinks(data);
    } catch (err) {
      setMessage('Error loading links: ' + err.message);
    } finally {
      setLoading(false);
    }
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
    
    try {
      await BioLinksRepository.deleteLink(id);
      setMessage('Link deleted successfully!');
      fetchLinks();
    } catch (err) {
      setMessage('Error deleting: ' + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      if (editingId) {
        await BioLinksRepository.updateLink(editingId, formData);
        setMessage('Link updated successfully!');
      } else {
        await BioLinksRepository.createLink(formData);
        setMessage('Link created successfully!');
      }
      resetForm();
      fetchLinks();
    } catch (err) {
      setMessage('Error saving: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading && links.length === 0) return <div className="p-8 text-center font-mono">Loading links...</div>;

  return (
    <div className="font-mono text-[#111111]">
      <h2 className="text-2xl font-black mb-6 uppercase border-b border-[#E5E5E5] pb-4">Bio Links Manager</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded-none font-mono text-xs ${message.includes('Error') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
          {message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6 max-w-2xl bg-white p-6 border border-[#E5E5E5] rounded-none shadow-sm mb-12">
        <h3 className="font-bold text-sm uppercase mb-4 flex items-center">
          {editingId ? <><Edit2 size={16} className="mr-2" /> Edit Link</> : <><Plus size={16} className="mr-2" /> Add New Link</>}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label>Title</Label>
            <Input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. My Portfolio"
            />
          </div>

          <div className="md:col-span-2">
            <Label>Subtitle (Optional)</Label>
            <Input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g. Check out my latest work"
            />
          </div>

          <div className="md:col-span-2">
            <Label>URL</Label>
            <Input
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label>Order Index</Label>
            <Input
              type="number"
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
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Featured Link</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#111111]"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Active (Visible)</span>
            </label>
          </div>
        </div>

        <div className="flex space-x-4 pt-4 border-t border-[#E5E5E5]">
          <Button type="submit" disabled={saving}>
            {saving ? 'SAVING...' : (editingId ? 'UPDATE LINK' : 'ADD LINK')}
          </Button>
          
          {editingId && (
            <Button
              variant="outline"
              onClick={resetForm}
            >
              CANCEL
            </Button>
          )}
        </div>
      </form>

      {/* List */}
      <div>
        <h3 className="font-bold text-sm uppercase mb-4 flex items-center">
          <LinkIcon size={16} className="mr-2" /> Managed Links
        </h3>
        
        <div className="space-y-4 max-w-2xl">
          {links.length === 0 ? (
            <p className="text-gray-500 italic text-sm">No links found. Create one above.</p>
          ) : (
            links.map((link) => (
              <div 
                key={link.id} 
                className={`flex flex-col md:flex-row md:items-center justify-between p-5 bg-white border ${link.is_active ? 'border-[#E5E5E5]' : 'border-dashed border-gray-300 bg-gray-50'} rounded-none shadow-sm`}
              >
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex items-center mb-1">
                    <h4 className={`font-bold text-base ${!link.is_active && 'text-gray-400'}`}>{link.title}</h4>
                    {link.featured && (
                      <span className="ml-3 inline-flex items-center px-2 py-0.5 text-[9px] font-bold font-mono tracking-widest uppercase bg-yellow-100 text-yellow-800">
                        <Star size={8} className="mr-1" /> Featured
                      </span>
                    )}
                    {!link.is_active && (
                      <span className="ml-3 inline-flex items-center px-2 py-0.5 text-[9px] font-bold font-mono tracking-widest uppercase bg-gray-200 text-gray-600">
                        <EyeOff size={8} className="mr-1" /> Hidden
                      </span>
                    )}
                  </div>
                  {link.subtitle && <p className="text-xs text-gray-500 mb-2">{link.subtitle}</p>}
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                    {link.url}
                  </a>
                  <div className="mt-2 text-[10px] text-gray-400">ORDER: {link.order_index}</div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(link)}
                    className="p-2 border border-transparent hover:border-black/10 hover:bg-gray-50 transition-all"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 border border-transparent hover:border-black/10 hover:bg-red-50 text-red-500 transition-all"
                    title="Delete"
                  >
                    <Trash2 size={16} />
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
