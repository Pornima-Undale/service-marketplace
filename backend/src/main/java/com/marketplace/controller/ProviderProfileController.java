package com.marketplace.controller;

import com.marketplace.entity.ProviderProfile;
import com.marketplace.service.ProviderProfileService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/providers")
public class ProviderProfileController {

    private final ProviderProfileService providerProfileService;

    public ProviderProfileController(
            ProviderProfileService providerProfileService) {

        this.providerProfileService = providerProfileService;
    }

    @PostMapping
    public ProviderProfile createProvider(
            @RequestBody ProviderProfile providerProfile) {

        return providerProfileService
                .saveProviderProfile(providerProfile);
    }
}
