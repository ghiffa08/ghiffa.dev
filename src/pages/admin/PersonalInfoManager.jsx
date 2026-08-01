import React, { useState, useEffect, useRef } from 'react';
import { SettingsRepository } from '../../repositories/SettingsRepository';
import { User, Check, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '../../components/admin-ui/Input';
import Label from '../../components/admin-ui/Label';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

const DEBOUNCE_MS = 800;

export default function PersonalInfoManager() {
  const [formData, setFormData] = useState({
    full_name: '',
    role: '',
    headline: '',
    about_content: '',
    about_content_en: '',
    cv_url: '',
    email: '',
    phone_number: '',
    availability_status: '',
    social_links: { github: '', linkedin: '', instagram: '' }
  });
  const [skillsText, setSkillsText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const timerRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    fetchInfo();
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    firstRender.current = false;
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
      setErrorMsg('Error loading personal info: ' + err.message);
      setSaveState('error');
    } finally {
      setLoading(false);
    }
  };

  const scheduleSave = (payload) => {
    if (firstRender.current) return;

    setSaveState('saving');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const parsedSkills = skillsText.split(',').map(s => s.trim()).filter(Boolean);
        await SettingsRepository.updatePersonalInfo({ ...payload, skills: parsedSkills });
        setSaveState('saved');
        setTimeout(() => setSaveState('idle'), 2000);
      } catch (err) {
        setErrorMsg(err.message);
        setSaveState('error');
      }
    }, DEBOUNCE_MS);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let next;
    if (['github', 'linkedin', 'instagram'].includes(name)) {
      next = {
        ...formData,
        social_links: { ...formData.social_links, [name]: value }
      };
    } else {
      next = { ...formData, [name]: value };
    }
    setFormData(next);
    scheduleSave(next);
  };

  const handleAboutChange = (field, val) => {
    const next = { ...formData, [field]: val };
    setFormData(next);
    scheduleSave(next);
  };

  const handleSkillsChange = (e) => {
    const val = e.target.value;
    setSkillsText(val);
    const next = { ...formData };
    scheduleSave(next); // skills parsed at save time
  };

  if (loading) return <div className="p-8 text-center font-mono">Loading...</div>;

  return (
    <div className="bg-white rounded-none border border-black/10 p-6 font-mono text-[#111111]">
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-black/10">
        <div className="flex items-center space-x-3">
          <User size={20} />
          <h2 className="text-xl font-black uppercase">Personal Info</h2>
        </div>
        <SaveStatus state={saveState} />
      </div>

      {saveState === 'error' && errorMsg && (
        <div className="p-4 mb-6 rounded-none flex items-center gap-3 bg-red-50 text-red-700">
          <AlertCircle size={16} />
          <span className="text-xs font-bold uppercase">{errorMsg}</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Full Name</Label>
            <Input type="text" name="full_name" value={formData.full_name || ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Role/Title</Label>
            <Input type="text" name="role" value={formData.role || ''} onChange={handleChange} />
          </div>
        </div>

        <div>
          <Label>Hero Headline</Label>
          <Input type="text" name="headline" value={formData.headline || ''} onChange={handleChange} />
        </div>

        <div className="prose max-w-none">
          <Label>About Content (Indonesian)</Label>
          <div className="mt-2">
            <SimpleMDE
              value={formData.about_content || ''}
              onChange={(val) => handleAboutChange('about_content', val)}
              options={{ spellChecker: false }}
            />
          </div>
        </div>

        <div className="prose max-w-none">
          <Label>About Content (English)</Label>
          <div className="mt-2">
            <SimpleMDE
              value={formData.about_content_en || ''}
              onChange={(val) => handleAboutChange('about_content_en', val)}
              options={{ spellChecker: false }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Email Address</Label>
            <Input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input type="text" name="phone_number" value={formData.phone_number || ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Availability Status</Label>
            <Input
              type="text"
              name="availability_status"
              value={formData.availability_status || ''}
              onChange={handleChange}
              placeholder="e.g. I'm currently available for freelance worldwide."
            />
          </div>
          <div>
            <Label>Resume (CV) URL</Label>
            <Input type="url" name="cv_url" value={formData.cv_url || ''} onChange={handleChange} />
          </div>
        </div>

        <div className="pt-6 border-t border-black/10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#111111] mb-4">Skills & Tech Stack (Marquee Carousel)</h3>
          <div>
            <Label>Comma-separated Skills</Label>
            <textarea
              name="skills"
              value={skillsText}
              onChange={handleSkillsChange}
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
              <Input type="url" name="linkedin" value={formData.social_links.linkedin || ''} onChange={handleChange} />
            </div>
            <div>
              <Label>GitHub URL</Label>
              <Input type="url" name="github" value={formData.social_links.github || ''} onChange={handleChange} />
            </div>
            <div>
              <Label>Instagram URL</Label>
              <Input type="url" name="instagram" value={formData.social_links.instagram || ''} onChange={handleChange} />
            </div>
          </div>
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
