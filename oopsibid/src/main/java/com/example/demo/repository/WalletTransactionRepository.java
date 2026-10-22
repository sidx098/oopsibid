package com.example.demo.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.WalletTransaction;

public interface WalletTransactionRepository
        extends MongoRepository<WalletTransaction, String> {

    List<WalletTransaction>
    findByUserIdOrderByTransactionTimeDesc(
            String userId
    );
}