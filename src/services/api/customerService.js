import { getCustomersData } from '@/services/mockData/customers'

let customers = null

const initializeCustomers = () => {
  if (!customers) {
    customers = [...getCustomersData()]
  }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getCustomers = async () => {
  await delay(300)
  initializeCustomers()
  return [...customers]
}

export const getCustomerById = async (id) => {
  await delay(200)
  initializeCustomers()
  const customer = customers.find(c => c.Id === parseInt(id))
  if (!customer) {
    throw new Error('Customer not found')
  }
  return { ...customer }
}

export const createCustomer = async (customerData) => {
  await delay(400)
  initializeCustomers()
  
  const newId = Math.max(...customers.map(c => c.Id), 0) + 1
  const newCustomer = {
    Id: newId,
    ...customerData,
    price: parseFloat(customerData.price),
    quantity: parseInt(customerData.quantity) || 1,
    contractDuration: parseInt(customerData.contractDuration) || 12
  }
  
  customers.push(newCustomer)
  return { ...newCustomer }
}

export const updateCustomer = async (id, customerData) => {
  await delay(400)
  initializeCustomers()
  
  const index = customers.findIndex(c => c.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Customer not found')
  }
  
  customers[index] = {
    ...customers[index],
    ...customerData,
    Id: parseInt(id),
    price: parseFloat(customerData.price),
    quantity: parseInt(customerData.quantity) || 1,
    contractDuration: parseInt(customerData.contractDuration) || 12
  }
  
  return { ...customers[index] }
}

export const deleteCustomer = async (id) => {
  await delay(300)
  initializeCustomers()
  
  const index = customers.findIndex(c => c.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Customer not found')
  }
  
  customers.splice(index, 1)
  return true
}