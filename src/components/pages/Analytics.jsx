import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Card from '@/components/atoms/Card'
import MetricCard from '@/components/molecules/MetricCard'
import ApperIcon from '@/components/ApperIcon'
import { getCustomers } from '@/services/api/customerService'
import { getSettings } from '@/services/api/settingsService'

const Analytics = () => {
  const [customers, setCustomers] = useState([])
  const [settings, setSettings] = useState({ gstRate: 10, currencySymbol: '$' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [customersData, settingsData] = await Promise.all([
        getCustomers(),
        getSettings()
      ])
      
      setCustomers(customersData)
      setSettings(settingsData)
    } catch (err) {
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const calculateAnalytics = () => {
    const statusMetrics = {
      active: 0,
      pending: 0,
      churned: 0
    }

    const revenueByStatus = {
      active: 0,
      pending: 0,
      churned: 0
    }

    customers.forEach(customer => {
      const monthlyRevenue = calculateMonthlyRevenue(customer.price * customer.quantity, customer.billing_frequency)
      statusMetrics[customer.status] = (statusMetrics[customer.status] || 0) + 1
      revenueByStatus[customer.status] = (revenueByStatus[customer.status] || 0) + monthlyRevenue
    })

    const totalRevenue = Object.values(revenueByStatus).reduce((sum, val) => sum + val, 0)
    const churnRate = customers.length > 0 ? (statusMetrics.churned / customers.length) * 100 : 0
    const avgRevenuePerCustomer = statusMetrics.active > 0 ? revenueByStatus.active / statusMetrics.active : 0

    return {
      statusMetrics,
      revenueByStatus,
      totalRevenue,
      churnRate,
      avgRevenuePerCustomer
    }
  }

  const calculateMonthlyRevenue = (price, frequency) => {
    const multipliers = {
      monthly: 1,
      quarterly: 1/3,
      biannually: 1/6,
      annually: 1/12
    }
    
    return price * (multipliers[frequency] || 1)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: settings.currency || 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  const analytics = calculateAnalytics()

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface-50 p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900">Analytics</h1>
          <p className="text-surface-600 mt-1">Revenue insights and customer analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total MRR"
            value={formatCurrency(analytics.totalRevenue)}
            icon="DollarSign"
            trend="up"
            trendValue="12%"
          />
          
          <MetricCard
            title="Avg Revenue Per Customer"
            value={formatCurrency(analytics.avgRevenuePerCustomer)}
            icon="Users"
            trend="up"
            trendValue="8%"
          />
          
          <MetricCard
            title="Churn Rate"
            value={`${analytics.churnRate.toFixed(1)}%`}
            icon="TrendingDown"
            trend="down"
            trendValue="2%"
          />
          
          <MetricCard
            title="Active Customers"
            value={analytics.statusMetrics.active.toString()}
            icon="UserCheck"
            trend="up"
            trendValue="5%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center">
              <ApperIcon name="PieChart" size={20} className="mr-2" />
              Customer Status Distribution
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Active</span>
                <span className="font-medium text-green-600">{analytics.statusMetrics.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Pending</span>
                <span className="font-medium text-yellow-600">{analytics.statusMetrics.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Churned</span>
                <span className="font-medium text-red-600">{analytics.statusMetrics.churned}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center">
              <ApperIcon name="BarChart3" size={20} className="mr-2" />
              Revenue by Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Active Revenue</span>
                <span className="font-medium text-green-600">{formatCurrency(analytics.revenueByStatus.active)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Pending Revenue</span>
                <span className="font-medium text-yellow-600">{formatCurrency(analytics.revenueByStatus.pending)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Lost Revenue</span>
                <span className="font-medium text-red-600">{formatCurrency(analytics.revenueByStatus.churned)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default Analytics