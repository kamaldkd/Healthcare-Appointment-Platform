import { Link } from 'react-router-dom'

const stats = [
  { value: '50+', label: 'Expert Doctors', icon: '👨‍⚕️', color: 'bg-blue-50 text-blue-600' },
  { value: '20+', label: 'Specialties', icon: '🏥', color: 'bg-purple-50 text-purple-600' },
  { value: '1000+', label: 'Appointments', icon: '📅', color: 'bg-green-50 text-green-600' },
  { value: '4.9/5', label: 'Patient Rating', icon: '⭐', color: 'bg-yellow-50 text-yellow-600' },
]

const features = [
  {
    title: 'Verified Doctors',
    desc: 'All doctors on our platform are thoroughly verified and certified by recognized medical boards.',
    icon: '✅',
    color: 'bg-green-100',
  },
  {
    title: 'Easy Booking',
    desc: 'Book appointments in minutes with our intuitive interface. No phone calls, no wait times.',
    icon: '⚡',
    color: 'bg-yellow-100',
  },
  {
    title: 'Secure & Private',
    desc: 'Your medical data is encrypted and kept strictly confidential following HIPAA guidelines.',
    icon: '🔒',
    color: 'bg-blue-100',
  },
  {
    title: '24/7 Support',
    desc: 'Our dedicated support team is available round the clock to assist you with any queries.',
    icon: '🕐',
    color: 'bg-purple-100',
  },
]

const values = [
  { title: 'Patient First', icon: '❤️', desc: 'Every decision we make centers around patient wellbeing and satisfaction.' },
  { title: 'Innovation', icon: '💡', desc: 'Constantly improving our platform with the latest healthcare technology.' },
  { title: 'Integrity', icon: '🤝', desc: 'Transparent operations with honesty at the core of everything we do.' },
]

function About() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-700 to-primary-500 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full text-sm font-medium mb-6">
            🏥 About HealthBook
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Our Mission: <span className="text-yellow-300">Better Healthcare</span> for Everyone
          </h1>
          <p className="text-blue-100 text-xl max-w-3xl mx-auto leading-relaxed">
            HealthBook was founded with a simple belief — quality healthcare should be accessible to everyone.
            We connect patients with trusted doctors, making the booking process seamless and transparent.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(s => (
              <div key={s.label} className="card text-center hover:shadow-lg transition-shadow">
                <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4`}>
                  {s.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-6">
                Transforming Healthcare Access in India
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  HealthBook was born from the frustration of long waiting times, confusing appointment systems,
                  and the lack of transparent information about healthcare providers.
                </p>
                <p>
                  Founded in 2026, we set out to build a platform that puts patients in control of their healthcare journey.
                </p>
                <p>
                  Our team of passionate engineers, doctors, and healthcare administrators work tirelessly to
                  ensure that booking an appointment is as easy as ordering food online.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <Link to="/doctors" className="btn-primary">Find Doctors</Link>
                <Link to="/register" className="btn-secondary">Join Us</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-8 flex flex-col items-center text-center">
                <span className="text-5xl mb-4">🎯</span>
                <h3 className="font-bold text-gray-800 mb-2">Our Mission</h3>
                <p className="text-gray-600 text-sm">Make quality healthcare accessible and affordable for all</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 flex flex-col items-center text-center mt-6">
                <span className="text-5xl mb-4">👁️</span>
                <h3 className="font-bold text-gray-800 mb-2">Our Vision</h3>
                <p className="text-gray-600 text-sm">A world where no one misses out on essential healthcare</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 flex flex-col items-center text-center -mt-6">
                <span className="text-5xl mb-4">💪</span>
                <h3 className="font-bold text-gray-800 mb-2">Our Promise</h3>
                <p className="text-gray-600 text-sm">24/7 support and verified doctors you can trust</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl p-8 flex flex-col items-center text-center">
                <span className="text-5xl mb-4">🤲</span>
                <h3 className="font-bold text-gray-800 mb-2">Our Value</h3>
                <p className="text-gray-600 text-sm">Patient wellbeing always comes first, no exceptions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose HealthBook?</h2>
            <p className="section-subtitle">We go above and beyond to ensure your healthcare experience is exceptional</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="card-hover text-center">
                <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gradient-to-br from-primary-900 to-primary-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Our Core Values</h2>
            <p className="text-blue-200 mt-2">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map(v => (
              <div key={v.title} className="text-center p-8 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors">
                <div className="text-5xl mb-5">{v.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-500 mb-8">Join HealthBook and experience healthcare the modern way.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="btn-primary">Create Free Account</Link>
            <Link to="/doctors" className="btn-secondary">Browse Doctors</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
