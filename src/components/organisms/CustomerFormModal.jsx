import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Modal from '@/components/molecules/Modal'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import { getServices } from '@/services/api/serviceService'

const CustomerFormModal = ({ 
  isOpen, 
  onClose, 
  customer, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    serviceId: '',
    price: '',
    billingFrequency: 'monthly',
    quantity: 1,
    startDate: '',
    contractDuration: 12,
    status: 'active',
    paymentStatus: 'TBC',
    notes: ''
  })
  
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
    loadServices()
  }, [])
  
  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || '',
        serviceId: customer.serviceId || '',
        price: customer.price || '',
        billingFrequency: customer.billingFrequency || 'monthly',
        quantity: customer.quantity || 1,
        startDate: customer.startDate || '',
        contractDuration: customer.contractDuration || 12,
        status: customer.status || 'active',
        paymentStatus: customer.paymentStatus || 'TBC',
        notes: customer.notes || ''
      })
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        serviceId: '',
        price: '',
        billingFrequency: 'monthly',
        quantity: 1,
        startDate: new Date().toISOString().split('T')[0],
        contractDuration: 12,
        status: 'active',
        paymentStatus: 'TBC',
        notes: ''
      })
    }
  }, [customer])
  
  const loadServices = async () => {
    try {
      const data = await getServices()
      setServices(data)
    } catch (error) {
      toast.error('Failed to load services')
    }
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.company.trim()) newErrors.company = 'Company is required'
    if (!formData.serviceId) newErrors.serviceId = 'Service is required'
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const customerData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        contractDuration: parseInt(formData.contractDuration)
      }
      
      if (customer) {
        customerData.Id = customer.Id
      }
      
      await onSave(customerData)
      toast.success(customer ? 'Customer updated successfully' : 'Customer added successfully')
      onClose()
    } catch (error) {
      toast.error('Failed to save customer')
    } finally {
      setLoading(false)
    }
  }
  
  const getServiceOptions = () => {
    return services.map(service => ({
      value: service.Id,
      label: `${service.name} ($${service.minPrice} - $${service.maxPrice})`
    }))
  }
  
  const billingFrequencyOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'biannually', label: 'Biannually' },
    { value: 'annually', label: 'Annually' }
  ]
  
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'churned', label: 'Churned' }
  ]
  
  const paymentStatusOptions = [
    { value: 'Paid', label: 'Paid' },
    { value: 'TBC', label: 'TBC' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Overdue', label: 'Overdue' }
  ]
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer ? 'Edit Customer' : 'Add New Customer'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            error={errors.firstName}
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            error={errors.lastName}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
          />
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        
        <Input
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          error={errors.company}
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Service"
            name="serviceId"
            value={formData.serviceId}
            onChange={handleInputChange}
            options={getServiceOptions()}
            error={errors.serviceId}
            required
          />
          <Input
            label="Price (Ex GST)"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            error={errors.price}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Billing Frequency"
            name="billingFrequency"
            value={formData.billingFrequency}
            onChange={handleInputChange}
            options={billingFrequencyOptions}
          />
          <Input
            label="Quantity"
            name="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            error={errors.startDate}
            required
          />
          <Input
            label="Contract Duration (months)"
            name="contractDuration"
            type="number"
            min="1"
            value={formData.contractDuration}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            options={statusOptions}
          />
          <Select
            label="Payment Status"
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleInputChange}
            options={paymentStatusOptions}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
            placeholder="Additional notes..."
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-surface-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {customer ? 'Update Customer' : 'Add Customer'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CustomerFormModal