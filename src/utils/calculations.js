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