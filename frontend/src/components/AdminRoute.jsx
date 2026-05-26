import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

function AdminRoute() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner fullScreen />

  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />

  return <Outlet />
}

export default AdminRoute
