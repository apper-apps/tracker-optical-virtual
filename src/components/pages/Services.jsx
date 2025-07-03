import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Modal from '@/components/molecules/Modal'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { getServices, createService, updateService, deleteService } from '@/services/api/serviceService'

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    Name: '',
    description: '',
    min_price: '',
    max_price: ''
  })

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    setLoading(true)
    setError('')
    
    try {
      const data = await getServices()
      setServices(data)
    } catch (err) {
      setError('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const handleAddService = () => {
    setEditingService(null)
    setFormData({
      Name: '',
      description: '',
      min_price: '',
      max_price: ''
    })
    setModalOpen(true)
  }

  const handleEditService = (service) => {
    setEditingService(service)
    setFormData({
      Name: service.Name,
      description: service.description || '',
      min_price: service.min_price || '',
      max_price: service.max_price || ''
    })
    setModalOpen(true)
  }

  const handleSaveService = async (e) => {
    e.preventDefault()
    
    try {
      const serviceData = {
        ...formData,
        min_price: parseFloat(formData.min_price) || 0,
        max_price: parseFloat(formData.max_price) || 0
      }

      let savedService
      if (editingService) {
        savedService = await updateService(editingService.Id, serviceData)
        setServices(prev => prev.map(s => 
          s.Id === editingService.Id ? savedService : s
        ))
        toast.success('Service updated successfully')
      } else {
        savedService = await createService(serviceData)
        setServices(prev => [...prev, savedService])
        toast.success('Service created successfully')
      }
      
      setModalOpen(false)
      setEditingService(null)
    } catch (error) {
      toast.error('Failed to save service')
    }
  }

  const handleDeleteService = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      await deleteService(serviceId)
      setServices(prev => prev.filter(s => s.Id !== serviceId))
      toast.success('Service deleted successfully')
    } catch (error) {
      toast.error('Failed to delete service')
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadServices} />

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface-50 p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-surface-900">Services</h1>
            <p className="text-surface-600 mt-1">Manage your service offerings</p>
          </div>
          <Button
            variant="primary"
            icon="Plus"
            onClick={handleAddService}
          >
            Add Service
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.Id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Package" size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900">{service.Name}</h3>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditService(service)}
                    className="text-surface-600 hover:text-primary-600 transition-colors"
                  >
                    <ApperIcon name="Edit" size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.Id)}
                    className="text-surface-600 hover:text-red-600 transition-colors"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                </div>
              </div>

              {service.description && (
                <p className="text-surface-600 text-sm mb-4">{service.description}</p>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Min Price:</span>
                <span className="font-medium">${service.min_price || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Max Price:</span>
                <span className="font-medium">${service.max_price || 0}</span>
              </div>
            </Card>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="Package" size={48} className="text-surface-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">No services yet</h3>
            <p className="text-surface-600 mb-6">Get started by adding your first service</p>
            <Button variant="primary" icon="Plus" onClick={handleAddService}>
              Add Service
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add Service'}
      >
        <form onSubmit={handleSaveService} className="space-y-4">
          <Input
            label="Service Name"
            value={formData.Name}
            onChange={(e) => setFormData(prev => ({ ...prev, Name: e.target.value }))}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Price"
              type="number"
              step="0.01"
              value={formData.min_price}
              onChange={(e) => setFormData(prev => ({ ...prev, min_price: e.target.value }))}
            />
            
            <Input
              label="Max Price"
              type="number"
              step="0.01"
              value={formData.max_price}
              onChange={(e) => setFormData(prev => ({ ...prev, max_price: e.target.value }))}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingService ? 'Update' : 'Create'} Service
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}

export default Services