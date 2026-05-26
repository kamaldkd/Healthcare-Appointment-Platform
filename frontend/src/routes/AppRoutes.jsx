import { Routes, Route, Navigate } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import AdminLayout from '../layouts/AdminLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import AdminRoute from '../components/AdminRoute'

import Home from '../pages/public/Home'
import About from '../pages/public/About'
import Doctors from '../pages/public/Doctors'
import DoctorDetail from '../pages/public/DoctorDetail'
import Login from '../pages/public/Login'
import Register from '../pages/public/Register'

import PatientDashboard from '../pages/patient/PatientDashboard'
import MyAppointments from '../pages/patient/MyAppointments'
import Profile from '../pages/patient/Profile'

import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageDoctors from '../pages/admin/ManageDoctors'
import ManageAppointments from '../pages/admin/ManageAppointments'

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Patient protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/dashboard/appointments" element={<MyAppointments />} />
          <Route path="/dashboard/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Admin protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/doctors" element={<ManageDoctors />} />
            <Route path="/admin/appointments" element={<ManageAppointments />} />
          </Route>
        </Route>
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
