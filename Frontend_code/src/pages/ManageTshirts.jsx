import React, { useEffect, useState } from 'react';

export default function ManageTshirts() {
  const [tshirts, setTshirts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetch(`/api/tshirts?page=${page}&size=10`)
      .then(res => res.json())
      .then(data => {
        setTshirts(data.content);
        setTotalPages(data.totalPages);
      });
  }, [page]);

  const startEdit = (tshirt) => {
    setEditing(tshirt.id);
    setForm({ ...tshirt, deleteOldImage: false });
    setError('');
    setUpdateStatus('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (newImage) {
      setUpdateStatus('Preparing form data with image...');
      try {
        const formData = new FormData();
        
        // Create the tshirt data object
        const tshirtData = {
          name: form.name,
          brand: form.brand?.name || form.brand,
          color: form.color?.name || form.color,
          sizes: Array.isArray(form.sizes) ? form.sizes : (form.sizes || form.size || '').split(',').map(s => s.trim()),
          gender: form.gender,
          material: form.material,
          fit: form.fit,
          sleeveType: form.sleeveType,
          neckType: form.neckType,
          price: Number(form.price),
          stock: Number(form.stock),
          featured: !!form.featured,
          tags: form.tags,
          description: form.description
        };
        
        formData.append('tshirt', new Blob([JSON.stringify(tshirtData)], { type: 'application/json' }));
        formData.append('image', newImage);
        
        setUpdateStatus('Sending update request to server...');
        const res = await fetch(`/api/tshirts/${form.id}/update-with-image`, {
          method: 'PUT',
          body: formData,
        });
        
        setUpdateStatus('Processing server response...');
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Server response:', res.status, errorText);
          throw new Error(`Server error (${res.status}): ${errorText}`);
        }
        
        setUpdateStatus('Update successful! Refreshing data...');
        setSuccess(true);
        setEditing(null);
        setNewImage(null);
        fetch(`/api/tshirts?page=${page}&size=10`).then(res => res.json()).then(data => {
          setTshirts(data.content);
          setTotalPages(data.totalPages);
          setUpdateStatus('');
        });
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        console.error('Update error:', err);
        setError('Update failed: ' + err.message);
        setUpdateStatus('');
      }
    } else {
      setUpdateStatus('Preparing form data without image...');
      try {
        const formData = new FormData();
        
        // Create the tshirt data object
        const tshirtData = {
          name: form.name,
          brand: form.brand?.name || form.brand,
          color: form.color?.name || form.color,
          sizes: Array.isArray(form.sizes) ? form.sizes : (form.sizes || form.size || '').split(',').map(s => s.trim()),
          gender: form.gender,
          material: form.material,
          fit: form.fit,
          sleeveType: form.sleeveType,
          neckType: form.neckType,
          price: Number(form.price),
          stock: Number(form.stock),
          featured: !!form.featured,
          tags: form.tags,
          description: form.description
        };
        
        formData.append('tshirt', new Blob([JSON.stringify(tshirtData)], { type: 'application/json' }));
        
        setUpdateStatus('Sending update request to server...');
        const res = await fetch(`/api/tshirts/${form.id}/update-with-image`, {
          method: 'PUT',
          body: formData,
        });
        
        setUpdateStatus('Processing server response...');
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Server response:', res.status, errorText);
          throw new Error(`Server error (${res.status}): ${errorText}`);
        }
        
        setUpdateStatus('Update successful! Refreshing data...');
        setSuccess(true);
        setEditing(null);
        fetch(`/api/tshirts?page=${page}&size=10`).then(res => res.json()).then(data => {
          setTshirts(data.content);
          setTotalPages(data.totalPages);
          setUpdateStatus('');
        });
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        console.error('Update error:', err);
        setError('Update failed: ' + err.message);
        setUpdateStatus('');
      }
    }
    setLoading(false);
  };

  const handleDelete = async (tshirtId) => {
    if (!window.confirm('Are you sure you want to delete this t-shirt? This action cannot be undone.')) {
      return;
    }
    
    setDeleting(tshirtId);
    setError('');
    
    try {
      const res = await fetch(`/api/tshirts/${tshirtId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete t-shirt');
      }
      
      setSuccess(true);
      setUpdateStatus('T-shirt deleted successfully!');
      
      // Refresh the list
      fetch(`/api/tshirts?page=${page}&size=10`).then(res => res.json()).then(data => {
        setTshirts(data.content);
        setTotalPages(data.totalPages);
      });
      
      setTimeout(() => {
        setSuccess(false);
        setUpdateStatus('');
      }, 3000);
    } catch (err) {
      setError('Delete failed: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 bg-white rounded-xl shadow mt-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-blue-700">Manage T-Shirts</h1>
      {success && <div className="text-green-600 font-semibold mb-2 p-2 bg-green-100 rounded">✅ T-shirt updated successfully!</div>}
      {error && <div className="text-red-600 font-semibold mb-2 p-2 bg-red-100 rounded">❌ {error}</div>}
      {updateStatus && <div className="text-blue-600 font-semibold mb-2 p-2 bg-blue-100 rounded">🔄 {updateStatus}</div>}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {tshirts.map(tshirt => (
          <div key={tshirt.id} className="border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded border mb-2 sm:mb-0">
              <img 
                src={`/api/tshirts/${tshirt.id}/image`} 
                alt={tshirt.name} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full items-center justify-center text-gray-400 text-xs text-center">
                No Image
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="font-bold text-base sm:text-lg">{tshirt.name}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Brand: {tshirt.brand?.name || tshirt.brand}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Color: {tshirt.color?.name || tshirt.color}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Size: {tshirt.size}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Gender: {tshirt.gender}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Material: {tshirt.material}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Fit: {tshirt.fit}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Sleeve: {tshirt.sleeveType}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Neck: {tshirt.neckType}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Tags: {tshirt.tags}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Description: {tshirt.description}</div>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 w-full sm:w-auto" 
                onClick={() => startEdit(tshirt)}
              >
                Edit
              </button>
              <button 
                className={`px-4 py-2 rounded font-bold w-full sm:w-auto ${
                  deleting === tshirt.id 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
                onClick={() => handleDelete(tshirt.id)}
                disabled={deleting === tshirt.id}
              >
                {deleting === tshirt.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
          <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-xl p-4 sm:p-8 w-full max-w-screen-sm flex flex-col gap-4 space-y-3 relative overflow-y-auto max-h-[90vh] min-w-0">
            <button type="button" onClick={() => setEditing(null)} className="absolute top-2 right-4 text-2xl font-bold text-gray-600 hover:text-red-500 z-10">&times;</button>
            <h2 className="text-lg sm:text-xl font-bold mb-2">Edit T-Shirt</h2>
            <div className="flex flex-col gap-2 min-w-0">
              <input name="name" value={form.name || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="T-shirt Name" required />
              <input name="brand" value={form.brand?.name || form.brand || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Brand" />
              <input name="color" value={form.color?.name || form.color || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Color" />
              <input name="sizes" value={Array.isArray(form.sizes) ? form.sizes.join(', ') : (form.sizes || form.size || '')} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Sizes (comma separated)" />
              <input name="gender" value={form.gender || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Gender" />
              <input name="material" value={form.material || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Material" />
              <input name="fit" value={form.fit || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Fit" />
              <input name="sleeveType" value={form.sleeveType || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Sleeve Type" />
              <input name="neckType" value={form.neckType || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Neck Type" />
              <input name="price" type="number" value={form.price || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Price" required />
              <input name="stock" type="number" value={form.stock || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Stock" required />
              <label className="flex items-center gap-2">
                <input name="featured" type="checkbox" checked={form.featured || false} onChange={handleChange} />
                Featured
              </label>
              <input name="tags" value={form.tags || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Tags" />
              <textarea name="description" value={form.description || ''} onChange={handleChange} className="p-2 border rounded w-full" placeholder="Description" />
              <input type="file" accept="image/*" onChange={e => setNewImage(e.target.files[0])} className="p-2 border rounded w-full" />
              <div className="text-sm text-gray-600">
                Note: Uploading a new image will automatically replace the existing image.
              </div>
            </div>
            <button type="submit" disabled={loading} className={`px-6 py-2 rounded font-bold w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
              {loading ? 'Updating...' : 'Update'}
            </button>
          </form>
        </div>
      )}
      <div className="flex justify-center gap-4 mt-6">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className={`px-3 py-1 rounded ${page === 0 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}>Prev</button>
        <span className="px-2 text-sm font-semibold">Page {page + 1} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className={`px-3 py-1 rounded ${page === totalPages - 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}>Next</button>
      </div>
    </div>
  );
} 