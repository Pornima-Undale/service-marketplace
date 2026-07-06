package com.marketplace.service;

import com.marketplace.entity.ProviderProfile;
import com.marketplace.entity.User;
import com.marketplace.repository.ProviderProfileRepository;
import com.marketplace.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ProviderProfileService {

    private final ProviderProfileRepository providerProfileRepository;
    private final UserRepository userRepository;

    public ProviderProfileService(
            ProviderProfileRepository providerProfileRepository,
            UserRepository userRepository) {

        this.providerProfileRepository = providerProfileRepository;
        this.userRepository = userRepository;
    }

    public ProviderProfile saveProviderProfile(
            ProviderProfile providerProfile) {

        Long userId = providerProfile.getUser().getId();

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if(providerProfileRepository.existsByUserId(userId)) {
            throw new RuntimeException(
                    "Provider profile already exists");
        }

        providerProfile.setUser(user);

        return providerProfileRepository.save(providerProfile);
    }
}