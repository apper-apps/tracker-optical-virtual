export const formatCurrency = (amount, currency = 'AUD', symbol = '$') => {
  if (typeof amount !== 'number') return `${symbol}0`
  
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatDate = (date) => {
  if (!date) return ''
  
  const d = new Date(date)
  return d.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatPercentage = (value) => {
  if (typeof value !== 'number') return '0%'
  
  return new Intl.NumberFormat('en-AU', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100)
}

export const formatNumber = (value) => {
  if (typeof value !== 'number') return '0'
  
  return new Intl.NumberFormat('en-AU').format(value)
}

export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}