const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// POST /api/appointments           — patient books appointment
router.post('/', auth, bookAppointment);

// GET /api/appointments/my         — patient views their appointments
// NOTE: /my must be defined before /:id to avoid route conflicts
router.get('/my', auth, getMyAppointments);

// GET /api/appointments            — admin views all appointments
router.get('/', auth, adminAuth, getAllAppointments);

// PUT /api/appointments/:id/cancel — patient cancels their appointment
router.put('/:id/cancel', auth, cancelAppointment);

// PUT /api/appointments/:id/status — admin updates appointment status
router.put('/:id/status', auth, adminAuth, updateAppointmentStatus);

module.exports = router;
