import React, { useState, useEffect } from 'react';
import { compressImage, getImageInfo, formatFileSize, calculateCompressionRatio } from '../utils/imageCompression';

function SelectWithCustom({ label, name, options, form, setForm }) {
  const isCustom = !options.includes(form[name]);
  return (
    <div>
      <label className="block font-semibold mb-1">{label}</label>
      <select
        name={name}
        value={isCustom ? 'custom' : form[name]}
        onChange={e =>
          e.target.value === 'custom'
            ? setForm(f => ({ ...f, [name]: '' }))
            : setForm(f => ({ ...f, [name]: e.target.value }))
        }
        className="w-full p-2 border rounded mb-1"
      >
        {options.map(opt => <option key={opt}>{opt}</option>)}
        <option value="custom">Other (enter below)</option>
      </select>
      {isCustom && (
        <input
          value={form[name] || ''}
          onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
          className="w-full p-2 border rounded"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}
    </div>
  );
}

export default function DesignUpload() {
  const [types, setTypes] = useState([]);
  const [themes, setThemes] = useState([]);
  const [form, setForm] = useState({
    name: '',
    type: '',
    theme: '',
    tags: '',
    uploadedBy: '',
    date: new Date().toISOString().slice(0, 10),
    image: null,
    imageUrl: '',
    description: '',
    custom: {},
  });
  const [success, setSuccess] = useState(false);
  const [imageInfo, setImageInfo] = useState(null);
  const [compressionInfo, setCompressionInfo] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    fetch('/api/designs/types').then(res => res.json()).then(data => setTypes(data));
    fetch('/api/designs/themes').then(res => res.json()).then(data => setThemes(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  
  const handleFile = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsCompressing(true);
      
      try {
        // Get original image info
        const originalInfo = await getImageInfo(file);
        setImageInfo(originalInfo);
        
        // Compress the image
        const compressedFile = await compressImage(file);
        
        // Get compressed image info
        const compressedInfo = await getImageInfo(compressedFile);
        
        // Calculate compression ratio
        const compressionRatio = calculateCompressionRatio(originalInfo.size, compressedInfo.size);
        
        setCompressionInfo({
          original: originalInfo,
          compressed: compressedInfo,
          ratio: compressionRatio
        });
        
        setForm(f => ({ 
          ...f, 
          image: compressedFile, 
          imageUrl: URL.createObjectURL(compressedFile) 
        }));
      } catch (error) {
        console.error('Image processing failed:', error);
        alert('Failed to process image. Please try again.');
      } finally {
        setIsCompressing(false);
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'image' && value) {
        formData.append('image', value);
      } else if (typeof value === 'string') {
        formData.append(key, value);
      }
    });

    try {
      const res = await fetch('/api/designs/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setForm({ name: '', type: '', theme: '', tags: '', uploadedBy: '', date: new Date().toISOString().slice(0, 10), image: null, imageUrl: '', description: '', custom: {} });
      setImageInfo(null);
      setCompressionInfo(null);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  };

  return (
    <div className="w-full min-h-screen max-w-xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 bg-white rounded-xl shadow mt-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-purple-700">Upload New Design</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block font-semibold mb-1">Design Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
        <SelectWithCustom label="Type" name="type" options={types} form={form} setForm={setForm} />
        <SelectWithCustom label="Theme/Occasion" name="theme" options={themes} form={form} setForm={setForm} />
        <div>
          <label className="block font-semibold mb-1">Tags (comma separated)</label>
          <input name="tags" value={form.tags} onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g. sun, cartoon, children" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Uploaded By</label>
          <input name="uploadedBy" value={form.uploadedBy} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Uploader name or email" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Date</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Image</label>
          <input name="image" type="file" accept="image/*" onChange={handleFile} className="w-full" />
          {isCompressing && (
            <div className="text-blue-600 font-semibold mt-2">🔄 Compressing image...</div>
          )}
          {form.imageUrl && (
            <div className="mt-2">
              <img src={form.imageUrl} alt="Preview" className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded border" />
              {compressionInfo && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="font-semibold text-gray-700 mb-2">Image Compression Info:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-medium">Original:</span>
                      <div>{compressionInfo.original.width} × {compressionInfo.original.height}</div>
                      <div>{formatFileSize(compressionInfo.original.size)}</div>
                    </div>
                    <div>
                      <span className="font-medium">Compressed:</span>
                      <div>{compressionInfo.compressed.width} × {compressionInfo.compressed.height}</div>
                      <div>{formatFileSize(compressionInfo.compressed.size)}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-green-600 font-semibold">
                    Space saved: {compressionInfo.ratio}%
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" rows={3} />
        </div>
        <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded font-bold hover:bg-purple-700 transition">Upload Design</button>
        {success && <div className="text-green-600 font-semibold mt-2">Design uploaded!</div>}
      </form>
    </div>
  );
} 