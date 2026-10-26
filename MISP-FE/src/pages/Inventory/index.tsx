import React, { useState } from 'react';
import {
  Boxes,
  ArrowUpDown,
  Search,
  Filter,
  AlertTriangle,
  PlusCircle,
  Building,
  CheckCircle2,
  SlidersHorizontal,
  History,
  Truck,
  FileText,
  Tag,
  ArrowDownRight,
  ArrowUpRight,
  ShieldCheck,
  Scale,
  RotateCcw,
  Trash2,
  Layers,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Package,
  Cpu,
  Edit2
} from 'lucide-react';
import { useMipsStore, Material, Product, StockLedgerEntry, isPlantMatch } from '@/store/useMipsStore';
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
import FinishedGoodsPage from '@/pages/FinishedGoods';

export const InventoryPage: React.FC = () => {
  const {
    materials: rawMaterials,
    finishedGoods: rawFinishedGoods,
    stockLedger: rawStockLedger,
    products,
    categories,
    addCategory,
    employees,
    adjustStock,
    updateMaterial,
    selectedPlant
  } = useMipsStore();

  const materials = rawMaterials.filter((m) => isPlantMatch(m.plant, selectedPlant));
  const finishedGoods = (rawFinishedGoods || []).filter((fg) => isPlantMatch(fg.plant, selectedPlant));
  const stockLedger = rawStockLedger.filter((s) => isPlantMatch(s.plant, selectedPlant));

  const authorizedEmployees = React.useMemo(() => {
    const plantEmps = (employees || []).filter((e) => isPlantMatch(e.plant, selectedPlant));
    return plantEmps.length > 0 ? plantEmps : (employees || []);
  }, [employees, selectedPlant]);

  const [activeTab, setActiveTab] = useState<'stock' | 'finished_goods' | 'ledger'>('stock');
  const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped');
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({
    prod_1: true,
    prod_2: true,
    prod_3: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('All');
  const [wattageFilter, setWattageFilter] = useState<string>('All');

  // Ledger Search & Filter
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerTxFilter, setLedgerTxFilter] = useState<string>('All');
  const [ledgerStartDate, setLedgerStartDate] = useState<string>('');
  const [ledgerEndDate, setLedgerEndDate] = useState<string>('');

  // Stock Movement & Adjustment Modal State
  const [showAdjModal, setShowAdjModal] = useState(false);
  const [selectedMatId, setSelectedMatId] = useState<string>(materials[0]?.id || '');
  const [movementDirection, setMovementDirection] = useState<'IN' | 'OUT'>('IN');
  const [inboundCategory, setInboundCategory] = useState<string>('Supplier Inbound (Direct)');
  const [outboundCategory, setOutboundCategory] = useState<string>('Return to Vendor (RTV)');

  // Supplier & Traceability Fields
  const [supplierName, setSupplierName] = useState<string>('');
  const [invoiceNo, setInvoiceNo] = useState<string>('');
  const [batchNo, setBatchNo] = useState<string>('');
  const [unitCost, setUnitCost] = useState<number>(0);
  const [targetWarehouse, setTargetWarehouse] = useState<string>('');

  // Outbound / RTV / Scrap specific
  const [debitNoteNo, setDebitNoteNo] = useState<string>('');
  const [originalRef, setOriginalRef] = useState<string>('');
  const [rtvDefectReason, setRtvDefectReason] = useState<string>('Electrical parameter / CCT chromaticity drift beyond spec');
  const [scrapReason, setScrapReason] = useState<string>('Damaged / Hi-Pot breakdown during QA verification');
  const [authorizingPerson, setAuthorizingPerson] = useState<string>('Ramesh Sharma (Store Manager)');

  // Common
  const [adjQuantity, setAdjQuantity] = useState<number>(0);
  const [adjReason, setAdjReason] = useState<string>('');

  // Edit Material State
  const [showEditMatModal, setShowEditMatModal] = useState(false);
  const [editingMatId, setEditingMatId] = useState('');
  const [editMatCode, setEditMatCode] = useState('');
  const [editMatName, setEditMatName] = useState('');
  const [editMatCategory, setEditMatCategory] = useState<string>('Electronics');
  const [isEditCustomCategory, setIsEditCustomCategory] = useState<boolean>(false);
  const [editCustomCategoryInput, setEditCustomCategoryInput] = useState<string>('');
  const [editMatUom, setEditMatUom] = useState('Pcs');
  const [editMatSupplier, setEditMatSupplier] = useState('');
  const [editMatWarehouse, setEditMatWarehouse] = useState('');
  const [editMatLocation, setEditMatLocation] = useState('');
  const [editMatMinStock, setEditMatMinStock] = useState<number>(0);
  const [editMatMaxStock, setEditMatMaxStock] = useState<number>(0);
  const [editMatReorderLevel, setEditMatReorderLevel] = useState<number>(0);
  const [editMatSafetyStock, setEditMatSafetyStock] = useState<number>(0);
  const [editMatCost, setEditMatCost] = useState<number>(0);
  const [editMatStatus, setEditMatStatus] = useState<Material['status']>('Active');

  const openEditMaterial = (mat: Material) => {
    setEditingMatId(mat.id);
    setEditMatCode(mat.code);
    setEditMatName(mat.name);
    setEditMatCategory(mat.category);
    setIsEditCustomCategory(false);
    setEditCustomCategoryInput('');
    setEditMatUom(mat.uom);
    setEditMatSupplier(mat.supplier);
    setEditMatWarehouse(mat.warehouse);
    setEditMatLocation(mat.location);
    setEditMatMinStock(mat.minStock);
    setEditMatMaxStock(mat.maxStock);
    setEditMatReorderLevel(mat.reorderLevel);
    setEditMatSafetyStock(mat.safetyStock);
    setEditMatCost(mat.standardCost);
    setEditMatStatus(mat.status);
    setShowEditMatModal(true);
  };

  const handleSaveEditMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatId) return;

    const finalCategory = isEditCustomCategory && editCustomCategoryInput.trim()
      ? editCustomCategoryInput.trim()
      : editMatCategory;

    updateMaterial(editingMatId, {
      name: editMatName,
      category: finalCategory,
      uom: editMatUom,
      supplier: editMatSupplier,
      warehouse: editMatWarehouse,
      location: editMatLocation,
      minStock: editMatMinStock,
      maxStock: editMatMaxStock,
      reorderLevel: editMatReorderLevel,
      safetyStock: editMatSafetyStock,
      standardCost: editMatCost,
      status: editMatStatus,
    });

    if (isEditCustomCategory && editCustomCategoryInput.trim()) {
      addCategory({ name: editCustomCategoryInput.trim(), type: 'material' });
    }

    setShowEditMatModal(false);
    setIsEditCustomCategory(false);
    setEditCustomCategoryInput('');
  };

  // Extract unique warehouses dynamically for the active plant
  const dynamicWarehouses = Array.from(new Set(materials.map((m) => m.warehouse))).filter(Boolean);
  // Extract all distinct categories from database categories table & materials
  const dynamicCategories = Array.from(
    new Set([
      ...(categories || []).filter((c) => c.type === 'material').map((c) => c.name),
      'Electronics',
      'Mechanical',
      'Optical',
      'Hardware',
      'Packaging',
      'Raw Materials',
      'Chemicals & Consumables',
      ...materials.map((m) => m.category)
    ])
  ).filter(Boolean);
  // Extract all distinct suppliers from rawMaterials
  const allSuppliers = Array.from(new Set(rawMaterials.map((m) => m.supplier).filter(Boolean)));

  // Selected Material Object
  const currentMaterial = materials.find((m) => m.id === selectedMatId) || materials[0];

  // Sync selectedMatId if materials change
  React.useEffect(() => {
    if (materials.length > 0 && (!selectedMatId || !materials.some((m) => m.id === selectedMatId))) {
      setSelectedMatId(materials[0].id);
    }
  }, [materials, selectedMatId]);

  // Sync form defaults when material changes
  React.useEffect(() => {
    if (currentMaterial) {
      setSupplierName(currentMaterial.supplier || '');
      setTargetWarehouse(currentMaterial.warehouse || dynamicWarehouses[0] || 'Main Raw Material Store');
      setUnitCost(currentMaterial.standardCost || 0);
      const prefix = currentMaterial.code.split('-')[0] || 'MAT';
      const year = new Date().getFullYear().toString().slice(-2);
      const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
      setBatchNo(`LOT-${prefix}-${year}${month}-B${Math.floor(1 + Math.random() * 9)}`);
      setInvoiceNo(`INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setDebitNoteNo(`DN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
      setOriginalRef(`PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
    }
  }, [selectedMatId, currentMaterial]);

  const matchesCategoryHelper = (cat: string, subCat?: string) => {
    if (categoryFilter === 'All') return true;
    if (cat === categoryFilter || subCat === categoryFilter) return true;
    if (categoryFilter === 'Electronic Drivers') {
      return cat === 'Electronics' || subCat?.includes('Power') || subCat?.includes('Driver');
    }
    if (categoryFilter === 'LED Diodes & COB') {
      return cat === 'Electronics' || subCat?.includes('LED') || subCat?.includes('COB');
    }
    if (categoryFilter === 'Housings & Die-Cast') {
      return cat === 'Mechanical' || subCat?.includes('Heatsink') || subCat?.includes('Castings');
    }
    if (categoryFilter === 'Diffusers & Optics') {
      return cat === 'Optical' || subCat?.includes('Diffuser');
    }
    if (categoryFilter === 'Wiring & Hardware') {
      return cat === 'Hardware' || subCat?.includes('Wiring') || subCat?.includes('Fasteners');
    }
    if (categoryFilter === 'Packaging & Retail Boxes') {
      return cat === 'Packaging' || subCat?.includes('Retail');
    }
    return false;
  };

  const filteredMaterials = React.useMemo(() => {
    return materials.filter((m) => {
      const matchesSearch =
        !searchTerm ||
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = matchesCategoryHelper(m.category, m.subCategory);
      const matchesWarehouse = warehouseFilter === 'All' || m.warehouse === warehouseFilter;
      const matchesWattage =
        wattageFilter === 'All' ||
        products.some(
          (p) => p.wattage === wattageFilter && (p.bom || []).some((b) => b.materialId === m.id || b.materialCode === m.code)
        );
      return matchesSearch && matchesCategory && matchesWarehouse && matchesWattage;
    });
  }, [materials, products, searchTerm, categoryFilter, warehouseFilter, wattageFilter]);

  // Helper to calculate scrap / rejection quantity per material from stock ledger
  const getMaterialRejectionCount = (matId: string) => {
    return stockLedger
      .filter(
        (s) =>
          s.materialId === matId &&
          (s.transactionType === 'Wastage / Scrap' || s.transactionType === 'Return to Vendor (RTV)')
      )
      .reduce((sum, s) => sum + s.outQty, 0);
  };

  // Helper to fetch latest Business ID / Lot / Inbound Reference for traceability
  const getMaterialBusinessId = (matId: string, defaultPrefix = 'LOT') => {
    const entry = stockLedger
      .slice()
      .reverse()
      .find((s) => s.materialId === matId && (s.batchNo || s.invoiceNo || s.referenceNo));
    return entry?.batchNo || entry?.invoiceNo || entry?.referenceNo || `${defaultPrefix}-2026-PRIMARY`;
  };

  // Helper to compute buildable capacity for each product based on current material stocks
  const calculateBuildableCapacity = (prod: Product) => {
    if (!prod.bom || prod.bom.length === 0) return { capacity: 0, bottleneck: 'No BOM' };
    let minUnits = Infinity;
    let bottleneck = '';

    prod.bom.forEach((b) => {
      const mat = materials.find((m) => m.id === b.materialId || m.code === b.materialCode);
      const available = mat ? mat.currentStock : 0;
      const canMake = Math.floor(available / (b.qtyPerUnit || 1));
      if (canMake < minUnits) {
        minUnits = canMake;
        bottleneck = b.materialName;
      }
    });

    return {
      capacity: minUnits === Infinity ? 0 : minUnits,
      bottleneck,
    };
  };

  // Filtered products for Grouped View
  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      let termMatches = true;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const prodMatches = p.name.toLowerCase().includes(term) || p.code.toLowerCase().includes(term);
        const subpartMatches = (p.bom || []).some(
          (b) => (b.materialName || '').toLowerCase().includes(term) || (b.materialCode || '').toLowerCase().includes(term)
        );
        termMatches = prodMatches || subpartMatches;
      }
      if (!termMatches) return false;

      if (wattageFilter !== 'All' && p.wattage !== wattageFilter) {
        return false;
      }

      if (categoryFilter !== 'All') {
        const prodCatMatch = p.category === categoryFilter;
        const subpartCatMatch = (p.bom || []).some((b) => {
          const mat = materials.find((m) => m.id === b.materialId || m.code === b.materialCode);
          if (!mat) return false;
          return matchesCategoryHelper(mat.category, mat.subCategory);
        });
        if (!prodCatMatch && !subpartCatMatch) return false;
      }

      if (warehouseFilter !== 'All') {
        const subpartWhMatch = (p.bom || []).some((b) => {
          const mat = materials.find((m) => m.id === b.materialId || m.code === b.materialCode);
          return mat?.warehouse === warehouseFilter;
        });
        if (!subpartWhMatch) return false;
      }

      return true;
    });
  }, [products, materials, searchTerm, categoryFilter, warehouseFilter, wattageFilter]);

  const filteredLedger = React.useMemo(() => {
    return stockLedger.filter((row) => {
      const q = ledgerSearch.toLowerCase();
      const matchesQuery =
        !q ||
        row.materialName.toLowerCase().includes(q) ||
        row.materialCode.toLowerCase().includes(q) ||
        row.referenceNo.toLowerCase().includes(q) ||
        (row.supplier && row.supplier.toLowerCase().includes(q)) ||
        (row.batchNo && row.batchNo.toLowerCase().includes(q)) ||
        (row.invoiceNo && row.invoiceNo.toLowerCase().includes(q)) ||
        (row.notes && row.notes.toLowerCase().includes(q));

      const matchesTx = ledgerTxFilter === 'All' || row.transactionType === ledgerTxFilter;
      const matchesDate =
        (!ledgerStartDate || row.date >= ledgerStartDate) &&
        (!ledgerEndDate || row.date <= ledgerEndDate);

      return matchesQuery && matchesTx && matchesDate;
    });
  }, [stockLedger, ledgerSearch, ledgerTxFilter, ledgerStartDate, ledgerEndDate]);

  // Pagination for Grouped View (Products)
  const {
    currentPage: prodPage,
    setCurrentPage: setProdPage,
    pageSize: prodPageSize,
    setPageSize: setProdPageSize,
    totalItems: totalProdItems,
    totalPages: totalProdPages,
    paginatedItems: paginatedProducts,
  } = usePagination(filteredProducts, 5);

  // Pagination for Flat View (Materials)
  const {
    currentPage: matPage,
    setCurrentPage: setMatPage,
    pageSize: matPageSize,
    setPageSize: setMatPageSize,
    totalItems: totalMatItems,
    totalPages: totalMatPages,
    paginatedItems: paginatedMaterials,
  } = usePagination(filteredMaterials, 10);

  // Pagination for Live Stock Ledger
  const {
    currentPage: ledgerPage,
    setCurrentPage: setLedgerPage,
    pageSize: ledgerPageSize,
    setPageSize: setLedgerPageSize,
    totalItems: totalLedgerItems,
    totalPages: totalLedgerPages,
    paginatedItems: paginatedLedger,
  } = usePagination(filteredLedger, 15);

  // Reset pagination to page 1 whenever search, filters or view mode change
  React.useEffect(() => {
    setMatPage(1);
    setProdPage(1);
  }, [searchTerm, categoryFilter, warehouseFilter, wattageFilter, viewMode]);

  React.useEffect(() => {
    setLedgerPage(1);
  }, [ledgerSearch, ledgerTxFilter, ledgerStartDate, ledgerEndDate]);

  const handleApplyMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMaterial || adjQuantity <= 0) return;

    if (movementDirection === 'OUT' && adjQuantity > currentMaterial.currentStock) {
      alert(`Cannot deduct ${adjQuantity} ${currentMaterial.uom}. Only ${currentMaterial.currentStock} ${currentMaterial.uom} available in stock!`);
      return;
    }

    const delta = movementDirection === 'IN' ? adjQuantity : -adjQuantity;

    let transactionType: StockLedgerEntry['transactionType'];
    let finalReason = adjReason;
    let referenceNo = '';

    if (movementDirection === 'IN') {
      if (inboundCategory === 'Supplier Inbound (Direct)') {
        transactionType = 'Supplier Inbound (Direct)';
        referenceNo = invoiceNo || `INV-${Date.now()}`;
        finalReason = `Supplier delivery from ${supplierName} (Inv: ${referenceNo}, Lot: ${batchNo}). ${adjReason}`;
      } else if (inboundCategory === 'Production Floor Return') {
        transactionType = 'Material Return';
        referenceNo = `RET-${Math.floor(1000 + Math.random() * 9000)}`;
        finalReason = `Production return from shop floor. ${adjReason}`;
      } else if (inboundCategory === 'Opening Balance Upload') {
        transactionType = 'Opening Stock';
        referenceNo = 'SYS-AUDIT-INIT';
        finalReason = `Opening inventory adjustment. ${adjReason}`;
      } else {
        transactionType = 'Adjustment (+)';
        referenceNo = `ADJ-IN-${Math.floor(1000 + Math.random() * 9000)}`;
        finalReason = `Cycle count surplus. ${adjReason}`;
      }
    } else {
      if (outboundCategory === 'Return to Vendor (RTV)') {
        transactionType = 'Return to Vendor (RTV)';
        referenceNo = debitNoteNo || `DN-${Date.now()}`;
        finalReason = `RTV to ${supplierName} under Debit Note ${referenceNo}. Reason: ${rtvDefectReason}. ${adjReason}`;
      } else if (outboundCategory === 'Scrap / Damage Disposal') {
        transactionType = 'Wastage / Scrap';
        referenceNo = `SCRAP-${Math.floor(1000 + Math.random() * 9000)}`;
        finalReason = `QA scrap disposal (${scrapReason}). Authorized by ${authorizingPerson}. ${adjReason}`;
      } else if (outboundCategory === 'Sample / Engineering Issue') {
        transactionType = 'Sample / Engineering Issue';
        referenceNo = `SMP-${Math.floor(1000 + Math.random() * 9000)}`;
        finalReason = `R&D and testing issuance. ${adjReason}`;
      } else {
        transactionType = 'Adjustment (-)';
        referenceNo = `ADJ-OUT-${Math.floor(1000 + Math.random() * 9000)}`;
        finalReason = `Physical count shrinkage write-off. ${adjReason}`;
      }
    }

    adjustStock(
      currentMaterial.id,
      delta,
      finalReason,
      authorizingPerson,
      {
        transactionType,
        supplier: supplierName,
        invoiceNo: movementDirection === 'IN' ? invoiceNo : undefined,
        debitNoteNo: movementDirection === 'OUT' && outboundCategory === 'Return to Vendor (RTV)' ? debitNoteNo : undefined,
        batchNo,
        unitCost,
        warehouse: targetWarehouse,
        referenceNo
      }
    );

    setShowAdjModal(false);
    setAdjQuantity(0);
    setAdjReason('');
  };

  const getTxBadge = (type: StockLedgerEntry['transactionType']) => {
    switch (type) {
      case 'Goods Receipt (GRN)':
      case 'Supplier Inbound (Direct)':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300">{type}</Badge>;
      case 'Return to Vendor (RTV)':
        return <Badge className="bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300">{type}</Badge>;
      case 'Kit Issue':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300">{type}</Badge>;
      case 'Material Return':
        return <Badge className="bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950/40 dark:text-cyan-300">{type}</Badge>;
      case 'Wastage / Scrap':
        return <Badge className="bg-red-100 text-red-800 border-red-300 dark:bg-red-950/40 dark:text-red-300">{type}</Badge>;
      case 'Adjustment (+)':
        return <Badge className="bg-lime-100 text-lime-900 border-lime-400 dark:bg-lime-950/40 dark:text-lime-300">{type}</Badge>;
      case 'Adjustment (-)':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300">{type}</Badge>;
      case 'Sample / Engineering Issue':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300">{type}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Boxes className="w-6 h-6 text-[#146b68] dark:text-[#84cc16]" />
              Inventory & Stock Ledger
            </h1>
            <Badge variant="outline" className="bg-[#183638]/10 text-[#146b68] dark:text-[#d4e967] border-[#146b68]/30 text-[11px] font-semibold">
              {selectedPlant}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time material positions scoped to {selectedPlant} and comprehensive supplier-linked traceability ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAdjModal(true)}
            className="text-xs bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
          >
            <ArrowUpDown className="w-3.5 h-3.5 mr-1.5" />
            Stock In / Out Movement (+/-)
          </Button>

          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center">
            <button
              onClick={() => setActiveTab('stock')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'stock'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Raw Materials ({materials.length})
            </button>
            <button
              onClick={() => setActiveTab('finished_goods')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'finished_goods'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Finished Goods (FGS) ({finishedGoods.length})
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'ledger'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Live Stock Ledger ({stockLedger.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Stock Table with Group by Product & Flat View Toggle */}
      {activeTab === 'stock' && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <Input
                  placeholder="Search material code, subpart, or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              {/* View Mode Toggle & Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg flex items-center border">
                  <button
                    type="button"
                    onClick={() => setViewMode('grouped')}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                      viewMode === 'grouped'
                        ? 'bg-white dark:bg-slate-900 text-[#146b68] dark:text-[#84cc16] shadow-sm font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    Group by Product (BOM)
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('flat')}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                      viewMode === 'flat'
                        ? 'bg-white dark:bg-slate-900 text-[#146b68] dark:text-[#84cc16] shadow-sm font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Boxes className="w-3.5 h-3.5" />
                    Flat Materials List
                  </button>
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px] h-8 text-xs">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {dynamicCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem value="Electronic Drivers">Electronic Drivers</SelectItem>
                    <SelectItem value="LED Diodes & COB">LED Diodes & COB</SelectItem>
                    <SelectItem value="Housings & Die-Cast">Housings & Die-Cast</SelectItem>
                    <SelectItem value="Diffusers & Optics">Diffusers & Optics</SelectItem>
                    <SelectItem value="Wiring & Hardware">Wiring & Hardware</SelectItem>
                    <SelectItem value="Packaging & Retail Boxes">Packaging & Retail Boxes</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                  <SelectTrigger className="w-[155px] h-8 text-xs">
                    <SelectValue placeholder="All Storage Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Storage Locations</SelectItem>
                    {dynamicWarehouses.map((wh) => (
                      <SelectItem key={wh} value={wh}>
                        {wh}
                      </SelectItem>
                    ))}
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
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* VIEW MODE 1: GROUPED BY PRODUCT / BOM SUBPARTS (User Feedback #1) */}
            {viewMode === 'grouped' ? (
              <div className="space-y-3">
                {paginatedProducts.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed">
                    No products found matching the selected filters.
                  </div>
                ) : (
                  paginatedProducts.map((prod) => {
                  const isExpanded = !!expandedProducts[prod.id];
                  const { capacity, bottleneck } = calculateBuildableCapacity(prod);

                  return (
                    <div
                      key={prod.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden shadow-sm transition-all"
                    >
                      {/* Product Group Header Row */}
                      <div
                        onClick={() =>
                          setExpandedProducts((prev) => ({
                            ...prev,
                            [prod.id]: !prev[prod.id],
                          }))
                        }
                        className="p-3.5 bg-slate-50/80 dark:bg-slate-850/60 hover:bg-slate-100/80 dark:hover:bg-slate-800 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-[#146b68] dark:text-[#84cc16]" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                          <div className="w-8 h-8 rounded-lg bg-[#183638] text-[#84cc16] flex items-center justify-center font-bold text-xs">
                            <Cpu className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                                {prod.name}
                              </span>
                              <Badge variant="outline" className="text-[10px] font-mono border-[#146b68]/30 text-[#146b68] dark:text-[#84cc16]">
                                {prod.code}
                              </Badge>
                              <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                {prod.wattage} &bull; {prod.category}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Bill of Materials: <strong>{(prod.bom || []).length} Subparts</strong> &bull; Standard Cost: ₹{prod.standardCost}
                            </div>
                          </div>
                        </div>

                        {/* Capacity & Group Metrics */}
                        <div className="flex items-center gap-3 sm:text-right">
                          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-lg">
                            <div className="text-[10px] uppercase font-semibold text-emerald-800 dark:text-emerald-300">
                              Max Assemble Capacity
                            </div>
                            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                              {capacity.toLocaleString()} Finished Units
                            </div>
                            <div className="text-[9px] text-emerald-600/80 truncate max-w-[170px]">
                              Limiting: {bottleneck}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Subparts BOM Table */}
                      {isExpanded && (
                        <div className="overflow-x-auto p-2 bg-slate-50/20 dark:bg-slate-900/30">
                          <table className="w-full text-left text-xs">
                            <thead className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                              <tr>
                                <th className="py-2 px-3">Subpart Code</th>
                                <th className="py-2 px-3">Subpart Name & Supplier</th>
                                <th className="py-2 px-3 text-center">BOM Qty/Unit</th>
                                <th className="py-2 px-3">Warehouse & Bin</th>
                                <th className="py-2 px-3 text-right">In Warehouse</th>
                                <th className="py-2 px-3 text-right text-amber-600 font-bold">On Shop Floor</th>
                                <th className="py-2 px-3 text-right text-red-500 font-semibold">Rejections</th>
                                <th className="py-2 px-3">Business ID / Lot #</th>
                                <th className="py-2 px-3 text-center">Stock Health</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                              {(prod.bom || []).map((b) => {
                                const mat = materials.find((m) => m.id === b.materialId || m.code === b.materialCode);
                                const rejections = mat ? getMaterialRejectionCount(mat.id) : 0;
                                const businessId = mat ? getMaterialBusinessId(mat.id, b.materialCode.split('-')[0]) : 'LOT-2026';
                                const isLow = mat ? mat.currentStock <= mat.reorderLevel : false;
                                const isCritical = mat ? mat.currentStock <= mat.safetyStock : false;

                                return (
                                  <tr key={b.materialId} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                                    <td className="py-2.5 px-3 font-mono font-semibold text-[#146b68] dark:text-[#84cc16]">
                                      {b.materialCode}
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <div className="font-medium text-slate-800 dark:text-slate-200">
                                        {b.materialName}
                                      </div>
                                      <div className="text-[10px] text-slate-400">
                                        Vendor: {mat?.supplier || 'Approved Supplier'}
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-3 text-center font-mono font-semibold">
                                      {b.qtyPerUnit} {b.uom}
                                    </td>
                                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                                      <div className="flex items-center gap-1">
                                        <Building className="w-3 h-3 text-slate-400" />
                                        <span>{mat?.warehouse || 'Main Raw Material Store'}</span>
                                      </div>
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        {mat?.location || 'RACK-A1'}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                                      {mat ? mat.currentStock.toLocaleString() : 0} {b.uom}
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-bold text-amber-600 bg-amber-50/50 dark:bg-amber-950/20">
                                      {mat ? mat.stockWithEmployees.toLocaleString() : 0} {b.uom}
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-bold text-red-500">
                                      {rejections > 0 ? `${rejections} ${b.uom}` : '0'}
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-slate-700 dark:text-slate-300 font-semibold">
                                        {businessId}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 text-center">
                                      {isCritical ? (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700 border border-red-200">
                                          Critical Shortage
                                        </span>
                                      ) : isLow ? (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                                          Reorder
                                        </span>
                                      ) : (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                          Healthy
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                }))}
              </div>
            ) : (
              /* VIEW MODE 2: FLAT MATERIALS LIST WITH DETAILED TRACEABILITY (User Feedback #4) */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Material Code</th>
                      <th className="py-2.5 px-3">Description & Supplier</th>
                      <th className="py-2.5 px-3">Warehouse & Bin</th>
                      <th className="py-2.5 px-3 text-right">In Warehouse</th>
                      <th className="py-2.5 px-3 text-right text-amber-600 font-bold">On Floor (Staff)</th>
                      <th className="py-2.5 px-3 text-right text-red-500 font-semibold">Rejections</th>
                      <th className="py-2.5 px-3">Business ID / Lot #</th>
                      <th className="py-2.5 px-3 text-right">Reorder Pt</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Valuation</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedMaterials.map((mat) => {
                      const isLow = mat.currentStock <= mat.reorderLevel;
                      const isCritical = mat.currentStock <= mat.safetyStock;
                      const isOverstock = mat.currentStock > mat.maxStock;
                      const rejections = getMaterialRejectionCount(mat.id);
                      const businessId = getMaterialBusinessId(mat.id, mat.code.split('-')[0]);

                      return (
                        <tr key={mat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                          <td className="py-3 px-3 font-mono font-semibold text-[#146b68] dark:text-[#84cc16]">
                            {mat.code}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-medium text-slate-800 dark:text-slate-200">{mat.name}</div>
                            <div className="text-[10px] text-slate-400">Supplier: {mat.supplier}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <Building className="w-3.5 h-3.5 text-slate-400" />
                              {mat.warehouse}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">{mat.location}</div>
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                            {mat.currentStock.toLocaleString()} {mat.uom}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-amber-600 bg-amber-50/40 dark:bg-amber-950/20">
                            {mat.stockWithEmployees} {mat.uom}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-red-500">
                            {rejections > 0 ? `${rejections} ${mat.uom}` : '0'}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-slate-700 dark:text-slate-300 font-semibold">
                              {businessId}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right text-slate-500">
                            {mat.reorderLevel.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {isCritical ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700 border border-red-200">
                                Critical Shortage
                              </span>
                            ) : isLow ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                                Reorder Needed
                              </span>
                            ) : isOverstock ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                                Excess Stock
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                Healthy
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                            ₹{((mat.currentStock * mat.standardCost) / 1000).toFixed(1)}k
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditMaterial(mat)}
                              className="h-7 w-7 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              title="Edit Material Specs"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <TablePagination
              currentPage={viewMode === 'grouped' ? prodPage : matPage}
              totalPages={viewMode === 'grouped' ? totalProdPages : totalMatPages}
              totalItems={viewMode === 'grouped' ? totalProdItems : totalMatItems}
              pageSize={viewMode === 'grouped' ? prodPageSize : matPageSize}
              onPageChange={viewMode === 'grouped' ? setProdPage : setMatPage}
              onPageSizeChange={viewMode === 'grouped' ? setProdPageSize : setMatPageSize}
              pageSizeOptions={viewMode === 'grouped' ? [5, 10, 20] : [10, 25, 50, 100]}
            />
          </CardContent>
        </Card>
      )}

      {/* Finished Goods Store Tab */}
      {activeTab === 'finished_goods' && (
        <FinishedGoodsPage />
      )}

      {/* Stock Ledger Table */}
      {activeTab === 'ledger' && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <History className="w-4 h-4 text-[#146b68] dark:text-[#84cc16]" />
                  Stock Ledger & Traceability Journal
                </CardTitle>
                <CardDescription>
                  Complete chronological audit of all goods receipt (GRN), direct supplier entries, RTV debit notes, kit issuance and approved scrap write-offs.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <Input
                    placeholder="Search material, supplier, lot, invoice..."
                    value={ledgerSearch}
                    onChange={(e) => setLedgerSearch(e.target.value)}
                    className="h-8 text-xs w-48 sm:w-60"
                  />
                </div>

                <Select value={ledgerTxFilter} onValueChange={setLedgerTxFilter}>
                  <SelectTrigger className="w-[170px] h-8 text-xs">
                    <SelectValue placeholder="All Transactions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Transactions</SelectItem>
                    <SelectItem value="Goods Receipt (GRN)">Goods Receipt (GRN)</SelectItem>
                    <SelectItem value="Supplier Inbound (Direct)">Supplier Inbound (Direct)</SelectItem>
                    <SelectItem value="Return to Vendor (RTV)">Return to Vendor (RTV)</SelectItem>
                    <SelectItem value="Kit Issue">Kit Issue</SelectItem>
                    <SelectItem value="Material Return">Material Return</SelectItem>
                    <SelectItem value="Wastage / Scrap">Wastage / Scrap</SelectItem>
                    <SelectItem value="Adjustment (+)">Adjustment (+)</SelectItem>
                    <SelectItem value="Adjustment (-)">Adjustment (-)</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-1.5 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <DatePicker
                    value={ledgerStartDate}
                    onChange={setLedgerStartDate}
                    placeholder="Start date"
                    className="w-32"
                  />
                  <span className="text-slate-400 text-[10px]">to</span>
                  <DatePicker
                    value={ledgerEndDate}
                    onChange={setLedgerEndDate}
                    placeholder="End date"
                    className="w-32"
                  />
                  {(ledgerStartDate || ledgerEndDate) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLedgerStartDate('');
                        setLedgerEndDate('');
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
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Material</th>
                    <th className="py-2.5 px-3">Transaction</th>
                    <th className="py-2.5 px-3">Party / Supplier / Source</th>
                    <th className="py-2.5 px-3">Traceability (Lot / Inv / Ref)</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3 text-right">In (+Qty)</th>
                    <th className="py-2.5 px-3 text-right">Out (-Qty)</th>
                    <th className="py-2.5 px-3 text-right">Balance</th>
                    <th className="py-2.5 px-3">Authorized By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedLedger.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{row.date}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{row.materialName}</div>
                        <div className="text-[10px] font-mono text-[#146b68] dark:text-[#84cc16] font-medium">{row.materialCode}</div>
                      </td>
                      <td className="py-3 px-3">
                        {getTxBadge(row.transactionType)}
                        {row.notes && <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs">{row.notes}</div>}
                      </td>
                      <td className="py-3 px-3">
                        {row.supplier ? (
                          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
                            <Building className="w-3.5 h-3.5 text-[#146b68] shrink-0" />
                            <span>{row.supplier}</span>
                          </div>
                        ) : row.sourceDestination ? (
                          <div className="text-slate-600 dark:text-slate-400 font-medium">{row.sourceDestination}</div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <div className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            {row.referenceNo}
                          </div>
                          {row.batchNo && (
                            <div className="inline-block px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 border text-slate-600 dark:text-slate-300">
                              Lot: {row.batchNo}
                            </div>
                          )}
                          {row.invoiceNo && (
                            <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                              Inv #{row.invoiceNo}
                            </div>
                          )}
                          {row.debitNoteNo && (
                            <div className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold">
                              DN #{row.debitNoteNo}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {row.warehouse}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-emerald-600">
                        {row.inQty > 0 ? `+${row.inQty.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-red-500">
                        {row.outQty > 0 ? `-${row.outQty.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                        {row.balanceQty.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">{row.user}</td>
                    </tr>
                  ))}
                  {filteredLedger.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400">
                        No transactions found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <TablePagination
              currentPage={ledgerPage}
              totalPages={totalLedgerPages}
              totalItems={totalLedgerItems}
              pageSize={ledgerPageSize}
              onPageChange={setLedgerPage}
              onPageSizeChange={setLedgerPageSize}
            />
          </CardContent>
        </Card>
      )}

      {/* Enhanced Stock Movement & Supplier Connection Modal */}
      {showAdjModal && currentMaterial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-4 flex justify-center items-start sm:items-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full my-auto flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b p-4 sm:p-5 shrink-0 bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-[#146b68] dark:text-[#84cc16]" />
                  Authorized Stock Movement & Traceability Entry
                </h2>
                <p className="text-[11px] text-slate-500">
                  Connect inbound supplier receipts, RTV debit notes, and shop floor adjustments with full lot tracking.
                </p>
              </div>
              <button
                onClick={() => setShowAdjModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleApplyMovement} className="flex flex-col min-h-0 flex-1">
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Step 1: Direction Toggle */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  1. Movement Direction *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMovementDirection('IN')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      movementDirection === 'IN'
                        ? 'border-[#84cc16] bg-[#84cc16]/10 text-[#183638] dark:text-[#84cc16] ring-2 ring-[#84cc16]/30'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600'
                    }`}
                  >
                    <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                    <span>🟢 Stock IN (Inbound Receipt / Surplus)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovementDirection('OUT')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      movementDirection === 'OUT'
                        ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 ring-2 ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 text-rose-600" />
                    <span>🔴 Stock OUT (RTV / Scrap / Issue)</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Select Material & Target Warehouse */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    2. Select Material *
                  </label>
                  <select
                    value={selectedMatId}
                    onChange={(e) => setSelectedMatId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 font-medium"
                  >
                    {materials.length === 0 ? (
                      <option value="">No raw materials found. Please add materials in Master Data first.</option>
                    ) : (
                      <>
                        <option value="">-- Select Material --</option>
                        {materials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.code} - {m.name} ({m.currentStock} {m.uom})
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  {materials.length === 0 && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                      ⚠️ No raw materials available. Please add materials in Master Data &gt; Materials first.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    3. {movementDirection === 'IN' ? 'Destination Warehouse' : 'Source Warehouse'} *
                  </label>
                  <select
                    value={targetWarehouse}
                    onChange={(e) => setTargetWarehouse(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 font-medium"
                  >
                    {dynamicWarehouses.length === 0 ? (
                      <option value="">No warehouses found. Please add a warehouse in Master Data first.</option>
                    ) : (
                      <>
                        <option value="">-- Select Warehouse --</option>
                        {dynamicWarehouses.map((wh) => (
                          <option key={wh} value={wh}>
                            {wh}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  {dynamicWarehouses.length === 0 && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                      ⚠️ No warehouses available. Please add a warehouse in Master Data &gt; Vendors &amp; Warehouses first.
                    </p>
                  )}
                </div>
              </div>

              {/* Step 3: Transaction Specific Category */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  4. Transaction Subtype *
                </label>
                {movementDirection === 'IN' ? (
                  <select
                    value={inboundCategory}
                    onChange={(e) => setInboundCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 font-medium text-emerald-800 dark:text-emerald-300"
                  >
                    <option value="Supplier Inbound (Direct)">Direct Supplier Inbound Delivery (Non-PO / Spot Delivery)</option>
                    <option value="Physical Count Surplus">Physical Cycle Count Surplus (Audit Finding)</option>
                    <option value="Production Floor Return">Production Floor Return (Outside Standard Kit)</option>
                    <option value="Opening Balance Upload">Opening Balance Upload / Initial Stock Count</option>
                  </select>
                ) : (
                  <select
                    value={outboundCategory}
                    onChange={(e) => setOutboundCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 font-medium text-rose-800 dark:text-rose-300"
                  >
                    <option value="Return to Vendor (RTV)">Return to Vendor (RTV) - Defective Component Lots</option>
                    <option value="Scrap / Damage Disposal">Scrap & Damage Disposal (QA Test Breakdown)</option>
                    <option value="Sample / Engineering Issue">Engineering & Photometric Sample Issuance</option>
                    <option value="Physical Count Deficit">Physical Count Deficit (Shrinkage Write-off)</option>
                  </select>
                )}
              </div>

              {/* Step 4: Conditional Supplier & Commercial Traceability Fields */}
              {(inboundCategory === 'Supplier Inbound (Direct)' || outboundCategory === 'Return to Vendor (RTV)') && (
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <Building className="w-4 h-4 text-[#146b68] dark:text-[#84cc16]" />
                    <span>Supplier Connection & Regulatory Invoicing</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">
                        Supplier / Vendor Name *
                      </label>
                      <select
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border rounded-lg p-2"
                      >
                        {allSuppliers.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {movementDirection === 'IN' ? (
                      <div>
                        <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">
                          Supplier Invoice / DC # *
                        </label>
                        <Input
                          placeholder="e.g. INV-2026-9812 or DC-441"
                          value={invoiceNo}
                          onChange={(e) => setInvoiceNo(e.target.value)}
                          className="h-8 bg-white dark:bg-slate-900 font-mono text-xs"
                          required
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">
                          Debit Note (DN) # *
                        </label>
                        <Input
                          placeholder="e.g. DN-2026-042"
                          value={debitNoteNo}
                          onChange={(e) => setDebitNoteNo(e.target.value)}
                          className="h-8 bg-white dark:bg-slate-900 font-mono text-xs text-rose-600 font-bold"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">
                        Supplier Batch / Lot # (LED Bin / Driver Lot) *
                      </label>
                      <Input
                        placeholder="e.g. LOT-LM-865-B4"
                        value={batchNo}
                        onChange={(e) => setBatchNo(e.target.value)}
                        className="h-8 bg-white dark:bg-slate-900 font-mono text-xs"
                        required
                      />
                      <span className="text-[10px] text-slate-400">
                        Essential for LED CCT chromaticity binning & driver warranty tracking.
                      </span>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">
                        Unit Purchase Rate (₹) *
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={unitCost}
                        onChange={(e) => setUnitCost(Number(e.target.value))}
                        className="h-8 bg-white dark:bg-slate-900 font-bold text-xs"
                      />
                      <span className="text-[10px] text-slate-400">
                        Updates total inventory valuation in financial ledger.
                      </span>
                    </div>
                  </div>

                  {movementDirection === 'OUT' && outboundCategory === 'Return to Vendor (RTV)' && (
                    <div>
                      <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">
                        RTV Defect & Rejection Justification *
                      </label>
                      <select
                        value={rtvDefectReason}
                        onChange={(e) => setRtvDefectReason(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border rounded-lg p-2"
                      >
                        <option value="Electrical parameter / CCT chromaticity drift beyond spec">
                          Electrical parameter / CCT chromaticity drift beyond spec
                        </option>
                        <option value="Low Power Factor (PF < 0.90) on Driver Analyzer">
                          Low Power Factor (PF &lt; 0.90) on Driver Analyzer
                        </option>
                        <option value="Cold solder joints & PCB track oxidation">
                          Cold solder joints & PCB track oxidation
                        </option>
                        <option value="Die-cast dimensional distortion / threading defect">
                          Die-cast dimensional distortion / threading defect
                        </option>
                        <option value="Optical diffuser micro-cracks & yellowing">
                          Optical diffuser micro-cracks & yellowing
                        </option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Scrap specific details */}
              {movementDirection === 'OUT' && outboundCategory === 'Scrap / Damage Disposal' && (
                <div className="p-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/20 space-y-2">
                  <label className="block font-semibold text-red-800 dark:text-red-300">
                    QA Scrap Failure Cause *
                  </label>
                  <select
                    value={scrapReason}
                    onChange={(e) => setScrapReason(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border rounded-lg p-2 text-xs"
                  >
                    <option value="Damaged / Hi-Pot breakdown during QA verification">
                      Damaged / Hi-Pot breakdown during QA verification
                    </option>
                    <option value="High voltage surge protection failure (MOV blowout)">
                      High voltage surge protection failure (MOV blowout)
                    </option>
                    <option value="Transit cracking / shop floor drops">
                      Transit cracking / shop floor drops
                    </option>
                    <option value="Assembly line thermal potting overflow damage">
                      Assembly line thermal potting overflow damage
                    </option>
                  </select>
                </div>
              )}

              {/* Step 5: Quantity & Reason */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    5. Quantity ({currentMaterial.uom}) *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max={movementDirection === 'OUT' ? currentMaterial.currentStock : undefined}
                    required
                    value={adjQuantity || ''}
                    onChange={(e) => setAdjQuantity(Number(e.target.value))}
                    className="h-9 font-bold text-sm"
                    placeholder="Enter quantity"
                  />
                  {movementDirection === 'OUT' && (
                    <span className="text-[10px] text-slate-400">
                      Max available: {currentMaterial.currentStock} {currentMaterial.uom}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    6. Authorized Officer *
                  </label>
                  <select
                    value={authorizingPerson}
                    onChange={(e) => setAuthorizingPerson(e.target.value)}
                    className="w-full h-9 bg-slate-50 dark:bg-slate-800 border rounded-lg px-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    required
                  >
                    {authorizedEmployees.length === 0 ? (
                      <option value="">No authorized officers available. Please onboard managers first.</option>
                    ) : (
                      <>
                        <option value="">-- Select Authorized Officer --</option>
                        {authorizedEmployees.map((emp) => (
                          <option key={emp.id} value={`${emp.name} (${emp.role})`}>
                            {emp.name} &bull; {emp.role} ({emp.plant || 'All Plants'})
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  {authorizedEmployees.length === 0 && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                      ⚠️ No authorized officers available. Please onboard supervisors/managers in Employees page first.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  7. Transaction Remarks & Audit Notes *
                </label>
                <textarea
                  required
                  rows={2}
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs"
                  placeholder="e.g. Received urgent component delivery at Pune factory gate pass #GP-8812; inspected and cleared by QA."
                />
              </div>

              {/* Real-time Calculation & Traceability Preview Card */}
              {adjQuantity > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="text-slate-400">Projected Inventory Impact</div>
                    <div className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {currentMaterial.currentStock} {currentMaterial.uom}{' '}
                      <span className={movementDirection === 'IN' ? 'text-emerald-600 font-extrabold' : 'text-red-500 font-extrabold'}>
                        {movementDirection === 'IN' ? `+ ${adjQuantity}` : `- ${adjQuantity}`}
                      </span>{' '}
                      = {movementDirection === 'IN' ? currentMaterial.currentStock + adjQuantity : currentMaterial.currentStock - adjQuantity} {currentMaterial.uom}
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-slate-400">Transaction Value</div>
                    <div className="font-bold text-sm text-[#146b68] dark:text-[#84cc16]">
                      ₹{(adjQuantity * unitCost).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              )}

              </div>

              {/* Modal Actions - PINNED FOOTER */}
              <div className="p-4 border-t shrink-0 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAdjModal(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                  Post Transaction to Ledger
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Material Specifications Modal */}
      {showEditMatModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-4 flex justify-center items-start sm:items-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full my-auto flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b p-4 sm:p-5 shrink-0 bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-blue-600" />
                  Edit Material Specifications
                </h2>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{editMatCode}</p>
              </div>
              <button onClick={() => setShowEditMatModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEditMaterial} className="flex flex-col min-h-0 flex-1">
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Description / Spec</label>
                  <Input
                    required
                    value={editMatName}
                    onChange={(e) => setEditMatName(e.target.value)}
                    className="h-9"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-semibold">Category *</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditCustomCategory(!isEditCustomCategory);
                          if (!isEditCustomCategory) setEditCustomCategoryInput('');
                        }}
                        className="text-[10px] text-[#146b68] dark:text-[#84cc16] hover:underline font-semibold"
                      >
                        {isEditCustomCategory ? '← Choose Existing' : '+ Add Custom'}
                      </button>
                    </div>
                    {isEditCustomCategory ? (
                      <Input
                        placeholder="Type custom category..."
                        value={editCustomCategoryInput}
                        onChange={(e) => setEditCustomCategoryInput(e.target.value)}
                        required
                        autoFocus
                        className="h-9 font-medium border-[#84cc16] focus:ring-[#84cc16]"
                      />
                    ) : (
                      <Select
                        value={editMatCategory}
                        onValueChange={(val) => {
                          if (val === '__custom__') {
                            setIsEditCustomCategory(true);
                            setEditCustomCategoryInput('');
                          } else {
                            setEditMatCategory(val);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {dynamicCategories.map((cat) => (
                            <SelectItem key={cat} value={cat} className="text-xs font-medium">
                              {cat}
                            </SelectItem>
                          ))}
                          <SelectItem value="__custom__" className="text-xs font-bold text-[#146b68] dark:text-[#84cc16]">
                            + Add Custom Category...
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Unit of Measure (UOM)</label>
                    <Select value={editMatUom} onValueChange={setEditMatUom}>
                      <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                        <SelectValue placeholder="Select UOM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pcs">Pcs</SelectItem>
                        <SelectItem value="Meters">Meters</SelectItem>
                        <SelectItem value="Sets">Sets</SelectItem>
                        <SelectItem value="Kg">Kg</SelectItem>
                        <SelectItem value="Rolls">Rolls</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Primary Supplier</label>
                    <Select value={editMatSupplier} onValueChange={setEditMatSupplier}>
                      <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                        <SelectValue placeholder="-- Select Supplier --" />
                      </SelectTrigger>
                      <SelectContent>
                        {allSuppliers.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Assigned Warehouse</label>
                    <Select value={editMatWarehouse} onValueChange={setEditMatWarehouse}>
                      <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                        <SelectValue placeholder="-- Select Warehouse --" />
                      </SelectTrigger>
                      <SelectContent>
                        {dynamicWarehouses.map((wh) => (
                          <SelectItem key={wh} value={wh} className="text-xs">
                            {wh}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Rack / Bin Location</label>
                    <Input
                      value={editMatLocation}
                      onChange={(e) => setEditMatLocation(e.target.value)}
                      className="h-9 font-mono"
                      placeholder="e.g. RACK-B2-04"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Unit Standard Cost (₹)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editMatCost}
                      onChange={(e) => setEditMatCost(Number(e.target.value))}
                      className="h-9 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Safety Stock</label>
                    <Input
                      type="number"
                      value={editMatSafetyStock}
                      onChange={(e) => setEditMatSafetyStock(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Reorder Point</label>
                    <Input
                      type="number"
                      value={editMatReorderLevel}
                      onChange={(e) => setEditMatReorderLevel(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Max Level</label>
                    <Input
                      type="number"
                      value={editMatMaxStock}
                      onChange={(e) => setEditMatMaxStock(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Material Status</label>
                  <select
                    value={editMatStatus}
                    onChange={(e) => setEditMatStatus(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="p-4 border-t shrink-0 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditMatModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]">
                  Save Specifications
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
