package com.example.demo.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.demo.model.Auction;
import com.example.demo.model.Bid;
import com.example.demo.model.Wallet;
import com.example.demo.model.WalletTransaction;
import com.example.demo.repository.AuctionRepository;
import com.example.demo.repository.BidRepository;
import com.example.demo.repository.WalletRepository;
import com.example.demo.repository.WalletTransactionRepository;

@Component
public class AuctionScheduler {


    private final AuctionRepository auctionRepository;

    private final BidRepository bidRepository;

    private final WalletRepository walletRepository;

    private final WalletTransactionRepository
            transactionRepository;


    public AuctionScheduler(
            AuctionRepository auctionRepository,
            BidRepository bidRepository,
            WalletRepository walletRepository,
            WalletTransactionRepository transactionRepository) {

        this.auctionRepository = auctionRepository;

        this.bidRepository = bidRepository;

        this.walletRepository = walletRepository;

        this.transactionRepository =
                transactionRepository;
    }


    // =====================================================
    // RUN EVERY 10 SECONDS
    // =====================================================

    @Scheduled(fixedRate = 10000)
    public void processAuctions() {

        try {

            LocalDateTime now =
                    LocalDateTime.now();


            List<Auction> auctions =
                    auctionRepository.findAll();


            for (Auction auction : auctions) {

                processAuction(
                        auction,
                        now
                );
            }

        } catch (Exception e) {

            e.printStackTrace();
        }
    }


    // =====================================================
    // PROCESS ONE AUCTION
    // =====================================================

    private void processAuction(
            Auction auction,
            LocalDateTime now) {

        if (auction == null) {
            return;
        }


        String status =
                auction.getStatus();


        if (status == null) {
            return;
        }


        // =================================================
        // APPROVED → ACTIVE
        // =================================================

        if ("APPROVED".equalsIgnoreCase(status)) {

            if (auction.getStartTime() == null ||
                auction.getEndTime() == null) {

                return;
            }


            /*
             * Auction becomes active when startTime arrives.
             */

            if (!now.isBefore(
                    auction.getStartTime())) {

                if (now.isBefore(
                        auction.getEndTime())) {

                    auction.setStatus("ACTIVE");

                    auctionRepository.save(auction);

                    System.out.println(
                            "AUCTION ACTIVATED: "
                            + auction.getId()
                    );

                    return;
                }


                /*
                 * If endTime has already passed,
                 * close it directly.
                 */

                if (!now.isBefore(
                        auction.getEndTime())) {

                    closeAuction(auction);

                    return;
                }
            }

            return;
        }


        // =================================================
        // ACTIVE → CLOSED
        // =================================================

        if ("ACTIVE".equalsIgnoreCase(status)) {

            if (auction.getEndTime() == null) {
                return;
            }


            if (!now.isBefore(
                    auction.getEndTime())) {

                closeAuction(auction);
            }
        }
    }


    // =====================================================
    // CLOSE AUCTION
    // =====================================================

    private void closeAuction(
            Auction auction) {

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "CLOSING AUCTION: "
                + auction.getId()
        );


        List<Bid> bids =
                bidRepository.findByAuctionId(
                        auction.getId()
                );


        // =================================================
        // NO BIDS
        // =================================================

        if (bids == null ||
            bids.isEmpty()) {

            auction.setStatus("CLOSED");

            auctionRepository.save(auction);

            System.out.println(
                    "NO BIDS - AUCTION CLOSED"
            );

            System.out.println(
                    "=========================================="
            );

            return;
        }


        // =================================================
        // FIND HIGHEST BID
        // =================================================

        Bid winner = null;


        for (Bid bid : bids) {

            if (bid == null) {
                continue;
            }


            if (winner == null ||
                bid.getAmount() >
                winner.getAmount()) {

                winner = bid;
            }
        }


        if (winner == null) {

            auction.setStatus("CLOSED");

            auctionRepository.save(auction);

            return;
        }


        // =================================================
        // WINNER
        // =================================================

        winner.setStatus("WINNER");

        bidRepository.save(winner);


        System.out.println(
                "WINNER BID: "
                + winner.getId()
        );

        System.out.println(
                "WINNER BUYER: "
                + winner.getBidderId()
        );

        System.out.println(
                "WINNING AMOUNT: ₹"
                + winner.getAmount()
        );


        // =================================================
        // SETTLE WINNER
        // =================================================

        settleWinner(
                auction,
                winner
        );


        // =================================================
        // RELEASE LOSING BIDS
        // =================================================

        for (Bid bid : bids) {

            if (bid == null) {
                continue;
            }


            if (bid.getId() == null) {
                continue;
            }


            if (bid.getId().equals(
                    winner.getId())) {

                continue;
            }


            bid.setStatus("LOST");

            bidRepository.save(bid);


            releaseLoserWallet(
                    bid,
                    auction
            );
        }


        // =================================================
        // CLOSE AUCTION
        // =================================================

        auction.setStatus("CLOSED");

        auctionRepository.save(auction);


        System.out.println(
                "AUCTION CLOSED SUCCESSFULLY"
        );

        System.out.println(
                "=========================================="
        );
    }


    // =====================================================
    // WINNER SETTLEMENT
    // =====================================================

    private void settleWinner(
            Auction auction,
            Bid winner) {

        try {

            Wallet winnerWallet =
                    walletRepository
                            .findByUserId(
                                    winner.getBidderId()
                            )
                            .orElse(null);


            if (winnerWallet == null) {

                System.out.println(
                        "WINNER WALLET NOT FOUND"
                );

                return;
            }


            double amount =
                    winner.getAmount();


            // =================================================
            // REMOVE LOCKED MONEY
            //
            // balance = actual total money
            // reservedBalance = locked money
            //
            // Winner pays the locked amount.
            // =================================================

            winnerWallet.setReservedBalance(
                    Math.max(
                            0,
                            winnerWallet
                                    .getReservedBalance()
                            - amount
                    )
            );


            winnerWallet.setBalance(
                    Math.max(
                            0,
                            winnerWallet
                                    .getBalance()
                            - amount
                    )
            );


            winnerWallet.setUpdatedAt(
                    LocalDateTime.now()
            );


            walletRepository.save(
                    winnerWallet
            );


            // =================================================
            // WINNER TRANSACTION
            // =================================================

            WalletTransaction transaction =
                    new WalletTransaction();


            transaction.setUserId(
                    winner.getBidderId()
            );


            transaction.setType(
                    "AUCTION_WON"
            );


            transaction.setAmount(
                    amount
            );


            transaction.setDescription(
                    "Winning bid payment for auction"
            );


            transaction.setAuctionId(
                    auction.getId()
            );


            transaction.setBidId(
                    winner.getId()
            );


            transaction.setTransactionTime(
                    LocalDateTime.now()
            );


            transactionRepository.save(
                    transaction
            );


            // =================================================
            // PAY SELLER
            // =================================================

            if (auction.getSellerId() != null) {

                Wallet sellerWallet =
                        walletRepository
                                .findByUserId(
                                        auction.getSellerId()
                                )
                                .orElse(null);


                if (sellerWallet == null) {

                    sellerWallet =
                            new Wallet();

                    sellerWallet.setUserId(
                            auction.getSellerId()
                    );

                    sellerWallet.setBalance(0);

                    sellerWallet.setReservedBalance(0);

                    sellerWallet.setCreatedAt(
                            LocalDateTime.now()
                    );
                }


                sellerWallet.setBalance(
                        sellerWallet.getBalance()
                        + amount
                );


                sellerWallet.setUpdatedAt(
                        LocalDateTime.now()
                );


                walletRepository.save(
                        sellerWallet
                );


                // =================================================
                // SELLER TRANSACTION
                // =================================================

                WalletTransaction sellerTransaction =
                        new WalletTransaction();


                sellerTransaction.setUserId(
                        auction.getSellerId()
                );


                sellerTransaction.setType(
                        "AUCTION_SALE"
                );


                sellerTransaction.setAmount(
                        amount
                );


                sellerTransaction.setDescription(
                        "Payment received from auction winner"
                );


                sellerTransaction.setAuctionId(
                        auction.getId()
                );


                sellerTransaction.setBidId(
                        winner.getId()
                );


                sellerTransaction.setTransactionTime(
                        LocalDateTime.now()
                );


                transactionRepository.save(
                        sellerTransaction
                );
            }


        } catch (Exception e) {

            e.printStackTrace();

            System.out.println(
                    "Winner settlement failed: "
                    + e.getMessage()
            );
        }
    }


    // =====================================================
    // RELEASE LOSING BUYER MONEY
    // =====================================================

    private void releaseLoserWallet(
            Bid bid,
            Auction auction) {

        try {

            Wallet wallet =
                    walletRepository
                            .findByUserId(
                                    bid.getBidderId()
                            )
                            .orElse(null);


            if (wallet == null) {

                return;
            }


            double amount =
                    bid.getAmount();


            // =================================================
            // RELEASE RESERVED MONEY
            // =================================================

            wallet.setReservedBalance(
                    Math.max(
                            0,
                            wallet.getReservedBalance()
                            - amount
                    )
            );


            wallet.setUpdatedAt(
                    LocalDateTime.now()
            );


            walletRepository.save(wallet);


            // =================================================
            // TRANSACTION
            // =================================================

            WalletTransaction transaction =
                    new WalletTransaction();


            transaction.setUserId(
                    bid.getBidderId()
            );


            transaction.setType(
                    "BID_RELEASE"
            );


            transaction.setAmount(
                    amount
            );


            transaction.setDescription(
                    "Bid amount released after losing auction"
            );


            transaction.setAuctionId(
                    auction.getId()
            );


            transaction.setBidId(
                    bid.getId()
            );


            transaction.setTransactionTime(
                    LocalDateTime.now()
            );


            transactionRepository.save(
                    transaction
            );


            System.out.println(
                    "RELEASED ₹"
                    + amount
                    + " FOR BUYER "
                    + bid.getBidderId()
            );


        } catch (Exception e) {

            e.printStackTrace();

            System.out.println(
                    "Unable to release loser wallet: "
                    + e.getMessage()
            );
        }
    }
}

