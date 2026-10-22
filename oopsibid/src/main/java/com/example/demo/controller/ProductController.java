package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.ProductRequest;
import com.example.demo.model.Product;
import com.example.demo.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // =========================
    // CREATE PRODUCT
    // =========================

    @PostMapping
    public ResponseEntity<?> createProduct(
            @RequestBody ProductRequest request,
            Authentication authentication) {

        try {

            // =========================
            // CHECK LOGIN
            // =========================

            if (authentication == null ||
                !authentication.isAuthenticated()) {

                return ResponseEntity.status(401)
                        .body("Seller login required");
            }

            // JWT subject = user's email
            String sellerId =
                    authentication.getName();

            // =========================
            // CHECK SELLER ROLE
            // =========================

            boolean isSeller =
                    authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                            authority.getAuthority()
                                .equals("ROLE_SELLER")
                        );

            if (!isSeller) {

                return ResponseEntity.status(403)
                        .body(
                            "Access denied. Only sellers can create products."
                        );
            }

            // =========================
            // CREATE PRODUCT
            // =========================

            Product product =
                    productService.createProduct(
                        request,
                        sellerId
                    );

            return ResponseEntity.ok(product);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body("Unable to create product");
        }
    }


    // =========================
    // GET ALL PRODUCTS
    // =========================

    @GetMapping
    public ResponseEntity<List<Product>> getProducts() {

        return ResponseEntity.ok(
            productService.getAllProducts()
        );
    }


    // =========================
    // GET APPROVED PRODUCTS
    // =========================

    @GetMapping("/approved")
    public ResponseEntity<List<Product>> getApprovedProducts() {

        return ResponseEntity.ok(
            productService.getApprovedProducts()
        );
    }


    // =========================
    // GET SELLER PRODUCTS
    // =========================

    @GetMapping("/seller")
    public ResponseEntity<?> getSellerProducts(
            Authentication authentication) {

        try {

            if (authentication == null ||
                !authentication.isAuthenticated()) {

                return ResponseEntity.status(401)
                        .body("Seller login required");
            }

            boolean isSeller =
                    authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                            authority.getAuthority()
                                .equals("ROLE_SELLER")
                        );

            if (!isSeller) {

                return ResponseEntity.status(403)
                        .body(
                            "Access denied. Only sellers can view seller products."
                        );
            }

            String sellerId =
                    authentication.getName();

            return ResponseEntity.ok(
                productService.getSellerProducts(
                    sellerId
                )
            );

        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body("Unable to load seller products");
        }
        
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(
            @PathVariable String id) {

        Optional<Product> product =
                productService.getProductById(id);

        if (product.isPresent()) {
            return ResponseEntity.ok(product.get());
        }

        return ResponseEntity.notFound().build();
    }
}