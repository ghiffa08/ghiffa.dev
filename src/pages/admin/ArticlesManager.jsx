import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import RichTextEditor from '../../components/admin-ui/RichTextEditor';
import { ArticleRepository } from '../../repositories/ArticleRepository';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { slugify } from '../../utils/slugify';

// Monochromatic UI elements
import Button from '../../components/admin-ui/Button';
import { Input, TextArea } from '../../components/admin-ui/Input';
import Label from '../../components/admin-ui/Label';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../components/admin-ui/Table';

const defaultForm = {
  title: '',
  slug: '',
  description: '',
  content: '',
  cover_image: '',
  read_time: '5 min read',
  status: 'draft',
  published_at: null
};

export default function ArticlesManager() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ ...defaultForm });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  useEffect(() => {
    fetchArticles();
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await ArticleRepository.getAllArticlesAdmin();
      setArticles(data);
    } catch (err) {
      alert('Error fetching articles: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: editingId ? prev.slug : slugify(title)
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress('Starting...');

    try {
      let coverImageUrl = formData.cover_image;

      // Upload cover image if new file selected
      if (selectedFile) {
        setUploadProgress('Uploading cover image...');
        coverImageUrl = await uploadToCloudinary(selectedFile);
      }

      const payload = {
        title: formData.title,
        slug: formData.slug || slugify(formData.title),
        description: formData.description,
        content: formData.content,
        cover_image: coverImageUrl,
        read_time: formData.read_time,
        status: formData.status,
        published_at: formData.status === 'published'
          ? (formData.published_at || new Date().toISOString())
          : null
      };

      if (editingId) {
        await ArticleRepository.updateArticle(editingId, payload);
      } else {
        await ArticleRepository.createArticle(payload);
      }

      // Cleanup
      if (preview) URL.revokeObjectURL(preview);
      setFormData({ ...defaultForm });
      setSelectedFile(null);
      setPreview(null);
      setEditingId(null);
      fetchArticles();
    } catch (error) {
      alert('Error saving article: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleEdit = (article) => {
    setEditingId(article.id);
    setFormData({
      title: article.title || '',
      slug: article.slug || '',
      description: article.description || '',
      content: article.content || '',
      cover_image: article.cover_image || '',
      read_time: article.read_time || '5 min read',
      status: article.status || 'draft',
      published_at: article.published_at || null
    });
    setSelectedFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await ArticleRepository.deleteArticle(id);
        fetchArticles();
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ ...defaultForm });
    setSelectedFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    return new Date(timestamp).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
  };

  if (loading && articles.length === 0) return <div className="p-8 text-center font-mono">Loading articles...</div>;

  return (
    <div>
      <h2 className="text-2xl font-black mb-6 uppercase border-b border-[#E5E5E5] pb-4">Articles Manager</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-12 bg-white p-6 border border-[#E5E5E5] rounded-none shadow-sm">
        <h3 className="font-bold mb-6 flex items-center gap-2 font-mono text-sm uppercase">
          {editingId ? <Edit size={16} /> : <Plus size={16} />}
          {editingId ? 'Edit Article' : 'Add New Article'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Article title..."
            />
          </div>

          {/* Slug */}
          <div>
            <Label>Slug (URL)</Label>
            <Input
              type="text"
              required
              value={formData.slug}
              onChange={e => setFormData({ ...formData, slug: e.target.value })}
              placeholder="article-url-slug"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <Label>Short Description / Excerpt</Label>
            <TextArea
              required
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the article..."
            />
          </div>

          {/* Content (Rich Text) */}
          <div className="md:col-span-2">
            <Label>Full Content</Label>
            <RichTextEditor
              value={formData.content}
              onChange={val => setFormData({ ...formData, content: val })}
            />
          </div>

          {/* Read Time */}
          <div>
            <Label>Read Time</Label>
            <Input
              type="text"
              required
              value={formData.read_time}
              onChange={e => setFormData({ ...formData, read_time: e.target.value })}
              placeholder="5 min read"
            />
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-none bg-[#FAFAFA] text-[#111111] focus:outline-none focus:border-[#111111] transition-colors duration-200 font-mono text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Cover Image Upload */}
          <div className="md:col-span-2 border-t border-[#E5E5E5] pt-6 mt-2">
            <Label>Cover Image</Label>

            <div className="flex gap-4 items-center mb-4">
              <label className="cursor-pointer bg-[#111111] text-white px-4 py-2 hover:bg-[#666666] transition-colors text-sm font-bold flex items-center gap-2 font-mono">
                <ImageIcon size={16} />
                CHOOSE IMAGE
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
              <span className="text-xs text-gray-500 font-mono">
                Select a cover image for the article.
              </span>
            </div>

            {/* Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Existing Cover */}
              {formData.cover_image && !preview && (
                <div className="relative border border-[#E5E5E5] p-1 bg-[#FAFAFA] group">
                  <img
                    src={formData.cover_image}
                    alt="Current cover"
                    className="w-full h-24 object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] px-1 font-mono uppercase">Current</span>
                </div>
              )}

              {/* Local Preview */}
              {preview && (
                <div className="relative border border-blue-200 p-1 bg-white group">
                  <img
                    src={preview}
                    alt="New cover preview"
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      URL.revokeObjectURL(preview);
                      setPreview(null);
                    }}
                    disabled={uploading}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    ✕
                  </button>
                  <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[8px] px-1 font-mono uppercase">New</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {uploadProgress && (
          <div className="mt-4 text-xs font-mono text-blue-600 bg-blue-50 p-2 inline-block">
            {uploadProgress}
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <Button type="submit" disabled={uploading}>
            {uploading ? 'UPLOADING...' : editingId ? 'UPDATE ARTICLE' : 'CREATE ARTICLE'}
          </Button>
          {editingId && (
            <Button variant="outline" onClick={handleCancel} disabled={uploading}>
              CANCEL
            </Button>
          )}
        </div>
      </form>

      {/* Articles List */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>TITLE</TableCell>
            <TableCell isHeader>STATUS</TableCell>
            <TableCell isHeader>PUBLISHED</TableCell>
            <TableCell isHeader>READ TIME</TableCell>
            <TableCell isHeader className="text-right">ACTIONS</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map(article => (
            <TableRow key={article.id}>
              <TableCell className="font-bold max-w-[200px] truncate">{article.title}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                  article.status === 'published'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                }`}>
                  {article.status === 'published' ? <Eye size={12} /> : <EyeOff size={12} />}
                  {article.status}
                </span>
              </TableCell>
              <TableCell>{formatDate(article.published_at)}</TableCell>
              <TableCell>{article.read_time}</TableCell>
              <TableCell className="flex justify-end gap-3">
                <button onClick={() => handleEdit(article)} className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                <button onClick={() => handleDelete(article.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
              </TableCell>
            </TableRow>
          ))}
          {articles.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">No articles found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
