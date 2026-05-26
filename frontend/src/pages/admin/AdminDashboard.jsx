import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAdminStats } from '../../services/userService'
import { getAllAppointments } from '../../services/appointmentService'
import { getAllDoctors } from '../../services/doctorService'
import AppointmentBadge from '../../components/AppointmentBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'

const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#10b981',
  completed: '#3b82f6',
  cancelled: '#ef4444',
}

function AdminDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
  })

  useEffect(() => {
    Promise.all([
      getAllAppointments().catch(() => ({ data: [] })),
      getAllDoctors().catch(() => ({ data: [] })),
      getAdminStats().catch(() => ({ data: null })),
    ])
      .then(([apptRes, docRes, statsRes]) => {
        const appts = apptRes.data.appointments || apptRes.data || []
        const docs = docRes.data.doctors || docRes.data || []
        const s = statsRes.data

        setAppointments(appts)
        setTotalDoctors(docs.length)

        if (s) {
          setStats({
            totalDoctors: s.totalDoctors || docs.length,
            totalPatients: s.totalPatients || 0,
            totalAppointments: s.totalAppointments || appts.length,
            pendingAppointments: s.pendingAppointments || appts.filter(a => a.status?.toLowerCase() === 'pending').length,
          })
        } else {
          setStats({
            totalDoctors: docs.length,
            totalPatients: new Set(appts.map(a => a.patient?._id || a.userId || a.user?._id)).size,
            totalAppointments: appts.length,
            pendingAppointments: appts.filter(a => a.status?.toLowerCase() === 'pending').length,
          })
        }
      })
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false))
  }, [])

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
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: '👨‍⚕️',
      bgColor: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      border: 'border-blue-500',
    },
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: '👥',
      bgColor: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      border: 'border-purple-500',
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: '📅',
      bgColor: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
      border: 'border-green-500',
    },
    {
      title: 'Pending',
      value: stats.pendingAppointments,
      icon: '⏳',
      bgColor: 'bg-amber-500',
      gradient: 'from-amber-500 to-amber-600',
      border: 'border-amber-500',
    },
  ]

  if (loading) return <LoadingSpinner text="Loading admin dashboard..." />

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Dashboard 👋
        </h1>
        <p className="text-gray-500 mt-1">Welcome back, <span className="text-primary-600 font-semibold">{user?.name}</span>. Here's what's happening today.</p>
      </div>

      {error && (
        <div className="alert-error">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.title} className={`card flex items-center gap-4 border-l-4 ${s.border}`}>
            <div className={`w-14 h-14 bg-gradient-to-br ${s.gradient} rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
              {s.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="card lg:col-span-1">
          <h2 className="font-bold text-gray-800 mb-4">Appointments by Status</h2>
          {appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-52 text-gray-400">
              <span className="text-4xl mb-2">📊</span>
              <p className="text-sm">No appointment data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }} />
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
          <h2 className="font-bold text-gray-800 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { to: '/admin/doctors', icon: '➕', label: 'Add Doctor', bg: 'bg-blue-50', hover: 'hover:bg-blue-100', iconBg: 'bg-blue-600', text: 'text-blue-700' },
              { to: '/admin/appointments', icon: '📋', label: 'View Appointments', bg: 'bg-green-50', hover: 'hover:bg-green-100', iconBg: 'bg-green-600', text: 'text-green-700' },
              { to: '/admin/doctors', icon: '👨‍⚕️', label: 'Manage Doctors', bg: 'bg-purple-50', hover: 'hover:bg-purple-100', iconBg: 'bg-purple-600', text: 'text-purple-700' },
            ].map(action => (
              <Link
                key={action.to + action.label}
                to={action.to}
                className={`flex flex-col items-center gap-3 p-5 ${action.bg} ${action.hover} rounded-2xl transition-colors group`}
              >
                <div className={`w-12 h-12 ${action.iconBg} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                  <span className="text-white text-lg">{action.icon}</span>
                </div>
                <span className={`text-sm font-semibold ${action.text} text-center`}>{action.label}</span>
              </Link>
            ))}
          </div>

          {/* Platform summary */}
          <div className="mt-5 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl border border-primary-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary-800">Platform Health</h3>
                <p className="text-sm text-primary-600 mt-0.5">All systems operational ✅</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary-700">
                  {appointments.length > 0
                    ? Math.round((appointments.filter(a => a.status?.toLowerCase() === 'completed').length / appointments.length) * 100)
                    : 0
                  }%
                </div>
                <div className="text-xs text-primary-500">Completion rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-800">Recent Appointments</h2>
          <Link to="/admin/appointments" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all →
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500">No appointments yet on the platform.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Fees</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map(appt => (
                  <tr key={appt._id}>
                    <td className="font-medium text-gray-800">
                      {appt.patient?.name || appt.userId?.name || appt.user?.name || appt.patientName || '—'}
                    </td>
                    <td>
                      <div className="font-medium text-gray-800">
                        {appt.doctorId?.name || appt.doctor?.name || '—'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {appt.doctorId?.specialty || appt.doctor?.specialty || ''}
                      </div>
                    </td>
                    <td>
                      <div>{appt.date || '—'}</div>
                      <div className="text-xs text-gray-400">{appt.time || ''}</div>
                    </td>
                    <td className="font-medium">₹{appt.fees || appt.doctorId?.fees || 0}</td>
                    <td><AppointmentBadge status={appt.status} /></td>
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

export default AdminDashboard
