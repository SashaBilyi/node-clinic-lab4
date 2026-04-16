const express = require('express');
const bookingController = require('../controllers/web/bookingController');

const router = express.Router();

router.get('/', (req, res) => bookingController.listBookings(req, res));
router.post('/add', (req, res) => bookingController.bookAppointment(req, res));
router.post('/cancel/:id', (req, res) => bookingController.cancel(req, res));

module.exports = router;