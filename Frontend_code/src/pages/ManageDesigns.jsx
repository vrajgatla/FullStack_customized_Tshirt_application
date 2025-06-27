import React, { useEffect, useState } from 'react';

export default function ManageDesigns() {
  const [designs, setDesigns] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/designs?page=${page}&size=10`)
      .then(res => res.json())
      .then(data => {
        setDesigns(data.content);
        setTotalPages(data.totalPages);
      });
  }, [page]);

  const startEdit = (design) => {
    setEditing(design.id);
    setForm({ ...design, deleteOldImage: false });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name) {
      setError('Name is required');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('type', form.type || '');
      formData.append('theme', form.theme || '');
      formData.append('tags', form.tags || '');
      formData.append('uploadedBy', form.uploadedBy || '');
      formData.append('date', form.date || '');
      formData.append('description', form.description || '');
      if (newImage) {
        formData.append('image', newImage);
      }
      const res = await fetch(`/api/designs/${form.id}/update-with-image`, {
        method: 'PUT',
        body: formData,
      });
      if (!res.ok) throw new Error('Update failed');
      setSuccess(true);
      setEditing(null);
      setNewImage(null);
      fetch(`/api/designs?page=${page}&size=10`).then(res => res.json()).then(data => {
        setDesigns(data.content);
        setTotalPages(data.totalPages);
      });
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('Update failed: ' + err.message);
    }
  };

  const handleDelete = async (designId) => {
    if (!window.confirm('Are you sure you want to delete this design? This action cannot be undone.')) {
      return;
    }
    setDeleting(designId);
    setError('');
    try {
      const res = await fetch(`/api/designs/${designId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete design');
      setSuccess(true);
      fetch(`/api/designs?page=${page}&size=10`).then(res => res.json()).then(data => {
        setDesigns(data.content);
        setTotalPages(data.totalPages);
      });
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('Delete failed: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 bg-white rounded-xl shadow mt-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-purple-700">Manage Designs</h1>
      {success && <div className="text-green-600 font-semibold mb-2">Design updated!</div>}
      {error && <div className="text-red-600 font-semibold mb-2">{error}</div>}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {designs.map(design => (
          <div key={design.id} className="border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center">
            <img src={`/api/designs/${design.id}/image`} alt={design.name} className="w-24 h-24 object-contain rounded border mb-2 sm:mb-0" onError={e => e.currentTarget.style.display = 'none'} />
            <div className="flex-1 w-full">
              <div className="font-bold text-base sm:text-lg">{design.name}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Type: {design.type} | Theme: {design.theme}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Tags: {design.tags}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Uploaded By: {design.uploadedBy}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Date: {design.date}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Description: {design.description}</div>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 w-full sm:w-auto" onClick={() => startEdit(design)}>Edit</button>
              <button className={`px-4 py-2 rounded font-bold w-full sm:w-auto ${deleting === design.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`} onClick={() => handleDelete(design.id)} disabled={deleting === design.id}>{deleting === design.id ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className={`px-3 py-1 rounded ${page === 0 ? 'bg-gray-200 text-gray-400' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}>Prev</button>
        <span className="px-2 text-sm font-semibold">Page {page + 1} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className={`px-3 py-1 rounded ${page === totalPages - 1 ? 'bg-gray-200 text-gray-400' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}>Next</button>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
          <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-xl p-4 sm:p-8 w-full max-w-lg flex flex-col gap-4 relative">
            <button type="button" onClick={() => setEditing(null)} className="absolute top-2 right-4 text-2xl font-bold text-gray-600 hover:text-red-500">&times;</button>
            <h2 className="text-lg sm:text-xl font-bold mb-2">Edit Design</h2>
            <input name="name" value={form.name || ''} onChange={handleChange} className="p-2 border rounded" placeholder="Design Name" required />
            <input name="type" value={form.type || ''} onChange={handleChange} className="p-2 border rounded" placeholder="Type" />
            <input name="theme" value={form.theme || ''} onChange={handleChange} className="p-2 border rounded" placeholder="Theme" />
            <input name="tags" value={form.tags || ''} onChange={handleChange} className="p-2 border rounded" placeholder="Tags" />
            <input name="uploadedBy" value={form.uploadedBy || ''} onChange={handleChange} className="p-2 border rounded" placeholder="Uploaded By" />
            <input name="date" type="date" value={form.date || ''} onChange={handleChange} className="p-2 border rounded" />
            <textarea name="description" value={form.description || ''} onChange={handleChange} className="p-2 border rounded" placeholder="Description" />
            <input type="file" accept="image/*" onChange={e => setNewImage(e.target.files[0])} className="p-2 border rounded" />
            <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded font-bold hover:bg-purple-700">Update</button>
            {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
          </form>
        </div>
      )}
    </div>
  );
} 