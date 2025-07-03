import { Outlet } from 'react-router-dom'
import Header from '@/components/organisms/Header'
import Sidebar from '@/components/organisms/Sidebar'

const Layout = () => {
  return (
    <div className="min-h-screen bg-surface-50">
      <Sidebar />
      <div className="lg:ml-64">
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout