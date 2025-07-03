export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== ''
}

export const validateNumber = (value, min = null, max = null) => {
  const num = parseFloat(value)
  
  if (isNaN(num)) return false
  
  if (min !== null && num < min) return false
  if (max !== null && num > max) return false
  
  return true
}

export const validateDate = (date) => {
  const d = new Date(date)
  return d instanceof Date && !isNaN(d)
}

export const validateCustomerForm = (formData) => {
  const errors = {}
  
  if (!validateRequired(formData.firstName)) {
    errors.firstName = 'First name is required'
  }
  
  if (!validateRequired(formData.lastName)) {
    errors.lastName = 'Last name is required'
  }
  
  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required'
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  if (!validateRequired(formData.company)) {
    errors.company = 'Company name is required'
  }
  
  if (!validateRequired(formData.serviceId)) {
    errors.serviceId = 'Service is required'
  }
  
  if (!validateRequired(formData.price)) {
    errors.price = 'Price is required'
  } else if (!validateNumber(formData.price, 0)) {
    errors.price = 'Price must be a valid number greater than 0'
  }
  
  if (!validateRequired(formData.startDate)) {
    errors.startDate = 'Start date is required'
  } else if (!validateDate(formData.startDate)) {
    errors.startDate = 'Please enter a valid date'
  }
  
  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateServiceForm = (formData) => {
  const errors = {}
  
  if (!validateRequired(formData.name)) {
    errors.name = 'Service name is required'
  }
  
  if (!validateRequired(formData.minPrice)) {
    errors.minPrice = 'Minimum price is required'
  } else if (!validateNumber(formData.minPrice, 0)) {
    errors.minPrice = 'Minimum price must be a valid number greater than 0'
  }
  
  if (!validateRequired(formData.maxPrice)) {
    errors.maxPrice = 'Maximum price is required'
  } else if (!validateNumber(formData.maxPrice, 0)) {
    errors.maxPrice = 'Maximum price must be a valid number greater than 0'
  }
  
  if (formData.minPrice && formData.maxPrice && parseFloat(formData.minPrice) > parseFloat(formData.maxPrice)) {
    errors.maxPrice = 'Maximum price must be greater than minimum price'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}