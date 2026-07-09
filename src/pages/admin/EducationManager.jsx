import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { EducationRepository } from '../../repositories/EducationRepository';
import { uploadToCloudinary } from '../../utils/cloudinary';

// Monochromatic UI elements
import Button from '../../components/admin-ui/Button';
import { Input, TextArea } from '../../components/admin-ui/Input';
import Label from '../../components/admin-ui/Label';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../components/admin-ui/Table';

export default function EducationManager() {
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('education'); // 'education', 'honor', 'certification'
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    id: null,
    type: 'education',
    period: '',
    title: '',
    institution: '',
    description: '',
    order_index: 0,
    certificate_url: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    fetchQualifications();
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, []);

  const fetchQualifications = async () => {
    setLoading(true);
    try {
      const data = await EducationRepository.getAllEducation();
      setQualifications(data);
    } catch (err) {
      alert('Error fetching qualifications: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = qualifications.filter(q => q.type === activeTab);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeCertificate = () => {
    setSelectedFile(null);
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview('');
    setFormData((prev) => ({ ...prev, certificate_url: '' }));
  };

  const handleEdit = (qual) => {
    setFormData(qual);
    setPreview(qual.certificate_url || '');
    setSelectedFile(null);
    setIsEditing(true);
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await EducationRepository.deleteQualification(id);
        fetchQualifications();
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('Saving...');

    try {
      let finalCertUrl = formData.certificate_url || '';
      
      if (selectedFile) {
        setMessage('Uploading certificate to Cloudinary...');
        finalCertUrl = await uploadToCloudinary(selectedFile);
      }
      
      const payload = {
        type: formData.type,
        period: formData.period,
        title: formData.title,
        institution: formData.institution,
        description: formData.description,
        order_index: formData.order_index,
        certificate_url: finalCertUrl
      };

      if (formData.id) {
        // Update
        await EducationRepository.updateQualification(formData.id, payload);
        setMessage('Updated successfully!');
      } else {
        // Insert
        await EducationRepository.createQualification(payload);
        setMessage('Created successfully!');
      }

      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      setSelectedFile(null);
      setPreview('');
      fetchQualifications();
      setIsEditing(false);
    } catch (err) {
      setMessage('Error saving: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNew = () => {
    setFormData({ id: null, type: activeTab, period: '', title: '', institution: '', description: '', order_index: filteredData.length + 1, certificate_url: '' });
    setPreview('');
    setSelectedFile(null);
    setIsEditing(true);
    setMessage('');
  };

  if (loading && !isEditing) return <div className="p-8 text-center font-mono">Loading qualifications...</div>;

  if (isEditing) {
    return (
      <div className="bg-white p-6 border border-[#E5E5E5] rounded-none shadow-sm max-w-3xl">
        <h2 className="text-xl font-black mb-6 uppercase border-b border-[#E5E5E5] pb-4 font-mono">
          {formData.id ? 'Edit Item' : 'Add New Item'}
        </h2>

        {message && (
          <div className={`p-4 mb-6 rounded-none font-mono text-xs ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Type</Label>
              <select required className="w-full px-3 py-2 border rounded-none border-[#E5E5E5] bg-[#FAFAFA] text-[#111111] focus:outline-none focus:border-[#111111] transition-colors duration-200 font-mono text-sm" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="education">Education</option>
                <option value="honor">Honor / Award</option>
                <option value="certification">Certification</option>
              </select>
            </div>
            <div>
              <Label>Period / Year</Label>
              <Input type="text" required value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value})} placeholder="e.g. 2024" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Order Index</Label>
              <Input type="number" required value={formData.order_index} onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})} />
            </div>
            <div>
              <Label>Title</Label>
              <Input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. S1 Teknik Informatika" />
            </div>
          </div>
          <div>
            <Label>Institution</Label>
            <Input type="text" required value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} />
          </div>
          <div>
            <Label>Description (Optional)</Label>
            <TextArea rows={3} value={formData.description || ''} onChange={(val) => setFormData({...formData, description: val})} />
          </div>

          {/* Certificate single file upload */}
          <div className="border-t border-[#E5E5E5] pt-6 mt-2">
            <Label>Certificate Image (Optional)</Label>
            
            <div className="flex gap-4 items-center mb-4">
              <label className="cursor-pointer bg-[#111111] text-white px-4 py-2 hover:bg-[#666666] transition-colors text-sm font-bold flex items-center gap-2 font-mono">
                <ImageIcon size={16} />
                CHOOSE FILE
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  disabled={saving}
                />
              </label>
              {preview && (
                <button 
                  type="button" 
                  onClick={removeCertificate}
                  disabled={saving}
                  className="text-xs font-mono font-bold text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                  REMOVE
                </button>
              )}
            </div>
            
            {preview && (
              <div className="relative border border-[#E5E5E5] p-1 bg-[#FAFAFA] max-w-xs group">
                <img src={preview} alt="Certificate preview" className="w-full h-32 object-cover" />
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] px-1 font-mono uppercase">
                  {preview.startsWith('blob:') ? 'Local preview' : 'Uploaded'}
                </span>
              </div>
            )}
          </div>

          <div className="flex space-x-4 pt-4 border-t border-[#E5E5E5]">
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>CANCEL</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'SAVING...' : 'SAVE'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-[#E5E5E5] pb-4">
        <h2 className="text-2xl font-black uppercase font-mono">Education & Honors Manager</h2>
        <Button onClick={handleAddNew} size="sm">
          <Plus size={16} /> ADD NEW
        </Button>
      </div>

      <div className="flex space-x-4 mb-6">
        {['education', 'honor', 'certification'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-mono text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-colors ${activeTab === tab ? 'border-[#111111] text-[#111111]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            {tab}s
          </button>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>Order</TableCell>
            <TableCell isHeader>Period</TableCell>
            <TableCell isHeader>Title / Institution</TableCell>
            <TableCell isHeader className="text-right">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map(item => (
            <TableRow key={item.id}>
              <TableCell className="font-mono text-sm">{item.order_index}</TableCell>
              <TableCell className="font-mono text-sm text-gray-500">{item.period}</TableCell>
              <TableCell>
                <div className="font-bold">{item.title}</div>
                <div className="text-sm text-gray-500">{item.institution}</div>
              </TableCell>
              <TableCell className="text-right">
                <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700 mr-4"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
              </TableCell>
            </TableRow>
          ))}
          {filteredData.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-8 font-mono">No items found for {activeTab}.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
