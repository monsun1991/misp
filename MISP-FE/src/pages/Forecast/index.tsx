import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { useMipsStore, isPlantMatch } from '@/store/useMipsStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export const ForecastPage: React.FC = () => {
  const {
    materials: rawMaterials,
    purchaseOrders: rawPurchaseOrders,
    selectedPlant,
    createPurchaseOrder
  } = useMipsStore();

  const materials = rawMaterials.filter((m) => isPlantMatch(m.plant, selectedPlant));
  const purchaseOrders = rawPurchaseOrders.filter((po) => isPlantMatch(po.plant, selectedPlant));

  // Monthly planned production assumption (can be adjusted by user)
  const [monthlyPlannedUnits, setMonthlyPlannedUnits] = useState<number>(3000);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Compute forecast for each material over 4 months
  const forecastData = materials.map((mat) => {
    // Determine BOM usage multiplier based on category
    let unitsPerBulb = 1;
    if (mat.code.includes('SCR')) unitsPerBulb = 2;

    const monthlyRequirement = monthlyPlannedUnits * unitsPerBulb;

    // Incoming stock from open purchase orders
    const incomingStock = purchaseOrders
      .filter((p) => p.materialId === mat.id && (p.status === 'Ordered' || p.status === 'In Transit'))
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
          <CardTitle className="text-base font-semibold">
            Month-by-Month Inventory Position & Reorder Recommendations
          </CardTitle>
          <CardDescription>
            Formula: Projected Availability = Current Stock + Incoming Stock &bull; Shortage = max(0, Requirement - Availability)
          </CardDescription>
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
                {forecastData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.code} &bull; Safety Stock: {item.safetyStock} {item.uom}
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastPage;
