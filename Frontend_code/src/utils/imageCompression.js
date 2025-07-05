import imageCompression from 'browser-image-compression';

export const compressImage = async (file, options = {}) => {
  // Detect if the file is PNG to preserve transparency
  const isPng = file.type === 'image/png';
  
  const defaultOptions = {
    maxSizeMB: 0.5, // 500KB
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: isPng ? 'image/png' : 'image/jpeg', // Preserve PNG format for transparency
    quality: isPng ? 0.9 : 0.8, // Higher quality for PNG to preserve transparency
    ...options
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    throw error;
  }
};

export const generateThumbnail = async (file, maxWidth = 200) => {
  // Detect if the file is PNG to preserve transparency
  const isPng = file.type === 'image/png';
  
  const options = {
    maxSizeMB: 0.1, // 100KB
    maxWidthOrHeight: maxWidth,
    useWebWorker: true,
    fileType: isPng ? 'image/png' : 'image/jpeg', // Preserve PNG format for transparency
    quality: isPng ? 0.9 : 0.7, // Higher quality for PNG to preserve transparency
  };

  try {
    const thumbnail = await imageCompression(file, options);
    return thumbnail;
  } catch (error) {
    console.error('Thumbnail generation failed:', error);
    throw error;
  }
};

export const getImageInfo = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        size: file.size,
        type: file.type,
        name: file.name
      });
    };
    img.src = URL.createObjectURL(file);
  });
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const calculateCompressionRatio = (originalSize, compressedSize) => {
  if (originalSize === 0) return 0;
  const ratio = ((originalSize - compressedSize) / originalSize) * 100;
  return Math.round(ratio * 100) / 100; // Round to 2 decimal places
};

export const createImagePreview = (file) => {
  return URL.createObjectURL(file);
};

// Utility function to create a stable image URL with cache busting
export const createStableImageUrl = (baseUrl, id, timestamp = null) => {
  if (!baseUrl || !id) return '';
  
  // Add a cache parameter to help with caching
  const cacheParam = timestamp ? `?t=${timestamp}` : `?v=${id}`;
  return `${baseUrl}${cacheParam}`;
};

// Utility function to preload images
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Utility function to batch preload images
export const preloadImages = async (imageUrls) => {
  const promises = imageUrls.map(url => preloadImage(url).catch(() => null));
  return Promise.all(promises);
};

export const downloadImage = (dataUrl, filename) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const convertToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Utility function to detect if an image has transparency
export const hasTransparency = (file) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 255) { // Alpha channel less than 255 means transparency
          resolve(true);
          return;
        }
      }
      resolve(false);
    };
    
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
};

// Utility function to preserve transparency when compressing
export const compressImagePreservingTransparency = async (file, options = {}) => {
  const hasTransparentPixels = await hasTransparency(file);
  
  if (hasTransparentPixels && file.type !== 'image/png') {
    // If image has transparency but isn't PNG, convert to PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          const pngFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.png'), {
            type: 'image/png'
          });
          resolve(compressImage(pngFile, options));
        }, 'image/png');
      };
      img.src = URL.createObjectURL(file);
    });
  }
  
  return compressImage(file, options);
}; 