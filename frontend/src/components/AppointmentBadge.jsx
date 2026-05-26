function AppointmentBadge({ status }) {
  const statusConfig = {
    pending: {
      className: 'badge-pending',
      icon: '⏳',
    },
    confirmed: {
      className: 'badge-confirmed',
      icon: '✅',
    },
    cancelled: {
      className: 'badge-cancelled',
      icon: '❌',
    },
    completed: {
      className: 'badge-completed',
      icon: '✔️',
    },
  }

  const config = statusConfig[status?.toLowerCase()] || {
    className: 'badge bg-gray-100 text-gray-700',
    icon: '•',
  }

  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : 'Unknown'

  return (
    <span className={config.className}>
      {label}
    </span>
  )
}

export default AppointmentBadge
