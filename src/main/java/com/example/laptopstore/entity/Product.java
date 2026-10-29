package com.example.laptopstore.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(precision = 12, scale = 2)
    private BigDecimal price;

    private BigDecimal discountPrice;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;
    private Integer stockQuantity;

    private String cpu;
    private String ram;
    private String storage;
    private String gpu;
    private String screenSize;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}