import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full transition-all duration-200 cursor-pointer"
  
  const variants = {
    default: "bg-surface-100 text-surface-700 hover:bg-surface-200",
    primary: "bg-primary-100 text-primary-700 hover:bg-primary-200",
    secondary: "bg-secondary-100 text-secondary-700 hover:bg-secondary-200",
    accent: "bg-accent-100 text-accent-700 hover:bg-accent-200",
    success: "bg-green-100 text-green-700 hover:bg-green-200",
    warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    danger: "bg-red-100 text-red-700 hover:bg-red-200",
    active: "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg",
    pending: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg",
    churned: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
  }
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={classes}
      {...props}
    >
      {children}
    </motion.span>
  )
}

export default Badge