import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function ManageHome() {
  const [config, setConfig] = useState({
    heroHeadline: '',
    heroSubheadline: '',
    heroImageUrl: '',
    bannerText: '',
    bannerImageUrl: '',
    featuredProductIds: [],
    productOfTheWeekId: '',
  });
  const [saving, setSaving] = useState(false);
  const [productIdInput, setProductIdInput] = useState('');

  useEffect(() => {
    api.getHomeConfig().then(cfg => {
      setConfig({
        heroHeadline: cfg.heroHeadline || '',
        heroSubheadline: cfg.heroSubheadline || '',
        heroImageUrl: cfg.heroImageUrl || '',
        bannerText: cfg.bannerText || '',
        bannerImageUrl: cfg.bannerImageUrl || '',
        featuredProductIds: Array.isArray(cfg.featuredProductIds) ? cfg.featuredProductIds : [],
        productOfTheWeekId: cfg.productOfTheWeekId || '',
      });
    });
  }, []);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleAddFeaturedProduct = () => {
    if (productIdInput && !config.featuredProductIds.includes(productIdInput)) {
      setConfig({
        ...config,
        featuredProductIds: [...config.featuredProductIds, productIdInput],
      });
      setProductIdInput('');
    }
  };

  const handleRemoveFeaturedProduct = (id) => {
    setConfig({
      ...config,
      featuredProductIds: config.featuredProductIds.filter(pid => pid !== id),
    });
  };

  const handleSave = () => {
    setSaving(true);
    api.postHomeConfig(config).then((data) => {
      setConfig(data);
      setSaving(false);
      alert('Home page config updated!');
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Home Page</h1>
      <label className="block font-semibold mt-4">Hero Headline</label>
      <input name="heroHeadline" value={config.heroHeadline} onChange={handleChange} className="input w-full border p-2 rounded mb-2" />
      <label className="block font-semibold mt-4">Hero Subheadline</label>
      <input name="heroSubheadline" value={config.heroSubheadline} onChange={handleChange} className="input w-full border p-2 rounded mb-2" />
      <label className="block font-semibold mt-4">Hero Image URL</label>
      <input name="heroImageUrl" value={config.heroImageUrl} onChange={handleChange} className="input w-full border p-2 rounded mb-2" />
      <label className="block font-semibold mt-4">Banner Text</label>
      <input name="bannerText" value={config.bannerText} onChange={handleChange} className="input w-full border p-2 rounded mb-2" />
      <label className="block font-semibold mt-4">Banner Image URL</label>
      <input name="bannerImageUrl" value={config.bannerImageUrl} onChange={handleChange} className="input w-full border p-2 rounded mb-2" />
      <label className="block font-semibold mt-4">Featured Product IDs</label>
      <div className="flex mb-2">
        <input
          type="text"
          placeholder="Enter Product ID"
          value={productIdInput}
          onChange={e => setProductIdInput(e.target.value)}
          className="input border p-2 rounded mr-2 flex-1"
        />
        <button type="button" onClick={handleAddFeaturedProduct} className="btn bg-green-500 text-white px-4 py-2 rounded">Add</button>
      </div>
      <ul className="mb-2">
        {config.featuredProductIds.map(id => (
          <li key={id} className="flex items-center mb-1">
            <span className="mr-2">{id}</span>
            <button type="button" onClick={() => handleRemoveFeaturedProduct(id)} className="text-red-500">Remove</button>
          </li>
        ))}
      </ul>
      <label className="block font-semibold mt-4">Product of the Week ID</label>
      <input name="productOfTheWeekId" value={config.productOfTheWeekId} onChange={handleChange} className="input w-full border p-2 rounded mb-2" />
      <button onClick={handleSave} className="btn btn-primary mt-6 px-6 py-2 bg-blue-600 text-white rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
    </div>
  );
} 