import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ContactManager() {
  const [contact, setContact] = useState({ 
    email: '', 
    availability: '', 
    display_text: '',
    linkedin_url: '',
    instagram_url: '',
    github_url: '',
    phone_number: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    const { data, error } = await supabase.from('contact_section').select('*').single();
    if (data) {
      setContact(data);
    }
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    if (contact.id) {
      // Update existing
      const { error } = await supabase.from('contact_section').update(contact).eq('id', contact.id);
      if (error) setMessage('Error updating: ' + error.message);
      else setMessage('Contact section updated successfully!');
    } else {
      // Insert new
      const { error } = await supabase.from('contact_section').insert([contact]);
      if (error) setMessage('Error inserting: ' + error.message);
      else {
        setMessage('Contact section created successfully!');
        fetchContact();
      }
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-black mb-6 uppercase border-b border-[#E5E5E5] pb-4">Contact Section Manager</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded-md font-mono text-xs ${message.includes('Error') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl bg-white p-6 border border-[#E5E5E5] rounded-md shadow-sm">
        
        <h3 className="text-sm font-bold uppercase text-gray-500 border-b pb-2 mb-4">Main Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">EMAIL ADDRESS</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6] transition-colors rounded-sm"
              value={contact.email || ''}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">PHONE NUMBER</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6] transition-colors rounded-sm"
              value={contact.phone_number || ''}
              onChange={(e) => setContact({ ...contact, phone_number: e.target.value })}
              placeholder="e.g. +62851..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">AVAILABILITY TEXT</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6] transition-colors rounded-sm"
            value={contact.availability || ''}
            onChange={(e) => setContact({ ...contact, availability: e.target.value })}
            placeholder="e.g. Open for collaboration & freelance"
          />
        </div>

        <div>
          <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">DISPLAY TEXT (BIG FONT)</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6] transition-colors rounded-sm"
            value={contact.display_text || ''}
            onChange={(e) => setContact({ ...contact, display_text: e.target.value })}
            placeholder="e.g. LET'S TALK."
          />
        </div>

        <h3 className="text-sm font-bold uppercase text-gray-500 border-b pb-2 mb-4 pt-4">Social Media Links</h3>

        <div>
          <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">LINKEDIN URL</label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6] transition-colors rounded-sm"
            value={contact.linkedin_url || ''}
            onChange={(e) => setContact({ ...contact, linkedin_url: e.target.value })}
            placeholder="https://linkedin.com/in/..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">INSTAGRAM URL</label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6] transition-colors rounded-sm"
            value={contact.instagram_url || ''}
            onChange={(e) => setContact({ ...contact, instagram_url: e.target.value })}
            placeholder="https://instagram.com/..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">GITHUB URL</label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6] transition-colors rounded-sm"
            value={contact.github_url || ''}
            onChange={(e) => setContact({ ...contact, github_url: e.target.value })}
            placeholder="https://github.com/..."
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-[#111111] text-[#FAFAFA] font-bold font-mono text-sm px-8 py-3 hover:bg-[#3B82F6] transition-colors disabled:opacity-50 mt-8"
        >
          {saving ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </form>
    </div>
  );
}
