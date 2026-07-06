package com.marketplace.service;
import com.marketplace.entity.ServiceCategory;
import com.marketplace.repository.ServiceCategoryRepository;

import org.springframework.stereotype.Service;

@Service
public class ServiceCategoryService {

    private final ServiceCategoryRepository repository;

    public ServiceCategoryService(
            ServiceCategoryRepository repository) {
        this.repository = repository;
    }

    public ServiceCategory saveCategory(
            ServiceCategory category) {
        return repository.save(category);
    }
}