const express = require('express');
const path = require('path');
const doctorRoutes = require('./src/routes/doctorRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const { logAction } = require('./src/utils/logger');

const app = express();
const PORT = 3000;

require('./src/config/db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    logAction(`Отримано запит: ${req.method} ${req.url}`);
    next(); 
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/doctors', doctorRoutes);
app.use('/admin', adminRoutes);
app.use('/bookings', bookingRoutes);

app.get('/', (req, res) => {
    res.redirect('/doctors');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});