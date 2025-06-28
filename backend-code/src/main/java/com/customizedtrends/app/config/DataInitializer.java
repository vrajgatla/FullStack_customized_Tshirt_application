package com.customizedtrends.app.config;

import com.customizedtrends.app.model.*;
import com.customizedtrends.app.repository.*;
import com.customizedtrends.app.service.ImageCompressionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import javax.imageio.ImageIO;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BrandRepository brandRepository;
    
    @Autowired
    private ColorRepository colorRepository;
    
    @Autowired
    private TshirtRepository tshirtRepository;
    
    @Autowired
    private DesignRepository designRepository;
    
    @Autowired
    private ImageCompressionService imageCompressionService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) throws Exception {
        // Create admin users if they don't exist
        createAdminUser("admin1", "admin1@customtee.com", "admin123");
        createAdminUser("admin2", "admin2@customtee.com", "admin456");
        
        // Create sample brands
        createSampleBrands();
        
        // Create sample colors
        createSampleColors();
        
        // Create sample t-shirts
        createSampleTshirts();
        
        // Create sample designs
        createSampleDesigns();
        
        System.out.println("=== CustomTee Data Initialization Complete ===");
        System.out.println("Admin 1: admin1@customtee.com / admin123");
        System.out.println("Admin 2: admin2@customtee.com / admin456");
        System.out.println("Sample brands, colors, and t-shirts created");
        System.out.println("=============================================");
    }

    private void createAdminUser(String name, String email, String password) {
        if (!userRepository.findByEmail(email).isPresent()) {
            String hashedPassword = passwordEncoder.encode(password);
            User adminUser = new User(name, email, hashedPassword, User.UserRole.ADMIN);
            userRepository.save(adminUser);
            System.out.println("Created admin user: " + email);
        } else {
            System.out.println("Admin user already exists: " + email);
        }
    }
    
    private void createSampleBrands() {
        List<String> brandNames = Arrays.asList("Nike", "Adidas", "Puma", "Under Armour", "Hanes", "Gildan");
        
        for (String brandName : brandNames) {
            if (!brandRepository.findByName(brandName).isPresent()) {
                Brand brand = new Brand();
                brand.setName(brandName);
                brandRepository.save(brand);
                System.out.println("Created brand: " + brandName);
            }
        }
    }
    
    private void createSampleColors() {
        List<String> colorNames = Arrays.asList("White", "Black", "Navy", "Red", "Gray", "Green", "Yellow", "Pink");
        List<String> hexCodes = Arrays.asList("#FFFFFF", "#000000", "#000080", "#FF0000", "#808080", "#008000", "#FFFF00", "#FFC0CB");
        
        for (int i = 0; i < colorNames.size(); i++) {
            String colorName = colorNames.get(i);
            if (!colorRepository.findByName(colorName).isPresent()) {
                Color color = new Color();
                color.setName(colorName);
                color.setHexCode(hexCodes.get(i));
                colorRepository.save(color);
                System.out.println("Created color: " + colorName);
            }
        }
    }
    
    private void createSampleTshirts() {
        if (tshirtRepository.count() > 0) {
            System.out.println("T-shirts already exist, skipping sample creation");
            return;
        }
        
        List<Brand> brands = brandRepository.findAll();
        List<Color> colors = colorRepository.findAll();
        
        if (brands.isEmpty() || colors.isEmpty()) {
            System.out.println("No brands or colors found, skipping t-shirt creation");
            return;
        }
        
        // Create sample t-shirts
        String[] tshirtNames = {
            "Classic Cotton T-Shirt",
            "Premium Comfort Tee",
            "Sport Performance Shirt",
            "Casual Everyday Tee",
            "Fashion Forward T-Shirt",
            "Comfort Fit Cotton"
        };
        
        String[] descriptions = {
            "High-quality cotton t-shirt perfect for everyday wear",
            "Premium comfort with soft fabric and perfect fit",
            "Performance fabric for active lifestyle",
            "Casual and comfortable for daily use",
            "Trendy design with modern fit",
            "Comfortable fit with breathable cotton"
        };
        
        for (int i = 0; i < tshirtNames.length; i++) {
            Tshirt tshirt = new Tshirt();
            tshirt.setName(tshirtNames[i]);
            tshirt.setDescription(descriptions[i]);
            tshirt.setBrand(brands.get(i % brands.size()));
            tshirt.setColor(colors.get(i % colors.size()));
            tshirt.setSizes(Arrays.asList("S", "M", "L", "XL"));
            tshirt.setGender("Unisex");
            tshirt.setMaterial("100% Cotton");
            tshirt.setFit("Regular");
            tshirt.setSleeveType("Short Sleeve");
            tshirt.setNeckType("Crew Neck");
            tshirt.setPrice(19.99 + (i * 5.0)); // Varying prices
            tshirt.setStock(50);
            tshirt.setFeatured(i < 3); // First 3 are featured
            
            // Create a simple placeholder image (1x1 pixel PNG)
            byte[] placeholderImage = createPlaceholderImage();
            tshirt.setImageData(placeholderImage);
            tshirt.setImageType("image/png");
            
            tshirtRepository.save(tshirt);
            System.out.println("Created t-shirt: " + tshirtNames[i]);
        }
    }
    
    private byte[] createPlaceholderImage() {
        // Simple 1x1 transparent PNG
        return new byte[] {
            (byte) 0x89, (byte) 0x50, (byte) 0x4E, (byte) 0x47, (byte) 0x0D, (byte) 0x0A, (byte) 0x1A, (byte) 0x0A,
            (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x0D, (byte) 0x49, (byte) 0x48, (byte) 0x44, (byte) 0x52,
            (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x01, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x01,
            (byte) 0x08, (byte) 0x06, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x1F, (byte) 0x15, (byte) 0xC4,
            (byte) 0x89, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x0A, (byte) 0x49, (byte) 0x44, (byte) 0x41,
            (byte) 0x54, (byte) 0x78, (byte) 0x9C, (byte) 0x63, (byte) 0x00, (byte) 0x01, (byte) 0x00, (byte) 0x00,
            (byte) 0x05, (byte) 0x00, (byte) 0x01, (byte) 0x0D, (byte) 0x0A, (byte) 0x2D, (byte) 0xB4, (byte) 0x00,
            (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x49, (byte) 0x45, (byte) 0x4E, (byte) 0x44, (byte) 0xAE,
            (byte) 0x42, (byte) 0x60, (byte) 0x82
        };
    }
    
    private void createSampleDesigns() {
        if (designRepository.count() > 0) {
            System.out.println("Designs already exist, skipping sample creation");
            return;
        }
        
        String[] designNames = {
            "Abstract Geometric",
            "Vintage Retro",
            "Modern Minimalist",
            "Nature Inspired",
            "Urban Street Art",
            "Classic Stripes",
            "Bold Typography",
            "Floral Pattern"
        };
        
        String[] designTypes = {
            "Abstract", "Vintage", "Modern", "Nature", "Urban", "Classic", "Typography", "Floral"
        };
        
        String[] designThemes = {
            "Geometric", "Retro", "Minimalist", "Natural", "Street", "Traditional", "Modern", "Organic"
        };
        
        String[] designTags = {
            "abstract,geometric,modern", "vintage,retro,classic", "minimalist,clean,simple", 
            "nature,organic,peaceful", "urban,street,edgy", "classic,stripes,timeless", 
            "typography,bold,text", "floral,pattern,beautiful"
        };
        
        String[] descriptions = {
            "Abstract geometric patterns with modern appeal",
            "Vintage retro design with classic charm",
            "Minimalist modern design for clean aesthetics",
            "Nature-inspired organic patterns",
            "Urban street art style design",
            "Classic striped pattern design",
            "Bold typography with strong visual impact",
            "Beautiful floral pattern design"
        };
        
        for (int i = 0; i < designNames.length; i++) {
            Design design = new Design();
            design.setName(designNames[i]);
            design.setType(designTypes[i]);
            design.setTheme(designThemes[i]);
            design.setTags(designTags[i]);
            design.setUploadedBy("admin1");
            design.setDate(LocalDate.now());
            design.setDescription(descriptions[i]);
            
            // Create a sample design image
            byte[] designImage = createSampleDesignImage(designNames[i], i);
            design.setImageData(designImage);
            design.setImageType("image/png");
            design.setOriginalFileSize((long) designImage.length);
            design.setOriginalWidth(400);
            design.setOriginalHeight(400);
            
            // Compress the image
            try {
                byte[] compressedData = imageCompressionService.compressImage(designImage, "image/png");
                design.setImageData(compressedData);
                design.setCompressedFileSize((long) compressedData.length);
                
                // Calculate compression ratio
                if (design.getOriginalFileSize() != null && design.getOriginalFileSize() > 0) {
                    double ratio = (double) design.getCompressedFileSize() / design.getOriginalFileSize();
                    design.setCompressionRatio(String.format("%.2f%%", (1 - ratio) * 100));
                }
                
                // Generate thumbnail
                byte[] thumbnailData = imageCompressionService.generateThumbnail(compressedData, 200);
                design.setThumbnailData(thumbnailData);
                design.setThumbnailType("image/jpeg");
                
            } catch (Exception e) {
                System.out.println("Error processing design image: " + e.getMessage());
                // Use original image if compression fails
                design.setCompressedFileSize(design.getOriginalFileSize());
                design.setCompressionRatio("0.00%");
            }
            
            designRepository.save(design);
            System.out.println("Created design: " + designNames[i]);
        }
    }
    
    private byte[] createSampleDesignImage(String name, int index) {
        try {
            BufferedImage image = new BufferedImage(400, 400, BufferedImage.TYPE_INT_ARGB);
            Graphics2D g2d = image.createGraphics();
            
            // Set rendering hints for better quality
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
            
            // Create different designs based on index
            switch (index % 8) {
                case 0: // Abstract Geometric
                    g2d.setColor(new java.awt.Color(255, 100, 100));
                    g2d.fillRect(50, 50, 300, 300);
                    g2d.setColor(new java.awt.Color(100, 100, 255));
                    g2d.fillOval(100, 100, 200, 200);
                    g2d.setColor(new java.awt.Color(100, 255, 100));
                    g2d.fillPolygon(new int[]{200, 300, 100}, new int[]{100, 300, 300}, 3);
                    break;
                case 1: // Vintage Retro
                    g2d.setColor(new java.awt.Color(255, 200, 100));
                    g2d.fillRect(0, 0, 400, 400);
                    g2d.setColor(new java.awt.Color(150, 100, 50));
                    for (int i = 0; i < 10; i++) {
                        g2d.drawLine(0, i * 40, 400, i * 40);
                    }
                    break;
                case 2: // Modern Minimalist
                    g2d.setColor(new java.awt.Color(240, 240, 240));
                    g2d.fillRect(0, 0, 400, 400);
                    g2d.setColor(new java.awt.Color(50, 50, 50));
                    g2d.fillRect(150, 100, 100, 200);
                    g2d.fillRect(100, 150, 200, 100);
                    break;
                case 3: // Nature Inspired
                    g2d.setColor(new java.awt.Color(100, 200, 100));
                    g2d.fillOval(100, 100, 200, 200);
                    g2d.setColor(new java.awt.Color(50, 150, 50));
                    g2d.fillOval(150, 150, 100, 100);
                    g2d.setColor(new java.awt.Color(200, 255, 200));
                    g2d.fillOval(200, 200, 50, 50);
                    break;
                case 4: // Urban Street Art
                    g2d.setColor(new java.awt.Color(255, 255, 0));
                    g2d.fillRect(0, 0, 400, 400);
                    g2d.setColor(new java.awt.Color(255, 0, 255));
                    g2d.fillRect(50, 50, 300, 300);
                    g2d.setColor(new java.awt.Color(0, 255, 255));
                    g2d.fillOval(100, 100, 200, 200);
                    break;
                case 5: // Classic Stripes
                    g2d.setColor(new java.awt.Color(255, 255, 255));
                    g2d.fillRect(0, 0, 400, 400);
                    g2d.setColor(new java.awt.Color(0, 0, 255));
                    for (int i = 0; i < 20; i++) {
                        g2d.fillRect(i * 20, 0, 10, 400);
                    }
                    break;
                case 6: // Bold Typography
                    g2d.setColor(new java.awt.Color(0, 0, 0));
                    g2d.fillRect(0, 0, 400, 400);
                    g2d.setColor(new java.awt.Color(255, 255, 255));
                    g2d.setFont(new java.awt.Font("Arial", java.awt.Font.BOLD, 48));
                    g2d.drawString("DESIGN", 100, 200);
                    break;
                case 7: // Floral Pattern
                    g2d.setColor(new java.awt.Color(255, 192, 203));
                    g2d.fillRect(0, 0, 400, 400);
                    g2d.setColor(new java.awt.Color(255, 20, 147));
                    for (int i = 0; i < 8; i++) {
                        int x = 200 + (int)(150 * Math.cos(i * Math.PI / 4));
                        int y = 200 + (int)(150 * Math.sin(i * Math.PI / 4));
                        g2d.fillOval(x - 30, y - 30, 60, 60);
                    }
                    break;
            }
            
            g2d.dispose();
            
            // Convert to byte array
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", baos);
            return baos.toByteArray();
            
        } catch (Exception e) {
            System.out.println("Error creating sample design image: " + e.getMessage());
            return createPlaceholderImage();
        }
    }
} 