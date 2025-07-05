import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import toast from 'react-hot-toast';
import { FaTshirt, FaPalette, FaUpload, FaPlus, FaMinus, FaShoppingCart, FaSave } from 'react-icons/fa';

const PREVIEW_WIDTH = 400;
const PREVIEW_HEIGHT = 480;
const DESIGN_INITIAL_SIZE = 120;

export default function CustomDesign() {
  const { isAdmin, isUser } = useAuth();
  const { addToCart } = useCart();
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [genders, setGenders] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [uploadedDesign, setUploadedDesign] = useState(null);
  
  const [designPos, setDesignPos] = useState({ x: PREVIEW_WIDTH / 2, y: PREVIEW_HEIGHT * 0.4 });
  const [designZoom, setDesignZoom] = useState(1);

  const [tshirtImg, setTshirtImg] = useState('/default-tshirt.svg');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [loading, setLoading] = useState({
    addToCart: false,
    save: false
  });

  const previewRef = useRef(null);

  // Add state for multiple t-shirts and selected t-shirt
  const [matchingTshirts, setMatchingTshirts] = useState([]);
  const [selectedTshirt, setSelectedTshirt] = useState(null);

  // Add new states for multi-image custom design workflow
  const [baseImages, setBaseImages] = useState([]);
  const [compositedImages, setCompositedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Add modal state and handler
  const [modalImg, setModalImg] = useState(null);

  // Add state for non-uniform scaling
  const [designWidth, setDesignWidth] = useState(DESIGN_INITIAL_SIZE);
  const [designHeight, setDesignHeight] = useState(DESIGN_INITIAL_SIZE);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState(null); // 'nw', 'ne', 'sw', 'se'
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Add state for white background removal
  const [removeWhiteBg, setRemoveWhiteBg] = useState(false);

  // Fetch initial data
  useEffect(() => {
    // Fetch genders
    fetch('/api/tshirts/genders')
      .then(res => res.json())
      .then(data => {
      setGenders(data);
        if (data.length > 0) setSelectedGender(data[0]);
      })
      .catch(() => toast.error('Could not load genders'));

    // Fetch sizes
    fetch('/api/tshirts/sizes')
      .then(res => res.json())
      .then(data => {
      setSizes(data);
        if (data.length > 0) setSelectedSize(data[0]);
      })
      .catch(() => toast.error('Could not load sizes'));

    // Fetch designs
    fetch('/api/designs')
      .then(res => res.json())
      .then(data => {
        const designsData = Array.isArray(data) ? data : (data.content || []);
        setDesigns(designsData);
      })
      .catch(() => toast.error('Could not load designs'));
  }, []);

  // Fetch brands when gender changes
  useEffect(() => {
    if (selectedGender) {
      fetch(`/api/tshirts/available-brands?gender=${encodeURIComponent(selectedGender)}`)
        .then(res => res.json())
        .then(data => {
          setBrands(data);
          if (data.length > 0) {
            setSelectedBrand(data[0].name);
          }
        })
        .catch(() => toast.error('Could not load brands'));
    }
  }, [selectedGender]);

  // Fetch colors when brand and gender change
  useEffect(() => {
    if (selectedBrand && selectedGender) {
      fetch(`/api/tshirts/available-colors?brand=${encodeURIComponent(selectedBrand)}&gender=${encodeURIComponent(selectedGender)}`)
        .then(res => res.json())
        .then(data => {
          setColors(data);
          if (data.length > 0) {
            setSelectedColor(data[0].name);
          }
        })
        .catch(() => toast.error('Could not load colors'));
    }
  }, [selectedBrand, selectedGender]);

  // Fetch t-shirts when options change
  useEffect(() => {
    if (selectedBrand && selectedColor && selectedGender) {
      fetch(`/api/tshirts/byBrandColorGender?brand=${encodeURIComponent(selectedBrand)}&color=${encodeURIComponent(selectedColor)}&gender=${encodeURIComponent(selectedGender)}`)
        .then(res => res.json())
        .then(data => {
          setMatchingTshirts(data);
          if (data.length > 0) {
            setSelectedTshirt(data[0]);
          } else {
            setSelectedTshirt(null);
          }
        })
        .catch(() => {
          setMatchingTshirts([]);
          setSelectedTshirt(null);
        });
    } else {
      setMatchingTshirts([]);
      setSelectedTshirt(null);
    }
  }, [selectedBrand, selectedColor, selectedGender]);

  // When t-shirt is selected, set baseImages to all its images (or fallback to single image)
  useEffect(() => {
    if (selectedTshirt) {
      if (selectedTshirt.images && selectedTshirt.images.length > 0) {
        setBaseImages(selectedTshirt.images.map(img => img.imageUrl));
        setCompositedImages(new Array(selectedTshirt.images.length).fill(null));
      } else {
        setBaseImages([selectedTshirt.imageUrl || '/default-tshirt.svg']);
        setCompositedImages([null]);
      }
      setCurrentIndex(0);
      setMainImageIndex(0);
    } else {
      setBaseImages([]);
      setCompositedImages([]);
      setCurrentIndex(0);
      setMainImageIndex(0);
    }
  }, [selectedTshirt]);

  // Use current base image for preview
  useEffect(() => {
    if (baseImages.length > 0) {
      setTshirtImg(baseImages[currentIndex]);
    } else {
      setTshirtImg('/default-tshirt.svg');
    }
  }, [baseImages, currentIndex]);

  const handleDesignSelect = (design) => {
    setSelectedDesign(design);
    setUploadedDesign(null);
    resetDesignPosition();
  };

  const handleUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if(file.size > 2 * 1024 * 1024) {
        toast.error("File is too large! Maximum size is 2MB.");
        return;
      }
      setUploadedDesign(URL.createObjectURL(file));
      setSelectedDesign(null);
      resetDesignPosition();
      toast.success("Design uploaded!");
    }
  };
  
  const resetDesignPosition = () => {
    setDesignPos({ x: PREVIEW_WIDTH / 2, y: PREVIEW_HEIGHT * 0.4 });
    setDesignZoom(1);
    setDesignWidth(DESIGN_INITIAL_SIZE);
    setDesignHeight(DESIGN_INITIAL_SIZE);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - designPos.x,
      y: e.clientY - designPos.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const x = e.clientX - dragStart.x;
      const y = e.clientY - dragStart.y;
      setDesignPos({ x, y });
    } else if (isResizing && resizeDir) {
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;
      let newWidth = resizeStart.current.width;
      let newHeight = resizeStart.current.height;
      if (resizeDir === 'se') {
        newWidth += dx;
        newHeight += dy;
      } else if (resizeDir === 'sw') {
        newWidth -= dx;
        newHeight += dy;
      } else if (resizeDir === 'ne') {
        newWidth += dx;
        newHeight -= dy;
      } else if (resizeDir === 'nw') {
        newWidth -= dx;
        newHeight -= dy;
      }
      setDesignWidth(Math.max(30, newWidth));
      setDesignHeight(Math.max(30, newHeight));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDir(null);
  };

  // Attach mousemove/mouseup listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  const handleResizeMouseDown = (e, dir) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDir(dir);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: designWidth,
      height: designHeight,
    };
  };

  const generateFinalImage = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
    const scale = 2; // Higher resolution
    canvas.width = PREVIEW_WIDTH * scale;
    canvas.height = PREVIEW_HEIGHT * scale;
    ctx.scale(scale, scale); // Keep all coordinates in screen units

    // Load t-shirt image
        const tshirtImage = new Image();
        tshirtImage.crossOrigin = 'anonymous';
          tshirtImage.src = tshirtImg;
    await tshirtImage.decode();
  
    // Fit t-shirt using object-fit: contain
    const scaleFactor = Math.min(
      PREVIEW_WIDTH / tshirtImage.width,
      PREVIEW_HEIGHT / tshirtImage.height
    );
    const drawWidth = tshirtImage.width * scaleFactor;
    const drawHeight = tshirtImage.height * scaleFactor;
    const offsetX = (PREVIEW_WIDTH - drawWidth) / 2;
    const offsetY = (PREVIEW_HEIGHT - drawHeight) / 2;
    ctx.drawImage(tshirtImage, offsetX, offsetY, drawWidth, drawHeight);
  
    // Load and draw design
    const designUrl = uploadedDesign || selectedDesign?.imageUrl;
    if (designUrl) {
        const designImage = new Image();
        designImage.crossOrigin = 'anonymous';
      designImage.src = designUrl;
      await designImage.decode();
      
      const drawW = designWidth * designZoom;
      const drawH = designHeight * designZoom;
      const adjustedX = designPos.x - drawW / 2;
      const adjustedY = designPos.y - drawH / 2;
      
      ctx.drawImage(designImage, adjustedX, adjustedY, drawW, drawH);

      // If removeWhiteBg is true, process the design area to remove white pixels
      if (removeWhiteBg && designUrl) {
        // Get the design area
        const imageData = ctx.getImageData(adjustedX, adjustedY, drawW, drawH);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          // If pixel is close to white, make it transparent
          if (data[i] > 240 && data[i+1] > 240 && data[i+2] > 240) {
            data[i+3] = 0;
          }
        }
        ctx.putImageData(imageData, adjustedX, adjustedY);
      }
    }
  
    // Ensure PNG format to preserve transparency
    return canvas.toDataURL('image/png', 1.0);
  };

  const handleAddToCart = async () => {
    if (!selectedBrand || !selectedColor || !selectedGender || !selectedSize) {
      toast.error("Please select all T-shirt options.");
      return;
    }
    if (!selectedDesign && !uploadedDesign) {
      toast.error("Please select or upload a design.");
      return;
    }

    setLoading(prev => ({...prev, addToCart: true}));
    try {
      const finalImage = await generateFinalImage();
      const cartItem = {
        name: `Custom \"${selectedDesign?.name || 'Uploaded'}\" Tee`,
        price: 499.00,
        quantity: 1,
        imageUrl: finalImage,
        brand: selectedBrand,
        color: selectedColor,
        gender: selectedGender,
        size: selectedSize,
        design: selectedDesign || { id: `upload-${Date.now()}`, name: 'Custom Upload' },
        type: 'custom'
      };
      
      addToCart(cartItem);
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Could not add to cart.");
    } finally {
      setLoading(prev => ({...prev, addToCart: false}));
    }
  };

  const handleSaveView = async () => {
    const finalImage = await generateFinalImage();
    const finalImageBlob = await (await fetch(finalImage)).blob();
    setCompositedImages(prev => {
      const arr = [...prev];
      arr[currentIndex] = finalImageBlob;
      return arr;
    });
    toast.success(`Saved view #${currentIndex + 1}`);
  };

  const handleRemoveComposited = (idx) => {
    setCompositedImages(prev => prev.map((img, i) => (i === idx ? null : img)));
    if (mainImageIndex === idx) setMainImageIndex(0);
  };

  const handleSetMain = (idx) => setMainImageIndex(idx);

  const handleSave = async () => {
    if (!selectedBrand || !selectedColor || !selectedGender || !selectedSize) {
      toast.error("Please select all T-shirt options before saving.");
      return;
    }
    if (!compositedImages.some(img => img)) {
      toast.error("Please save at least one view before saving the design.");
      return;
    }
    setLoading(prev => ({...prev, save: true}));
    try {
      const formData = new FormData();
      const designDto = {
        name: `Custom ${selectedDesign?.name || 'Design'}`,
        brandId: selectedTshirt?.brand?.id || null,
        colorId: selectedTshirt?.color?.id || null,
        designId: selectedDesign?.id || null,
        sizes: [selectedSize],
        gender: selectedGender,
        material: selectedTshirt?.material || '',
        fit: selectedTshirt?.fit || '',
        sleeveType: selectedTshirt?.sleeveType || '',
        neckType: selectedTshirt?.neckType || '',
        price: selectedTshirt?.price || 0,
        stock: selectedTshirt?.stock || 0,
        featured: selectedTshirt?.featured || false,
        tags: selectedTshirt?.tags || '',
        description: selectedTshirt?.description || '',
        customDesignName: uploadedDesign ? 'Custom Upload' : (selectedDesign?.name || ''),
        designZoom: designZoom,
        designPositionX: designPos.x,
        designPositionY: designPos.y,
        tshirtZoom: '1',
      };
      formData.append('designedTshirt', JSON.stringify(designDto));
      compositedImages.forEach(img => { if (img) formData.append('images', img); });
      formData.append('mainImageIndex', mainImageIndex);
      const response = await fetch('/api/designed-tshirts/custom-design/upload', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Failed to save design');
      toast.success("Your design has been saved!");
    } catch (error) {
      console.error("Failed to save design:", error);
      toast.error("Could not save your design.");
    } finally {
      setLoading(prev => ({...prev, save: false}));
    }
  };

  const handleDownload = async () => {
    const finalImage = await generateFinalImage();
    const link = document.createElement('a');
    link.href = finalImage;
    link.download = `custom-tshirt-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* LEFT - PREVIEW */}
      <div className="bg-gray-100 rounded-2xl shadow-inner p-4 flex flex-col items-center justify-center lg:sticky lg:top-24 h-auto min-h-[500px] lg:h-[600px] overflow-hidden">
        <div 
          ref={previewRef}
          className="relative overflow-hidden" 
          style={{ 
            width: Math.min(PREVIEW_WIDTH, window.innerWidth - 64), 
            height: Math.min(PREVIEW_HEIGHT, window.innerHeight * 0.6),
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        >
          <img src={tshirtImg} alt="T-shirt preview" className="w-full h-full object-contain" />
          {(selectedDesign || uploadedDesign) && (
            <div
              className="absolute cursor-grab active:cursor-grabbing group touch-none"
              style={{
                top: designPos.y,
                left: designPos.x,
                width: `${designWidth * designZoom}px`,
                height: `${designHeight * designZoom}px`,
                transform: 'translate(-50%, -50%)',
                backgroundImage: `url(${uploadedDesign || selectedDesign.imageUrl})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                zIndex: 2,
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={(e) => {
                e.preventDefault();
                const touch = e.touches[0];
                setDragStart({ x: touch.clientX - designPos.x, y: touch.clientY - designPos.y });
                setIsDragging(true);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                if (isDragging) {
                  const touch = e.touches[0];
                  setDesignPos({
                    x: touch.clientX - dragStart.x,
                    y: touch.clientY - dragStart.y
                  });
                }
              }}
              onTouchEnd={() => setIsDragging(false)}
            >
              {/* Resize handles */}
              {['nw','ne','sw','se'].map(dir => (
                <div
                  key={dir}
                  onMouseDown={e => handleResizeMouseDown(e, dir)}
                  className={`absolute w-3 h-3 bg-white border-2 border-pink-500 rounded-full z-10 cursor-${dir}-resize opacity-80 group-hover:opacity-100 touch-none`}
                  style={{
                    top: dir[0] === 'n' ? -6 : undefined,
                    bottom: dir[0] === 's' ? -6 : undefined,
                    left: dir[1] === 'w' ? -6 : undefined,
                    right: dir[1] === 'e' ? -6 : undefined,
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 mt-4 bg-white p-2 rounded-full shadow">
          <button onClick={() => setDesignZoom(z => Math.max(0.5, z - 0.1))} className="p-2 rounded-full hover:bg-gray-200"><FaMinus /></button>
          <span className="font-semibold text-gray-700">Zoom</span>
          <button onClick={() => setDesignZoom(z => Math.min(3, z + 0.1))} className="p-2 rounded-full hover:bg-gray-200"><FaPlus /></button>
        </div>
      </div>

      {/* RIGHT - CONTROLS */}
      <div className="flex flex-col gap-8">
        {/* T-Shirt Options */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3"><FaTshirt className="text-pink-500" /> T-Shirt Options</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-600 block mb-1">Gender</label>
              <select value={selectedGender} onChange={e => setSelectedGender(e.target.value)} className="w-full p-2 border rounded-lg">
                {genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              </div>
            <div>
              <label className="font-semibold text-gray-600 block mb-1">Brand</label>
              <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} className="w-full p-2 border rounded-lg">
                {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
          </div>
            <div>
              <label className="font-semibold text-gray-600 block mb-1">Color</label>
              <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)} className="w-full p-2 border rounded-lg">
                {colors.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="font-semibold text-gray-600 block mb-1">Size</label>
              <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className="w-full p-2 border rounded-lg">
                {sizes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              </div>
          </div>
          {matchingTshirts.length > 1 && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Multiple t-shirts found. Please select one:</h3>
              <div className="flex gap-4 flex-wrap">
                {matchingTshirts.map((t, idx) => (
                  <div key={t.id} className={`border rounded-lg p-2 flex flex-col items-center cursor-pointer ${selectedTshirt?.id === t.id ? 'border-pink-500' : 'border-gray-200'}`}
                    onClick={() => setSelectedTshirt(t)}>
                    <img src={t.imageUrl || '/default-tshirt.svg'} alt={t.name} className="w-20 h-20 object-contain rounded mb-1" />
                    <span className="text-xs text-gray-600">{t.name || `T-shirt #${idx + 1}`}</span>
                    <button className={`mt-2 px-3 py-1 rounded text-xs font-bold ${selectedTshirt?.id === t.id ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Select</button>
        </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Design Options */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3"><FaPalette className="text-purple-500" /> Choose a Design</h2>
          <div className="mb-4">
            <label htmlFor="design-upload" className="w-full text-center cursor-pointer bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center gap-2">
              <FaUpload className="text-2xl text-gray-500"/>
              <span className="font-semibold text-gray-700">Upload Your Own Design</span>
              <span className="text-xs text-gray-500">PNG, JPG up to 2MB</span>
            </label>
            <input id="design-upload" type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleUpload} />
          </div>
          <div className="relative">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {designs.map(d => (
                <div key={d.id} onClick={() => handleDesignSelect(d)} className={`cursor-pointer border-4 rounded-lg flex-shrink-0 w-24 h-24 ${selectedDesign?.id === d.id ? 'border-pink-500' : 'border-transparent'}`}>
                  <img src={d.imageUrl} alt={d.name} className="w-full h-full object-contain rounded-md"/>
              </div>
              ))}
            </div>
          </div>
          </div>
        
        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Finalize</h2>
          <div className="flex flex-col gap-3">
            <button onClick={handleAddToCart} disabled={loading.addToCart} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform disabled:opacity-50">
              <FaShoppingCart /> {loading.addToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button onClick={handleDownload} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
              Download Design
            </button>
            {isAdmin && isAdmin() && (
              <button onClick={handleSave} disabled={loading.save} className="w-full bg-gray-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50">
                <FaSave /> {loading.save ? 'Saving...' : 'Save Design'}
              </button>
            )}
          </div>
        </div>

        {/* BASE IMAGE GALLERY */}
        {baseImages.length > 1 && (
          <div className="flex gap-2 mb-4">
            {baseImages.map((img, idx) => (
              <div key={idx} className={`relative w-20 h-20 border-2 rounded-lg cursor-pointer ${currentIndex === idx ? 'border-pink-500' : 'border-gray-200'}`} onClick={() => setCurrentIndex(idx)}>
                <img src={img} alt={`View ${idx+1}`} className="w-full h-full object-contain rounded" />
                {compositedImages[idx] && <span className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded">Saved</span>}
              </div>
            ))}
          </div>
        )}

        {/* COMPOSITED IMAGE GALLERY */}
        {compositedImages.some(img => img) && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700 mb-2">Composited Views:</h3>
            <div className="flex gap-2 flex-wrap">
              {compositedImages.map((img, idx) => img && (
                <div key={idx} className="relative w-24 h-24 border-2 rounded-lg cursor-pointer" onClick={() => setModalImg(URL.createObjectURL(img))}>
                  <img src={URL.createObjectURL(img)} alt={`Composited ${idx+1}`} className={`w-full h-full object-contain rounded ${mainImageIndex === idx ? 'ring-2 ring-blue-500' : ''}`} />
                  <button type="button" onClick={e => { e.stopPropagation(); handleRemoveComposited(idx); }} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-600 text-lg font-bold">&times;</button>
                  <button type="button" onClick={e => { e.stopPropagation(); handleSetMain(idx); }} className={`absolute bottom-1 left-1 bg-white bg-opacity-80 rounded px-2 py-0.5 text-xs font-semibold ${mainImageIndex === idx ? 'text-blue-600 border border-blue-600' : 'text-gray-600 border border-gray-300'}`}>{mainImageIndex === idx ? 'Main' : 'Set Main'}</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal for large preview */}
        {modalImg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setModalImg(null)}>
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl w-full flex flex-col items-center relative" onClick={e => e.stopPropagation()}>
              <button className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-pink-500" onClick={() => setModalImg(null)}>&times;</button>
              <img src={modalImg} alt="Large preview" className="max-w-full max-h-[80vh] rounded" />
            </div>
          </div>
        )}

        {/* Add a button to save the current view */}
        <button onClick={handleSaveView} className="w-full bg-green-600 text-white font-bold py-2 rounded-lg mt-4">Save This View</button>

        {/* In the UI, add a toggle for removing white background */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="remove-white-bg"
            checked={removeWhiteBg}
            onChange={e => setRemoveWhiteBg(e.target.checked)}
          />
          <label htmlFor="remove-white-bg" className="text-sm text-gray-700">Remove white background from design (PNG only)</label>
        </div>
      </div>
    </div>
  );
} 
