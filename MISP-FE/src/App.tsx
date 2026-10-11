import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import Layout from './layouts/Layout';
import { Loader2 } from 'lucide-react';

const LandingPage = lazy(() => import('./pages/Landing'));
const LoginPage = lazy(() => import('./pages/Login'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const InventoryPage = lazy(() => import('./pages/Inventory'));
const FinishedGoodsPage = lazy(() => import('./pages/FinishedGoods'));
const ProcurementPage = lazy(() => import('./pages/Procurement'));
const ForecastPage = lazy(() => import('./pages/Forecast'));
const KitsPage = lazy(() => import('./pages/Kits'));
const ProductionPage = lazy(() => import('./pages/Production'));
const OrdersDispatchPage = lazy(() => import('./pages/OrdersDispatch'));
const ProductivityPage = lazy(() => import('./pages/Productivity'));
const MastersPage = lazy(() => import('./pages/Masters'));
const EmployeesPage = lazy(() => import('./pages/Employees'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const ReportsPage = lazy(() => import('./pages/Reports'));
const UsersAccessPage = lazy(() => import('./pages/Users'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

const FullScreenSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
  </div>
);

export function App() {
  return (
    <Suspense fallback={<FullScreenSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard & App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/finished-goods" element={<FinishedGoodsPage />} />
            <Route path="/procurement" element={<ProcurementPage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/kits" element={<KitsPage />} />
            <Route path="/production" element={<ProductionPage />} />
            <Route path="/orders-dispatch" element={<OrdersDispatchPage />} />
            <Route path="/productivity" element={<ProductivityPage />} />
            <Route path="/masters" element={<MastersPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/users" element={<UsersAccessPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
