const { ApperClient } = window.ApperSDK

// Initialize ApperClient
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const tableName = 'service'

export const getServices = async () => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "min_price" } },
        { field: { Name: "max_price" } },
        { field: { Name: "description" } }
      ]
    }

    const response = await apperClient.fetchRecords(tableName, params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }

    return response.data || []
  } catch (error) {
    console.error("Error fetching services:", error)
    throw error
  }
}

export const getServiceById = async (id) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "min_price" } },
        { field: { Name: "max_price" } },
        { field: { Name: "description" } }
      ]
    }

    const response = await apperClient.getRecordById(tableName, parseInt(id), params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }

    return response.data
  } catch (error) {
    console.error(`Error fetching service with ID ${id}:`, error)
    throw error
  }
}

export const createService = async (serviceData) => {
  try {
    // Only include updateable fields
    const params = {
      records: [{
        Name: serviceData.Name,
        min_price: parseFloat(serviceData.min_price),
        max_price: parseFloat(serviceData.max_price),
        description: serviceData.description || ''
      }]
    }

    const response = await apperClient.createRecord(tableName, params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success)
      const failedRecords = response.results.filter(result => !result.success)
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
        throw new Error(failedRecords[0].message || 'Failed to create service')
      }
      
      return successfulRecords[0].data
    }
  } catch (error) {
    console.error("Error creating service:", error)
    throw error
  }
}

export const updateService = async (id, serviceData) => {
  try {
    // Only include updateable fields plus Id
    const params = {
      records: [{
        Id: parseInt(id),
        Name: serviceData.Name,
        min_price: parseFloat(serviceData.min_price),
        max_price: parseFloat(serviceData.max_price),
        description: serviceData.description || ''
      }]
    }

    const response = await apperClient.updateRecord(tableName, params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success)
      const failedUpdates = response.results.filter(result => !result.success)
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
        throw new Error(failedUpdates[0].message || 'Failed to update service')
      }
      
      return successfulUpdates[0].data
    }
  } catch (error) {
    console.error("Error updating service:", error)
    throw error
  }
}

export const deleteService = async (id) => {
  try {
    const params = {
      RecordIds: [parseInt(id)]
    }

    const response = await apperClient.deleteRecord(tableName, params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }

    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success)
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
        throw new Error(failedDeletions[0].message || 'Failed to delete service')
      }
      
      return true
    }
  } catch (error) {
    console.error("Error deleting service:", error)
    throw error
  }
}