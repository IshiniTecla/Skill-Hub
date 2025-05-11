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


        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf().disable()
                                .authorizeRequests()
                                .requestMatchers("/api/auth/**", "/oauth2/**", "/uploads/**",
                                                "/api/skills/**", "/api/posts/**") // Match
                                                                                   // paths in
                                                                                   // your
                                                                                   // controller
                                .permitAll() // Allow public access to these routes
                                .anyRequest().authenticated() // Require authentication for other routes
                                .and()
                                .oauth2Login(oauth -> oauth
                                                .loginPage("http://localhost:5173/signin") // Redirect to React sign-in
                                                .defaultSuccessUrl("http://localhost:5173/dashboard", true)
                                                .failureUrl("http://localhost:5173/signin?error=true"))
                                .logout(logout -> logout
                                                .logoutSuccessUrl("http://localhost:5173/signin")
                                                .permitAll())
                                .cors(); // Enable CORS globally


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


        @Bean
        public UserDetailsService userDetailsService() {
                return new UserDetailsServiceImpl();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
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

                                .userDetailsService(userDetailsService())
                                .passwordEncoder(passwordEncoder());
                return authenticationManagerBuilder.build();
        }
}

                                .userDetailsService(userDetailsService()) // Inject custom user details service
                                .passwordEncoder(passwordEncoder()); // Use BCrypt for password hashing
                return authenticationManagerBuilder.build();
        }
}

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

