const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../../../data/schedule.json');

class ScheduleRepository {
    
    getAll() {
        const data = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(data);
    }

    getById(id) {
        const schedules = this.getAll();
        return schedules.find(s => s.id === parseInt(id));
    }

    
    create(newSchedule) {
        const schedules = this.getAll();
        
        newSchedule.id = schedules.length > 0 ? Math.max(...schedules.map(s => s.id)) + 1 : 1;
        newSchedule.isBooked = false; 
        
        schedules.push(newSchedule);
        fs.writeFileSync(dataPath, JSON.stringify(schedules, null, 2), 'utf-8');
        return newSchedule;
    }

    
    updateStatus(id, isBookedStatus) {
        const schedules = this.getAll();
        const index = schedules.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            schedules[index].isBooked = isBookedStatus;
            fs.writeFileSync(dataPath, JSON.stringify(schedules, null, 2), 'utf-8');
            return true;
        }
        return false;
    }
    
    
    delete(id) {
        let schedules = this.getAll();
        const initialLength = schedules.length;
        schedules = schedules.filter(s => s.id !== parseInt(id));
        
        if (schedules.length < initialLength) {
            fs.writeFileSync(dataPath, JSON.stringify(schedules, null, 2), 'utf-8');
            return true;
        }
        return false;
    }
}

module.exports = new ScheduleRepository();