import React from 'react';

export default function MultiImageUpload({ images, setImages, mainImageIndex, setMainImageIndex, onImageAdd, onImageRemove, onImageReplace, onSetMainImage }) {
  const fileInputRef = React.useRef();

  const handleAddMoreClick = () => fileInputRef.current && fileInputRef.current.click();

  const handleAddMoreFiles = async (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    if (onImageAdd) await onImageAdd(files);
    e.target.value = '';
  };

  const handleRemoveImage = async (idx) => {
    const removed = images[idx];
    setImages(prev => prev.filter((_, i) => i !== idx));
    if (onImageRemove) await onImageRemove(removed, idx);
    if (mainImageIndex === idx) setMainImageIndex(0);
    else if (mainImageIndex > idx) setMainImageIndex(mainImageIndex - 1);
  };

  const handleReplaceImage = async (idx, file) => {
    setImages(prev => prev.map((img, i) => (i === idx ? file : img)));
    if (onImageReplace) await onImageReplace(idx, file);
  };

  const handleChangeImage = (idx) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      if (e.target.files && e.target.files[0]) {
        await handleReplaceImage(idx, e.target.files[0]);
      }
    };
    input.click();
  };

  const handleSetMainImage = async (idx) => {
    setMainImageIndex(idx);
    if (onSetMainImage) await onSetMainImage(idx, images[idx]);
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">Images *</label>
      <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleAddMoreFiles} />
      <button type="button" onClick={handleAddMoreClick} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 mb-2 text-sm font-bold">
        + Add More Images
      </button>
      {images.length > 0 && (
        <div className="flex gap-4 mt-2 flex-wrap">
          {images.map((img, idx) => (
            <div key={idx} className="relative flex flex-col items-center group">
              <img src={img instanceof File ? URL.createObjectURL(img) : img.url} alt="preview" className="w-24 h-24 object-cover rounded border mb-1" />
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  name="mainImage"
                  checked={mainImageIndex === idx}
                  onChange={() => handleSetMainImage(idx)}
                />
                Main
              </label>
              <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-0 right-0 bg-white text-red-500 rounded-full p-1 shadow hover:bg-red-100 z-10">×</button>
              <button type="button" onClick={() => handleChangeImage(idx)} className="absolute bottom-0 right-0 bg-white text-blue-500 rounded-full p-1 shadow hover:bg-blue-100 z-10 text-xs">Change</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 