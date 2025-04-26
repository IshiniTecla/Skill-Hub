package com.skillhub.backend.config;

import com.skillhub.backend.service.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors().and() // Ensure CORS is enabled first
                                .csrf().disable()
                                .authorizeRequests()
                                .requestMatchers("/api/auth/**", "/oauth2/**", "/api/skills/**")
                                .permitAll()
                                .anyRequest().authenticated()
                                .and()
                                .oauth2Login(oauth -> oauth
                                                .loginPage("http://localhost:5173/signin")
                                                .defaultSuccessUrl("http://localhost:5173/skill-card", true)
                                                .failureUrl("http://localhost:5173/signin?error=true"))
                                .logout(logout -> logout
                                                .logoutSuccessUrl("http://localhost:5173/signin")
                                                .permitAll());

                return http.build();
        }

        @Bean
        public UserDetailsService userDetailsService() {
                return new UserDetailsServiceImpl(); // Custom UserDetailsService for authentication
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder(); // Password encoder for hashing passwords
        }

        @Bean
        public AuthenticationManager authManager(HttpSecurity http) throws Exception {
                AuthenticationManagerBuilder authenticationManagerBuilder = http
                                .getSharedObject(AuthenticationManagerBuilder.class);
                authenticationManagerBuilder
                                .userDetailsService(userDetailsService()) // Inject custom user details service
                                .passwordEncoder(passwordEncoder()); // Use BCrypt for password hashing
                return authenticationManagerBuilder.build();
        }

        @Bean
        public CorsFilter corsFilter() {
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowCredentials(true);
                config.addAllowedOrigin("http://localhost:5173"); // React frontend URL
                config.addAllowedHeader("*"); // Allow any headers
                config.addAllowedMethod("*"); // Allow all HTTP methods (GET, POST, etc.)
                source.registerCorsConfiguration("/**", config); // Apply this to all endpoints
                return new CorsFilter(source);
        }
}
