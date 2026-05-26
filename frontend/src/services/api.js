import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000, // 15s — accounts for Render free-tier cold starts
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT token from localStorage
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor — handle 401 globally, avoid redirect loops
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      // Only redirect if not already on the login page
      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/login'
      ) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
