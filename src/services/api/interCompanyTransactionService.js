const { ApperClient } = window.ApperSDK

// Initialize ApperClient
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const tableName = 'app_InterCompanyTransaction'

export const getInterCompanyTransactions = async () => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "transactionDate" } },
        { field: { Name: "amount" } },
        { field: { Name: "description" } },
        { field: { Name: "mainCompany" } },
        { field: { Name: "subsidiary" } },
        { field: { Name: "transactionType" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } }
      ],
      orderBy: [
        {
          fieldName: "transactionDate",
          sorttype: "DESC"
        }
      ]
    }

    const response = await apperClient.fetchRecords(tableName, params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }

    return response.data || []
  } catch (error) {
    console.error("Error fetching inter-company transactions:", error)
    throw error
  }
}

export const getInterCompanyTransactionById = async (id) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "transactionDate" } },
        { field: { Name: "amount" } },
        { field: { Name: "description" } },
        { field: { Name: "mainCompany" } },
        { field: { Name: "subsidiary" } },
        { field: { Name: "transactionType" } }
      ]
    }

    const response = await apperClient.getRecordById(tableName, parseInt(id), params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }

    return response.data
  } catch (error) {
    console.error(`Error fetching transaction with ID ${id}:`, error)
    throw error
  }
}

export const createInterCompanyTransaction = async (transactionData) => {
  try {
    // Only include updateable fields
    const params = {
      records: [{
        Name: transactionData.Name,
        transactionDate: transactionData.transactionDate,
        amount: parseFloat(transactionData.amount),
        description: transactionData.description || '',
        mainCompany: parseInt(transactionData.mainCompany),
        subsidiary: parseInt(transactionData.subsidiary),
        transactionType: transactionData.transactionType
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
        throw new Error(failedRecords[0].message || 'Failed to create transaction')
      }
      
      return successfulRecords[0].data
    }
  } catch (error) {
    console.error("Error creating inter-company transaction:", error)
    throw error
  }
}

export const updateInterCompanyTransaction = async (id, transactionData) => {
  try {
    // Only include updateable fields plus Id
    const params = {
      records: [{
        Id: parseInt(id),
        Name: transactionData.Name,
        transactionDate: transactionData.transactionDate,
        amount: parseFloat(transactionData.amount),
        description: transactionData.description || '',
        mainCompany: parseInt(transactionData.mainCompany),
        subsidiary: parseInt(transactionData.subsidiary),
        transactionType: transactionData.transactionType
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
        throw new Error(failedUpdates[0].message || 'Failed to update transaction')
      }
      
      return successfulUpdates[0].data
    }
  } catch (error) {
    console.error("Error updating inter-company transaction:", error)
    throw error
  }
}

export const deleteInterCompanyTransaction = async (id) => {
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
        throw new Error(failedDeletions[0].message || 'Failed to delete transaction')
      }
      
      return true
    }
  } catch (error) {
    console.error("Error deleting inter-company transaction:", error)
    throw error
  }
}

export const getTransactionsByCompany = async (companyId, companyType = 'main') => {
  try {
    const fieldName = companyType === 'main' ? 'mainCompany' : 'subsidiary'
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "transactionDate" } },
        { field: { Name: "amount" } },
        { field: { Name: "description" } },
        { field: { Name: "mainCompany" } },
        { field: { Name: "subsidiary" } },
        { field: { Name: "transactionType" } }
      ],
      where: [
        {
          FieldName: fieldName,
          Operator: "EqualTo",
          Values: [parseInt(companyId)]
        }
      ],
      orderBy: [
        {
          fieldName: "transactionDate",
          sorttype: "DESC"
        }
      ]
    }

    const response = await apperClient.fetchRecords(tableName, params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }

    return response.data || []
  } catch (error) {
    console.error("Error fetching transactions by company:", error)
    throw error
  }
}