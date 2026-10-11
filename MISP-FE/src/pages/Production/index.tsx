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
  Filter
} from 'lucide-react';
import { useMipsStore, isPlantMatch } from '@/store/useMipsStore';
import { mipsService } from '@/api/services/mips.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export const ProductionPage: React.FC = () => {
  const {
    productionLogs: rawProductionLogs,
    products,
    kits: rawKits,
    employees: rawEmployees,
    selectedPlant,
    setEmployees,
    addProductionLog
  } = useMipsStore();

  const productionLogs = rawProductionLogs.filter((p) => isPlantMatch(p.plant, selectedPlant));
  const kits = rawKits.filter((k) => isPlantMatch(k.plant, selectedPlant));
  const employees = rawEmployees.filter((e) => isPlantMatch(e.plant, selectedPlant));

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
            plant: u.plant || 'Plant 1 - Pune Hub',
            department: u.department || 'Final Assembly Line 1',
            team: u.team || 'Line 1 Alpha',
            supervisor: u.supervisor || 'System Super Admin',
            status: (u.status as any) || 'Active',
            joiningDate: u.createdAt ? u.createdAt.split('T')[0] : '2026-10-01',
            workstation: u.workstation || 'Floor',
            skills: u.skills ? u.skills.split(',').map((s) => s.trim()) : [],
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
          <CardTitle className="text-base font-semibold">Production Orders & Shift Entries</CardTitle>
          <CardDescription>
            Formula: Productivity % = (Actual Production / Expected Production) &times; 100
          </CardDescription>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {productionLogs.map((log) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Log Production Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Log Production Output
              </h2>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Manufactured Product</label>
                <select
                  value={selectedProdId}
                  onChange={(e) => setSelectedProdId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Shift</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
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
                    <option value="">-- Select Line Operator --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name} ({emp.role} &bull; {emp.department})
                      </option>
                    ))}
                    {/* Fallback default operators if database has only admin */}
                    {employees.length <= 1 && (
                      <>
                        <option value="Ravi Kumar">Ravi Kumar (Worker &bull; Assembly Line 1)</option>
                        <option value="Amit Sharma">Amit Sharma (Worker &bull; Assembly Line 1)</option>
                        <option value="Priya Verma">Priya Verma (Worker &bull; Assembly Line 2)</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Floor Supervisor *</label>
                  <select
                    value={supervisor}
                    onChange={(e) => setSupervisor(e.target.value)}
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
                    <option value="Suresh Patil">Suresh Patil (Floor Supervisor)</option>
                    <option value="Anand Deshmukh">Anand Deshmukh (Plant Manager)</option>
                    <option value="Ramesh Naidu">Ramesh Naidu (Shift Incharge)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
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
    </div>
  );
};

export default ProductionPage;
