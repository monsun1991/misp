import React, { useState } from 'react';
import {
  Layers,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  RotateCcw,
  Scale,
  Search,
  Building,
  ShieldAlert,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { useMipsStore, ProductionKit, KitItem, isPlantMatch } from '@/store/useMipsStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export const KitsPage: React.FC = () => {
  const {
    kits: rawKits,
    products,
    materials,
    departments: rawDepartments,
    employees: rawEmployees,
    selectedPlant,
    createKit,
    recordKitProgress,
    reconcileAndCloseKit
  } = useMipsStore();

  const kits = rawKits.filter((k) => isPlantMatch(k.plant, selectedPlant));
  const departments = rawDepartments.filter((d) => isPlantMatch(d.plant, selectedPlant));
  const employees = rawEmployees.filter((e) => isPlantMatch(e.plant, selectedPlant));

  const [activeTab, setActiveTab] = useState<'kits' | 'employeeLedger'>('kits');
  const [searchTerm, setSearchTerm] = useState('');

  // New Kit Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProdId, setSelectedProdId] = useState(products[0]?.id || '');
  const [batchQty, setBatchQty] = useState<number>(100);
  const [assignedWorker, setAssignedWorker] = useState(employees[0]?.name || 'Ravi Kumar');
  const [supervisorName, setSupervisorName] = useState('Suresh Patil (Supervisor)');
  const [departmentName, setDepartmentName] = useState(departments[0]?.name || 'Final Assembly Line 1');

  // Sync worker & department when employees/departments update on plant change
  React.useEffect(() => {
    if (employees.length > 0 && !employees.some((e) => e.name === assignedWorker)) {
      setAssignedWorker(employees[0].name);
    }
    if (departments.length > 0 && !departments.some((d) => d.name === departmentName)) {
      setDepartmentName(departments[0].name);
    }
  }, [employees, departments]);

  // Reconcile Modal
  const [reconcileKit, setReconcileKit] = useState<ProductionKit | null>(null);
  const [consumptionInputs, setConsumptionInputs] = useState<Record<string, { consumed: number; returned: number; wastage: number }>>({});
  const [supervisorNotes, setSupervisorNotes] = useState('');
  const [reconcileError, setReconcileError] = useState<string | null>(null);
  const [defectiveCount, setDefectiveCount] = useState<number>(0);

  const selectedProduct = products.find((p) => p.id === selectedProdId) || products[0];

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCreateKitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || batchQty <= 0) return;

    // Build kit items from product BOM multiplied by batchQty
    const kitItems: KitItem[] = selectedProduct.bom.map((b) => {
      const totalIssuedQty = b.qtyPerUnit * batchQty;
      return {
        materialId: b.materialId,
        materialCode: b.materialCode,
        materialName: b.materialName,
        bomQtyPerUnit: b.qtyPerUnit,
        totalIssuedQty,
        consumedQty: 0,
        returnedQty: 0,
        wastageQty: 0,
        balanceWithEmployee: totalIssuedQty,
      };
    });

    createKit({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      plannedBatchQty: batchQty,
      assignedEmployee: assignedWorker,
      supervisor: supervisorName,
      department: departmentName,
      plant: selectedPlant,
      items: kitItems,
    });

    setShowCreateModal(false);
  };

  const openReconcileModal = (kit: ProductionKit) => {
    setReconcileKit(kit);
    setReconcileError(null);
    setSupervisorNotes(kit.reconciliationNotes || '');

    const initialInputs: Record<string, { consumed: number; returned: number; wastage: number }> = {};
    kit.items.forEach((item) => {
      initialInputs[item.materialId] = {
        consumed: item.consumedQty,
        returned: item.returnedQty,
        wastage: item.wastageQty,
      };
    });
    setConsumptionInputs(initialInputs);
  };

  const handleReconcileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reconcileKit) return;

    // Update progress in store first
    const updates = reconcileKit.items.map((item) => {
      const inp = consumptionInputs[item.materialId] || { consumed: 0, returned: 0, wastage: 0 };
      return {
        materialId: item.materialId,
        consumedQty: inp.consumed,
        returnedQty: inp.returned,
        wastageQty: inp.wastage,
      };
    });

    recordKitProgress(reconcileKit.id, updates, reconcileKit.supervisor);

    // Call reconciliation & closure
    const result = reconcileAndCloseKit(reconcileKit.id, supervisorNotes, reconcileKit.supervisor);
    if (!result.success) {
      setReconcileError(result.error || 'Reconciliation failed.');
    } else {
      setReconcileKit(null);
    }
  };

  // Compute Employee-wise Material & Production Accountability Summary
  const employeeMap: Record<
    string,
    {
      employee: string;
      department: string;
      totalExpectedUnits: number;
      totalDefectiveUnits: number;
      netProducedUnits: number;
      materials: Record<
        string,
        { materialName: string; issued: number; consumed: number; returned: number; wastage: number; balance: number }
      >;
    }
  > = {};

  kits.forEach((k) => {
    if (!employeeMap[k.assignedEmployee]) {
      employeeMap[k.assignedEmployee] = {
        employee: k.assignedEmployee,
        department: k.department,
        totalExpectedUnits: 0,
        totalDefectiveUnits: 0,
        netProducedUnits: 0,
        materials: {},
      };
    }
    const emp = employeeMap[k.assignedEmployee];
    emp.totalExpectedUnits += k.plannedBatchQty;

    const kitMaxDefect = Math.max(...k.items.map((i) => i.wastageQty), 0);
    emp.totalDefectiveUnits += kitMaxDefect;
    emp.netProducedUnits += Math.max(0, k.plannedBatchQty - kitMaxDefect);

    k.items.forEach((item) => {
      if (!emp.materials[item.materialName]) {
        emp.materials[item.materialName] = {
          materialName: item.materialName,
          issued: 0,
          consumed: 0,
          returned: 0,
          wastage: 0,
          balance: 0,
        };
      }
      const m = emp.materials[item.materialName];
      m.issued += item.totalIssuedQty;
      m.consumed += item.consumedQty;
      m.returned += item.returnedQty;
      m.wastage += item.wastageQty;
      m.balance += item.balanceWithEmployee;
    });
  });

  const employeeLedger = Object.values(employeeMap);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#146b68] dark:text-[#84cc16]" />
              Kit Management & Workforce Accountability
            </h1>
            <Badge variant="outline" className="bg-[#183638]/10 text-[#146b68] dark:text-[#d4e967] border-[#146b68]/30 text-[11px] font-semibold">
              {selectedPlant}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            BOM-driven production kits, job issuance, shop floor consumption and mathematical reconciliation for {selectedPlant}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleOpenCreateModal}
            className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Issue Production Kit
          </Button>

          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center">
            <button
              onClick={() => setActiveTab('kits')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'kits'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Kits Lifecycle
            </button>
            <button
              onClick={() => setActiveTab('employeeLedger')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'employeeLedger'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Employee Balances
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Active Kits
            </CardTitle>
            <Layers className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kits.filter((k) => k.status !== 'Closed').length}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Currently on shop floor</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              In Production
            </CardTitle>
            <ClipboardList className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kits.filter((k) => k.status === 'In Production' || k.status === 'Issued').length}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Work in progress</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Reconciled & Closed
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {kits.filter((k) => k.status === 'Closed').length}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Zero material leakage</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Workers Held
            </CardTitle>
            <UserCheck className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employeeLedger.length} Staff
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Holding issued parts</div>
          </CardContent>
        </Card>
      </div>

      {/* Tab 1: Kits Lifecycle Table */}
      {activeTab === 'kits' && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Production Kits Registry</CardTitle>
            <CardDescription>
              BRD Rule: Issued Quantity = Consumed Quantity + Returned Quantity + Approved Wastage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kits.map((kit) => {
                const totalIssued = kit.items.reduce((acc, i) => acc + i.totalIssuedQty, 0);
                const totalConsumed = kit.items.reduce((acc, i) => acc + i.consumedQty, 0);
                const totalReturned = kit.items.reduce((acc, i) => acc + i.returnedQty, 0);
                const totalWastage = kit.items.reduce((acc, i) => acc + i.wastageQty, 0);
                const totalPendingBalance = kit.items.reduce((acc, i) => acc + i.balanceWithEmployee, 0);

                const isBalanced = totalIssued === totalConsumed + totalReturned + totalWastage;

                return (
                  <div
                    key={kit.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm space-y-3"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b pb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-blue-600 text-sm">{kit.kitNumber}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                          {kit.productName}
                        </span>
                        <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-800 font-medium">
                          Expected Output: {kit.plannedBatchQty} units
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        {kit.status === 'Closed' ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                            Reconciled & Closed
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                            {kit.status}
                          </Badge>
                        )}

                        {kit.status !== 'Closed' && (
                          <Button
                            size="sm"
                            onClick={() => openReconcileModal(kit)}
                            className="h-7 text-xs bg-[#183638] hover:bg-[#122b2d] text-[#84cc16] border border-[#84cc16]/40 font-semibold"
                          >
                            <Scale className="w-3.5 h-3.5 mr-1" />
                            Log Progress & Reconcile
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Net Output Accountability Formula Strip (e.g. 2000 issued - 20 defected = 1980 produced) */}
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div>
                          <span className="text-slate-400">Expected Output:</span>{' '}
                          <strong className="text-slate-800 dark:text-slate-100">{kit.plannedBatchQty.toLocaleString()} units</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Defected Sub-parts:</span>{' '}
                          <strong className="text-red-500 font-bold">
                            {Math.max(...kit.items.map((i) => i.wastageQty), 0).toLocaleString()} items
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Net Produced:</span>{' '}
                          <strong className="text-emerald-600 font-extrabold">
                            {Math.max(0, kit.plannedBatchQty - Math.max(...kit.items.map((i) => i.wastageQty), 0)).toLocaleString()} units
                          </strong>
                        </div>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded border">
                        {kit.plannedBatchQty} (Expected) &minus; {Math.max(...kit.items.map((i) => i.wastageQty), 0)} (Defects) = {Math.max(0, kit.plannedBatchQty - Math.max(...kit.items.map((i) => i.wastageQty), 0))} Net Units
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <div>
                        <span className="text-slate-400">Worker Assigned:</span>{' '}
                        <strong className="text-slate-800 dark:text-slate-200">{kit.assignedEmployee}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Supervisor:</span>{' '}
                        <strong className="text-slate-800 dark:text-slate-200">{kit.supervisor}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Department:</span>{' '}
                        <strong className="text-slate-800 dark:text-slate-200">{kit.department}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Issue Date:</span>{' '}
                        <strong className="text-slate-800 dark:text-slate-200">{kit.issueDate || kit.createdDate}</strong>
                      </div>
                    </div>

                    {/* Component Breakdown Table */}
                    <div className="overflow-x-auto pt-1">
                      <table className="w-full text-left text-xs bg-slate-50/50 dark:bg-slate-900/50 rounded-lg">
                        <thead>
                          <tr className="border-b text-slate-400 text-[11px]">
                            <th className="py-1.5 px-3">BOM Material</th>
                            <th className="py-1.5 px-3 text-right">BOM Qty/Unit</th>
                            <th className="py-1.5 px-3 text-right">Total Issued</th>
                            <th className="py-1.5 px-3 text-right">Consumed</th>
                            <th className="py-1.5 px-3 text-right">Returned</th>
                            <th className="py-1.5 px-3 text-right">Wastage</th>
                            <th className="py-1.5 px-3 text-right font-bold">Held by Worker</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {kit.items.map((item) => (
                            <tr key={item.materialId}>
                              <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">
                                {item.materialName} ({item.materialCode})
                              </td>
                              <td className="py-2 px-3 text-right">{item.bomQtyPerUnit}</td>
                              <td className="py-2 px-3 text-right font-semibold">{item.totalIssuedQty}</td>
                              <td className="py-2 px-3 text-right text-blue-600">{item.consumedQty}</td>
                              <td className="py-2 px-3 text-right text-emerald-600">{item.returnedQty}</td>
                              <td className="py-2 px-3 text-right text-red-500">{item.wastageQty}</td>
                              <td className="py-2 px-3 text-right font-bold text-amber-600">
                                {item.balanceWithEmployee}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {kit.reconciliationNotes && (
                      <div className="text-[11px] bg-slate-50 dark:bg-slate-800 p-2 rounded border text-slate-600 dark:text-slate-300">
                        <strong>Reconciliation Notes:</strong> {kit.reconciliationNotes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Employee Material Accountability Board (BRD Section 07) */}
      {activeTab === 'employeeLedger' && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Employee Material Accountability Ledger
            </CardTitle>
            <CardDescription>
              Real-time audit of all materials held by individual production floor staff.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employeeLedger.map((emp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {emp.employee.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{emp.employee}</div>
                        <div className="text-[10px] text-slate-400">{emp.department}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Net Output / Accountability</div>
                      <div className="text-xs font-bold text-emerald-600">
                        {emp.netProducedUnits} / {emp.totalExpectedUnits} units
                      </div>
                    </div>
                  </div>

                  {/* Summary Accountability Pill */}
                  <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Expected</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{emp.totalExpectedUnits}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Defected</span>
                      <span className="font-bold text-red-500">{emp.totalDefectiveUnits}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Net Produced</span>
                      <span className="font-extrabold text-emerald-600">{emp.netProducedUnits}</span>
                    </div>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 text-[11px] border-b">
                        <th className="py-1">Material</th>
                        <th className="py-1 text-right">Issued</th>
                        <th className="py-1 text-right text-red-500">Defects</th>
                        <th className="py-1 text-right">Consumed</th>
                        <th className="py-1 text-right">Returned</th>
                        <th className="py-1 text-right font-bold">Remaining</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {Object.values(emp.materials).map((mat, i) => (
                        <tr key={i}>
                          <td className="py-1.5 font-medium text-slate-700 dark:text-slate-300">
                            {mat.materialName}
                          </td>
                          <td className="py-1.5 text-right">{mat.issued}</td>
                          <td className="py-1.5 text-right text-red-500 font-semibold">{mat.wastage}</td>
                          <td className="py-1.5 text-right text-blue-600">{mat.consumed}</td>
                          <td className="py-1.5 text-right text-emerald-600">{mat.returned}</td>
                          <td className="py-1.5 text-right font-bold text-amber-600">{mat.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Kit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Generate Production Kit from BOM
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateKitSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Product to Assemble</label>
                <select
                  value={selectedProdId}
                  onChange={(e) => setSelectedProdId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.name} ({p.wattage})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Batch Output Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={batchQty}
                    onChange={(e) => setBatchQty(Number(e.target.value))}
                    className="h-9 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Production Department</label>
                  <select
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name} ({dept.plant})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Assign to Operator / Worker</label>
                  <select
                    value={assignedWorker}
                    onChange={(e) => {
                      setAssignedWorker(e.target.value);
                      const emp = employees.find((x) => x.name === e.target.value);
                      if (emp?.department) setDepartmentName(emp.department);
                      if (emp?.supervisor) setSupervisorName(emp.supervisor);
                    }}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name} &bull; {emp.role} ({emp.department})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Responsible Supervisor</label>
                  <select
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs"
                  >
                    {employees
                      .filter((e) => e.role.includes('Supervisor') || e.role.includes('Manager') || e.role.includes('Admin'))
                      .map((sup) => (
                        <option key={sup.id} value={`${sup.name} (${sup.role})`}>
                          {sup.name} ({sup.role})
                        </option>
                      ))}
                    <option value="Suresh Patil (Supervisor)">Suresh Patil (Supervisor)</option>
                    <option value="Anand Deshmukh (Production Manager)">Anand Deshmukh (Production Manager)</option>
                  </select>
                </div>
              </div>

              {/* Automatic BOM preview */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border space-y-1">
                <div className="font-semibold text-slate-700 dark:text-slate-300">
                  Materials To Be Issued ({batchQty} units BOM multiplier):
                </div>
                <ul className="list-disc pl-4 text-[11px] text-slate-500 space-y-0.5">
                  {selectedProduct.bom.map((b) => (
                    <li key={b.materialId}>
                      {b.materialName}: <strong>{b.qtyPerUnit * batchQty} {b.uom}</strong> (BOM: {b.qtyPerUnit}/unit)
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold">
                  Issue Kit & Deduct Warehouse Stock
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reconcile & Close Modal */}
      {reconcileKit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Kit Material Reconciliation & Closure
                </h2>
                <p className="text-[11px] text-slate-500">
                  Kit {reconcileKit.kitNumber} &bull; Worker: {reconcileKit.assignedEmployee}
                </p>
              </div>
              <button onClick={() => setReconcileKit(null)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            {reconcileError && (
              <div className="p-2.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
                {reconcileError}
              </div>
            )}

            <form onSubmit={handleReconcileSubmit} className="space-y-4 text-xs">
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {reconcileKit.items.map((item) => {
                  const currentInp = consumptionInputs[item.materialId] || { consumed: 0, returned: 0, wastage: 0 };
                  const sum = currentInp.consumed + currentInp.returned + currentInp.wastage;
                  const delta = item.totalIssuedQty - sum;

                  return (
                    <div key={item.materialId} className="p-3 rounded-lg border bg-slate-50/50 dark:bg-slate-800/50 space-y-2">
                      <div className="flex items-center justify-between font-semibold">
                        <span>{item.materialName}</span>
                        <span>Issued: {item.totalIssuedQty}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 block">Consumed (Output)</label>
                          <Input
                            type="number"
                            min="0"
                            value={currentInp.consumed}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setConsumptionInputs({
                                ...consumptionInputs,
                                [item.materialId]: { ...currentInp, consumed: val },
                              });
                            }}
                            className="h-7 text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 block">Returned (Unused)</label>
                          <Input
                            type="number"
                            min="0"
                            value={currentInp.returned}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setConsumptionInputs({
                                ...consumptionInputs,
                                [item.materialId]: { ...currentInp, returned: val },
                              });
                            }}
                            className="h-7 text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 block">Wastage / Scrap</label>
                          <Input
                            type="number"
                            min="0"
                            value={currentInp.wastage}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setConsumptionInputs({
                                ...consumptionInputs,
                                [item.materialId]: { ...currentInp, wastage: val },
                              });
                            }}
                            className="h-7 text-xs"
                          />
                        </div>
                      </div>

                      <div className="text-[10px] flex items-center justify-between">
                        <span>Reconciliation Check:</span>
                        {delta === 0 ? (
                          <span className="text-emerald-600 font-bold">100% Balanced</span>
                        ) : (
                          <span className="text-red-500 font-bold">Discrepancy: {delta} units</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Net Output Projection Formula Card */}
              {reconcileKit && (
                <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                  <div className="font-semibold text-emerald-900 dark:text-emerald-200 flex justify-between">
                    <span>Accountability & Net Production Calculation:</span>
                    <span className="font-bold">
                      Expected Output: {reconcileKit.plannedBatchQty.toLocaleString()} units
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>Max Defective / Scrapped Sub-items:</span>
                    <span className="text-red-500 font-bold">
                      {Math.max(...Object.values(consumptionInputs).map((ci) => ci.wastage || 0), 0)} defective parts
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-800 dark:text-slate-200 flex items-center justify-between pt-1 border-t border-emerald-200 dark:border-emerald-800">
                    <span className="font-bold">Net Finished Goods Created:</span>
                    <span className="text-emerald-700 dark:text-emerald-300 font-extrabold text-sm">
                      {Math.max(
                        0,
                        reconcileKit.plannedBatchQty -
                          Math.max(...Object.values(consumptionInputs).map((ci) => ci.wastage || 0), 0)
                      ).toLocaleString()}{' '}
                      units
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Rule: {reconcileKit.plannedBatchQty} expected &minus;{' '}
                    {Math.max(...Object.values(consumptionInputs).map((ci) => ci.wastage || 0), 0)} defects =&gt;{' '}
                    {Math.max(
                      0,
                      reconcileKit.plannedBatchQty -
                        Math.max(...Object.values(consumptionInputs).map((ci) => ci.wastage || 0), 0)
                    )}{' '}
                    finished items
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1">
                  Supervisor Sign-Off / Adjustment Justification
                </label>
                <textarea
                  rows={2}
                  value={supervisorNotes}
                  onChange={(e) => setSupervisorNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs"
                  placeholder="Enter remarks explaining returns or scrap approvals..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setReconcileKit(null)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Reconcile & Close Kit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitsPage;
