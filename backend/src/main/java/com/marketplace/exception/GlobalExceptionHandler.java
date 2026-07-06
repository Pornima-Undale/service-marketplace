package com.marketplace.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(
            UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleUserNotFound(
            UserNotFoundException ex) {

        return Map.of(
                "error",
                ex.getMessage()
        );
    }

    @ExceptionHandler(
            ServiceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleServiceNotFound(
            ServiceNotFoundException ex) {

        return Map.of(
                "error",
                ex.getMessage()
        );
    }

    @ExceptionHandler(
            BookingNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleBookingNotFound(
            BookingNotFoundException ex) {

        return Map.of(
                "error",
                ex.getMessage()
        );
    }
}