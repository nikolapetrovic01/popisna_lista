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

    //    @PostMapping("/login")
//    public ResponseEntity<loginResponseDto> login(@RequestBody loginRequestDto loginRequest){
//        try {
//            loginResponseDto response = loginService.validateUser(loginRequest);
//            return ResponseEntity.ok(response);
//        } catch (AuthenticationException e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//    }
//
//    @ExceptionHandler(UserNotFoundException.class)
//    @ResponseStatus(HttpStatus.NOT_FOUND)
//    public String handleUserNotFoundException(UserNotFoundException e) {
//        return e.getMessage();
//    }
    @PostMapping("/login")
    public ResponseEntity<loginResponseDto> login(@RequestBody loginRequestDto loginRequest) throws AuthenticationException {
        loginResponseDto response = loginService.validateUser(loginRequest);
        return ResponseEntity.ok(response);
    }
}