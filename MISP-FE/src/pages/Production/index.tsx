import React, { useState, useEffect } from 'react';
import {
  Factory,
  PlusCircle,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  Search,
  Filter,
  Edit2,
  Trash2
} from 'lucide-react';
import { useMipsStore, isPlantMatch, ProductionLog } from '@/store/useMipsStore';
import { mipsService } from '@/api/services/mips.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TablePagination, usePagination } from '@/components/common/TablePagination';

export const ProductionPage: React.FC = () => {
  const {
    productionLogs: rawProductionLogs,
    products,
    kits: rawKits,
    employees: rawEmployees,
    selectedPlant,
    setEmployees,
    addProductionLog,
    updateProductionLog,
    deleteProductionLog
  } = useMipsStore();

  const productionLogs = rawProductionLogs.filter((p) => isPlantMatch(p.plant, selectedPlant));
  const kits = rawKits.filter((k) => isPlantMatch(k.plant, selectedPlant));
  const employees = rawEmployees.filter((e) => isPlantMatch(e.plant, selectedPlant));

  const [searchTerm, setSearchTerm] = useState('');
  const [shiftFilter, setShiftFilter] = useState('All');
  const [wattageFilter, setWattageFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredLogs = React.useMemo(() => {
    return productionLogs.filter((log) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        log.orderNo.toLowerCase().includes(q) ||
        log.productName.toLowerCase().includes(q) ||
        log.operator.toLowerCase().includes(q) ||
        log.supervisor.toLowerCase().includes(q);

      const matchesShift = shiftFilter === 'All' || log.shift === shiftFilter;

      const prod = products.find((p) => p.name === log.productName || p.id === (log as any).productId);
      const matchesWattage = wattageFilter === 'All' || (prod && prod.wattage === wattageFilter);

      const logDate = log.date ? log.date.split('T')[0] : '';
      const matchesDate =
        (!startDate || logDate >= startDate) &&
        (!endDate || logDate <= endDate);

      return matchesSearch && matchesShift && matchesWattage && matchesDate;
    });
  }, [productionLogs, products, searchTerm, shiftFilter, wattageFilter, startDate, endDate]);

  const {
    currentPage: prodPage,
    setCurrentPage: setProdPage,
    pageSize: prodPageSize,
    setPageSize: setProdPageSize,
    totalItems: totalProdItems,
    totalPages: totalProdPages,
    paginatedItems: paginatedLogs,
  } = usePagination(filteredLogs, 10);

  React.useEffect(() => {
    setProdPage(1);
  }, [searchTerm, shiftFilter, wattageFilter, startDate, endDate]);

  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedProdId, setSelectedProdId] = useState(products[0]?.id || '');
  const [shift, setShift] = useState<'Shift A (Morning)' | 'Shift B (Evening)' | 'General Shift'>('Shift A (Morning)');
  const [targetUnits, setTargetUnits] = useState<number>(100);
  const [actualUnits, setActualUnits] = useState<number>(95);
  const [rejectUnits, setRejectUnits] = useState<number>(2);
  const [wasteUnits, setWasteUnits] = useState<number>(1);
  const [operator, setOperator] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [workHours, setWorkHours] = useState<number>(8);

  // Edit Production Log State
  const [showEditLogModal, setShowEditLogModal] = useState(false);
  const [editingLogId, setEditingLogId] = useState('');
  const [editShift, setEditShift] = useState<'Shift A (Morning)' | 'Shift B (Evening)' | 'General Shift'>('Shift A (Morning)');
  const [editTargetUnits, setEditTargetUnits] = useState<number>(100);
  const [editActualUnits, setEditActualUnits] = useState<number>(95);
  const [editRejectUnits, setEditRejectUnits] = useState<number>(2);
  const [editWasteUnits, setEditWasteUnits] = useState<number>(1);
  const [editOperator, setEditOperator] = useState('');
  const [editSupervisor, setEditSupervisor] = useState('');
  const [editWorkHours, setEditWorkHours] = useState<number>(8);
  const [editProductName, setEditProductName] = useState('');

  useEffect(() => {
    const syncStaff = async () => {
      try {
        const dbUsers = await mipsService.getUsers();
        if (Array.isArray(dbUsers) && dbUsers.length > 0) {
          const mapped = dbUsers.map((u) => ({
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
            status: (u.status as any) || 'Active',
            joiningDate: u.createdAt ? u.createdAt.split('T')[0] : '2026-10-01',
            workstation: u.workstation || 'Floor',
            skills: Array.isArray(u.skills)
              ? u.skills
              : typeof u.skills === 'string' && u.skills
              ? u.skills.split(',').map((s: string) => s.trim())
              : [],
          }));
          setEmployees(mapped);
        }
      } catch (err) {
        console.warn('Backend sync in production:', err);
      }
    };

    if (!employees || employees.length <= 1) {
      syncStaff();
    }
  }, []);

  const openLogModal = () => {
    const firstWorker = employees.find((e) => e.role === 'Worker' || !e.role.includes('Admin'))?.name || employees[0]?.name || 'Ravi Kumar';
    const firstSup = employees.find((e) => e.role.includes('Supervisor') || e.role.includes('Manager'))?.name || 'Suresh Patil';
    setOperator(firstWorker);
    setSupervisor(firstSup);
    setShowLogModal(true);
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProdId);
    if (!prod) return;

    addProductionLog({
      date: new Date().toISOString().split('T')[0],
      shift,
      orderNo: `MO-2026-${Math.floor(500 + Math.random() * 500)}`,
      productId: prod.id,
      productName: prod.name,
      targetQty: targetUnits,
      actualQty: actualUnits,
      rejectedQty: rejectUnits,
      wastageQty: wasteUnits,
      operator,
      supervisor,
      workingHours: workHours,
      plant: selectedPlant,
    });

    setShowLogModal(false);
  };

  const openEditLogModal = (log: ProductionLog) => {
    setEditingLogId(log.id);
    setEditShift(log.shift as any || 'Shift A (Morning)');
    setEditTargetUnits(log.targetQty);
    setEditActualUnits(log.actualQty);
    setEditRejectUnits(log.rejectedQty);
    setEditWasteUnits(log.wastageQty);
    setEditOperator(log.operator);
    setEditSupervisor(log.supervisor);
    setEditWorkHours(log.workingHours || 8);
    setEditProductName(log.productName);
    setShowEditLogModal(true);
  };

  const handleEditLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLogId) return;

    updateProductionLog(editingLogId, {
      shift: editShift,
      targetQty: editTargetUnits,
      actualQty: editActualUnits,
      rejectedQty: editRejectUnits,
      wastageQty: editWasteUnits,
      operator: editOperator,
      supervisor: editSupervisor,
      workingHours: editWorkHours,
    });

    setShowEditLogModal(false);
  };

  const handleDeleteLog = (id: string, orderNo: string) => {
    if (window.confirm(`Are you sure you want to delete production log ${orderNo}?`)) {
      deleteProductionLog(id);
    }
  };

  const totalProduced = productionLogs.reduce((acc, p) => acc + p.actualQty, 0);
  const totalRejects = productionLogs.reduce((acc, p) => acc + p.rejectedQty, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Factory className="w-6 h-6 text-[#146b68] dark:text-[#84cc16]" />
              Production Management & Daily Shifts
            </h1>
            <Badge variant="outline" className="bg-[#183638]/10 text-[#146b68] dark:text-[#d4e967] border-[#146b68]/30 text-[11px] font-semibold">
              {selectedPlant}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Capture shop floor actual production, shift logs, QA rejection batches and scrap rates for {selectedPlant}.
          </p>
        </div>

        <Button
          onClick={openLogModal}
          className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Log Production Entry
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Production Logged
            </CardTitle>
            <Factory className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProduced.toLocaleString()} units</div>
            <div className="text-xs text-slate-400 mt-0.5">Across active shifts</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Quality Rejections
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalRejects} units</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Rejection rate: {totalProduced > 0 ? ((totalRejects / totalProduced) * 100).toFixed(1) : 0}%
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Average Productivity
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {Math.round(
                productionLogs.reduce((acc, p) => acc + p.productivityPct, 0) / (productionLogs.length || 1)
              )}%
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Efficiency against expected shift output</div>
          </CardContent>
        </Card>
      </div>

      {/* Production Logs Table */}
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold">Production Orders & Shift Entries</CardTitle>
              <CardDescription>
                Formula: Productivity % = (Actual Production / Expected Production) &times; 100
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 max-w-xs">
                <Input
                  placeholder="Search order, product, operator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 text-xs w-48 sm:w-56"
                />
              </div>

              <Select value={shiftFilter} onValueChange={setShiftFilter}>
                <SelectTrigger className="w-[155px] h-8 text-xs">
                  <SelectValue placeholder="All Shifts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Shifts</SelectItem>
                  <SelectItem value="Shift A (Morning)">Shift A (Morning)</SelectItem>
                  <SelectItem value="Shift B (Evening)">Shift B (Evening)</SelectItem>
                  <SelectItem value="General Shift">General Shift</SelectItem>
                </SelectContent>
              </Select>

              <Select value={wattageFilter} onValueChange={setWattageFilter}>
                <SelectTrigger className="w-[125px] h-8 text-xs">
                  <SelectValue placeholder="All Wattages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Wattages</SelectItem>
                  <SelectItem value="5W">5W</SelectItem>
                  <SelectItem value="9W">9W</SelectItem>
                  <SelectItem value="12W">12W</SelectItem>
                  <SelectItem value="15W">15W</SelectItem>
                  <SelectItem value="20W">20W</SelectItem>
                  <SelectItem value="50W">50W</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1.5 text-xs">
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="Start date"
                  className="w-32"
                />
                <span className="text-slate-400 text-[10px]">to</span>
                <DatePicker
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="End date"
                  className="w-32"
                />
                {(startDate || endDate) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                    }}
                    className="h-8 px-2 text-xs text-rose-500 hover:text-rose-700"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Date & Shift</th>
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Operator / Worker</th>
                  <th className="py-2.5 px-3 text-right">Expected</th>
                  <th className="py-2.5 px-3 text-right">Actual Produced</th>
                  <th className="py-2.5 px-3 text-right">Rejections</th>
                  <th className="py-2.5 px-3 text-right">Units / Hr</th>
                  <th className="py-2.5 px-3 text-center">Productivity</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{log.date}</div>
                      <div className="text-[10px] text-slate-400">{log.shift}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-blue-600 font-medium">{log.orderNo}</td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {log.productName}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{log.operator}</div>
                      <div className="text-[10px] text-slate-400">Supervisor: {log.supervisor}</div>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500">{log.targetQty}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                      {log.actualQty}
                    </td>
                    <td className="py-3 px-3 text-right text-red-500 font-semibold">{log.rejectedQty}</td>
                    <td className="py-3 px-3 text-right font-semibold text-indigo-600">{log.unitsPerHour} u/h</td>
                    <td className="py-3 px-3 text-center">
                      <Badge
                        variant="outline"
                        className={
                          log.productivityPct >= 100
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }
                      >
                        {log.productivityPct}%
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditLogModal(log)}
                          className="h-7 w-7 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          title="Edit Log"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLog(log.id, log.orderNo)}
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete Log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400">
                      No production orders or shift entries found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <TablePagination
            currentPage={prodPage}
            totalPages={totalProdPages}
            totalItems={totalProdItems}
            pageSize={prodPageSize}
            onPageChange={setProdPage}
            onPageSizeChange={setProdPageSize}
          />
        </CardContent>
      </Card>

      {/* Log Production Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-4 flex justify-center items-start sm:items-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full my-auto flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b p-4 sm:p-5 shrink-0 bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Factory className="w-4 h-4 text-[#146b68] dark:text-[#84cc16]" />
                Log Production Output
              </h2>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="flex flex-col min-h-0 flex-1">
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Select Manufactured Product *</label>
                  <select
                    value={selectedProdId}
                    onChange={(e) => setSelectedProdId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs"
                  >
                    {products.length === 0 ? (
                      <option value="">No products found. Please add products in Master Data first.</option>
                    ) : (
                      <>
                        <option value="">-- Select Product --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.code} - {p.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  {products.length === 0 && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                      ⚠️ No products available. Please add products in Master Data &gt; Finished Products first.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Shift</label>
                    <select
                      value={shift}
                      onChange={(e) => setShift(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs"
                    >
                      <option value="Shift A (Morning)">Shift A (Morning)</option>
                      <option value="Shift B (Evening)">Shift B (Evening)</option>
                      <option value="General Shift">General Shift</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Working Hours</label>
                    <Input
                      type="number"
                      step="0.5"
                      value={workHours}
                      onChange={(e) => setWorkHours(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Expected Production Qty</label>
                    <Input
                      type="number"
                      value={targetUnits}
                      onChange={(e) => setTargetUnits(Number(e.target.value))}
                      required
                      className="h-9"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Actual Produced</label>
                    <Input
                      type="number"
                      value={actualUnits}
                      onChange={(e) => setActualUnits(Number(e.target.value))}
                      required
                      className="h-9 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-red-500">QA Rejections</label>
                    <Input
                      type="number"
                      value={rejectUnits}
                      onChange={(e) => setRejectUnits(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-amber-500">Wastage / Scrap</label>
                    <Input
                      type="number"
                      value={wasteUnits}
                      onChange={(e) => setWasteUnits(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Operator / Worker *</label>
                    <select
                      value={operator}
                      onChange={(e) => setOperator(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-medium"
                    >
                      {employees.length === 0 ? (
                        <option value="">No line operators available. Please onboard staff first.</option>
                      ) : (
                        <>
                          <option value="">-- Select Line Operator --</option>
                          {employees.map((emp) => (
                            <option key={emp.id} value={emp.name}>
                              {emp.name} ({emp.role} &bull; {emp.department})
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    {employees.length === 0 && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                        ⚠️ No workforce found. Please onboard employees in Employees page first.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Floor Supervisor *</label>
                    <select
                      value={supervisor}
                      onChange={(e) => setSupervisor(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-medium"
                    >
                      {employees.filter((e) => e.role.includes('Supervisor') || e.role.includes('Manager') || e.role.includes('Admin')).length === 0 ? (
                        <option value="">No floor supervisors available. Please onboard supervisors first.</option>
                      ) : (
                        <>
                          <option value="">-- Select Floor Supervisor --</option>
                          {employees
                            .filter((e) => e.role.includes('Supervisor') || e.role.includes('Manager') || e.role.includes('Admin'))
                            .map((sup) => (
                              <option key={sup.id} value={sup.name}>
                                {sup.name} ({sup.role})
                              </option>
                            ))}
                        </>
                      )}
                    </select>
                    {employees.filter((e) => e.role.includes('Supervisor') || e.role.includes('Manager') || e.role.includes('Admin')).length === 0 && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                        ⚠️ No supervisors found. Onboard supervisors in Employees page first.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t shrink-0 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowLogModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold">
                  Save Production Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Production Record Modal */}
      {showEditLogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-4 flex justify-center items-start sm:items-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full my-auto flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b p-4 sm:p-5 shrink-0 bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-blue-600" />
                  Edit Production Shift Entry
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">{editProductName}</p>
              </div>
              <button onClick={() => setShowEditLogModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={handleEditLogSubmit} className="flex flex-col min-h-0 flex-1">
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Shift</label>
                    <select
                      value={editShift}
                      onChange={(e) => setEditShift(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs"
                    >
                      <option value="Shift A (Morning)">Shift A (Morning)</option>
                      <option value="Shift B (Evening)">Shift B (Evening)</option>
                      <option value="General Shift">General Shift</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Working Hours</label>
                    <Input
                      type="number"
                      step="0.5"
                      value={editWorkHours}
                      onChange={(e) => setEditWorkHours(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Expected Production Qty</label>
                    <Input
                      type="number"
                      value={editTargetUnits}
                      onChange={(e) => setEditTargetUnits(Number(e.target.value))}
                      required
                      className="h-9"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Actual Produced</label>
                    <Input
                      type="number"
                      value={editActualUnits}
                      onChange={(e) => setEditActualUnits(Number(e.target.value))}
                      required
                      className="h-9 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-red-500">QA Rejections</label>
                    <Input
                      type="number"
                      value={editRejectUnits}
                      onChange={(e) => setEditRejectUnits(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-amber-500">Wastage / Scrap</label>
                    <Input
                      type="number"
                      value={editWasteUnits}
                      onChange={(e) => setEditWasteUnits(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Operator / Worker *</label>
                    <select
                      value={editOperator}
                      onChange={(e) => setEditOperator(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-medium"
                    >
                      <option value="">-- Select Line Operator --</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.name}>
                          {emp.name} ({emp.role} &bull; {emp.department})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Floor Supervisor *</label>
                    <select
                      value={editSupervisor}
                      onChange={(e) => setEditSupervisor(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-medium"
                    >
                      <option value="">-- Select Floor Supervisor --</option>
                      {employees
                        .filter((e) => e.role.includes('Supervisor') || e.role.includes('Manager') || e.role.includes('Admin'))
                        .map((sup) => (
                          <option key={sup.id} value={sup.name}>
                            {sup.name} ({sup.role})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t shrink-0 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditLogModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionPage;
