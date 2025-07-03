import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import CustomerTable from '@/components/organisms/CustomerTable'
import CustomerFormModal from '@/components/organisms/CustomerFormModal'
import CSVImportModal from '@/components/organisms/CSVImportModal'
import Button from '@/components/atoms/Button'
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '@/services/api/customerService'
import { getServices } from '@/services/api/serviceService'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Modal states
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [csvModalOpen, setCsvModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [customersData, servicesData] = await Promise.all([
        getCustomers(),
        getServices()
      ])
      
      // Enrich customers with service names
      const enrichedCustomers = customersData.map(customer => {
        const service = servicesData.find(s => s.Id === parseInt(customer.service_id))
        return {
          ...customer,
          serviceName: service?.Name || 'Unknown Service'
        }
      })
      
      setCustomers(enrichedCustomers)
      setServices(servicesData)
    } catch (err) {
      setError('Failed to load customers data')
    } finally {
      setLoading(false)
    }
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
      const service = services.find(s => s.Id === parseInt(savedCustomer.service_id))
      savedCustomer.serviceName = service?.Name || 'Unknown Service'
      
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
        if (!customerData.service_id && customerData.service_id !== 0) {
          const service = services.find(s => 
            s.Name.toLowerCase() === customerData.service?.toLowerCase()
          )
          if (service) {
            customerData.service_id = service.Id
          }
        }
        
        const savedCustomer = await createCustomer(customerData)
        const service = services.find(s => s.Id === parseInt(savedCustomer.service_id))
        savedCustomer.serviceName = service?.Name || 'Unknown Service'
        importedCustomers.push(savedCustomer)
      }
      
      setCustomers(prev => [...prev, ...importedCustomers])
      setCsvModalOpen(false)
    } catch (error) {
      throw error
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface-50 p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-surface-900">Customers</h1>
            <p className="text-surface-600 mt-1">Manage your customer database</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              icon="Upload"
              onClick={() => setCsvModalOpen(true)}
            >
              Import CSV
            </Button>
            <Button
              variant="primary"
              icon="Plus"
              onClick={handleAddCustomer}
            >
              Add Customer
            </Button>
          </div>
        </div>

        <CustomerTable
          customers={customers}
          onEditCustomer={handleEditCustomer}
          onDeleteCustomer={handleDeleteCustomer}
          onStatusChange={handleStatusChange}
          onAddCustomer={handleAddCustomer}
        />
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
    </motion.div>
  )
}

export default Customers