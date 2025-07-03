export const calculateMRR = (price, billingFrequency, quantity = 1) => {
  const totalPrice = price * quantity
  
  const multipliers = {
    monthly: 1,
    quarterly: 1/3,
    biannually: 1/6,
    annually: 1/12
  }
  
  return totalPrice * (multipliers[billingFrequency] || 1)
}

export const calculateGST = (amount, gstRate) => {
  return amount * (gstRate / 100)
}

export const calculateTotalWithGST = (amount, gstRate) => {
  return amount + calculateGST(amount, gstRate)
}

export const calculateAnnualProjection = (monthlyAmount) => {
  return monthlyAmount * 12
}

export const calculateAverageRevenuePerCustomer = (totalRevenue, customerCount) => {
  if (customerCount === 0) return 0
  return totalRevenue / customerCount
}

export const calculateChurnRate = (churnedCustomers, totalCustomers) => {
  if (totalCustomers === 0) return 0
  return (churnedCustomers / totalCustomers) * 100
}

export const calculateGrowthRate = (currentValue, previousValue) => {
  if (previousValue === 0) return 0
  return ((currentValue - previousValue) / previousValue) * 100
}

export const calculateCustomerLifetimeValue = (averageRevenue, averageLifetimeMonths) => {
  return averageRevenue * averageLifetimeMonths
}

export const calculateContractValue = (price, contractDuration, quantity = 1) => {
  return price * contractDuration * quantity
}

// Commission calculation functions
export const calculateFixedCommission = (salesAmount, fixedRate) => {
  return fixedRate
}

export const calculatePercentageCommission = (salesAmount, percentage) => {
  return salesAmount * (percentage / 100)
}

export const calculateTieredCommission = (salesAmount, tiers) => {
  let totalCommission = 0
  let remainingAmount = salesAmount
  
  for (const tier of tiers) {
    if (remainingAmount <= 0) break
    
    const tierAmount = Math.min(remainingAmount, tier.threshold)
    totalCommission += tierAmount * (tier.rate / 100)
    remainingAmount -= tierAmount
  }
  
  return totalCommission
}

// Discount calculation functions
export const calculatePercentageDiscount = (originalPrice, discountPercentage) => {
  return originalPrice * (discountPercentage / 100)
}

export const calculateFixedDiscount = (originalPrice, discountAmount) => {
  return Math.min(discountAmount, originalPrice)
}

export const calculateBulkDiscount = (quantity, unitPrice, bulkTiers) => {
  let totalDiscount = 0
  
  for (const tier of bulkTiers) {
    if (quantity >= tier.minQuantity) {
      totalDiscount = unitPrice * quantity * (tier.discountPercentage / 100)
    }
  }
  
  return totalDiscount
}

export const calculateDiscountedPrice = (originalPrice, discount) => {
  return Math.max(0, originalPrice - discount)
}

// Advanced financial calculations
export const calculateNetIncome = (totalRevenue, totalExpenses, commissionsPaid, discountsGiven) => {
  return totalRevenue - totalExpenses - commissionsPaid - discountsGiven
}

export const calculateCommissionImpact = (totalRevenue, commissionsPaid) => {
  if (totalRevenue === 0) return 0
  return (commissionsPaid / totalRevenue) * 100
}

export const calculateDiscountImpact = (totalPotentialRevenue, discountsGiven) => {
  if (totalPotentialRevenue === 0) return 0
  return (discountsGiven / totalPotentialRevenue) * 100
}

export const calculateInterCompanyBalance = (transactions) => {
  return transactions.reduce((balance, transaction) => {
    if (transaction.transactionType === 'Payment') {
      return balance + transaction.amount
    } else if (transaction.transactionType === 'Cost Absorption') {
      return balance - transaction.amount
    }
    return balance
  }, 0)
}