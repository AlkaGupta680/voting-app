import React from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  }

  const classes = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'bg-blue-50 border border-blue-200 text-blue-800'
  }

  const Icon = icons[type]

  return (
    <div className={`${classes[type]} flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-current hover:opacity-70 transition-opacity duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default Alert