const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  addDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// GET /api/doctors        — public
router.get('/', getAllDoctors);

// GET /api/doctors/:id    — public
router.get('/:id', getDoctorById);

// POST /api/doctors       — admin only
router.post('/', auth, adminAuth, addDoctor);

// PUT /api/doctors/:id    — admin only
router.put('/:id', auth, adminAuth, updateDoctor);

// DELETE /api/doctors/:id — admin only
router.delete('/:id', auth, adminAuth, deleteDoctor);

module.exports = router;
