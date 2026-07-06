package com.marketplace.repository;

import com.marketplace.entity.MarketplaceService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository
        extends JpaRepository<MarketplaceService, Long> {

    List<MarketplaceService>
    findByCategory_Name(String categoryName);

    List<MarketplaceService>
    findByPriceBetween(
            Double minPrice,
            Double maxPrice);

    List<MarketplaceService>
    findByProviderId(Long providerId);
}
