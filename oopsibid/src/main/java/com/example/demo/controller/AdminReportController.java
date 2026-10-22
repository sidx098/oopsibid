package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Auction;
import com.example.demo.model.Bid;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.AuctionRepository;
import com.example.demo.repository.BidRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/admin/reports")
public class AdminReportController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;

    public AdminReportController(
            UserRepository userRepository,
            ProductRepository productRepository,
            AuctionRepository auctionRepository,
            BidRepository bidRepository) {

        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.auctionRepository = auctionRepository;
        this.bidRepository = bidRepository;
    }


    // =========================
    // PLATFORM REPORT
    // =========================

    @GetMapping
    public ResponseEntity<?> getReport() {

        try {

            List<User> users =
                    userRepository.findAll();

            List<Product> products =
                    productRepository.findAll();

            List<Auction> auctions =
                    auctionRepository.findAll();

            List<Bid> bids =
                    bidRepository.findAll();


            // =========================
            // USER COUNTS
            // =========================

            long totalUsers =
                    users.size();

            long totalBuyers =
                    users.stream()
                            .filter(user ->
                                "BUYER".equalsIgnoreCase(
                                    user.getRole()
                                ))
                            .count();

            long totalSellers =
                    users.stream()
                            .filter(user ->
                                "SELLER".equalsIgnoreCase(
                                    user.getRole()
                                ))
                            .count();

            long blockedUsers =
                    users.stream()
                            .filter(user ->
                                "BLOCKED".equalsIgnoreCase(
                                    user.getStatus()
                                ))
                            .count();


            // =========================
            // PRODUCT COUNTS
            // =========================

            long totalProducts =
                    products.size();

            long activeProducts =
                    products.stream()
                            .filter(product ->
                                "ACTIVE".equalsIgnoreCase(
                                    product.getStatus()
                                ))
                            .count();


            // =========================
            // AUCTION COUNTS
            // =========================

            long totalAuctions =
                    auctions.size();

            long activeAuctions =
                    auctions.stream()
                            .filter(auction ->
                                "ACTIVE".equalsIgnoreCase(
                                    auction.getStatus()
                                ))
                            .count();

            long pendingAuctions =
                    auctions.stream()
                            .filter(auction ->
                                "PENDING".equalsIgnoreCase(
                                    auction.getStatus()
                                ))
                            .count();

            long completedAuctions =
                    auctions.stream()
                            .filter(auction ->
                                "COMPLETED".equalsIgnoreCase(
                                    auction.getStatus()
                                ))
                            .count();


            // =========================
            // BID COUNTS
            // =========================

            long totalBids =
                    bids.size();

            long activeBids =
                    bids.stream()
                            .filter(bid ->
                                "ACTIVE".equalsIgnoreCase(
                                    bid.getStatus()
                                ))
                            .count();

            long blockedBids =
                    bids.stream()
                            .filter(bid ->
                                "BLOCKED".equalsIgnoreCase(
                                    bid.getStatus()
                                ))
                            .count();


            // =========================
            // RESPONSE
            // =========================

            Map<String, Object> report =
                    new HashMap<>();


            report.put(
                    "totalUsers",
                    totalUsers
            );

            report.put(
                    "totalBuyers",
                    totalBuyers
            );

            report.put(
                    "totalSellers",
                    totalSellers
            );

            report.put(
                    "blockedUsers",
                    blockedUsers
            );

            report.put(
                    "totalProducts",
                    totalProducts
            );

            report.put(
                    "activeProducts",
                    activeProducts
            );

            report.put(
                    "totalAuctions",
                    totalAuctions
            );

            report.put(
                    "activeAuctions",
                    activeAuctions
            );

            report.put(
                    "pendingAuctions",
                    pendingAuctions
            );

            report.put(
                    "completedAuctions",
                    completedAuctions
            );

            report.put(
                    "totalBids",
                    totalBids
            );

            report.put(
                    "activeBids",
                    activeBids
            );

            report.put(
                    "blockedBids",
                    blockedBids
            );


            return ResponseEntity.ok(report);


        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Unable to generate report: "
                        + e.getMessage()
                    );
        }
    }
}