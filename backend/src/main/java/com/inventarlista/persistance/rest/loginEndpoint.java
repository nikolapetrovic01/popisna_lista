package com.inventarlista.persistance.rest;

import com.inventarlista.dto.loginRequestDto;
import com.inventarlista.dto.loginResponseDto;
import com.inventarlista.service.loginServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.naming.AuthenticationException;

@RestController
public class loginEndpoint {
    private final loginServiceImpl loginService;

    public loginEndpoint(loginServiceImpl loginService){
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public ResponseEntity<loginResponseDto> login(@RequestBody loginRequestDto loginRequest){
        System.out.println("Reached endpoint");
        try {
            loginResponseDto response = loginService.validateUser(loginRequest);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            System.out.println("Error in endpoint " + e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

}