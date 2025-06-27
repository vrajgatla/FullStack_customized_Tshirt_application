package com.customizedtrends.app.model;

import jakarta.persistence.*;

@Entity
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Tshirt tshirt;

    @ManyToOne(optional = false)
    private Design design;

    private Integer quantity;
    private Double price;

    public OrderItem() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Tshirt getTshirt() { return tshirt; }
    public void setTshirt(Tshirt tshirt) { this.tshirt = tshirt; }
    public Design getDesign() { return design; }
    public void setDesign(Design design) { this.design = design; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
} 