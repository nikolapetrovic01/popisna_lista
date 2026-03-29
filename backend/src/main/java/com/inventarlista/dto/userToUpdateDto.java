package com.inventarlista.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record userToUpdateDto(
        @NotNull
        int id,
        @Size(min = 3, max = 30)
        String name,
        @NotNull
        @Min(0)
        @Max(3)
        int level
) {
}
