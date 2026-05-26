import { useState, useEffect } from 'react'
import { getAllDoctors, addDoctor, deleteDoctor } from '../../services/doctorService'
import LoadingSpinner from '../../components/LoadingSpinner'

const INITIAL_FORM = {
  name: '',
  specialty: '',
  experience: '',
  fees: '',
  about: '',
  image: '',
  education: '',
  address: '',
  available: true,
}

const SPECIALTIES = [
  'Cardiology', 'Neurology', 'Dermatology', 'Pediatrics',
  'Orthopedics', 'Psychiatry', 'ENT', 'Gynecology',
  'Gastroenterology', 'Endocrinology', 'General Medicine',
]

function ManageDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formError, setFormError] = useState(null)

  const fetchDoctors = () => {
    setLoading(true)
    getAllDoctors()
      .then(res => setDoctors(res.data.doctors || res.data || []))
      .catch(() => setError('Failed to load doctors.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchDoctors() }, [])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleAdd = async e => {
    e.preventDefault()
    setFormError(null)
    if (!form.name || !form.specialty) {
      setFormError('Name and specialty are required.')
      return
    }
    setSaving(true)
    try {
      await addDoctor({
        ...form,
        experience: Number(form.experience) || 0,
        fees: Number(form.fees) || 0,
      })
      setSuccess('Doctor added successfully!')
      setShowModal(false)
      setForm(INITIAL_FORM)
      fetchDoctors()
      setTimeout(() => setSuccess(null), 4000)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add doctor.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await deleteDoctor(id)
      setSuccess('Doctor deleted successfully.')
      setConfirmDeleteId(null)
      fetchDoctors()
      setTimeout(() => setSuccess(null), 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete doctor.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
          <p className="text-gray-500 mt-1">{doctors.length} doctors on the platform</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setFormError(null); setForm(INITIAL_FORM) }}
          className="btn-primary"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Doctor
        </button>
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

      {/* Doctors table */}
      {loading ? (
        <LoadingSpinner text="Loading doctors..." />
      ) : doctors.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">👨‍⚕️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No doctors yet</h3>
          <p className="text-gray-500 mb-5">Add your first doctor to get started</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">Add First Doctor</button>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialty</th>
                  <th>Experience</th>
                  <th>Fees</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map(doc => (
                  <tr key={doc._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {doc.image ? (
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="w-10 h-10 rounded-xl object-cover"
                            onError={e => e.target.style.display = 'none'}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                            {doc.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-800">{doc.name}</div>
                          <div className="text-xs text-gray-400 truncate max-w-xs">{doc.education || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm font-medium text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
                        {doc.specialty}
                      </span>
                    </td>
                    <td className="text-gray-700">{doc.experience} yrs</td>
                    <td className="font-medium text-gray-800">₹{doc.fees}</td>
                    <td>
                      <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${
                        doc.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${doc.available ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {doc.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      {confirmDeleteId === doc._id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Delete?</span>
                          <button
                            onClick={() => handleDelete(doc._id)}
                            disabled={deletingId === doc._id}
                            className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                          >
                            {deletingId === doc._id ? '...' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-xs px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(doc._id)}
                          className="text-xs px-3 py-1.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add New Doctor</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-6 space-y-4">
              {formError && (
                <div className="alert-error">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Full Name *</label>
                  <input type="text" name="name" required value={form.name} onChange={handleChange} className="input-field" placeholder="Dr. Full Name" />
                </div>
                <div>
                  <label className="input-label">Specialty *</label>
                  <select name="specialty" required value={form.specialty} onChange={handleChange} className="input-field">
                    <option value="">Select specialty</option>
                    {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label">Experience (Years)</label>
                  <input type="number" name="experience" value={form.experience} onChange={handleChange} className="input-field" placeholder="5" min="0" max="60" />
                </div>
                <div>
                  <label className="input-label">Consultation Fees (₹)</label>
                  <input type="number" name="fees" value={form.fees} onChange={handleChange} className="input-field" placeholder="500" min="0" />
                </div>
              </div>

              <div>
                <label className="input-label">Education / Qualifications</label>
                <input type="text" name="education" value={form.education} onChange={handleChange} className="input-field" placeholder="MBBS, MD - Cardiology" />
              </div>

              <div>
                <label className="input-label">Profile Image URL</label>
                <input type="url" name="image" value={form.image} onChange={handleChange} className="input-field" placeholder="https://example.com/doctor.jpg" />
              </div>

              <div>
                <label className="input-label">Clinic Address</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} className="input-field" placeholder="123 Medical Center, City" />
              </div>

              <div>
                <label className="input-label">About (Bio)</label>
                <textarea
                  name="about"
                  value={form.about}
                  onChange={handleChange}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Brief description about the doctor..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="available"
                  id="available"
                  checked={form.available}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label htmlFor="available" className="text-sm font-medium text-gray-700">
                  Available for appointments
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? (
                    <>
                      <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Adding...
                    </>
                  ) : 'Add Doctor'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageDoctors
