import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../utils/api';

function saveToCart(item) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
}

const PREVIEW_WIDTH = 288;
const PREVIEW_HEIGHT = 320;

export default function CustomDesign() {
  const { user, token } = useAuth();
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState('');
  const [colors, setColors] = useState([]);
  const [color, setColor] = useState('');
  const [sizes, setSizes] = useState([]);
  const [size, setSize] = useState('');
  const [designs, setDesigns] = useState([]);
  const [design, setDesign] = useState(null);
  const [upload, setUpload] = useState(null);
  const [success, setSuccess] = useState(false);
  const [tshirtZoom, setTshirtZoom] = useState(1);
  const [designZoom, setDesignZoom] = useState(1);
  const [page, setPage] = useState(0);
  const [designPos, setDesignPos] = useState({ x: PREVIEW_WIDTH / 2, y: PREVIEW_HEIGHT * 0.5 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [savingAsDesigned, setSavingAsDesigned] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    fetch('/api/brands/used').then(res => res.json()).then(data => {
      setBrands(data);
      setBrand(data[0]?.name || '');
    });
    fetch('/api/colors/used').then(res => res.json()).then(data => {
      setColors(data);
      setColor(data[0]?.name || '');
    });
    fetch('/api/tshirts/sizes').then(res => res.json()).then(data => {
      setSizes(data);
      setSize(data[0] || '');
    });
    fetch('/api/designs').then(res => res.json()).then(data => {
      console.log('Designs API response:', data); // Debug log
      const arr = Array.isArray(data) ? data : (data.content || []);
      console.log('Processed designs array:', arr); // Debug log
      setDesigns(arr);
      setDesign(arr[0] ? `/api/designs/${arr[0].id}/image` : null);
    }).catch(error => {
      console.error('Error fetching designs:', error); // Debug log
    });
  }, []);

  const resetDesignPosition = () => {
    // Position the design in the center of the t-shirt image
    // The t-shirt image is centered with left: 50% and transform: translateX(-50%)
    // The drag logic calculates position relative to the t-shirt center, so we need to match that
    // Use a position that's clearly in the middle of the t-shirt chest area
    setDesignPos({ 
      x: PREVIEW_WIDTH / 2, 
      y: PREVIEW_HEIGHT * 0.5  // Moved down to chest area
    });
  };

  const handleUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUpload(URL.createObjectURL(e.target.files[0]));
      setDesign(null);
      resetDesignPosition();
    }
  };

  const generateHighQualityImage = async () => {
    try {
      // Create a canvas with the exact preview dimensions
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size (2x for high quality)
      canvas.width = PREVIEW_WIDTH * 2;
      canvas.height = PREVIEW_HEIGHT * 2;
      
      // Scale the context for high quality
      ctx.scale(2, 2);
      
      // Fill background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);
      
      // Load and draw t-shirt image
      if (tshirtImg) {
        const tshirtImage = new Image();
        tshirtImage.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          tshirtImage.onload = resolve;
          tshirtImage.onerror = reject;
          tshirtImage.src = tshirtImg;
        });
        
        // Calculate t-shirt position (centered)
        const tshirtX = (PREVIEW_WIDTH - PREVIEW_WIDTH * tshirtZoom) / 2;
        const tshirtY = (PREVIEW_HEIGHT - PREVIEW_HEIGHT * tshirtZoom) / 2;
        
        // Draw t-shirt with zoom
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(
          tshirtImage,
          tshirtX, tshirtY,
          PREVIEW_WIDTH * tshirtZoom,
          PREVIEW_HEIGHT * tshirtZoom
        );
        ctx.restore();
      }
      
      // Load and draw design image
      if (design) {
        const designImage = new Image();
        designImage.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          designImage.onload = resolve;
          designImage.onerror = reject;
          designImage.src = design;
        });
        
        // Calculate design position (using the same logic as the preview)
        const designSize = 110 * designZoom;
        const designX = designPos.x - designSize / 2;
        const designY = designPos.y - designSize / 2;
        
        // Draw design
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(
          designImage,
          designX, designY,
          designSize,
          designSize
        );
        ctx.restore();
      }
      
      return canvas.toDataURL('image/png', 1.0);
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    let designName = 'Uploaded Design';
    let designId = 'upload-' + Date.now();
    if (!upload && design) {
      const found = designs.find((d) => d.imageUrl === design);
      if (found) {
        designName = found.name;
        designId = 'gallery-' + found.id;
      }
    }
    
    let combinedImage = '';
    try {
      combinedImage = await generateHighQualityImage();
    } catch (e) {
      console.error('Error generating image:', e);
    }
    
    const item = {
      brand,
      color,
      size,
      design: upload || design,
      designName,
      designId,
      combinedImage,
      tshirtImg,
      id: Date.now(),
      name: `${brand} Custom Tee - ${designName}`,
      price: 24.99,
    };
    saveToCart(item);
    setSuccess(true);
    setAddingToCart(false);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleDownload = async () => {
    try {
      const imageDataUrl = await generateHighQualityImage();
      if (imageDataUrl) {
        const link = document.createElement('a');
        link.download = `${brand}-custom-tshirt.png`;
        link.href = imageDataUrl;
        link.click();
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 2000);
      } else {
        console.error('Failed to generate image');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleSaveAsDesignedTshirt = async () => {
    if (!user || user.role !== 'ADMIN') {
      alert('Only admins can save designed t-shirts');
      return;
    }

    setSavingAsDesigned(true);
    try {
      // Generate the high-quality image
      const imageDataUrl = await generateHighQualityImage();
      if (!imageDataUrl) {
        throw new Error('Failed to generate image');
      }

      // Convert data URL to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'designed-tshirt.png', { type: 'image/png' });

      // Prepare the designed t-shirt data
      const designedTshirtData = {
        name: `${brand} Custom T-Shirt - ${design ? 'Gallery Design' : 'Custom Upload'}`,
        brandId: brands.find(b => b.name === brand)?.id,
        colorId: colors.find(c => c.name === color)?.id,
        designId: design ? designs.find(d => `/api/designs/${d.id}/image` === design)?.id : null,
        sizes: [size],
        gender: 'Unisex',
        material: 'Cotton',
        fit: 'Regular',
        sleeveType: 'Short Sleeve',
        neckType: 'Round Neck',
        price: 24.99,
        stock: 100,
        featured: false,
        tags: `${brand}, ${color}, custom, designed`,
        description: `Custom designed t-shirt with ${brand} brand in ${color} color`,
        customDesignName: upload ? 'Custom Uploaded Design' : null,
        designZoom: designZoom,
        designPositionX: Math.round(designPos.x),
        designPositionY: Math.round(designPos.y),
        tshirtZoom: tshirtZoom.toString()
      };

      // Save to backend
      await apiService.saveDesignedTshirt(designedTshirtData, file, user.username, token);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving designed t-shirt:', error);
      alert('Failed to save designed t-shirt: ' + error.message);
    } finally {
      setSavingAsDesigned(false);
    }
  };

  // For t-shirt image, fetch from backend based on brand/color selection
  const [tshirtImg, setTshirtImg] = useState('');
  const [tshirtImgError, setTshirtImgError] = useState('');
  useEffect(() => {
    if (brand && color) {
      setTshirtImgError('');
      fetch(`/api/tshirts/preview?brand=${encodeURIComponent(brand)}&color=${encodeURIComponent(color)}`)
        .then(res => res.json())
        .then(data => {
          console.log('T-shirt preview API response:', data); // Debug log
          if (data.imageEndpoint) {
            setTshirtImg(data.imageEndpoint);
            setTshirtImgError('');
          } else {
            setTshirtImg('');
            setTshirtImgError('No t-shirt image found for the selected brand and color.');
          }
        })
        .catch((err) => {
          setTshirtImg('');
          setTshirtImgError('Error fetching t-shirt image.');
          console.error('Error fetching t-shirt preview:', err);
        });
    }
  }, [brand, color]);

  // Pagination for gallery
  const itemsPerPage = 30;
  const totalPages = Math.ceil(designs.length / itemsPerPage);
  const pagedGallery = designs.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  // Next/Previous design handlers
  const currentDesignIdx = pagedGallery.findIndex(d => `/api/designs/${d.id}/image` === design);
  const handleNextDesign = () => {
    if (currentDesignIdx < pagedGallery.length - 1) {
      setDesign(`/api/designs/${pagedGallery[currentDesignIdx + 1].id}/image`);
      setUpload(null);
      resetDesignPosition();
    } else if (page < totalPages - 1) {
      // Go to next page and select the first design
      setPage(page + 1);
      setTimeout(() => {
        const nextPageGallery = designs.slice((page + 1) * itemsPerPage, (page + 2) * itemsPerPage);
        if (nextPageGallery.length > 0) {
          setDesign(`/api/designs/${nextPageGallery[0].id}/image`);
          setUpload(null);
          resetDesignPosition();
        }
      }, 0);
    }
  };
  const handlePrevDesign = () => {
    if (currentDesignIdx > 0) {
      setDesign(`/api/designs/${pagedGallery[currentDesignIdx - 1].id}/image`);
      setUpload(null);
      resetDesignPosition();
    } else if (page > 0) {
      // Go to previous page and select the last design
      setPage(page - 1);
      setTimeout(() => {
        const prevPageGallery = designs.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        if (prevPageGallery.length > 0) {
          setDesign(`/api/designs/${prevPageGallery[prevPageGallery.length - 1].id}/image`);
          setUpload(null);
          resetDesignPosition();
        }
      }, 0);
    }
  };

  const handleNextColor = () => {
    const idx = colors.findIndex(c => c.name === color);
    if (colors.length > 0) {
      setColor(colors[(idx + 1) % colors.length].name);
    }
  };

  // Improved drag logic for design
  useEffect(() => {
    if (!dragging) return;
    
    const handleMouseMove = (e) => {
      if (!previewRef.current) return;
      
      const rect = previewRef.current.getBoundingClientRect();
      
      // Calculate the actual t-shirt image position
      // The t-shirt image is centered with left: 50% and transform: translateX(-50%)
      const tshirtLeft = rect.width / 2; // Center of the container
      
      // Calculate mouse position relative to the t-shirt image center
      const mouseX = e.clientX - rect.left;
      const relativeX = mouseX - tshirtLeft;
      
      // Convert to preview coordinates
      const scaleX = PREVIEW_WIDTH / rect.width;
      let x = (relativeX + PREVIEW_WIDTH / 2) * scaleX; // Adjust for t-shirt centering
      let y = (e.clientY - rect.top) * (PREVIEW_HEIGHT / rect.height);
      
      // Calculate the actual design size (base size * zoom)
      const designSize = 110 * designZoom;
      const halfDesignSize = designSize / 2;
      
      // Constrain to preview area with proper design size
      x = Math.max(halfDesignSize, Math.min(PREVIEW_WIDTH - halfDesignSize, x));
      y = Math.max(halfDesignSize, Math.min(PREVIEW_HEIGHT - halfDesignSize, y));
      
      setDesignPos({ x, y });
    };
    
    const handleMouseUp = () => setDragging(false);
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, designZoom]);

  return (
    <div className="w-full min-h-screen max-w-5xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 bg-gradient-to-br from-blue-50 via-purple-50 to-white animate-fade-in">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 md:mb-10 tracking-tight">Customize Your T-Shirt</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        {/* Options */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8">
          <div className="mb-6">
            <label className="block mb-3 font-bold text-lg">Select Brand:</label>
            <select className="w-full p-3 border-2 border-blue-200 rounded-xl shadow mb-4 font-medium" value={brand} onChange={e => setBrand(e.target.value)}>
              {brands.map(b => <option key={b.name}>{b.name}</option>)}
            </select>
            <label className="block mb-3 font-bold text-lg">Select Color:</label>
            <select className="w-full p-3 border-2 border-blue-200 rounded-xl shadow mb-4 font-medium" value={color} onChange={e => setColor(e.target.value)}>
              {colors.map(c => <option key={c.name}>{c.name}</option>)}
            </select>
            <label className="block mb-3 font-bold text-lg">Select Size:</label>
            <select className="w-full p-3 border-2 border-blue-200 rounded-xl shadow mb-4 font-medium" value={size} onChange={e => setSize(e.target.value)}>
              {sizes.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="mb-6">
            <div className="font-bold text-lg mb-3">Designs</div>
            <div className="mb-3" style={{ maxHeight: 400, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: 8 }}>
              {console.log('Rendering designs section. pagedGallery:', pagedGallery, 'designs:', designs, 'page:', page)} {/* Debug log */}
              {pagedGallery.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No designs available. Please upload some designs first.</p>
                </div>
              ) : (
                pagedGallery.map((d, idx) => (
                  <div key={idx} className={`border-2 rounded-xl p-2 mb-4 flex flex-col items-center cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300 ${design === `/api/designs/${d.id}/image` ? 'ring-2 ring-blue-500' : ''}`} onClick={() => { setDesign(`/api/designs/${d.id}/image`); setUpload(null); resetDesignPosition(); }}>
                    <img 
                      src={`/api/designs/${d.id}/thumbnail`} 
                      alt={d.name} 
                      className="w-full max-w-xs object-contain rounded mb-2" 
                      style={{height: 135, background: '#f3f4f6'}} 
                      onError={(e) => {
                        // If thumbnail fails, try the main image
                        if (e.target.src.includes('/thumbnail')) {
                          e.target.src = `/api/designs/${d.id}/image`;
                        } else {
                          // If main image also fails, use placeholder
                          e.target.src = '/placeholder-design.svg';
                        }
                      }} 
                    />
                    <span className="text-base text-gray-700 font-semibold text-center break-words">{d.name}</span>
                    {d.compressionRatio && (
                      <div className="text-xs text-green-600 mt-1">
                        Compressed: {d.compressionRatio}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-2">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className={`px-3 py-1 rounded ${page === 0 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}>Prev</button>
                <span className="px-2 text-sm font-semibold">Page {page + 1} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className={`px-3 py-1 rounded ${page === totalPages - 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}>Next</button>
              </div>
            )}
            <label className="block mb-2 font-bold text-lg mt-4">Or upload your own design:</label>
            <input type="file" accept="image/*" onChange={handleUpload} className="block w-full text-sm text-gray-500" />
          </div>
        </div>
        {/* Preview */}
        <div className="flex flex-col items-center bg-white rounded-2xl shadow-2xl p-4 sm:p-8 mt-6 md:mt-0">
          <div className="font-bold mb-2 sm:mb-3 text-lg sm:text-xl text-blue-700">Preview</div>
          <div 
            ref={previewRef}
            id="tshirt-preview-container" 
            className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto" 
            style={{ height: PREVIEW_HEIGHT, background: '#fff', borderRadius: '1rem', overflow: 'hidden' }}
          >
            {/* Realistic T-shirt image as background */}
            {tshirtImg ? (
              <img
                src={tshirtImg}
                alt="T-shirt preview"
                className="absolute"
                style={{ 
                  width: PREVIEW_WIDTH, 
                  height: PREVIEW_HEIGHT, 
                  left: '50%', 
                  top: 0, 
                  zIndex: 1, 
                  borderRadius: '1rem', 
                  objectFit: 'cover', 
                  transform: `translateX(-50%) scale(${tshirtZoom})` 
                }}
                onError={e => { e.currentTarget.style.display = 'none'; setTshirtImgError('Failed to load t-shirt image.'); }}
              />
            ) : (
              <div className="absolute flex items-center justify-center w-full h-full text-gray-400 text-center z-10" style={{ left: '50%', top: 0, width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT, borderRadius: '1rem', background: '#f3f4f6', transform: 'translateX(-50%)' }}>
                <span>{tshirtImgError || 'No t-shirt image available.'}</span>
              </div>
            )}
            {/* Overlay design, draggable and zoomable */}
            {design && (
              <img
                src={design}
                alt="Design preview"
                className="absolute cursor-move"
                style={{
                  top: designPos.y,
                  left: '50%',
                  width: 110 * designZoom,
                  height: 110 * designZoom,
                  transform: `translateX(-50%) translateY(-50%) translateX(${designPos.x - PREVIEW_WIDTH / 2}px)`,
                  objectFit: 'contain',
                  objectPosition: 'center',
                  zIndex: 2,
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                  backgroundColor: 'transparent',
                  imageRendering: 'crisp-edges',
                  maxWidth: 'none',
                  maxHeight: 'none',
                }}
                onError={e => e.currentTarget.style.display = 'none'}
                onMouseDown={e => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onLoad={(e) => {
                  // Ensure consistent sizing after image loads
                  e.target.style.width = `${110 * designZoom}px`;
                  e.target.style.height = `${110 * designZoom}px`;
                }}
              />
            )}
          </div>
          {/* Zoom Controls below preview */}
          <div className="flex gap-8 mb-4 items-end">
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-600 mb-1">T-shirt Zoom</span>
              <div className="flex gap-2">
                <button onClick={() => setTshirtZoom(z => Math.max(0.8, z - 0.05))} className="px-2 py-1 bg-blue-100 rounded hover:bg-blue-200">-</button>
                <span className="px-2">{(tshirtZoom * 100).toFixed(0)}%</span>
                <button onClick={() => setTshirtZoom(z => Math.min(1.3, z + 0.05))} className="px-2 py-1 bg-blue-100 rounded hover:bg-blue-200">+</button>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-600 mb-1">Design Zoom</span>
              <div className="flex gap-2">
                <button onClick={() => setDesignZoom(z => Math.max(0.5, z - 0.05))} className="px-2 py-1 bg-purple-100 rounded hover:bg-purple-200">-</button>
                <span className="px-2">{(designZoom * 100).toFixed(0)}%</span>
                <button onClick={() => setDesignZoom(z => Math.min(2.0, z + 0.05))} className="px-2 py-1 bg-purple-100 rounded hover:bg-purple-200">+</button>
              </div>
            </div>
            {/* Next Color Button */}
            <button onClick={handleNextColor} className="ml-4 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold shadow hover:bg-green-200 transition">Next Color</button>
          </div>
          {/* Next/Previous Design Buttons below zoom controls */}
          <div className="flex justify-center gap-4 mb-6">
            <button onClick={handlePrevDesign} disabled={currentDesignIdx <= 0} className="px-4 py-2 rounded bg-gray-100 text-lg font-bold hover:bg-blue-100 disabled:opacity-50">{'<- Previous Design'}</button>
            <button onClick={handleNextDesign} disabled={currentDesignIdx >= pagedGallery.length - 1} className="px-4 py-2 rounded bg-gray-100 text-lg font-bold hover:bg-blue-100 disabled:opacity-50">{'Next Design ->'}</button>
          </div>
          <div className="mt-6 w-full flex flex-col items-center">
            <button onClick={handleAddToCart} disabled={addingToCart} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-xl hover:scale-105 hover:bg-blue-700 hover:shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">{addingToCart ? 'Adding...' : 'Add to Cart'}</button>
            <button onClick={handleDownload} className="mt-4 bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-xl hover:scale-105 hover:bg-green-700 hover:shadow-2xl transition-all duration-300">Download Image</button>
            {user && user.role === 'ADMIN' && (
              <button 
                onClick={handleSaveAsDesignedTshirt} 
                disabled={savingAsDesigned} 
                className="mt-4 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-xl hover:scale-105 hover:bg-purple-700 hover:shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {savingAsDesigned ? 'Saving...' : 'Save as Designed T-Shirt'}
              </button>
            )}
            {downloadSuccess && <div className="mt-2 text-green-600 font-semibold">Image downloaded!</div>}
            {saveSuccess && <div className="mt-2 text-purple-600 font-semibold">Designed t-shirt saved successfully!</div>}
            {success && <div className="mt-4 text-green-600 font-semibold">Added to cart!</div>}
          </div>
        </div>
      </div>
    </div>
  );
} 