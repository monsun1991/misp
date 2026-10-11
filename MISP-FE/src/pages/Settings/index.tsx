import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  Building,
  PlusCircle,
  Key,
  Lock,
  Trash2,
  Edit2,
  CheckCircle2,
  Sliders,
  Clock,
  Save,
  CheckSquare,
  Square,
  Sparkles,
  Users2,
  Search,
  Loader2
} from 'lucide-react';
import { useMipsStore } from '@/store/useMipsStore';
import type { Role, Department } from '@/store/useMipsStore';
import { mipsService } from '@/api/services/mips.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const AVAILABLE_PERMISSIONS = [
  { id: 'inventory.view', label: 'View Stock Balances & Locations', category: 'Inventory' },
  { id: 'inventory.adjust', label: 'Authorized Stock Adjustments (+/-)', category: 'Inventory' },
  { id: 'inventory.transfer', label: 'Inter-Warehouse Stock Transfer', category: 'Inventory' },
  
  { id: 'procurement.po.create', label: 'Create Purchase Orders (PO)', category: 'Procurement' },
  { id: 'procurement.po.approve', label: 'Approve & Dispatch POs', category: 'Procurement' },
  { id: 'procurement.grn.receive', label: 'Inbound GRN Quality Inspection', category: 'Procurement' },
  
  { id: 'forecast.view', label: 'View 4-Month Forecast Matrix', category: 'Planning' },
  { id: 'forecast.plan', label: 'Adjust Production Run Demands', category: 'Planning' },
  
  { id: 'kits.create', label: 'Create Production Kits from BOM', category: 'Kits & Floor' },
  { id: 'kits.issue', label: 'Issue Material Kits to Operators', category: 'Kits & Floor' },
  { id: 'kits.reconcile', label: 'Log Consumption, Returns & Scrap', category: 'Kits & Floor' },
  { id: 'kits.close', label: 'Supervisor Reconciliation & Kit Closure', category: 'Kits & Floor' },
  
  { id: 'production.log', label: 'Log Daily Shift Output & Units/Hour', category: 'Production' },
  { id: 'production.scrap', label: 'Record QA Rejections & Wastage', category: 'Production' },
  
  { id: 'masters.manage', label: 'Manage Materials, Products & BOMs', category: 'Master Data' },
  { id: 'settings.manage', label: 'Manage Roles, Departments & Scopes', category: 'Administration' },
  { id: 'users.manage', label: 'Onboard & Manage Workforce Directory', category: 'Administration' },
];

export const SettingsPage: React.FC = () => {
  const {
    roles,
    departments,
    plants,
    employees,
    selectedPlant,
    setSelectedPlant,
    addRole,
    updateRole,
    deleteRole,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addPlant,
    updatePlant,
    deletePlant,
    updateEmployeeUBAC
  } = useMipsStore();

  const [activeTab, setActiveTab] = useState<'roles' | 'ubac' | 'departments' | 'plants' | 'factory'>('roles');

  // Role creation modal state
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'inventory.view',
    'kits.view',
    'production.log'
  ]);

  // Selected role for live permission matrix editing
  const [editingRoleId, setEditingRoleId] = useState<string>(roles[0]?.id || '');
  const selectedRole = roles.find((r) => r.id === editingRoleId) || roles[0];

  // User-Based Access Control (UBAC) state
  const [selectedUbacEmpId, setSelectedUbacEmpId] = useState<string>('');
  const [ubacSearchQuery, setUbacSearchQuery] = useState('');
  const [ubacCustomGrants, setUbacCustomGrants] = useState<string[]>([]);
  const [ubacRevoked, setUbacRevoked] = useState<string[]>([]);
  const [isSavingUbac, setIsSavingUbac] = useState(false);
  const [ubacSavedSuccess, setUbacSavedSuccess] = useState(false);

  // Selected employee for UBAC editing
  const selectedUbacEmp = employees.find((e) => e.id === selectedUbacEmpId) || employees[0];
  const selectedRoleForUbac = roles.find((r) => r.name === selectedUbacEmp?.role);

  useEffect(() => {
    if (selectedUbacEmp) {
      if (!selectedUbacEmpId) {
        setSelectedUbacEmpId(selectedUbacEmp.id);
      }
      setUbacCustomGrants(selectedUbacEmp.customPermissions || []);
      setUbacRevoked(selectedUbacEmp.revokedPermissions || []);
    }
  }, [selectedUbacEmp?.id]);

  const filteredEmployeesForUbac = employees.filter((emp) => {
    if (!ubacSearchQuery) return true;
    const q = ubacSearchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.empCode.toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q)
    );
  });

  const handleSetUBACDefault = (permId: string) => {
    setUbacCustomGrants((prev) => prev.filter((p) => p !== permId));
    setUbacRevoked((prev) => prev.filter((p) => p !== permId));
  };

  const handleSetUBACGrant = (permId: string) => {
    setUbacRevoked((prev) => prev.filter((p) => p !== permId));
    setUbacCustomGrants((prev) => (prev.includes(permId) ? prev : [...prev, permId]));
  };

  const handleSetUBACRevoke = (permId: string) => {
    setUbacCustomGrants((prev) => prev.filter((p) => p !== permId));
    setUbacRevoked((prev) => (prev.includes(permId) ? prev : [...prev, permId]));
  };

  const handleSaveUBACForEmployee = async () => {
    if (!selectedUbacEmp) return;
    setIsSavingUbac(true);
    try {
      updateEmployeeUBAC(selectedUbacEmp.id, ubacCustomGrants, ubacRevoked);
      await mipsService.updateUser(selectedUbacEmp.id, {
        customPermissions: ubacCustomGrants,
        revokedPermissions: ubacRevoked,
      });
      setUbacSavedSuccess(true);
      setTimeout(() => setUbacSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save UBAC in backend', err);
    } finally {
      setIsSavingUbac(false);
    }
  };

  const effectiveUbacCount = React.useMemo(() => {
    if (!selectedUbacEmp || !selectedRoleForUbac) return 0;
    const rolePerms = selectedRoleForUbac.permissions || [];
    const combined = Array.from(new Set([...rolePerms, ...ubacCustomGrants]));
    return combined.filter((p) => !ubacRevoked.includes(p)).length;
  }, [selectedUbacEmp, selectedRoleForUbac, ubacCustomGrants, ubacRevoked]);

  // Department creation modal state
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptPlant, setDeptPlant] = useState('Plant 1 - Pune Hub');
  const [deptManager, setDeptManager] = useState('Anand Deshmukh');
  const [deptDesc, setDeptDesc] = useState('');
  const [deptTeams, setDeptTeams] = useState('Line Alpha, Line Beta');

  // Plant / Location creation modal state
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [plantName, setPlantName] = useState('');
  const [plantCode, setPlantCode] = useState(`PLANT-0${(plants?.length || 2) + 1}`);
  const [plantCity, setPlantCity] = useState('');
  const [plantType, setPlantType] = useState('Full Manufacturing & SMT');
  const [plantManager, setPlantManager] = useState('Anand Deshmukh');
  const [plantWarehouses, setPlantWarehouses] = useState<number>(2);
  const [plantDepts, setPlantDepts] = useState<number>(4);
  const [plantDesc, setPlantDesc] = useState('');
  const [plantStatus, setPlantStatus] = useState<'Active' | 'Commissioning'>('Active');

  // Factory settings state
  const [shiftATime, setShiftATime] = useState('08:00 - 16:30');
  const [shiftBTime, setShiftBTime] = useState('16:30 - 01:00');
  const [standardHours, setStandardHours] = useState<number>(8.0);
  const [qaTolerancePct, setQaTolerancePct] = useState<number>(3.0);
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  const togglePermission = (permId: string) => {
    if (selectedPermissions.includes(permId)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permId));
    } else {
      setSelectedPermissions([...selectedPermissions, permId]);
    }
  };

  const toggleActiveRolePermission = (permId: string) => {
    if (!selectedRole) return;
    const currentPerms = selectedRole.permissions || [];
    const updated = currentPerms.includes(permId)
      ? currentPerms.filter((p) => p !== permId)
      : [...currentPerms, permId];

    updateRole(selectedRole.id, { permissions: updated });
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName) return;

    addRole({
      name: roleName,
      description: roleDesc || 'Custom operational role defined by administrator.',
      isSystem: false,
      permissions: selectedPermissions,
    });

    setShowRoleModal(false);
    setRoleName('');
    setRoleDesc('');
  };

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName) return;

    addDepartment({
      name: deptName,
      plant: deptPlant,
      manager: deptManager,
      description: deptDesc || 'Manufacturing department unit.',
      activeTeams: deptTeams.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setShowDeptModal(false);
    setDeptName('');
    setDeptDesc('');
  };

  const handleCreatePlant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantName) return;

    addPlant({
      code: plantCode || `PLANT-0${(plants?.length || 2) + 1}`,
      name: plantName,
      city: plantCity || 'Pune, India',
      type: plantType,
      manager: plantManager,
      warehousesCount: Number(plantWarehouses) || 1,
      departmentsCount: Number(plantDepts) || 1,
      description: plantDesc || 'Manufacturing & assembly facility.',
      status: plantStatus,
    });

    setShowPlantModal(false);
    setPlantName('');
    setPlantCity('');
    setPlantDesc('');
    setPlantCode(`PLANT-0${(plants?.length || 2) + 2}`);
  };

  const handleSaveFactoryConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 3000);
  };

  // Group permissions by category for UI
  const categories = Array.from(new Set(AVAILABLE_PERMISSIONS.map((p) => p.category)));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#146b68] dark:text-[#84cc16]" />
            System Settings, RBAC & Organization Structure
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic roles, granular permission matrices, manufacturing departments, and organizational governance.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'roles' && (
            <Button
              onClick={() => setShowRoleModal(true)}
              className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Create Custom Role
            </Button>
          )}

          {activeTab === 'departments' && (
            <Button
              onClick={() => setShowDeptModal(true)}
              className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Add Department
            </Button>
          )}

          {activeTab === 'plants' && (
            <Button
              onClick={() => setShowPlantModal(true)}
              className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Add Location / Plant
            </Button>
          )}

          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center flex-wrap">
            <button
              onClick={() => setActiveTab('roles')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'roles'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Dynamic Roles (RBAC) ({roles.length})
            </button>
            <button
              onClick={() => setActiveTab('ubac')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'ubac'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              User Access Control (UBAC) ({employees.length})
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'departments'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Departments ({departments.length})
            </button>
            <button
              onClick={() => setActiveTab('plants')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'plants'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Plants & Facilities ({plants?.length || 2})
            </button>
            <button
              onClick={() => setActiveTab('factory')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'factory'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Factory Configurations
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Dynamic Roles & Permissions Matrix */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Roles List */}
          <Card className="border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Configured Roles</CardTitle>
                <CardDescription>Click a role to customize its permissions</CardDescription>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowRoleModal(true)}
                className="text-xs text-blue-600"
              >
                + New
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {roles.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setEditingRoleId(r.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedRole.id === r.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{r.name}</span>
                    <div className="flex items-center gap-1.5">
                      {r.isSystem ? (
                        <Badge variant="outline" className="text-[9px] uppercase tracking-wider">
                          System
                        </Badge>
                      ) : (
                        <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-[9px] uppercase tracking-wider">
                          Custom
                        </Badge>
                      )}
                      {!r.isSystem && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRole(r.id);
                          }}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{r.description}</p>
                  <div className="mt-2 text-[10px] text-blue-600 font-semibold">
                    {r.permissions?.length || 0} permissions active &rarr;
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Right Column: Interactive Permission Matrix */}
          <Card className="md:col-span-2 border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold">
                      Permissions for: <span className="text-blue-600">{selectedRole.name}</span>
                    </CardTitle>
                    {selectedRole.isSystem ? (
                      <Badge variant="outline" className="text-[10px]">Protected Base Role</Badge>
                    ) : (
                      <Badge className="bg-indigo-100 text-indigo-700 text-[10px]">Custom Role</Badge>
                    )}
                  </div>
                  <CardDescription className="mt-0.5">{selectedRole.description}</CardDescription>
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {selectedRole.permissions?.length || 0} / {AVAILABLE_PERMISSIONS.length} Enabled
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              {categories.map((cat) => {
                const permsInCat = AVAILABLE_PERMISSIONS.filter((p) => p.category === cat);
                return (
                  <div key={cat} className="space-y-2">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      {cat}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {permsInCat.map((perm) => {
                        const isChecked = selectedRole.permissions?.includes(perm.id);
                        return (
                          <div
                            key={perm.id}
                            onClick={() => toggleActiveRolePermission(perm.id)}
                            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                              isChecked
                                ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200 font-medium'
                                : 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            <span>{perm.label}</span>
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Dynamic Departments Management */}
      {activeTab === 'departments' && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Manufacturing Departments & Production Units</CardTitle>
              <CardDescription>
                Define operational shop floor departments, plant locations, and their designated teams.
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => setShowDeptModal(true)}
              className="text-xs bg-blue-600 text-white"
            >
              + Create Department
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {departments.map((d) => (
                <div
                  key={d.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{d.name}</span>
                    <button
                      onClick={() => deleteDepartment(d.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-slate-500">
                    Plant: <strong className="text-slate-700 dark:text-slate-300">{d.plant}</strong>
                  </div>
                  <div className="text-slate-500">
                    Lead / Manager: <strong className="text-blue-600">{d.manager}</strong>
                  </div>
                  {d.description && <p className="text-slate-400 text-[11px]">{d.description}</p>}
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block mb-1">Active Teams:</span>
                    <div className="flex flex-wrap gap-1">
                      {d.activeTeams.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: User-Based Access Control (UBAC) */}
      {activeTab === 'ubac' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Workforce Directory & Employee Selector */}
          <Card className="border border-slate-200 dark:border-slate-800 flex flex-col h-full">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-purple-600" />
                    Select Employee / User
                  </CardTitle>
                  <CardDescription>Configure user-specific permission overrides</CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-200">
                  {filteredEmployeesForUbac.length} Staff
                </Badge>
              </div>
              <div className="pt-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <Input
                    placeholder="Search name, code, role..."
                    value={ubacSearchQuery}
                    onChange={(e) => setUbacSearchQuery(e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-2 overflow-y-auto max-h-[600px]">
              {filteredEmployeesForUbac.map((emp) => {
                const isSelected = selectedUbacEmp?.id === emp.id;
                const hasOverrides = (emp.customPermissions?.length || 0) > 0 || (emp.revokedPermissions?.length || 0) > 0;

                return (
                  <div
                    key={emp.id}
                    onClick={() => setSelectedUbacEmpId(emp.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30 shadow-xs ring-1 ring-purple-600/30'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-200">{emp.name}</div>
                      <span className="font-mono text-[10px] text-blue-600 font-semibold">{emp.empCode}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {emp.role} &bull; {emp.department}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <span className="text-[10px] text-slate-400">{emp.plant}</span>
                      {hasOverrides ? (
                        <span className="text-[9px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 px-1.5 py-0.5 rounded">
                          +{emp.customPermissions?.length || 0} / -{emp.revokedPermissions?.length || 0} UBAC
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400">Role Default</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Right 2 Columns: Selected Employee UBAC Matrix */}
          <div className="md:col-span-2 space-y-4">
            {selectedUbacEmp ? (
              <Card className="border border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                          {selectedUbacEmp.name}
                        </CardTitle>
                        <Badge className="bg-purple-600 text-white text-[10px] font-mono">
                          {selectedUbacEmp.empCode}
                        </Badge>
                      </div>
                      <CardDescription className="mt-0.5">
                        {selectedUbacEmp.email} &bull; Base Role: <strong className="text-blue-600">{selectedUbacEmp.role}</strong> &bull; {selectedUbacEmp.department} ({selectedUbacEmp.plant})
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUbacCustomGrants([]);
                          setUbacRevoked([]);
                        }}
                        className="h-8 text-xs border-slate-300"
                        title="Clear user-level overrides"
                      >
                        Reset to Role
                      </Button>
                      <Button
                        type="button"
                        disabled={isSavingUbac}
                        onClick={handleSaveUBACForEmployee}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5 shadow-sm"
                      >
                        {isSavingUbac ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Saving UBAC...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Save UBAC Privileges
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-4 gap-2.5 pt-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border text-center">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Base Role Privileges</div>
                      <div className="text-base font-bold text-blue-600">
                        {selectedRoleForUbac?.permissions?.length || 0}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">via {selectedUbacEmp.role}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border text-center">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">UBAC Direct Grants</div>
                      <div className="text-base font-bold text-emerald-600">
                        +{ubacCustomGrants.length}
                      </div>
                      <div className="text-[9px] text-emerald-600 mt-0.5">Special user grants</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border text-center">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">UBAC Restrictions</div>
                      <div className="text-base font-bold text-rose-600">
                        -{ubacRevoked.length}
                      </div>
                      <div className="text-[9px] text-rose-600 mt-0.5">Explicitly revoked</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border text-center">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Net Effective Access</div>
                      <div className="text-base font-bold text-purple-600">
                        {effectiveUbacCount}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">Active capabilities</div>
                    </div>
                  </div>

                  {ubacSavedSuccess && (
                    <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      UBAC permissions for {selectedUbacEmp.name} have been successfully saved and synchronized.
                    </div>
                  )}
                </CardHeader>

                <CardContent className="pt-4 space-y-4 max-h-[620px] overflow-y-auto">
                  {categories.map((cat) => {
                    const catPermissions = AVAILABLE_PERMISSIONS.filter((p) => p.category === cat);
                    const rolePerms = selectedRoleForUbac?.permissions || [];

                    return (
                      <div key={cat} className="space-y-1.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1">
                          {cat} Operations
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {catPermissions.map((perm) => {
                            const isRoleGranted = rolePerms.includes(perm.id);
                            const isCustomGrant = ubacCustomGrants.includes(perm.id);
                            const isCustomRevoked = ubacRevoked.includes(perm.id);

                            return (
                              <div
                                key={perm.id}
                                className={`p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                                  isCustomRevoked
                                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                                    : isCustomGrant
                                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                    {perm.label}
                                    <span className="font-mono text-[10px] text-slate-400">({perm.id})</span>
                                  </div>
                                  <div>
                                    {isCustomRevoked ? (
                                      <span className="text-[10px] font-semibold text-rose-600 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                        UBAC Explicit Denial (Overrides {selectedUbacEmp.role})
                                      </span>
                                    ) : isCustomGrant ? (
                                      <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        UBAC Direct Grant (Special Privilege)
                                      </span>
                                    ) : isRoleGranted ? (
                                      <span className="text-[10px] text-blue-600 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                        Inherited Active from {selectedUbacEmp.role}
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                        Not Granted (Role Default)
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleSetUBACDefault(perm.id)}
                                    className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                                      !isCustomGrant && !isCustomRevoked
                                        ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-xs font-semibold'
                                        : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                  >
                                    Role Default
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSetUBACGrant(perm.id)}
                                    className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                                      isCustomGrant
                                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                        : 'text-emerald-700 hover:bg-emerald-100/50'
                                    }`}
                                  >
                                    + Grant
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSetUBACRevoke(perm.id)}
                                    className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                                      isCustomRevoked
                                        ? 'bg-rose-600 text-white font-bold shadow-xs'
                                        : 'text-rose-700 hover:bg-rose-100/50'
                                    }`}
                                  >
                                    - Deny
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ) : (
              <div className="p-8 text-center text-slate-400 border rounded-xl">
                Select an employee from the directory on the left to configure their UBAC privileges.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Plants & Facilities */}
      {activeTab === 'plants' && (
        <Card className="border border-slate-200 dark:border-slate-800 space-y-4">
          <CardHeader className="pb-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold">Manufacturing Facilities & Plant Locations</CardTitle>
              <CardDescription>
                Physical manufacturing plants, assembly facilities, and regional staging hubs.
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowPlantModal(true)}
              className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs gap-1.5 self-start sm:self-auto shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
            >
              <PlusCircle className="w-4 h-4" />
              + Add New Location / Plant
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(plants || []).map((plant) => {
                const isSelected = selectedPlant === plant.name;
                const deptsInPlant = departments.filter(
                  (d) =>
                    d.plant.toLowerCase().includes(plant.name.toLowerCase()) ||
                    plant.name.toLowerCase().includes(d.plant.toLowerCase())
                ).length;

                return (
                  <div
                    key={plant.id}
                    onClick={() => setSelectedPlant(plant.name)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2.5 relative group ${
                      isSelected
                        ? 'border-[#146b68] bg-[#183638]/5 dark:bg-[#183638]/20 shadow-sm ring-2 ring-[#84cc16]/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-[#146b68] dark:text-[#84cc16]" />
                        {plant.name}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isSelected && (
                          <Badge className="bg-[#183638] text-[#84cc16] border border-[#84cc16]/40 text-[10px] py-0 px-2">Active Context</Badge>
                        )}
                        {plant.id !== 'plant-01' && plant.id !== 'plant-02' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePlant(plant.id);
                            }}
                            className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Location"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] flex-wrap">
                      <span className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 font-bold">
                        {plant.code}
                      </span>
                      <span className="text-slate-500">{plant.city}</span>
                      <Badge variant="outline" className="text-[9px] py-0 text-slate-500">
                        {plant.type}
                      </Badge>
                    </div>

                    <p className="text-slate-500 text-[11px] leading-relaxed">{plant.description}</p>

                    <div className="pt-2 text-[11px] text-slate-600 dark:text-slate-400 space-y-1 border-t border-slate-100 dark:border-slate-800">
                      <div>&bull; Warehouses: <strong>{plant.warehousesCount} stores</strong></div>
                      <div>&bull; Departments: <strong>{deptsInPlant || plant.departmentsCount} units</strong></div>
                      <div>&bull; Plant Head: <strong>{plant.manager}</strong></div>
                    </div>

                    {!isSelected && (
                      <div className="pt-1">
                        <span className="text-[10px] text-blue-600 font-medium group-hover:underline">
                          Click to switch operating context &rarr;
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
                <div className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-emerald-600" />
                  Facility Scope Rules
                </div>
                <p className="text-slate-500 text-[11px]">
                  Material movements and kits are strictly scoped to the active facility context.
                </p>
                <div className="pt-2 text-[11px] text-emerald-600 font-semibold border-t border-slate-100 dark:border-slate-800">
                  &bull; Zero cross-plant stock contamination
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Factory Operations Configurations */}
      {activeTab === 'factory' && (
        <Card className="border border-slate-200 dark:border-slate-800 max-w-2xl">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base font-semibold">Shift Timings & Production Thresholds</CardTitle>
            <CardDescription>
              Baseline parameters used to compute units/hour, expected shift output, and quality tolerance margins.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {savedSettingsSuccess && (
              <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Factory operations configuration successfully saved!
              </div>
            )}

            <form onSubmit={handleSaveFactoryConfig} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Shift A Timings (Morning)</label>
                  <Input
                    value={shiftATime}
                    onChange={(e) => setShiftATime(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Shift B Timings (Evening)</label>
                  <Input
                    value={shiftBTime}
                    onChange={(e) => setShiftBTime(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Standard Work Hours per Shift</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={standardHours}
                    onChange={(e) => setStandardHours(Number(e.target.value))}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">QA Rejection Tolerance Threshold (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={qaTolerancePct}
                    onChange={(e) => setQaTolerancePct(Number(e.target.value))}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end">
                <Button type="submit" size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold">
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Save Configurations
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Modal: Create Dynamic Role */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Create Dynamic Custom Role
              </h2>
              <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Role Title</label>
                <Input
                  required
                  placeholder="e.g. Quality Lead Inspector, Maintenance Engineer"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="h-9 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Role Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe responsibilities and access boundary..."
                  value={roleDesc}
                  onChange={(e) => setRoleDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Check Allowed Permissions</label>
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <div key={cat} className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{cat}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {AVAILABLE_PERMISSIONS.filter((p) => p.category === cat).map((perm) => {
                          const isChecked = selectedPermissions.includes(perm.id);
                          return (
                            <div
                              key={perm.id}
                              onClick={() => togglePermission(perm.id)}
                              className={`p-2 rounded border cursor-pointer flex items-center justify-between text-[11px] ${
                                isChecked
                                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 text-blue-900 dark:text-blue-200'
                                  : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-500'
                              }`}
                            >
                              <span>{perm.label}</span>
                              {isChecked ? <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowRoleModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold">
                  Create Role
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Dynamic Department */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Add Manufacturing Department
              </h2>
              <button onClick={() => setShowDeptModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Department Name</label>
                <Input
                  required
                  placeholder="e.g. SMT Surface Mount Line, Burn-In Testing Lab"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Plant Location</label>
                  <select
                    value={deptPlant}
                    onChange={(e) => setDeptPlant(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  >
                    {plants.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.city})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Department Head</label>
                  <Input
                    placeholder="Manager Name"
                    value={deptManager}
                    onChange={(e) => setDeptManager(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Active Teams / Cells (comma separated)</label>
                <Input
                  placeholder="e.g. Line 1 Alpha, Line 1 Beta"
                  value={deptTeams}
                  onChange={(e) => setDeptTeams(e.target.value)}
                  className="h-9"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Department purpose and scope..."
                  value={deptDesc}
                  onChange={(e) => setDeptDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowDeptModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold">
                  Add Department
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register New Manufacturing Plant / Location */}
      {showPlantModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  Register Manufacturing Facility / Plant
                </h2>
                <p className="text-[11px] text-slate-500">
                  Establish a new multi-plant operating node for UBAC access scopes and material routing.
                </p>
              </div>
              <button onClick={() => setShowPlantModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreatePlant} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Facility / Plant Name</label>
                  <Input
                    required
                    placeholder="e.g. Plant 3 - Chakan Facility"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    className="h-9 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Facility Code</label>
                  <Input
                    required
                    placeholder="e.g. PLANT-03"
                    value={plantCode}
                    onChange={(e) => setPlantCode(e.target.value)}
                    className="h-9 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Geographic City / State</label>
                  <Input
                    required
                    placeholder="e.g. Chakan, Pune, Maharashtra"
                    value={plantCity}
                    onChange={(e) => setPlantCity(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Facility Type</label>
                  <select
                    value={plantType}
                    onChange={(e) => setPlantType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  >
                    <option value="Full Manufacturing & SMT">Full Manufacturing & SMT Lines</option>
                    <option value="Assembly & Staging">Assembly & Staging Hub</option>
                    <option value="Distribution Warehouse">Distribution & Raw Material Warehouse</option>
                    <option value="Testing & QC Lab">Photometric Testing & Aging Lab</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Plant Head / Manager</label>
                  <Input
                    placeholder="e.g. Rajesh Kulkarni"
                    value={plantManager}
                    onChange={(e) => setPlantManager(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Warehouse Zones</label>
                  <Input
                    type="number"
                    min="1"
                    value={plantWarehouses}
                    onChange={(e) => setPlantWarehouses(Number(e.target.value))}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Department Units</label>
                  <Input
                    type="number"
                    min="1"
                    value={plantDepts}
                    onChange={(e) => setPlantDepts(Number(e.target.value))}
                    className="h-9"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Operational Status</label>
                <select
                  value={plantStatus}
                  onChange={(e) => setPlantStatus(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                >
                  <option value="Active">Active Operational Facility</option>
                  <option value="Commissioning">Under Commissioning / Setup</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Facility Description & Scope</label>
                <textarea
                  rows={2}
                  placeholder="Manufacturing focus, assembly cells, capacity..."
                  value={plantDesc}
                  onChange={(e) => setPlantDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowPlantModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold">
                  Register Facility & Update UBAC
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
