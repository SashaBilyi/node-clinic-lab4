const express = require('express');

const doctorController = require('../controllers/web/doctorController');

const router = express.Router();

router.get('/', (req, res) => doctorController.listDoctors(req, res));
router.get('/:id/schedule', (req, res) => doctorController.getDoctorSchedule(req, res));

module.exports = router;