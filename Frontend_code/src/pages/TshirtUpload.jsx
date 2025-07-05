import React, { useState, useEffect } from 'react';
import { compressImagePreservingTransparency } from '../utils/imageCompression';

function SizeMultiSelect({ label, name, options, form, setForm }) {
  // Default sizes
  const defaultSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  // Merge backend and default, dedupe
  const allSizes = Array.from(new Set([...defaultSizes, ...options]));
  const selected = Array.isArray(form[name]) ? form[name] : [];
  const [customSize, setCustomSize] = useState('');

  const handleCheck = (size) => {
    if (selected.includes(size)) {
      setForm(f => ({ ...f, [name]: selected.filter(s => s !== size) }));
    } else {
      setForm(f => ({ ...f, [name]: [...selected, size] }));
    }
  };
  const handleAddCustom = () => {
    if (customSize && !allSizes.includes(customSize) && !selected.includes(customSize)) {
      setForm(f => ({ ...f, [name]: [...selected, customSize] }));
      setCustomSize('');
    }
  };
  const handleRemoveCustom = (size) => {
    setForm(f => ({ ...f, [name]: selected.filter(s => s !== size) }));
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">{label}</label>
      <div className="flex flex-wrap gap-3 mb-2">
        {allSizes.map(size => (
          <label key={size} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={selected.includes(size)}
              onChange={() => handleCheck(size)}
            />
            {size}
          </label>
        ))}
        {selected.filter(s => !allSizes.includes(s)).map(size => (
          <span key={size} className="flex items-center gap-1 bg-gray-200 px-2 rounded">
            {size}
            <button type="button" onClick={() => handleRemoveCustom(size)} className="text-red-500">&times;</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2 mt-1">
        <input
          value={customSize}
          onChange={e => setCustomSize(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Add custom size"
        />
        <button
          type="button"
          className="bg-blue-500 text-white px-3 rounded"
          onClick={handleAddCustom}
        >Add</button>
      </div>
    </div>
  );
}

function SelectWithCustom({ label, name, options, form, setForm }) {
  const isCustom = !options.includes(form[name]);
  return (
    <div className="mb-4">
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

export default function TshirtUpload() {
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [fits, setFits] = useState([]);
  const [sleeveTypes, setSleeveTypes] = useState([]);
  const [neckTypes, setNeckTypes] = useState([]);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    color: '',
    sizes: [],
    gender: '',
    material: '',
    fit: '',
    sleeveType: '',
    neckType: '',
    price: '',
    stock: '',
    featured: false,
    tags: '',
    images: [],
    imageUrls: [],
    description: '',
  });
  const [success, setSuccess] = useState(false);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [brandError, setBrandError] = useState('');
  const [showColorForm, setShowColorForm] = useState(false);
  const [newColor, setNewColor] = useState({ name: '', hexCode: '#CCCCCC' });
  const [colorError, setColorError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    fetch('/api/brands').then(res => res.json()).then(data => setBrands(data.map(b => b.name || b)));
    fetch('/api/colors').then(res => res.json()).then(data => setColors(data.map(c => c.name || c)));
    fetch('/api/tshirts/sizes').then(res => res.json()).then(data => setSizes(data));
    fetch('/api/tshirts/genders').then(res => res.json()).then(data => setGenders(data));
    fetch('/api/tshirts/materials').then(res => res.json()).then(data => setMaterials(data));
    fetch('/api/tshirts/fits').then(res => res.json()).then(data => setFits(data));
    fetch('/api/tshirts/sleeveTypes').then(res => res.json()).then(data => setSleeveTypes(data));
    fetch('/api/tshirts/neckTypes').then(res => res.json()).then(data => setNeckTypes(data));
  }, []);

  const handleFiles = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Compress images while preserving transparency
      const compressedFiles = [];
      for (const file of files) {
        try {
          const compressedFile = await compressImagePreservingTransparency(file);
          compressedFiles.push(compressedFile);
        } catch (error) {
          console.error('Failed to compress image:', error);
          compressedFiles.push(file); // Use original if compression fails
        }
      }
      
      setNewImages(prev => [...prev, ...compressedFiles]);
      setImagePreviews(prev => [...prev, ...compressedFiles.map(file => URL.createObjectURL(file))]);
      if (mainImageIndex === null && compressedFiles.length > 0) setMainImageIndex(0);
    }
  };
  const handleRemoveImage = (idx) => {
    setNewImages(imgs => imgs.filter((_, i) => i !== idx));
    setImagePreviews(urls => urls.filter((_, i) => i !== idx));
    setMainImageIndex(prev => {
      if (idx === prev) return 0;
      if (idx < prev) return prev - 1;
      return prev;
    });
  };
  const handleSetMain = (idx) => setMainImageIndex(idx);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const formData = new FormData();
    const tshirtDto = {
      name: form.name,
      brand: form.brand,
      color: form.color,
      sizes: form.sizes,
      gender: form.gender,
      material: form.material,
      fit: form.fit,
      sleeveType: form.sleeveType,
      neckType: form.neckType,
      price: form.price,
      stock: form.stock,
      featured: form.featured,
      tags: form.tags,
      description: form.description,
    };
    formData.append('tshirt', new Blob([JSON.stringify(tshirtDto)], { type: "application/json" }));
    if (newImages && newImages.length > 0) {
      for (let img of newImages) {
        formData.append('images', img);
      }
      formData.append('mainImageIndex', mainImageIndex);
    }
    try {
      const res = await fetch('/api/tshirts/upload', {
        method: 'POST',
        body: formData,
      });
      let data = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        setSubmitError('Upload failed: Invalid server response.');
        return;
      }
      if (!res.ok) {
        setSubmitError(data.error || data.message || 'Upload failed');
        return;
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setForm({ name: '', brand: '', color: '', sizes: [], gender: '', material: '', fit: '', sleeveType: '', neckType: '', price: '', stock: '', featured: false, tags: '', images: [], imageUrls: [], description: '' });
      setNewImages([]);
      setImagePreviews([]);
      setMainImageIndex(0);
    } catch (err) {
      setSubmitError('Network or server error.');
    }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    setBrandError('');
    if (!newBrand.trim()) {
      setBrandError('Brand name cannot be empty');
      return;
    }
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBrand })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add brand');
      setBrands(b => [...b, data.name].sort((a, b) => a.localeCompare(b)));
      setForm(f => ({ ...f, brand: data.name }));
      setShowBrandForm(false);
      setNewBrand('');
    } catch (err) {
      setBrandError(err.message);
    }
  };

  const handleAddColor = async (e) => {
    e.preventDefault();
    setColorError('');
    if (!newColor.name.trim()) {
      setColorError('Color name cannot be empty');
      return;
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(newColor.hexCode)) {
      setColorError('Hex code must be in format #RRGGBB');
      return;
    }
    try {
      const res = await fetch('/api/colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newColor)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add color');
      setColors(c => [...c, data.name].sort((a, b) => a.localeCompare(b)));
      setForm(f => ({ ...f, color: data.name }));
      setShowColorForm(false);
      setNewColor({ name: '', hexCode: '#CCCCCC' });
    } catch (err) {
      setColorError(err.message);
    }
  };

  return (
    <div className="w-full min-h-screen max-w-3xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 bg-white rounded-xl shadow mt-8">
      <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-6">Upload New T-Shirt</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block font-semibold mb-1">T-shirt Name</label>
          <input name="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full p-2 border rounded" required />
        </div>
        <SelectWithCustom label="Brand" name="brand" options={brands} form={form} setForm={setForm} />
        <button type="button" className="text-blue-600 underline text-sm ml-2" onClick={() => setShowBrandForm(v => !v)}>
          {showBrandForm ? 'Cancel' : 'Add new brand'}
        </button>
        {showBrandForm && (
          <div className="flex flex-col gap-2 my-2">
            <input value={newBrand} onChange={e => setNewBrand(e.target.value)} placeholder="Brand name" className="p-2 border rounded" />
            <button type="button" onClick={handleAddBrand} className="bg-blue-500 text-white px-3 py-1 rounded">Add Brand</button>
            {brandError && <div className="text-red-600 text-sm">{brandError}</div>}
          </div>
        )}
        <SelectWithCustom label="Color" name="color" options={colors} form={form} setForm={setForm} />
        <button type="button" className="text-blue-600 underline text-sm ml-2" onClick={() => setShowColorForm(v => !v)}>
          {showColorForm ? 'Cancel' : 'Add new color'}
        </button>
        {showColorForm && (
          <div className="flex flex-col gap-2 my-2">
            <input value={newColor.name} onChange={e => setNewColor(c => ({ ...c, name: e.target.value }))} placeholder="Color name" className="p-2 border rounded" />
            <input value={newColor.hexCode} onChange={e => setNewColor(c => ({ ...c, hexCode: e.target.value }))} placeholder="#RRGGBB" className="p-2 border rounded" />
            <button type="button" onClick={handleAddColor} className="bg-blue-500 text-white px-3 py-1 rounded">Add Color</button>
            {colorError && <div className="text-red-600 text-sm">{colorError}</div>}
          </div>
        )}
        <SelectWithCustom label="Gender" name="gender" options={genders} form={form} setForm={setForm} />
        <SelectWithCustom label="Material" name="material" options={materials} form={form} setForm={setForm} />
        <SelectWithCustom label="Fit" name="fit" options={fits} form={form} setForm={setForm} />
        <SelectWithCustom label="Sleeve Type" name="sleeveType" options={sleeveTypes} form={form} setForm={setForm} />
        <SelectWithCustom label="Neck Type" name="neckType" options={neckTypes} form={form} setForm={setForm} />
        <SizeMultiSelect label="Sizes" name="sizes" options={sizes} form={form} setForm={setForm} />
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Price</label>
            <input name="price" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full p-2 border rounded" required />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="w-full p-2 border rounded" required />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input name="featured" type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
          <label className="font-semibold">Featured</label>
        </div>
        <div>
          <label className="block font-semibold mb-1">Tags (comma separated)</label>
          <input name="tags" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className="w-full p-2 border rounded" placeholder="e.g. summer, casual, white" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Images</label>
          <input name="images" type="file" accept="image/*" multiple onChange={handleFiles} className="w-full" />
          {imagePreviews && imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {imagePreviews.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img src={url} alt={`Preview ${idx+1}`} className={`w-24 h-24 object-contain rounded border ${mainImageIndex === idx ? 'ring-2 ring-blue-500' : ''}`} />
                  <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-600 text-lg font-bold opacity-80 group-hover:opacity-100">&times;</button>
                  <button type="button" onClick={() => handleSetMain(idx)} className={`absolute bottom-1 left-1 bg-white bg-opacity-80 rounded px-2 py-0.5 text-xs font-semibold ${mainImageIndex === idx ? 'text-blue-600 border border-blue-600' : 'text-gray-600 border border-gray-300'} group-hover:opacity-100`}>{mainImageIndex === idx ? 'Main' : 'Set Main'}</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full p-2 border rounded" rows={3} />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition">Upload T-Shirt</button>
        {success && <div className="text-green-600 font-semibold mt-2">T-shirt uploaded!</div>}
        {submitError && <div className="text-red-600 font-semibold mt-2">{submitError}</div>}
      </form>
    </div>
  );
} 