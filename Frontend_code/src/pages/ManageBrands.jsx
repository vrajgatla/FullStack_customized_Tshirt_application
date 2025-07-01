import React, { useEffect, useState } from 'react';

export default function ManageBrands() {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');

  const fetchBrands = async () => {
    const res = await fetch('/api/brands');
    const data = await res.json();
    setBrands(data);
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (!newBrand.trim()) return setError('Brand name required');
    const res = await fetch('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newBrand })
    });
    if (!res.ok) {
      setError('Failed to add brand');
      return;
    }
    setNewBrand('');
    fetchBrands();
  };

  const handleEdit = (idx) => {
    setEditIndex(idx);
    setEditValue(brands[idx].name);
  };

  const handleEditSave = async (id) => {
    setError('');
    if (!editValue.trim()) return setError('Brand name required');
    const res = await fetch(`/api/brands/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editValue })
    });
    if (!res.ok) {
      setError('Failed to update brand');
      return;
    }
    setEditIndex(null);
    fetchBrands();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this brand?')) return;
    const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setError('Failed to delete brand');
      return;
    }
    fetchBrands();
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-6">Manage Brands</h1>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input value={newBrand} onChange={e => setNewBrand(e.target.value)} placeholder="New brand name" className="border p-2 rounded flex-1" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Brand</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((b, idx) => (
            <tr key={b.id} className="border-t">
              <td className="p-2">
                {editIndex === idx ? (
                  <input value={editValue} onChange={e => setEditValue(e.target.value)} className="border p-1 rounded" />
                ) : (
                  b.name
                )}
              </td>
              <td className="p-2 flex gap-2">
                {editIndex === idx ? (
                  <>
                    <button onClick={() => handleEditSave(b.id)} className="text-green-600">Save</button>
                    <button onClick={() => setEditIndex(null)} className="text-gray-600">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(idx)} className="text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(b.id)} className="text-red-600">Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 