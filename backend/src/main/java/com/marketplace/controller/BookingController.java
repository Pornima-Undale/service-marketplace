package com.marketplace.controller;

import com.marketplace.dto.BookingRequestDto;
import com.marketplace.dto.BookingResponseDto;
import com.marketplace.entity.Booking;
import com.marketplace.entity.MarketplaceService;
import com.marketplace.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking createBooking(
            @RequestBody BookingRequestDto request) {

        Booking booking = new Booking();
        booking.setBookingDate(request.getBookingDate());

        MarketplaceService service = new MarketplaceService();
        service.setId(request.getServiceId());
        booking.setService(service);

        return bookingService.saveBooking(booking);
    }

    @GetMapping
    public List<BookingResponseDto> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PutMapping("/{id}/accept")
    public Booking acceptBooking(
            @PathVariable Long id) {
        return bookingService.acceptBooking(id);
    }

    @PutMapping("/{id}/complete")
    public Booking completeBooking(
            @PathVariable Long id) {
        return bookingService.completeBooking(id);
    }
}
