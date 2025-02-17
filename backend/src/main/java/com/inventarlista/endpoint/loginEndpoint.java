package com.inventarlista.endpoint;

import com.inventarlista.dto.loginRequestDto;
import com.inventarlista.dto.loginResponseDto;
import com.inventarlista.service.loginServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        loginResponseDto response = loginService.authenticateAndIssueToken(loginRequest);
        return ResponseEntity.ok(response);
    }
}