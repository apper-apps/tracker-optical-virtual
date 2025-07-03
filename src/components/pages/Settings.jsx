import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { getSettings, updateSettings } from '@/services/api/settingsService'

const Settings = () => {
  const [settings, setSettings] = useState({
    company_name: '',
    gst_rate: '',
    currency1: '',
    currency_symbol: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    setError('')
    
    try {
      const data = await getSettings()
      setSettings({
        company_name: data.company_name || '',
        gst_rate: data.gst_rate || '',
        currency1: data.currency1 || '',
        currency_symbol: data.currency_symbol || ''
      })
    } catch (err) {
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const updatedSettings = await updateSettings(1, {
        ...settings,
        gst_rate: parseFloat(settings.gst_rate) || 0
      })
      
      setSettings(updatedSettings)
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadSettings} />

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface-50 p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900">Settings</h1>
          <p className="text-surface-600 mt-1">Configure your application preferences</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Building" size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-surface-900">Company Information</h3>
                <p className="text-surface-600 text-sm">Basic company details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={settings.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="Enter company name"
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="DollarSign" size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-surface-900">Financial Settings</h3>
                <p className="text-surface-600 text-sm">Currency and tax configuration</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Currency"
                value={settings.currency1}
                onChange={(e) => handleInputChange('currency1', e.target.value)}
                placeholder="USD"
              />
              
              <Input
                label="Currency Symbol"
                value={settings.currency_symbol}
                onChange={(e) => handleInputChange('currency_symbol', e.target.value)}
                placeholder="$"
              />
              
              <Input
                label="GST Rate (%)"
                type="number"
                step="0.01"
                value={settings.gst_rate}
                onChange={(e) => handleInputChange('gst_rate', e.target.value)}
                placeholder="10.00"
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              icon={saving ? "Loader" : "Save"}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export default Settings