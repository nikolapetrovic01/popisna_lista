package com.inventarlista.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF since we're using JWTs
                .cors(Customizer.withDefaults()) // Enable CORS with default settings
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Allow anyone to access the login and register endpoints
                        .requestMatchers(HttpMethod.POST, "/login").permitAll()
                        .requestMatchers("/controller/**").permitAll()
                        .requestMatchers("/worker/**").permitAll()
                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .build();
    }

    @Configuration
    public static class CorsConfig implements WebMvcConfigurer {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedOriginPatterns("http://localhost:4200", "http://192.168.173.139:4200") //dodati IP adresu telefona
                    .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "HEAD")
                    .allowedHeaders("*")
                    .allowCredentials(true);
        }
    }
}