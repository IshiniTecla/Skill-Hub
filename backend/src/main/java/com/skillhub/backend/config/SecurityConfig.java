package com.skillhub.backend.config;

import com.skillhub.backend.filters.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsFilter corsFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, CorsFilter corsFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.corsFilter = corsFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Apply CORS configuration first - this is critical
            .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)
            .cors(cors -> {})
            // Disable CSRF for REST API
            .csrf(csrf -> csrf.disable())
            // Use stateless session management
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Allow all OPTIONS requests (needed for CORS preflight)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // Public endpoints
                .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
                
                // Explicitly allow access to profile images without authentication
                .requestMatchers(HttpMethod.GET, "/api/users/*/profile-image").permitAll()
                
                // Allow public user lookups by ID for profile access
                .requestMatchers(HttpMethod.GET, "/api/users/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                
                // Protected endpoints
                .requestMatchers("/api/users/profile").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/users/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/users/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/users/**").authenticated()
                
                // Group endpoints
                .requestMatchers(HttpMethod.GET, "/api/groups/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/groups/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/groups/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/groups/**").authenticated()
                
                // Posts endpoints
                .requestMatchers("/api/posts/**").authenticated()
                
                // Other protected endpoints
                .requestMatchers("/api/files/**").authenticated()
                .requestMatchers("/api/skills/**").authenticated()
                .requestMatchers("/api/projects/**").authenticated()
                .requestMatchers("/api/group-messages/**").authenticated()
                .requestMatchers("/api/group-posts/**").authenticated()
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            // Add JWT filter to validate tokens
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        // Note: In production, use a stronger password encoder like BCryptPasswordEncoder
        return NoOpPasswordEncoder.getInstance();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}