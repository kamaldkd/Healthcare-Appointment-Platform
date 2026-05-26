import api from './api'

export const login = (email, password) =>
  api.post('/auth/login', { email, password })

export const register = (name, email, password, phone) =>
  api.post('/auth/register', { name, email, password, phone })

export const getMe = () =>
  api.get('/auth/me')
