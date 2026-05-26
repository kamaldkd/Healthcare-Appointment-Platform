const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get all doctors (with optional filters)
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res, next) => {
  try {
    const { specialty, search } = req.query;
    const filter = {};

    if (specialty) {
      filter.specialty = { $regex: specialty, $options: 'i' };
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const doctors = await Doctor.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: doctors.length, doctors });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new doctor
// @route   POST /api/doctors
// @access  Private / Admin
const addDoctor = async (req, res, next) => {
  try {
    const { name, specialty, experience, fees, image, about, available, education, address } = req.body;

    if (!name || !specialty || experience === undefined || fees === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, specialty, experience, and fees are required.',
      });
    }

    const doctor = await Doctor.create({ name, specialty, experience, fees, image, about, available, education, address });
    res.status(201).json({ success: true, message: 'Doctor added successfully.', doctor });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor details
// @route   PUT /api/doctors/:id
// @access  Private / Admin
const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const allowedFields = ['name', 'specialty', 'experience', 'fees', 'image', 'about', 'available', 'education', 'address'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    const updatedDoctor = await doctor.save();
    res.status(200).json({ success: true, message: 'Doctor updated successfully.', doctor: updatedDoctor });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a doctor and cancel their pending appointments
// @route   DELETE /api/doctors/:id
// @access  Private / Admin
const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const cancelResult = await Appointment.updateMany(
      { doctor: doctor._id, status: { $in: ['pending', 'confirmed'] } },
      { status: 'cancelled' }
    );

    await doctor.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully.',
      cancelledAppointments: cancelResult.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllDoctors, getDoctorById, addDoctor, updateDoctor, deleteDoctor };
