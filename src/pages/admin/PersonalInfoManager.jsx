import React, { useState, useEffect } from 'react';
import { SettingsRepository } from '../../repositories/SettingsRepository';
import { User, Save, AlertCircle } from 'lucide-react';
import Button from '../../components/admin-ui/Button';
import { Input } from '../../components/admin-ui/Input';
import Label from '../../components/admin-ui/Label';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

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
    try {
      const data = await SettingsRepository.getPersonalInfo();
      if (data) {
        setFormData({
          ...data,
          social_links: data.social_links || { github: '', linkedin: '', instagram: '' }
        });
        setSkillsText(data.skills ? data.skills.join(', ') : '');
      }
    } catch (err) {
      setMessage('Error loading personal info: ' + err.message);
    } finally {
      setLoading(false);
    }
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
    
    try {
      const parsedSkills = skillsText.split(',').map(s => s.trim()).filter(Boolean);
      const payload = { ...formData, skills: parsedSkills };
      
      await SettingsRepository.updatePersonalInfo(payload);
      setMessage('Personal information saved successfully!');
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
        <User size={20} />
        <h2 className="text-xl font-black uppercase">Personal Info</h2>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-none flex items-center gap-3 ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          <AlertCircle size={16} />
          <span className="text-xs font-bold uppercase">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Full Name</Label>
            <Input
              type="text"
              name="full_name"
              value={formData.full_name || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Role/Title</Label>
            <Input
              type="text"
              name="role"
              value={formData.role || ''}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <Label>Hero Headline</Label>
          <Input
            type="text"
            name="headline"
            value={formData.headline || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="prose max-w-none">
          <Label>About Content (Markdown)</Label>
          <div className="mt-2">
            <SimpleMDE
              value={formData.about_content || ''}
              onChange={(val) => setFormData(prev => ({ ...prev, about_content: val }))}
              options={{ spellChecker: false }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Email Address</Label>
            <Input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input
              type="text"
              name="phone_number"
              value={formData.phone_number || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Availability Status</Label>
            <Input
              type="text"
              name="availability_status"
              value={formData.availability_status || ''}
              onChange={handleChange}
              placeholder="e.g. I'm currently available for freelance worldwide."
              required
            />
          </div>

          <div>
            <Label>Resume (CV) URL</Label>
            <Input
              type="url"
              name="cv_url"
              value={formData.cv_url || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-black/10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#111111] mb-4">Skills & Tech Stack (Marquee Carousel)</h3>
          <div>
            <Label>Comma-separated Skills</Label>
            <textarea
              name="skills"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              rows="3"
              placeholder="e.g. REACT, NEXT.JS, EMBEDDED SYSTEM, LORA CONNECTION"
              className="w-full border border-black/10 rounded-none bg-[#FAFAFA] text-[#111111] px-4 py-2 focus:outline-none focus:border-black font-mono text-sm resize-none"
            />
            <p className="text-[10px] text-gray-500 mt-2">Separate each skill with a comma. These will be displayed in the infinite scrolling marquee section.</p>
          </div>
        </div>

        <div className="pt-6 border-t border-black/10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#111111] mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label>LinkedIn URL</Label>
              <Input
                type="url"
                name="linkedin"
                value={formData.social_links.linkedin || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>GitHub URL</Label>
              <Input
                type="url"
                name="github"
                value={formData.social_links.github || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Instagram URL</Label>
              <Input
                type="url"
                name="instagram"
                value={formData.social_links.instagram || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-black/10">
          <Button type="submit" disabled={saving} startIcon={<Save size={16} />}>
            {saving ? 'Saving...' : 'Save Personal Info'}
          </Button>
        </div>
      </form>
    </div>
  );
}
