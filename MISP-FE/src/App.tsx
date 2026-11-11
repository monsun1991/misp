import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import PermissionGuard from './components/common/PermissionGuard';
import Layout from './layouts/Layout';
import { Loader2 } from 'lucide-react';
import { useMipsStore } from './store/useMipsStore';
import { useUserStore } from './store/useAuthStore';
import { getProfileAPI } from './api/services/user.service';

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
const ProfilePage = lazy(() => import('./pages/Profile'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

const FullScreenSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
  </div>
);

export function App() {
  const initData = useMipsStore((s) => s.initData);

  const accessToken = useUserStore((s: any) => s.accessToken);

  useEffect(() => {
    initData();
  }, [initData]);

  // Permissions are cached at login; re-fetch them so role changes made in Settings apply on the next page load
  useEffect(() => {
    if (!accessToken) return;
    getProfileAPI()
      .then((res) => {
        const { user, permissions } = res?.data || {};
        if (Array.isArray(permissions)) useUserStore.getState().setPermissions(permissions);
        if (user) useUserStore.getState().updateUser(user);
      })
      .catch((err) => console.warn('Failed to refresh permissions from profile:', err));
  }, [accessToken]);

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
            <Route path="/inventory" element={<PermissionGuard requiredPermissions={['inventory.view']}><InventoryPage /></PermissionGuard>} />
            <Route path="/finished-goods" element={<PermissionGuard requiredPermissions={['finished_goods.view', 'inventory.view']}><FinishedGoodsPage /></PermissionGuard>} />
            <Route path="/procurement" element={<PermissionGuard requiredPermissions={['procurement.view', 'procurement.po.create']}><ProcurementPage /></PermissionGuard>} />
            <Route path="/forecast" element={<PermissionGuard requiredPermissions={['forecast.view', 'forecast.plan']}><ForecastPage /></PermissionGuard>} />
            <Route path="/kits" element={<PermissionGuard requiredPermissions={['kits.view', 'kits.create', 'kits.issue', 'kits.reconcile']}><KitsPage /></PermissionGuard>} />
            <Route path="/production" element={<PermissionGuard requiredPermissions={['production.view', 'production.log', 'production.plan']}><ProductionPage /></PermissionGuard>} />
            <Route path="/orders-dispatch" element={<PermissionGuard requiredPermissions={['orders.view', 'orders.manage', 'procurement.view']}><OrdersDispatchPage /></PermissionGuard>} />
            <Route path="/productivity" element={<PermissionGuard requiredPermissions={['productivity.view', 'production.log']}><ProductivityPage /></PermissionGuard>} />
            <Route path="/masters" element={<PermissionGuard requiredPermissions={['masters.manage']}><MastersPage /></PermissionGuard>} />
            <Route path="/employees" element={<PermissionGuard requiredPermissions={['users.manage']}><EmployeesPage /></PermissionGuard>} />
            <Route path="/settings" element={<PermissionGuard requiredPermissions={['settings.manage']}><SettingsPage /></PermissionGuard>} />
            <Route path="/users" element={<PermissionGuard requiredPermissions={['users.manage']}><UsersAccessPage /></PermissionGuard>} />
            <Route path="/reports" element={<PermissionGuard requiredPermissions={['reports.view']}><ReportsPage /></PermissionGuard>} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
