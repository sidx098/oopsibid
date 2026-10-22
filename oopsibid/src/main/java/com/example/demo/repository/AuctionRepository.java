package com.example.demo.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.Auction;

public interface AuctionRepository extends MongoRepository<Auction, String> {

    List<Auction> findByStatus(String status);

    List<Auction> findBySellerId(String sellerId);

    List<Auction> findByProductId(String productId);
}