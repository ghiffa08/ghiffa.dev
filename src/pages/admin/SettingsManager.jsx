import React, { useState, useEffect, useRef } from 'react';
import { SettingsRepository } from '../../repositories/SettingsRepository';
import { Settings, Check, Loader2, AlertCircle } from 'lucide-react';
import { Input, TextArea } from '../../components/admin-ui/Input';
import Label from '../../components/admin-ui/Label';

const DEBOUNCE_MS = 800;

export default function SettingsManager() {
  const [formData, setFormData] = useState({
    app_name: '',
    seo_title: '',
    seo_description: '',
    maintenance_mode: false
  });
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const timerRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    fetchSettings();
    return () => clearTimeout(timerRef.current);
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
      setErrorMsg('Error loading settings: ' + err.message);
      setSaveState('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const next = { ...formData, [name]: type === 'checkbox' ? checked : value };
    setFormData(next);
    scheduleSave(name, next);
  };

  const scheduleSave = (field, payload) => {
    // Skip auto-save on initial load
    if (firstRender.current) return;

    setSaveState('saving');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        await SettingsRepository.updateSettings(payload);
        setSaveState('saved');
        setTimeout(() => setSaveState('idle'), 2000);
      } catch (err) {
        setErrorMsg(err.message);
        setSaveState('error');
      }
    }, DEBOUNCE_MS);
  };

  useEffect(() => {
    // Mark first render done after mount so auto-save won't fire on load
    firstRender.current = false;
  }, []);

  if (loading) return <div className="p-8 text-center font-mono">Loading...</div>;

  return (
    <div className="bg-white rounded-none border border-black/10 p-6 font-mono text-[#111111]">
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-black/10">
        <div className="flex items-center space-x-3">
          <Settings size={20} />
          <h2 className="text-xl font-black uppercase">General Settings</h2>
        </div>
        {/* Auto-save status indicator */}
        <SaveStatus state={saveState} />
      </div>

      {saveState === 'error' && errorMsg && (
        <div className="p-4 mb-6 rounded-none flex items-center gap-3 bg-red-50 text-red-700">
          <AlertCircle size={16} />
          <span className="text-xs font-bold uppercase">{errorMsg}</span>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <Label>App/Brand Name</Label>
          <Input
            type="text"
            name="app_name"
            value={formData.app_name || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Global SEO Title</Label>
          <Input
            type="text"
            name="seo_title"
            value={formData.seo_title || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Global SEO Description</Label>
          <TextArea
            name="seo_description"
            value={formData.seo_description || ''}
            onChange={handleChange}
            rows={3}
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

        <p className="text-[10px] text-gray-400 uppercase tracking-wider pt-4 border-t border-black/10">
          Changes are saved automatically
        </p>
      </div>
    </div>
  );
}

function SaveStatus({ state }) {
  if (state === 'saving') {
    return (
      <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
        <Loader2 size={14} className="animate-spin" /> Saving...
      </span>
    );
  }
  if (state === 'saved') {
    return (
      <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-green-600">
        <Check size={14} /> Saved
      </span>
    );
  }
  if (state === 'error') {
    return (
      <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-600">
        <AlertCircle size={14} /> Save failed
      </span>
    );
  }
  return null;
}
