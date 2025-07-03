import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = forwardRef(({ 
  label, 
  options = [], 
  placeholder = "Select an option",
  error,
  helper,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = "w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white appearance-none"
  const errorClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-surface-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`${baseClasses} ${errorClasses} ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" size={18} className="text-surface-400" />
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center mt-1">
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </p>
      )}
      {helper && !error && (
        <p className="text-sm text-surface-500 mt-1">{helper}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select