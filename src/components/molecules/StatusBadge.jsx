import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const StatusBadge = ({ 
  status, 
  onClick,
  className = '',
  ...props 
}) => {
  const statusConfig = {
    active: {
      variant: 'active',
      icon: 'CheckCircle',
      label: 'Active'
    },
    pending: {
      variant: 'pending',
      icon: 'Clock',
      label: 'Pending'
    },
    churned: {
      variant: 'churned',
      icon: 'XCircle',
      label: 'Churned'
    }
  }
  
  const config = statusConfig[status] || statusConfig.active
  
  return (
    <Badge
      variant={config.variant}
      size="sm"
      onClick={onClick}
      className={`status-badge ${className}`}
      {...props}
    >
      <ApperIcon name={config.icon} size={12} className="mr-1" />
      {config.label}
    </Badge>
  )
}

export default StatusBadge