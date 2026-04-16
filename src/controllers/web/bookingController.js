const bookingRepo = require('../../repositories/db/bookingRepo');

class BookingController {
    
    async listBookings(req, res) {
        try {
            const bookings = await bookingRepo.getAllBookings();
            
            
            const formattedBookings = bookings.map(b => ({
                id: b.id,
                doctorName: b.doctor_name,
                patientName: b.patient_name,
                appointmentDate: b.appointment_date.toISOString().split('T')[0], 
                appointmentTime: b.appointment_time,
                isCancelled: b.is_cancelled
            }));

            res.render('user/bookingsList', { bookings: formattedBookings });
        } catch (error) {
            console.error("Помилка завантаження записів:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    
    async bookAppointment(req, res) {
        const { scheduleId, patientName } = req.body;
        
        try {
            
            await bookingRepo.bookAppointment(scheduleId, patientName);
            res.redirect('/bookings');
        } catch (error) {
            
            res.status(400).send(`Помилка запису: ${error.message}`);
        }
    }

    
    async cancel(req, res) {
        const id = req.params.id;
        try {
            await bookingRepo.cancelBooking(id);
            res.redirect('/bookings');
        } catch (error) {
            console.error("Помилка скасування:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = new BookingController();