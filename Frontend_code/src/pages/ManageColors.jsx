import React, { useEffect, useState } from 'react';

export default function ManageColors() {
  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState({ name: '', hexCode: '#CCCCCC' });
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState({ name: '', hexCode: '' });
  const [error, setError] = useState('');

  const fetchColors = async () => {
    const res = await fetch('/api/colors');
    const data = await res.json();
    setColors(data);
  };

  useEffect(() => { fetchColors(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (!newColor.name.trim() || !/^#[0-9A-Fa-f]{6}$/.test(newColor.hexCode)) return setError('Valid name and hex code required');
    const res = await fetch('/api/colors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newColor)
    });
    if (!res.ok) {
      setError('Failed to add color');
      return;
    }
    setNewColor({ name: '', hexCode: '#CCCCCC' });
    fetchColors();
  };

  const handleEdit = (idx) => {
    setEditIndex(idx);
    setEditValue({ name: colors[idx].name, hexCode: colors[idx].hexCode });
  };

  const handleEditSave = async (id) => {
    setError('');
    if (!editValue.name.trim() || !/^#[0-9A-Fa-f]{6}$/.test(editValue.hexCode)) return setError('Valid name and hex code required');
    const res = await fetch(`/api/colors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editValue)
    });
    if (!res.ok) {
      setError('Failed to update color');
      return;
    }
    setEditIndex(null);
    fetchColors();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this color?')) return;
    const res = await fetch(`/api/colors/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setError('Failed to delete color');
      return;
    }
    fetchColors();
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-6">Manage Colors</h1>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input value={newColor.name} onChange={e => setNewColor(c => ({ ...c, name: e.target.value }))} placeholder="New color name" className="border p-2 rounded flex-1" />
        <input value={newColor.hexCode} onChange={e => setNewColor(c => ({ ...c, hexCode: e.target.value }))} placeholder="#RRGGBB" className="border p-2 rounded w-32" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Color</th>
            <th className="p-2">Hex</th>
            <th className="p-2">Preview</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {colors.map((c, idx) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">
                {editIndex === idx ? (
                  <input value={editValue.name} onChange={e => setEditValue(v => ({ ...v, name: e.target.value }))} className="border p-1 rounded" />
                ) : (
                  c.name
                )}
              </td>
              <td className="p-2">
                {editIndex === idx ? (
                  <input value={editValue.hexCode} onChange={e => setEditValue(v => ({ ...v, hexCode: e.target.value }))} className="border p-1 rounded w-24" />
                ) : (
                  c.hexCode
                )}
              </td>
              <td className="p-2">
                <span className="inline-block w-6 h-6 rounded-full border" style={{ background: c.hexCode }}></span>
              </td>
              <td className="p-2 flex gap-2">
                {editIndex === idx ? (
                  <>
                    <button onClick={() => handleEditSave(c.id)} className="text-green-600">Save</button>
                    <button onClick={() => setEditIndex(null)} className="text-gray-600">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(idx)} className="text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-600">Delete</button>
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