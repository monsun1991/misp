import React, { useState, useMemo } from 'react';
import {
  PackageCheck,
  Search,
  Filter,
  PlusCircle,
  ArrowUpDown,
  History,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building,
  Truck,
  ShieldCheck,
  Layers,
  ChevronRight,
  TrendingUp,
  Tag,
  DollarSign,
  Calendar,
  AlertOctagon,
  FileText
} from 'lucide-react';
import {
  useMipsStore,
  FinishedGoodItem,
  FinishedGoodsLedgerEntry,
  isPlantMatch
} from '@/store/useMipsStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export const FinishedGoodsPage: React.FC = () => {
  const {
    finishedGoods: rawFinishedGoods,
    finishedGoodsLedger: rawLedger,
    products,
    materials: rawMaterials,
    selectedPlant,
    inwardToFinishedGoods,
    adjustFinishedGoodsStock,
    updateFinishedGoodStatus
  } = useMipsStore();

  const finishedGoods = (rawFinishedGoods || []).filter((fg) => isPlantMatch(fg.plant, selectedPlant));
  const ledger = (rawLedger || []).filter((l) => isPlantMatch(l.plant, selectedPlant));

  // Dynamic warehouses collected from finished goods, raw materials, and standard zones
  const dynamicWarehouses = useMemo(() => {
    const set = new Set<string>();
    // Default finished goods warehouses
    set.add('Finished Goods Packaging Store');
    set.add('Heavy Luminaire Buffer');
    set.add('Dispatch Dock Staging Store');
    // Extract from finished goods
    finishedGoods.forEach((fg) => {
      if (fg.warehouse) set.add(fg.warehouse);
    });
    // Extract from raw materials in active plant
    (rawMaterials || []).filter((m) => isPlantMatch(m.plant, selectedPlant)).forEach((m) => {
      if (m.warehouse) set.add(m.warehouse);
    });
    return Array.from(set).filter(Boolean);
  }, [finishedGoods, rawMaterials, selectedPlant]);

  const [activeTab, setActiveTab] = useState<'inventory' | 'ledger'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [warehouseFilter, setWarehouseFilter] = useState('All');

  // Modals
  const [showInwardModal, setShowInwardModal] = useState(false);
  const [showAdjModal, setShowAdjModal] = useState(false);
  const [selectedFgId, setSelectedFgId] = useState<string>('');
  const [selectedTraceItem, setSelectedTraceItem] = useState<FinishedGoodItem | null>(null);

  // Inward Form State
  const [inwardProductId, setInwardProductId] = useState<string>(products[0]?.id || '');
  const [inwardBatchNo, setInwardBatchNo] = useState<string>(`LOT-FG-MANUAL-${Math.floor(100 + Math.random() * 900)}`);
  const [inwardQty, setInwardQty] = useState<number>(500);
  const [inwardWarehouse, setInwardWarehouse] = useState<string>('Finished Goods Packaging Store');
  const [isCustomWarehouse, setIsCustomWarehouse] = useState(false);
  const [customWarehouseName, setCustomWarehouseName] = useState('');
  const [inwardStatus, setInwardStatus] = useState<FinishedGoodItem['status']>('Ready for Dispatch');
  const [inwardNotes, setInwardNotes] = useState<string>('Manual packaging inward verified by QA');

  // Adjustment Form State
  const [adjDelta, setAdjDelta] = useState<number>(0);
  const [adjReason, setAdjReason] = useState<string>('');
  const [adjUser, setAdjUser] = useState<string>('Store & FGS Incharge');

  // Calculation of KPIs
  const totalUnits = finishedGoods.reduce((sum, item) => sum + item.quantityOnHand, 0);
  const totalValuation = finishedGoods.reduce((sum, item) => sum + item.quantityOnHand * (item.sellingPrice || item.standardCost * 1.35), 0);
  const readyUnits = finishedGoods.filter((i) => i.status === 'Ready for Dispatch').reduce((sum, i) => sum + i.availableQty, 0);
  const allocatedUnits = finishedGoods.reduce((sum, item) => sum + (item.allocatedQty || 0), 0);
  const quarantinedUnits = finishedGoods.filter((i) => i.status === 'Quarantine' || i.status === 'Under QC').reduce((sum, i) => sum + i.quantityOnHand, 0);

  // Filtered List
  const filteredItems = finishedGoods.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      item.productName.toLowerCase().includes(q) ||
      item.productCode.toLowerCase().includes(q) ||
      item.batchLotNumber.toLowerCase().includes(q) ||
      (item.kitNumber && item.kitNumber.toLowerCase().includes(q));

    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesWarehouse = warehouseFilter === 'All' || item.warehouse === warehouseFilter;

    return matchesSearch && matchesCat && matchesStatus && matchesWarehouse;
  });

  const getAgingBadge = (prodDateStr: string) => {
    try {
      const prodDate = new Date(prodDateStr);
      const now = new Date();
      const diffDays = Math.max(0, Math.floor((now.getTime() - prodDate.getTime()) / (1000 * 3600 * 24)));

      if (diffDays <= 7) {
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px]">{diffDays}d Fresh</Badge>;
      } else if (diffDays <= 21) {
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 text-[10px]">{diffDays}d Normal</Badge>;
      } else {
        return <Badge className="bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 text-[10px] flex items-center gap-1 font-semibold">⚠️ {diffDays}d Aging</Badge>;
      }
    } catch {
      return <Badge variant="outline" className="text-[10px]">Recent</Badge>;
    }
  };

  const getStatusBadge = (status: FinishedGoodItem['status']) => {
    switch (status) {
      case 'Ready for Dispatch':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold">Ready to Ship</Badge>;
      case 'Under QC':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300">Under QC</Badge>;
      case 'Quarantine':
        return <Badge className="bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 font-bold">⛔ Quarantine</Badge>;
      case 'Depleted':
        return <Badge className="bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400">Depleted (0)</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleInwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === inwardProductId);
    if (!product || inwardQty <= 0) return;

    const targetWarehouse = isCustomWarehouse
      ? (customWarehouseName.trim() || 'Finished Goods Packaging Store')
      : (inwardWarehouse || dynamicWarehouses[0] || 'Finished Goods Packaging Store');

    inwardToFinishedGoods(
      {
        productId: product.id,
        productCode: product.code,
        productName: product.name,
        category: product.category,
        wattage: product.wattage,
        batchLotNumber: inwardBatchNo,
        plant: selectedPlant.startsWith('All') ? 'Plant 1 - Pune Hub' : selectedPlant,
        warehouse: targetWarehouse,
        quantityOnHand: inwardQty,
        allocatedQty: 0,
        rejectionsQty: 0,
        productionDate: new Date().toLocaleDateString('en-CA'),
        standardCost: product.standardCost,
        sellingPrice: Number((product.standardCost * 1.35).toFixed(2)),
        status: inwardStatus,
        notes: inwardNotes
      },
      'FGS Store Incharge'
    );

    setShowInwardModal(false);
    setIsCustomWarehouse(false);
    setCustomWarehouseName('');
  };

  const handleAdjSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFgId || adjDelta === 0) return;

    adjustFinishedGoodsStock(selectedFgId, adjDelta, adjReason || 'Manual physical audit adjustment', adjUser);
    setShowAdjModal(false);
    setAdjDelta(0);
    setAdjReason('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <PackageCheck className="w-6 h-6 text-[#146b68] dark:text-[#84cc16]" />
              Finished Goods Store (FGS)
            </h1>
            <Badge variant="outline" className="bg-[#183638]/10 text-[#146b68] dark:text-[#d4e967] border-[#146b68]/30 text-[11px] font-semibold">
              {selectedPlant}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete inventory of assembled LED luminaires received from assembly kits, QA inspection staging, and customer dispatch reserves.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => {
              setInwardProductId(products[0]?.id || '');
              setInwardBatchNo(`LOT-FG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
              setShowInwardModal(true);
            }}
            className="text-xs bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            + Inward Finished Goods
          </Button>

          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'inventory'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              FGS Inventory ({finishedGoods.length})
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'ledger'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              FGS Movement Ledger ({ledger.length})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500">Total FGS Stock</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {totalUnits.toLocaleString()} <span className="text-xs font-normal text-slate-500">units</span>
              </h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                ₹{totalValuation.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Valuation
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[#146b68] dark:text-[#84cc16] flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500">Ready to Ship</p>
              <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                {readyUnits.toLocaleString()} <span className="text-xs font-normal text-slate-500">units</span>
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">100% Passed Burn-In & QA</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500">Reserved for Buyer POs</p>
              <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mt-0.5">
                {allocatedUnits.toLocaleString()} <span className="text-xs font-normal text-slate-500">units</span>
              </h3>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1">Committed to Pending Dispatches</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500">Under QA / Quarantine</p>
              <h3 className="text-xl font-bold text-rose-700 dark:text-rose-400 mt-0.5">
                {quarantinedUnits.toLocaleString()} <span className="text-xs font-normal text-slate-500">units</span>
              </h3>
              <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1">Hi-Pot / Retest Pending</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {activeTab === 'inventory' ? (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <Input
                  placeholder="Search finished SKU, product name, or Lot #..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-8 text-xs bg-slate-50 dark:bg-slate-900 border rounded-lg px-2 text-slate-700 dark:text-slate-300"
                >
                  <option value="All">All Categories</option>
                  <option value="LED Bulbs">LED Bulbs</option>
                  <option value="Battens">Battens</option>
                  <option value="Downlights">Downlights</option>
                  <option value="Floodlights">Floodlights</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-8 text-xs bg-slate-50 dark:bg-slate-900 border rounded-lg px-2 text-slate-700 dark:text-slate-300"
                >
                  <option value="All">All QA Statuses</option>
                  <option value="Ready for Dispatch">Ready for Dispatch</option>
                  <option value="Under QC">Under QC</option>
                  <option value="Quarantine">Quarantine</option>
                  <option value="Depleted">Depleted</option>
                </select>

                <select
                  value={warehouseFilter}
                  onChange={(e) => setWarehouseFilter(e.target.value)}
                  className="h-8 text-xs bg-slate-50 dark:bg-slate-900 border rounded-lg px-2 text-slate-700 dark:text-slate-300"
                >
                  <option value="All">All Warehouses ({dynamicWarehouses.length})</option>
                  {dynamicWarehouses.map((wh) => (
                    <option key={wh} value={wh}>
                      {wh}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">Product SKU & Description</th>
                    <th className="py-2.5 px-3">Batch / Lot # & Origin</th>
                    <th className="py-2.5 px-3">Warehouse Zone</th>
                    <th className="py-2.5 px-3 text-right">On Hand</th>
                    <th className="py-2.5 px-3 text-right">Allocated</th>
                    <th className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-bold">Available to Ship</th>
                    <th className="py-2.5 px-3">Mfg Date & Aging</th>
                    <th className="py-2.5 px-3">QA Status</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-500">
                        No finished goods match your search filters in {selectedPlant}.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {item.productName}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[11px] text-slate-500">{item.productCode}</span>
                            {item.wattage && (
                              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded font-medium">
                                {item.wattage}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">({item.category})</span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-mono font-medium text-slate-800 dark:text-slate-200">
                            {item.batchLotNumber}
                          </div>
                          {item.kitNumber ? (
                            <div className="text-[10px] text-[#146b68] dark:text-[#84cc16] font-semibold mt-0.5 flex items-center gap-1">
                              <span>🧰 Assembled from {item.kitNumber}</span>
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-400 mt-0.5">Direct FGS Inward</div>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <div className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                            {item.warehouse}
                          </div>
                          <div className="text-[10px] text-slate-400">{item.plant}</div>
                        </td>

                        <td className="py-3 px-3 text-right font-medium text-slate-900 dark:text-slate-100">
                          {item.quantityOnHand.toLocaleString()}
                        </td>

                        <td className="py-3 px-3 text-right">
                          {item.allocatedQty > 0 ? (
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">
                              {item.allocatedQty.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right">
                          <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400">
                            {item.availableQty.toLocaleString()}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="text-[11px] text-slate-700 dark:text-slate-300">
                            {item.productionDate}
                          </div>
                          <div className="mt-0.5">{getAgingBadge(item.productionDate)}</div>
                        </td>

                        <td className="py-3 px-3">
                          <select
                            value={item.status}
                            onChange={(e) =>
                              updateFinishedGoodStatus(
                                item.id,
                                e.target.value as FinishedGoodItem['status'],
                                'Updated from FGS stock dashboard'
                              )
                            }
                            className="text-[11px] font-semibold rounded px-1.5 py-1 border bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 cursor-pointer"
                          >
                            <option value="Ready for Dispatch">Ready to Ship</option>
                            <option value="Under QC">Under QC</option>
                            <option value="Quarantine">Quarantine</option>
                            <option value="Depleted">Depleted</option>
                          </select>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedFgId(item.id);
                                setAdjDelta(0);
                                setAdjReason('');
                                setShowAdjModal(true);
                              }}
                              className="h-7 px-2 text-[11px] text-[#146b68] dark:text-[#84cc16] hover:bg-[#146b68]/10"
                              title="Stock Adjustment"
                            >
                              <ArrowUpDown className="w-3.5 h-3.5 mr-1" />
                              Adjust
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedTraceItem(item)}
                              className="h-7 px-2 text-[11px] text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                              title="View Traceability Details"
                            >
                              <FileText className="w-3.5 h-3.5 mr-1" />
                              Trace
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Ledger View */
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <History className="w-4 h-4 text-[#146b68] dark:text-[#84cc16]" />
              Finished Goods Movement Ledger (Audit Trail)
            </CardTitle>
            <CardDescription className="text-xs">
              Every production inward from completed assembly kits and outward deduction for customer dispatches.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Product Name & Code</th>
                    <th className="py-2.5 px-3">Movement Type</th>
                    <th className="py-2.5 px-3">Ref Document</th>
                    <th className="py-2.5 px-3">Batch Lot #</th>
                    <th className="py-2.5 px-3 text-right">In (+)</th>
                    <th className="py-2.5 px-3 text-right">Out (-)</th>
                    <th className="py-2.5 px-3 text-right">Balance</th>
                    <th className="py-2.5 px-3">Logged By & Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ledger.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-500">
                        No finished goods transactions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    ledger.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{entry.date}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">
                          {entry.productName}
                          <span className="block font-mono text-[10px] text-slate-400">{entry.productCode}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          {entry.transactionType === 'Production Inward' && (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300">
                              Production Inward (+)
                            </Badge>
                          )}
                          {entry.transactionType === 'Customer Dispatch' && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300">
                              Customer Dispatch (-)
                            </Badge>
                          )}
                          {entry.transactionType === 'Manual Inward' && (
                            <Badge className="bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/40 dark:text-teal-300">
                              Manual Inward (+)
                            </Badge>
                          )}
                          {entry.transactionType === 'Stock Adjustment' && (
                            <Badge className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300">
                              Stock Adjustment
                            </Badge>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                          {entry.referenceNo}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{entry.batchLotNumber}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-emerald-700 dark:text-emerald-400">
                          {entry.inQty > 0 ? `+${entry.inQty.toLocaleString()}` : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-rose-700 dark:text-rose-400">
                          {entry.outQty > 0 ? `-${entry.outQty.toLocaleString()}` : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                          {entry.balanceQty.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{entry.user}:</span> {entry.notes}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Inward Modal */}
      {showInwardModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#84cc16]" />
                Inward Finished Goods to Store
              </h3>
              <button
                onClick={() => setShowInwardModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInwardSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Select Finished Product *
                </label>
                <select
                  value={inwardProductId}
                  onChange={(e) => setInwardProductId(e.target.value)}
                  className="w-full h-9 bg-slate-50 dark:bg-slate-800 border rounded-lg px-2 text-slate-900 dark:text-slate-100"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code}) - {p.wattage}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Batch / Lot Number *
                  </label>
                  <Input
                    value={inwardBatchNo}
                    onChange={(e) => setInwardBatchNo(e.target.value)}
                    required
                    className="h-9 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Quantity Inward (Units) *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={inwardQty}
                    onChange={(e) => setInwardQty(Number(e.target.value))}
                    required
                    className="h-9 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Target Warehouse *
                  </label>
                  <select
                    value={isCustomWarehouse ? '__custom__' : inwardWarehouse}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomWarehouse(true);
                      } else {
                        setIsCustomWarehouse(false);
                        setInwardWarehouse(e.target.value);
                      }
                    }}
                    className="w-full h-9 bg-slate-50 dark:bg-slate-800 border rounded-lg px-2 text-slate-900 dark:text-slate-100"
                  >
                    {dynamicWarehouses.map((wh) => (
                      <option key={wh} value={wh}>
                        {wh}
                      </option>
                    ))}
                    <option value="__custom__" className="font-semibold text-[#146b68] dark:text-[#84cc16]">
                      + Others (Enter New Warehouse / Bay)
                    </option>
                  </select>
                  {isCustomWarehouse && (
                    <div className="mt-2 space-y-1">
                      <Input
                        placeholder="Type new warehouse or staging bay name..."
                        value={customWarehouseName}
                        onChange={(e) => setCustomWarehouseName(e.target.value)}
                        required
                        autoFocus
                        className="h-8 text-xs font-semibold border-[#84cc16] focus:ring-[#84cc16]"
                      />
                      <p className="text-[10px] text-slate-500">
                        This location will dynamically register into your plant's storage list.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    QA Status
                  </label>
                  <select
                    value={inwardStatus}
                    onChange={(e) => setInwardStatus(e.target.value as FinishedGoodItem['status'])}
                    className="w-full h-9 bg-slate-50 dark:bg-slate-800 border rounded-lg px-2"
                  >
                    <option value="Ready for Dispatch">Ready for Dispatch</option>
                    <option value="Under QC">Under QC</option>
                    <option value="Quarantine">Quarantine</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Inspection Notes & Traceability Details
                </label>
                <Input
                  value={inwardNotes}
                  onChange={(e) => setInwardNotes(e.target.value)}
                  placeholder="e.g. Burn-in tested, packed in master carton of 50"
                  className="h-9"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInwardModal(false)}
                  className="h-9 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 text-xs bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold"
                >
                  Confirm Inward to Store
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showAdjModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ArrowUpDown className="w-5 h-5 text-[#146b68] dark:text-[#84cc16]" />
                Adjust Finished Goods Stock
              </h3>
              <button
                onClick={() => setShowAdjModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Adjustment Delta Quantity (+/-) *
                </label>
                <Input
                  type="number"
                  value={adjDelta}
                  onChange={(e) => setAdjDelta(Number(e.target.value))}
                  placeholder="Enter positive to add, negative to deduct (e.g. -10 or +50)"
                  required
                  className="h-9 font-bold"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Positive value increases stock; negative value writes off or deducts.
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Reason for Adjustment *
                </label>
                <Input
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  placeholder="e.g. Box damaged in staging rack, re-packed into new carton"
                  required
                  className="h-9"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Authorized Person *
                </label>
                <Input
                  value={adjUser}
                  onChange={(e) => setAdjUser(e.target.value)}
                  required
                  className="h-9"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdjModal(false)}
                  className="h-9 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 text-xs bg-[#146b68] hover:bg-[#105653] text-white font-bold"
                >
                  Apply Stock Adjustment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lot Traceability Modal */}
      {selectedTraceItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#84cc16]" />
                Batch & Production Traceability
              </h3>
              <button
                onClick={() => setSelectedTraceItem(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Product Name:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{selectedTraceItem.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SKU Code:</span>
                  <span className="font-mono font-medium">{selectedTraceItem.productCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Batch / Lot #:</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {selectedTraceItem.batchLotNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Origin Assembly Kit:</span>
                  <span className="font-medium text-[#146b68] dark:text-[#84cc16]">
                    {selectedTraceItem.kitNumber || 'N/A (Direct Inward)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Manufacturing Plant:</span>
                  <span>{selectedTraceItem.plant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Production Date:</span>
                  <span>{selectedTraceItem.productionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Balance:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {selectedTraceItem.quantityOnHand} units ({selectedTraceItem.availableQty} available)
                  </span>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Supervisor & QA Notes:</p>
                <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300 italic">
                  {selectedTraceItem.notes || 'No special notes recorded.'}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTraceItem(null)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinishedGoodsPage;

