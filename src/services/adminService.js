class AdminService {
    constructor(scheduleRepo) {
        this.scheduleRepo = scheduleRepo;
    }

    getAllSchedules() {
        return this.scheduleRepo.getAll();
    }

    addSchedule(scheduleData) {
        
        return this.scheduleRepo.create(scheduleData);
    }

    deleteSchedule(id) {
        return this.scheduleRepo.delete(id);
    }
}

module.exports = AdminService;