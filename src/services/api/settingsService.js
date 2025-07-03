const { ApperClient } = window.ApperSDK;

// Initialize ApperClient
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'settings';

export const getSettings = async () => {
  try {
const params = {
      fields: [
        { "field": { "name": "Name" } },
        { "field": { "name": "company_name" } },
        { "field": { "name": "gst_rate" } },
        { "field": { "name": "currency1" } },
        { "field": { "name": "currency_symbol" } }
      ]
    };

    const response = await apperClient.fetchRecords(tableName, params);
if (!response.success) {
      const errorMessage = response?.message || 'Failed to fetch settings';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
// Return first settings record or default values
    const settings = response.data?.[0] || {};
    return {
      companyName: settings.company_name || '',
      gstRate: settings.gst_rate || 10,
      currency: settings.currency1 || 'AUD',
      currencySymbol: settings.currency_symbol || '$'
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Return default settings on error
    return {
      companyName: 'MRR Tracker Pro',
      gstRate: 10,
      currency: 'AUD',
      currencySymbol: '$'
    };
  }
};
export const updateSettings = async (settingsData) => {
  try {
    // First, try to get existing settings to check if we need to create or update
const existingSettings = await apperClient.fetchRecords(tableName, {
      fields: [
        { "field": { "name": "Name" } },
        { "field": { "name": "company_name" } },
        { "field": { "name": "gst_rate" } },
        { "field": { "name": "currency1" } },
        { "field": { "name": "currency_symbol" } }
      ]
    });
const params = {
      records: [{
        company_name: settingsData.companyName,
        gst_rate: parseFloat(settingsData.gstRate),
        currency1: settingsData.currency,
        currency_symbol: settingsData.currencySymbol
      }]
    };
let response;
    if (existingSettings.success && existingSettings.data?.length > 0) {
      // Update existing record
      params.records[0].Id = existingSettings.data[0].Id;
      response = await apperClient.updateRecord(tableName, params);
    } else {
      // Create new record
      response = await apperClient.createRecord(tableName, params);
    }
if (!response.success) {
      const errorMessage = response?.message || 'Failed to update settings';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records: ${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update settings');
      }
      
      // Return formatted settings
      const savedRecord = successfulRecords[0].data;
      return {
        companyName: savedRecord.company_name,
        gstRate: savedRecord.gst_rate,
        currency: savedRecord.currency1,
        currencySymbol: savedRecord.currency_symbol
      };
    }
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};