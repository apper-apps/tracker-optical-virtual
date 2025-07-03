import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue,
  color = 'primary',
  className = '',
  ...props 
}) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    accent: 'from-accent-500 to-accent-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    danger: 'from-red-500 to-red-600'
  }
  
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-surface-600'
  }
  
  const trendIcons = {
    up: 'TrendingUp',
    down: 'TrendingDown',
    neutral: 'Minus'
  }
  
  return (
    <Card hoverable className={`p-6 ${className}`} {...props}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} shadow-lg`}>
          <ApperIcon name={icon} size={20} className="text-white" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trendColors[trend]}`}>
            <ApperIcon name={trendIcons[trend]} size={14} />
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-surface-900 bg-gradient-to-r from-surface-900 to-surface-700 bg-clip-text">
          {value}
        </h3>
        <p className="text-sm text-surface-600 font-medium">
          {title}
        </p>
      </div>
    </Card>
  )
}

export default MetricCard