package com.customizedtrends.app.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Iterator;

@Service
public class ImageCompressionService {

    private static final int MAX_WIDTH = 1200;
    private static final int MAX_HEIGHT = 1200;
    private static final float COMPRESSION_QUALITY = 0.8f;
    private static final int MAX_FILE_SIZE_KB = 500; // 500KB max

    public byte[] compressImage(MultipartFile file) throws IOException {
        return compressImage(file.getBytes(), file.getContentType());
    }

    public byte[] compressImage(byte[] imageData, String contentType) throws IOException {
        BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(imageData));
        
        if (originalImage == null) {
            throw new IOException("Unable to read image data");
        }

        // Resize if necessary
        BufferedImage resizedImage = resizeImage(originalImage);
        
        // Compress based on content type
        String format = getImageFormat(contentType);
        return compressImageToBytes(resizedImage, format);
    }

    private BufferedImage resizeImage(BufferedImage originalImage) {
        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();

        // Check if resizing is needed
        if (originalWidth <= MAX_WIDTH && originalHeight <= MAX_HEIGHT) {
            return originalImage;
        }

        // Calculate new dimensions maintaining aspect ratio
        double scale = Math.min(
            (double) MAX_WIDTH / originalWidth,
            (double) MAX_HEIGHT / originalHeight
        );

        int newWidth = (int) (originalWidth * scale);
        int newHeight = (int) (originalHeight * scale);

        // Create resized image
        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = resizedImage.createGraphics();
        
        // Set rendering hints for better quality
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        
        g2d.drawImage(originalImage, 0, 0, newWidth, newHeight, null);
        g2d.dispose();

        return resizedImage;
    }

    private byte[] compressImageToBytes(BufferedImage image, String format) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        if ("JPEG".equalsIgnoreCase(format) || "JPG".equalsIgnoreCase(format)) {
            // Use JPEG compression with quality setting
            Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpeg");
            if (writers.hasNext()) {
                ImageWriter writer = writers.next();
                ImageWriteParam param = writer.getDefaultWriteParam();
                param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                param.setCompressionQuality(COMPRESSION_QUALITY);
                
                ImageOutputStream ios = ImageIO.createImageOutputStream(outputStream);
                writer.setOutput(ios);
                writer.write(null, new IIOImage(image, null, null), param);
                writer.dispose();
                ios.close();
            } else {
                ImageIO.write(image, "jpeg", outputStream);
            }
        } else if ("PNG".equalsIgnoreCase(format)) {
            // PNG compression
            ImageIO.write(image, "png", outputStream);
        } else if ("WEBP".equalsIgnoreCase(format)) {
            // WebP compression (if supported)
            try {
                ImageIO.write(image, "webp", outputStream);
            } catch (Exception e) {
                // Fallback to PNG if WebP is not supported
                ImageIO.write(image, "png", outputStream);
            }
        } else {
            // Default to JPEG
            ImageIO.write(image, "jpeg", outputStream);
        }

        byte[] compressedData = outputStream.toByteArray();
        
        // If still too large, reduce quality further
        if (compressedData.length > MAX_FILE_SIZE_KB * 1024) {
            return compressWithLowerQuality(image, format);
        }

        return compressedData;
    }

    private byte[] compressWithLowerQuality(BufferedImage image, String format) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        if ("JPEG".equalsIgnoreCase(format) || "JPG".equalsIgnoreCase(format)) {
            Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpeg");
            if (writers.hasNext()) {
                ImageWriter writer = writers.next();
                ImageWriteParam param = writer.getDefaultWriteParam();
                param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                param.setCompressionQuality(0.5f); // Lower quality
                
                ImageOutputStream ios = ImageIO.createImageOutputStream(outputStream);
                writer.setOutput(ios);
                writer.write(null, new IIOImage(image, null, null), param);
                writer.dispose();
                ios.close();
            } else {
                ImageIO.write(image, "jpeg", outputStream);
            }
        } else {
            ImageIO.write(image, "jpeg", outputStream);
        }

        return outputStream.toByteArray();
    }

    private String getImageFormat(String contentType) {
        if (contentType == null) {
            return "JPEG";
        }
        
        if (contentType.contains("jpeg") || contentType.contains("jpg")) {
            return "JPEG";
        } else if (contentType.contains("png")) {
            return "PNG";
        } else if (contentType.contains("webp")) {
            return "WEBP";
        } else {
            return "JPEG"; // Default
        }
    }

    public String getCompressedContentType(String originalContentType) {
        String format = getImageFormat(originalContentType);
        switch (format.toUpperCase()) {
            case "PNG":
                return "image/png";
            case "WEBP":
                return "image/webp";
            case "JPEG":
            default:
                return "image/jpeg";
        }
    }

    public byte[] generateThumbnail(byte[] imageData, int thumbnailSize) throws IOException {
        BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(imageData));
        
        if (originalImage == null) {
            throw new IOException("Unable to read image data");
        }

        // Calculate thumbnail dimensions maintaining aspect ratio
        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();
        
        double scale = Math.min(
            (double) thumbnailSize / originalWidth,
            (double) thumbnailSize / originalHeight
        );

        int newWidth = (int) (originalWidth * scale);
        int newHeight = (int) (originalHeight * scale);

        // Create thumbnail
        BufferedImage thumbnail = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = thumbnail.createGraphics();
        
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        
        g2d.drawImage(originalImage, 0, 0, newWidth, newHeight, null);
        g2d.dispose();

        // Convert to bytes
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(thumbnail, "jpeg", outputStream);
        return outputStream.toByteArray();
    }
}
