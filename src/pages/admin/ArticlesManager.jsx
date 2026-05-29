import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Trash2, Edit, Plus, Image as ImageIcon } from 'lucide-react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

export default function ArticlesManager() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', content: '',
    cover_image: '', read_time: '', status: 'draft'
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (!error && data) setArticles(data);
    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `articles/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-media')
      .upload(filePath, file);

    if (uploadError) {
      alert('Error uploading image: ' + uploadError.message);
    } else {
      const { data } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
      setFormData({ ...formData, cover_image: data.publicUrl });
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Auto generate slug if empty
    let finalSlug = formData.slug;
    if (!finalSlug) {
      finalSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const payload = { ...formData, slug: finalSlug };
    if (payload.status === 'published' && !payload.published_at) {
      payload.published_at = new Date().toISOString();
    }

    if (editingId) {
      await supabase.from('articles').update(payload).eq('id', editingId);
    } else {
      await supabase.from('articles').insert([payload]);
    }
    
    setFormData({ title: '', slug: '', description: '', content: '', cover_image: '', read_time: '', status: 'draft' });
    setEditingId(null);
    fetchArticles();
  };

  const handleEdit = (art) => {
    setEditingId(art.id);
    setFormData(art);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      await supabase.from('articles').delete().eq('id', id);
      fetchArticles();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-black mb-6 uppercase border-b border-[#E5E5E5] pb-4">Articles Manager</h2>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-12 bg-white p-6 border border-[#E5E5E5] rounded-md shadow-sm">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          {editingId ? <Edit size={18} /> : <Plus size={18} />}
          {editingId ? 'Edit Article' : 'Write New Article'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold font-mono tracking-wider mb-2">TITLE</label>
            <input type="text" required className="w-full px-3 py-2 border bg-[#FAFAFA]" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold font-mono tracking-wider mb-2">SLUG (URL)</label>
            <input type="text" className="w-full px-3 py-2 border bg-[#FAFAFA]" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="Auto-generated if empty" />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-xs font-bold font-mono tracking-wider mb-2">SHORT DESCRIPTION / ABSTRACT</label>
            <textarea required rows={2} className="w-full px-3 py-2 border bg-[#FAFAFA]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold font-mono tracking-wider mb-2">READ TIME</label>
            <input type="text" required className="w-full px-3 py-2 border bg-[#FAFAFA]" value={formData.read_time} onChange={e => setFormData({...formData, read_time: e.target.value})} placeholder="e.g. 5 Min Read" />
          </div>

          <div>
            <label className="block text-xs font-bold font-mono tracking-wider mb-2">STATUS</label>
            <select className="w-full px-3 py-2 border bg-[#FAFAFA]" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold font-mono tracking-wider mb-2">COVER IMAGE URL OR UPLOAD</label>
            <div className="flex gap-4 items-center">
              <input type="text" className="flex-1 px-3 py-2 border bg-[#FAFAFA]" value={formData.cover_image} onChange={e => setFormData({...formData, cover_image: e.target.value})} placeholder="https://..." />
              <label className="cursor-pointer bg-[#E5E5E5] px-4 py-2 hover:bg-gray-300 transition-colors text-sm font-bold flex items-center gap-2">
                <ImageIcon size={16} />
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            {formData.cover_image && <img src={formData.cover_image} alt="Preview" className="h-20 mt-2 object-cover border" />}
          </div>

          <div className="md:col-span-2 prose max-w-none">
            <label className="block text-xs font-bold font-mono tracking-wider mb-2">CONTENT (Markdown)</label>
            <SimpleMDE 
              value={formData.content} 
              onChange={val => setFormData({...formData, content: val})} 
              options={{ spellChecker: false }}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button type="submit" className="bg-[#111111] text-white px-6 py-2 font-bold hover:bg-[#3B82F6] transition-colors">
            {editingId ? 'UPDATE ARTICLE' : 'PUBLISH ARTICLE'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setFormData({ title: '', slug: '', description: '', content: '', cover_image: '', read_time: '', status: 'draft' }); }} className="px-6 py-2 border border-[#E5E5E5] hover:bg-gray-100">
              CANCEL
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="bg-white border border-[#E5E5E5] rounded-md shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#FAFAFA] border-b border-[#E5E5E5] font-mono text-xs text-gray-500">
            <tr>
              <th className="p-4">ARTICLE</th>
              <th className="p-4">STATUS</th>
              <th className="p-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(art => (
              <tr key={art.id} className="border-b border-[#E5E5E5] hover:bg-[#FAFAFA]">
                <td className="p-4 font-bold">{art.title}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded-sm text-xs font-bold ${art.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {art.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-3">
                  <button onClick={() => handleEdit(art)} className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(art.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan="3" className="p-8 text-center text-gray-500">No articles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
