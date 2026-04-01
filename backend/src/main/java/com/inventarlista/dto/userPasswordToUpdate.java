package com.inventarlista.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record userPasswordToUpdate(
        @NotNull
        int id,
        @Size(min = 8)
        String password
) {
}
