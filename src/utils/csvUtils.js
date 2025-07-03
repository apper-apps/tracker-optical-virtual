export const parseCSV = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim())
  
  if (lines.length < 2) {
    throw new Error('CSV file must contain at least a header and one data row')
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
  
  return { headers, data }
}

export const generateCSV = (data, headers) => {
  const csvHeaders = headers.join(',')
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header] || ''
      return `"${value}"`
    }).join(',')
  })
  
  return [csvHeaders, ...csvRows].join('\n')
}

export const downloadCSV = (data, filename = 'export.csv') => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

export const generateSampleCSV = () => {
  const sampleData = [
    ['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Service', 'Price', 'Billing Frequency', 'Quantity', 'Start Date', 'Contract Duration', 'Status', 'Payment Status', 'Notes'],
    ['John', 'Doe', 'john@example.com', '1234567890', 'Example Corp', 'CRM', '499', 'monthly', '1', '2024-01-01', '12', 'active', 'Paid', 'Sample customer'],
    ['Jane', 'Smith', 'jane@example.com', '0987654321', 'Sample Ltd', 'MapBooster', '299', 'quarterly', '2', '2024-02-01', '24', 'pending', 'TBC', 'Multi-location client']
  ]
  
  return sampleData.map(row => row.join(',')).join('\n')
}

export const validateCSVData = (data, requiredFields = []) => {
  const errors = []
  
  if (!data || data.length === 0) {
    errors.push('No data found in CSV file')
    return errors
  }
  
  const headers = Object.keys(data[0])
  
  requiredFields.forEach(field => {
    if (!headers.includes(field)) {
      errors.push(`Missing required field: ${field}`)
    }
  })
  
  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field] || row[field].trim() === '') {
        errors.push(`Row ${index + 1}: Missing value for ${field}`)
      }
    })
  })
  
  return errors
}