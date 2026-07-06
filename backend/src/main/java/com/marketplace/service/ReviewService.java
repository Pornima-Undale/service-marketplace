package com.marketplace.service;

import com.marketplace.dto.RatingResponseDto;
import com.marketplace.dto.ReviewResponseDto;
import com.marketplace.entity.Review;
import com.marketplace.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private ReviewResponseDto convertToDto(
            Review review) {

        ReviewResponseDto dto =
                new ReviewResponseDto();

        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());

        if(review.getCustomer() != null) {
            dto.setCustomerName(
                    review.getCustomer().getName()
            );
        }

        if(review.getService() != null) {
            dto.setServiceTitle(
                    review.getService().getTitle()
            );
        }

        return dto;
    }

    private final ReviewRepository reviewRepository;

    public ReviewService(
            ReviewRepository reviewRepository) {

        this.reviewRepository = reviewRepository;
    }

    public Review saveReview(
            Review review) {

        return reviewRepository.save(review);
    }

    public List<ReviewResponseDto> getAllReviews() {

        return reviewRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    public List<ReviewResponseDto> getReviewsByService(
            Long serviceId) {

        return reviewRepository
                .findByServiceId(serviceId)
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    public RatingResponseDto getRating(
            Long serviceId) {

        RatingResponseDto dto =
                new RatingResponseDto();

        dto.setServiceId(serviceId);

        Double avg =
                reviewRepository
                        .getAverageRating(serviceId);

        dto.setAverageRating(
                avg == null ? 0.0 : avg);

        dto.setTotalReviews(
                reviewRepository
                        .countByServiceId(serviceId));

        return dto;
    }
}