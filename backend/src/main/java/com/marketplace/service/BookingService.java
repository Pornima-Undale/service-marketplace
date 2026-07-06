package com.marketplace.service;

import com.marketplace.dto.BookingResponseDto;
import com.marketplace.entity.Booking;
import com.marketplace.entity.BookingStatus;
import com.marketplace.exception.BookingNotFoundException;
import com.marketplace.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private BookingResponseDto convertToDto(
            Booking booking) {

        BookingResponseDto dto =
                new BookingResponseDto();

        dto.setId(booking.getId());
        dto.setBookingDate(
                booking.getBookingDate());

        dto.setStatus(
                booking.getStatus().name());

        if(booking.getCustomer() != null) {
            dto.setCustomerName(
                    booking.getCustomer().getName()
            );
        }

        if(booking.getService() != null) {
            dto.setServiceTitle(
                    booking.getService().getTitle()
            );
        }

        return dto;
    }

    private final BookingRepository bookingRepository;

    public BookingService(
            BookingRepository bookingRepository) {

        this.bookingRepository = bookingRepository;
    }

    public Booking saveBooking(
            Booking booking) {

        booking.setStatus(BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }

    public List<BookingResponseDto> getAllBookings() {

        return bookingRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    public Booking acceptBooking(Long id) {

        Booking booking =
                bookingRepository.findById(id)
                        .orElseThrow(() ->
                                new BookingNotFoundException(
                                        "Booking not found"));

        booking.setStatus(
                BookingStatus.ACCEPTED);

        return bookingRepository.save(booking);
    }

    public Booking completeBooking(Long id) {

        Booking booking =
                bookingRepository.findById(id)
                        .orElseThrow(() ->
                                new BookingNotFoundException(
                                        "Booking not found"));

        booking.setStatus(
                BookingStatus.COMPLETED);

        return bookingRepository.save(booking);
    }

}