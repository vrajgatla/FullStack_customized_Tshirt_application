import imageCompression from 'browser-image-compression';

export const compressImage = async (file, options = {}) => {
  const defaultOptions = {
    maxSizeMB: 0.5, // 500KB
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: 'image/jpeg',
    quality: 0.8,
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
  const options = {
    maxSizeMB: 0.1, // 100KB
    maxWidthOrHeight: maxWidth,
    useWebWorker: true,
    fileType: 'image/jpeg',
    quality: 0.7,
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