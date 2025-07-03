import { motion } from 'framer-motion'

const Loading = () => {
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 shimmer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-6 h-6 bg-surface-200 rounded"></div>
              <div className="w-8 h-4 bg-surface-200 rounded"></div>
            </div>
            <div className="w-24 h-8 bg-surface-200 rounded mb-2"></div>
            <div className="w-16 h-4 bg-surface-200 rounded"></div>
          </motion.div>
        ))}
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 shimmer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-32 h-6 bg-surface-200 rounded"></div>
              <div className="w-6 h-6 bg-surface-200 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="w-28 h-10 bg-surface-200 rounded"></div>
              <div className="w-36 h-6 bg-surface-200 rounded"></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-surface-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="w-48 h-8 bg-surface-200 rounded shimmer"></div>
            <div className="flex space-x-3">
              <div className="w-64 h-10 bg-surface-200 rounded shimmer"></div>
              <div className="w-32 h-10 bg-surface-200 rounded shimmer"></div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50">
              <tr>
                {[...Array(8)].map((_, index) => (
                  <th key={index} className="px-6 py-4 text-left">
                    <div className="w-20 h-4 bg-surface-200 rounded shimmer"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  {[...Array(8)].map((_, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4">
                      <div className="w-24 h-4 bg-surface-200 rounded shimmer"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default Loading