import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    id: null,
    period: '',
    role: '',
    company: '',
    description: '',
    order_index: 0
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('experiences').select('*').order('order_index', { ascending: true });
    if (data) setExperiences(data);
    setLoading(false);
  };

  const handleEdit = (exp) => {
    setFormData(exp);
    setIsEditing(true);
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      const { error } = await supabase.from('experiences').delete().eq('id', id);
      if (!error) fetchExperiences();
      else alert('Failed to delete: ' + error.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    if (formData.id) {
      // Update
      const { error } = await supabase.from('experiences').update({
        period: formData.period,
        role: formData.role,
        company: formData.company,
        description: formData.description,
        order_index: formData.order_index
      }).eq('id', formData.id);
      
      if (error) setMessage('Error updating: ' + error.message);
      else {
        setMessage('Updated successfully!');
        fetchExperiences();
        setIsEditing(false);
      }
    } else {
      // Insert
      const { id, ...newExp } = formData;
      const { error } = await supabase.from('experiences').insert([newExp]);
      
      if (error) setMessage('Error inserting: ' + error.message);
      else {
        setMessage('Created successfully!');
        fetchExperiences();
        setIsEditing(false);
      }
    }
    setSaving(false);
  };

  const handleAddNew = () => {
    setFormData({ id: null, period: '', role: '', company: '', description: '', order_index: experiences.length + 1 });
    setIsEditing(true);
    setMessage('');
  };

  if (loading && !isEditing) return <div>Loading experiences...</div>;

  if (isEditing) {
    return (
      <div className="bg-white p-6 border border-[#E5E5E5] rounded-md shadow-sm max-w-3xl">
        <h2 className="text-xl font-black mb-6 uppercase border-b border-[#E5E5E5] pb-4">
          {formData.id ? 'Edit Experience' : 'Add New Experience'}
        </h2>

        {message && (
          <div className={`p-4 mb-6 rounded-md font-mono text-xs ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">PERIOD</label>
              <input type="text" required className="w-full px-4 py-2 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6]" value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value})} placeholder="e.g. OKT 2024 - FEB 2025" />
            </div>
            <div>
              <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">ORDER INDEX</label>
              <input type="number" required className="w-full px-4 py-2 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6]" value={formData.order_index} onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">ROLE</label>
            <input type="text" required className="w-full px-4 py-2 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6]" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">COMPANY</label>
            <input type="text" required className="w-full px-4 py-2 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6]" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">DESCRIPTION</label>
            <textarea required rows={4} className="w-full px-4 py-2 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6]" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="flex space-x-4 pt-4 border-t border-[#E5E5E5]">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 border border-gray-300 text-gray-600 font-mono text-sm hover:bg-gray-50 transition-colors">CANCEL</button>
            <button type="submit" disabled={saving} className="bg-[#111111] text-[#FAFAFA] font-bold font-mono text-sm px-8 py-2 hover:bg-[#3B82F6] transition-colors disabled:opacity-50">
              {saving ? 'SAVING...' : 'SAVE'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-[#E5E5E5] pb-4">
        <h2 className="text-2xl font-black uppercase">Experience Manager</h2>
        <button onClick={handleAddNew} className="flex items-center gap-2 bg-[#111111] text-[#FAFAFA] px-4 py-2 font-mono text-xs hover:bg-[#3B82F6] transition-colors">
          <Plus size={16} /> ADD NEW
        </button>
      </div>

      <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 font-mono text-xs uppercase border-b border-[#E5E5E5]">
              <th className="p-4">Order</th>
              <th className="p-4">Period</th>
              <th className="p-4">Role / Company</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map(exp => (
              <tr key={exp.id} className="border-b border-[#E5E5E5] hover:bg-gray-50">
                <td className="p-4 font-mono text-sm">{exp.order_index}</td>
                <td className="p-4 font-mono text-sm text-gray-500">{exp.period}</td>
                <td className="p-4">
                  <div className="font-bold">{exp.role}</div>
                  <div className="text-sm text-gray-500">{exp.company}</div>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(exp)} className="text-blue-500 hover:text-blue-700 mr-4"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(exp.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {experiences.length === 0 && (
              <tr><td colSpan="4" className="p-8 text-center text-gray-500 font-mono">No experiences found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
