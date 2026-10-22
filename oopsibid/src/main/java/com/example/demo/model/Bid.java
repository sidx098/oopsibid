package com.example.demo.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "bids")
public class Bid {

    @Id
    private String id;

    // ==========================================
    // AUCTION
    // ==========================================

    private String auctionId;

    // ==========================================
    // BUYER
    // ==========================================

    private String bidderId;

    // ==========================================
    // BID AMOUNT
    // ==========================================

    private double amount;

    // ==========================================
    // BID TIME
    // ==========================================

    private LocalDateTime bidTime;

    // ==========================================
    // BID STATUS
    // ==========================================
    //
    // ACTIVE  = Bid is currently active
    // WINNER  = Buyer won the auction
    // LOST    = Buyer lost the auction
    // CANCELLED = Bid was cancelled
    //
    // ==========================================

    private String status;

    // ==========================================
    // WALLET LOCK
    // ==========================================
    //
    // true  = money is currently locked
    // false = money has been released/settled
    //
    // ==========================================

    private boolean walletLocked;

    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public Bid() {
    }

    // ==========================================
    // ID
    // ==========================================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    // ==========================================
    // AUCTION ID
    // ==========================================

    public String getAuctionId() {
        return auctionId;
    }

    public void setAuctionId(String auctionId) {
        this.auctionId = auctionId;
    }

    // ==========================================
    // BIDDER ID
    // ==========================================

    public String getBidderId() {
        return bidderId;
    }

    public void setBidderId(String bidderId) {
        this.bidderId = bidderId;
    }

    // ==========================================
    // AMOUNT
    // ==========================================

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    // ==========================================
    // BID TIME
    // ==========================================

    public LocalDateTime getBidTime() {
        return bidTime;
    }

    public void setBidTime(LocalDateTime bidTime) {
        this.bidTime = bidTime;
    }

    // ==========================================
    // STATUS
    // ==========================================

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // ==========================================
    // WALLET LOCKED
    // ==========================================

    public boolean isWalletLocked() {
        return walletLocked;
    }

    public void setWalletLocked(boolean walletLocked) {
        this.walletLocked = walletLocked;
    }
}

