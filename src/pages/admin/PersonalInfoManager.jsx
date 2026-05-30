import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { User, Save, AlertCircle } from 'lucide-react';

export default function PersonalInfoManager() {
  const [formData, setFormData] = useState({
    full_name: '',
    role: '',
    headline: '',
    about_content: '',
    cv_url: '',
    email: '',
    phone_number: '',
    availability_status: '',
    social_links: {
      github: '',
      linkedin: '',
      instagram: ''
    }
  });
  const [skillsText, setSkillsText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    const { data, error } = await supabase.from('personal_info').select('*').limit(1).single();
    if (data) {
      setFormData({
        ...data,
        social_links: data.social_links || { github: '', linkedin: '', instagram: '' }
      });
      setSkillsText(data.skills ? data.skills.join(', ') : '');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['github', 'linkedin', 'instagram'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    const parsedSkills = skillsText.split(',').map(s => s.trim()).filter(Boolean);
    const payload = { ...formData, skills: parsedSkills };
    
    // Check if row exists
    const { data: existing } = await supabase.from('personal_info').select('id').limit(1).single();
    
    let error;
    if (existing) {
      const { error: updateError } = await supabase.from('personal_info').update(payload).eq('id', existing.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('personal_info').insert([payload]);
      error = insertError;
    }

    setSaving(false);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Personal information saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E5E5] p-6">
      <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-[#E5E5E5]">
        <User size={24} className="text-[#111111]" />
        <h2 className="text-xl font-bold tracking-tight text-[#111111]">Personal Info</h2>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-md flex items-center gap-3 ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          <AlertCircle size={18} />
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name || ''}
              onChange={handleChange}
              className="w-full border border-[#E5E5E5] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#111111] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role/Title</label>
            <input
              type="text"
              name="role"
              value={formData.role || ''}
              onChange={handleChange}
              className="w-full border border-[#E5E5E5] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#111111] transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hero Headline</label>
          <input
            type="text"
            name="headline"
            value={formData.headline || ''}
            onChange={handleChange}
            className="w-full border border-[#E5E5E5] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#111111] transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">About Content</label>
          <textarea
            name="about_content"
            value={formData.about_content || ''}
            onChange={handleChange}
            rows="5"
            className="w-full border border-[#E5E5E5] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#111111] transition-all resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full border border-[#E5E5E5] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#111111] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number || ''}
              onChange={handleChange}
              className="w-full border border-[#E5E5E5] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#111111] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability Status</label>
            <input
              type="text"
              name="availability_status"
              value={formData.availability_status || ''}
              onChange={handleChange}
              placeholder="e.g. I'm currently available for freelance worldwide."
              className="w-full border border-[#E5E5E5] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#111111] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume (CV) URL</label>
            <input
              type="url"
              name="cv_url"
              value={formData.cv_url || ''}
              onChange={handleChange}
              className="w-full border border-[#E5E5E5] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#111111] transition-all"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-[#E5E5E5]">
          <h3 className="text-sm font-bold tracking-tight text-[#111111] uppercase mb-4">Skills & Tech Stack (Marquee Carousel)</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comma-separated Skills</label>
            <textarea
              name="skills"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              rows="3"
              placeholder="e.g. REACT, NEXT.JS, EMBEDDED SYSTEM, LORA CONNECTION"
              className="w-full border border-[#E5E5E5] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#111111] transition-all resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">Separate each skill with a comma. These will be displayed in the infinite scrolling marquee section.</p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E5E5E5]">
          <h3 className="text-sm font-bold tracking-tight text-[#111111] uppercase mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={formData.social_links.linkedin || ''}
                onChange={handleChange}
                className="w-full border border-[#E5E5E5] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#111111] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
              <input
                type="url"
                name="github"
                value={formData.social_links.github || ''}
                onChange={handleChange}
                className="w-full border border-[#E5E5E5] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#111111] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
              <input
                type="url"
                name="instagram"
                value={formData.social_links.instagram || ''}
                onChange={handleChange}
                className="w-full border border-[#E5E5E5] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#111111] transition-all"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E5E5E5]">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-[#111111] text-white px-6 py-2.5 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium text-sm"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Personal Info'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
