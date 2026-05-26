import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import DoctorCard from '../../components/DoctorCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getAllDoctors } from '../../services/doctorService'

const SPECIALTIES = [
  { label: 'All', value: 'All' },
  { label: 'Cardiology', value: 'Cardiologist' },
  { label: 'Neurology', value: 'Neurologist' },
  { label: 'Dermatology', value: 'Dermatologist' },
  { label: 'Pediatrics', value: 'Pediatrician' },
  { label: 'Orthopedics', value: 'Orthopedic Surgeon' },
  { label: 'Psychiatry', value: 'Psychiatrist' },
  { label: 'ENT', value: 'ENT Specialist' },
  { label: 'Gynecology', value: 'Gynecologist' },
  { label: 'Gastroenterology', value: 'Gastroenterologist' },
  { label: 'Endocrinology', value: 'Endocrinologist' },
]

function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="w-20 h-20 rounded-2xl bg-gray-200 mx-auto mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-4" />
      <div className="flex justify-between mb-4">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
      <div className="h-10 bg-gray-200 rounded-xl" />
    </div>
  )
}

function Doctors() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const getSpecialtyValue = (sp) => {
    if (!sp) return 'All'
    const found = SPECIALTIES.find(item => item.value === sp || item.label === sp)
    return found?.value || 'All'
  }
  const [selectedSpecialty, setSelectedSpecialty] = useState(getSpecialtyValue(searchParams.get('specialty')))
  const [error, setError] = useState(null)

  const fetchDoctors = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (selectedSpecialty && selectedSpecialty !== 'All') params.specialty = selectedSpecialty
      if (search.trim()) params.search = search.trim()
      const res = await getAllDoctors(params)
      setDoctors(res.data.doctors || res.data || [])
    } catch {
      setError('Failed to load doctors. Please try again.')
      setDoctors([])
    } finally {
      setLoading(false)
    }
  }, [selectedSpecialty, search])

  useEffect(() => {
    const delay = setTimeout(fetchDoctors, 300)
    return () => clearTimeout(delay)
  }, [fetchDoctors])

  useEffect(() => {
    const sp = searchParams.get('specialty')
    if (sp) setSelectedSpecialty(getSpecialtyValue(sp))
  }, [searchParams])

  const handleSpecialtyChange = (value) => {
    setSelectedSpecialty(value)
    if (value === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ specialty: value })
    }
  }

  const filteredDoctors = doctors.filter(d =>
    search === '' ||
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Find a Doctor</h1>
          <p className="text-blue-100 text-lg mb-6">Browse our verified specialists and book your appointment today</p>
          {/* Search bar */}
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white text-gray-800 placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg text-sm"
            />
            {search && (
              <button
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setSearch('')}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Specialty chips */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Filter by Specialty</h3>
          <div className="flex flex-wrap gap-2">
            {SPECIALTIES.map(sp => (
              <button
                key={sp.value}
                onClick={() => handleSpecialtyChange(sp.value)}
                className={selectedSpecialty === sp.value ? 'filter-chip-active' : 'filter-chip'}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-500 text-sm">
              {loading ? 'Searching...' : (
                <span>
                  Showing <strong className="text-gray-800">{filteredDoctors.length}</strong> doctor{filteredDoctors.length !== 1 ? 's' : ''}
                  {selectedSpecialty !== 'All' && (
                    <span> in <strong className="text-primary-600">{selectedSpecialty}</strong></span>
                  )}
                </span>
              )}
            </p>
          </div>
          {selectedSpecialty !== 'All' && (
            <button
              onClick={() => handleSpecialtyChange('All')}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filter
            </button>
          )}
        </div>

        {error && (
          <div className="alert-error mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Doctors grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map(doc => (
              <DoctorCard key={doc._id} doctor={doc} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No doctors found</h3>
            <p className="text-gray-500 mb-6">
              {search
                ? `No results for "${search}"${selectedSpecialty !== 'All' ? ` in ${selectedSpecialty}` : ''}`
                : `No ${selectedSpecialty !== 'All' ? selectedSpecialty : ''} doctors available yet.`
              }
            </p>
            <button onClick={() => { setSearch(''); handleSpecialtyChange('All') }} className="btn-primary">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Doctors
