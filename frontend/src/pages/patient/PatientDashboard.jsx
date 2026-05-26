import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMyAppointments } from '../../services/appointmentService'
import AppointmentBadge from '../../components/AppointmentBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#10b981',
  completed: '#3b82f6',
  cancelled: '#ef4444',
}

function StatCard({ title, value, icon, bgColor, textColor, borderColor }) {
  return (
    <div className={`card flex items-center gap-4 border-l-4 ${borderColor}`}>
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>
    </div>
  )
}

function PatientDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMyAppointments()
      .then(res => setAppointments(res.data.appointments || res.data || []))
      .catch(() => setError('Failed to load appointments.'))
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(a => ['pending', 'confirmed'].includes(a.status?.toLowerCase())).length,
    completed: appointments.filter(a => a.status?.toLowerCase() === 'completed').length,
    cancelled: appointments.filter(a => a.status?.toLowerCase() === 'cancelled').length,
  }

  const chartData = [
    { name: 'Pending', count: appointments.filter(a => a.status?.toLowerCase() === 'pending').length, color: STATUS_COLORS.pending },
    { name: 'Confirmed', count: appointments.filter(a => a.status?.toLowerCase() === 'confirmed').length, color: STATUS_COLORS.confirmed },
    { name: 'Completed', count: appointments.filter(a => a.status?.toLowerCase() === 'completed').length, color: STATUS_COLORS.completed },
    { name: 'Cancelled', count: appointments.filter(a => a.status?.toLowerCase() === 'cancelled').length, color: STATUS_COLORS.cancelled },
  ]

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const statCards = [
    { title: 'Total Appointments', value: stats.total, icon: '📋', bgColor: 'bg-blue-100', textColor: 'text-blue-700', borderColor: 'border-blue-500' },
    { title: 'Upcoming', value: stats.upcoming, icon: '📅', bgColor: 'bg-amber-100', textColor: 'text-amber-700', borderColor: 'border-amber-500' },
    { title: 'Completed', value: stats.completed, icon: '✅', bgColor: 'bg-green-100', textColor: 'text-green-700', borderColor: 'border-green-500' },
    { title: 'Cancelled', value: stats.cancelled, icon: '❌', bgColor: 'bg-red-100', textColor: 'text-red-700', borderColor: 'border-red-500' },
  ]

  if (loading) return <LoadingSpinner text="Loading your dashboard..." />

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Good day, <span className="text-primary-600">{user?.name?.split(' ')[0] || 'Patient'}</span>! 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's an overview of your health appointments</p>
      </div>

      {error && (
        <div className="alert-error">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="card lg:col-span-1">
          <h2 className="font-bold text-gray-800 mb-4">Appointments Overview</h2>
          {appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <span className="text-4xl mb-2">📊</span>
              <p className="text-sm">No data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quick actions */}
        <div className="card lg:col-span-2">
          <h2 className="font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Link
              to="/doctors"
              className="flex flex-col items-center gap-3 p-5 bg-primary-50 rounded-2xl hover:bg-primary-100 transition-colors group"
            >
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-primary-700 text-center">Book New Appointment</span>
            </Link>
            <Link
              to="/dashboard/appointments"
              className="flex flex-col items-center gap-3 p-5 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors group"
            >
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-green-700 text-center">View All Appointments</span>
            </Link>
            <Link
              to="/dashboard/profile"
              className="flex flex-col items-center gap-3 p-5 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors group"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-purple-700 text-center">Update Profile</span>
            </Link>
          </div>

          {/* Health tip */}
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-5 border border-primary-100">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold text-primary-800 mb-1">Health Tip of the Day</h3>
                <p className="text-sm text-primary-600">Regular health checkups help detect problems early. Book a preventive consultation today!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-800">Recent Appointments</h2>
          <Link to="/dashboard/appointments" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all →
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <h3 className="font-semibold text-gray-700 mb-2">No appointments yet</h3>
            <p className="text-gray-500 text-sm mb-5">Book your first appointment with a specialist today</p>
            <Link to="/doctors" className="btn-primary">Book Appointment</Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Fees</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map(appt => (
                  <tr key={appt._id}>
                    <td>
                      <div className="font-medium text-gray-800">
                        {appt.doctorId?.name || appt.doctor?.name || 'Doctor'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {appt.doctorId?.specialty || appt.doctor?.specialty || ''}
                      </div>
                    </td>
                    <td>
                      <div className="text-gray-800">{appt.date || '—'}</div>
                      <div className="text-xs text-gray-400">{appt.time || ''}</div>
                    </td>
                    <td>
                      <span className="font-medium text-gray-800">
                        ₹{appt.fees || appt.doctorId?.fees || 0}
                      </span>
                    </td>
                    <td>
                      <AppointmentBadge status={appt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientDashboard
