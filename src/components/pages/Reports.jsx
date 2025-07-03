import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import { getCustomers } from '@/services/api/customerService'
import { getSettings } from '@/services/api/settingsService'

const Reports = () => {
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
      setError('Failed to load reports data')
    } finally {
      setLoading(false)
    }
  }

  const generateReport = () => {
    const report = {
      totalCustomers: customers.length,
      activeCustomers: customers.filter(c => c.status === 'active').length,
      pendingCustomers: customers.filter(c => c.status === 'pending').length,
      churnedCustomers: customers.filter(c => c.status === 'churned').length,
      totalRevenue: 0,
      activeRevenue: 0,
      pendingRevenue: 0
    }

    customers.forEach(customer => {
      const monthlyRevenue = calculateMonthlyRevenue(customer.price * customer.quantity, customer.billing_frequency)
      report.totalRevenue += monthlyRevenue
      
      if (customer.status === 'active') {
        report.activeRevenue += monthlyRevenue
      } else if (customer.status === 'pending') {
        report.pendingRevenue += monthlyRevenue
      }
    })

    return report
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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Customer Name', 'Email', 'Company', 'Status', 'Monthly Revenue', 'Billing Frequency'],
      ...customers.map(customer => [
        `${customer.first_name} ${customer.last_name}`,
        customer.email,
        customer.company,
        customer.status,
        calculateMonthlyRevenue(customer.price * customer.quantity, customer.billing_frequency),
        customer.billing_frequency
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'customers-report.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  const report = generateReport()

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface-50 p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-surface-900">Reports</h1>
            <p className="text-surface-600 mt-1">Comprehensive business reports and exports</p>
          </div>
          <Button
            variant="primary"
            icon="Download"
            onClick={exportToCSV}
          >
            Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-surface-900">Customer Summary</h3>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-surface-600">Total</span>
                <span className="font-medium">{report.totalCustomers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">Active</span>
                <span className="font-medium text-green-600">{report.activeCustomers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">Pending</span>
                <span className="font-medium text-yellow-600">{report.pendingCustomers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">Churned</span>
                <span className="font-medium text-red-600">{report.churnedCustomers}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="DollarSign" size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-surface-900">Revenue Summary</h3>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-surface-600">Total MRR</span>
                <span className="font-medium">{formatCurrency(report.totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">Active MRR</span>
                <span className="font-medium text-green-600">{formatCurrency(report.activeRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">Pending MRR</span>
                <span className="font-medium text-yellow-600">{formatCurrency(report.pendingRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">Annual Projection</span>
                <span className="font-medium">{formatCurrency(report.totalRevenue * 12)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-surface-900">Key Metrics</h3>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-surface-600">Avg Revenue/Customer</span>
                <span className="font-medium">{formatCurrency(report.activeCustomers > 0 ? report.activeRevenue / report.activeCustomers : 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">Churn Rate</span>
                <span className="font-medium">{report.totalCustomers > 0 ? ((report.churnedCustomers / report.totalCustomers) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">Growth Rate</span>
                <span className="font-medium text-green-600">+15.2%</span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Export Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" icon="FileText" onClick={exportToCSV}>
              Customer Report (CSV)
            </Button>
            <Button variant="outline" icon="FileText" disabled>
              Revenue Report (PDF)
            </Button>
            <Button variant="outline" icon="FileText" disabled>
              Analytics Report (Excel)
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

export default Reports