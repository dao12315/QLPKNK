package com.clinic.backend.common.exception;

import com.clinic.backend.common.response.ErrorResponse;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 400 - custom business
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntime(
            RuntimeException ex,
            HttpServletRequest request
    ) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    // 404
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            EntityNotFoundException ex,
            HttpServletRequest request
    ) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    // 500 fallback
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAll(
            Exception ex,
            HttpServletRequest request
    ) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), request);
    }

    private ResponseEntity<ErrorResponse> build(
            HttpStatus status,
            String message,
            HttpServletRequest request
    ) {
        ErrorResponse res = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(request.getRequestURI())
                .build();

        return new ResponseEntity<>(res, status);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(e -> e.getField() + " " + e.getDefaultMessage())
                .orElse("Validation error");

        return build(HttpStatus.BAD_REQUEST, message, request);
    }
}