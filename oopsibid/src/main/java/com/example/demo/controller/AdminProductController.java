package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductRepository productRepository;


    public AdminProductController(
            ProductRepository productRepository) {

        this.productRepository =
                productRepository;
    }


    // =========================
    // GET ALL PRODUCTS
    // =========================

    @GetMapping
    public ResponseEntity<?> getAllProducts() {

        try {

            List<Product> products =
                    productRepository.findAll();

            return ResponseEntity.ok(
                    products
            );

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Unable to load products."
                    );
        }
    }


    // =========================
    // APPROVE PRODUCT
    // =========================

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveProduct(
            @PathVariable String id) {

        try {

            Product product =
                    productRepository
                    .findById(id)
                    .orElseThrow(() ->
                        new RuntimeException(
                            "Product not found."
                        )
                    );


            product.setStatus(
                    "APPROVED"
            );


            product.setUpdatedAt(
                    LocalDateTime.now()
            );


            productRepository.save(
                    product
            );


            return ResponseEntity.ok(
                    "Product approved successfully."
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                        e.getMessage()
                    );
        }
    }


    // =========================
    // REJECT PRODUCT
    // =========================

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectProduct(
            @PathVariable String id) {

        try {

            Product product =
                    productRepository
                    .findById(id)
                    .orElseThrow(() ->
                        new RuntimeException(
                            "Product not found."
                        )
                    );


            product.setStatus(
                    "REJECTED"
            );


            product.setUpdatedAt(
                    LocalDateTime.now()
            );


            productRepository.save(
                    product
            );


            return ResponseEntity.ok(
                    "Product rejected successfully."
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                        e.getMessage()
                    );
        }
    }


    // =========================
    // DELETE PRODUCT
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable String id) {

        try {

            if (!productRepository
                    .existsById(id)) {

                return ResponseEntity
                        .badRequest()
                        .body(
                            "Product not found."
                        );
            }


            productRepository.deleteById(
                    id
            );


            return ResponseEntity.ok(
                    "Product deleted successfully."
            );

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Unable to delete product."
                    );
        }
    }
}