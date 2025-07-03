import { getSettingsData } from '@/services/mockData/settings'

let settings = null

const initializeSettings = () => {
  if (!settings) {
    settings = { ...getSettingsData() }
  }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getSettings = async () => {
  await delay(200)
  initializeSettings()
  return { ...settings }
}

export const updateSettings = async (settingsData) => {
  await delay(300)
  initializeSettings()
  
  settings = {
    ...settings,
    ...settingsData,
    gstRate: parseFloat(settingsData.gstRate)
  }
  
  return { ...settings }
}