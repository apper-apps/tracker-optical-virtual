const { ApperClient } = window.ApperSDK

// Initialize ApperClient
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const tableName = 'app_Customer'

export const getCustomers = async () => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "first_name" } },
        { field: { Name: "last_name" } },
        { field: { Name: "email" } },
        { field: { Name: "phone" } },
        { field: { Name: "company" } },
        { field: { Name: "service_id" } },
        { field: { Name: "price" } },
        { field: { Name: "billing_frequency" } },
        { field: { Name: "quantity" } },
        { field: { Name: "start_date" } },
        { field: { Name: "contract_duration" } },
        { field: { Name: "status" } },
        { field: { Name: "payment_status" } },
        { field: { Name: "notes" } }
      ]
    }

    const response = await apperClient.fetchRecords(tableName, params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }

    return response.data || []
  } catch (error) {
    console.error("Error fetching customers:", error)
    throw error
  }
}

export const getCustomerById = async (id) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "first_name" } },
        { field: { Name: "last_name" } },
        { field: { Name: "email" } },
        { field: { Name: "phone" } },
        { field: { Name: "company" } },
        { field: { Name: "service_id" } },
        { field: { Name: "price" } },
        { field: { Name: "billing_frequency" } },
        { field: { Name: "quantity" } },
        { field: { Name: "start_date" } },
        { field: { Name: "contract_duration" } },
        { field: { Name: "status" } },
        { field: { Name: "payment_status" } },
        { field: { Name: "notes" } }
      ]
    }

    const response = await apperClient.getRecordById(tableName, parseInt(id), params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }

    return response.data
  } catch (error) {
    console.error(`Error fetching customer with ID ${id}:`, error)
    throw error
  }
}

export const createCustomer = async (customerData) => {
  try {
    // Only include updateable fields
    const params = {
      records: [{
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        email: customerData.email,
        phone: customerData.phone || '',
        company: customerData.company,
        service_id: parseInt(customerData.service_id),
        price: parseFloat(customerData.price),
        billing_frequency: customerData.billing_frequency,
        quantity: parseInt(customerData.quantity) || 1,
        start_date: customerData.start_date,
        contract_duration: parseInt(customerData.contract_duration) || 12,
        status: customerData.status,
        payment_status: customerData.payment_status,
        notes: customerData.notes || ''
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
        throw new Error(failedRecords[0].message || 'Failed to create customer')
      }
      
      return successfulRecords[0].data
    }
  } catch (error) {
    console.error("Error creating customer:", error)
    throw error
  }
}

export const updateCustomer = async (id, customerData) => {
  try {
    // Only include updateable fields plus Id
    const params = {
      records: [{
        Id: parseInt(id),
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        email: customerData.email,
        phone: customerData.phone || '',
        company: customerData.company,
        service_id: parseInt(customerData.service_id),
        price: parseFloat(customerData.price),
        billing_frequency: customerData.billing_frequency,
        quantity: parseInt(customerData.quantity) || 1,
        start_date: customerData.start_date,
        contract_duration: parseInt(customerData.contract_duration) || 12,
        status: customerData.status,
        payment_status: customerData.payment_status,
        notes: customerData.notes || ''
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
        throw new Error(failedUpdates[0].message || 'Failed to update customer')
      }
      
      return successfulUpdates[0].data
    }
  } catch (error) {
    console.error("Error updating customer:", error)
    throw error
  }
}

export const deleteCustomer = async (id) => {
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
        throw new Error(failedDeletions[0].message || 'Failed to delete customer')
      }
      
      return true
    }
  } catch (error) {
    console.error("Error deleting customer:", error)
    throw error
  }
}