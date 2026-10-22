package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Auction;
import com.example.demo.repository.AuctionRepository;

@RestController
@RequestMapping("/api/admin/auctions")
public class AdminAuctionController {

    private final AuctionRepository auctionRepository;

    public AdminAuctionController(
            AuctionRepository auctionRepository) {

        this.auctionRepository = auctionRepository;
    }


    // =========================
    // GET ALL AUCTIONS
    // =========================

    @GetMapping
    public ResponseEntity<List<Auction>> getAllAuctions() {

        return ResponseEntity.ok(
                auctionRepository.findAll()
        );
    }


    // =========================
    // APPROVE AUCTION
    // =========================

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveAuction(
            @PathVariable String id) {

        return auctionRepository.findById(id)

                .map(auction -> {

                    /*
                     * IMPORTANT:
                     *
                     * APPROVED auctions become ACTIVE.
                     *
                     * ACTIVE means:
                     * - Buyer can see the auction
                     * - Buyer can place a bid
                     */
                    auction.setStatus("ACTIVE");

                    return ResponseEntity.ok(
                            auctionRepository.save(auction)
                    );

                })

                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =========================
    // REJECT AUCTION
    // =========================

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectAuction(
            @PathVariable String id) {

        return auctionRepository.findById(id)

                .map(auction -> {

                    auction.setStatus("REJECTED");

                    return ResponseEntity.ok(
                            auctionRepository.save(auction)
                    );

                })

                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =========================
    // STOP AUCTION
    // =========================

    @PutMapping("/{id}/stop")
    public ResponseEntity<?> stopAuction(
            @PathVariable String id) {

        return auctionRepository.findById(id)

                .map(auction -> {

                    auction.setStatus("STOPPED");

                    return ResponseEntity.ok(
                            auctionRepository.save(auction)
                    );

                })

                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =========================
    // DELETE AUCTION
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAuction(
            @PathVariable String id) {

        if (!auctionRepository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        auctionRepository.deleteById(id);

        return ResponseEntity.ok(
                "Auction deleted successfully"
        );
    }
}