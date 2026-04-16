const pool = require('../../config/db');

class DoctorRepoDB {
    
    async getAll() {
        
        const result = await pool.query('SELECT * FROM doctors ORDER BY id ASC');
        return result.rows; 
    }

    
    async getById(id) {
        const result = await pool.query('SELECT * FROM doctors WHERE id = $1', [id]);
        return result.rows[0];
    }

    
    async create(doctorData) {
        const { name, specialty } = doctorData;
        const result = await pool.query(
            'INSERT INTO doctors (name, specialty) VALUES ($1, $2) RETURNING *',
            [name, specialty]
        );
        return result.rows[0]; 
    }

    
    
    async update(id, doctorData) {
        const { name, specialty } = doctorData;
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN'); 

            
            const oldDocRes = await client.query('SELECT name FROM doctors WHERE id = $1', [id]);
            const oldName = oldDocRes.rows[0]?.name;

            
            const result = await client.query(
                'UPDATE doctors SET name = $1, specialty = $2 WHERE id = $3 RETURNING *',
                [name, specialty, id]
            );

            
            if (oldName && oldName !== name) {
                await client.query(
                    'UPDATE bookings SET doctor_name = $1 WHERE doctor_name = $2',
                    [name, oldName]
                );
            }

            await client.query('COMMIT'); 
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK'); 
            console.error("Помилка оновлення лікаря:", error);
            throw error;
        } finally {
            client.release();
        }
    }

    
    async delete(id) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN'); 

            await client.query(`
                UPDATE bookings 
                SET is_cancelled = true 
                WHERE schedule_id IN (SELECT id FROM schedules WHERE doctor_id = $1)
            `, [id]);

            await client.query('DELETE FROM doctors WHERE id = $1', [id]);

            await client.query('COMMIT'); 
            return true;
        } catch (error) {
            await client.query('ROLLBACK'); 
            console.error("Помилка при видаленні лікаря:", error);
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new DoctorRepoDB();