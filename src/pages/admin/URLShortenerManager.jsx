import React, { useState, useEffect } from 'react';
import { URLRepository } from '../../repositories/URLRepository';
import { Link2, Plus, Edit2, Trash2, Copy, ExternalLink, BarChart2, QrCode as QrIcon } from 'lucide-react';
import Button from '../../components/admin-ui/Button';
import { Input } from '../../components/admin-ui/Input';
import Label from '../../components/admin-ui/Label';

export default function URLShortenerManager() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    original_url: '',
    short_code: '',
    title: '',
    description: '',
    is_active: true
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error'

  useEffect(() => {
    fetchURLs();
  }, []);

  const fetchURLs = async () => {
    setLoading(true);
    try {
      const data = await URLRepository.getAllURLs();
      setUrls(data);
    } catch (err) {
      showMessage('Error loading URLs: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const resetForm = () => {
    setFormData({
      original_url: '',
      short_code: '',
      title: '',
      description: '',
      is_active: true
    });
    setEditingId(null);
  };

  const handleEdit = (url) => {
    setFormData({
      original_url: url.original_url,
      short_code: url.short_code,
      title: url.title || '',
      description: url.description || '',
      is_active: url.is_active
    });
    setEditingId(url.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this shortened URL? This action cannot be undone.')) return;
    
    try {
      await URLRepository.deleteURL(id);
      showMessage('URL deleted successfully!', 'success');
      fetchURLs();
    } catch (err) {
      showMessage('Error deleting: ' + err.message, 'error');
    }
  };

  const handleCopy = async (shortCode) => {
    const fullURL = `${window.location.origin}/s/${shortCode}`;
    try {
      await navigator.clipboard.writeText(fullURL);
      showMessage('Short URL copied to clipboard!', 'success');
    } catch (err) {
      showMessage('Failed to copy URL', 'error');
    }
  };

  const handleGenerateShortCode = () => {
    const generated = URLRepository.generateShortCode(6);
    setFormData(prev => ({ ...prev, short_code: generated }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // Validation
      if (!formData.original_url.trim()) {
        throw new Error('Original URL is required');
      }
      if (!formData.short_code.trim()) {
        throw new Error('Short code is required');
      }
      if (formData.short_code.length < 4 || formData.short_code.length > 10) {
        throw new Error('Short code must be 4-10 characters');
      }

      const payload = {
        original_url: formData.original_url.trim(),
        short_code: formData.short_code.trim().toLowerCase(),
        title: formData.title.trim() || null,
        description: formData.description.trim() || null,
        is_active: formData.is_active
      };

      if (editingId) {
        await URLRepository.updateURL(editingId, payload);
        showMessage('URL updated successfully!', 'success');
      } else {
        await URLRepository.createURL(payload);
        showMessage('Short URL created successfully!', 'success');
      }

      resetForm();
      fetchURLs();
    } catch (err) {
      showMessage(err.message || 'An error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black uppercase mb-2 flex items-center gap-2">
          <Link2 size={24} />
          URL Shortener
        </h2>
        <p className="text-sm text-gray-500">Create and manage shortened URLs with analytics tracking</p>
      </div>

      {/* Alert Message */}
      {message && (
        <div className={`p-4 border ${messageType === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'} text-sm`}>
          {message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white p-6 border border-black/10 shadow-sm space-y-6">
        <h3 className="text-sm font-bold tracking-wider text-gray-700 uppercase">
          {editingId ? 'Edit Short URL' : 'Create New Short URL'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label>Original URL *</Label>
            <Input
              type="url"
              name="original_url"
              value={formData.original_url}
              onChange={handleChange}
              placeholder="https://example.com/very/long/url"
              required
            />
          </div>

          <div>
            <Label>Short Code * (4-10 chars)</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                name="short_code"
                value={formData.short_code}
                onChange={handleChange}
                placeholder="gh-portfolio"
                required
                minLength={4}
                maxLength={10}
                pattern="[a-zA-Z0-9-_]+"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleGenerateShortCode}
                variant="outline"
                className="whitespace-nowrap"
              >
                Generate
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Letters, numbers, hyphens, underscores only</p>
          </div>

          <div>
            <Label>Title (optional)</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="GitHub Portfolio"
            />
          </div>

          <div className="md:col-span-2">
            <Label>Description (optional)</Label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Link to my GitHub projects"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-700 text-sm font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Active (URL is publicly accessible)</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : (editingId ? 'Update URL' : 'Create Short URL')}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* URL List */}
      <div className="bg-white border border-black/10 shadow-sm">
        <div className="p-6 border-b border-black/10">
          <h3 className="text-sm font-bold tracking-wider text-gray-700 uppercase">Shortened URLs</h3>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading URLs...</div>
        ) : urls.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No shortened URLs yet. Create your first one above!
          </div>
        ) : (
          <div className="divide-y divide-black/10">
            {urls.map((url) => (
              <div key={url.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-lg truncate">
                        {url.title || url.short_code}
                      </h4>
                      {!url.is_active && (
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 uppercase font-bold">
                          Inactive
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-blue-600">
                        <span className="font-mono font-bold">
                          {window.location.origin}/s/{url.short_code}
                        </span>
                        <button
                          onClick={() => handleCopy(url.short_code)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Copy to clipboard"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-500 truncate">
                        <ExternalLink size={12} />
                        <a 
                          href={url.original_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-gray-700 truncate"
                        >
                          {url.original_url}
                        </a>
                      </div>
                      
                      {url.description && (
                        <p className="text-gray-600">{url.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-400 pt-2">
                        <span className="flex items-center gap-1">
                          <BarChart2 size={12} />
                          {url.click_count || 0} clicks
                        </span>
                        <span>
                          Created: {new Date(url.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(url)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(url.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
