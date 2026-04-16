const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../../../data/doctors.json');

class DoctorRepository {
    async getAll() {
        const data = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    }

    async getById(id) {
        const data = await fs.readFile(dataPath, 'utf-8');
        const doctors = JSON.parse(data);
        return doctors.find(d => d.id === parseInt(id));
    }
}

module.exports = new DoctorRepository();