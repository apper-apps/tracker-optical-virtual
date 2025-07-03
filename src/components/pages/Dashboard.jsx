import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Header from '@/components/organisms/Header'
import MetricsGrid from '@/components/organisms/MetricsGrid'
import CustomerTable from '@/components/organisms/CustomerTable'
import CustomerFormModal from '@/components/organisms/CustomerFormModal'
import CSVImportModal from '@/components/organisms/CSVImportModal'
import SettingsModal from '@/components/organisms/SettingsModal'
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '@/services/api/customerService'
import { getServices } from '@/services/api/serviceService'
import { getSettings } from '@/services/api/settingsService'

const Dashboard = () => {
  const [customers, setCustomers] = useState([])
  const [services, setServices] = useState([])
  const [settings, setSettings] = useState({ gstRate: 10, currencySymbol: '$' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Modal states
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [csvModalOpen, setCsvModalOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [customersData, servicesData, settingsData] = await Promise.all([
        getCustomers(),
        getServices(),
        getSettings()
      ])
      
      // Enrich customers with service names
      const enrichedCustomers = customersData.map(customer => {
        const service = servicesData.find(s => s.Id === parseInt(customer.serviceId))
        return {
          ...customer,
          serviceName: service?.name || 'Unknown Service'
        }
      })
      
      setCustomers(enrichedCustomers)
      setServices(servicesData)
      setSettings(settingsData)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }
  
  const calculateMetrics = () => {
    let activeMrr = 0
    let pendingMrr = 0
    let activeCustomers = 0
    let totalCustomers = customers.length
    let pendingCustomers = 0
    let churnedCustomers = 0
    
    customers.forEach(customer => {
      const monthlyRevenue = calculateMonthlyRevenue(customer.price * customer.quantity, customer.billingFrequency)
      
      if (customer.status === 'active') {
        activeMrr += monthlyRevenue
        activeCustomers++
      } else if (customer.status === 'pending') {
        pendingMrr += monthlyRevenue
        pendingCustomers++
      } else if (customer.status === 'churned') {
        churnedCustomers++
      }
    })
    
    const avgRevenue = activeCustomers > 0 ? activeMrr / activeCustomers : 0
    const totalMrr = activeMrr + pendingMrr
    const totalGst = totalMrr * (settings.gstRate / 100)
    const revenueWithGst = totalMrr + totalGst
    const annualProjection = revenueWithGst * 12
    
    return {
      activeMrr: formatCurrency(activeMrr),
      pendingMrr: formatCurrency(pendingMrr),
      activeCustomers: activeCustomers.toString(),
      totalCustomers: totalCustomers.toString(),
      avgRevenue: formatCurrency(avgRevenue),
      totalGst: formatCurrency(totalGst),
      monthlyRevenue: formatCurrency(totalMrr),
      revenueWithGst: formatCurrency(revenueWithGst),
      annualProjection: formatCurrency(annualProjection)
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
  
  const handleAddCustomer = () => {
    setEditingCustomer(null)
    setCustomerModalOpen(true)
  }
  
  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer)
    setCustomerModalOpen(true)
  }
  
  const handleSaveCustomer = async (customerData) => {
    try {
      let savedCustomer
      
      if (editingCustomer) {
        savedCustomer = await updateCustomer(editingCustomer.Id, customerData)
      } else {
        savedCustomer = await createCustomer(customerData)
      }
      
      // Enrich with service name
      const service = services.find(s => s.Id === parseInt(savedCustomer.serviceId))
      savedCustomer.serviceName = service?.name || 'Unknown Service'
      
      if (editingCustomer) {
        setCustomers(prev => prev.map(c => 
          c.Id === editingCustomer.Id ? savedCustomer : c
        ))
      } else {
        setCustomers(prev => [...prev, savedCustomer])
      }
      
      setCustomerModalOpen(false)
      setEditingCustomer(null)
    } catch (error) {
      throw error
    }
  }
  
  const handleDeleteCustomer = async (customerId) => {
    try {
      await deleteCustomer(customerId)
      setCustomers(prev => prev.filter(c => c.Id !== customerId))
    } catch (error) {
      toast.error('Failed to delete customer')
    }
  }
  
  const handleStatusChange = async (customerId, newStatus) => {
    try {
      const customer = customers.find(c => c.Id === customerId)
      if (!customer) return
      
      const updatedCustomer = await updateCustomer(customerId, { ...customer, status: newStatus })
      updatedCustomer.serviceName = customer.serviceName
      
      setCustomers(prev => prev.map(c => 
        c.Id === customerId ? updatedCustomer : c
      ))
    } catch (error) {
      toast.error('Failed to update customer status')
    }
  }
  
  const handleImportCSV = async (importData) => {
    try {
      const importedCustomers = []
      
      for (const customerData of importData) {
        // Find service by name if serviceId is not provided
        if (!customerData.serviceId && customerData.serviceId !== 0) {
          const service = services.find(s => 
            s.name.toLowerCase() === customerData.service?.toLowerCase()
          )
          if (service) {
            customerData.serviceId = service.Id
          }
        }
        
        const savedCustomer = await createCustomer(customerData)
        const service = services.find(s => s.Id === parseInt(savedCustomer.serviceId))
        savedCustomer.serviceName = service?.name || 'Unknown Service'
        importedCustomers.push(savedCustomer)
      }
      
      setCustomers(prev => [...prev, ...importedCustomers])
      setCsvModalOpen(false)
    } catch (error) {
      throw error
    }
  }
  
  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings)
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />
  
  const metrics = calculateMetrics()
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface-50"
    >
      <Header 
        onAddCustomer={handleAddCustomer}
        onImportCSV={() => setCsvModalOpen(true)}
        onSettings={() => setSettingsModalOpen(true)}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <MetricsGrid metrics={metrics} />
          
          <CustomerTable
            customers={customers}
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onStatusChange={handleStatusChange}
            onAddCustomer={handleAddCustomer}
          />
        </div>
      </div>
      
      <CustomerFormModal
        isOpen={customerModalOpen}
        onClose={() => {
          setCustomerModalOpen(false)
          setEditingCustomer(null)
        }}
        customer={editingCustomer}
        onSave={handleSaveCustomer}
      />
      
      <CSVImportModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onImport={handleImportCSV}
      />
      
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onSettingsChange={handleSettingsChange}
      />
    </motion.div>
  )
}

export default Dashboard