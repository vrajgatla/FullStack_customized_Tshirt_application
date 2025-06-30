package com.customizedtrends.app.config;

import com.customizedtrends.app.model.*;
import com.customizedtrends.app.repository.*;
import com.customizedtrends.app.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

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
    private CloudinaryService cloudinaryService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Starting data initialization...");
        
        // Create admin users
        createAdminUser("Admin User", "admin@example.com", "admin123");
        createAdminUser("Admin User 2", "admin2@example.com", "admin123");
        
        // Create sample brands
        createSampleBrands();
        
        // Create sample colors
        createSampleColors();
        
        // Create sample t-shirts
        createSampleTshirts();
        
        // Create sample designs
        createSampleDesigns();
        
        System.out.println("Data initialization completed!");
    }

    private void createAdminUser(String name, String email, String password) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(User.UserRole.ADMIN);
            userRepository.save(user);
            System.out.println("Created admin user: " + email);
        }
    }

    private void createSampleBrands() {
        if (brandRepository.count() > 0) {
            System.out.println("Brands already exist, skipping sample creation");
            return;
        }
        
        String[] brandNames = {"Nike", "Adidas", "Puma", "Under Armour", "Reebok"};
        
        for (int i = 0; i < brandNames.length; i++) {
            Brand brand = new Brand();
            brand.setName(brandNames[i]);
            brandRepository.save(brand);
            System.out.println("Created brand: " + brandNames[i]);
        }
    }

    private void createSampleColors() {
        if (colorRepository.count() > 0) {
            System.out.println("Colors already exist, skipping sample creation");
            return;
        }
        
        String[] colorNames = {"Black", "White", "Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Gray"};
        String[] hexCodes = {"#000000", "#FFFFFF", "#FF0000", "#0000FF", "#00FF00", "#FFFF00", "#800080", "#FFA500", "#FFC0CB", "#808080"};
        
        for (int i = 0; i < colorNames.length; i++) {
            Color color = new Color();
            color.setName(colorNames[i]);
            color.setHexCode(hexCodes[i]);
            colorRepository.save(color);
            System.out.println("Created color: " + colorNames[i]);
        }
    }

    private void createSampleTshirts() {
        if (tshirtRepository.count() > 0) {
            System.out.println("T-shirts already exist, skipping sample creation");
            return;
        }
        
        Brand nike = brandRepository.findByName("Nike").orElse(null);
        Brand adidas = brandRepository.findByName("Adidas").orElse(null);
        Color black = colorRepository.findByName("Black").orElse(null);
        Color white = colorRepository.findByName("White").orElse(null);
        Color red = colorRepository.findByName("Red").orElse(null);
        
        if (nike == null || adidas == null || black == null || white == null || red == null) {
            System.out.println("Required brands or colors not found, skipping t-shirt creation");
            return;
        }
        
        String[] tshirtNames = {
            "Nike Classic Black", "Nike Classic White", "Adidas Sport Red", 
            "Adidas Casual Black", "Nike Premium White"
        };
        
        Brand[] brands = {nike, nike, adidas, adidas, nike};
        Color[] colors = {black, white, red, black, white};
        String[] genders = {"Men", "Women", "Men", "Unisex", "Men"};
        
        for (int i = 0; i < tshirtNames.length; i++) {
            Tshirt tshirt = new Tshirt();
            tshirt.setName(tshirtNames[i]);
            tshirt.setBrand(brands[i]);
            tshirt.setColor(colors[i]);
            tshirt.setSizes(java.util.List.of("S", "M", "L", "XL"));
            tshirt.setGender(genders[i]);
            tshirt.setMaterial("Cotton");
            tshirt.setFit("Regular");
            tshirt.setSleeveType("Short Sleeve");
            tshirt.setNeckType("Crew Neck");
            tshirt.setPrice(19.99 + (i * 5.0)); // Varying prices
            tshirt.setStock(50);
            tshirt.setFeatured(i < 3); // First 3 are featured
            
            // Set placeholder Cloudinary URLs
            tshirt.setImageUrl("https://res.cloudinary.com/dbanspk1d/image/upload/v1/placeholder-tshirt.jpg");
            tshirt.setThumbnailUrl("https://res.cloudinary.com/dbanspk1d/image/upload/c_thumb,w_200,h_200/v1/placeholder-tshirt.jpg");
            tshirt.setOptimizedUrl("https://res.cloudinary.com/dbanspk1d/image/upload/f_auto,q_auto/v1/placeholder-tshirt.jpg");
            
            tshirtRepository.save(tshirt);
            System.out.println("Created t-shirt: " + tshirtNames[i]);
        }
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
            
            // Set placeholder Cloudinary URLs
            design.setImageUrl("https://res.cloudinary.com/dbanspk1d/image/upload/v1/placeholder-design-" + (i + 1) + ".jpg");
            design.setThumbnailUrl("https://res.cloudinary.com/dbanspk1d/image/upload/c_thumb,w_200,h_200/v1/placeholder-design-" + (i + 1) + ".jpg");
            design.setOptimizedUrl("https://res.cloudinary.com/dbanspk1d/image/upload/f_auto,q_auto/v1/placeholder-design-" + (i + 1) + ".jpg");
            design.setImageType("image/jpeg");
            
            // Set placeholder metadata
            design.setOriginalFileSize(102400L); // 100KB placeholder
            design.setCompressedFileSize(51200L); // 50KB placeholder
            design.setOriginalWidth(400);
            design.setOriginalHeight(400);
            design.setCompressedWidth(400);
            design.setCompressedHeight(400);
            design.setCompressionRatio("50.00%");
            
            designRepository.save(design);
            System.out.println("Created design: " + designNames[i]);
        }
    }
} 