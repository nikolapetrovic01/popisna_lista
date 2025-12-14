package com.inventarlista.dto;

public record createUserDto(
        String name,
        int level,
        String password
) {
}
