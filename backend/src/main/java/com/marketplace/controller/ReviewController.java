package com.marketplace.controller;

import com.marketplace.dto.RatingResponseDto;
import com.marketplace.dto.ReviewResponseDto;
import com.marketplace.entity.Review;
import com.marketplace.service.ReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(
            ReviewService reviewService) {

        this.reviewService = reviewService;
    }

    @PostMapping
    public Review createReview(
            @RequestBody Review review) {

        return reviewService.saveReview(review);
    }

    @GetMapping
    public List<ReviewResponseDto> getAllReviews() {

        return reviewService.getAllReviews();
    }

    @GetMapping("/service/{id}")
    public List<ReviewResponseDto> getReviewsByService(
            @PathVariable Long id) {

        return reviewService
                .getReviewsByService(id);
    }

    @GetMapping("/service/{id}/rating")
    public RatingResponseDto getRating(
            @PathVariable Long id) {

        return reviewService
                .getRating(id);
    }
}