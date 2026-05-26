import { Link } from 'react-router-dom'

const SPECIALTIES_COLORS = {
  Cardiology: 'bg-red-100 text-red-700',
  Neurology: 'bg-purple-100 text-purple-700',
  Dermatology: 'bg-pink-100 text-pink-700',
  Pediatrics: 'bg-yellow-100 text-yellow-700',
  Orthopedics: 'bg-blue-100 text-blue-700',
  Psychiatry: 'bg-indigo-100 text-indigo-700',
  ENT: 'bg-teal-100 text-teal-700',
  Gynecology: 'bg-rose-100 text-rose-700',
  Gastroenterology: 'bg-orange-100 text-orange-700',
  Endocrinology: 'bg-cyan-100 text-cyan-700',
}

function DoctorCard({ doctor }) {
  const {
    _id,
    name,
    specialty,
    experience,
    fees,
    image,
    available,
    about,
  } = doctor

  const specialtyColor = SPECIALTIES_COLORS[specialty] || 'bg-gray-100 text-gray-700'
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'DR'

  return (
    <div className="card-hover group flex flex-col">
      {/* Doctor Image */}
      <div className="relative mb-4">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-primary-100 mx-auto block"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <div
          className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl mx-auto ${image ? 'hidden' : 'flex'}`}
        >
          {initials}
        </div>

        {/* Available indicator */}
        <div className="absolute top-0 right-0 flex items-center gap-1.5">
          <div className={`w-2.5 h-2.5 rounded-full ${available ? 'bg-green-500' : 'bg-gray-300'}`} />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg text-center leading-tight">
          {name || 'Dr. Unknown'}
        </h3>

        <div className="mt-2 flex justify-center">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${specialtyColor}`}>
            {specialty || 'General'}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
          <div className="text-center">
            <div className="font-bold text-gray-800">{experience || 0}</div>
            <div className="text-xs">yrs exp</div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <div className="font-bold text-gray-800">₹{fees || 0}</div>
            <div className="text-xs">per visit</div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <div className={`font-bold text-xs ${available ? 'text-green-600' : 'text-gray-400'}`}>
              {available ? 'Available' : 'Unavailable'}
            </div>
            <div className="text-xs">status</div>
          </div>
        </div>

        <Link
          to={`/doctors/${_id}`}
          className="mt-4 btn-primary text-sm w-full"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  )
}

export default DoctorCard
