package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dto.ProductRequest;
import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;


    public ProductService(
            ProductRepository productRepository) {

        this.productRepository =
                productRepository;
    }


    // =========================
    // CREATE PRODUCT
    // =========================

    public Product createProduct(
            ProductRequest request,
            String sellerId) {


        // =========================
        // SELLER VALIDATION
        // =========================

        if (sellerId == null ||
            sellerId.trim().isEmpty()) {

            throw new RuntimeException(
                    "Seller ID is required"
            );
        }


        // =========================
        // PRODUCT NAME
        // =========================

        if (request.getName() == null ||
            request.getName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Product name is required"
            );
        }


        // =========================
        // DESCRIPTION
        // =========================

        if (request.getDescription() == null ||
            request.getDescription().trim().isEmpty()) {

            throw new RuntimeException(
                    "Product description is required"
            );
        }


        // =========================
        // CATEGORY
        // =========================

        if (request.getCategory() == null ||
            request.getCategory().trim().isEmpty()) {

            throw new RuntimeException(
                    "Product category is required"
            );
        }


        // =========================
        // CONDITION
        // =========================

        if (request.getCondition() == null ||
            request.getCondition().trim().isEmpty()) {

            throw new RuntimeException(
                    "Product condition is required"
            );
        }


        // =========================
        // CREATE PRODUCT
        // =========================

        Product product =
                new Product();


        product.setSellerId(
                sellerId.trim()
        );


        product.setName(
                request.getName().trim()
        );


        product.setDescription(
                request.getDescription().trim()
        );


        product.setCategory(
                request.getCategory().trim()
        );


        product.setImages(
                request.getImages()
        );


        product.setCondition(
                request.getCondition().trim()
        );


        // =========================
        // ADMIN REVIEW
        // =========================

        product.setStatus(
                "PENDING"
        );


        // =========================
        // TIMESTAMPS
        // =========================

        product.setCreatedAt(
                LocalDateTime.now()
        );


        product.setUpdatedAt(
                LocalDateTime.now()
        );


        return productRepository.save(
                product
        );
    }


    // =========================
    // GET ALL PRODUCTS
    // =========================

    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }
    
    // =========================
    // GET SELLER PRODUCTS
    // =========================

    public List<Product> getSellerProducts(
            String sellerId) {

        return productRepository.findBySellerId(
                sellerId
        );
    }


    // =========================
    // GET APPROVED PRODUCTS
    // =========================

    public List<Product> getApprovedProducts() {

        return productRepository.findByStatus(
                "APPROVED"
        );
    }
    
    public Optional<Product> getProductById(String id) {

        return productRepository.findById(id);
    }

    
}