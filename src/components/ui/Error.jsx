import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={32} className="text-red-500" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
      </div>
      
      <h3 className="text-2xl font-bold text-surface-900 mb-3">
        Oops! Something went wrong
      </h3>
      
      <p className="text-surface-600 mb-8 max-w-md leading-relaxed">
        {message}
      </p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <ApperIcon name="RotateCcw" size={18} className="mr-2" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  )
}

export default Error