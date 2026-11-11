import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DataProvider } from '@/store/dataRefresh'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/pages/Dashboard'
import { ProductsPage } from '@/pages/ProductsPage'
import { UsersPage } from '@/pages/UsersPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          <Route path="/" element={<AppShell><DashboardPage /></AppShell>} />
          <Route path="/products" element={<AppShell><ProductsPage /></AppShell>} />
          <Route path="/users" element={<AppShell><UsersPage /></AppShell>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </DataProvider>
    </BrowserRouter>
  )
}