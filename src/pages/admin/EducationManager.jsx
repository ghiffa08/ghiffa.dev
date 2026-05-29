import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function EducationManager() {
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('education'); // 'education', 'honor', 'certification'
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    id: null,
    type: 'education',
    period: '',
    title: '',
    institution: '',
    description: '',
    order_index: 0
  });

  useEffect(() => {
    fetchQualifications();
  }, []);

  const fetchQualifications = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('qualifications').select('*').order('order_index', { ascending: true });
    if (data) setQualifications(data);
    setLoading(false);
  };

  const filteredData = qualifications.filter(q => q.type === activeTab);

  const handleEdit = (qual) => {
    setFormData(qual);
    setIsEditing(true);
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const { error } = await supabase.from('qualifications').delete().eq('id', id);
      if (!error) fetchQualifications();
      else alert('Failed to delete: ' + error.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    if (formData.id) {
      // Update
      const { error } = await supabase.from('qualifications').update({
        type: formData.type,
        period: formData.period,
        title: formData.title,
        institution: formData.institution,
        description: formData.description,
        order_index: formData.order_index
      }).eq('id', formData.id);
      
      if (error) setMessage('Error updating: ' + error.message);
      else {
        setMessage('Updated successfully!');
        fetchQualifications();
        setIsEditing(false);
      }
    } else {
      // Insert
      const { id, ...newQual } = formData;
      const { error } = await supabase.from('qualifications').insert([newQual]);
      
      if (error) setMessage('Error inserting: ' + error.message);
      else {
        setMessage('Created successfully!');
        fetchQualifications();
        setIsEditing(false);
      }
    }
    setSaving(false);
  };

  const handleAddNew = () => {
    setFormData({ id: null, type: activeTab, period: '', title: '', institution: '', description: '', order_index: filteredData.length + 1 });
    setIsEditing(true);
    setMessage('');
  };

  if (loading && !isEditing) return <div>Loading qualifications...</div>;

  if (isEditing) {
    return (
      <div className="bg-white p-6 border border-[#E5E5E5] rounded-md shadow-sm max-w-3xl">
        <h2 className="text-xl font-black mb-6 uppercase border-b border-[#E5E5E5] pb-4">
          {formData.id ? 'Edit Item' : 'Add New Item'}
        </h2>

        {message && (
          <div className={`p-4 mb-6 rounded-md font-mono text-xs ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">TYPE</label>
              <select required className="w-full px-4 py-2 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6]" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="education">Education</option>
                <option value="honor">Honor / Award</option>
                <option value="certification">Certification</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">PERIOD / YEAR</label>
              <input type="text" required className="w-full px-4 py-2 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6]" value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value})} placeholder="e.g. 2024" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">ORDER INDEX</label>
              <input type="number" required className="w-full px-4 py-2 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6]" value={formData.order_index} onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})} />
            </div>
            <div>
              <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">TITLE</label>
              <input type="text" required className="w-full px-4 py-2 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6]" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. S1 Teknik Informatika" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">INSTITUTION</label>
            <input type="text" required className="w-full px-4 py-2 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6]" value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">DESCRIPTION (Optional)</label>
            <textarea rows={3} className="w-full px-4 py-2 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6]" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} />
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
        <h2 className="text-2xl font-black uppercase">Education & Honors Manager</h2>
        <button onClick={handleAddNew} className="flex items-center gap-2 bg-[#111111] text-[#FAFAFA] px-4 py-2 font-mono text-xs hover:bg-[#3B82F6] transition-colors">
          <Plus size={16} /> ADD NEW
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        {['education', 'honor', 'certification'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-mono text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-colors ${activeTab === tab ? 'border-[#111111] text-[#111111]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            {tab}s
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 font-mono text-xs uppercase border-b border-[#E5E5E5]">
              <th className="p-4">Order</th>
              <th className="p-4">Period</th>
              <th className="p-4">Title / Institution</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.id} className="border-b border-[#E5E5E5] hover:bg-gray-50">
                <td className="p-4 font-mono text-sm">{item.order_index}</td>
                <td className="p-4 font-mono text-sm text-gray-500">{item.period}</td>
                <td className="p-4">
                  <div className="font-bold">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.institution}</div>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700 mr-4"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr><td colSpan="4" className="p-8 text-center text-gray-500 font-mono">No items found for {activeTab}.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
