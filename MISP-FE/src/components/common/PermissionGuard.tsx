import React from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/store/useAuthStore';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PermissionGuardProps {
  requiredPermissions?: string[];
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  requiredPermissions = [],
  children,
}) => {
  const user = useUserStore((state) => state.user);
  const permissions = useUserStore((state) => state.permissions || []);

  const normRole = (user?.role || '').toLowerCase().replace(/[\s_-]+/g, '');
  const isSuperAdmin = normRole === 'superadmin' || normRole === 'admin';

  if (isSuperAdmin) {
    return <>{children}</>;
  }

  if (requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  const hasAccess = requiredPermissions.some((perm) => permissions.includes(perm));

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 mb-4 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Restricted (RBAC)</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6 text-sm">
          Your current designated role (<span className="font-semibold text-gray-800 dark:text-gray-200">{user?.role || 'User'}</span>) does not have authorization to view this module.
        </p>
        <Link to="/dashboard">
          <Button className="bg-[#183638] hover:bg-[#183638]/90 text-[#84cc16] flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;

