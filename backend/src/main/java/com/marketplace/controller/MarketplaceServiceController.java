package com.marketplace.controller;

import com.marketplace.dto.ServiceResponseDto;
import com.marketplace.entity.MarketplaceService;
import com.marketplace.service.MarketplaceServiceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
public class MarketplaceServiceController {

    private final MarketplaceServiceService service;

    public MarketplaceServiceController(
            MarketplaceServiceService service) {

        this.service = service;
    }

    @PostMapping
    public MarketplaceService createService(
            @RequestBody MarketplaceService serviceRequest) {

        return service.createService(serviceRequest);
    }

    @GetMapping
    public List<ServiceResponseDto> getAllServices() {
        return service.getAllServices();
    }

    @PutMapping("/{id}")
    public MarketplaceService updateService(
            @PathVariable Long id,
            @RequestBody MarketplaceService serviceRequest) {

        return service.updateService(
                id,
                serviceRequest
        );
    }

    @DeleteMapping("/{id}")
    public String deleteService(
            @PathVariable Long id) {

        return service.deleteService(id);
    }

    @GetMapping("/category/{name}")
    public List<ServiceResponseDto>
    getServicesByCategory(
            @PathVariable String name) {

        return service
                .getServicesByCategory(name);
    }

    @GetMapping("/price")
    public List<ServiceResponseDto>
    getServicesByPriceRange(

            @RequestParam Double min,
            @RequestParam Double max) {

        return service
                .getServicesByPriceRange(
                        min,
                        max);
    }

    @GetMapping("/provider/{providerId}")
    public List<ServiceResponseDto>
    getServicesByProvider(
            @PathVariable Long providerId) {

        return service
                .getServicesByProvider(providerId);
    }
}