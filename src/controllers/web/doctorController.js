const doctorRepo = require('../../repositories/db/doctorRepo');
const scheduleRepo = require('../../repositories/db/scheduleRepo');

class DoctorController {
    
    async listDoctors(req, res) {
        try {
            const doctors = await doctorRepo.getAll();
            res.render('user/doctorsList', { doctors });
        } catch (error) {
            console.error("Помилка:", error);
            res.status(500).send("Помилка БД");
        }
    }

    
    async getDoctorSchedule(req, res) {
        try {
            const doctorId = parseInt(req.params.id);
            const doctor = await doctorRepo.getById(doctorId);

            if (!doctor) return res.status(404).send("Лікаря не знайдено");

            const allSchedules = await scheduleRepo.getAll();
            
            
            const doctorSchedules = allSchedules
                .filter(s => s.doctor_id === doctorId)
                .map(s => ({
                    id: s.id,
                    date: s.date.toISOString().split('T')[0], 
                    time: s.time,
                    isBooked: s.is_booked 
                }));

            res.render('user/doctorSchedule', { doctor, schedules: doctorSchedules });
        } catch (error) {
            console.error("Помилка getDoctorSchedule:", error);
            res.status(500).send("Помилка БД");
        }
    }
}


module.exports = new DoctorController();