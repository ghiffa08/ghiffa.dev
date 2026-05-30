import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Trash2, Edit, Plus, Image as ImageIcon } from 'lucide-react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '', category: '', description: '', content: '',
    image_url: '', tech_stack: '', client: '', year: '', link: '', github_url: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (!error && data) setProjects(data);
    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-media')
      .upload(filePath, file);

    if (uploadError) {
      alert('Error uploading image: ' + uploadError.message);
    } else {
      const { data } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
      setFormData({ ...formData, image_url: data.publicUrl });
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tech_stack: formData.tech_stack.split(',').map(s => s.trim()) // Convert comma-separated string to JSONB array
    };

    if (editingId) {
      await supabase.from('projects').update(payload).eq('id', editingId);
    } else {
      await supabase.from('projects').insert([payload]);
    }
    
    setFormData({ title: '', category: '', description: '', content: '', image_url: '', tech_stack: '', client: '', year: '', link: '', github_url: '' });
    setEditingId(null);
    fetchProjects();
  };

  const handleEdit = (proj) => {
    setEditingId(proj.id);
    setFormData({
      ...proj,
      tech_stack: Array.isArray(proj.tech_stack) ? proj.tech_stack.join(', ') : proj.tech_stack
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-black mb-6 uppercase border-b border-[#E5E5E5] pb-4">Projects Manager</h2>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-12 bg-white p-6 border border-[#E5E5E5] rounded-md shadow-sm">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          {editingId ? <Edit size={18} /> : <Plus size={18} />}
          {editingId ? 'Edit Project' : 'Add New Project'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold font-mono tracking-wider mb-2">TITLE</label>
            <input type="text" required className="w-full px-3 py-2 border bg-[#FAFAFA]" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold font-mono tracking-wider mb-2">CATEGORY / TYPE</label>
            <input type="text" required className="w-full px-3 py-2 border bg-[#FAFAFA]" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-xs font-bold font-mono tracking-wider mb-2">SHORT DESCRIPTION</label>
            <textarea required rows={2} className="w-full px-3 py-2 border bg-[#FAFAFA]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="md:col-span-2 prose max-w-none">
            <label className="block text-xs font-bold font-mono tracking-wider mb-2">FULL CONTENT (Markdown)</label>
            <SimpleMDE 
              value={formData.content} 
              onChange={val => setFormData({...formData, content: val})} 
              options={{ spellChecker: false }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-mono tracking-wider mb-2">CLIENT</label>
            <input type="text" required className="w-full px-3 py-2 border bg-[#FAFAFA]" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold font-mono tracking-wider mb-2">YEAR</label>
            <input type="text" required className="w-full px-3 py-2 border bg-[#FAFAFA]" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-xs font-bold font-mono tracking-wider mb-2">TECH STACK (Comma separated)</label>
            <input type="text" className="w-full px-3 py-2 border bg-[#FAFAFA]" value={formData.tech_stack} onChange={e => setFormData({...formData, tech_stack: e.target.value})} placeholder="React, Node.js, Tailwind" />
          </div>
          
          <div>
            <label className="block text-xs font-bold font-mono tracking-wider mb-2">LIVE DEMO LINK</label>
            <input type="text" className="w-full px-3 py-2 border bg-[#FAFAFA]" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold font-mono tracking-wider mb-2">IMAGE URL OR UPLOAD</label>
            <div className="flex gap-4 items-center">
              <input type="text" className="flex-1 px-3 py-2 border bg-[#FAFAFA]" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
              <label className="cursor-pointer bg-[#E5E5E5] px-4 py-2 hover:bg-gray-300 transition-colors text-sm font-bold flex items-center gap-2">
                <ImageIcon size={16} />
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            {formData.image_url && <img src={formData.image_url} alt="Preview" className="h-20 mt-2 object-cover border" />}
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button type="submit" className="bg-[#111111] text-white px-6 py-2 font-bold hover:bg-[#666666] transition-colors">
            {editingId ? 'UPDATE PROJECT' : 'CREATE PROJECT'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setFormData({ title: '', category: '', description: '', content: '', image_url: '', tech_stack: '', client: '', year: '', link: '', github_url: '' }); }} className="px-6 py-2 border border-[#E5E5E5] hover:bg-gray-100">
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
              <th className="p-4">PROJECT</th>
              <th className="p-4">CATEGORY</th>
              <th className="p-4">YEAR</th>
              <th className="p-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(proj => (
              <tr key={proj.id} className="border-b border-[#E5E5E5] hover:bg-[#FAFAFA]">
                <td className="p-4 font-bold">{proj.title}</td>
                <td className="p-4 text-sm">{proj.category}</td>
                <td className="p-4 text-sm">{proj.year}</td>
                <td className="p-4 flex justify-end gap-3">
                  <button onClick={() => handleEdit(proj)} className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(proj.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">No projects found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
