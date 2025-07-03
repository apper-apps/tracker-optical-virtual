// Mock service layer for partner discount management
// Note: This uses mock data as no discount table exists in the database

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock partner discount data
let discountsData = [
  {
    Id: 1,
    partnerName: "TechCorp Solutions",
    partnerEmail: "partnerships@techcorp.com",
    discountType: "Percentage",
    discountValue: 15.0,
    isActive: true,
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    totalUsage: 25,
    totalSavings: 45000,
    thisMonthUsage: 5,
    thisMonthSavings: 8500,
    minimumOrderValue: 5000,
    maxUsagePerMonth: 10,
    description: "Enterprise partnership discount for annual contracts"
  },
  {
    Id: 2,
    partnerName: "Global Systems Inc",
    partnerEmail: "procurement@globalsys.com",
    discountType: "Fixed",
    discountValue: 2000,
    isActive: true,
    validFrom: "2024-02-15",
    validUntil: "2024-08-15",
    totalUsage: 12,
    totalSavings: 24000,
    thisMonthUsage: 2,
    thisMonthSavings: 4000,
    minimumOrderValue: 10000,
    maxUsagePerMonth: 5,
    description: "Fixed discount for bulk service purchases"
  },
  {
    Id: 3,
    partnerName: "StartupHub Accelerator",
    partnerEmail: "partners@startuphub.io",
    discountType: "Percentage",
    discountValue: 25.0,
    isActive: true,
    validFrom: "2024-01-01",
    validUntil: "2025-01-01",
    totalUsage: 8,
    totalSavings: 12000,
    thisMonthUsage: 3,
    thisMonthSavings: 3600,
    minimumOrderValue: 1000,
    maxUsagePerMonth: 15,
    description: "Startup discount program for emerging businesses"
  },
  {
    Id: 4,
    partnerName: "Enterprise Alliance",
    partnerEmail: "deals@enterprise-alliance.com",
    discountType: "Tiered",
    discountValue: 10.0,
    isActive: false,
    validFrom: "2024-01-01",
    validUntil: "2024-06-30",
    totalUsage: 15,
    totalSavings: 18500,
    thisMonthUsage: 0,
    thisMonthSavings: 0,
    minimumOrderValue: 7500,
    maxUsagePerMonth: 8,
    description: "Tiered discount based on volume - expired"
  },
  {
    Id: 5,
    partnerName: "Strategic Partners Ltd",
    partnerEmail: "partnerships@strategic.com",
    discountType: "Percentage",
    discountValue: 20.0,
    isActive: true,
    validFrom: "2024-03-01",
    validUntil: "2024-12-31",
    totalUsage: 18,
    totalSavings: 32000,
    thisMonthUsage: 4,
    thisMonthSavings: 6800,
    minimumOrderValue: 3000,
    maxUsagePerMonth: 12,
    description: "Strategic partnership program for preferred clients"
  }
]

let nextId = 6

export const getPartnerDiscounts = async () => {
  await delay(300)
  return [...discountsData]
}

export const getPartnerDiscountById = async (id) => {
  await delay(200)
  const discount = discountsData.find(d => d.Id === parseInt(id))
  return discount ? { ...discount } : null
}

export const createPartnerDiscount = async (discountData) => {
  await delay(400)
  const newDiscount = {
    ...discountData,
    Id: nextId++,
    totalUsage: 0,
    totalSavings: 0,
    thisMonthUsage: 0,
    thisMonthSavings: 0
  }
  discountsData.push(newDiscount)
  return { ...newDiscount }
}

export const updatePartnerDiscount = async (id, discountData) => {
  await delay(350)
  const index = discountsData.findIndex(d => d.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Discount not found')
  }
  
  discountsData[index] = {
    ...discountsData[index],
    ...discountData,
    Id: parseInt(id)
  }
  
  return { ...discountsData[index] }
}

export const deletePartnerDiscount = async (id) => {
  await delay(250)
  const index = discountsData.findIndex(d => d.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Discount not found')
  }
  
  discountsData.splice(index, 1)
  return true
}

export const getDiscountsByPartner = async (partnerEmail) => {
  await delay(200)
  return discountsData.filter(d => d.partnerEmail === partnerEmail)
}

export const calculateDiscountAmount = async (discountId, orderValue) => {
  await delay(200)
  const discount = discountsData.find(d => d.Id === parseInt(discountId))
  if (!discount || !discount.isActive) {
    return 0
  }
  
  // Check if order meets minimum value
  if (orderValue < discount.minimumOrderValue) {
    return 0
  }
  
  // Check validity dates
  const now = new Date()
  const validFrom = new Date(discount.validFrom)
  const validUntil = new Date(discount.validUntil)
  if (now < validFrom || now > validUntil) {
    return 0
  }
  
  // Check monthly usage limit
  if (discount.thisMonthUsage >= discount.maxUsagePerMonth) {
    return 0
  }
  
  let discountAmount = 0
  switch (discount.discountType) {
    case 'Percentage':
      discountAmount = orderValue * (discount.discountValue / 100)
      break
    case 'Fixed':
      discountAmount = Math.min(discount.discountValue, orderValue)
      break
    case 'Tiered':
      // Simplified tiered calculation
      if (orderValue > 20000) {
        discountAmount = orderValue * (discount.discountValue / 100) * 1.5
      } else if (orderValue > 10000) {
        discountAmount = orderValue * (discount.discountValue / 100) * 1.2
      } else {
        discountAmount = orderValue * (discount.discountValue / 100)
      }
      break
    default:
      discountAmount = 0
  }
  
  return Math.min(discountAmount, orderValue)
}

export const applyDiscount = async (discountId, orderValue) => {
  await delay(300)
  const discountAmount = await calculateDiscountAmount(discountId, orderValue)
  
  if (discountAmount > 0) {
    const index = discountsData.findIndex(d => d.Id === parseInt(discountId))
    if (index !== -1) {
      discountsData[index].totalUsage += 1
      discountsData[index].totalSavings += discountAmount
      discountsData[index].thisMonthUsage += 1
      discountsData[index].thisMonthSavings += discountAmount
    }
  }
  
  return {
    discountAmount,
    finalPrice: orderValue - discountAmount,
    discountApplied: discountAmount > 0
  }
}

export const getDiscountSummary = async () => {
  await delay(250)
  const activeDiscounts = discountsData.filter(d => d.isActive)
  
  return {
    totalPartners: discountsData.length,
    activePartners: activeDiscounts.length,
    totalDiscountsGiven: discountsData.reduce((sum, d) => sum + d.totalSavings, 0),
    thisMonthDiscounts: discountsData.reduce((sum, d) => sum + d.thisMonthSavings, 0),
    totalUsageCount: discountsData.reduce((sum, d) => sum + d.totalUsage, 0),
    thisMonthUsageCount: discountsData.reduce((sum, d) => sum + d.thisMonthUsage, 0),
    averageDiscountValue: activeDiscounts.reduce((sum, d) => sum + d.discountValue, 0) / activeDiscounts.length || 0,
    topPartner: activeDiscounts.reduce((top, current) => 
      current.thisMonthSavings > (top?.thisMonthSavings || 0) ? current : top, null
    )
  }
}

export const validateDiscountUsage = async (discountId) => {
  await delay(200)
  const discount = discountsData.find(d => d.Id === parseInt(discountId))
  if (!discount) {
    return { valid: false, reason: 'Discount not found' }
  }
  
  if (!discount.isActive) {
    return { valid: false, reason: 'Discount is inactive' }
  }
  
  const now = new Date()
  const validFrom = new Date(discount.validFrom)
  const validUntil = new Date(discount.validUntil)
  
  if (now < validFrom) {
    return { valid: false, reason: 'Discount not yet valid' }
  }
  
  if (now > validUntil) {
    return { valid: false, reason: 'Discount has expired' }
  }
  
  if (discount.thisMonthUsage >= discount.maxUsagePerMonth) {
    return { valid: false, reason: 'Monthly usage limit exceeded' }
  }
  
  return { valid: true, discount }
}