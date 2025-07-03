import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StatusBadge from "@/components/molecules/StatusBadge";
import Empty from "@/components/ui/Empty";

const CustomerTable = ({ 
  customers, 
  onEditCustomer, 
  onDeleteCustomer,
  onStatusChange,
  onAddCustomer 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  
const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase()
    return (
      customer.first_name.toLowerCase().includes(searchLower) ||
      customer.last_name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.company.toLowerCase().includes(searchLower) ||
      customer.status.toLowerCase().includes(searchLower)
    )
  })
  
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (!sortConfig.key) return 0
    
    let aValue = a[sortConfig.key]
    let bValue = b[sortConfig.key]
    
    if (sortConfig.key === 'price') {
      aValue = parseFloat(aValue)
      bValue = parseFloat(bValue)
    }
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })
  
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }
  
  const handleStatusToggle = (customerId, currentStatus) => {
    const statusCycle = { active: 'pending', pending: 'churned', churned: 'active' }
    const newStatus = statusCycle[currentStatus]
    onStatusChange(customerId, newStatus)
    toast.success(`Customer status updated to ${newStatus}`)
  }
  
const handleDelete = (customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.first_name} ${customer.last_name}?`)) {
      onDeleteCustomer(customer.Id)
      toast.success('Customer deleted successfully')
    }
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount)
  }
  
  if (customers.length === 0) {
    return (
      <Card className="p-8">
        <Empty
          title="No customers found"
          description="Get started by adding your first customer to track your MRR"
          actionText="Add Customer"
          onAction={onAddCustomer}
          icon="Users"
        />
      </Card>
    )
  }
  
  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-surface-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-xl font-bold text-surface-900">Customer Management</h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <SearchBar
              placeholder="Search customers..."
              onSearch={setSearchTerm}
              className="w-full sm:w-64"
            />
            <Button
              variant="primary"
              size="sm"
              icon="Plus"
              onClick={onAddCustomer}
              className="w-full sm:w-auto"
            >
              Add Customer
            </Button>
          </div>
        </div>
      </div>
      
      {sortedCustomers.length === 0 ? (
        <div className="p-8 text-center">
          <Empty
            title="No customers match your search"
            description="Try adjusting your search terms or filters"
            actionText="Clear Search"
            onAction={() => setSearchTerm('')}
            icon="Search"
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
<button
                    onClick={() => handleSort('first_name')}
                    className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
                  >
                    <span>Customer</span>
                    <ApperIcon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('company')}
                    className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
                  >
                    <span>Company</span>
                    <ApperIcon name="ArrowUpDown" size={14} />
                  </button>
                </th>
<th className="px-6 py-4 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Company Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('price')}
                    className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
                  >
                    <span>Price</span>
                    <ApperIcon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Billing
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
                  >
                    <span>Status</span>
                    <ApperIcon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-surface-200">
              {sortedCustomers.map((customer, index) => (
                <motion.tr
                  key={customer.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-surface-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
<div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {customer.first_name[0]}{customer.last_name[0]}
                          </span>
                        </div>
                      </div>
<div className="ml-4">
                        <div className="text-sm font-medium text-surface-900">
                          {customer.first_name} {customer.last_name}
                        </div>
                        <div className="text-sm text-surface-500">
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                    {customer.company}
                  </td>
<td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-surface-900">{customer.serviceName}</div>
                    {customer.quantity > 1 && (
                      <div className="text-xs text-surface-500">Qty: {customer.quantity}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.companyType === 'Main' ? 'bg-blue-100 text-blue-800' :
                      customer.companyType === 'Subsidiary' ? 'bg-purple-100 text-purple-800' :
                      'bg-surface-100 text-surface-800'
                    }`}>
                      {customer.companyType || 'Standard'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                    {formatCurrency(customer.price * customer.quantity)}
                  </td>
<td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-100 text-surface-800 capitalize">
                      {customer.billing_frequency}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={customer.status}
                      onClick={() => handleStatusToggle(customer.Id, customer.status)}
                    />
                  </td>
<td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.payment_status === 'Paid' ? 'bg-green-100 text-green-800' :
                      customer.payment_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      customer.payment_status === 'Overdue' ? 'bg-red-100 text-red-800' :
                      'bg-surface-100 text-surface-800'
                    }`}>
                      {customer.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => onEditCustomer(customer)}
                      className="text-primary-600 hover:text-primary-900 transition-colors"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </button>
<button
                      onClick={() => handleDelete(customer)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

export default CustomerTable