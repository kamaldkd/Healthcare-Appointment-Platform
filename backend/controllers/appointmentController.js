const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, time, notes } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ success: false, message: 'Doctor ID, date, and time are required.' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }
    if (!doctor.available) {
      return res.status(400).json({ success: false, message: 'This doctor is currently not available for appointments.' });
    }

    // Check for conflicting appointment (same doctor, same date, same time, not cancelled)
    const conflict = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      status: { $in: ['pending', 'confirmed'] },
    });
    if (conflict) {
      return res.status(409).json({ success: false, message: 'This time slot is already booked. Please choose another time.' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      fees: doctor.fees,
      notes: notes || '',
    });

    const populated = await appointment.populate([
      { path: 'doctor', select: 'name specialty fees image address' },
      { path: 'patient', select: 'name email phone image' },
    ]);

    res.status(201).json({ success: true, message: 'Appointment booked successfully.', appointment: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in patient's appointments
// @route   GET /api/appointments/my
// @access  Private (Patient)
const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name specialty fees image address about')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an appointment (patient)
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Patient)
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Validate ownership
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to cancel this appointment.' });
    }

    if (!['pending', 'confirmed'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an appointment with status '${appointment.status}'.`,
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({ success: true, message: 'Appointment cancelled successfully.', appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments (admin)
// @route   GET /api/appointments
// @access  Private (Admin)
const getAllAppointments = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone image gender')
      .populate('doctor', 'name specialty fees image')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (admin)
// @route   PUT /api/appointments/:id/status
// @access  Private (Admin)
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}.`,
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    appointment.status = status;
    await appointment.save();

    const populated = await appointment.populate([
      { path: 'patient', select: 'name email phone image' },
      { path: 'doctor', select: 'name specialty fees image' },
    ]);

    res.status(200).json({ success: true, message: 'Appointment status updated.', appointment: populated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
};
