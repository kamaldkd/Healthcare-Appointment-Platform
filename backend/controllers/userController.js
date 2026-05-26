const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'phone', 'gender', 'dob', 'address', 'image'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields provided for update.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully.', user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/users/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalDoctors,
      totalAppointments,
      totalPatients,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      recentAppointments,
    ] = await Promise.all([
      Doctor.countDocuments(),
      Appointment.countDocuments(),
      User.countDocuments({ role: 'patient' }),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'confirmed' }),
      Appointment.countDocuments({ status: 'completed' }),
      Appointment.countDocuments({ status: 'cancelled' }),
      Appointment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('patient', 'name email image')
        .populate('doctor', 'name specialty image fees'),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalDoctors,
        totalAppointments,
        totalPatients,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
        recentAppointments,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, getDashboardStats };
