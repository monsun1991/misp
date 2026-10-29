import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Building,
  KeyRound,
  Mail,
  Phone,
  Briefcase,
  Layers,
  MapPin,
  Clock,
  CheckCircle2,
  Lock,
  Sparkles,
  SlidersHorizontal,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useUserStore } from '@/store/useAuthStore';
import { useMipsStore, isPlantMatch } from '@/store/useMipsStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChangePinModal } from '@/components/common/ChangePinModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const ProfilePage: React.FC = () => {
  const { user, permissions } = useUserStore();
  const { employees, plants, selectedPlant, setSelectedPlant, roles } = useMipsStore();
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);

  // Match logged in user with employee record if available
  const employeeRecord = employees.find(
    (e) => (e.email && user?.email && e.email.toLowerCase() === user.email.toLowerCase()) ||
           (e.name && user?.fullName && e.name.toLowerCase() === user.fullName.toLowerCase())
  );

  const userRole = user?.role || employeeRecord?.role || 'Operational Staff';
  const roleRecord = roles.find((r) => r.name === userRole);

  const effectivePermissions: string[] = React.useMemo(() => {
    if (permissions && permissions.length > 0) return permissions;
    if (roleRecord && roleRecord.permissions) return roleRecord.permissions;
    return [];
  }, [permissions, roleRecord]);

  const permissionGroups = [
    {
      category: 'Inventory & Materials',
      prefix: 'inventory',
      items: [
        { code: 'inventory.view', label: 'View Stock Balances & Locations' },
        { code: 'inventory.adjust', label: 'Authorized Stock Adjustments (+/-)' },
        { code: 'inventory.transfer', label: 'Inter-Warehouse Transfers' },
      ],
    },
    {
      category: 'Procurement & Vendor POs',
      prefix: 'procurement',
      items: [
        { code: 'procurement.view', label: 'View Inward POs & Track Transit' },
        { code: 'procurement.po.create', label: 'Create New Purchase Orders' },
        { code: 'procurement.grn.receive', label: 'Inbound GRN Inspection' },
      ],
    },
    {
      category: 'BOM & Production Kits',
      prefix: 'kits',
      items: [
        { code: 'kits.view', label: 'View Floor Kits & Reservations' },
        { code: 'kits.create', label: 'Generate Production Kits from BOM' },
        { code: 'kits.issue', label: 'Issue Material Kits to Operators' },
        { code: 'kits.reconcile', label: 'Kit Reconciliation & Scrap Return' },
      ],
    },
    {
      category: 'Manufacturing Floor',
      prefix: 'production',
      items: [
        { code: 'production.view', label: 'View Shift Run Logs & OEE' },
        { code: 'production.log', label: 'Record Hourly Output & Rejections' },
        { code: 'production.plan', label: 'Adjust Workcell Demands' },
      ],
    },
    {
      category: 'Customer Orders & Dispatch',
      prefix: 'orders',
      items: [
        { code: 'orders.view', label: 'View Customer POs & Delivery Status' },
        { code: 'orders.manage', label: 'Create Customer Orders & DC Outward' },
      ],
    },
    {
      category: 'Administration & Master Data',
      prefix: 'admin',
      items: [
        { code: 'masters.manage', label: 'Manage BOM, Materials & Warehouses' },
        { code: 'settings.manage', label: 'Configure Plants, Roles & RBAC' },
        { code: 'users.manage', label: 'Onboard Staff & Identity Directory' },
        { code: 'reports.view', label: 'Access Audit Logs & Analytics' },
      ],
    },
  ];

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-6 h-6 text-[#146b68] dark:text-[#84cc16]" />
            Staff Profile & Operational Scopes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise identity credentials, facility scopes, active shifts and RBAC authorizations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsChangePinOpen(true)}
            className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md border-0 h-9"
          >
            <KeyRound className="w-4 h-4 mr-1.5" />
            Change Login PIN
          </Button>
        </div>
      </div>

      {/* Top Banner & User Overview */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#183638] via-[#1f4547] to-[#146b68] text-white p-6 sm:p-8 shadow-xl w-full">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#84cc16] text-[#143234] flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg shadow-black/20 ring-4 ring-white/20 shrink-0">
              {getInitials(user?.fullName || employeeRecord?.name || 'Staff User')}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {user?.fullName || employeeRecord?.name || 'Enterprise Operator'}
                </h2>
                <Badge className="bg-[#84cc16] text-[#143234] font-bold border-0 shadow-sm text-xs">
                  {userRole}
                </Badge>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Active Account
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5 flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 opacity-80" />
                  {user?.email || employeeRecord?.email || 'user@eiffel.in'}
                </span>
                {(employeeRecord?.phone || user?.phone) && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 opacity-80" />
                    {employeeRecord?.phone || user?.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5 font-mono text-[11px] bg-black/20 px-2 py-0.5 rounded">
                  ID: {employeeRecord?.id?.substring(0, 8) || user?.id?.substring(0, 8) || 'EMP-001'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-black/20 border border-white/10 text-right">
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Current Plant</div>
              <div className="text-xs font-bold text-[#84cc16]">{selectedPlant}</div>
            </div>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#84cc16]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
        {/* Left Column: Operational Scopes & Facility */}
        <div className="space-y-6 xl:col-span-1">
          {/* Active Facility Scope */}
          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Building className="w-4 h-4 text-[#146b68] dark:text-[#84cc16]" />
                Facility & Operational Scope
              </CardTitle>
              <CardDescription className="text-xs">
                Your assigned plant and operational boundaries
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Active Plant Scope
                </label>
                <Select
                  value={selectedPlant}
                  onValueChange={(val) => setSelectedPlant(val)}
                >
                  <SelectTrigger className="w-full h-9 font-semibold text-xs bg-slate-50 dark:bg-slate-800">
                    <SelectValue placeholder="Select Plant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Plants" className="text-xs font-semibold">
                      🌐 All Operational Plants (Global)
                    </SelectItem>
                    {plants.map((p) => (
                      <SelectItem key={p.id} value={p.name} className="text-xs">
                        {p.name} ({p.city})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Switching plant updates all your dashboard metrics and floor views.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-medium">Department</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {employeeRecord?.department || 'Operations & Production'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-medium">Assigned Sub-Team</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {employeeRecord?.team || 'Core Assembly Line 1'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-medium">Workstation</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {employeeRecord?.workstation || 'Terminal 1 - Floor Ops'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-medium">Reporting Supervisor</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {employeeRecord?.supervisor || 'Anand Deshmukh (Plant Manager)'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-medium">Assigned Shift</span>
                  <Badge variant="outline" className="text-[11px] font-semibold">
                    {employeeRecord?.shift || 'General Shift (09:00 - 18:00)'}
                  </Badge>
                </div>
              </div>

              {employeeRecord?.skills && employeeRecord.skills.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                    Floor Certifications & Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {employeeRecord.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security & Authentication Card */}
          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-[#84cc16]" />
                Security & Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">4-Digit Security PIN</div>
                  <div className="text-[11px] text-slate-500">Used for fast terminal sign-in</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsChangePinOpen(true)}
                  className="h-8 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Update PIN
                </Button>
              </div>

              <div className="flex items-center justify-between py-2 text-[11px] text-slate-500">
                <span>Session Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  ● Authenticated (JWT)
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: RBAC Effective Permissions Matrix */}
        <div className="space-y-6 xl:col-span-2">
          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <ShieldCheck className="w-4 h-4 text-[#84cc16]" />
                  Authorized Role Permissions Matrix (RBAC)
                </CardTitle>
                <CardDescription className="text-xs">
                  Real-time operational privileges assigned to role: <span className="font-bold text-slate-800 dark:text-slate-200">{userRole}</span>
                </CardDescription>
              </div>
              <Badge className="bg-[#183638] text-[#84cc16] font-bold text-xs border border-[#84cc16]/30">
                {effectivePermissions.length} Active Capabilities
              </Badge>
            </CardHeader>

            <CardContent className="pt-5 space-y-5">
              {permissionGroups.map((grp) => {
                const groupPermissions = grp.items.map((item) => {
                  // Super admins or explicit permission match
                  const isGranted =
                    userRole.toLowerCase().includes('admin') ||
                    effectivePermissions.includes(item.code) ||
                    effectivePermissions.includes('*');

                  return { ...item, isGranted };
                });

                return (
                  <div
                    key={grp.category}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40"
                  >
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-2.5 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#84cc16]" />
                      <span>{grp.category}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-2">
                      {groupPermissions.map((perm) => (
                        <div
                          key={perm.code}
                          className={`flex items-start gap-2 p-2 rounded-lg text-xs transition-colors ${
                            perm.isGranted
                              ? 'bg-emerald-500/10 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-200 border border-emerald-500/20'
                              : 'bg-slate-100/50 dark:bg-slate-800/30 text-slate-400 line-through border border-transparent'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                            perm.isGranted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                          }`}>
                            {perm.isGranted ? '✓' : '✕'}
                          </span>
                          <div className="min-w-0">
                            <div className="font-semibold">{perm.label}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{perm.code}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      <ChangePinModal
        isOpen={isChangePinOpen}
        onClose={() => setIsChangePinOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;

