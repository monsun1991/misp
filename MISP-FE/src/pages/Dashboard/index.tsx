import React, { useState } from 'react';
import {
  Boxes,
  Truck,
  Factory,
  AlertTriangle,
  TrendingUp,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Calendar,
  Warehouse,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  PackageCheck,
  UserCheck,
  MapPin
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { useMipsStore, isPlantMatch } from '@/store/useMipsStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const {
    materials: rawMaterials,
    products,
    stockLedger: rawStockLedger,
    purchaseOrders: rawPurchaseOrders,
    kits: rawKits,
    productionLogs: rawProductionLogs,
    auditLogs,
    selectedPlant
  } = useMipsStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'forecast' | 'kits'>('overview');

  // Filter all datasets dynamically by active plant location context
  const materials = rawMaterials.filter((m) => isPlantMatch(m.plant, selectedPlant));
  const stockLedger = rawStockLedger.filter((s) => isPlantMatch(s.plant, selectedPlant));
  const purchaseOrders = rawPurchaseOrders.filter((po) => isPlantMatch(po.plant, selectedPlant));
  const kits = rawKits.filter((k) => isPlantMatch(k.plant, selectedPlant));
  const productionLogs = rawProductionLogs.filter((p) => isPlantMatch(p.plant, selectedPlant));

  // Key Inventory Metrics
  const totalStockUnits = materials.reduce((acc, m) => acc + m.currentStock, 0);
  const totalStockValuation = materials.reduce((acc, m) => acc + (m.currentStock * m.standardCost), 0);
  const lowStockMaterials = materials.filter((m) => m.currentStock <= m.reorderLevel);
  const criticalShortages = materials.filter((m) => m.currentStock <= m.safetyStock);
  const excessStockMaterials = materials.filter((m) => m.currentStock > m.maxStock * 0.9);
  const totalWithEmployees = materials.reduce((acc, m) => acc + m.stockWithEmployees, 0);

  // Procurement Metrics
  const openPOs = purchaseOrders.filter((po) => po.status === 'Ordered' || po.status === 'In Transit');
  const inTransitPOs = purchaseOrders.filter((po) => po.status === 'In Transit');
  const delayedPOs = purchaseOrders.filter((po) => po.status === 'Delayed');
  const pendingReceiptUnits = openPOs.reduce((acc, po) => acc + po.pendingQty, 0);

  // Production Metrics
  const todayProduction = productionLogs.slice(0, 5);
  const todayTarget = todayProduction.reduce((acc, log) => acc + log.targetQty, 0);
  const todayActual = todayProduction.reduce((acc, log) => acc + log.actualQty, 0);
  const todayRejects = todayProduction.reduce((acc, log) => acc + log.rejectedQty, 0);
  const overallProductivity = todayTarget > 0 ? Math.round((todayActual / todayTarget) * 100) : 100;

  // Kit Metrics
  const openKits = kits.filter((k) => k.status === 'Issued' || k.status === 'In Production');
  const kitsPendingClosure = kits.filter((k) => k.status === 'In Production' || k.status === 'Issued');

  // Chart Data: Production Target vs Actual
  const productionChartData = productionLogs.map((log) => ({
    name: `${log.operator.split(' ')[0]} (${log.shift.includes('A') ? 'Shift A' : 'Shift B'})`,
    target: log.targetQty,
    actual: log.actualQty,
    rejected: log.rejectedQty,
  }));

  // 4-Month Forecast Preview
  const forecastPreview = materials.slice(0, 4).map((mat) => {
    const monthlyDemand = 2500; // estimated avg monthly run
    const incomingPO = openPOs
      .filter((p) => p.materialId === mat.id)
      .reduce((acc, p) => acc + p.pendingQty, 0);

    const m1 = mat.currentStock + incomingPO - monthlyDemand;
    const m2 = m1 - monthlyDemand;
    const m3 = m2 - monthlyDemand;
    const m4 = m3 - monthlyDemand;

    const getStatus = (balance: number) => {
      if (balance < mat.safetyStock) return { label: 'Shortage', color: 'bg-red-500/10 text-red-600 border-red-500/20' };
      if (balance > mat.maxStock) return { label: 'Excess', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' };
      return { label: 'Healthy', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
    };

    return {
      material: mat.name,
      code: mat.code,
      current: mat.currentStock,
      m1Status: getStatus(m1),
      m2Status: getStatus(m2),
      m3Status: getStatus(m3),
      m4Status: getStatus(m4),
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar: Styled after MIPS BRD Cover Page Architecture */}
      <div className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#183638] text-white p-6 md:p-8 rounded-2xl shadow-xl border border-[#146b68]/40">
        {/* Subtle decorative concentric orbits matching MIPS-BRD.pdf cover geometry */}
        <div className="pointer-events-none absolute -top-28 -right-28 w-96 h-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 rounded-full border border-[#d4e967]/20" />
        <div className="pointer-events-none absolute top-4 right-4 w-32 h-32 rounded-full border border-[#84cc16]/15" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#d4e967]/15 text-[#d4e967] border border-[#d4e967]/30 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              LED Operations
            </span>
            <span className="bg-[#146b68] text-white border border-[#146b68] text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <MapPin className="w-3 h-3 text-[#d4e967]" />
              {selectedPlant}
            </span>
            <span className="text-xs text-[#a9c2bb]">Phase 1 Real-time MIPS Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2 text-white">
            Manufacturing Operations Command Center
          </h1>
          <p className="text-sm text-[#c6d9d4] mt-1.5 leading-relaxed">
            Real-time material visibility, procurement pipeline, shop floor kits & 4-month forecasting.
          </p>
        </div>

        {/* Quick Action Navigation */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <Link to="/inventory">
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs backdrop-blur-sm">
              <Boxes className="w-3.5 h-3.5 mr-1.5 text-[#d4e967]" />
              Stock Ledger
            </Button>
          </Link>
          <Link to="/procurement">
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs backdrop-blur-sm">
              <Truck className="w-3.5 h-3.5 mr-1.5 text-[#d4e967]" />
              Procurement & GRN
            </Button>
          </Link>
          <Link to="/kits">
            <Button className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-lg shadow-[#84cc16]/25 border border-[#84cc16]">
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              Issue Kit
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row 1: Stock, Value, Procurement, Production */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stock */}
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Raw Stock
            </CardTitle>
            <div className="p-2 rounded-lg bg-[#146b68]/10 text-[#146b68] dark:text-[#84cc16]">
              <Boxes className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {totalStockUnits.toLocaleString()} <span className="text-xs font-normal text-slate-500">units</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Valuation: ₹{(totalStockValuation / 100000).toFixed(2)} Lakh</span>
              <span className="text-[#146b68] dark:text-[#84cc16] font-semibold">{materials.length} Materials</span>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Shortage Alerts
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {lowStockMaterials.length}{' '}
              <span className="text-xs font-normal text-amber-600">below reorder</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span className="text-red-500 font-medium">{criticalShortages.length} critical</span>
              <Link to="/forecast" className="text-[#146b68] dark:text-[#84cc16] font-medium hover:underline">
                View Forecast &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* In-Transit Procurement */}
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Procurement & Transit
            </CardTitle>
            <div className="p-2 rounded-lg bg-[#183638]/10 text-[#183638] dark:text-[#d4e967]">
              <Truck className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {inTransitPOs.length}{' '}
              <span className="text-xs font-normal text-[#146b68] dark:text-[#84cc16]">shipments in transit</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>{pendingReceiptUnits.toLocaleString()} units inbound</span>
              <Link to="/procurement" className="text-[#146b68] dark:text-[#84cc16] font-medium hover:underline">
                GRN Entry &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Kits & Employee Material */}
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Kits on Floor
            </CardTitle>
            <div className="p-2 rounded-lg bg-[#84cc16]/15 text-[#146b68] dark:text-[#84cc16]">
              <Layers className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {openKits.length}{' '}
              <span className="text-xs font-normal text-[#146b68] dark:text-[#84cc16]">open production kits</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>{totalWithEmployees} units with employees</span>
              <Link to="/kits" className="text-[#146b68] dark:text-[#84cc16] font-medium hover:underline">
                Reconciliation &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Production Output Trends & 4-Month Forecast Horizon */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Production Output & Target vs Actual */}
        <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Production Floor Output vs Expected</CardTitle>
              <CardDescription>Daily shifts, operator yields and QA rejections</CardDescription>
            </div>
            <Badge variant="outline" className="bg-[#146b68]/10 text-[#146b68] dark:text-[#84cc16] border-[#146b68]/30 font-semibold">
              Efficiency: {overallProductivity}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Bar dataKey="target" name="Expected Output (Units)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" name="Actual Produced (Units)" fill="#84CC16" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rejected" name="QA Rejections" fill="#ED795D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick summary below chart */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2 text-center">
              <div>
                <div className="text-xs text-slate-500">Expected Planned</div>
                <div className="text-lg font-bold text-slate-800 dark:text-slate-200">{todayTarget} units</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Actual Produced</div>
                <div className="text-lg font-bold text-[#146b68] dark:text-[#84cc16]">{todayActual} units</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Rejection Rate</div>
                <div className="text-lg font-bold text-[#ed795d]">
                  {todayActual > 0 ? ((todayRejects / todayActual) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column (1 Col): Urgent Operational Alerts */}
        <Card className="border border-slate-200 dark:border-slate-800 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Operational Alerts</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {criticalShortages.length + inTransitPOs.length + openKits.length} Pending
              </Badge>
            </div>
            <CardDescription>Actions requiring management or supervisor sign-off</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 flex-1 overflow-y-auto max-h-80">
            {/* Critical Low Stock Alert */}
            {criticalShortages.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40"
              >
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-red-900 dark:text-red-200">
                    Critical Stock Shortage: {item.name}
                  </div>
                  <div className="text-red-700 dark:text-red-400 mt-0.5">
                    Available: <span className="font-bold">{item.currentStock} {item.uom}</span> (Safety Stock: {item.safetyStock})
                  </div>
                  <Link to="/forecast" className="text-blue-600 hover:underline font-medium inline-block mt-1">
                    Raise Purchase Requisition &rarr;
                  </Link>
                </div>
              </div>
            ))}

            {/* In-Transit Alert */}
            {inTransitPOs.map((po) => (
              <div
                key={po.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40"
              >
                <Truck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-blue-900 dark:text-blue-200">
                    Inbound Delivery: {po.poNumber}
                  </div>
                  <div className="text-blue-700 dark:text-blue-400 mt-0.5">
                    {po.materialName} ({po.pendingQty} units) via {po.transporter}
                  </div>
                  <Link to="/procurement" className="text-blue-600 hover:underline font-medium inline-block mt-1">
                    Prepare GRN Receipt &rarr;
                  </Link>
                </div>
              </div>
            ))}

            {/* Kit Closure Alert */}
            {openKits.map((kit) => (
              <div
                key={kit.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40"
              >
                <Layers className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-emerald-900 dark:text-emerald-200">
                    Kit In Production: {kit.kitNumber}
                  </div>
                  <div className="text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Assigned to {kit.assignedEmployee} ({kit.plannedBatchQty} units {kit.productName})
                  </div>
                  <Link to="/kits" className="text-emerald-700 hover:underline font-medium inline-block mt-1">
                    Review Material Consumption &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: 4-Month Forecast Horizon Snapshot (BRD Section 06 & 10) */}
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Four-Month Stock Planning Horizon (Rule-Based)</CardTitle>
            <CardDescription>
              Forward-looking material position (Months 1–4) calculated from BOM requirements and incoming POs
            </CardDescription>
          </div>
          <Link to="/forecast">
            <Button variant="outline" size="sm" className="text-xs">
              Open Full Forecast & Purchase Planner &rarr;
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Material Component</th>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Current Stock</th>
                  <th className="py-2.5 px-3 text-center">Month 1</th>
                  <th className="py-2.5 px-3 text-center">Month 2</th>
                  <th className="py-2.5 px-3 text-center">Month 3</th>
                  <th className="py-2.5 px-3 text-center">Month 4</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {forecastPreview.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">{item.material}</td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{item.code}</td>
                    <td className="py-3 px-3 font-semibold">{item.current.toLocaleString()} units</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${item.m1Status.color}`}>
                        {item.m1Status.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${item.m2Status.color}`}>
                        {item.m2Status.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${item.m3Status.color}`}>
                        {item.m3Status.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${item.m4Status.color}`}>
                        {item.m4Status.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link to="/forecast">
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600 hover:text-blue-700">
                          Reorder &rarr;
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Row 4: Recent Stock Ledger Transactions & Active Workforce */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Ledger Snapshot */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Live Stock Ledger Activity</CardTitle>
              <CardDescription>Real-time physical ledger movements</CardDescription>
            </div>
            <Link to="/inventory">
              <Button variant="link" size="sm" className="text-xs text-blue-600">
                View All Ledger &rarr;
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {stockLedger.slice(0, 4).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{entry.materialName}</div>
                  <div className="text-[11px] text-slate-500">
                    {entry.transactionType} &bull; Ref: <span className="font-mono">{entry.referenceNo}</span> &bull; {entry.date}
                  </div>
                </div>
                <div className="text-right">
                  {entry.inQty > 0 && <span className="font-bold text-emerald-600">+{entry.inQty} In</span>}
                  {entry.outQty > 0 && <span className="font-bold text-red-500">-{entry.outQty} Out</span>}
                  <div className="text-[10px] text-slate-500">Bal: {entry.balanceQty}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Kit Accountability & Employee Held Stock */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Employee Material Accountability</CardTitle>
              <CardDescription>Material issued for production jobs currently held by staff</CardDescription>
            </div>
            <Link to="/kits">
              <Button variant="link" size="sm" className="text-xs text-blue-600">
                View All Kits &rarr;
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 flex items-center justify-center font-bold">
                  RK
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Ravi Kumar (Line 1)</div>
                  <div className="text-[11px] text-slate-500">KIT-2026-1001 &bull; 100 units 12W LED</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-amber-600">22 units pending return</span>
                <div className="text-[10px] text-slate-400">Reconciliation Pending</div>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 flex items-center justify-center font-bold">
                  AS
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Amit Sharma (Line 1)</div>
                  <div className="text-[11px] text-slate-500">KIT-2026-1002 &bull; 150 units 12W LED</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-amber-600">13 units pending return</span>
                <div className="text-[10px] text-slate-400">In Assembly</div>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 flex items-center justify-center font-bold">
                  PV
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Priya Verma (Line 2)</div>
                  <div className="text-[11px] text-slate-500">KIT-2026-0988 &bull; 200 units 9W LED</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-emerald-600">Reconciled & Closed</span>
                <div className="text-[10px] text-slate-400">0 Material Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

