package com.company.platform.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "http://localhost:5173",
                                "http://localhost:3000",
                                "http://localhost:3001",
                                "http://18.206.74.221:3000",
                                "http://18.206.74.221",
                                "http://3.217.47.129:3000", // New server IP
                                "http://3.217.47.129:8081", // Backend port
                                "http://3.150.62.32:3000", // Current server IP
                                "http://3.150.62.32:8081") // Backend port
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
