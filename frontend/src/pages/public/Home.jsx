import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DoctorCard from '../../components/DoctorCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getAllDoctors } from '../../services/doctorService'

const specialties = [
  { name: 'Cardiology', emoji: '❤️', color: 'bg-red-50 border-red-100 hover:border-red-300 text-red-600' },
  { name: 'Neurology', emoji: '🧠', color: 'bg-purple-50 border-purple-100 hover:border-purple-300 text-purple-600' },
  { name: 'Dermatology', emoji: '✨', color: 'bg-pink-50 border-pink-100 hover:border-pink-300 text-pink-600' },
  { name: 'Pediatrics', emoji: '👶', color: 'bg-yellow-50 border-yellow-100 hover:border-yellow-300 text-yellow-600' },
  { name: 'Orthopedics', emoji: '🦴', color: 'bg-blue-50 border-blue-100 hover:border-blue-300 text-blue-600' },
  { name: 'Psychiatry', emoji: '🧘', color: 'bg-indigo-50 border-indigo-100 hover:border-indigo-300 text-indigo-600' },
]

const steps = [
  {
    num: '01',
    title: 'Search a Doctor',
    desc: 'Browse our extensive list of certified healthcare professionals by specialty, location, or availability.',
    icon: '🔍',
    color: 'from-blue-500 to-blue-600',
  },
  {
    num: '02',
    title: 'Book Appointment',
    desc: 'Choose your preferred date and time slot that works best for your schedule with just a few clicks.',
    icon: '📅',
    color: 'from-primary-500 to-primary-700',
  },
  {
    num: '03',
    title: 'Get Consultation',
    desc: 'Meet your doctor at the clinic or via teleconsultation and receive expert medical care.',
    icon: '💊',
    color: 'from-green-500 to-green-600',
  },
]

function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="w-20 h-20 rounded-2xl bg-gray-200 mx-auto mb-4" />
      <div className="h-4 bg-gray-200 rounded mx-auto w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded mx-auto w-1/2 mb-4" />
      <div className="flex justify-between mb-4">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
      <div className="h-10 bg-gray-200 rounded-xl" />
    </div>
  )
}

function Home() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getAllDoctors({ limit: 4 })
      .then(res => setDoctors((res.data.doctors || res.data).slice(0, 4)))
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="animate-fade-in">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-white/5 rounded-full" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-primary-400/20 rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Trusted by 1000+ patients across India
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Find & Book{' '}
                <span className="text-yellow-300">Trusted</span>{' '}
                Doctors
              </h1>
              <p className="text-lg text-blue-100 mb-8 max-w-lg leading-relaxed">
                Connect with verified healthcare professionals and book appointments instantly. Your health, our priority — 24/7 online booking available.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/doctors" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform transition-all duration-200">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Appointment
                </Link>
                <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 text-white font-bold rounded-2xl border border-white/30 hover:bg-white/25 transition-all duration-200 backdrop-blur-sm">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register as Patient
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 flex gap-8">
                {[
                  { val: '50+', label: 'Doctors' },
                  { val: '1000+', label: 'Patients' },
                  { val: '4.9⭐', label: 'Avg Rating' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-white">{stat.val}</div>
                    <div className="text-blue-200 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right illustration */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative">
                <div className="w-80 h-80 bg-white/10 rounded-3xl backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl">
                  <div className="text-center">
                    <div className="text-8xl mb-4">👨‍⚕️</div>
                    <div className="text-white font-semibold text-lg">Expert Doctors</div>
                    <div className="text-blue-200 text-sm">Ready to help you</div>
                  </div>
                </div>
                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">Appointment Confirmed</div>
                    <div className="text-xs text-gray-500">Dr. Sharma — Today 10AM</div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-lg">⭐</div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">4.9 Rating</div>
                    <div className="text-xs text-gray-500">From 500+ reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SPECIALTIES SECTION ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">Browse by Specialty</h2>
            <p className="section-subtitle">Find the right specialist for your health needs</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {specialties.map(sp => (
              <button
                key={sp.name}
                onClick={() => navigate(`/doctors?specialty=${sp.name}`)}
                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${sp.color}`}
              >
                <span className="text-3xl">{sp.emoji}</span>
                <span className="font-semibold text-sm text-center">{sp.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED DOCTORS SECTION ===== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Doctors</h2>
              <p className="section-subtitle">Meet our top-rated healthcare professionals</p>
            </div>
            <Link to="/doctors" className="btn-secondary btn-sm hidden sm:flex">
              View All Doctors →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map(doc => (
                <DoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">👨‍⚕️</div>
              <p className="text-gray-500">No doctors available yet. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/doctors" className="btn-primary">View All Doctors</Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Book your appointment in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-14 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-primary-200 to-primary-200 z-0" />
            <div className="hidden md:block absolute top-14 left-2/3 w-1/3 h-0.5 bg-gradient-to-r from-primary-200 to-primary-200 z-0" />

            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                <div className={`w-28 h-28 bg-gradient-to-br ${step.color} rounded-3xl flex flex-col items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform duration-200`}>
                  <span className="text-3xl mb-1">{step.icon}</span>
                  <span className="text-white text-xs font-bold opacity-75">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-6">🏥</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to take control of your health?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust HealthBook for their healthcare needs. Book your first appointment today — it's free!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform transition-all duration-200"
            >
              Get Started Free
            </Link>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 text-white font-bold rounded-2xl border border-white/30 hover:bg-white/25 transition-all duration-200"
            >
              Browse Doctors
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
