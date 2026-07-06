package com.marketplace.controller;

import com.marketplace.entity.ServiceCategory;
import com.marketplace.service.ServiceCategoryService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/categories")
public class ServiceCategoryController {

    private final ServiceCategoryService service;

    public ServiceCategoryController(
            ServiceCategoryService service) {
        this.service = service;
    }

    @PostMapping
    public ServiceCategory createCategory(
            @RequestBody ServiceCategory category) {

        return service.saveCategory(category);
    }
}
