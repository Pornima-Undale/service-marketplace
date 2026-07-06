package com.marketplace.repository;

import com.marketplace.entity.ProviderProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProviderProfileRepository
        extends JpaRepository<ProviderProfile, Long> {

    boolean existsByUserId(Long userId);
}