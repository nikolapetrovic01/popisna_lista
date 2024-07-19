package com.inventarlista.persistance.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.POST})
@RestController
public class TestEndpoint {
    @PostMapping("/test-button")
    public ResponseEntity<String> handleButtonPress() {
        System.out.println("Button was pressed!");
        return ResponseEntity.ok().body("{\"message\":\"Received the button press!\"}");
    }
}
