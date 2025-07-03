import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = () => {
  const location = useLocation()
  
  const menuItems = [
    { icon: 'BarChart3', label: 'Dashboard', path: '/', active: true },
    { icon: 'Users', label: 'Customers', path: '/customers' },
    { icon: 'Package', label: 'Services', path: '/services' },
    { icon: 'TrendingUp', label: 'Analytics', path: '/analytics' },
    { icon: 'FileText', label: 'Reports', path: '/reports' },
    { icon: 'Settings', label: 'Settings', path: '/settings' }
  ]
  
  return (
    <motion.div 
      initial={{ x: -240 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl border-r border-surface-200 z-40 transform -translate-x-full lg:translate-x-0 transition-transform duration-300"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-surface-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
              <ApperIcon name="TrendingUp" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-surface-900">MRR Tracker Pro</h1>
              <p className="text-xs text-surface-600">Revenue Dashboard</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                  item.active 
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg' 
                    : 'text-surface-700 hover:bg-surface-100 hover:text-primary-600'
                }`}
              >
                <ApperIcon name={item.icon} size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            </motion.div>
          ))}
        </nav>
        
        {/* Bottom Section */}
        <div className="p-4 border-t border-surface-200">
          <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon name="Zap" size={16} className="text-accent-600" />
              <h3 className="text-sm font-bold text-accent-900">Pro Features</h3>
            </div>
            <p className="text-xs text-accent-700 mb-3">
              Advanced analytics and reporting tools
            </p>
            <button className="w-full bg-gradient-to-r from-accent-600 to-accent-700 text-white text-xs font-medium py-2 px-3 rounded-lg hover:from-accent-700 hover:to-accent-800 transition-all duration-200">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar