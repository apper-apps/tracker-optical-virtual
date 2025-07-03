import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first item",
  actionText = "Add New",
  onAction,
  icon = "Database"
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-surface-50 to-surface-100 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={36} className="text-surface-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
          <ApperIcon name="Plus" size={16} className="text-white" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-surface-900 mb-3">
        {title}
      </h3>
      
      <p className="text-surface-600 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <ApperIcon name="Plus" size={18} className="mr-2" />
          {actionText}
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty