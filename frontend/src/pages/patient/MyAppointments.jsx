import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyAppointments, cancelAppointment } from '../../services/appointmentService'
import AppointmentBadge from '../../components/AppointmentBadge'
import LoadingSpinner from '../../components/LoadingSpinner'

const TABS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled']

function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [cancelling, setCancelling] = useState(null)
  const [confirmCancelId, setConfirmCancelId] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const fetchAppointments = () => {
    setLoading(true)
    getMyAppointments()
      .then(res => setAppointments(res.data.appointments || res.data || []))
      .catch(() => setError('Failed to load appointments.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAppointments() }, [])

  const filtered = activeTab === 'All'
    ? appointments
    : appointments.filter(a => a.status?.toLowerCase() === activeTab.toLowerCase())

  const handleCancel = async (id) => {
    setCancelling(id)
    setError(null)
    try {
      await cancelAppointment(id)
      setSuccess('Appointment cancelled successfully.')
      setConfirmCancelId(null)
      fetchAppointments()
      setTimeout(() => setSuccess(null), 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel appointment.')
    } finally {
      setCancelling(null)
    }
  }

  const canCancel = (status) =>
    ['pending', 'confirmed'].includes(status?.toLowerCase())

  const counts = {
    All: appointments.length,
    Pending: appointments.filter(a => a.status?.toLowerCase() === 'pending').length,
    Confirmed: appointments.filter(a => a.status?.toLowerCase() === 'confirmed').length,
    Completed: appointments.filter(a => a.status?.toLowerCase() === 'completed').length,
    Cancelled: appointments.filter(a => a.status?.toLowerCase() === 'cancelled').length,
  }

  if (loading) return <LoadingSpinner text="Loading your appointments..." />

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 mt-1">Manage and track all your medical appointments</p>
        </div>
        <Link to="/doctors" className="btn-primary btn-sm">
          + Book New
        </Link>
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

      {/* Tabs */}
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

      {/* Appointments list */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-3">
            {activeTab === 'Cancelled' ? '❌' : activeTab === 'Completed' ? '✅' : '📭'}
          </div>
          <h3 className="font-semibold text-gray-700 mb-2">No {activeTab === 'All' ? '' : activeTab} appointments</h3>
          <p className="text-gray-500 text-sm mb-5">
            {activeTab === 'All'
              ? "You haven't booked any appointments yet."
              : `You have no ${activeTab.toLowerCase()} appointments.`
            }
          </p>
          {activeTab === 'All' && (
            <Link to="/doctors" className="btn-primary">Book Your First Appointment</Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(appt => (
            <div key={appt._id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Doctor info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {(appt.doctorId?.name || appt.doctor?.name || 'D').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {appt.doctorId?.name || appt.doctor?.name || 'Doctor'}
                    </h3>
                    <p className="text-primary-600 text-sm font-medium">
                      {appt.doctorId?.specialty || appt.doctor?.specialty || 'Specialist'}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {appt.date || '—'}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {appt.time || '—'}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-gray-700">
                        💰 ₹{appt.fees || appt.doctorId?.fees || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & actions */}
                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 flex-wrap">
                  <AppointmentBadge status={appt.status} />

                  {canCancel(appt.status) && (
                    <>
                      {confirmCancelId === appt._id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Confirm?</span>
                          <button
                            onClick={() => handleCancel(appt._id)}
                            disabled={cancelling === appt._id}
                            className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {cancelling === appt._id ? '...' : 'Yes, Cancel'}
                          </button>
                          <button
                            onClick={() => setConfirmCancelId(null)}
                            className="text-xs px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmCancelId(appt._id)}
                          className="text-xs px-4 py-1.5 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium"
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAppointments
