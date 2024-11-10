package com.inventarlista;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

import jakarta.annotation.PostConstruct; // Updated import
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @PostConstruct
    public void init() {
        // Directory path for logs
        Path logDirectory = Paths.get("./log");

        // Check if the directory exists
        if (!Files.exists(logDirectory)) {
            try {
                // Create the directory
                Files.createDirectories(logDirectory);
                System.out.println("Log directory created successfully.");
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("Failed to create log directory.");
            }
        }
    }
}
