import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, GripVertical, List, Grid2x2 } from 'lucide-react';
import { EducationRepository } from '../../repositories/EducationRepository';
import { uploadToCloudinary } from '../../utils/cloudinary';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Monochromatic UI elements
import Button from '../../components/admin-ui/Button';
import { Input, TextArea } from '../../components/admin-ui/Input';
import Label from '../../components/admin-ui/Label';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../components/admin-ui/Table';

const SortableTableRow = ({ item, index, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 50, opacity: 0.8, backgroundColor: '#f9fafb', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' } : {})
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? 'shadow-lg bg-gray-50' : ''}>
      <TableCell className="font-mono text-sm">
        <div className="flex items-center gap-3">
          <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-black touch-none">
            <GripVertical size={16} />
          </button>
          {index + 1}
        </div>
      </TableCell>
      <TableCell className="font-mono text-sm text-gray-500">{item.period}</TableCell>
      <TableCell>
        <div className="font-bold">{item.title}</div>
        <div className="text-sm text-gray-500">{item.institution}</div>
      </TableCell>
      <TableCell className="text-right">
        <button onClick={() => onEdit(item)} className="text-blue-500 hover:text-blue-700 mr-4"><Edit2 size={18} /></button>
        <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
      </TableCell>
    </TableRow>
  );
};

const SortableGridItem = ({ item, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 50, opacity: 0.9, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' } : {})
  };

  const isPdf = item.certificate_url?.toLowerCase().endsWith('.pdf');
  const displayImageUrl = isPdf ? item.certificate_url.replace(/\.pdf$/i, '.jpg') : item.certificate_url;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`relative cursor-grab bg-white border-2 touch-none flex flex-col overflow-hidden transition-all duration-300 ${isDragging ? 'border-[#111111] z-50 scale-105' : 'border-[#E5E5E5] hover:border-gray-400'}`}
    >
      <div className="absolute top-2 left-2 bg-[#111111] text-white text-[10px] px-2 py-1 font-mono font-bold z-10 border border-[#111111]">
        {index + 1}
      </div>
      <div className="w-full bg-gray-100 flex items-center justify-center border-b border-[#E5E5E5]">
        {displayImageUrl ? (
          <img src={displayImageUrl} alt={item.title} className="w-full h-auto object-cover pointer-events-none" />
        ) : (
          <div className="text-xs font-mono text-gray-400 p-8">NO IMAGE</div>
        )}
      </div>
      <div className="p-3">
        <h4 className="text-xs font-bold uppercase" title={item.title}>{item.title}</h4>
        <p className="text-[10px] text-gray-500 mt-1">{item.institution}</p>
      </div>
    </div>
  );
};

function StableMasonry({ items, renderItem, cols = 3 }) {
  const [aspectRatios, setAspectRatios] = useState({});

  useEffect(() => {
    let mounted = true;
    items.forEach(item => {
      if (item.certificate_url && !aspectRatios[item.id]) {
        const img = new Image();
        img.onload = () => {
          if (mounted) {
            setAspectRatios(prev => ({
              ...prev,
              [item.id]: img.naturalHeight / img.naturalWidth
            }));
          }
        };
        img.onerror = () => {
          if (mounted) {
            setAspectRatios(prev => ({ ...prev, [item.id]: 1 }));
          }
        };
        const displayUrl = item.certificate_url.toLowerCase().endsWith('.pdf') 
          ? item.certificate_url.replace(/\.pdf$/i, '.jpg') 
          : item.certificate_url;
        img.src = displayUrl;
      }
    });
    return () => { mounted = false; };
  }, [items, aspectRatios]);

  const [currentCols, setCurrentCols] = useState(cols);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCurrentCols(1);
      else if (window.innerWidth < 1024) setCurrentCols(2);
      else setCurrentCols(cols);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cols]);

  const columns = Array.from({ length: currentCols }, () => []);
  const colHeights = Array.from({ length: currentCols }, () => 0);

  items.forEach(item => {
    const ratio = aspectRatios[item.id] || 1.4; // Default to portrait if loading
    let minHeight = colHeights[0];
    let minIndex = 0;
    for (let i = 1; i < currentCols; i++) {
      if (colHeights[i] < minHeight) {
        minHeight = colHeights[i];
        minIndex = i;
      }
    }
    columns[minIndex].push(item);
    colHeights[minIndex] += (ratio + 0.4); 
  });

  return (
    <div className={`grid gap-6 ${currentCols === 1 ? 'grid-cols-1' : currentCols === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
      {columns.map((col, i) => (
        <div key={i} className="flex flex-col gap-6">
          {col.map(item => renderItem(item))}
        </div>
      ))}
    </div>
  );
}

export default function EducationManager() {
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('education'); // 'education', 'honor', 'certification'
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const filteredData = [...qualifications]
    .filter(q => {
      if (activeTab === 'certification') {
        return ['certification', 'certificate', 'haki'].includes(q.type);
      }
      return q.type === activeTab;
    })
    .sort((a, b) => a.order_index - b.order_index);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredData.findIndex((item) => item.id === active.id);
      const newIndex = filteredData.findIndex((item) => item.id === over.id);

      // PERFORM DIRECT SWAP INSTEAD OF ARRAY MOVE (Prevents shifting other items)
      const newFilteredData = [...filteredData];
      const temp = newFilteredData[oldIndex];
      newFilteredData[oldIndex] = newFilteredData[newIndex];
      newFilteredData[newIndex] = temp;
      
      // Update order_index for items starting from 0 or 1
      const updatedItems = newFilteredData.map((item, index) => ({
        ...item,
        order_index: index
      }));

      // Immediately update local state so UI doesn't bounce
      const newQualifications = qualifications.map(q => {
        const updated = updatedItems.find(u => u.id === q.id);
        return updated ? updated : q;
      });
      
      setQualifications(newQualifications);

      // Save to database
      try {
        const payloadToUpdate = updatedItems.map(item => ({
          id: item.id,
          type: item.type,
          period: item.period,
          title: item.title,
          institution: item.institution,
          description: item.description,
          order_index: item.order_index,
          certificate_url: item.certificate_url || null
        }));
        await EducationRepository.batchUpdateQualifications(payloadToUpdate);
      } catch (err) {
        alert('Failed to save new order: ' + err.message);
        fetchQualifications(); // revert to original on error
      }
    }
  };

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
    setFormData({ id: null, type: activeTab, period: '', title: '', institution: '', description: '', order_index: filteredData.length, certificate_url: '' });
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
                <option value="haki">IP / HAKI</option>
              </select>
            </div>
            <div>
              <Label>Period / Year</Label>
              <Input type="text" required value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value})} placeholder="e.g. 2024" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Title</Label>
              <Input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. S1 Teknik Informatika" />
            </div>
            <div>
              <Label>Institution</Label>
              <Input type="text" required value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} />
            </div>
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex space-x-4">
          {['education', 'honor', 'certification'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-mono text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-colors ${activeTab === tab ? 'border-[#111111] text-[#111111]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              {tab === 'certification' ? 'CERTIFICATIONS & IP' : tab + 's'}
            </button>
          ))}
        </div>

        {activeTab === 'certification' && (
          <div className="flex border border-[#E5E5E5] bg-white">
            <button 
              onClick={() => setViewMode('table')} 
              className={`px-3 py-2 flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold transition-colors ${viewMode === 'table' ? 'bg-[#111111] text-white' : 'hover:bg-gray-50 text-gray-500'}`}
            >
              <List size={14} /> TABLE MODE
            </button>
            <button 
              onClick={() => setViewMode('grid')} 
              className={`px-3 py-2 flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold transition-colors ${viewMode === 'grid' ? 'bg-[#111111] text-white' : 'hover:bg-gray-50 text-gray-500'}`}
            >
              <Grid2x2 size={14} /> VISUAL GRID MODE
            </button>
          </div>
        )}
      </div>

      {viewMode === 'table' || activeTab !== 'certification' ? (
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
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={filteredData.map(item => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredData.map((item, index) => (
                  <SortableTableRow 
                    key={item.id} 
                    item={item} 
                    index={index}
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                  />
                ))}
              </SortableContext>
            </DndContext>
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8 font-mono">No items found for {activeTab}.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <div className="bg-[#FAFAFA] p-4 sm:p-6 border border-[#E5E5E5]">
          <div className="mb-6 pb-4 border-b border-[#E5E5E5]">
            <h3 className="font-mono font-bold text-sm uppercase">Visual Grid Layout Editor</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-2xl">
              Drag and drop the certificates to arrange how they will physically appear on the masonry grid layout in the front-end. The grid flows left-to-right exactly like the live website.
            </p>
          </div>
          
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={filteredData.map(item => item.id)}
              strategy={() => null} // Disables chaotic live-shifting
            >
              <StableMasonry 
                items={filteredData} 
                renderItem={(item) => (
                  <SortableGridItem 
                    key={item.id} 
                    item={item} 
                    index={filteredData.findIndex(q => q.id === item.id)} 
                  />
                )} 
              />
            </SortableContext>
          </DndContext>
          
          {filteredData.length === 0 && (
            <div className="text-center text-gray-500 py-8 font-mono">No items found for {activeTab}.</div>
          )}
        </div>
      )}
    </div>
  );
}
