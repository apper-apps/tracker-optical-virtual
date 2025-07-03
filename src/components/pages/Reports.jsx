import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import { getCustomers } from '@/services/api/customerService'
import { getSettings } from '@/services/api/settingsService'
import { getInterCompanyTransactions } from '@/services/api/interCompanyTransactionService'
import { getSalesCommissions, getCommissionSummary } from '@/services/api/salesCommissionService'
import { getPartnerDiscounts, getDiscountSummary } from '@/services/api/partnerDiscountService'
const Reports = () => {
  const [customers, setCustomers] = useState([])
  const [settings, setSettings] = useState({ gstRate: 10, currencySymbol: '$' })
  const [transactions, setTransactions] = useState([])
  const [commissions, setCommissions] = useState([])
  const [discounts, setDiscounts] = useState([])
  const [commissionSummary, setCommissionSummary] = useState({})
  const [discountSummary, setDiscountSummary] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    loadData()
  }, [])

const loadData = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Load data with individual error handling to allow partial loading
      const results = await Promise.allSettled([
        getCustomers().catch(err => {
          console.error('Failed to load customers:', err)
          return []
        }),
        getSettings().catch(err => {
          console.error('Failed to load settings:', err)
          return { gstRate: 10, currencySymbol: '$' }
        }),
        getInterCompanyTransactions().catch(err => {
          console.error('Failed to load inter-company transactions:', err)
          return []
        }),
        getSalesCommissions().catch(err => {
          console.error('Failed to load sales commissions:', err)
          return []
        }),
        getPartnerDiscounts().catch(err => {
          console.error('Failed to load partner discounts:', err)
          return []
        }),
        getCommissionSummary().catch(err => {
          console.error('Failed to load commission summary:', err)
          return {}
        }),
        getDiscountSummary().catch(err => {
          console.error('Failed to load discount summary:', err)
          return {}
        })
      ])
      
      // Extract values from settled promises, using fulfilled values or fallbacks
      const [
        customersResult,
        settingsResult,
        transactionsResult,
        commissionsResult,
        discountsResult,
        commissionSummaryResult,
        discountSummaryResult
      ] = results.map(result => result.status === 'fulfilled' ? result.value : result.reason)
      
      setCustomers(Array.isArray(customersResult) ? customersResult : [])
      setSettings(settingsResult || { gstRate: 10, currencySymbol: '$' })
      setTransactions(Array.isArray(transactionsResult) ? transactionsResult : [])
      setCommissions(Array.isArray(commissionsResult) ? commissionsResult : [])
      setDiscounts(Array.isArray(discountsResult) ? discountsResult : [])
      setCommissionSummary(commissionSummaryResult || {})
      setDiscountSummary(discountSummaryResult || {})
      
      // Check if critical data failed to load
      const failedServices = results.filter(result => result.status === 'rejected').length
      if (failedServices > 0) {
        console.warn(`${failedServices} services failed to load, showing partial data`)
      }
    } catch (err) {
      console.error('Critical error loading reports data:', err)
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

        {/* Inter-Company Transactions Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-surface-900 mb-6">Inter-Company Transactions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="ArrowRightLeft" size={24} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">Transaction Summary</h3>
                </div>
              </div>
<div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-surface-600">Total Transactions</span>
                  <span className="font-medium">{transactions?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Payments</span>
                  <span className="font-medium text-green-600">
                    {transactions?.filter(t => t?.transactionType === 'Payment')?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Cost Absorptions</span>
                  <span className="font-medium text-blue-600">
                    {transactions?.filter(t => t?.transactionType === 'Cost Absorption')?.length || 0}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="DollarSign" size={24} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">Financial Flow</h3>
                </div>
              </div>
<div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-surface-600">Total Payments</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency((transactions || [])
                      .filter(t => t && t.transactionType === 'Payment')
                      .reduce((sum, t) => {
                        const amount = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount) || 0
                        return sum + amount
                      }, 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Total Absorptions</span>
                  <span className="font-medium text-blue-600">
                    {formatCurrency((transactions || [])
                      .filter(t => t && t.transactionType === 'Cost Absorption')
                      .reduce((sum, t) => {
                        const amount = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount) || 0
                        return sum + amount
                      }, 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Net Flow</span>
                  <span className="font-medium">
                    {formatCurrency((transactions || []).reduce((sum, t) => {
                      if (!t || !t.transactionType) return sum
                      const amount = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount) || 0
                      return t.transactionType === 'Payment' ? sum + amount : sum - amount
                    }, 0))}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Building2" size={24} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">Company Breakdown</h3>
                </div>
              </div>
<div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-surface-600">Main Companies</span>
                  <span className="font-medium">
                    {(customers || []).filter(c => c?.companyType === 'Main').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Subsidiaries</span>
                  <span className="font-medium">
                    {(customers || []).filter(c => c?.companyType === 'Subsidiary').length}
                  </span>
                </div>
                <div className="flex justify-between">
<span className="text-surface-600">Active Relationships</span>
                  <span className="font-medium text-green-600">
                    {(() => {
                      try {
                        const relationshipIds = new Set()
                        
                        ;(transactions || []).forEach(t => {
                          if (t && t.mainCompany) {
                            // Handle both direct ID and lookup object structure
                            const mainId = typeof t.mainCompany === 'object' ? t.mainCompany.Id : t.mainCompany
                            if (mainId != null) relationshipIds.add(mainId)
                          }
                          if (t && t.subsidiary) {
                            // Handle both direct ID and lookup object structure  
                            const subId = typeof t.subsidiary === 'object' ? t.subsidiary.Id : t.subsidiary
                            if (subId != null) relationshipIds.add(subId)
                          }
                        })
                        
                        return relationshipIds.size
                      } catch (err) {
                        console.error('Error calculating active relationships:', err)
                        return 0
                      }
                    })()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Sales Commission Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-surface-900 mb-6">Sales Commission Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Users" size={24} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">Sales Staff</h3>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-surface-600">Total Staff</span>
                  <span className="font-medium">{commissionSummary.totalStaff || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Active Staff</span>
                  <span className="font-medium text-green-600">{commissionSummary.activeStaff || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Avg Commission Rate</span>
                  <span className="font-medium">{(commissionSummary.averageCommissionRate || 0).toFixed(1)}%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" size={24} className="text-rose-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">Commission Payments</h3>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-surface-600">Total Paid</span>
                  <span className="font-medium">{formatCurrency(commissionSummary.totalCommissionsPaid || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">This Month</span>
                  <span className="font-medium text-green-600">{formatCurrency(commissionSummary.thisMonthCommissions || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Top Performer</span>
                  <span className="font-medium text-xs">{commissionSummary.topPerformer?.staffName || 'N/A'}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Target" size={24} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">Performance Metrics</h3>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-surface-600">Commission Types</span>
                  <span className="font-medium text-xs">
                    {commissions.filter(c => c.commissionType === 'Percentage').length}% / 
                    {commissions.filter(c => c.commissionType === 'Fixed').length}F / 
                    {commissions.filter(c => c.commissionType === 'Tiered').length}T
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Revenue Impact</span>
                  <span className="font-medium">{((commissionSummary.thisMonthCommissions || 0) / (report.totalRevenue || 1) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Recurring Revenue</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(commissions.reduce((sum, c) => sum + (c.recurringRate || 0) * 100, 0))}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Partner Discount Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-surface-900 mb-6">Partner Discount Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Handshake" size={24} className="text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">Partner Overview</h3>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-surface-600">Total Partners</span>
                  <span className="font-medium">{discountSummary.totalPartners || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Active Partners</span>
                  <span className="font-medium text-green-600">{discountSummary.activePartners || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Avg Discount</span>
                  <span className="font-medium">{(discountSummary.averageDiscountValue || 0).toFixed(1)}%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Percent" size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">Discount Impact</h3>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-surface-600">Total Discounts</span>
                  <span className="font-medium">{formatCurrency(discountSummary.totalDiscountsGiven || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">This Month</span>
                  <span className="font-medium text-red-600">{formatCurrency(discountSummary.thisMonthDiscounts || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Revenue Impact</span>
                  <span className="font-medium">{((discountSummary.thisMonthDiscounts || 0) / (report.totalRevenue || 1) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="BarChart" size={24} className="text-violet-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">Usage Statistics</h3>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-surface-600">Total Usage</span>
                  <span className="font-medium">{discountSummary.totalUsageCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">This Month</span>
                  <span className="font-medium text-green-600">{discountSummary.thisMonthUsageCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Top Partner</span>
                  <span className="font-medium text-xs">{discountSummary.topPartner?.partnerName || 'N/A'}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Net Income Summary */}
        <div className="mb-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-surface-900 mb-6">Net Income Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {formatCurrency(report.totalRevenue)}
                </div>
                <div className="text-sm text-surface-600">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">
                  -{formatCurrency(commissionSummary.thisMonthCommissions || 0)}
                </div>
                <div className="text-sm text-surface-600">Commissions Paid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  -{formatCurrency(discountSummary.thisMonthDiscounts || 0)}
                </div>
                <div className="text-sm text-surface-600">Discounts Given</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {formatCurrency(report.totalRevenue - (commissionSummary.thisMonthCommissions || 0) - (discountSummary.thisMonthDiscounts || 0))}
                </div>
                <div className="text-sm text-surface-600">Net Income</div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Export Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" icon="FileText" onClick={exportToCSV}>
              Customer Report (CSV)
            </Button>
            <Button variant="outline" icon="FileText" disabled>
              Revenue Report (PDF)
            </Button>
            <Button variant="outline" icon="FileText" disabled>
              Commission Report (Excel)
            </Button>
            <Button variant="outline" icon="FileText" disabled>
              Discount Report (PDF)
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

export default Reports