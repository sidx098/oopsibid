package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Auction;
import com.example.demo.model.Bid;
import com.example.demo.model.Wallet;
import com.example.demo.model.WalletTransaction;

import com.example.demo.repository.AuctionRepository;
import com.example.demo.repository.BidRepository;
import com.example.demo.repository.WalletRepository;
import com.example.demo.repository.WalletTransactionRepository;




@RestController
@RequestMapping("/api/bids")
public class BidController {

    private final BidRepository bidRepository;

    private final AuctionRepository auctionRepository;

    private final WalletRepository walletRepository;

    private final WalletTransactionRepository
            transactionRepository;


    public BidController(

            BidRepository bidRepository,

            AuctionRepository auctionRepository,

            WalletRepository walletRepository,

            WalletTransactionRepository transactionRepository) {

        this.bidRepository = bidRepository;

        this.auctionRepository = auctionRepository;

        this.walletRepository = walletRepository;

        this.transactionRepository =
                transactionRepository;
    }


    // ==========================================
    // PLACE BID
    // ==========================================

    @PostMapping
    public ResponseEntity<?> placeBid(

            @RequestBody Bid request,

            Authentication authentication) {

        Wallet wallet = null;

        Bid savedBid = null;

        double lockedAmount = 0;


        try {

            // ======================================
            // CHECK LOGIN
            // ======================================

            if (authentication == null ||
                !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(401)
                        .body("Login required");
            }


            // ======================================
            // GET BUYER ID FROM JWT
            // ======================================

            String bidderId =
                    authentication.getName();

            if (bidderId == null ||
                bidderId.trim().isEmpty()) {

                return ResponseEntity
                        .status(401)
                        .body(
                            "Unable to identify bidder"
                        );
            }

            bidderId = bidderId.trim();


            // ======================================
            // VALIDATE AUCTION ID
            // ======================================

            if (request.getAuctionId() == null ||
                request.getAuctionId()
                        .trim()
                        .isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                            "Auction ID is required"
                        );
            }


            // ======================================
            // VALIDATE BID AMOUNT
            // ======================================

            if (request.getAmount() <= 0) {

                return ResponseEntity
                        .badRequest()
                        .body(
                            "Bid amount must be greater than 0"
                        );
            }


            // ======================================
            // FIND AUCTION
            // ======================================

            Auction auction =
                    auctionRepository
                            .findById(
                                request.getAuctionId()
                            )
                            .orElse(null);


            if (auction == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }


            // ======================================
            // PREVENT SELLER BIDDING
            // ON OWN AUCTION
            // ======================================

            if (auction.getSellerId() != null &&

                auction.getSellerId()
                        .equals(bidderId)) {

                return ResponseEntity
                        .badRequest()
                        .body(
                            "You cannot bid on your own auction"
                        );
            }


            // ======================================
            // CHECK AUCTION STATUS
            // ======================================

            if (!"ACTIVE".equalsIgnoreCase(
                    auction.getStatus())) {

                return ResponseEntity
                        .badRequest()
                        .body(
                            "Auction is not active"
                        );
            }


            // ======================================
            // ONE BID PER BUYER
            // ======================================

            boolean alreadyBid =
                    bidRepository
                            .existsByAuctionIdAndBidderId(
                                    auction.getId(),
                                    bidderId
                            );


            if (alreadyBid) {

                return ResponseEntity
                        .badRequest()
                        .body(
                            "You have already placed a bid on this auction. "
                            + "Only one bid is allowed per buyer."
                        );
            }


            // ======================================
            // BID MUST BE HIGHER THAN
            // STARTING PRICE
            // ======================================

            if (request.getAmount()
                    <= auction.getStartingPrice()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                            "Bid must be higher than starting price"
                        );
            }


            // ======================================
            // FIND WALLET
            // ======================================

            wallet =
                    walletRepository
                            .findByUserId(bidderId)
                            .orElse(null);


            // ======================================
            // WALLET DOES NOT EXIST
            // ======================================

            if (wallet == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                            "You need money in your wallet before placing a bid."
                        );
            }


            // ======================================
            // GET AVAILABLE BALANCE
            // ======================================

            double availableBalance =
                    wallet.getAvailableBalance();


            double bidAmount =
                    request.getAmount();


            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "BID WALLET CHECK"
            );

            System.out.println(
                    "BUYER ID: "
                    + bidderId
            );

            System.out.println(
                    "TOTAL BALANCE: ₹"
                    + wallet.getBalance()
            );

            System.out.println(
                    "RESERVED BALANCE: ₹"
                    + wallet.getReservedBalance()
            );

            System.out.println(
                    "AVAILABLE BALANCE: ₹"
                    + availableBalance
            );

            System.out.println(
                    "BID AMOUNT: ₹"
                    + bidAmount
            );


            // ======================================
            // CORE OOPSIBID RULE
            //
            // BID MUST BE LESS THAN
            // AVAILABLE WALLET BALANCE
            // ======================================

            if (bidAmount >= availableBalance) {

                System.out.println(
                        "BID REJECTED - INSUFFICIENT WALLET"
                );

                return ResponseEntity
                        .badRequest()
                        .body(
                            "Insufficient wallet balance. "
                            + "Your available balance is ₹"
                            + availableBalance
                            + ". Bid amount must be less than your available balance."
                        );
            }


            // ======================================
            // LOCK BID AMOUNT
            // ======================================

            wallet.setReservedBalance(
                    wallet.getReservedBalance()
                    + bidAmount
            );

            wallet.setUpdatedAt(
                    LocalDateTime.now()
            );


            walletRepository.save(wallet);

            lockedAmount = bidAmount;


            System.out.println(
                    "WALLET AMOUNT LOCKED: ₹"
                    + bidAmount
            );


            // ======================================
            // CREATE BID
            // ======================================

            Bid bid = new Bid();

            bid.setAuctionId(
                    auction.getId()
            );

            bid.setBidderId(
                    bidderId
            );

            bid.setAmount(
                    bidAmount
            );

            bid.setBidTime(
                    LocalDateTime.now()
            );

            bid.setStatus(
                    "ACTIVE"
            );


            // ======================================
            // SAVE BID
            // ======================================

            savedBid =
                    bidRepository.save(bid);


            // ======================================
            // CREATE WALLET TRANSACTION
            // ======================================

            WalletTransaction transaction =
                    new WalletTransaction();

            transaction.setUserId(
                    bidderId
            );

            transaction.setType(
                    "BID_LOCK"
            );

            transaction.setAmount(
                    bidAmount
            );

            transaction.setDescription(
                    "Bid amount locked for auction"
            );

            transaction.setAuctionId(
                    auction.getId()
            );

            transaction.setBidId(
                    savedBid.getId()
            );

            transaction.setTransactionTime(
                    LocalDateTime.now()
            );


            transactionRepository.save(
                    transaction
            );


            System.out.println(
                    "BID SUCCESSFULLY PLACED"
            );

            System.out.println(
                    "BID ID: "
                    + savedBid.getId()
            );

            System.out.println(
                    "======================================"
            );


            return ResponseEntity.ok(
                    savedBid
            );


        } catch (Exception e) {

            e.printStackTrace();


            // ======================================
            // ROLLBACK BID IF SOMETHING FAILED
            // ======================================

            try {

                if (savedBid != null &&
                    savedBid.getId() != null) {

                    bidRepository.deleteById(
                            savedBid.getId()
                    );
                }


                if (wallet != null &&
                    lockedAmount > 0) {

                    wallet.setReservedBalance(
                            Math.max(
                                0,
                                wallet.getReservedBalance()
                                - lockedAmount
                            )
                    );

                    wallet.setUpdatedAt(
                            LocalDateTime.now()
                    );

                    walletRepository.save(
                            wallet
                    );
                }

            } catch (Exception rollbackException) {

                rollbackException.printStackTrace();
            }


            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Unable to place bid: "
                        + e.getMessage()
                    );
        }
    }


    // ==========================================
    // GET BIDS FOR AUCTION
    // ==========================================

    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<?> getAuctionBids(

            @PathVariable String auctionId) {

        try {

            List<Bid> bids =
                    bidRepository
                            .findByAuctionId(
                                auctionId
                            );

            return ResponseEntity.ok(bids);

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Unable to load bids"
                    );
        }
    }


    // ==========================================
    // SELLER - GET MY BIDS
    // ==========================================

    @GetMapping("/seller")
    public ResponseEntity<?> getSellerBids(

            Authentication authentication) {

        try {

            if (authentication == null ||
                !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(401)
                        .body(
                            "Login required"
                        );
            }


            String sellerId =
                    authentication.getName();


            if (sellerId == null ||
                sellerId.trim().isEmpty()) {

                return ResponseEntity
                        .status(401)
                        .body(
                            "Unable to identify seller"
                        );
            }


            List<Auction> auctions =
                    auctionRepository
                            .findBySellerId(
                                sellerId
                            );


            if (auctions == null ||
                auctions.isEmpty()) {

                return ResponseEntity.ok(
                        new ArrayList<>()
                );
            }


            List<String> auctionIds =
                    new ArrayList<>();


            for (Auction auction : auctions) {

                if (auction.getId() != null) {

                    auctionIds.add(
                            auction.getId()
                    );
                }
            }


            if (auctionIds.isEmpty()) {

                return ResponseEntity.ok(
                        new ArrayList<>()
                );
            }


            List<Bid> bids =
                    bidRepository
                            .findByAuctionIdIn(
                                auctionIds
                            );


            return ResponseEntity.ok(bids);


        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Unable to load seller bids: "
                        + e.getMessage()
                    );
        }
    }


    // ==========================================
    // BUYER - GET MY BIDS
    // ==========================================

    @GetMapping("/buyer")
    public ResponseEntity<?> getBuyerBids(

            Authentication authentication) {

        try {

            if (authentication == null ||
                !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(401)
                        .body(
                            "Login required"
                        );
            }


            String bidderId =
                    authentication.getName();


            if (bidderId == null ||
                bidderId.trim().isEmpty()) {

                return ResponseEntity
                        .status(401)
                        .body(
                            "Unable to identify buyer"
                        );
            }


            List<Bid> bids =
                    bidRepository
                            .findByBidderId(
                                bidderId.trim()
                            );


            return ResponseEntity.ok(bids);


        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Unable to load buyer bids: "
                        + e.getMessage()
                    );
        }
    }
}