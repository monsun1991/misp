import React, { useState } from 'react';
import {
  Truck,
  PlusCircle,
  PackageCheck,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useMipsStore, isPlantMatch } from '@/store/useMipsStore';
import type { PurchaseOrder } from '@/store/useMipsStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export const ProcurementPage: React.FC = () => {
  const {
    purchaseOrders: rawPurchaseOrders,
    materials: rawMaterials,
    selectedPlant,
    createPurchaseOrder,
    createGRN,
    updatePOStatus
  } = useMipsStore();

  const purchaseOrders = rawPurchaseOrders.filter((po) => isPlantMatch(po.plant, selectedPlant));
  const materials = rawMaterials.filter((m) => isPlantMatch(m.plant, selectedPlant));

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals
  const [showPOModal, setShowPOModal] = useState(false);
  const [showGRNModal, setShowGRNModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  // New PO form state
  const [newPOMatId, setNewPOMatId] = useState(materials[0]?.id || '');
  const [newPOQty, setNewPOQty] = useState<number>(1000);
  const [newPORate, setNewPORate] = useState<number>(materials[0]?.standardCost || 50);
  const [newPOSupplier, setNewPOSupplier] = useState(materials[0]?.supplier || '');
  const [newPODelivery, setNewPODelivery] = useState('2026-10-15');

  // Sync state when materials change on plant switch
  React.useEffect(() => {
    if (materials.length > 0 && (!newPOMatId || !materials.some((m) => m.id === newPOMatId))) {
      setNewPOMatId(materials[0].id);
      setNewPORate(materials[0].standardCost);
      setNewPOSupplier(materials[0].supplier);
    }
  }, [materials]);

  const dynamicWarehouses = React.useMemo(() => {
    const set = new Set<string>();
    set.add('Main Raw Material Store');
    set.add('Southern Staging Store');
    set.add('Finished Goods Packaging Store');
    materials.forEach((m) => {
      if (m.warehouse) set.add(m.warehouse);
    });
    return Array.from(set).filter(Boolean);
  }, [materials]);

  // GRN Form State
  const [grnAccepted, setGrnAccepted] = useState<number>(0);
  const [grnRejected, setGrnRejected] = useState<number>(0);
  const [grnDamaged, setGrnDamaged] = useState<number>(0);
  const [grnWarehouse, setGrnWarehouse] = useState(materials[0]?.warehouse || 'Main Raw Material Store');
  const [grnNotes, setGrnNotes] = useState('');

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.materialName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const mat = materials.find((m) => m.id === newPOMatId);
    if (!mat) return;

    createPurchaseOrder({
      poNumber: '',
      supplier: newPOSupplier,
      poDate: new Date().toISOString().split('T')[0],
      materialId: mat.id,
      materialName: mat.name,
      orderedQty: newPOQty,
      receivedQty: 0,
      pendingQty: newPOQty,
      unitRate: newPORate,
      expectedDeliveryDate: newPODelivery,
      status: 'Ordered',
      plant: selectedPlant,
    });

    setShowPOModal(false);
  };

  const openGRNDialog = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setGrnAccepted(po.pendingQty);
    setGrnRejected(0);
    setGrnDamaged(0);
    setShowGRNModal(true);
  };

  const handleProcessGRN = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPO) return;

    const totalReceived = grnAccepted + grnRejected + grnDamaged;
    const newReceivedQty = selectedPO.receivedQty + grnAccepted;
    const isFullyReceived = newReceivedQty >= selectedPO.orderedQty;

    createGRN(
      {
        grnNumber: `GRN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        poNumber: selectedPO.poNumber,
        date: new Date().toISOString().split('T')[0],
        supplier: selectedPO.supplier,
        materialId: selectedPO.materialId,
        materialName: selectedPO.materialName,
        receivedQty: totalReceived,
        acceptedQty: grnAccepted,
        rejectedQty: grnRejected,
        damagedQty: grnDamaged,
        warehouse: grnWarehouse,
        inspectedBy: 'Quality Assurance Inspector',
        notes: grnNotes + (grnRejected > 0 ? ` | Rejected: ${grnRejected} units` : '') + (grnDamaged > 0 ? ` | Damaged: ${grnDamaged} units` : ''),
        plant: selectedPO.plant || selectedPlant,
      },
      'QA & Store Incharge'
    );

    // Auto-set PO status: Partially Received if not all qty received, else Received (Fully Closed)
    updatePOStatus(selectedPO.id, isFullyReceived ? 'Received' : 'Partially Received');

    setShowGRNModal(false);
    setSelectedPO(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Truck className="w-6 h-6 text-[#146b68] dark:text-[#84cc16]" />
              Procurement, Transit & GRN
            </h1>
            <Badge variant="outline" className="bg-[#183638]/10 text-[#146b68] dark:text-[#d4e967] border-[#146b68]/30 text-[11px] font-semibold">
              {selectedPlant}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Purchase orders, goods in transit tracking, and inbound quality receipts (GRN) for {selectedPlant}.
          </p>
        </div>

        <Button
          onClick={() => setShowPOModal(true)}
          className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Raise Purchase Order
        </Button>
      </div>

      {/* PO Pipeline Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Open Orders
            </CardTitle>
            <Clock className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {purchaseOrders.filter((p) => p.status === 'Ordered').length} Orders
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Awaiting supplier dispatch confirmation</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Goods In Transit
            </CardTitle>
            <Truck className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {purchaseOrders.filter((p) => p.status === 'In Transit').length} Shipments
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Active carrier dispatches with tracking</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Completed GRNs
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {purchaseOrders.filter((p) => p.status === 'Received').length} Receipts
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Fully reconciled into inventory</div>
          </CardContent>
        </Card>
      </div>

      {/* PO Table */}
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <Input
                placeholder="Search PO#, supplier, component..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2"
              >
                <option value="All">All Statuses</option>
                <option value="Ordered">Ordered (Pending Dispatch)</option>
                <option value="In Transit">In Transit</option>
                <option value="Partially Received">Partially Received</option>
                <option value="Received">Received (Fully Closed)</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">PO Number</th>
                  <th className="py-2.5 px-3">PO Date</th>
                  <th className="py-2.5 px-3">Supplier Name</th>
                  <th className="py-2.5 px-3">Material Component</th>
                  <th className="py-2.5 px-3 text-right">Ordered Qty</th>
                  <th className="py-2.5 px-3 text-right">Pending Qty</th>
                  <th className="py-2.5 px-3">Expected ETA</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPOs.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <td className="py-3 px-3 font-mono font-semibold text-blue-600">{po.poNumber}</td>
                    <td className="py-3 px-3 text-slate-500">{po.poDate}</td>
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">{po.supplier}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{po.materialName}</div>
                      {po.transporter && (
                        <div className="text-[10px] text-indigo-600 font-medium">
                          Transit: {po.transporter}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-medium">{po.orderedQty.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                      {po.pendingQty.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{po.expectedDeliveryDate}</td>
                    <td className="py-3 px-3 text-center">
                      {po.status === 'Ordered' && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Ordered
                        </Badge>
                      )}
                      {po.status === 'In Transit' && (
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                          In Transit
                        </Badge>
                      )}
                      {po.status === 'Partially Received' && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          ⚠ Partial GRN
                        </Badge>
                      )}
                      {po.status === 'Received' && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          ✓ Fully Received
                        </Badge>
                      )}
                      {po.status === 'Closed' && (
                        <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-300">
                          Closed
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {po.status !== 'Received' && po.status !== 'Closed' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => openGRNDialog(po)}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <PackageCheck className="w-3.5 h-3.5 mr-1" />
                            Receive GRN
                          </Button>
                          {po.status === 'Partially Received' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updatePOStatus(po.id, 'Closed')}
                              className="h-7 text-xs border-slate-400 text-slate-600 hover:bg-slate-100"
                            >
                              Close PO
                            </Button>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-medium">Reconciled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Raise PO Modal */}
      {showPOModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Raise New Purchase Order
              </h2>
              <button onClick={() => setShowPOModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Material</label>
                <select
                  value={newPOMatId}
                  onChange={(e) => {
                    setNewPOMatId(e.target.value);
                    const m = materials.find((mat) => mat.id === e.target.value);
                    if (m) {
                      setNewPOSupplier(m.supplier);
                      setNewPORate(m.standardCost);
                    }
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.code} - {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Approved Supplier</label>
                <Input
                  value={newPOSupplier}
                  onChange={(e) => setNewPOSupplier(e.target.value)}
                  required
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Order Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={newPOQty}
                    onChange={(e) => setNewPOQty(Number(e.target.value))}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Unit Rate (₹)</label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={newPORate}
                    onChange={(e) => setNewPORate(Number(e.target.value))}
                    className="h-9"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Expected Delivery Date (ETA)</label>
                <Input
                  type="date"
                  required
                  value={newPODelivery}
                  onChange={(e) => setNewPODelivery(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowPOModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold">
                  Issue Purchase Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRN Receipt Modal */}
      {showGRNModal && selectedPO && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Goods Receipt Note (GRN) Inspection
                </h2>
                <p className="text-[11px] text-slate-500">
                  Receiving against PO #{selectedPO.poNumber} &bull; {selectedPO.materialName}
                </p>
              </div>
              <button onClick={() => setShowGRNModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleProcessGRN} className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border space-y-2">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <div className="text-slate-500 text-[10px]">Ordered Qty</div>
                    <div className="text-base font-bold text-slate-800 dark:text-slate-200">{selectedPO.orderedQty} units</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">Already Received</div>
                    <div className="text-base font-bold text-emerald-600">{selectedPO.receivedQty} units</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">Pending Inbound</div>
                    <div className="text-base font-bold text-blue-600">{selectedPO.pendingQty} units</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">Supplier</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{selectedPO.supplier}</div>
                  </div>
                </div>
                <div className="text-[10px] text-amber-600 font-medium bg-amber-50 dark:bg-amber-950/30 rounded p-1.5">
                  ℹ️ Accepting less than {selectedPO.pendingQty} units will mark this PO as <strong>Partially Received</strong>. You can raise another GRN later or manually close it.
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-emerald-600">Accepted Qty</label>
                  <Input
                    type="number"
                    min="0"
                    max={selectedPO.pendingQty}
                    required
                    value={grnAccepted}
                    onChange={(e) => setGrnAccepted(Number(e.target.value))}
                    className="h-9 font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-red-500">Rejected Qty</label>
                  <Input
                    type="number"
                    min="0"
                    value={grnRejected}
                    onChange={(e) => setGrnRejected(Number(e.target.value))}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-amber-500">Damaged Qty</label>
                  <Input
                    type="number"
                    min="0"
                    value={grnDamaged}
                    onChange={(e) => setGrnDamaged(Number(e.target.value))}
                    className="h-9"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Destination Warehouse</label>
                <select
                  value={grnWarehouse}
                  onChange={(e) => setGrnWarehouse(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs"
                >
                  {dynamicWarehouses.map((wh) => (
                    <option key={wh} value={wh}>
                      {wh}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Inspection Notes & QA Remarks</label>
                <textarea
                  rows={2}
                  value={grnNotes}
                  onChange={(e) => setGrnNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs"
                  placeholder="e.g. Visual inspection passed, multimeter voltage test verified within spec"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowGRNModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Confirm GRN & Update Stock
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementPage;
