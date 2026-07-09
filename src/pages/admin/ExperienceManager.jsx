import React, { useState, useEffect } from 'react';
import { ExperienceRepository } from '../../repositories/ExperienceRepository';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Button from '../../components/admin-ui/Button';
import { Input, TextArea } from '../../components/admin-ui/Input';
import Label from '../../components/admin-ui/Label';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../components/admin-ui/Table';

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    id: null,
    period: '',
    role: '',
    company: '',
    description: '',
    order_index: 0
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const data = await ExperienceRepository.getAllExperiences();
      setExperiences(data);
    } catch (err) {
      alert('Error fetching experiences: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp) => {
    setFormData(exp);
    setIsEditing(true);
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await ExperienceRepository.deleteExperience(id);
        fetchExperiences();
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const payload = {
        period: formData.period,
        role: formData.role,
        company: formData.company,
        description: formData.description,
        order_index: formData.order_index
      };

      if (formData.id) {
        // Update
        await ExperienceRepository.updateExperience(formData.id, payload);
        setMessage('Updated successfully!');
      } else {
        // Insert
        await ExperienceRepository.createExperience(payload);
        setMessage('Created successfully!');
      }
      fetchExperiences();
      setIsEditing(false);
    } catch (err) {
      setMessage('Error saving: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNew = () => {
    setFormData({ id: null, period: '', role: '', company: '', description: '', order_index: experiences.length + 1 });
    setIsEditing(true);
    setMessage('');
  };

  if (loading && !isEditing) return <div className="p-8 text-center font-mono">Loading experiences...</div>;

  if (isEditing) {
    return (
      <div className="bg-white p-6 border border-[#E5E5E5] rounded-none shadow-sm max-w-3xl font-mono text-[#111111]">
        <h2 className="text-xl font-black mb-6 uppercase border-b border-[#E5E5E5] pb-4">
          {formData.id ? 'Edit Experience' : 'Add New Experience'}
        </h2>

        {message && (
          <div className={`p-4 mb-6 rounded-none font-mono text-xs ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Period</Label>
              <Input type="text" required value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value})} placeholder="e.g. OKT 2024 - FEB 2025" />
            </div>
            <div>
              <Label>Order Index</Label>
              <Input type="number" required value={formData.order_index} onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})} />
            </div>
          </div>
          <div>
            <Label>Role</Label>
            <Input type="text" required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
          </div>
          <div>
            <Label>Company</Label>
            <Input type="text" required value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
          </div>
          <div>
            <Label>Description</Label>
            <TextArea required rows={4} value={formData.description} onChange={(val) => setFormData({...formData, description: val})} />
          </div>

          <div className="flex space-x-4 pt-4 border-t border-[#E5E5E5]">
            <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>CANCEL</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'SAVING...' : 'SAVE'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="font-mono text-[#111111]">
      <div className="flex justify-between items-center mb-6 border-b border-[#E5E5E5] pb-4">
        <h2 className="text-2xl font-black uppercase">Experience Manager</h2>
        <Button onClick={handleAddNew} size="sm">
          <Plus size={16} /> ADD NEW
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>Order</TableCell>
            <TableCell isHeader>Period</TableCell>
            <TableCell isHeader>Role / Company</TableCell>
            <TableCell isHeader className="text-right">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {experiences.map(exp => (
            <TableRow key={exp.id}>
              <TableCell className="font-mono text-sm">{exp.order_index}</TableCell>
              <TableCell className="font-mono text-sm text-gray-500">{exp.period}</TableCell>
              <TableCell>
                <div className="font-bold">{exp.role}</div>
                <div className="text-sm text-gray-500">{exp.company}</div>
              </TableCell>
              <TableCell className="text-right">
                <button onClick={() => handleEdit(exp)} className="text-blue-500 hover:text-blue-700 mr-4"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(exp.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
              </TableCell>
            </TableRow>
          ))}
          {experiences.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-8">No experiences found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
