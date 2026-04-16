const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'polyclinic_db',
    password: 'mysecretpassword',
    port: 5433, 
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Помилка підключення:', err.stack);
    } else {
        console.log('Підключено до PostgreSQL через Docker');
        release();
    }
});

module.exports = pool;