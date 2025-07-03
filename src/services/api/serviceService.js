import { getServicesData } from '@/services/mockData/services'

let services = null

const initializeServices = () => {
  if (!services) {
    services = [...getServicesData()]
  }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getServices = async () => {
  await delay(200)
  initializeServices()
  return [...services]
}

export const getServiceById = async (id) => {
  await delay(200)
  initializeServices()
  const service = services.find(s => s.Id === parseInt(id))
  if (!service) {
    throw new Error('Service not found')
  }
  return { ...service }
}

export const createService = async (serviceData) => {
  await delay(300)
  initializeServices()
  
  const newId = Math.max(...services.map(s => s.Id), 0) + 1
  const newService = {
    Id: newId,
    ...serviceData,
    minPrice: parseFloat(serviceData.minPrice),
    maxPrice: parseFloat(serviceData.maxPrice)
  }
  
  services.push(newService)
  return { ...newService }
}

export const updateService = async (id, serviceData) => {
  await delay(300)
  initializeServices()
  
  const index = services.findIndex(s => s.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Service not found')
  }
  
  services[index] = {
    ...services[index],
    ...serviceData,
    Id: parseInt(id),
    minPrice: parseFloat(serviceData.minPrice),
    maxPrice: parseFloat(serviceData.maxPrice)
  }
  
  return { ...services[index] }
}

export const deleteService = async (id) => {
  await delay(300)
  initializeServices()
  
  const index = services.findIndex(s => s.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Service not found')
  }
  
  services.splice(index, 1)
  return true
}