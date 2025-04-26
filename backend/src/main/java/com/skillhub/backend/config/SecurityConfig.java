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

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf().disable() // Disable CSRF protection (ensure this aligns with your use case)
                                .authorizeRequests()
                                .requestMatchers("/api/auth/**", "/oauth2/**", "/api/skills/**") // Public routes
                                .permitAll() // Allow access without authentication to these paths
                                .anyRequest().authenticated() // All other requests require authentication
                                .and()
                                .oauth2Login(oauth -> oauth
                                                .loginPage("http://localhost:5173/signin") // React login page
                                                .defaultSuccessUrl("http://localhost:5173/skills/add", true)
                                                .failureUrl("http://localhost:5173/signin?error=true"))
                                .logout(logout -> logout
                                                .logoutSuccessUrl("http://localhost:5173/signin") // Redirect after
                                                                                                  // logout
                                                .permitAll())
                                .cors(); // Enable CORS globally

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
}
