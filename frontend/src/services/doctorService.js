import api from './api'

export const getAllDoctors = (params = {}) =>
  api.get('/doctors', { params })

export const getDoctorById = (id) =>
  api.get(`/doctors/${id}`)

export const addDoctor = (data) =>
  api.post('/doctors', data)

export const updateDoctor = (id, data) =>
  api.put(`/doctors/${id}`, data)

export const deleteDoctor = (id) =>
  api.delete(`/doctors/${id}`)
