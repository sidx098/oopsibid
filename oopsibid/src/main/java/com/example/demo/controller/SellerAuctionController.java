package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Auction;
import com.example.demo.repository.AuctionRepository;

@RestController
@RequestMapping("/api/seller/auctions")
public class SellerAuctionController {

    private final AuctionRepository auctionRepository;

    public SellerAuctionController(
            AuctionRepository auctionRepository) {

        this.auctionRepository =
                auctionRepository;
    }


    // ==========================================
    // GET MY AUCTIONS
    // ==========================================

    @GetMapping
    public ResponseEntity<?> getMyAuctions(
            Authentication authentication) {

        if (authentication == null ||
            !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(401)
                    .body("Login required");
        }

        String sellerId =
                authentication.getName();

        List<Auction> auctions =
                auctionRepository.findBySellerId(
                        sellerId
                );

        return ResponseEntity.ok(
                auctions
        );
    }
}