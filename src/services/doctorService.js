class DoctorService {
    constructor(repository) {
        this.repository = repository;
    }

    async getAllDoctors() {
        return await this.repository.getAll();
    }

    async getDoctorById(id) {
        return await this.repository.getById(id);
    }
}

module.exports = DoctorService;