import { motion } from 'framer-motion'
import { useContext } from 'react'
import { AuthContext } from '@/App'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
const Header = ({ onAddCustomer, onImportCSV, onSettings }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-lg border-b border-surface-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
                <ApperIcon name="TrendingUp" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-surface-900">MRR Tracker Pro</h1>
                <p className="text-sm text-surface-600">Monthly Recurring Revenue Dashboard</p>
              </div>
            </div>
          </div>
<div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              icon="LogOut"
              onClick={() => useContext(AuthContext).logout()}
              className="hidden sm:flex"
            >
              Logout
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon="Upload"
              onClick={onImportCSV}
              className="hidden sm:flex"
            >
              Import CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon="Plus"
              onClick={onAddCustomer}
            >
              Add Customer
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon="Settings"
              onClick={onSettings}
            />
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header