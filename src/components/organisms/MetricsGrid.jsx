import { motion } from 'framer-motion'
import MetricCard from '@/components/molecules/MetricCard'

const MetricsGrid = ({ metrics }) => {
  const topMetrics = [
    { key: 'activeMrr', title: 'Active MRR', icon: 'TrendingUp', color: 'accent' },
    { key: 'pendingMrr', title: 'Pending MRR', icon: 'Clock', color: 'warning' },
    { key: 'activeCustomers', title: 'Active Customers', icon: 'Users', color: 'primary' },
    { key: 'totalCustomers', title: 'Total Customers', icon: 'UserCheck', color: 'secondary' },
    { key: 'avgRevenue', title: 'Avg Revenue/Customer', icon: 'DollarSign', color: 'success' },
    { key: 'totalGst', title: 'Total GST Collected', icon: 'Receipt', color: 'danger' }
  ]
  
  const summaryMetrics = [
    { key: 'monthlyRevenue', title: 'Monthly Revenue Summary', icon: 'BarChart3', color: 'primary' },
    { key: 'revenueWithGst', title: 'With GST Included', icon: 'TrendingUp', color: 'accent' },
    { key: 'annualProjection', title: 'Annual Projection', icon: 'Calendar', color: 'secondary' }
  ]
  
  return (
    <div className="space-y-8">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {topMetrics.map((metric, index) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricCard
              title={metric.title}
              value={metrics[metric.key]}
              icon={metric.icon}
              color={metric.color}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryMetrics.map((metric, index) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <MetricCard
              title={metric.title}
              value={metrics[metric.key]}
              icon={metric.icon}
              color={metric.color}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default MetricsGrid