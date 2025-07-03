import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '',
  hoverable = false,
  ...props 
}) => {
  const baseClasses = "bg-white rounded-xl shadow-lg border border-surface-100 transition-all duration-200"
  const hoverClasses = hoverable ? "card-hover cursor-pointer" : ""
  
  const classes = `${baseClasses} ${hoverClasses} ${className}`
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={classes}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card