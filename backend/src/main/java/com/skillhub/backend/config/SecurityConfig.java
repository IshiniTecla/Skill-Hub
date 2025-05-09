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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        // Define CORS configuration
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration corsConfig = new CorsConfiguration();
                corsConfig.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // React client address
                corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Include
                                                                                                        // OPTIONS for
                                                                                                        // preflight
                corsConfig.setAllowedHeaders(Arrays.asList("*")); // Allow any headers
                corsConfig.setAllowCredentials(true); // Allow cookies if needed
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", corsConfig);
                return source;
        }

        // Configure Spring Security
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors() // Enable CORS with the configuration defined above
                                .and()
                                .csrf().disable() // Disable CSRF for simplicity in this example
                                .authorizeRequests()
                                .requestMatchers("/api/auth/**", "/oauth2/**", "/api/skills/**", "/api/endorsements/**")
                                .permitAll() // Permit certain endpoints without authentication
                                .anyRequest().authenticated() // Require authentication for other requests
                                .and()
                                .oauth2Login(oauth -> oauth
                                                .loginPage("http://localhost:5173/signin") // Custom login page
                                                .defaultSuccessUrl("http://localhost:5173/profile", true) // Redirect
                                                                                                          // on
                                                                                                          // successful
                                                                                                          // login
                                                .failureUrl("http://localhost:5173/signin?error=true")) // Redirect on
                                                                                                        // failure
                                .logout(logout -> logout
                                                .logoutSuccessUrl("http://localhost:5173/signin") // Redirect to signin
                                                                                                  // on logout
                                                .permitAll());

                return http.build();
        }

        // UserDetailsService bean
        @Bean
        public UserDetailsService userDetailsService() {
                return new UserDetailsServiceImpl(); // Custom UserDetailsService for authentication
        }

        // Password Encoder bean
        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder(); // Password encoder for hashing passwords
        }

        // AuthenticationManager bean
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
