package com.marketplace.service;

import com.marketplace.dto.ServiceResponseDto;
import com.marketplace.entity.MarketplaceService;
import com.marketplace.repository.ServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarketplaceServiceService {

    private ServiceResponseDto convertToDto(
            MarketplaceService service) {

        ServiceResponseDto dto =
                new ServiceResponseDto();

        dto.setId(service.getId());
        dto.setTitle(service.getTitle());
        dto.setDescription(service.getDescription());
        dto.setPrice(service.getPrice());

        if(service.getCategory() != null) {
            dto.setCategoryName(
                    service.getCategory().getName()
            );
        }

        if(service.getProvider() != null) {
            dto.setProviderName(
                    service.getProvider()
                            .getBusinessName()
            );
        }

        return dto;
    }

    private final ServiceRepository serviceRepository;

    public MarketplaceServiceService(
            ServiceRepository serviceRepository) {

        this.serviceRepository = serviceRepository;
    }

    public MarketplaceService createService(
            MarketplaceService service) {

        return serviceRepository.save(service);
    }

    public List<ServiceResponseDto> getAllServices() {

        return serviceRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    public MarketplaceService updateService(
            Long id,
            MarketplaceService updatedService) {

        MarketplaceService existingService =
                serviceRepository.findById(id)
                        .orElse(null);

        if(existingService != null) {

            existingService.setTitle(
                    updatedService.getTitle());

            existingService.setDescription(
                    updatedService.getDescription());

            existingService.setPrice(
                    updatedService.getPrice());

            return serviceRepository.save(
                    existingService);
        }

        return null;
    }

    public String deleteService(Long id) {

        if(serviceRepository.existsById(id)) {

            serviceRepository.deleteById(id);

            return "Service deleted successfully";
        }

        return "Service not found";
    }

    public List<ServiceResponseDto>
    getServicesByCategory(
            String categoryName) {

        return serviceRepository
                .findByCategory_Name(categoryName)
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    public List<ServiceResponseDto>
    getServicesByPriceRange(
            Double minPrice,
            Double maxPrice) {

        return serviceRepository
                .findByPriceBetween(
                        minPrice,
                        maxPrice)
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    public List<ServiceResponseDto>
    getServicesByProvider(
            Long providerId) {

        return serviceRepository
                .findByProviderId(providerId)
                .stream()
                .map(this::convertToDto)
                .toList();
    }
}