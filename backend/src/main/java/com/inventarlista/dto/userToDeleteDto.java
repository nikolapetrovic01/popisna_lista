package com.inventarlista.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record userToDeleteDto(
        @Positive(message = "idToDelete must be positive")
        @NotNull(message = "idToDelete must not be null")
        int idToDelete,
        @Positive(message = "idLoggedIn must be positive")
        @NotNull(message = "idLoggedIn must not be null")
        int idLoggedIn
) {}
