import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShoppingCart,
  ShieldAlert,
  Info,
  Sliders,
  Sparkles,
  Search,
  Filter,
  X
} from 'lucide-react';
import { useMipsStore, isPlantMatch } from '@/store/useMipsStore';
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

export const ForecastPage: React.FC = () => {
  const {
    materials: rawMaterials,
    purchaseOrders: rawPurchaseOrders,
    products: rawProducts,
    selectedPlant,
    createPurchaseOrder
  } = useMipsStore();

  const materials = rawMaterials.filter((m) => isPlantMatch(m.plant, selectedPlant));
  const purchaseOrders = rawPurchaseOrders.filter((po) => isPlantMatch(po.plant, selectedPlant));
  const products = rawProducts;

  // Monthly planned production assumption (can be adjusted by user)
  const [monthlyPlannedUnits, setMonthlyPlannedUnits] = useState<number>(3000);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [wattageFilter, setWattageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Extract dynamic categories from materials
  const categories = useMemo(() => {
    const set = new Set<string>();
    materials.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return ['All', ...Array.from(set)];
  }, [materials]);

  // Wattage component mapping: material IDs that belong to products with the selected wattage
  const wattageMaterialIds = useMemo(() => {
    if (wattageFilter === 'All') return null;
    const matchingProds = products.filter((p) => p.wattage === wattageFilter);
    const ids = new Set<string>();
    matchingProds.forEach((prod) => {
      prod.bom.forEach((b) => {
        ids.add(b.materialId);
        if (b.materialCode) ids.add(b.materialCode);
      });
    });
    return ids;
  }, [products, wattageFilter]);

  // Compute forecast for each material over 4 months
  const forecastData = useMemo(() => {
    return materials.map((mat) => {
      // Determine BOM usage multiplier based on category
      let unitsPerBulb = 1;
      if (mat.code.includes('SCR')) unitsPerBulb = 2;

      const monthlyRequirement = monthlyPlannedUnits * unitsPerBulb;

      // Incoming stock from open purchase orders (optionally scoped by delivery date range)
      const incomingStock = purchaseOrders
        .filter((p) => {
          if (p.materialId !== mat.id) return false;
          if (p.status !== 'Ordered' && p.status !== 'In Transit') return false;
          const delivDate = p.expectedDeliveryDate ? p.expectedDeliveryDate.split('T')[0] : '';
          if (startDate && delivDate && delivDate < startDate) return false;
          if (endDate && delivDate && delivDate > endDate) return false;
          return true;
        })
        .reduce((acc, p) => acc + p.pendingQty, 0);

      // Projected availability formula: current stock + expected incoming stock
      const projectedAvailability = mat.currentStock + incomingStock;

      // 4 Month projected balances
      const m1Projected = projectedAvailability - monthlyRequirement;
      const m2Projected = m1Projected - monthlyRequirement;
      const m3Projected = m2Projected - monthlyRequirement;
      const m4Projected = m3Projected - monthlyRequirement;

      // 4 Month total requirement
      const total4MonthRequirement = monthlyRequirement * 4;

      // BRD Formula: Future requirement + safety stock - current stock - expected incoming stock
      const netDeficit = (total4MonthRequirement + mat.safetyStock) - projectedAvailability;
      const recommendedPurchaseQty = Math.max(0, netDeficit);

      const getStatus = (balance: number) => {
        if (balance < mat.safetyStock) {
          return { label: 'Shortage', color: 'bg-red-50 text-red-700 border-red-200' };
        }
        if (balance > mat.maxStock) {
          return { label: 'Excess', color: 'bg-amber-50 text-amber-700 border-amber-200' };
        }
        return { label: 'Healthy', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      };

      return {
        ...mat,
        monthlyRequirement,
        incomingStock,
        projectedAvailability,
        m1: { balance: m1Projected, status: getStatus(m1Projected) },
        m2: { balance: m2Projected, status: getStatus(m2Projected) },
        m3: { balance: m3Projected, status: getStatus(m3Projected) },
        m4: { balance: m4Projected, status: getStatus(m4Projected) },
        recommendedPurchaseQty,
      };
    });
  }, [materials, purchaseOrders, monthlyPlannedUnits, startDate, endDate]);

  // Filtered forecast items
  const filteredForecastData = useMemo(() => {
    return forecastData.filter((item) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        (item.supplier && item.supplier.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));

      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;

      const matchesWattage =
        !wattageMaterialIds ||
        wattageMaterialIds.has(item.id) ||
        wattageMaterialIds.has(item.code);

      const hasShortage =
        item.m1.status.label === 'Shortage' ||
        item.m2.status.label === 'Shortage' ||
        item.m3.status.label === 'Shortage' ||
        item.m4.status.label === 'Shortage';
      const hasExcess = item.m1.status.label === 'Excess' || item.m2.status.label === 'Excess';
      const isHealthy = item.m1.status.label === 'Healthy' && item.m2.status.label === 'Healthy';

      let matchesStatus = true;
      if (statusFilter === 'Shortage') matchesStatus = hasShortage;
      else if (statusFilter === 'Action Needed') matchesStatus = item.recommendedPurchaseQty > 0;
      else if (statusFilter === 'Excess') matchesStatus = hasExcess;
      else if (statusFilter === 'Healthy') matchesStatus = isHealthy;

      return matchesSearch && matchesCategory && matchesWattage && matchesStatus;
    });
  }, [forecastData, searchTerm, categoryFilter, wattageMaterialIds, statusFilter]);

  // Pagination
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    paginatedItems,
  } = usePagination(filteredForecastData, 10);

  // Auto-reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, wattageFilter, statusFilter, startDate, endDate, monthlyPlannedUnits]);

  const handleOrderRecommendation = (item: (typeof forecastData)[0]) => {
    createPurchaseOrder({
      poNumber: '',
      supplier: item.supplier,
      poDate: new Date().toISOString().split('T')[0],
      materialId: item.id,
      materialName: item.name,
      orderedQty: item.recommendedPurchaseQty,
      receivedQty: 0,
      pendingQty: item.recommendedPurchaseQty,
      unitRate: item.standardCost,
      expectedDeliveryDate: new Date(Date.now() + item.leadTimeDays * 86400000).toISOString().split('T')[0],
      status: 'Ordered',
      plant: selectedPlant,
    });

    setSuccessMessage(`Auto-generated PO for ${item.recommendedPurchaseQty} ${item.uom} of ${item.code} from ${item.supplier}`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const shortagesCount = forecastData.filter((i) => i.m1.status.label === 'Shortage' || i.m2.status.label === 'Shortage').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#146b68] dark:text-[#84cc16]" />
              Stock Planning & Four-Month Forecast
            </h1>
            <Badge variant="outline" className="bg-[#183638]/10 text-[#146b68] dark:text-[#d4e967] border-[#146b68]/30 text-[11px] font-semibold">
              {selectedPlant}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Predictive material availability matrix, shortage alarms, and automated reorder sizing for {selectedPlant}.
          </p>
        </div>

        {/* Planning parameter simulation */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border p-2 rounded-xl text-xs">
          <Sliders className="w-4 h-4 text-[#146b68] dark:text-[#84cc16] shrink-0" />
          <span className="font-medium text-slate-700 dark:text-slate-300">Monthly Run Plan:</span>
          <Input
            type="number"
            value={monthlyPlannedUnits}
            onChange={(e) => setMonthlyPlannedUnits(Math.max(100, Number(e.target.value)))}
            className="w-24 h-7 text-xs font-bold"
          />
          <span className="text-slate-400">units/mo</span>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Forward Shortage Risk
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {shortagesCount} Materials
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Projected to breach safety stock thresholds in next 60 days
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Four-Month Horizon
            </CardTitle>
            <Calendar className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              30, 60, 90 & 120 Days
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Calculated using BOM multiplier + open pipeline orders
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Purchase Action Recommended
            </CardTitle>
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {forecastData.filter((i) => i.recommendedPurchaseQty > 0).length} Requisitions
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Required to maintain uninterrupted expected production schedule
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Forecast Matrix Table */}
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold">
                Month-by-Month Inventory Position & Reorder Recommendations
              </CardTitle>
              <CardDescription>
                Formula: Projected Availability = Current Stock + Incoming Stock &bull; Shortage = max(0, Requirement - Availability)
              </CardDescription>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            {/* Search */}
            <div className="relative min-w-[200px] flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search material code, name, supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === 'All' ? 'All Categories' : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Wattage Filter */}
            <Select value={wattageFilter} onValueChange={setWattageFilter}>
              <SelectTrigger className="w-[135px] h-8 text-xs">
                <SelectValue placeholder="All Wattages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Wattages</SelectItem>
                <SelectItem value="5W">5W Components</SelectItem>
                <SelectItem value="9W">9W Components</SelectItem>
                <SelectItem value="12W">12W Components</SelectItem>
                <SelectItem value="15W">15W Components</SelectItem>
                <SelectItem value="20W">20W Components</SelectItem>
                <SelectItem value="50W">50W Components</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[145px] h-8 text-xs">
                <SelectValue placeholder="All Risk Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Risk Statuses</SelectItem>
                <SelectItem value="Shortage">Critical Shortage</SelectItem>
                <SelectItem value="Action Needed">PO Requisition Needed</SelectItem>
                <SelectItem value="Excess">Excess Stock</SelectItem>
                <SelectItem value="Healthy">Healthy Stock</SelectItem>
              </SelectContent>
            </Select>

            {/* Inbound PO Date Range Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium">Inbound PO Window:</span>
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
            </div>

            {/* Clear All Filters */}
            {(searchTerm || categoryFilter !== 'All' || wattageFilter !== 'All' || statusFilter !== 'All' || startDate || endDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('All');
                  setWattageFilter('All');
                  setStatusFilter('All');
                  setStartDate('');
                  setEndDate('');
                }}
                className="h-8 text-xs text-slate-500 hover:text-red-600 px-2"
              >
                Reset Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Material Component</th>
                  <th className="py-2.5 px-3 text-right">Current Stock</th>
                  <th className="py-2.5 px-3 text-right">Inbound POs</th>
                  <th className="py-2.5 px-3 text-center">Month 1 (30d)</th>
                  <th className="py-2.5 px-3 text-center">Month 2 (60d)</th>
                  <th className="py-2.5 px-3 text-center">Month 3 (90d)</th>
                  <th className="py-2.5 px-3 text-center">Month 4 (120d)</th>
                  <th className="py-2.5 px-3 text-right">Recommended PO</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">
                      No material forecast records match the selected filters.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.code} &bull; Safety Stock: {item.safetyStock} {item.uom} {item.category && `• ${item.category}`}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-medium">{item.currentStock.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-semibold text-blue-600">
                        {item.incomingStock > 0 ? `+${item.incomingStock.toLocaleString()}` : '0'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${item.m1.status.color}`}>
                          {item.m1.status.label} ({item.m1.balance.toLocaleString()})
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${item.m2.status.color}`}>
                          {item.m2.status.label} ({item.m2.balance.toLocaleString()})
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${item.m3.status.color}`}>
                          {item.m3.status.label} ({item.m3.balance.toLocaleString()})
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${item.m4.status.color}`}>
                          {item.m4.status.label} ({item.m4.balance.toLocaleString()})
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                        {item.recommendedPurchaseQty > 0 ? (
                          <span className="text-red-600">
                            {item.recommendedPurchaseQty.toLocaleString()} {item.uom}
                          </span>
                        ) : (
                          <span className="text-emerald-600">0 (Sufficient)</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {item.recommendedPurchaseQty > 0 ? (
                          <Button
                            size="sm"
                            onClick={() => handleOrderRecommendation(item)}
                            className="h-7 text-xs bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold shadow-sm"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                            Create PO
                          </Button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Adequate</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50, 100]}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastPage;
