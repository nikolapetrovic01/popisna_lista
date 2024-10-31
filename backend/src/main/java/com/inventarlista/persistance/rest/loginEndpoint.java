package com.inventarlista.persistance.rest;

import com.inventarlista.dto.loginRequestDto;
import com.inventarlista.dto.loginResponseDto;
import com.inventarlista.exceptions.UserNotFoundException;
import com.inventarlista.service.loginServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.naming.AuthenticationException;

@RestController
public class loginEndpoint {
    private final loginServiceImpl loginService;

    public loginEndpoint(loginServiceImpl loginService) {
        this.loginService = loginService;
    }

    /**
     * Handles login requests.
     * @param loginRequest - A loginRequestDto object containing username and password for authentication.
     * @return A ResponseEntity containing loginResponseDto with user information if authentication is successful.
     */
    @PostMapping("/login")
    public ResponseEntity<loginResponseDto> login(@RequestBody loginRequestDto loginRequest) {
        loginResponseDto response = loginService.validateUser(loginRequest);
        return ResponseEntity.ok(response);
    }
}