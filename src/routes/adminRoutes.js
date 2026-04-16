const express = require('express');
const adminController = require('../controllers/web/adminController');

const router = express.Router();

router.get('/', (req, res) => adminController.getDashboard(req, res));
router.post('/add', (req, res) => adminController.createSchedule(req, res));
router.post('/delete/:id', (req, res) => adminController.deleteSchedule(req, res));

router.post('/doctors/add', (req, res) => adminController.createDoctor(req, res));
router.get('/doctors/edit/:id', (req, res) => adminController.editDoctorPage(req, res));
router.post('/doctors/update/:id', (req, res) => adminController.updateDoctor(req, res));
router.post('/doctors/delete/:id', (req, res) => adminController.deleteDoctor(req, res));

module.exports = router;