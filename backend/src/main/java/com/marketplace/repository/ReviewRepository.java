package com.marketplace.repository;

import com.marketplace.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository
        extends JpaRepository<Review, Long> {

    List<Review> findByServiceId(Long serviceId);
    @Query("""
       SELECT AVG(r.rating)
       FROM Review r
       WHERE r.service.id = :serviceId
       """)
    Double getAverageRating(Long serviceId);
    Long countByServiceId(Long serviceId);
}