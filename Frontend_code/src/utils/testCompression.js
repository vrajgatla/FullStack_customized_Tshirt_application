import { compressImage, getImageInfo, formatFileSize, calculateCompressionRatio } from './imageCompression';

export const testImageCompression = async (file) => {
  console.log('🧪 Testing Image Compression System');
  console.log('=====================================');
  
  try {
    // Get original image info
    console.log('📊 Original Image Info:');
    const originalInfo = await getImageInfo(file);
    console.log(`   - Dimensions: ${originalInfo.width} × ${originalInfo.height}`);
    console.log(`   - File Size: ${formatFileSize(originalInfo.size)}`);
    console.log(`   - Type: ${originalInfo.type}`);
    console.log(`   - Name: ${originalInfo.name}`);
    
    // Compress the image
    console.log('\n🔄 Compressing image...');
    const startTime = performance.now();
    const compressedFile = await compressImage(file);
    const endTime = performance.now();
    
    // Get compressed image info
    console.log('📊 Compressed Image Info:');
    const compressedInfo = await getImageInfo(compressedFile);
    console.log(`   - Dimensions: ${compressedInfo.width} × ${compressedInfo.height}`);
    console.log(`   - File Size: ${formatFileSize(compressedInfo.size)}`);
    console.log(`   - Type: ${compressedInfo.type}`);
    
    // Calculate compression statistics
    const compressionRatio = calculateCompressionRatio(originalInfo.size, compressedInfo.size);
    const compressionTime = (endTime - startTime).toFixed(2);
    
    console.log('\n📈 Compression Results:');
    console.log(`   - Compression Ratio: ${compressionRatio}%`);
    console.log(`   - Space Saved: ${formatFileSize(originalInfo.size - compressedInfo.size)}`);
    console.log(`   - Compression Time: ${compressionTime}ms`);
    
    // Performance assessment
    console.log('\n⚡ Performance Assessment:');
    if (compressionRatio > 50) {
      console.log('   ✅ Excellent compression (>50% reduction)');
    } else if (compressionRatio > 30) {
      console.log('   ✅ Good compression (>30% reduction)');
    } else if (compressionRatio > 10) {
      console.log('   ⚠️  Moderate compression (>10% reduction)');
    } else {
      console.log('   ❌ Low compression (<10% reduction)');
    }
    
    if (compressionTime < 1000) {
      console.log('   ✅ Fast compression (<1 second)');
    } else {
      console.log('   ⚠️  Slow compression (>1 second)');
    }
    
    console.log('\n🎯 Test completed successfully!');
    return {
      original: originalInfo,
      compressed: compressedInfo,
      ratio: compressionRatio,
      time: compressionTime
    };
    
  } catch (error) {
    console.error('❌ Compression test failed:', error);
    throw error;
  }
};

export const testThumbnailGeneration = async (file) => {
  console.log('🧪 Testing Thumbnail Generation');
  console.log('================================');
  
  try {
    const { generateThumbnail } = await import('./imageCompression');
    
    console.log('🔄 Generating thumbnail...');
    const startTime = performance.now();
    const thumbnail = await generateThumbnail(file, 200);
    const endTime = performance.now();
    
    const thumbnailInfo = await getImageInfo(thumbnail);
    const generationTime = (endTime - startTime).toFixed(2);
    
    console.log('📊 Thumbnail Info:');
    console.log(`   - Dimensions: ${thumbnailInfo.width} × ${thumbnailInfo.height}`);
    console.log(`   - File Size: ${formatFileSize(thumbnailInfo.size)}`);
    console.log(`   - Generation Time: ${generationTime}ms`);
    
    console.log('✅ Thumbnail generation completed!');
    return {
      thumbnail: thumbnailInfo,
      time: generationTime
    };
    
  } catch (error) {
    console.error('❌ Thumbnail generation test failed:', error);
    throw error;
  }
};

// Usage example:
// const testFile = event.target.files[0];
// await testImageCompression(testFile);
// await testThumbnailGeneration(testFile); 