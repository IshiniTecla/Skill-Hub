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
                                .csrf().disable()
                                .authorizeRequests()
                                .requestMatchers("/api/auth/signup", "/api/auth/signin", "/oauth2/**", "/uploads/**",
                                                "/api/skills/**")
                                .permitAll() // Public routes
                                .anyRequest().authenticated() // Any other routes require authentication
                                .and()
                                .oauth2Login(oauth -> oauth
                                                .loginPage("http://localhost:5173/signin") // Redirect to React signin
                                                .defaultSuccessUrl("http://localhost:5173/dashboard", true)
                                                .failureUrl("http://localhost:5173/signin?error=true"))
                                .logout(logout -> logout
                                                .logoutSuccessUrl("http://localhost:5173/signin")
                                                .permitAll());

                return http.build();
        }

        @Bean
        public UserDetailsService userDetailsService() {
                return new UserDetailsServiceImpl();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authManager(HttpSecurity http) throws Exception {
                AuthenticationManagerBuilder authenticationManagerBuilder = http
                                .getSharedObject(AuthenticationManagerBuilder.class);
                authenticationManagerBuilder
                                .userDetailsService(userDetailsService())
                                .passwordEncoder(passwordEncoder());
                return authenticationManagerBuilder.build();
        }
}
