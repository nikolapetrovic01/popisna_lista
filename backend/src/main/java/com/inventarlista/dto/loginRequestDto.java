package com.inventarlista.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record loginRequestDto(

        @NotBlank
        @Size(min = 3, max = 30)
        String name,
        String password,
        boolean rememberMe
) {}