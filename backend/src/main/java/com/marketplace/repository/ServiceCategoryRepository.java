package com.marketplace.repository;

import com.marketplace.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceCategoryRepository
        extends JpaRepository<ServiceCategory, Long> {
}