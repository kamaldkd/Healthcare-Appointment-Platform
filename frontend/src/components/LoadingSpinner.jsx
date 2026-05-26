function LoadingSpinner({ fullScreen = false, size = 'md', text = '' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-primary-200 border-t-primary-600 animate-spin`}
        style={{ borderWidth: size === 'sm' ? 2 : size === 'lg' ? 4 : 3 }}
      />
      {text && <p className="text-sm text-gray-500 font-medium">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  )
}

export default LoadingSpinner
