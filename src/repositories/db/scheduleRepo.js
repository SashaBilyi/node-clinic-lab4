const pool = require('../../config/db');

class ScheduleRepoDB {
    
    async getAll() {
        const result = await pool.query('SELECT * FROM schedules ORDER BY date ASC, time ASC');
        return result.rows;
    }

    async create(doctorId, date, time) {
        const result = await pool.query(
            'INSERT INTO schedules (doctor_id, date, time) VALUES ($1, $2, $3) RETURNING *',
            [doctorId, date, time]
        );
        return result.rows[0];
    }

    async delete(id) {
        
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN'); 

            await client.query(
                'UPDATE bookings SET is_cancelled = true WHERE schedule_id = $1',
                [id]
            );

            await client.query('DELETE FROM schedules WHERE id = $1', [id]);

            await client.query('COMMIT'); 
            return true;
        } catch (error) {
            await client.query('ROLLBACK'); 
            console.error("Помилка при видаленні слоту:", error);
            throw error;
        } finally {
            client.release(); 
        }
    }
}

module.exports = new ScheduleRepoDB();