package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.Wallet;

public interface WalletRepository
        extends MongoRepository<Wallet, String> {

    Optional<Wallet> findByUserId(String userId);

    boolean existsByUserId(String userId);
}