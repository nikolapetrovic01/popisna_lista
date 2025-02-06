package com.inventarlista.exceptions;

import java.util.List;

/**
 * Dto describing a validation error.
 *
 * @param message Message attached to the validation error
 * @param errors  List of validation errors that occured
 */
public record ValidationErrorRestDto(
    String message,
    List<String> errors
) {
}
