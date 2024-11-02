package com.inventarlista.persistance.rest;
import com.inventarlista.exceptions.ConflictException;
import com.inventarlista.exceptions.InvalidCredentialsException;
import com.inventarlista.exceptions.NotFoundException;
import com.inventarlista.exceptions.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.lang.invoke.MethodHandles;
import java.util.List;

/**
 * Central exception handler used to handle validation and conflict exceptions.
 */
@RestControllerAdvice
public class ApplicationExceptionHandler {
  private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  @ExceptionHandler
  @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
  @ResponseBody
  public ValidationErrorRestDto handleValidationException(ValidationException e) {
    LOG.warn("Terminating request processing with status 422 due to {}: {}", e.getClass().getSimpleName(), e.getMessage());
    return new ValidationErrorRestDto(e.summary(), e.errors());
  }

  @ExceptionHandler
  @ResponseStatus(HttpStatus.CONFLICT)
  @ResponseBody
  public ValidationErrorRestDto handleConflictException(ConflictException e) {
    LOG.warn("Terminating request processing with status 409 due to {}: {}", e.getClass().getSimpleName(), e.getMessage());
    return new ValidationErrorRestDto(e.summary(), e.errors());
  }

  @ExceptionHandler
  @ResponseStatus(HttpStatus.NOT_FOUND)
  @ResponseBody
  public ValidationErrorRestDto handleNotFoundException(NotFoundException e) {
    LOG.warn("Terminating request processing with status 404 due to {}: {}", e.getClass().getSimpleName(), e.getMessage());
    return new ValidationErrorRestDto("User not found", List.of(e.getMessage()));
  }

  @ExceptionHandler
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  @ResponseBody
  public ValidationErrorRestDto handleInvalidCredentialsException(InvalidCredentialsException e) {
    LOG.warn("Terminating request processing with status 401 due to {}: {}", e.getClass().getSimpleName(), e.getMessage());
    return new ValidationErrorRestDto("Invalid credentials", List.of(e.getMessage()));
  }
}
