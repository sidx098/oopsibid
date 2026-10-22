package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.AuctionRequest;
import com.example.demo.model.Auction;
import com.example.demo.repository.AuctionRepository;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    private final AuctionRepository auctionRepository;

    public AuctionController(AuctionRepository auctionRepository) {
        this.auctionRepository = auctionRepository;
    }

    // ==========================================
    // CREATE AUCTION
    // ==========================================

    @PostMapping
    public ResponseEntity<?> createAuction(
            @RequestBody AuctionRequest request,
            Authentication authentication) {

        try {

            // ------------------------------------------
            // CHECK LOGIN
            // ------------------------------------------

            if (authentication == null ||
                !authentication.isAuthenticated()) {

                return ResponseEntity.status(401)
                        .body("Login required");
            }

            // ------------------------------------------
            // GET SELLER FROM JWT
            // ------------------------------------------

            String sellerId =
                    authentication.getName();

            if (sellerId == null ||
                sellerId.trim().isEmpty()) {

                return ResponseEntity.status(401)
                        .body("Unable to identify seller");
            }

            // ------------------------------------------
            // PRODUCT VALIDATION
            // ------------------------------------------

            if (request.getProductId() == null ||
                request.getProductId().trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body("Product ID is required");
            }

            // ------------------------------------------
            // STARTING PRICE
            // ------------------------------------------

            if (request.getStartingPrice() <= 0) {

                return ResponseEntity.badRequest()
                        .body(
                            "Starting price must be greater than 0"
                        );
            }

            // ------------------------------------------
            // TIME
            // ------------------------------------------

            LocalDateTime startTime =
                    LocalDateTime.now();

            LocalDateTime endTime =
                    startTime.plusHours(24);

            // ------------------------------------------
            // CREATE AUCTION
            // ------------------------------------------

            Auction auction =
                    new Auction();

            auction.setProductId(
                    request.getProductId().trim()
            );

            auction.setSellerId(
                    sellerId
            );

            auction.setStartingPrice(
                    request.getStartingPrice()
            );

            auction.setStartTime(
                    startTime
            );

            auction.setEndTime(
                    endTime
            );

            // IMPORTANT:
            // Admin must approve the auction first

            auction.setStatus(
                    "PENDING"
            );

            auction.setWinnerId(null);

            auction.setWinningBid(null);

            // ------------------------------------------
            // SAVE
            // ------------------------------------------

            Auction savedAuction =
                    auctionRepository.save(auction);

            return ResponseEntity.ok(
                    savedAuction
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Unable to create auction: "
                        + e.getMessage()
                    );
        }
    }


    // ==========================================
    // GET ALL AUCTIONS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Auction>>
            getAllAuctions() {

        return ResponseEntity.ok(
                auctionRepository.findAll()
        );
    }


    // ==========================================
    // GET ACTIVE AUCTIONS
    // ==========================================

    @GetMapping("/active")
    public ResponseEntity<List<Auction>>
            getActiveAuctions() {

        return ResponseEntity.ok(
                auctionRepository.findByStatus(
                        "ACTIVE"
                )
        );
    }


    // ==========================================
    // GET AUCTION BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getAuction(
            @PathVariable String id) {

        return auctionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                    ResponseEntity.notFound().build()
                );
    }
}