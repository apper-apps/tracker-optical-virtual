import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch,
  onClear,
  className = '',
  ...props 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch?.(value)
  }
  
  const handleClear = () => {
    setSearchTerm('')
    onClear?.()
    onSearch?.('')
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative ${className}`}
    >
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
        />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-10 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
          {...props}
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name="X" size={16} />
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default SearchBar