import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AboutManager() {
  const [about, setAbout] = useState({ content: '', cv_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    const { data, error } = await supabase.from('about_section').select('*').single();
    if (data) {
      setAbout(data);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `cvs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-media')
      .upload(filePath, file);

    if (uploadError) {
      alert('Error uploading file: ' + uploadError.message);
    } else {
      const { data } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
      setAbout({ ...about, cv_url: data.publicUrl });
    }
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const payload = {
      content: about.content,
      cv_url: about.cv_url
    };

    if (about.id) {
      const { error } = await supabase.from('about_section').update(payload).eq('id', about.id);
      if (error) setMessage('Error updating: ' + error.message);
      else setMessage('About section updated successfully!');
    } else {
      const { error } = await supabase.from('about_section').insert([payload]);
      if (error) setMessage('Error inserting: ' + error.message);
      else {
        setMessage('About section created successfully!');
        fetchAbout();
      }
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-black mb-6 uppercase border-b border-[#E5E5E5] pb-4">About Section Manager</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded-md font-mono text-xs ${message.includes('Error') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl bg-white p-6 border border-[#E5E5E5] rounded-md shadow-sm">
        <div>
          <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">ABOUT CONTENT (Use Enter/Newline to split paragraphs)</label>
          <textarea
            required
            rows={10}
            className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6] transition-colors rounded-sm leading-relaxed"
            value={about.content || ''}
            onChange={(e) => setAbout({ ...about, content: e.target.value })}
            placeholder="Type your main introduction here...&#10;&#10;Then press Enter and type your secondary details here."
          />
        </div>

        <div>
          <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">CV / RESUME URL OR UPLOAD</label>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              className="flex-1 px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#3B82F6] transition-colors rounded-sm text-sm"
              value={about.cv_url || ''}
              onChange={(e) => setAbout({ ...about, cv_url: e.target.value })}
              placeholder="https://... (or upload file)"
            />
            <label className="cursor-pointer bg-[#FAFAFA] border border-[#E5E5E5] px-4 py-3 text-sm font-mono hover:bg-gray-100 transition-colors whitespace-nowrap">
              {uploading ? 'Uploading...' : 'Upload PDF/Doc'}
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>
          {about.cv_url && (
            <a href={about.cv_url} target="_blank" rel="noreferrer" className="text-xs text-[#3B82F6] hover:underline mt-2 inline-block">
              View Current CV
            </a>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-[#111111] text-[#FAFAFA] font-bold font-mono text-sm px-8 py-3 hover:bg-[#3B82F6] transition-colors disabled:opacity-50 mt-4"
        >
          {saving ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </form>
    </div>
  );
}
