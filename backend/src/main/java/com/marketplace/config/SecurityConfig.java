package com.marketplace.config;

import com.marketplace.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(
            JwtAuthenticationFilter jwtFilter,
            CorsConfigurationSource corsConfigurationSource) {
        this.jwtFilter = jwtFilter;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Auth endpoints - public
                .requestMatchers("/auth/**").permitAll()

                // Registration - public
                .requestMatchers(HttpMethod.POST, "/users").permitAll()

                // Services GET - public (so Angular can list services without login)
                .requestMatchers(HttpMethod.GET, "/services").permitAll()
                .requestMatchers(HttpMethod.GET, "/services/**").permitAll()

                // Categories GET - public
                .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()

                // Admin-only
                .requestMatchers("/users/**").hasRole("ADMIN")

                // Provider-only
                .requestMatchers(HttpMethod.POST, "/services").hasRole("PROVIDER")
                .requestMatchers(HttpMethod.PUT, "/services/**").hasRole("PROVIDER")
                .requestMatchers(HttpMethod.DELETE, "/services/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
