import { useState } from 'react'
import { toast } from 'react-toastify'
import Modal from '@/components/molecules/Modal'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const CSVImportModal = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState(null)
  const [csvData, setCsvData] = useState([])
  const [fieldMapping, setFieldMapping] = useState({})
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: upload, 2: mapping, 3: preview
  
  const requiredFields = [
    { key: 'firstName', label: 'First Name', required: true },
    { key: 'lastName', label: 'Last Name', required: true },
    { key: 'email', label: 'Email', required: true },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'company', label: 'Company', required: true },
    { key: 'serviceId', label: 'Service', required: true },
    { key: 'price', label: 'Price', required: true },
    { key: 'billingFrequency', label: 'Billing Frequency', required: false },
    { key: 'quantity', label: 'Quantity', required: false },
    { key: 'startDate', label: 'Start Date', required: false },
    { key: 'contractDuration', label: 'Contract Duration', required: false },
    { key: 'status', label: 'Status', required: false },
    { key: 'paymentStatus', label: 'Payment Status', required: false },
    { key: 'notes', label: 'Notes', required: false }
  ]
  
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0]
    if (!uploadedFile) return
    
    if (uploadedFile.type !== 'text/csv') {
      toast.error('Please upload a CSV file')
      return
    }
    
    setFile(uploadedFile)
    parseCSV(uploadedFile)
  }
  
  const parseCSV = (file) => {
    setLoading(true)
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const lines = text.split('\n').filter(line => line.trim())
        
        if (lines.length < 2) {
          toast.error('CSV file must contain at least a header and one data row')
          return
        }
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
          const row = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          return row
        })
        
        setCsvData(data)
        initializeFieldMapping(headers)
        setStep(2)
      } catch (error) {
        toast.error('Error parsing CSV file')
      } finally {
        setLoading(false)
      }
    }
    
    reader.readAsText(file)
  }
  
  const initializeFieldMapping = (headers) => {
    const mapping = {}
    
    requiredFields.forEach(field => {
      const matchingHeader = headers.find(header => 
        header.toLowerCase().includes(field.key.toLowerCase()) ||
        header.toLowerCase().includes(field.label.toLowerCase())
      )
      
      if (matchingHeader) {
        mapping[field.key] = matchingHeader
      }
    })
    
    setFieldMapping(mapping)
  }
  
  const handleMappingChange = (fieldKey, headerValue) => {
    setFieldMapping(prev => ({
      ...prev,
      [fieldKey]: headerValue
    }))
  }
  
  const validateMapping = () => {
    const errors = []
    
    requiredFields.forEach(field => {
      if (field.required && !fieldMapping[field.key]) {
        errors.push(`${field.label} is required`)
      }
    })
    
    if (errors.length > 0) {
      toast.error(`Missing required fields: ${errors.join(', ')}`)
      return false
    }
    
    return true
  }
  
  const handleImport = async () => {
    if (!validateMapping()) return
    
    setLoading(true)
    try {
      const mappedData = csvData.map(row => {
        const customer = {}
        
        Object.entries(fieldMapping).forEach(([fieldKey, headerKey]) => {
          if (headerKey && row[headerKey] !== undefined) {
            customer[fieldKey] = row[headerKey]
          }
        })
        
        // Set defaults for missing fields
        customer.billingFrequency = customer.billingFrequency || 'monthly'
        customer.quantity = customer.quantity || 1
        customer.status = customer.status || 'active'
        customer.paymentStatus = customer.paymentStatus || 'TBC'
        customer.contractDuration = customer.contractDuration || 12
        
        return customer
      })
      
      await onImport(mappedData)
      toast.success(`Successfully imported ${mappedData.length} customers`)
      onClose()
    } catch (error) {
      toast.error('Failed to import customers')
    } finally {
      setLoading(false)
    }
  }
  
  const downloadSample = () => {
    const sampleData = [
      'First Name,Last Name,Email,Phone,Company,Service,Price,Billing Frequency,Quantity,Start Date,Contract Duration,Status,Payment Status,Notes',
      'John,Doe,john@example.com,1234567890,Example Corp,CRM,499,monthly,1,2024-01-01,12,active,Paid,Sample customer'
    ]
    
    const blob = new Blob([sampleData.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample_customers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }
  
  const getAvailableHeaders = () => {
    if (!csvData.length) return []
    return Object.keys(csvData[0])
  }
  
  const resetModal = () => {
    setStep(1)
    setFile(null)
    setCsvData([])
    setFieldMapping({})
    setLoading(false)
  }
  
  const handleClose = () => {
    resetModal()
    onClose()
  }
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Customers from CSV"
      size="lg"
    >
      <div className="p-6">
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-surface-300 rounded-lg p-8 text-center">
              <ApperIcon name="Upload" size={48} className="mx-auto text-surface-400 mb-4" />
              <div className="space-y-2">
                <label className="block">
                  <span className="sr-only">Choose CSV file</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </label>
                <p className="text-sm text-surface-600">
                  Upload a CSV file with customer data
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Button
                variant="outline"
                onClick={downloadSample}
                icon="Download"
              >
                Download Sample CSV
              </Button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-surface-200 pb-4">
              <h3 className="text-lg font-medium text-surface-900 mb-2">
                Map CSV Fields
              </h3>
              <p className="text-sm text-surface-600">
                Map your CSV columns to customer fields
              </p>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {requiredFields.map(field => (
                <div key={field.key} className="flex items-center space-x-4">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-surface-700">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  </div>
                  <div className="w-2/3">
                    <select
                      value={fieldMapping[field.key] || ''}
                      onChange={(e) => handleMappingChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                    >
                      <option value="">Select CSV column</option>
                      {getAvailableHeaders().map(header => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between pt-4 border-t border-surface-200">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleImport}
                loading={loading}
              >
                Import Customers
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default CSVImportModal