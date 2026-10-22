package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Bid;
import com.example.demo.repository.BidRepository;

@RestController
@RequestMapping("/api/admin/bids")
public class AdminBidController {

    private final BidRepository bidRepository;

    public AdminBidController(
            BidRepository bidRepository) {

        this.bidRepository = bidRepository;
    }


    // =========================
    // GET ALL BIDS
    // =========================

    @GetMapping
    public ResponseEntity<?> getAllBids() {

        try {

            List<Bid> bids =
                    bidRepository.findAll();

            return ResponseEntity.ok(bids);

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Unable to load bids: "
                        + e.getMessage()
                    );
        }
    }


    // =========================
    // GET BID BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<?> getBid(
            @PathVariable String id) {

        return bidRepository.findById(id)

                .map(bid ->
                    ResponseEntity.ok(bid)
                )

                .orElse(
                    ResponseEntity
                        .notFound()
                        .build()
                );
    }


    // =========================
    // BLOCK BID
    // =========================

    @PutMapping("/{id}/block")
    public ResponseEntity<?> blockBid(
            @PathVariable String id) {

        return bidRepository.findById(id)

                .map(bid -> {

                    bid.setStatus("BLOCKED");

                    Bid updatedBid =
                            bidRepository.save(bid);

                    return ResponseEntity.ok(
                            updatedBid
                    );

                })

                .orElse(
                    ResponseEntity
                        .notFound()
                        .build()
                );
    }


    // =========================
    // UNBLOCK BID
    // =========================

    @PutMapping("/{id}/unblock")
    public ResponseEntity<?> unblockBid(
            @PathVariable String id) {

        return bidRepository.findById(id)

                .map(bid -> {

                    bid.setStatus("ACTIVE");

                    Bid updatedBid =
                            bidRepository.save(bid);

                    return ResponseEntity.ok(
                            updatedBid
                    );

                })

                .orElse(
                    ResponseEntity
                        .notFound()
                        .build()
                );
    }


    // =========================
    // DELETE BID
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBid(
            @PathVariable String id) {

        if (!bidRepository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        bidRepository.deleteById(id);

        return ResponseEntity.ok(
                "Bid deleted successfully"
        );
    }
}