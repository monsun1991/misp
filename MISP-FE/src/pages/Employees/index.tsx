import React, { useState, useEffect } from 'react';
import {
  Users2,
  UserPlus,
  Building,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers,
  MapPin,
  Phone,
  Mail,
  Award,
  Trash2,
  Edit2,
  RefreshCw,
  Loader2,
  Key,
  Sliders,
  CheckSquare,
  Square,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useMipsStore, AVAILABLE_PERMISSIONS, getEffectivePermissions, isPlantMatch } from '@/store/useMipsStore';
import type { Employee } from '@/store/useMipsStore';
import { mipsService } from '@/api/services/mips.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TablePagination, usePagination } from '@/components/common/TablePagination';

export const EmployeesPage: React.FC = () => {
  const {
    employees,
    roles,
    departments,
    plants,
    selectedPlant,
    onboardEmployee,
    updateEmployee,
    updateEmployeeUBAC,
    deactivateEmployee,
    deleteEmployee,
    setEmployees
  } = useMipsStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync users with real MySQL backend database
  const loadUsersFromBackend = async () => {
    setIsLoading(true);
    try {
      const dbUsers = await mipsService.getUsers();
      if (Array.isArray(dbUsers)) {
        const mapped: Employee[] = dbUsers.map((u) => {
          let customPermissions: string[] = [];
          let revokedPermissions: string[] = [];
          if (Array.isArray(u.customPermissions)) {
            customPermissions = u.customPermissions;
          } else if (u.customPermissionsJson) {
            try {
              customPermissions = JSON.parse(u.customPermissionsJson);
            } catch (e) {}
          }
          if (Array.isArray(u.revokedPermissions)) {
            revokedPermissions = u.revokedPermissions;
          } else if (u.revokedPermissionsJson) {
            try {
              revokedPermissions = JSON.parse(u.revokedPermissionsJson);
            } catch (e) {}
          }

          return {
            id: u.id,
            empCode: u.empCode || `EMP-${u.id.substring(0, 4).toUpperCase()}`,
            name: u.fullName || u.email,
            email: u.email,
            phone: u.phoneNumber || '-',
            role: u.role || 'Worker',
            plant: u.plant || '',
            department: u.department || '',
            team: u.team || '',
            supervisor: u.supervisor || '',
            status: (u.status as any) || (u.isActive !== false ? 'Active' : 'Inactive'),
            joiningDate: u.createdAt ? u.createdAt.split('T')[0] : '2026-10-01',
            workstation: u.workstation || 'Floor',
            skills: Array.isArray(u.skills)
              ? u.skills
              : typeof u.skills === 'string' && u.skills
              ? u.skills.split(',').map((s: string) => s.trim())
              : [],
            customPermissions,
            revokedPermissions,
          };
        });
        setEmployees(mapped);
      }
    } catch (err) {
      console.warn('Backend sync warning:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsersFromBackend();
  }, []);

  // Onboard modal state
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [name, setName] = useState('');
  const [empCode, setEmpCode] = useState(`EMP-${Math.floor(1010 + Math.random() * 900)}`);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [selectedRole, setSelectedRole] = useState(roles[0]?.name || '');
  const [modalPlant, setModalPlant] = useState(plants[0]?.name || '');
  const [selectedDept, setSelectedDept] = useState('');
  const [team, setTeam] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [workstation, setWorkstation] = useState('');
  const [status, setStatus] = useState<'Active' | 'Onboarding' | 'Probation'>('Active');
  const [skillsStr, setSkillsStr] = useState('');
  const [loginPin, setLoginPin] = useState('123456');

  // Edit Employee Modal State
  const [showEditEmpModal, setShowEditEmpModal] = useState(false);
  const [editingEmpId, setEditingEmpId] = useState('');
  const [editEmpName, setEditEmpName] = useState('');
  const [editEmpEmail, setEditEmpEmail] = useState('');
  const [editEmpPhone, setEditEmpPhone] = useState('');
  const [editEmpRole, setEditEmpRole] = useState('');
  const [editEmpPlant, setEditEmpPlant] = useState('');
  const [editEmpDept, setEditEmpDept] = useState('');
  const [editEmpTeam, setEditEmpTeam] = useState('');
  const [editEmpWorkstation, setEditEmpWorkstation] = useState('');
  const [editEmpSupervisor, setEditEmpSupervisor] = useState('');
  const [editEmpStatus, setEditEmpStatus] = useState<Employee['status']>('Active');
  const [editEmpSkills, setEditEmpSkills] = useState('');
  const [editEmpPin, setEditEmpPin] = useState('');

  const handleOpenEditEmp = (emp: Employee) => {
    setEditingEmpId(emp.id);
    setEditEmpName(emp.name);
    setEditEmpEmail(emp.email);
    setEditEmpPhone(emp.phone);
    setEditEmpRole(emp.role);
    setEditEmpPlant(emp.plant || plants[0]?.name || '');
    setEditEmpDept(emp.department);
    setEditEmpTeam(emp.team);
    setEditEmpWorkstation(emp.workstation || 'General Bench');
    setEditEmpSupervisor(emp.supervisor || '');
    setEditEmpStatus(emp.status);
    setEditEmpSkills(Array.isArray(emp.skills) ? emp.skills.join(', ') : '');
    setEditEmpPin('');
    setShowEditEmpModal(true);
  };

  const handleSaveEditEmp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const skillsArray = editEmpSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const updates: Partial<Employee> = {
        name: editEmpName,
        email: editEmpEmail,
        phone: editEmpPhone,
        role: editEmpRole,
        plant: editEmpPlant,
        department: editEmpDept,
        team: editEmpTeam,
        workstation: editEmpWorkstation,
        supervisor: editEmpSupervisor,
        status: editEmpStatus,
        skills: skillsArray,
      };

      updateEmployee(editingEmpId, updates);

      try {
        const apiPayload: any = {
          fullName: editEmpName,
          email: editEmpEmail,
          phoneNumber: editEmpPhone,
          role: editEmpRole,
          plant: editEmpPlant,
          department: editEmpDept,
          team: editEmpTeam,
          workstation: editEmpWorkstation,
          supervisor: editEmpSupervisor,
          status: editEmpStatus,
          skills: editEmpSkills,
        };
        if (editEmpPin && editEmpPin.trim().length >= 4) {
          apiPayload.pin = editEmpPin.trim();
          apiPayload.password = editEmpPin.trim();
        }
        await mipsService.updateUser(editingEmpId, apiPayload);
      } catch (apiErr) {
        console.warn('Backend API update skipped or failed, local state updated:', apiErr);
      }

      setShowEditEmpModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // UBAC (User-Based Access Control) Modal State
  const [selectedEmpForUBAC, setSelectedEmpForUBAC] = useState<Employee | null>(null);
  const [ubacCustomGrants, setUbacCustomGrants] = useState<string[]>([]);
  const [ubacRevoked, setUbacRevoked] = useState<string[]>([]);
  const [isSavingUBAC, setIsSavingUBAC] = useState(false);
  const [ubacSuccessMessage, setUbacSuccessMessage] = useState('');

  const openUBACModal = (emp: Employee) => {
    setSelectedEmpForUBAC(emp);
    setUbacCustomGrants(emp.customPermissions || []);
    setUbacRevoked(emp.revokedPermissions || []);
    setUbacSuccessMessage('');
  };

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

  const handleSaveUBAC = async () => {
    if (!selectedEmpForUBAC) return;
    setIsSavingUBAC(true);
    try {
      updateEmployeeUBAC(selectedEmpForUBAC.id, ubacCustomGrants, ubacRevoked);
      await mipsService.updateUser(selectedEmpForUBAC.id, {
        customPermissions: ubacCustomGrants,
        revokedPermissions: ubacRevoked,
      });
      setUbacSuccessMessage('User-Based Access Control (UBAC) overrides saved successfully!');
      setTimeout(() => {
        setUbacSuccessMessage('');
        setSelectedEmpForUBAC(null);
      }, 1000);
    } catch (err) {
      console.error('Failed to save UBAC permissions to backend', err);
    } finally {
      setIsSavingUBAC(false);
    }
  };

  // Filter departments dynamically based on the selected plant location
  const filteredDepartments = React.useMemo(() => {
    if (!modalPlant || modalPlant === 'All Plants (Global)') {
      return departments;
    }
    return departments.filter((d) => {
      const p = modalPlant.toLowerCase();
      const dp = (d.plant || '').toLowerCase();
      return dp.includes(p) || p.includes(dp);
    });
  }, [departments, modalPlant]);

  // Current active department object for reporting manager lookup
  const currentDeptObj = departments.find((d) => d.name === selectedDept);

  // Plant change handler: filters departments and sets reporting manager to the department manager
  const handlePlantChange = (newPlant: string) => {
    setModalPlant(newPlant);
    const matchingDepts = departments.filter((d) => {
      if (!newPlant || newPlant === 'All Plants (Global)') return true;
      const p = newPlant.toLowerCase();
      const dp = (d.plant || '').toLowerCase();
      return dp.includes(p) || p.includes(dp);
    });
    const firstDept = matchingDepts[0];
    if (firstDept) {
      setSelectedDept(firstDept.name);
      setSupervisor(firstDept.manager);
      setTeam(firstDept.activeTeams?.[0] || 'Default Team');
    } else {
      setSelectedDept('');
      setSupervisor('');
      setTeam('');
    }
  };

  // Department change handler: auto-populates reporting supervisor to department manager and sets default active team
  const handleDeptChange = (newDeptName: string) => {
    setSelectedDept(newDeptName);
    const deptObj = departments.find((d) => d.name === newDeptName);
    if (deptObj) {
      setSupervisor(deptObj.manager);
      if (deptObj.activeTeams && deptObj.activeTeams.length > 0) {
        setTeam(deptObj.activeTeams[0]);
      }
    }
  };

  // Open modal with pre-configured cascade
  const openOnboardModal = () => {
    const initialPlant = selectedPlant && !selectedPlant.startsWith('All')
      ? selectedPlant
      : (plants[0]?.name || '');
    setModalPlant(initialPlant);
    const matching = departments.filter((d) => {
      const p = initialPlant.toLowerCase();
      const dp = (d.plant || '').toLowerCase();
      return dp.includes(p) || p.includes(dp);
    });
    const initialDept = matching[0] || departments[0];
    if (initialDept) {
      setSelectedDept(initialDept.name);
      setSupervisor(initialDept.manager);
      setTeam(initialDept.activeTeams?.[0] || '');
    } else {
      setSelectedDept('');
      setSupervisor('');
      setTeam('');
    }
    setSelectedRole(roles[0]?.name || '');
    setName('');
    setEmail('');
    setPhone('+91 ');
    setSkillsStr('');
    setWorkstation('');
    setEmpCode(`EMP-${Math.floor(1010 + Math.random() * 900)}`);
    setShowOnboardModal(true);
  };

  // Filtered employees for table: scoped to active facility context
  const filteredEmployees = employees.filter((emp) => {
    const matchesPlant = isPlantMatch(emp.plant, selectedPlant);
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || emp.role === roleFilter;
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
    return matchesPlant && matchesSearch && matchesRole && matchesDept && matchesStatus;
  });

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    paginatedItems: paginatedEmployees,
  } = usePagination(filteredEmployees, 10);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, deptFilter, statusFilter, selectedPlant]);

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !empCode) return;

    setIsSubmitting(true);
    const userEmail = email || `${name.toLowerCase().replace(/\s+/g, '.')}@mips.internal`;

    try {
      // 1. Actually persist in MySQL database
      const savedUser = await mipsService.createUser({
        empCode,
        fullName: name,
        email: userEmail,
        phoneNumber: phone,
        role: selectedRole,
        plant: modalPlant,
        department: selectedDept,
        team,
        workstation,
        supervisor,
        status,
        skills: skillsStr,
        pin: loginPin || '123456',
        password: loginPin || '123456',
      });

      // 2. Update local state
      const newEmp: Employee = {
        id: savedUser?.id || `emp-${Date.now()}`,
        empCode,
        name,
        email: userEmail,
        phone,
        role: selectedRole,
        plant: modalPlant,
        department: selectedDept,
        team,
        supervisor,
        status,
        joiningDate: new Date().toISOString().split('T')[0],
        workstation,
        skills: skillsStr.split(',').map((s) => s.trim()).filter(Boolean),
      };

      onboardEmployee(newEmp);
      setShowOnboardModal(false);
      setName('');
      setEmail('');
      setPhone('+91 ');
      setLoginPin('123456');
      setEmpCode(`EMP-${Math.floor(1010 + Math.random() * 900)}`);
    } catch (err) {
      console.error('Failed to save onboarded employee', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await mipsService.deleteUser(id);
    } catch (err) {
      console.warn('Backend delete error:', err);
    }
    deleteEmployee(id);
  };

  // KPIs
  const totalStaff = employees.length;
  const activeWorkers = employees.filter((e) => e.role === 'Worker').length;
  const supervisors = employees.filter((e) => e.role.includes('Supervisor') || e.role.includes('Manager')).length;
  const onboardingCount = employees.filter((e) => e.status === 'Onboarding' || e.status === 'Probation').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users2 className="w-6 h-6 text-[#146b68] dark:text-[#84cc16]" />
              Workforce Management & Employee Onboarding
            </h1>
            <Badge variant="outline" className="bg-[#183638]/10 text-[#146b68] dark:text-[#d4e967] border-[#146b68]/30 text-[11px] font-semibold">
              {selectedPlant}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Staff onboarding, dynamic role assignment, plant/department scoping (UBAC), and floor station allocations for {selectedPlant}.
          </p>
        </div>

        <Button
          onClick={openOnboardModal}
          className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
        >
          <UserPlus className="w-4 h-4 mr-1.5" />
          Onboard New Employee
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Workforce
            </CardTitle>
            <Users2 className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff} Staff</div>
            <div className="text-xs text-slate-400 mt-0.5">Across all plants & departments</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Line Operators
            </CardTitle>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{activeWorkers} Operators</div>
            <div className="text-xs text-slate-400 mt-0.5">Assembly & testing workstations</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Floor Supervisors
            </CardTitle>
            <Award className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{supervisors} Supervisors</div>
            <div className="text-xs text-slate-400 mt-0.5">Leading line teams & kit sign-offs</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              In Onboarding / Probation
            </CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{onboardingCount} Staff</div>
            <div className="text-xs text-slate-400 mt-0.5">Undergoing initial station training</div>
          </CardContent>
        </Card>
      </div>

      {/* Directory Table */}
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <Input
                placeholder="Search staff name, code, skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            {/* Dynamic Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Roles</SelectItem>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.name}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="w-[155px] h-8 text-xs">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Departments</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.name}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] h-8 text-xs">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Onboarding">Onboarding</SelectItem>
                  <SelectItem value="Probation">Probation</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={loadUsersFromBackend}
                disabled={isLoading}
                className="h-8 text-xs gap-1.5 border-slate-200 dark:border-slate-700"
                title="Refresh workforce directory"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                Sync Directory
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Employee Code</th>
                  <th className="py-2.5 px-3">Full Name & Contact</th>
                  <th className="py-2.5 px-3">Dynamic Role (RBAC)</th>
                  <th className="py-2.5 px-3">Department (UBAC)</th>
                  <th className="py-2.5 px-3">Workstation / Cell</th>
                  <th className="py-2.5 px-3">Reporting Supervisor</th>
                  <th className="py-2.5 px-3">Date Joined</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                      <p className="text-xs">Fetching workforce directory...</p>
                    </td>
                  </tr>
                )}
                {!isLoading && filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <Users2 className="w-10 h-10 mx-auto mb-3 opacity-30 text-slate-500" />
                      <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">No employees found in directory</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        Your workforce directory currently contains only the master administrator. Click "+ Onboard New Employee" above to register and allocate staff members.
                      </p>
                    </td>
                  </tr>
                )}
                {!isLoading && paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <td className="py-3 px-3 font-mono font-semibold text-blue-600">{emp.empCode}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{emp.name}</div>
                      <div className="text-[10px] text-slate-400">{emp.email} &bull; {emp.phone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col items-start gap-1">
                        <Badge
                          variant="outline"
                          className={
                            emp.role === 'Superadmin' || emp.role === 'Super Admin'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : emp.role === 'Supervisor'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : emp.role.includes('Manager')
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }
                        >
                          {emp.role}
                        </Badge>
                        {(emp.customPermissions?.length || 0) > 0 || (emp.revokedPermissions?.length || 0) > 0 ? (
                          <button
                            type="button"
                            onClick={() => openUBACModal(emp)}
                            className="inline-flex items-center gap-1 text-[9px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 px-1.5 py-0.5 rounded hover:bg-purple-100 transition-colors"
                            title="Click to view & edit User-Based Access Control overrides"
                          >
                            <Key className="w-2.5 h-2.5" />
                            UBAC: +{emp.customPermissions?.length || 0} / -{emp.revokedPermissions?.length || 0}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openUBACModal(emp)}
                            className="text-[9px] text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-0.5"
                            title="Click to configure UBAC individual overrides"
                          >
                            <Key className="w-2.5 h-2.5 opacity-50" />
                            Role Default
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{emp.department}</div>
                      <div className="text-[10px] text-slate-400">{emp.plant} &bull; {emp.team}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {emp.workstation || 'General Bench'}
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                      {emp.supervisor}
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{emp.joiningDate}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          emp.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : emp.status === 'Onboarding'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : emp.status === 'Probation'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditEmp(emp)}
                          className="h-7 text-[11px] px-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/40 gap-1 font-medium"
                          title="Edit Employee Profile"
                        >
                          <Edit2 className="w-3 h-3 text-blue-600" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openUBACModal(emp)}
                          className="h-7 text-[11px] px-2 text-purple-700 border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950/40 gap-1 font-medium"
                          title="Configure User Based Access Control (UBAC)"
                        >
                          <ShieldCheck className="w-3 h-3 text-purple-600" />
                          UBAC
                        </Button>
                        {emp.status !== 'Inactive' ? (
                          <button
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="text-red-400 hover:text-red-600 p-1"
                            title="Delete Employee"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">Archived</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>

      {/* Onboarding Wizard Modal */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-4 flex justify-center items-start sm:items-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full my-auto flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b p-4 sm:p-5 shrink-0 bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#146b68] dark:text-[#84cc16]" />
                  Employee Onboarding Wizard
                </h2>
                <p className="text-[11px] text-slate-500">
                  Register staff member, assign dynamic role & designate UBAC organizational scope.
                </p>
              </div>
              <button onClick={() => setShowOnboardModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} className="flex flex-col min-h-0 flex-1">
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Full Legal Name</label>
                  <Input
                    required
                    placeholder="e.g. Deepak Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Employee Code</label>
                  <Input
                    required
                    value={empCode}
                    onChange={(e) => setEmpCode(e.target.value)}
                    className="h-9 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Official Email</label>
                  <Input
                    type="email"
                    placeholder="e.g. employee@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              {/* Login PIN / Password Configuration */}
              <div className="p-3 rounded-xl bg-lime-50/70 dark:bg-lime-950/20 border border-lime-200 dark:border-lime-900/40">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-semibold text-lime-950 dark:text-lime-200 text-xs">
                    Initial Login 6-Digit PIN *
                  </label>
                  <button
                    type="button"
                    onClick={() => setLoginPin('123456')}
                    className="text-[11px] text-lime-700 dark:text-lime-400 hover:underline font-semibold"
                  >
                    Reset to Default (123456)
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="password"
                    maxLength={6}
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="h-9 font-mono tracking-widest text-center font-bold text-sm bg-white dark:bg-slate-900"
                  />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Staff member uses this 6-digit PIN with their email or phone number to authenticate.
                </p>
              </div>

              {/* Dynamic Role & Department */}
              {/* Dynamic Role & Department */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-blue-600" />
                    Organizational Placement & Hierarchy (UBAC)
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-semibold px-2 py-0.5 rounded-full">
                    Cascading Facility Scope
                  </span>
                </div>

                {/* Step 1 & 2: Plant Location FIRST, then filtered Department */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      1. Plant Location (Facility) *
                    </label>
                    <select
                      value={modalPlant}
                      onChange={(e) => handlePlantChange(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      {plants.length === 0 ? (
                        <option value="">No plants available. Please add a plant in Settings first.</option>
                      ) : (
                        <>
                          <option value="">-- Select Plant Location --</option>
                          {plants.map((p) => (
                            <option key={p.id} value={p.name}>
                              {p.name} ({p.city})
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    {plants.length === 0 ? (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                        ⚠️ No plants found. Please add a plant in Settings &gt; Plants &amp; Facilities first.
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-500 mt-1">Select plant facility to filter operational units</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      2. Department (Filtered by Plant) *
                    </label>
                    <select
                      value={selectedDept}
                      onChange={(e) => handleDeptChange(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      {departments.length === 0 ? (
                        <option value="">No departments available. Please add a department in Settings first.</option>
                      ) : filteredDepartments.length === 0 ? (
                        <option value="">No departments in this plant. Please add one in Settings.</option>
                      ) : (
                        <>
                          <option value="">-- Select Department --</option>
                          {filteredDepartments.map((d) => (
                            <option key={d.id} value={d.name}>
                              {d.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    {departments.length === 0 ? (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                        ⚠️ No departments found. Please add a department in Settings &gt; Departments first.
                      </p>
                    ) : filteredDepartments.length === 0 ? (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                        ⚠️ No departments in this plant. Add one in Settings &gt; Departments.
                      </p>
                    ) : (
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 font-medium">
                        {filteredDepartments.length} department{filteredDepartments.length !== 1 ? 's' : ''} in {modalPlant || selectedPlant}
                      </p>
                    )}
                  </div>
                </div>

                {/* Step 3 & 4: Reporting Supervisor (Derived from Department) & Line/Team */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      3. Reporting To (Department Head / Supervisor) *
                    </label>
                    <select
                      value={supervisor}
                      onChange={(e) => setSupervisor(e.target.value)}
                      className="w-full h-8 bg-slate-50 dark:bg-slate-800 border rounded-lg px-2 text-xs font-medium text-slate-900 dark:text-slate-100"
                    >
                      {currentDeptObj?.manager && (
                        <option value={currentDeptObj.manager}>
                          {currentDeptObj.manager} (Department Manager - Default)
                        </option>
                      )}
                      {employees
                        .filter(
                          (emp) =>
                            emp.role.includes('Manager') ||
                            emp.role.includes('Supervisor') ||
                            emp.role.includes('Admin') ||
                            emp.role.includes('Lead')
                        )
                        .map((emp) => (
                          <option key={emp.id} value={`${emp.name} (${emp.role})`}>
                            {emp.name} &bull; {emp.role} ({emp.department})
                          </option>
                        ))}
                      {employees.length === 0 && (
                        <option value="">No supervisors available. Please onboard staff first.</option>
                      )}
                    </select>
                    {employees.length === 0 ? (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                        ⚠️ No supervisors found. Onboard supervisors in Employees page first.
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-500 mt-1">
                        {currentDeptObj ? `Default: ${currentDeptObj.manager} (${currentDeptObj.name})` : 'Auto-linked to selected department'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      4. Line / Sub-Team *
                    </label>
                    {currentDeptObj?.activeTeams && currentDeptObj.activeTeams.length > 0 ? (
                      <select
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                      >
                        {currentDeptObj.activeTeams.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                        placeholder="e.g. Line 1 Alpha"
                        className="h-8 text-xs"
                      />
                    )}
                    <p className="text-[10px] text-slate-500 mt-1">Designated line or shift cell</p>
                  </div>
                </div>

                {/* Step 5 & 6: Role, Workstation & Status */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      5. Dynamic Role (RBAC) *
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-medium"
                    >
                      {roles.length === 0 ? (
                        <option value="">No roles configured. Please add a role in Settings first.</option>
                      ) : (
                        <>
                          <option value="">-- Select Role --</option>
                          {roles.map((r) => (
                            <option key={r.id} value={r.name}>
                              {r.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    {roles.length === 0 && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                        ⚠️ No roles configured. Please add a role in Settings &gt; Dynamic Roles first.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      6. Workstation / Bench
                    </label>
                    <Input
                      placeholder="e.g. Station 3 - Potting"
                      value={workstation}
                      onChange={(e) => setWorkstation(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      7. Onboarding Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
                    >
                      <option value="Active">Active (Ready for Production)</option>
                      <option value="Onboarding">Onboarding (Induction)</option>
                      <option value="Probation">Probation (Under Evaluation)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Skills & Station Certifications (comma separated)</label>
                <Input
                  placeholder="e.g. Driver Potting, Soldering, Visual QA, Photometric Sphere"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            <div className="p-4 border-t shrink-0 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowOnboardModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold px-4">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Completing Onboarding...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-1.5" />
                    Complete Onboarding
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )}

      {/* UBAC (User-Based Access Control) Modal */}
      {selectedEmpForUBAC && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    User-Based Access Control (UBAC)
                    <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200 font-mono">
                      {selectedEmpForUBAC.empCode}
                    </Badge>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fine-grained per-user permission overrides and access restrictions for <strong>{selectedEmpForUBAC.name}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmpForUBAC(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-semibold p-1"
              >
                &times;
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Employee & RBAC Baseline Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Assigned Identity</div>
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-0.5">{selectedEmpForUBAC.name}</div>
                  <div className="text-slate-500 text-[11px]">{selectedEmpForUBAC.email} &bull; {selectedEmpForUBAC.department} ({selectedEmpForUBAC.plant})</div>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border text-center">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Base Role (RBAC)</div>
                    <div className="font-bold text-blue-600">{selectedEmpForUBAC.role}</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border text-center">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">UBAC Grants</div>
                    <div className="font-bold text-emerald-600">+{ubacCustomGrants.length}</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border text-center">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">UBAC Denials</div>
                    <div className="font-bold text-rose-600">-{ubacRevoked.length}</div>
                  </div>
                </div>
              </div>

              {/* Notification Banner */}
              {ubacSuccessMessage && (
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  {ubacSuccessMessage}
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Granular Permission Matrix & User Overrides
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUbacCustomGrants([]);
                      setUbacRevoked([]);
                    }}
                    className="h-7 text-[11px] border-slate-300 dark:border-slate-700"
                  >
                    Reset to Role Defaults
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUbacRevoked([]);
                      setUbacCustomGrants(AVAILABLE_PERMISSIONS.map((p) => p.id));
                    }}
                    className="h-7 text-[11px] text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  >
                    Grant All Permissions
                  </Button>
                </div>
              </div>

              {/* Permission List grouped by category */}
              <div className="space-y-4">
                {Array.from(new Set(AVAILABLE_PERMISSIONS.map((p) => p.category))).map((cat) => {
                  const catPermissions = AVAILABLE_PERMISSIONS.filter((p) => p.category === cat);
                  const roleObj = roles.find((r) => r.name === selectedEmpForUBAC.role);

                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1">
                        {cat} Operations
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {catPermissions.map((perm) => {
                          const isRoleGranted = (roleObj?.permissions || []).includes(perm.id);
                          const isCustomGrant = ubacCustomGrants.includes(perm.id);
                          const isCustomRevoked = ubacRevoked.includes(perm.id);
                          const isEffective = (isRoleGranted || isCustomGrant) && !isCustomRevoked;

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
                                <div className="flex items-center gap-2">
                                  {isCustomRevoked ? (
                                    <span className="text-[10px] font-semibold text-rose-600 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                      UBAC Explicit Denial (Overrides {selectedEmpForUBAC.role})
                                    </span>
                                  ) : isCustomGrant ? (
                                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                      UBAC Direct Grant (Special Privilege)
                                    </span>
                                  ) : isRoleGranted ? (
                                    <span className="text-[10px] text-blue-600 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                      Inherited from {selectedEmpForUBAC.role}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                      Not Granted (Role Default)
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* 3-Way UBAC Override Selector */}
                              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleSetUBACDefault(perm.id)}
                                  className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                                    !isCustomGrant && !isCustomRevoked
                                      ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-xs font-semibold'
                                      : 'text-slate-500 hover:text-slate-800'
                                  }`}
                                  title="Clear override and follow assigned role"
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
                                  title="Explicitly grant permission to this user"
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
                                  title="Explicitly deny/revoke permission from this user"
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
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="text-[11px] text-slate-500">
                User-based overrides take strict precedence over base RBAC role permissions.
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEmpForUBAC(null)}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  disabled={isSavingUBAC}
                  onClick={handleSaveUBAC}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5"
                >
                  {isSavingUBAC ? (
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
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditEmpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-4 flex justify-center items-start sm:items-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full my-auto flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b p-4 sm:p-5 shrink-0 bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-blue-600" />
                  Edit Employee Profile
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update personal details, plant allocation, department unit, reporting supervisor and status.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditEmpModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEditEmp} className="flex flex-col min-h-0 flex-1">
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <Input
                    required
                    value={editEmpName}
                    onChange={(e) => setEditEmpName(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={editEmpStatus}
                    onChange={(e) => setEditEmpStatus(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  >
                    <option value="Active">Active</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Probation">Probation</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Official Email *</label>
                  <Input
                    type="email"
                    required
                    value={editEmpEmail}
                    onChange={(e) => setEditEmpEmail(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number *</label>
                  <Input
                    required
                    value={editEmpPhone}
                    onChange={(e) => setEditEmpPhone(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Facility / Plant</label>
                  <select
                    value={editEmpPlant}
                    onChange={(e) => setEditEmpPlant(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-semibold"
                  >
                    {plants.length === 0 ? (
                      <option value="">No plants available. Please add a plant in Settings first.</option>
                    ) : (
                      <>
                        <option value="">-- Select Plant Location --</option>
                        {plants.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name} ({p.city})
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Department</label>
                  <select
                    value={editEmpDept}
                    onChange={(e) => setEditEmpDept(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-semibold"
                  >
                    {departments.length === 0 ? (
                      <option value="">No departments available. Please add a department in Settings first.</option>
                    ) : (
                      <>
                        <option value="">-- Select Department --</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name} ({d.plant || 'All Plants'})
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Operational Role (RBAC)</label>
                  <select
                    value={editEmpRole}
                    onChange={(e) => setEditEmpRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-semibold"
                  >
                    {roles.length === 0 ? (
                      <option value="">No roles available. Please add a role in Settings first.</option>
                    ) : (
                      <>
                        <option value="">-- Select Role --</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Assigned Team / Cell</label>
                  <Input
                    value={editEmpTeam}
                    onChange={(e) => setEditEmpTeam(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Workstation / Machine Bench</label>
                  <Input
                    value={editEmpWorkstation}
                    onChange={(e) => setEditEmpWorkstation(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Reporting Supervisor *</label>
                  <select
                    value={editEmpSupervisor}
                    onChange={(e) => setEditEmpSupervisor(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-semibold"
                  >
                    {employees.length === 0 ? (
                      <option value="">No staff members available. Please onboard staff first.</option>
                    ) : (
                      employees.map((e) => (
                        <option key={e.id} value={`${e.name} (${e.role})`}>
                          {e.name} &bull; {e.role} ({e.plant || 'All Plants'})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Skills & Certifications (Comma-separated)</label>
                <Input
                  value={editEmpSkills}
                  onChange={(e) => setEditEmpSkills(e.target.value)}
                  placeholder="e.g. SMD Soldering, Hi-Pot Testing, Final Assembly"
                  className="h-9"
                />
              </div>

              {/* Login PIN / Password Management */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 text-xs">
                    Reset Employee Login PIN (6 Digits)
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditEmpPin('123456')}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    Set to Standard Default (123456)
                  </button>
                </div>
                <Input
                  type="text"
                  maxLength={6}
                  value={editEmpPin}
                  onChange={(e) => setEditEmpPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Leave empty to keep existing PIN intact"
                  className="h-9 font-mono tracking-widest font-bold text-center"
                />
                <p className="text-[10px] text-slate-400">
                  {editEmpPin ? 'New PIN will take effect immediately upon saving.' : 'Leave blank if the employee PIN should remain unchanged.'}
                </p>
              </div>
            </div>

            <div className="p-4 border-t shrink-0 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowEditEmpModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  );
};

export default EmployeesPage;
