package com.example.demo.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.Bid;

public interface BidRepository
        extends MongoRepository<Bid, String> {

    List<Bid> findByAuctionId(String auctionId);

    List<Bid> findByBidderId(String bidderId);

    List<Bid> findByStatus(String status);

    List<Bid> findByAuctionIdIn(List<String> auctionIds);

    // ==========================================
    // ONE BID PER BUYER PER AUCTION
    // ==========================================

    boolean existsByAuctionIdAndBidderId(
            String auctionId,
            String bidderId
    );
}