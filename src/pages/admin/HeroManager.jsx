import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function HeroManager() {
  const [hero, setHero] = useState({ headline_1: '', headline_2: '', subtitle: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    const { data, error } = await supabase.from('hero_section').select('*').single();
    if (data) {
      setHero(data);
    }
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    if (hero.id) {
      // Update existing
      const { error } = await supabase.from('hero_section').update(hero).eq('id', hero.id);
      if (error) setMessage('Error updating: ' + error.message);
      else setMessage('Hero section updated successfully!');
    } else {
      // Insert new
      const { error } = await supabase.from('hero_section').insert([hero]);
      if (error) setMessage('Error inserting: ' + error.message);
      else {
        setMessage('Hero section created successfully!');
        fetchHero();
      }
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-black mb-6 uppercase border-b border-[#E5E5E5] pb-4">Hero Section Manager</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded-md font-mono text-xs ${message.includes('Error') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl bg-white p-6 border border-[#E5E5E5] rounded-md shadow-sm">
        <div>
          <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">HEADLINE 1</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6] transition-colors rounded-sm"
            value={hero.headline_1 || ''}
            onChange={(e) => setHero({ ...hero, headline_1: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">HEADLINE 2</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6] transition-colors rounded-sm"
            value={hero.headline_2 || ''}
            onChange={(e) => setHero({ ...hero, headline_2: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">SUBTITLE</label>
          <textarea
            required
            rows={3}
            className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6] transition-colors rounded-sm"
            value={hero.subtitle || ''}
            onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">ROLE / EXPERTISE</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6] transition-colors rounded-sm"
            value={hero.role || ''}
            onChange={(e) => setHero({ ...hero, role: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-[#111111] text-[#FAFAFA] font-bold font-mono text-sm px-8 py-3 hover:bg-[#3B82F6] transition-colors disabled:opacity-50"
        >
          {saving ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </form>
    </div>
  );
}
