class BookingService {
    constructor(bookingRepo) {
        this.bookingRepo = bookingRepo;
    }

    getAllBookings() {
        return this.bookingRepo.getAll();
    }

    createBooking(bookingData) {
        return this.bookingRepo.create(bookingData);
    }

    cancelBooking(id) {
        return this.bookingRepo.delete(id);
    }
}

module.exports = BookingService;