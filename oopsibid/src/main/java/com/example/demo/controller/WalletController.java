package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Wallet;
import com.example.demo.model.WalletTransaction;
import com.example.demo.repository.WalletRepository;
import com.example.demo.repository.WalletTransactionRepository;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final WalletRepository walletRepository;

    private final WalletTransactionRepository
            transactionRepository;

    public WalletController(
            WalletRepository walletRepository,
            WalletTransactionRepository transactionRepository) {

        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }


    // ==========================================
    // GET MY WALLET
    // ==========================================

    @GetMapping
    public ResponseEntity<?> getWallet(
            Authentication authentication) {

        try {

            if (authentication == null ||
                !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(401)
                        .body("Login required");
            }

            String userId =
                    authentication.getName();

            Wallet wallet =
                    walletRepository
                            .findByUserId(userId)
                            .orElse(null);

            // ----------------------------------
            // CREATE WALLET IF NOT EXISTS
            // ----------------------------------

            if (wallet == null) {

                wallet = new Wallet();

                wallet.setUserId(userId);

                wallet.setBalance(0);

                wallet.setReservedBalance(0);

                wallet.setCreatedAt(
                        LocalDateTime.now()
                );

                wallet.setUpdatedAt(
                        LocalDateTime.now()
                );

                wallet =
                        walletRepository.save(wallet);
            }

            return ResponseEntity.ok(wallet);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Unable to load wallet: "
                        + e.getMessage()
                    );
        }
    }


    // ==========================================
    // ADD MONEY
    // ==========================================

    @PostMapping("/add-money")
    public ResponseEntity<?> addMoney(
            @RequestParam double amount,
            Authentication authentication) {

        try {

            if (authentication == null ||
                !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(401)
                        .body("Login required");
            }

            if (amount <= 0) {

                return ResponseEntity
                        .badRequest()
                        .body(
                            "Amount must be greater than 0"
                        );
            }

            String userId =
                    authentication.getName();

            Wallet wallet =
                    walletRepository
                            .findByUserId(userId)
                            .orElse(null);

            if (wallet == null) {

                wallet = new Wallet();

                wallet.setUserId(userId);

                wallet.setBalance(0);

                wallet.setReservedBalance(0);

                wallet.setCreatedAt(
                        LocalDateTime.now()
                );
            }

            // ----------------------------------
            // ADD MONEY
            // ----------------------------------

            wallet.setBalance(
                    wallet.getBalance() + amount
            );

            wallet.setUpdatedAt(
                    LocalDateTime.now()
            );

            Wallet savedWallet =
                    walletRepository.save(wallet);


            // ----------------------------------
            // TRANSACTION
            // ----------------------------------

            WalletTransaction transaction =
                    new WalletTransaction();

            transaction.setUserId(userId);

            transaction.setType("DEPOSIT");

            transaction.setAmount(amount);

            transaction.setDescription(
                    "Money added to wallet"
            );

            transaction.setTransactionTime(
                    LocalDateTime.now()
            );

            transactionRepository.save(
                    transaction
            );


            return ResponseEntity.ok(
                    savedWallet
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Unable to add money: "
                        + e.getMessage()
                    );
        }
    }


    // ==========================================
    // TRANSACTION HISTORY
    // ==========================================

    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions(
            Authentication authentication) {

        try {

            if (authentication == null ||
                !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(401)
                        .body("Login required");
            }

            String userId =
                    authentication.getName();

            List<WalletTransaction> transactions =
                    transactionRepository
                            .findByUserIdOrderByTransactionTimeDesc(
                                    userId
                            );

            return ResponseEntity.ok(
                    transactions
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Unable to load transactions: "
                        + e.getMessage()
                    );
        }
    }
}