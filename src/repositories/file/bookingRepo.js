const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../../../data/bookings.json');

class BookingRepository {
    getAll() {
        
        return fs.readFile(dataPath, 'utf-8')
            .then(data => JSON.parse(data));
    }

    create(newBooking) {
        return this.getAll()
            .then(bookings => {
                
                newBooking.id = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
                newBooking.dateBooked = new Date().toISOString();
                
                bookings.push(newBooking);
                
                
                return fs.writeFile(dataPath, JSON.stringify(bookings, null, 2), 'utf-8')
                    .then(() => newBooking); 
            });
    }

    delete(id) {
        return this.getAll()
            .then(bookings => {
                const initialLength = bookings.length;
                const filtered = bookings.filter(b => b.id !== parseInt(id));
                
                if (filtered.length < initialLength) {
                    return fs.writeFile(dataPath, JSON.stringify(filtered, null, 2), 'utf-8')
                        .then(() => true);
                }
                return Promise.resolve(false);
            });
    }
}

module.exports = new BookingRepository();