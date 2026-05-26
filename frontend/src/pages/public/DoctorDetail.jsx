import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getDoctorById } from '../../services/doctorService'
import { bookAppointment } from '../../services/appointmentService'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/LoadingSpinner'

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']

function getNext7Days() {
  const days = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    days.push(date)
  }
  return days
}

function formatDate(d) {
  return d.toISOString().split('T')[0]
}

function formatDisplayDate(d) {
  return {
    day: d.toLocaleDateString('en-US', { weekday: 'short' }),
    date: d.getDate(),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
  }
}

function DoctorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))
  const [selectedTime, setSelectedTime] = useState('')
  const [booking, setBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState(null)

  const days = getNext7Days()

  useEffect(() => {
    getDoctorById(id)
      .then(res => setDoctor(res.data.doctor || res.data))
      .catch(() => setError('Doctor not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) {
      setBookingError('Please select a date and time slot.')
      return
    }
    setBooking(true)
    setBookingError(null)
    try {
      // Convert time like "09:00 AM" to 24-hour HH:MM format expected by backend
      const to24Hour = (t) => {
        if (!t) return t
        const parts = t.split(' ')
        if (parts.length === 1) return parts[0] // already HH:MM
        const [timePart, period] = parts
        let [hh, mm] = timePart.split(':').map(Number)
        const p = (period || '').toUpperCase()
        if (p === 'PM' && hh !== 12) hh += 12
        if (p === 'AM' && hh === 12) hh = 0
        return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
      }

      await bookAppointment({
        doctorId: id,
        date: selectedDate,
        time: to24Hour(selectedTime),
      })
      setBookingSuccess(true)
      setTimeout(() => navigate('/dashboard/appointments'), 2000)
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return <LoadingSpinner fullScreen text="Loading doctor profile..." />
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">{error}</h2>
        <Link to="/doctors" className="btn-primary mt-4">Back to Doctors</Link>
      </div>
    </div>
  )

  const initials = doctor?.name
    ? doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'DR'

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <Link to="/doctors" className="hover:text-primary-600">Doctors</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-800 font-medium">{doctor?.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctor Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile card */}
            <div className="card">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  {doctor?.image ? (
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-32 h-32 rounded-3xl object-cover border-2 border-primary-100"
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-3xl">
                      {initials}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{doctor?.name}</h1>
                      <p className="text-primary-600 font-semibold">{doctor?.specialty}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${doctor?.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full ${doctor?.available ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {doctor?.available ? 'Available' : 'Not Available'}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="text-center bg-gray-50 rounded-xl p-3">
                      <div className="text-xl font-bold text-gray-800">{doctor?.experience || 0}</div>
                      <div className="text-xs text-gray-500">Years Exp.</div>
                    </div>
                    <div className="text-center bg-primary-50 rounded-xl p-3">
                      <div className="text-xl font-bold text-primary-700">₹{doctor?.fees || 0}</div>
                      <div className="text-xs text-gray-500">Per Visit</div>
                    </div>
                    <div className="text-center bg-yellow-50 rounded-xl p-3">
                      <div className="text-xl font-bold text-yellow-700">4.9⭐</div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            {doctor?.about && (
              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  About Dr. {doctor.name?.split(' ').slice(-1)[0]}
                </h2>
                <p className="text-gray-600 leading-relaxed">{doctor.about}</p>
              </div>
            )}

            {/* Education & Details */}
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Doctor Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {doctor?.education && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      🎓
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Education</div>
                      <div className="text-sm font-medium text-gray-800">{doctor.education}</div>
                    </div>
                  </div>
                )}
                {doctor?.address && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      📍
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Clinic Address</div>
                      <div className="text-sm font-medium text-gray-800">{doctor.address}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    🏥
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Specialty</div>
                    <div className="text-sm font-medium text-gray-800">{doctor?.specialty}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    💼
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Experience</div>
                    <div className="text-sm font-medium text-gray-800">{doctor?.experience} Years</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Panel */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Book Appointment</h2>

              {bookingSuccess ? (
                <div className="text-center py-6">
                  <div className="text-5xl mb-3">🎉</div>
                  <h3 className="font-bold text-green-700 text-lg mb-2">Appointment Booked!</h3>
                  <p className="text-gray-500 text-sm">Redirecting to your appointments...</p>
                </div>
              ) : (
                <>
                  {/* Date picker */}
                  <div className="mb-5">
                    <label className="input-label">Select Date</label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {days.map((d, i) => {
                        const fd = formatDate(d)
                        const { day, date, month } = formatDisplayDate(d)
                        const isSelected = selectedDate === fd
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedDate(fd)}
                            className={`flex-shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl border-2 transition-all duration-200 ${
                              isSelected
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-gray-200 hover:border-primary-300 text-gray-600'
                            }`}
                          >
                            <span className="text-xs font-medium">{day}</span>
                            <span className="text-lg font-bold leading-tight">{date}</span>
                            <span className="text-xs">{month}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Time picker */}
                  <div className="mb-5">
                    <label className="input-label">Select Time</label>
                    <div className="grid grid-cols-2 gap-2">
                      {TIME_SLOTS.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                            selectedTime === slot
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-primary-300 text-gray-600'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fees reminder */}
                  <div className="flex items-center justify-between mb-5 p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">Consultation Fee</span>
                    <span className="font-bold text-primary-700">₹{doctor?.fees || 0}</span>
                  </div>

                  {bookingError && (
                    <div className="alert-error mb-4">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {bookingError}
                    </div>
                  )}

                  {isAuthenticated ? (
                    <button
                      onClick={handleBook}
                      disabled={booking || !doctor?.available}
                      className="btn-primary w-full"
                    >
                      {booking ? (
                        <>
                          <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Booking...
                        </>
                      ) : !doctor?.available ? (
                        'Doctor Unavailable'
                      ) : (
                        'Confirm Appointment'
                      )}
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-500 text-sm mb-3">Login to book this appointment</p>
                      <Link to="/login" state={{ from: `/doctors/${id}` }} className="btn-primary w-full block text-center">
                        Login to Book
                      </Link>
                      <p className="text-xs text-gray-400 mt-2">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 hover:underline">Register</Link>
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetail
