package com.inventarlista.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public record createUserDto(

        @NotBlank
        @Size(min = 3, max = 30)
        String name,

        @Min(0)
        @Max(3)
        int level,

        @Size(min = 8)
        String password
) {
}
