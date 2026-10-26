import React, { useState } from 'react';
import {
  Database,
  PlusCircle,
  Layers,
  Boxes,
  Truck,
  Building,
  CheckCircle2,
  DollarSign,
  Trash2,
  Save,
  Sliders,
  Sparkles,
  Edit2
} from 'lucide-react';
import { useMipsStore } from '@/store/useMipsStore';
import type { Material, Product, BOMItem, Customer } from '@/store/useMipsStore';
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

interface SupplierItem {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  leadTimeAvg: number;
}

interface WarehouseItem {
  id: string;
  name: string;
  plant: string;
  type: string;
  capacityUnits: number;
  manager?: string;
}

export const MastersPage: React.FC = () => {
  const {
    materials,
    products,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    addProduct,
    updateProduct,
    deleteProduct,
    customers,
    updateCustomer,
    employees,
    plants,
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    warehouses,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse,
  } = useMipsStore();

  const [activeTab, setActiveTab] = useState<'materials' | 'products' | 'bom' | 'suppliers' | 'customers' | 'warehouses'>('materials');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);

  // Modals
  const [showAddMatModal, setShowAddMatModal] = useState(false);
  const [showAddProdModal, setShowAddProdModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showAddWarehouseModal, setShowAddWarehouseModal] = useState(false);

  // New Material form state
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'Electronics' | 'Mechanical' | 'Optical' | 'Hardware' | 'Packaging'>('Electronics');
  const [newUom, setNewUom] = useState('Pcs');
  const [newSupplier, setNewSupplier] = useState(suppliers[0]?.name || '');
  const [newWarehouse, setNewWarehouse] = useState(warehouses[0]?.name || '');
  const [newCost, setNewCost] = useState<number>(10);
  const [newLeadTime, setNewLeadTime] = useState<number>(7);
  const [newSafetyStock, setNewSafetyStock] = useState<number>(1000);
  const [newReorderLevel, setNewReorderLevel] = useState<number>(2000);

  // New Product form state
  const [newProdCode, setNewProdCode] = useState('');
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'LED Bulbs' | 'Downlights' | 'Battens' | 'Floodlights' | 'Architectural & Gate'>('LED Bulbs');
  const [newProdWattage, setNewProdWattage] = useState('12W');
  const [newProdCost, setNewProdCost] = useState<number>(150);

  // BOM Editor State
  const [editingBOM, setEditingBOM] = useState<BOMItem[]>(selectedProduct?.bom || []);
  const [addBomMatId, setAddBomMatId] = useState(materials[0]?.id || '');
  const [addBomQty, setAddBomQty] = useState<number>(1);
  const [bomSaveSuccess, setBomSaveSuccess] = useState(false);

  // New Supplier form state
  const [newSupName, setNewSupName] = useState('');
  const [newSupCat, setNewSupCat] = useState('Electronics (LEDs, Drivers, PCBs)');
  const [newSupContact, setNewSupContact] = useState('');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupLead, setNewSupLead] = useState<number>(7);

  // New Warehouse form state
  const [newWhName, setNewWhName] = useState('');
  const [newWhPlant, setNewWhPlant] = useState('Plant 1 - Pune');
  const [newWhType, setNewWhType] = useState('Raw Materials');
  const [newWhCapacity, setNewWhCapacity] = useState<number>(50000);
  const [newWhManager, setNewWhManager] = useState('Ramesh Sharma (Store Manager)');

  // Search & Filter state for Materials
  const [matSearch, setMatSearch] = useState('');
  const [matCatFilter, setMatCatFilter] = useState('All');
  const [matWattageFilter, setMatWattageFilter] = useState('All');

  // Search & Filter state for Products
  const [prodSearch, setProdSearch] = useState('');
  const [prodCatFilter, setProdCatFilter] = useState('All');
  const [prodWattageFilter, setProdWattageFilter] = useState('All');

  const dynamicMatCats = React.useMemo(() => {
    return Array.from(new Set(materials.map((m) => m.category).filter(Boolean)));
  }, [materials]);

  const dynamicProdCats = React.useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  }, [products]);

  const filteredMaterials = React.useMemo(() => {
    return materials.filter((m) => {
      const q = matSearch.toLowerCase();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        (m.supplier && m.supplier.toLowerCase().includes(q));
      const matchesCat = matCatFilter === 'All' || m.category === matCatFilter;
      const matchesWattage =
        matWattageFilter === 'All' ||
        m.code.toLowerCase().includes(matWattageFilter.toLowerCase()) ||
        m.name.toLowerCase().includes(matWattageFilter.toLowerCase()) ||
        products.some(
          (p) =>
            p.wattage === matWattageFilter &&
            p.bom.some((b) => b.materialId === m.id || b.materialCode === m.code)
        );
      return matchesSearch && matchesCat && matchesWattage;
    });
  }, [materials, products, matSearch, matCatFilter, matWattageFilter]);

  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      const q = prodSearch.toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q);
      const matchesCat = prodCatFilter === 'All' || p.category === prodCatFilter;
      const matchesWattage = prodWattageFilter === 'All' || p.wattage === prodWattageFilter;
      return matchesSearch && matchesCat && matchesWattage;
    });
  }, [products, prodSearch, prodCatFilter, prodWattageFilter]);

  const {
    currentPage: matPage,
    setCurrentPage: setMatPage,
    pageSize: matPageSize,
    setPageSize: setMatPageSize,
    totalItems: totalMatItems,
    totalPages: totalMatPages,
    paginatedItems: paginatedMaterials,
  } = usePagination(filteredMaterials, 10);

  const {
    currentPage: prodPage,
    setCurrentPage: setProdPage,
    pageSize: prodPageSize,
    setPageSize: setProdPageSize,
    totalItems: totalProdItems,
    totalPages: totalProdPages,
    paginatedItems: paginatedProducts,
  } = usePagination(filteredProducts, 9);

  React.useEffect(() => {
    setMatPage(1);
  }, [matSearch, matCatFilter, matWattageFilter]);

  React.useEffect(() => {
    setProdPage(1);
  }, [prodSearch, prodCatFilter, prodWattageFilter]);

  const {
    currentPage: supPage,
    setCurrentPage: setSupPage,
    pageSize: supPageSize,
    setPageSize: setSupPageSize,
    totalItems: totalSupItems,
    totalPages: totalSupPages,
    paginatedItems: paginatedSuppliers,
  } = usePagination(suppliers, 10);

  const {
    currentPage: custPage,
    setCurrentPage: setCustPage,
    pageSize: custPageSize,
    setPageSize: setCustPageSize,
    totalItems: totalCustItems,
    totalPages: totalCustPages,
    paginatedItems: paginatedCustomers,
  } = usePagination(customers, 10);

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    addMaterial({
      code: newCode,
      name: newName,
      category: newCategory,
      uom: newUom,
      supplier: newSupplier || 'Standard Vendor',
      warehouse: newWarehouse,
      location: 'Bin General',
      currentStock: 0,
      stockWithEmployees: 0,
      minStock: newSafetyStock,
      maxStock: newSafetyStock * 5,
      reorderLevel: newReorderLevel,
      safetyStock: newSafetyStock,
      leadTimeDays: newLeadTime,
      standardCost: newCost,
      status: 'Active',
    });

    setShowAddMatModal(false);
    setNewCode('');
    setNewName('');
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdCode || !newProdName) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      code: newProdCode,
      name: newProdName,
      category: newProdCategory,
      wattage: newProdWattage,
      unit: 'Unit',
      standardCost: newProdCost,
      status: 'Active',
      bom: [],
    };

    addProduct(newProd);
    setSelectedProduct(newProd);
    setEditingBOM([]);
    setShowAddProdModal(false);
    setActiveTab('bom');
  };

  const handleAddBOMItem = () => {
    const mat = materials.find((m) => m.id === addBomMatId);
    if (!mat) return;

    // Check if item already exists
    if (editingBOM.some((b) => b.materialId === mat.id)) {
      alert('This material is already in the BOM recipe.');
      return;
    }

    const newItem: BOMItem = {
      materialId: mat.id,
      materialCode: mat.code,
      materialName: mat.name,
      qtyPerUnit: addBomQty,
      uom: mat.uom,
    };

    setEditingBOM([...editingBOM, newItem]);
  };

  const handleRemoveBOMItem = (matId: string) => {
    setEditingBOM(editingBOM.filter((b) => b.materialId !== matId));
  };

  const handleSaveBOM = () => {
    if (!selectedProduct) return;
    selectedProduct.bom = editingBOM;

    // Recalculate standard cost from BOM
    const computedCost = editingBOM.reduce((acc, item) => {
      const mat = materials.find((m) => m.id === item.materialId);
      return acc + (mat ? mat.standardCost * item.qtyPerUnit : 0);
    }, 0);

    const roundedCost = Number(computedCost.toFixed(2));
    selectedProduct.standardCost = roundedCost;
    updateProduct(selectedProduct.id, { bom: editingBOM, standardCost: roundedCost });

    setBomSaveSuccess(true);
    setTimeout(() => setBomSaveSuccess(false), 3000);
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName) return;

    addSupplier({
      name: newSupName,
      category: newSupCat || 'General Components',
      contactPerson: newSupContact,
      phone: newSupPhone,
      email: `${newSupName.toLowerCase().replace(/\s+/g, '')}@vendor.com`,
      leadTimeAvg: newSupLead,
    });

    setShowAddSupplierModal(false);
    setNewSupName('');
  };

  const handleAddWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWhName) return;

    addWarehouse({
      name: newWhName,
      plant: newWhPlant,
      type: newWhType,
      capacityUnits: newWhCapacity,
      manager: newWhManager || 'Ramesh Sharma (Store Manager)',
    });

    setShowAddWarehouseModal(false);
    setNewWhName('');
  };

  // Edit Material state
  const [showEditMatModal, setShowEditMatModal] = useState(false);
  const [editingMatId, setEditingMatId] = useState('');
  const [editMatName, setEditMatName] = useState('');
  const [editMatCategory, setEditMatCategory] = useState<Material['category']>('Electronics');
  const [editMatUom, setEditMatUom] = useState('Pcs');
  const [editMatSupplier, setEditMatSupplier] = useState('');
  const [editMatWarehouse, setEditMatWarehouse] = useState('');
  const [editMatCost, setEditMatCost] = useState<number>(10);
  const [editMatLeadTime, setEditMatLeadTime] = useState<number>(7);
  const [editMatSafetyStock, setEditMatSafetyStock] = useState<number>(1000);
  const [editMatReorderLevel, setEditMatReorderLevel] = useState<number>(2000);
  const [editMatStatus, setEditMatStatus] = useState<Material['status']>('Active');

  const handleOpenEditMat = (m: Material) => {
    setEditingMatId(m.id);
    setEditMatName(m.name);
    setEditMatCategory(m.category);
    setEditMatUom(m.uom);
    setEditMatSupplier(m.supplier);
    setEditMatWarehouse(m.warehouse || warehouses[0]?.name || '');
    setEditMatCost(m.standardCost);
    setEditMatLeadTime(m.leadTimeDays);
    setEditMatSafetyStock(m.safetyStock);
    setEditMatReorderLevel(m.reorderLevel);
    setEditMatStatus(m.status);
    setShowEditMatModal(true);
  };

  const handleSaveEditMat = (e: React.FormEvent) => {
    e.preventDefault();
    updateMaterial(editingMatId, {
      name: editMatName,
      category: editMatCategory,
      uom: editMatUom,
      supplier: editMatSupplier,
      warehouse: editMatWarehouse,
      standardCost: editMatCost,
      leadTimeDays: editMatLeadTime,
      safetyStock: editMatSafetyStock,
      reorderLevel: editMatReorderLevel,
      status: editMatStatus,
    });
    setShowEditMatModal(false);
  };

  // Edit Product state
  const [showEditProdModal, setShowEditProdModal] = useState(false);
  const [editingProdId, setEditingProdId] = useState('');
  const [editProdCode, setEditProdCode] = useState('');
  const [editProdName, setEditProdName] = useState('');
  const [editProdCategory, setEditProdCategory] = useState<Product['category']>('LED Bulbs');
  const [editProdWattage, setEditProdWattage] = useState('12W');
  const [editProdCost, setEditProdCost] = useState<number>(150);
  const [editProdStatus, setEditProdStatus] = useState<Product['status']>('Active');

  const handleOpenEditProd = (p: Product) => {
    setEditingProdId(p.id);
    setEditProdCode(p.code);
    setEditProdName(p.name);
    setEditProdCategory(p.category);
    setEditProdWattage(p.wattage || '12W');
    setEditProdCost(p.standardCost);
    setEditProdStatus(p.status);
    setShowEditProdModal(true);
  };

  const handleSaveEditProd = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct(editingProdId, {
      code: editProdCode,
      name: editProdName,
      category: editProdCategory,
      wattage: editProdWattage,
      standardCost: editProdCost,
      status: editProdStatus,
    });
    if (selectedProduct?.id === editingProdId) {
      setSelectedProduct({
        ...selectedProduct,
        code: editProdCode,
        name: editProdName,
        category: editProdCategory,
        wattage: editProdWattage,
        standardCost: editProdCost,
        status: editProdStatus,
      });
    }
    setShowEditProdModal(false);
  };

  // Edit Supplier state
  const [showEditSupplierModal, setShowEditSupplierModal] = useState(false);
  const [editingSupId, setEditingSupId] = useState('');
  const [editSupName, setEditSupName] = useState('');
  const [editSupCat, setEditSupCat] = useState('');
  const [editSupContact, setEditSupContact] = useState('');
  const [editSupPhone, setEditSupPhone] = useState('');
  const [editSupEmail, setEditSupEmail] = useState('');
  const [editSupLead, setEditSupLead] = useState<number>(7);

  const handleOpenEditSupplier = (s: SupplierItem) => {
    setEditingSupId(s.id);
    setEditSupName(s.name);
    setEditSupCat(s.category);
    setEditSupContact(s.contactPerson);
    setEditSupPhone(s.phone);
    setEditSupEmail(s.email);
    setEditSupLead(s.leadTimeAvg);
    setShowEditSupplierModal(true);
  };

  const handleSaveEditSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupplier(editingSupId, {
      name: editSupName,
      category: editSupCat,
      contactPerson: editSupContact,
      phone: editSupPhone,
      email: editSupEmail,
      leadTimeAvg: editSupLead,
    });
    setShowEditSupplierModal(false);
  };

  // Edit Warehouse state
  const [showEditWarehouseModal, setShowEditWarehouseModal] = useState(false);
  const [editingWhId, setEditingWhId] = useState('');
  const [editWhName, setEditWhName] = useState('');
  const [editWhPlant, setEditWhPlant] = useState('');
  const [editWhType, setEditWhType] = useState('');
  const [editWhCapacity, setEditWhCapacity] = useState<number>(50000);
  const [editWhManager, setEditWhManager] = useState('');

  const handleOpenEditWarehouse = (w: WarehouseItem) => {
    setEditingWhId(w.id);
    setEditWhName(w.name);
    setEditWhPlant(w.plant);
    setEditWhType(w.type);
    setEditWhCapacity(w.capacityUnits);
    setEditWhManager(w.manager);
    setShowEditWarehouseModal(true);
  };

  const handleSaveEditWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    updateWarehouse(editingWhId, {
      name: editWhName,
      plant: editWhPlant,
      type: editWhType,
      capacityUnits: editWhCapacity,
      manager: editWhManager,
    });
    setShowEditWarehouseModal(false);
  };

  // Edit Customer state
  const [showEditCustModal, setShowEditCustModal] = useState(false);
  const [editingCustId, setEditingCustId] = useState('');
  const [editCustName, setEditCustName] = useState('');
  const [editCustCat, setEditCustCat] = useState<Customer['category']>('B2B Brand OEM');
  const [editCustGstin, setEditCustGstin] = useState('');
  const [editCustCity, setEditCustCity] = useState('');
  const [editCustState, setEditCustState] = useState('');
  const [editCustContact, setEditCustContact] = useState('');
  const [editCustPhone, setEditCustPhone] = useState('');
  const [editCustEmail, setEditCustEmail] = useState('');
  const [editCustPayment, setEditCustPayment] = useState('30 Days PDC');

  const handleOpenEditCust = (c: Customer) => {
    setEditingCustId(c.id);
    setEditCustName(c.name);
    setEditCustCat(c.category);
    setEditCustGstin(c.gstin);
    setEditCustCity(c.city);
    setEditCustState(c.state);
    setEditCustContact(c.contactPerson);
    setEditCustPhone(c.phone);
    setEditCustEmail(c.email);
    setEditCustPayment(c.paymentTerms);
    setShowEditCustModal(true);
  };

  const handleSaveEditCust = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomer(editingCustId, {
      name: editCustName,
      category: editCustCat,
      gstin: editCustGstin,
      city: editCustCity,
      state: editCustState,
      contactPerson: editCustContact,
      phone: editCustPhone,
      email: editCustEmail,
      paymentTerms: editCustPayment,
    });
    setShowEditCustModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-600" />
            Master Data & Product Structure (BOM)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, configure and manage Raw Materials, Finished Luminaires, interactive BOMs, Suppliers and Warehouses.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'materials' && (
            <Button
              onClick={() => setShowAddMatModal(true)}
              className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Create Material
            </Button>
          )}

          {activeTab === 'products' && (
            <Button
              onClick={() => setShowAddProdModal(true)}
              className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Create Product
            </Button>
          )}

          {activeTab === 'suppliers' && (
            <Button
              onClick={() => setShowAddSupplierModal(true)}
              className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Register Supplier
            </Button>
          )}

          {activeTab === 'warehouses' && (
            <Button
              onClick={() => setShowAddWarehouseModal(true)}
              className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Add Warehouse
            </Button>
          )}

          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center flex-wrap">
            <button
              onClick={() => setActiveTab('materials')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'materials'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Materials ({materials.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'products'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('bom');
                setEditingBOM(selectedProduct?.bom || []);
              }}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'bom'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              BOM Builder
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'suppliers'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Suppliers ({suppliers.length})
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'customers'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Buyers ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab('warehouses')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'warehouses'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Warehouses ({warehouses.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Material Master */}
      {activeTab === 'materials' && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold">Raw Material Master Registry</CardTitle>
                <CardDescription>
                  Materials drive production, inventory balances, lead times, safety stocks, and standard costing.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 max-w-xs">
                  <Input
                    placeholder="Search material code, name..."
                    value={matSearch}
                    onChange={(e) => setMatSearch(e.target.value)}
                    className="h-8 text-xs w-44"
                  />
                </div>
                <Select value={matCatFilter} onValueChange={setMatCatFilter}>
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {dynamicMatCats.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={matWattageFilter} onValueChange={setMatWattageFilter}>
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
                {(matSearch || matCatFilter !== 'All' || matWattageFilter !== 'All') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMatSearch('');
                      setMatCatFilter('All');
                      setMatWattageFilter('All');
                    }}
                    className="h-8 text-xs text-slate-500 hover:text-red-600 px-2"
                  >
                    Reset
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => setShowAddMatModal(true)}
                  className="text-xs bg-[#183638] hover:bg-[#122b2d] text-[#84cc16] border border-[#84cc16]/40 font-semibold"
                >
                  + Add New Material
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Primary Supplier</th>
                    <th className="py-2.5 px-3 text-right">Lead Time</th>
                    <th className="py-2.5 px-3 text-right">Safety Stock</th>
                    <th className="py-2.5 px-3 text-right">Reorder Level</th>
                    <th className="py-2.5 px-3 text-right">Unit Cost</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedMaterials.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400 text-sm">
                        No materials match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedMaterials.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                        <td className="py-3 px-3 font-mono font-semibold text-blue-600">{m.code}</td>
                        <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">{m.name}</td>
                        <td className="py-3 px-3">
                          <Badge variant="secondary" className="text-[10px]">
                            {m.category}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{m.supplier}</td>
                        <td className="py-3 px-3 text-right text-slate-500">{m.leadTimeDays} days</td>
                        <td className="py-3 px-3 text-right font-medium">
                          {m.safetyStock.toLocaleString()} {m.uom}
                        </td>
                        <td className="py-3 px-3 text-right font-medium">
                          {m.reorderLevel.toLocaleString()} {m.uom}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                          ₹{m.standardCost.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                            {m.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditMat(m)}
                            className="h-7 text-xs px-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/40"
                          >
                            <Edit2 className="w-3.5 h-3.5 mr-1" />
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <TablePagination
              currentPage={matPage}
              totalPages={totalMatPages}
              totalItems={totalMatItems}
              pageSize={matPageSize}
              onPageChange={setMatPage}
              onPageSizeChange={setMatPageSize}
            />
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Product Master */}
      {activeTab === 'products' && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold">Finished Products Catalog</CardTitle>
                <CardDescription>
                  Finished manufactured LED luminaires. Click any product to view or edit its linked Bill of Materials (BOM).
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 max-w-xs">
                  <Input
                    placeholder="Search product code, name..."
                    value={prodSearch}
                    onChange={(e) => setProdSearch(e.target.value)}
                    className="h-8 text-xs w-44"
                  />
                </div>

                <Select value={prodCatFilter} onValueChange={setProdCatFilter}>
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {dynamicProdCats.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={prodWattageFilter} onValueChange={setProdWattageFilter}>
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

                <Button
                  size="sm"
                  onClick={() => setShowAddProdModal(true)}
                  className="text-xs bg-[#183638] hover:bg-[#122b2d] text-[#84cc16] border border-[#84cc16]/40 font-semibold"
                >
                  + Create New Product
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No products match the selected criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paginatedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-mono font-bold text-blue-600 text-xs">{prod.code}</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                        {prod.wattage}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{prod.name}</h3>
                      <p className="text-xs text-slate-400">Category: {prod.category}</p>
                    </div>
                    <div className="pt-2 border-t flex items-center justify-between text-xs">
                      <span className="text-slate-500">Standard Cost:</span>
                      <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                        ₹{prod.standardCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 flex-wrap gap-1">
                      <span className="text-xs text-slate-400">{prod.bom.length} BOM components</span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEditProd(prod)}
                          className="h-7 text-xs px-2 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="w-3 h-3 mr-1 text-slate-500" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedProduct(prod);
                            setEditingBOM(prod.bom);
                            setActiveTab('bom');
                          }}
                          className="h-7 text-xs text-blue-600 hover:text-blue-700"
                        >
                          Edit BOM &rarr;
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <TablePagination
              currentPage={prodPage}
              totalPages={totalProdPages}
              totalItems={totalProdItems}
              pageSize={prodPageSize}
              pageSizeOptions={[6, 9, 15, 30]}
              onPageChange={setProdPage}
              onPageSizeChange={setProdPageSize}
            />
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Interactive Bill of Materials (BOM) Builder & Editor */}
      {activeTab === 'bom' && (
        products.length === 0 || !selectedProduct ? (
          <Card className="border border-slate-200 dark:border-slate-800 p-12 text-center">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">No Finished Products Found</h3>
            <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
              Please register at least one finished luminaire in the Products tab first before configuring its Bill of Materials.
            </p>
            <Button
              onClick={() => setActiveTab('products')}
              size="sm"
              className="bg-[#183638] text-[#84cc16] hover:bg-[#183638]/90 text-xs font-semibold"
            >
              Go to Products Tab
            </Button>
          </Card>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Select Finished Product</CardTitle>
              <CardDescription>Select luminaire to inspect or modify its recipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setEditingBOM(p.bom || []);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedProduct?.id === p.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-200">{p.name}</div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
                    <span className="font-mono text-blue-600">{p.code}</span>
                    <span className="font-semibold">{p.wattage}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border border-slate-200 dark:border-slate-800 space-y-4">
            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b">
              <div>
                <CardTitle className="text-base font-semibold">
                  Interactive BOM Builder: {selectedProduct.name}
                </CardTitle>
                <CardDescription>
                  Define component requirements to manufacture 1 finished unit of {selectedProduct.code}
                </CardDescription>
              </div>
              <Button
                onClick={handleSaveBOM}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save BOM Recipe
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              {bomSaveSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Bill of Materials successfully updated & standard product cost recalculated!
                </div>
              )}

              {/* Add Material to BOM Toolbar */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Select Material Component
                  </label>
                  <select
                    value={addBomMatId}
                    onChange={(e) => setAddBomMatId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border rounded-lg p-2 text-xs"
                  >
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.code} - {m.name} (₹{m.standardCost}/{m.uom})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-28">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Qty / Unit
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={addBomQty}
                    onChange={(e) => setAddBomQty(Math.max(1, Number(e.target.value)))}
                    className="h-8 text-xs font-bold"
                  />
                </div>

                <div className="sm:self-end">
                  <Button
                    onClick={handleAddBOMItem}
                    size="sm"
                    className="h-8 text-xs bg-[#183638] hover:bg-[#122b2d] text-[#84cc16] border border-[#84cc16]/40 font-semibold"
                  >
                    + Add to Recipe
                  </Button>
                </div>
              </div>

              {/* BOM Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Item #</th>
                      <th className="py-2 px-3">Component Description</th>
                      <th className="py-2 px-3 font-mono">Code</th>
                      <th className="py-2 px-3 text-right">Required Qty</th>
                      <th className="py-2 px-3 text-right">Unit Cost</th>
                      <th className="py-2 px-3 text-right">Total Cost / Unit</th>
                      <th className="py-2 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {editingBOM.map((item, idx) => {
                      const mat = materials.find((m) => m.id === item.materialId);
                      const unitCost = mat?.standardCost || 0;
                      const lineCost = unitCost * item.qtyPerUnit;

                      return (
                        <tr key={item.materialId} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                          <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                            {item.materialName}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-blue-600">{item.materialCode}</td>
                          <td className="py-2.5 px-3 text-right font-bold">
                            <div className="flex items-center justify-end gap-1">
                              <Input
                                type="number"
                                min="1"
                                value={item.qtyPerUnit}
                                onChange={(e) => {
                                  const val = Math.max(1, Number(e.target.value));
                                  setEditingBOM(editingBOM.map((b) => (b.materialId === item.materialId ? { ...b, qtyPerUnit: val } : b)));
                                }}
                                className="w-16 h-7 text-xs text-right font-bold p-1"
                              />
                              <span className="text-slate-500 font-normal text-[11px]">{item.uom}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-500">₹{unitCost.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                            ₹{lineCost.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => handleRemoveBOMItem(item.materialId)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Costing Summary */}
              <div className="pt-3 border-t flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Cumulative Standard Manufacturing Cost (BOM Sum):
                </span>
                <span className="text-lg font-bold text-blue-600">
                  ₹
                  {editingBOM
                    .reduce((acc, item) => {
                      const mat = materials.find((m) => m.id === item.materialId);
                      return acc + (mat ? mat.standardCost * item.qtyPerUnit : 0);
                    }, 0)
                    .toFixed(2)}{' '}
                  / unit
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        )
      )}

      {/* Tab 4: Suppliers Master */}
      {activeTab === 'suppliers' && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Vendor & Supplier Master</CardTitle>
              <CardDescription>
                Approved suppliers for LED chipsets, constant current drivers, die-cast housings, and packaging.
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => setShowAddSupplierModal(true)}
              className="text-xs bg-[#183638] hover:bg-[#122b2d] text-[#84cc16] border border-[#84cc16]/40 font-semibold"
            >
              + Register Supplier
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Supplier Name</th>
                    <th className="py-2.5 px-3">Category Supplied</th>
                    <th className="py-2.5 px-3">Contact Person</th>
                    <th className="py-2.5 px-3">Phone & Email</th>
                    <th className="py-2.5 px-3 text-right">Avg Lead Time</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedSuppliers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">{s.name}</td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="text-[10px]">
                          {s.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{s.contactPerson}</td>
                      <td className="py-3 px-3">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">{s.phone}</div>
                        <div className="text-[10px] text-slate-400">{s.email}</div>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-600">{s.leadTimeAvg} days</td>
                      <td className="py-3 px-3 text-center">
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                          Approved
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditSupplier(s)}
                          className="h-7 text-xs px-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/40"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination
              currentPage={supPage}
              totalPages={totalSupPages}
              totalItems={totalSupItems}
              pageSize={supPageSize}
              onPageChange={setSupPage}
              onPageSizeChange={setSupPageSize}
            />
          </CardContent>
        </Card>
      )}

      {/* Tab: Buyers & B2B Customers Master */}
      {activeTab === 'customers' && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Registered Buyers & B2B Client Directory</CardTitle>
              <CardDescription>
                Approved wholesale distributors, retail brand OEMs, and institutional buyers for finished LED luminaires.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Buyer Company Name</th>
                    <th className="py-2.5 px-3">Classification</th>
                    <th className="py-2.5 px-3">GSTIN / Tax ID</th>
                    <th className="py-2.5 px-3">Location (City, State)</th>
                    <th className="py-2.5 px-3">Contact Person</th>
                    <th className="py-2.5 px-3">Phone & Email</th>
                    <th className="py-2.5 px-3">Commercial Terms</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {c.name}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className={
                            c.category === 'B2B Brand OEM'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : c.category === 'Regional Distributor'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }
                        >
                          {c.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                        {c.gstin}
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {c.city}, {c.state}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                        {c.contactPerson}
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">{c.phone}</div>
                        <div className="text-[10px] text-slate-400">{c.email}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                        {c.paymentTerms}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditCust(c)}
                          className="h-7 text-xs px-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/40"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination
              currentPage={custPage}
              totalPages={totalCustPages}
              totalItems={totalCustItems}
              pageSize={custPageSize}
              onPageChange={setCustPage}
              onPageSizeChange={setCustPageSize}
            />
          </CardContent>
        </Card>
      )}

      {/* Tab 5: Warehouses & Storage Facilities */}
      {activeTab === 'warehouses' && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Warehouses & Plant Storage Facilities</CardTitle>
              <CardDescription>
                Physical storage locations across manufacturing plants and shop floor assembly buffers.
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => setShowAddWarehouseModal(true)}
              className="text-xs bg-[#183638] hover:bg-[#122b2d] text-[#84cc16] border border-[#84cc16]/40 font-semibold"
            >
              + Add Warehouse Location
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {warehouses.map((wh) => (
                <div
                  key={wh.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{wh.name}</span>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline">{wh.plant}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditWarehouse(wh)}
                        className="h-6 w-6 p-0 text-slate-400 hover:text-blue-600"
                        title="Edit Warehouse"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-slate-500">Type: <strong className="text-slate-700 dark:text-slate-300">{wh.type}</strong></div>
                  <div className="text-slate-500">Capacity: <strong className="text-blue-600">{wh.capacityUnits.toLocaleString()} units</strong></div>
                  <div className="text-slate-500">Store In-Charge: <strong className="text-slate-700 dark:text-slate-300">{wh.manager}</strong></div>
                </div>
              ))}
            </div>
            <TablePagination
              currentPage={prodPage}
              totalPages={totalProdPages}
              totalItems={totalProdItems}
              pageSize={prodPageSize}
              pageSizeOptions={[6, 9, 15, 30]}
              onPageChange={setProdPage}
              onPageSizeChange={setProdPageSize}
            />
          </CardContent>
        </Card>
      )}

      {/* Create Product Modal */}
      {showAddProdModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Create Finished Product
              </h2>
              <button onClick={() => setShowAddProdModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Product Code</label>
                  <Input
                    required
                    placeholder="e.g. EFL-BLB-15W"
                    value={newProdCode}
                    onChange={(e) => setNewProdCode(e.target.value)}
                    className="h-9 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  >
                    <option value="LED Bulbs">LED Bulbs</option>
                    <option value="Downlights">Downlights</option>
                    <option value="Battens">Battens</option>
                    <option value="Floodlights">Floodlights</option>
                    <option value="Architectural & Gate">Architectural & Gate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Luminaire Name</label>
                <Input
                  required
                  placeholder="e.g. Eiffel 15W High-Lumen Bulb (B22)"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Wattage</label>
                  <Input
                    placeholder="e.g. 15W"
                    value={newProdWattage}
                    onChange={(e) => setNewProdWattage(e.target.value)}
                    className="h-9 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Estimated Unit Cost (₹)</label>
                  <Input
                    type="number"
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(Number(e.target.value))}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddProdModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold">
                  Create Product & Configure BOM
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Register Vendor / Supplier
              </h2>
              <button onClick={() => setShowAddSupplierModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleAddSupplier} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Supplier Company Name</label>
                <Input
                  required
                  placeholder="e.g. Everlight Electronics Co."
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  className="h-9"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Component Category *</label>
                <select
                  value={newSupCat}
                  onChange={(e) => setNewSupCat(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-semibold"
                  required
                >
                  <option value="Electronics (LEDs, Drivers, PCBs)">Electronics (LEDs, Drivers, PCBs)</option>
                  <option value="Mechanical (Die-Cast, Housings, Endcaps)">Mechanical (Die-Cast, Housings, Endcaps)</option>
                  <option value="Optical (Diffusers, Lenses, PMMA)">Optical (Diffusers, Lenses, PMMA)</option>
                  <option value="Hardware (Fasteners, Cables, Connectors)">Hardware (Fasteners, Cables, Connectors)</option>
                  <option value="Packaging (Cartons, Polybags)">Packaging (Cartons, Polybags)</option>
                  <option value="General Components">General Components</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Contact Person</label>
                  <Input
                    placeholder="e.g. Rajesh Nair"
                    value={newSupContact}
                    onChange={(e) => setNewSupContact(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number</label>
                  <Input
                    placeholder="+91 98..."
                    value={newSupPhone}
                    onChange={(e) => setNewSupPhone(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Average Lead Time (Days)</label>
                <Input
                  type="number"
                  value={newSupLead}
                  onChange={(e) => setNewSupLead(Number(e.target.value))}
                  className="h-9"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddSupplierModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold">
                  Save Vendor
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Material Modal */}
      {showAddMatModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Register New Material
              </h2>
              <button onClick={() => setShowAddMatModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleAddMaterial} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Material Code</label>
                  <Input
                    required
                    placeholder="e.g. PCB-15W-HP"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="h-9 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Optical">Optical</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Packaging">Packaging</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description / Spec</label>
                <Input
                  required
                  placeholder="e.g. 15W High CRI LED Chipset Board"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Unit of Measure (UOM) *</label>
                  <select
                    value={newUom}
                    onChange={(e) => setNewUom(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-semibold"
                    required
                  >
                    <option value="Pcs">Pcs (Pieces)</option>
                    <option value="Nos">Nos (Numbers)</option>
                    <option value="Mtr">Mtr (Meters)</option>
                    <option value="Roll">Roll (Rolls)</option>
                    <option value="Kg">Kg (Kilograms)</option>
                    <option value="Set">Set (Sets)</option>
                    <option value="Box">Box (Boxes)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Primary Supplier *</label>
                  <select
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-semibold"
                    required
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Assigned Warehouse *</label>
                  <select
                    value={newWarehouse}
                    onChange={(e) => setNewWarehouse(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-semibold"
                    required
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.name}>
                        {w.name} ({w.plant})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Unit Cost (₹)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Lead Time (days)</label>
                  <Input
                    type="number"
                    value={newLeadTime}
                    onChange={(e) => setNewLeadTime(Number(e.target.value))}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Safety Stock</label>
                  <Input
                    type="number"
                    value={newSafetyStock}
                    onChange={(e) => setNewSafetyStock(Number(e.target.value))}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddMatModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold">
                  Save Material to Master
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Warehouse Modal */}
      {showAddWarehouseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Register Warehouse Location
              </h2>
              <button onClick={() => setShowAddWarehouseModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleAddWarehouse} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Warehouse Name</label>
                <Input
                  required
                  placeholder="e.g. SMT Buffer Store"
                  value={newWhName}
                  onChange={(e) => setNewWhName(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Plant</label>
                  <select
                    value={newWhPlant}
                    onChange={(e) => setNewWhPlant(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  >
                    {(plants || []).map((p) => (
                      <option key={p.id} value={`${p.name} - ${p.city}`}>
                        {p.name} ({p.city})
                      </option>
                    ))}
                    {(!plants || plants.length === 0) && (
                      <option value="">No plants registered yet</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Storage Type *</label>
                  <select
                    value={newWhType}
                    onChange={(e) => setNewWhType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-semibold"
                    required
                  >
                    <option value="Raw Materials">Raw Materials Store</option>
                    <option value="Finished Goods & Packaging">Finished Goods & Packaging Store</option>
                    <option value="WIP & Assembly Buffer">WIP & Assembly Buffer Store</option>
                    <option value="Quarantine & QC Hold">Quarantine & QC Hold Zone</option>
                    <option value="Engineering & Samples">Engineering & Samples Room</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Capacity (Units)</label>
                <Input
                  type="number"
                  value={newWhCapacity}
                  onChange={(e) => setNewWhCapacity(Number(e.target.value))}
                  className="h-9"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Store In-Charge / Warehouse Manager *</label>
                <select
                  value={newWhManager}
                  onChange={(e) => setNewWhManager(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-semibold"
                  required
                >
                  {(employees || []).map((emp) => (
                    <option key={emp.id} value={`${emp.name} (${emp.role})`}>
                      {emp.name} &bull; {emp.role} ({emp.plant || 'All Plants'})
                    </option>
                  ))}
                  {(!employees || employees.length === 0) && (
                    <>
                      <option value="Ramesh Sharma (Store Manager)">Ramesh Sharma &bull; Store Manager</option>
                      <option value="Anand Deshmukh (Plant Manager)">Anand Deshmukh &bull; Plant Manager</option>
                      <option value="Suresh Patil (Floor Supervisor)">Suresh Patil &bull; Floor Supervisor</option>
                    </>
                  )}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddWarehouseModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold">
                  Add Location
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Material Modal */}
      {showEditMatModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                Edit Raw Material
              </h2>
              <button onClick={() => setShowEditMatModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEditMat} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={editMatCategory}
                    onChange={(e) => setEditMatCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Optical">Optical</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Packaging">Packaging</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={editMatStatus}
                    onChange={(e) => setEditMatStatus(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Discontinued">Discontinued</option>
                  </select>
                </div>
              </div>

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
                  <label className="block font-semibold mb-1">Unit of Measure (UOM)</label>
                  <select
                    value={editMatUom}
                    onChange={(e) => setEditMatUom(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  >
                    <option value="Pcs">Pcs (Pieces)</option>
                    <option value="Sets">Sets</option>
                    <option value="Meters">Meters</option>
                    <option value="Kg">Kg</option>
                    <option value="Rolls">Rolls</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Unit Standard Cost (₹)</label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={editMatCost}
                    onChange={(e) => setEditMatCost(Number(e.target.value))}
                    className="h-9 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Primary Supplier</label>
                  <select
                    value={editMatSupplier}
                    onChange={(e) => setEditMatSupplier(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Assigned Store / Buffer</label>
                  <select
                    value={editMatWarehouse}
                    onChange={(e) => setEditMatWarehouse(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.name}>
                        {w.name} ({w.plant})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Lead Time (Days)</label>
                  <Input
                    type="number"
                    value={editMatLeadTime}
                    onChange={(e) => setEditMatLeadTime(Number(e.target.value))}
                    className="h-9"
                  />
                </div>
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
                  <label className="block font-semibold mb-1">Reorder Level</label>
                  <Input
                    type="number"
                    value={editMatReorderLevel}
                    onChange={(e) => setEditMatReorderLevel(Number(e.target.value))}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditMatModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProdModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                Edit Finished Product
              </h2>
              <button onClick={() => setShowEditProdModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEditProd} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Product Code</label>
                  <Input
                    required
                    value={editProdCode}
                    onChange={(e) => setEditProdCode(e.target.value)}
                    className="h-9 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={editProdCategory}
                    onChange={(e) => setEditProdCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  >
                    <option value="LED Bulbs">LED Bulbs</option>
                    <option value="Downlights">Downlights</option>
                    <option value="Battens">Battens</option>
                    <option value="Floodlights">Floodlights</option>
                    <option value="Architectural & Gate">Architectural & Gate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Luminaire Name</label>
                <Input
                  required
                  value={editProdName}
                  onChange={(e) => setEditProdName(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Wattage Spec</label>
                  <select
                    value={editProdWattage}
                    onChange={(e) => setEditProdWattage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  >
                    <option value="7W">7W High Efficiency</option>
                    <option value="9W">9W Standard</option>
                    <option value="12W">12W High-Lumen</option>
                    <option value="15W">15W Commercial</option>
                    <option value="20W">20W Industrial Batten</option>
                    <option value="50W">50W Outdoor Flood</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Standard Cost (₹)</label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={editProdCost}
                    onChange={(e) => setEditProdCost(Number(e.target.value))}
                    className="h-9 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Status</label>
                <select
                  value={editProdStatus}
                  onChange={(e) => setEditProdStatus(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                >
                  <option value="Active">Active (In Catalog)</option>
                  <option value="Discontinued">Discontinued</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditProdModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Supplier Modal */}
      {showEditSupplierModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                Edit Vendor / Supplier
              </h2>
              <button onClick={() => setShowEditSupplierModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEditSupplier} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Vendor Business Name</label>
                <Input
                  required
                  value={editSupName}
                  onChange={(e) => setEditSupName(e.target.value)}
                  className="h-9"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category Supplied *</label>
                <select
                  required
                  value={editSupCat}
                  onChange={(e) => setEditSupCat(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="Electronics">Electronics (LED Diodes, Drivers, PCBs)</option>
                  <option value="Mechanical">Mechanical (Die-Cast Aluminium, Housings)</option>
                  <option value="Optical">Optical (Diffusers, Lenses, Reflectors)</option>
                  <option value="Hardware">Hardware (Screws, Gaskets, Fasteners)</option>
                  <option value="Packaging">Packaging (Retail Cartons, Corrugated Boxes)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Contact Person</label>
                  <Input
                    required
                    value={editSupContact}
                    onChange={(e) => setEditSupContact(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number</label>
                  <Input
                    required
                    value={editSupPhone}
                    onChange={(e) => setEditSupPhone(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Email</label>
                  <Input
                    type="email"
                    required
                    value={editSupEmail}
                    onChange={(e) => setEditSupEmail(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Avg Lead Time (Days)</label>
                  <Input
                    type="number"
                    value={editSupLead}
                    onChange={(e) => setEditSupLead(Number(e.target.value))}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditSupplierModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Warehouse Modal */}
      {showEditWarehouseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                Edit Warehouse Facility
              </h2>
              <button onClick={() => setShowEditWarehouseModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEditWarehouse} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Warehouse Name</label>
                <Input
                  required
                  value={editWhName}
                  onChange={(e) => setEditWhName(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Plant Location</label>
                  <select
                    value={editWhPlant}
                    onChange={(e) => setEditWhPlant(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-semibold"
                  >
                    {(plants || []).map((p) => (
                      <option key={p.id} value={`${p.name} - ${p.city}`}>
                        {p.name} ({p.city})
                      </option>
                    ))}
                    {(!plants || plants.length === 0) && (
                      <option value="">No plants registered yet</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Storage Type</label>
                  <select
                    value={editWhType}
                    onChange={(e) => setEditWhType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-semibold"
                  >
                    <option value="Raw Materials">Raw Materials Store</option>
                    <option value="Finished Goods & Packaging">Finished Goods & Packaging Store</option>
                    <option value="WIP & Assembly Buffer">WIP & Assembly Buffer Store</option>
                    <option value="Quarantine & QC Hold">Quarantine & QC Hold Zone</option>
                    <option value="Engineering & Samples">Engineering & Samples Room</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Capacity (Units)</label>
                <Input
                  type="number"
                  value={editWhCapacity}
                  onChange={(e) => setEditWhCapacity(Number(e.target.value))}
                  className="h-9"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Store In-Charge / Warehouse Manager *</label>
                <select
                  value={editWhManager}
                  onChange={(e) => setEditWhManager(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs font-semibold"
                  required
                >
                  {(employees || []).map((emp) => (
                    <option key={emp.id} value={`${emp.name} (${emp.role})`}>
                      {emp.name} &bull; {emp.role} ({emp.plant || 'All Plants'})
                    </option>
                  ))}
                  {(!employees || employees.length === 0) && (
                    <>
                      <option value="Ramesh Sharma (Store Manager)">Ramesh Sharma &bull; Store Manager</option>
                      <option value="Anand Deshmukh (Plant Manager)">Anand Deshmukh &bull; Plant Manager</option>
                      <option value="Suresh Patil (Floor Supervisor)">Suresh Patil &bull; Floor Supervisor</option>
                    </>
                  )}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditWarehouseModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditCustModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                Edit B2B Customer / Buyer
              </h2>
              <button onClick={() => setShowEditCustModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEditCust} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Company Name</label>
                  <Input
                    required
                    value={editCustName}
                    onChange={(e) => setEditCustName(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Classification</label>
                  <select
                    value={editCustCat}
                    onChange={(e) => setEditCustCat(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  >
                    <option value="B2B Brand OEM">B2B Brand OEM</option>
                    <option value="Regional Distributor">Regional Distributor</option>
                    <option value="Wholesale Trader">Wholesale Trader</option>
                    <option value="Direct Institutional">Direct Institutional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">GSTIN / Tax ID</label>
                  <Input
                    required
                    value={editCustGstin}
                    onChange={(e) => setEditCustGstin(e.target.value)}
                    className="h-9 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Payment / Credit Terms</label>
                  <select
                    value={editCustPayment}
                    onChange={(e) => setEditCustPayment(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  >
                    <option value="100% Advance">100% Advance</option>
                    <option value="30 Days PDC">30 Days PDC</option>
                    <option value="45 Days Net Credit">45 Days Net Credit</option>
                    <option value="Letter of Credit (LC)">Letter of Credit (LC)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Billing City</label>
                  <Input
                    required
                    value={editCustCity}
                    onChange={(e) => setEditCustCity(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">State</label>
                  <Input
                    required
                    value={editCustState}
                    onChange={(e) => setEditCustState(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Contact Person</label>
                  <Input
                    required
                    value={editCustContact}
                    onChange={(e) => setEditCustContact(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number</label>
                  <Input
                    required
                    value={editCustPhone}
                    onChange={(e) => setEditCustPhone(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email</label>
                  <Input
                    type="email"
                    required
                    value={editCustEmail}
                    onChange={(e) => setEditCustEmail(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditCustModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
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

export default MastersPage;
