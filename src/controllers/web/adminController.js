const adminRepo = require('../../repositories/db/scheduleRepo');
const doctorRepo = require('../../repositories/db/doctorRepo');

class AdminController {
    async getDashboard(req, res) {
        try {
            const allSchedules = await adminRepo.getAll();
            const allDoctors = await doctorRepo.getAll();

            
            const doctorsWithSchedules = allDoctors.map(doctor => {
                const doctorSchedules = allSchedules
                    .filter(s => s.doctor_id === doctor.id)
                    .map(s => ({
                        id: s.id,
                        date: s.date.toISOString().split('T')[0],
                        time: s.time,
                        isBooked: s.is_booked
                    }));

                return { ...doctor, schedules: doctorSchedules };
            });

            res.render('admin/dashboard', { doctors: doctorsWithSchedules });
        } catch (error) {
            console.error("Помилка getDashboard:", error);
            res.status(500).send("Помилка сервера");
        }
    }

    async createSchedule(req, res) {
        try {
            const { doctorId, date, startTime, endTime, interval } = req.body;
            const durationMins = parseInt(interval) || 30;

            const [startHour, startMin] = startTime.split(':').map(Number);
            const [endHour, endMin] = endTime.split(':').map(Number);

            let currentMins = startHour * 60 + startMin;
            const finishMins = endHour * 60 + endMin;

            
            while (currentMins < finishMins) {
                const h = String(Math.floor(currentMins / 60)).padStart(2, '0');
                const m = String(currentMins % 60).padStart(2, '0');
                const timeString = `${h}:${m}:00`;

                await adminRepo.create(parseInt(doctorId), date, timeString);
                currentMins += durationMins;
            }

            res.redirect('/admin');
        } catch (error) {
            console.error("Error createSchedule:", error);
            res.status(500).send("Помилка генерації");
        }
    }

    async deleteSchedule(req, res) {
        try {
            await adminRepo.delete(req.params.id);
            res.redirect('/admin');
        } catch (error) {
            console.error("Error deleteSchedule:", error);
            res.status(500).send("Помилка видалення");
        }
    }

    
    
    
    async createDoctor(req, res) {
        try {
            const { name, specialty } = req.body;
            await doctorRepo.create({ name, specialty });
            res.redirect('/admin');
        } catch (error) {
            res.status(500).send("Помилка при додаванні лікаря");
        }
    }

    
    async editDoctorPage(req, res) {
        try {
            const id = parseInt(req.params.id);
            const doctor = await doctorRepo.getById(id);
            if (!doctor) return res.status(404).send("Лікаря не знайдено");
            res.render('admin/editDoctor', { doctor });
        } catch (error) {
            res.status(500).send("Помилка завантаження сторінки");
        }
    }

    
    async updateDoctor(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { name, specialty } = req.body;
            await doctorRepo.update(id, { name, specialty });
            res.redirect('/admin');
        } catch (error) {
            res.status(500).send("Помилка при оновленні даних");
        }
    }

    
    async deleteDoctor(req, res) {
        try {
            const id = parseInt(req.params.id);
            await doctorRepo.delete(id); 
            res.redirect('/admin');
        } catch (error) {
            res.status(500).send("Помилка при видаленні лікаря");
        }
    }
}

module.exports = new AdminController();