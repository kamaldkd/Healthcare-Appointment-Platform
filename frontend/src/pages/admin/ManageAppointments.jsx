import { useState, useEffect, useCallback } from 'react'
import { getAllAppointments, updateAppointmentStatus } from '../../services/appointmentService'
import AppointmentBadge from '../../components/AppointmentBadge'
import LoadingSpinner from '../../components/LoadingSpinner'

const TABS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled']
const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled']

function ManageAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const fetchAppointments = useCallback(() => {
    setLoading(true)
    getAllAppointments()
      .then(res => setAppointments(res.data.appointments || res.data || []))
      .catch(() => setError('Failed to load appointments.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchAppointments() }, [fetchAppointments])

  const filtered = activeTab === 'All'
    ? appointments
    : appointments.filter(a => a.status?.toLowerCase() === activeTab.toLowerCase())

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id)
    setError(null)
    try {
      await updateAppointmentStatus(id, newStatus)
      setAppointments(prev =>
        prev.map(a => a._id === id ? { ...a, status: newStatus } : a)
      )
      setSuccess(`Appointment status updated to "${newStatus}".`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const counts = {
    All: appointments.length,
    Pending: appointments.filter(a => a.status?.toLowerCase() === 'pending').length,
    Confirmed: appointments.filter(a => a.status?.toLowerCase() === 'confirmed').length,
    Completed: appointments.filter(a => a.status?.toLowerCase() === 'completed').length,
    Cancelled: appointments.filter(a => a.status?.toLowerCase() === 'cancelled').length,
  }

  if (loading) return <LoadingSpinner text="Loading appointments..." />

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Appointments</h1>
        <p className="text-gray-500 mt-1">View and update all appointments across the platform</p>
      </div>

      {success && (
        <div className="alert-success">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </div>
      )}
      {error && (
        <div className="alert-error">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: counts.All, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'Pending', count: counts.Pending, color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'Confirmed', count: counts.Confirmed, color: 'bg-green-50 text-green-700 border-green-200' },
          { label: 'Completed', count: counts.Completed, color: 'bg-primary-50 text-primary-700 border-primary-200' },
        ].map(s => (
          <div key={s.label} className={`flex items-center gap-3 p-4 rounded-2xl border ${s.color}`}>
            <div className="text-2xl font-bold">{s.count}</div>
            <div className="text-sm font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Status tabs */}
      <div className="card p-1.5">
        <div className="flex flex-wrap gap-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${activeTab === tab ? 'tab-btn-active' : 'tab-btn'} flex items-center gap-2`}
            >
              {tab}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20' : 'bg-gray-100'}`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Appointments table */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-3">📭</div>
          <h3 className="font-semibold text-gray-700 mb-2">
            No {activeTab === 'All' ? '' : activeTab.toLowerCase()} appointments
          </h3>
          <p className="text-gray-500 text-sm">
            {activeTab === 'All'
              ? 'No appointments have been booked yet.'
              : `No ${activeTab.toLowerCase()} appointments found.`
            }
          </p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Fees</th>
                  <th>Current Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(appt => (
                  <tr key={appt._id}>
                    <td>
                      <div className="font-medium text-gray-800">
                        {appt.patient?.name || appt.userId?.name || appt.user?.name || appt.patientName || 'Patient'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {appt.patient?.email || appt.userId?.email || appt.user?.email || ''}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(appt.doctorId?.name || appt.doctor?.name || 'D').charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 text-sm">
                            {appt.doctorId?.name || appt.doctor?.name || '—'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {appt.doctorId?.specialty || appt.doctor?.specialty || ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-800">{appt.date || '—'}</div>
                      <div className="text-xs text-gray-400">{appt.time || ''}</div>
                    </td>
                    <td className="font-medium text-gray-800">₹{appt.fees || appt.doctorId?.fees || 0}</td>
                    <td>
                      <AppointmentBadge status={appt.status} />
                    </td>
                    <td>
                      <div className="relative">
                        <select
                          value={appt.status?.toLowerCase() || 'pending'}
                          onChange={e => handleStatusChange(appt._id, e.target.value)}
                          disabled={updatingId === appt._id}
                          className={`text-xs px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 transition-all cursor-pointer ${
                            updatingId === appt._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                        {updatingId === appt._id && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <svg className="w-3 h-3 animate-spin text-primary-600" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            Showing {filtered.length} of {appointments.length} appointments
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageAppointments
