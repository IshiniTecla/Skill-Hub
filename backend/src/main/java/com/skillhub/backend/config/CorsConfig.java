package com.skillhub.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Apply CORS to all endpoints
                .allowedOrigins("http://localhost:5173") // React client address
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // Include OPTIONS for preflight
                .allowedHeaders("*") // Allow any headers
                .allowCredentials(true); // Allow cookies if needed
    }
}
