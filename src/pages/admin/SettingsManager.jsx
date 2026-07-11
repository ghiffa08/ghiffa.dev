import React, { useState, useEffect } from 'react';
import { SettingsRepository } from '../../repositories/SettingsRepository';
import { Settings, Save, AlertCircle } from 'lucide-react';
import Button from '../../components/admin-ui/Button';
import { Input, TextArea } from '../../components/admin-ui/Input';
import Label from '../../components/admin-ui/Label';

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
    try {
      const data = await SettingsRepository.getSettings();
      if (data) {
        setFormData({
          app_name: data.app_name || '',
          seo_title: data.seo_title || '',
          seo_description: data.seo_description === '[object Object]' ? '' : (data.seo_description || ''),
          maintenance_mode: data.maintenance_mode || false
        });
      }
    } catch (err) {
      setMessage('Error loading settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      await SettingsRepository.updateSettings(formData);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center font-mono">Loading...</div>;

  return (
    <div className="bg-white rounded-none border border-black/10 p-6 font-mono text-[#111111]">
      <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-black/10">
        <Settings size={20} />
        <h2 className="text-xl font-black uppercase">General Settings</h2>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-none flex items-center gap-3 ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          <AlertCircle size={16} />
          <span className="text-xs font-bold uppercase">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>App/Brand Name</Label>
          <Input
            type="text"
            name="app_name"
            value={formData.app_name || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Global SEO Title</Label>
          <Input
            type="text"
            name="seo_title"
            value={formData.seo_title || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Global SEO Description</Label>
          <TextArea
            name="seo_description"
            value={formData.seo_description || ''}
            onChange={handleChange}
            rows={3}
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
            className="w-4 h-4 text-[#111111] focus:ring-black border-gray-300 rounded cursor-pointer accent-[#111111]"
          />
          <label htmlFor="maintenance_mode" className="text-xs font-bold uppercase tracking-wider cursor-pointer">
            Enable Maintenance Mode
          </label>
        </div>

        <div className="pt-6 border-t border-black/10">
          <Button type="submit" disabled={saving} startIcon={<Save size={16} />}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
