package com.inventarlista.dto;

public record loginRequestDto(
        String name,
        String password,
        boolean rememberMe
) {}