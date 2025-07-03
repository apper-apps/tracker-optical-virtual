// Mock service layer for sales commission management
// Note: This uses mock data as no commission table exists in the database

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock commission data
let commissionsData = [
  {
    Id: 1,
    staffName: "John Smith",
    staffEmail: "john.smith@company.com",
    commissionType: "Percentage",
    commissionRate: 5.0,
    recurringRate: 2.5,
    isActive: true,
    totalCommissionsEarned: 15000,
    thisMonthCommissions: 2500,
    salesTarget: 50000,
    currentSales: 35000,
    createdDate: "2024-01-15"
  },
  {
    Id: 2,
    staffName: "Sarah Johnson",
    staffEmail: "sarah.johnson@company.com",
    commissionType: "Fixed",
    commissionRate: 500,
    recurringRate: 200,
    isActive: true,
    totalCommissionsEarned: 12000,
    thisMonthCommissions: 1200,
    salesTarget: 40000,
    currentSales: 28000,
    createdDate: "2024-02-01"
  },
  {
    Id: 3,
    staffName: "Mike Chen",
    staffEmail: "mike.chen@company.com",
    commissionType: "Tiered",
    commissionRate: 3.0,
    recurringRate: 1.5,
    isActive: true,
    totalCommissionsEarned: 18500,
    thisMonthCommissions: 3200,
    salesTarget: 60000,
    currentSales: 45000,
    createdDate: "2024-01-10"
  },
  {
    Id: 4,
    staffName: "Emily Davis",
    staffEmail: "emily.davis@company.com",
    commissionType: "Percentage",
    commissionRate: 4.5,
    recurringRate: 2.0,
    isActive: false,
    totalCommissionsEarned: 8500,
    thisMonthCommissions: 0,
    salesTarget: 30000,
    currentSales: 0,
    createdDate: "2024-03-05"
  },
  {
    Id: 5,
    staffName: "David Wilson",
    staffEmail: "david.wilson@company.com",
    commissionType: "Fixed",
    commissionRate: 750,
    recurringRate: 300,
    isActive: true,
    totalCommissionsEarned: 22000,
    thisMonthCommissions: 2850,
    salesTarget: 70000,
    currentSales: 52000,
    createdDate: "2024-01-20"
  }
]

let nextId = 6

export const getSalesCommissions = async () => {
  await delay(300)
  return [...commissionsData]
}

export const getSalesCommissionById = async (id) => {
  await delay(200)
  const commission = commissionsData.find(c => c.Id === parseInt(id))
  return commission ? { ...commission } : null
}

export const createSalesCommission = async (commissionData) => {
  await delay(400)
  const newCommission = {
    ...commissionData,
    Id: nextId++,
    totalCommissionsEarned: 0,
    thisMonthCommissions: 0,
    currentSales: 0,
    createdDate: new Date().toISOString().split('T')[0]
  }
  commissionsData.push(newCommission)
  return { ...newCommission }
}

export const updateSalesCommission = async (id, commissionData) => {
  await delay(350)
  const index = commissionsData.findIndex(c => c.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Commission not found')
  }
  
  commissionsData[index] = {
    ...commissionsData[index],
    ...commissionData,
    Id: parseInt(id)
  }
  
  return { ...commissionsData[index] }
}

export const deleteSalesCommission = async (id) => {
  await delay(250)
  const index = commissionsData.findIndex(c => c.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Commission not found')
  }
  
  commissionsData.splice(index, 1)
  return true
}

export const getCommissionsByStaff = async (staffEmail) => {
  await delay(200)
  return commissionsData.filter(c => c.staffEmail === staffEmail)
}

export const calculateCommissionPayment = async (staffId, salesAmount) => {
  await delay(200)
  const commission = commissionsData.find(c => c.Id === parseInt(staffId))
  if (!commission || !commission.isActive) {
    return 0
  }
  
  let payment = 0
  switch (commission.commissionType) {
    case 'Percentage':
      payment = salesAmount * (commission.commissionRate / 100)
      break
    case 'Fixed':
      payment = commission.commissionRate
      break
    case 'Tiered':
      // Simplified tiered calculation
      if (salesAmount > 10000) {
        payment = salesAmount * (commission.commissionRate / 100) * 1.5
      } else {
        payment = salesAmount * (commission.commissionRate / 100)
      }
      break
    default:
      payment = 0
  }
  
  return payment
}

export const updateCommissionPerformance = async (staffId, salesAmount, commissionAmount) => {
  await delay(300)
  const index = commissionsData.findIndex(c => c.Id === parseInt(staffId))
  if (index === -1) {
    throw new Error('Commission not found')
  }
  
  commissionsData[index].currentSales += salesAmount
  commissionsData[index].thisMonthCommissions += commissionAmount
  commissionsData[index].totalCommissionsEarned += commissionAmount
  
  return { ...commissionsData[index] }
}

export const getCommissionSummary = async () => {
  await delay(250)
  const activeCommissions = commissionsData.filter(c => c.isActive)
  
  return {
    totalStaff: commissionsData.length,
    activeStaff: activeCommissions.length,
    totalCommissionsPaid: commissionsData.reduce((sum, c) => sum + c.totalCommissionsEarned, 0),
    thisMonthCommissions: commissionsData.reduce((sum, c) => sum + c.thisMonthCommissions, 0),
    averageCommissionRate: activeCommissions.reduce((sum, c) => sum + c.commissionRate, 0) / activeCommissions.length || 0,
    topPerformer: activeCommissions.reduce((top, current) => 
      current.thisMonthCommissions > (top?.thisMonthCommissions || 0) ? current : top, null
    )
  }
}