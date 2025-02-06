package com.inventarlista.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class UnauthorizedException extends RuntimeException {
    /**
     * Constructs a new UnauthorizedException with the specified detail message.
     *
     * @param message the detail message explaining the reason for the exception.
     */
    public UnauthorizedException(String message) {
        super(message);
    }
}
