const pool = require('../../config/db');

class BookingRepoDB {
    
    async bookAppointment(scheduleId, patientName) {
        
        const client = await pool.connect(); 

        try {
            await client.query('BEGIN'); 

            const scheduleRes = await client.query(
                'SELECT * FROM schedules WHERE id = $1 FOR UPDATE',
                [scheduleId]
            );

            if (scheduleRes.rows.length === 0) {
                throw new Error('Слот не знайдено');
            }

            const schedule = scheduleRes.rows[0];

            if (schedule.is_booked) {
                throw new Error('Цей час вже щойно зайняв інший пацієнт');
            }

            const doctorRes = await client.query(
                'SELECT name FROM doctors WHERE id = $1',
                [schedule.doctor_id]
            );
            const doctorName = doctorRes.rows[0].name;

            await client.query(
                'UPDATE schedules SET is_booked = true WHERE id = $1',
                [scheduleId]
            );

            await client.query(
                `INSERT INTO bookings 
                (schedule_id, patient_name, doctor_name, appointment_date, appointment_time) 
                VALUES ($1, $2, $3, $4, $5)`,
                [scheduleId, patientName, doctorName, schedule.date, schedule.time]
            );

            await client.query('COMMIT'); 
            return true;

        } catch (error) {
            await client.query('ROLLBACK'); 
            console.error("Транзакцію скасовано (ROLLBACK):", error.message);
            throw error; 
        } finally {
            client.release(); 
        }
    }

    async getAllBookings() {
        const result = await pool.query('SELECT * FROM bookings ORDER BY appointment_date DESC, appointment_time DESC');
        return result.rows;
    }

    async cancelBooking(bookingId) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const bookingRes = await client.query('SELECT schedule_id FROM bookings WHERE id = $1', [bookingId]);
            const scheduleId = bookingRes.rows[0]?.schedule_id;

            if (scheduleId) {
                await client.query('UPDATE schedules SET is_booked = false WHERE id = $1', [scheduleId]);
            }

            await client.query('DELETE FROM bookings WHERE id = $1', [bookingId]);
            
            await client.query('COMMIT');
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new BookingRepoDB();