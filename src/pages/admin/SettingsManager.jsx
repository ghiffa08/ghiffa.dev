import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Settings, Save, AlertCircle } from 'lucide-react';

export default function SettingsManager() {
  const [formData, setFormData] = useState({
    app_name: '',
    seo_title: '',
    seo_description: '',
    maintenance_mode: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('general_settings').select('*').limit(1).single();
    if (data) {
      setFormData(data);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    // Check if row exists
    const { data: existing } = await supabase.from('general_settings').select('id').limit(1).single();
    
    let error;
    if (existing) {
      const { error: updateError } = await supabase.from('general_settings').update(formData).eq('id', existing.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('general_settings').insert([formData]);
      error = insertError;
    }

    setSaving(false);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E5E5] p-6">
      <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-[#E5E5E5]">
        <Settings size={24} className="text-[#111111]" />
        <h2 className="text-xl font-bold tracking-tight text-[#111111]">General Settings</h2>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-md flex items-center gap-3 ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          <AlertCircle size={18} />
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">App/Brand Name</label>
          <input
            type="text"
            name="app_name"
            value={formData.app_name || ''}
            onChange={handleChange}
            className="w-full border border-[#E5E5E5] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#111111] transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Global SEO Title</label>
          <input
            type="text"
            name="seo_title"
            value={formData.seo_title || ''}
            onChange={handleChange}
            className="w-full border border-[#E5E5E5] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#111111] transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Global SEO Description</label>
          <textarea
            name="seo_description"
            value={formData.seo_description || ''}
            onChange={handleChange}
            rows="3"
            className="w-full border border-[#E5E5E5] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#111111] transition-all resize-none"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="maintenance_mode"
            id="maintenance_mode"
            checked={formData.maintenance_mode || false}
            onChange={handleChange}
            className="w-4 h-4 text-[#111111] focus:ring-[#111111] border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="maintenance_mode" className="text-sm font-medium text-gray-700 cursor-pointer">
            Enable Maintenance Mode
          </label>
        </div>

        <div className="pt-6 border-t border-[#E5E5E5]">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-[#111111] text-white px-6 py-2.5 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium text-sm"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
