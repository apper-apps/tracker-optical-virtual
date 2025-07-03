import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Modal from '@/components/molecules/Modal'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import { getSettings, updateSettings } from '@/services/api/settingsService'

const SettingsModal = ({ isOpen, onClose, onSettingsChange }) => {
  const [settings, setSettings] = useState({
    companyName: '',
    gstRate: 10,
    currency: 'AUD',
    currencySymbol: '$'
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
    if (isOpen) {
      loadSettings()
    }
  }, [isOpen])
  
  const loadSettings = async () => {
    try {
      const data = await getSettings()
      setSettings(data)
    } catch (error) {
      toast.error('Failed to load settings')
    }
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: name === 'gstRate' ? parseFloat(value) : value
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
    
    if (!settings.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }
    
    if (settings.gstRate < 0 || settings.gstRate > 100) {
      newErrors.gstRate = 'GST rate must be between 0 and 100'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      await updateSettings(settings)
      onSettingsChange?.(settings)
      toast.success('Settings updated successfully')
      onClose()
    } catch (error) {
      toast.error('Failed to update settings')
    } finally {
      setLoading(false)
    }
  }
  
  const currencyOptions = [
    { value: 'AUD', label: 'Australian Dollar (AUD)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' }
  ]
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      size="md"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-4">
          <Input
            label="Company Name"
            name="companyName"
            value={settings.companyName}
            onChange={handleInputChange}
            error={errors.companyName}
            placeholder="Your Company Name"
            required
          />
          
          <Input
            label="GST Rate (%)"
            name="gstRate"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={settings.gstRate}
            onChange={handleInputChange}
            error={errors.gstRate}
            helper="Enter the GST/tax rate for your region"
            required
          />
          
          <Select
            label="Currency"
            name="currency"
            value={settings.currency}
            onChange={handleInputChange}
            options={currencyOptions}
          />
          
          <Input
            label="Currency Symbol"
            name="currencySymbol"
            value={settings.currencySymbol}
            onChange={handleInputChange}
            placeholder="$"
            maxLength={3}
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
            Save Settings
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default SettingsModal