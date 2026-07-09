import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Image as ImageIcon } from 'lucide-react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { ProjectRepository } from '../../repositories/ProjectRepository';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { slugify } from '../../utils/slugify';

// Monochromatic UI elements
import Button from '../../components/admin-ui/Button';
import { Input, TextArea } from '../../components/admin-ui/Input';
import Label from '../../components/admin-ui/Label';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../components/admin-ui/Table';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '', category: '', description: '', content: '',
    image_url: '', image_urls: [], tech_stack: '', client: '', year: '', link: '', github_url: ''
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  useEffect(() => {
    fetchProjects();
    // Cleanup Object URLs on unmount
    return () => {
      previews.forEach(p => URL.revokeObjectURL(p.url));
    };
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await ProjectRepository.getAllProjects();
      setProjects(data);
    } catch (err) {
      alert('Error fetching projects: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...files]);
    
    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeExistingImage = (idx) => {
    setFormData((prev) => {
      const nextUrls = prev.image_urls.filter((_, i) => i !== idx);
      return { ...prev, image_urls: nextUrls };
    });
  };

  const removeNewFile = (previewItem, index) => {
    setSelectedFiles((prev) => prev.filter(f => f !== previewItem.file));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewItem.url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress('Starting upload...');
    
    try {
      const uploadedUrls = [];
      // 1. Upload new files sequentially
      for (let i = 0; i < selectedFiles.length; i++) {
        setUploadProgress(`Uploading image ${i + 1}/${selectedFiles.length}...`);
        const url = await uploadToCloudinary(selectedFiles[i]);
        uploadedUrls.push(url);
      }
      
      const finalImageUrls = [...(formData.image_urls || []), ...uploadedUrls];
      
      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        content: formData.content,
        image_url: finalImageUrls[0] || '', // Satisfy database NOT NULL constraint
        image_urls: finalImageUrls,
        tech_stack: typeof formData.tech_stack === 'string'
          ? formData.tech_stack.split(',').map(s => s.trim())
          : formData.tech_stack,
        client: formData.client,
        year: formData.year,
        link: formData.link,
        github_url: formData.github_url
      };

      if (editingId) {
        await ProjectRepository.updateProject(editingId, payload);
      } else {
        await ProjectRepository.createProject(payload);
      }

      // Cleanup previews
      previews.forEach(p => URL.revokeObjectURL(p.url));
      
      // Reset form
      setFormData({ title: '', category: '', description: '', content: '', image_url: '', image_urls: [], tech_stack: '', client: '', year: '', link: '', github_url: '' });
      setSelectedFiles([]);
      setPreviews([]);
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      alert('Error saving project: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleEdit = (proj) => {
    setEditingId(proj.id);
    setFormData({
      ...proj,
      image_urls: proj.image_urls || [],
      tech_stack: Array.isArray(proj.tech_stack) ? proj.tech_stack.join(', ') : proj.tech_stack
    });
    setSelectedFiles([]);
    setPreviews([]);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await ProjectRepository.deleteProject(id);
        fetchProjects();
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  if (loading && projects.length === 0) return <div className="p-8 text-center font-mono">Loading projects...</div>;

  return (
    <div>
      <h2 className="text-2xl font-black mb-6 uppercase border-b border-[#E5E5E5] pb-4">Projects Manager</h2>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-12 bg-white p-6 border border-[#E5E5E5] rounded-none shadow-sm">
        <h3 className="font-bold mb-6 flex items-center gap-2 font-mono text-sm uppercase">
          {editingId ? <Edit size={16} /> : <Plus size={16} />}
          {editingId ? 'Edit Project' : 'Add New Project'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Title</Label>
            <Input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <Label>Category / Type</Label>
            <Input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
          </div>
          
          <div className="md:col-span-2">
            <Label>Short Description</Label>
            <TextArea required rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="md:col-span-2 prose max-w-none">
            <Label>Full Content (Markdown)</Label>
            <SimpleMDE 
              value={formData.content} 
              onChange={val => setFormData({...formData, content: val})} 
              options={{ spellChecker: false }}
            />
          </div>

          <div>
            <Label>Client</Label>
            <Input type="text" required value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
          </div>
          <div>
            <Label>Year</Label>
            <Input type="text" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
          </div>
          
          <div>
            <Label>Tech Stack (Comma separated)</Label>
            <Input type="text" value={formData.tech_stack} onChange={e => setFormData({...formData, tech_stack: e.target.value})} placeholder="React, Node.js, Tailwind" />
          </div>
          
          <div>
            <Label>Live Demo Link</Label>
            <Input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
          </div>

          {/* Multiple image upload component */}
          <div className="md:col-span-2 border-t border-[#E5E5E5] pt-6 mt-2">
            <Label>Project Images (Multiple)</Label>
            
            <div className="flex gap-4 items-center mb-4">
              <label className="cursor-pointer bg-[#111111] text-white px-4 py-2 hover:bg-[#666666] transition-colors text-sm font-bold flex items-center gap-2 font-mono">
                <ImageIcon size={16} />
                CHOOSE IMAGES
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileChange} 
                  disabled={uploading}
                />
              </label>
              <span className="text-xs text-gray-500 font-mono">
                Select one or more files to upload.
              </span>
            </div>

            {/* Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Existing Images */}
              {(formData.image_urls || []).map((url, idx) => (
                <div key={`existing-${idx}`} className="relative border border-[#E5E5E5] p-1 bg-[#FAFAFA] group">
                  <img src={url} alt="Existing project" className="w-full h-24 object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                  <button 
                    type="button" 
                    onClick={() => removeExistingImage(idx)} 
                    disabled={uploading}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    ✕
                  </button>
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] px-1 font-mono uppercase">Uploaded</span>
                </div>
              ))}

              {/* Local Previews */}
              {previews.map((item, idx) => (
                <div key={`new-${idx}`} className="relative border border-blue-200 p-1 bg-white group">
                  <img src={item.url} alt="Local preview" className="w-full h-24 object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeNewFile(item, idx)} 
                    disabled={uploading}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    ✕
                  </button>
                  <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[8px] px-1 font-mono uppercase">Local</span>
                </div>
              ))}
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
            {uploading ? 'UPLOADING...' : editingId ? 'UPDATE PROJECT' : 'CREATE PROJECT'}
          </Button>
          {editingId && (
            <Button 
              variant="outline"
              onClick={() => { 
                setEditingId(null); 
                setFormData({ title: '', category: '', description: '', content: '', image_url: '', image_urls: [], tech_stack: '', client: '', year: '', link: '', github_url: '' }); 
                setSelectedFiles([]);
                previews.forEach(p => URL.revokeObjectURL(p.url));
                setPreviews([]);
              }} 
              disabled={uploading}
            >
              CANCEL
            </Button>
          )}
        </div>
      </form>

      {/* List */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>PROJECT</TableCell>
            <TableCell isHeader>CATEGORY</TableCell>
            <TableCell isHeader>YEAR</TableCell>
            <TableCell isHeader className="text-right">ACTIONS</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(proj => (
            <TableRow key={proj.id}>
              <TableCell className="font-bold">{proj.title}</TableCell>
              <TableCell>{proj.category}</TableCell>
              <TableCell>{proj.year}</TableCell>
              <TableCell className="flex justify-end gap-3">
                <button onClick={() => handleEdit(proj)} className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                <button onClick={() => handleDelete(proj.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
              </TableCell>
            </TableRow>
          ))}
          {projects.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">No projects found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
