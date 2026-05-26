import api from './api'

export const bookAppointment = (data) =>
  api.post('/appointments', data)

export const getMyAppointments = () =>
  api.get('/appointments/my')

export const cancelAppointment = (id) =>
  api.put(`/appointments/${id}/cancel`)

export const getAllAppointments = (params = {}) =>
  api.get('/appointments', { params })

export const updateAppointmentStatus = (id, status) =>
  api.put(`/appointments/${id}/status`, { status })
