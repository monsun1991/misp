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
  Edit2,
  Zap,
} from 'lucide-react';
import { useMipsStore, getDynamicWattages } from '@/store/useMipsStore';
import type { Material, Product, BOMItem, Customer, MasterWattage } from '@/store/useMipsStore';
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
    categories,
    addCategory,
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
    wattages,
    addWattage,
    updateWattage,
    deleteWattage,
  } = useMipsStore();

  const [activeTab, setActiveTab] = useState<'materials' | 'products' | 'bom' | 'suppliers' | 'customers' | 'warehouses' | 'wattages'>('materials');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);

  // Modals
  const [showAddMatModal, setShowAddMatModal] = useState(false);
  const [showAddProdModal, setShowAddProdModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showAddWarehouseModal, setShowAddWarehouseModal] = useState(false);
  const [showAddWattageModal, setShowAddWattageModal] = useState(false);
  const [showEditWattageModal, setShowEditWattageModal] = useState(false);

  // Dynamic Wattages from Master Table & Fallbacks
  const dynamicWattageList: MasterWattage[] = React.useMemo(() => {
    if (wattages && wattages.length > 0) {
      return [...wattages].sort((a, b) => (Number(a.numericWatts) || 0) - (Number(b.numericWatts) || 0));
    }
    const defaults: MasterWattage[] = [
      { id: 'w-3', name: '3W', numericWatts: 3, description: 'Compact / Night / Indicator Luminaire', status: 'Active' },
      { id: 'w-5', name: '5W', numericWatts: 5, description: 'Low-Wattage Decorative / Spot LED', status: 'Active' },
      { id: 'w-7', name: '7W', numericWatts: 7, description: '7W Standard Accent LED', status: 'Active' },
      { id: 'w-9', name: '9W', numericWatts: 9, description: '9W Standard Domestic LED Bulb', status: 'Active' },
      { id: 'w-10', name: '10W', numericWatts: 10, description: '10W High Efficiency Downlight', status: 'Active' },
      { id: 'w-12', name: '12W', numericWatts: 12, description: '12W High-Lumen Bulb & Panel', status: 'Active' },
      { id: 'w-15', name: '15W', numericWatts: 15, description: '15W Commercial Downlight / Batten', status: 'Active' },
      { id: 'w-18', name: '18W', numericWatts: 18, description: '18W Heavy-Duty Batten / Downlight', status: 'Active' },
      { id: 'w-20', name: '20W', numericWatts: 20, description: '20W Industrial Batten & Flood', status: 'Active' },
      { id: 'w-24', name: '24W', numericWatts: 24, description: '24W Architectural Panel', status: 'Active' },
      { id: 'w-30', name: '30W', numericWatts: 30, description: '30W Commercial Floodlight', status: 'Active' },
      { id: 'w-36', name: '36W', numericWatts: 36, description: '36W 2x2 Office Troffer', status: 'Active' },
      { id: 'w-40', name: '40W', numericWatts: 40, description: '40W Commercial Batten', status: 'Active' },
      { id: 'w-50', name: '50W', numericWatts: 50, description: '50W High-Mast Floodlight', status: 'Active' },
      { id: 'w-100', name: '100W', numericWatts: 100, description: '100W Industrial High-Bay / Street', status: 'Active' }
    ];
    return defaults;
  }, [wattages]);

  const getWattageOptionsWithFallback = React.useCallback(
    (currentVal?: string) => {
      const list = [...dynamicWattageList];
      if (
        currentVal &&
        currentVal !== 'N/A' &&
        !list.some((w) => w.name.trim().toLowerCase() === currentVal.trim().toLowerCase())
      ) {
        list.unshift({
          id: `current-${currentVal}`,
          name: currentVal,
          numericWatts: parseFloat(currentVal.replace(/[^0-9.]/g, '')) || 0,
          description: 'Current Luminaire Spec',
          status: 'Active',
        });
      }
      return list;
    },
    [dynamicWattageList]
  );

  // Wattage form states
  const [newWattageName, setNewWattageName] = useState('');
  const [newWattageNumeric, setNewWattageNumeric] = useState<number>(12);
  const [newWattageDesc, setNewWattageDesc] = useState('');
  const [newWattageStatus, setNewWattageStatus] = useState<'Active' | 'Inactive'>('Active');

  const [editingWattageId, setEditingWattageId] = useState('');
  const [editWattageName, setEditWattageName] = useState('');
  const [editWattageNumeric, setEditWattageNumeric] = useState<number>(12);
  const [editWattageDesc, setEditWattageDesc] = useState('');
  const [editWattageStatus, setEditWattageStatus] = useState<'Active' | 'Inactive'>('Active');
  const [wattageSearch, setWattageSearch] = useState('');

  // Dynamic Material & Product Categories from Master Table & State
  const dynamicMaterialCategories = React.useMemo(() => {
    const defaultCats = ['Electronics', 'Mechanical', 'Optical', 'Hardware', 'Packaging', 'Raw Materials', 'Chemicals & Consumables'];
    const fromCategoriesTable = (categories || []).filter((c) => c.type === 'material').map((c) => c.name);
    const fromMaterials = (materials || []).map((m) => m.category).filter(Boolean);
    return Array.from(new Set([...fromCategoriesTable, ...defaultCats, ...fromMaterials]));
  }, [categories, materials]);

  const dynamicProductCategories = React.useMemo(() => {
    const defaultCats = ['LED Bulbs', 'Downlights', 'Battens', 'Floodlights', 'Architectural & Gate', 'Street Lights', 'Strip Lights'];
    const fromCategoriesTable = (categories || []).filter((c) => c.type === 'product').map((c) => c.name);
    const fromProducts = (products || []).map((p) => p.category).filter(Boolean);
    return Array.from(new Set([...fromCategoriesTable, ...defaultCats, ...fromProducts]));
  }, [categories, products]);

  // New Material form state
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<string>('Electronics');
  const [newMatWattage, setNewMatWattage] = useState<string>('N/A');
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');
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
  const [newProdCategory, setNewProdCategory] = useState<string>('LED Bulbs');
  const [isCustomProdCategory, setIsCustomProdCategory] = useState<boolean>(false);
  const [customProdCategoryInput, setCustomProdCategoryInput] = useState<string>('');
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
        m.wattage === matWattageFilter ||
        m.code.toLowerCase().includes(matWattageFilter.toLowerCase()) ||
        m.name.toLowerCase().includes(matWattageFilter.toLowerCase()) ||
        products.some(
          (p) =>
            p.wattage === matWattageFilter &&
            (p.bom || []).some((b) => b.materialId === m.id || b.materialCode === m.code)
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

    const finalCategory = isCustomCategory && customCategoryInput.trim()
      ? customCategoryInput.trim()
      : newCategory;

    if (isCustomCategory && customCategoryInput.trim()) {
      addCategory({ name: customCategoryInput.trim(), type: 'material' });
    }

    addMaterial({
      code: newCode,
      name: newName,
      category: finalCategory,
      wattage: newMatWattage && newMatWattage !== 'N/A' ? newMatWattage : undefined,
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
    setNewMatWattage('N/A');
    setIsCustomCategory(false);
    setCustomCategoryInput('');
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdCode || !newProdName) return;

    const finalCategory = isCustomProdCategory && customProdCategoryInput.trim()
      ? customProdCategoryInput.trim()
      : newProdCategory;

    if (isCustomProdCategory && customProdCategoryInput.trim()) {
      addCategory({ name: customProdCategoryInput.trim(), type: 'product' });
    }

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      code: newProdCode,
      name: newProdName,
      category: finalCategory,
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
    setIsCustomProdCategory(false);
    setCustomProdCategoryInput('');
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
  const [editMatCode, setEditMatCode] = useState('');
  const [editMatName, setEditMatName] = useState('');
  const [editMatCategory, setEditMatCategory] = useState<string>('Electronics');
  const [editMatWattage, setEditMatWattage] = useState<string>('N/A');
  const [isEditCustomCategory, setIsEditCustomCategory] = useState<boolean>(false);
  const [editCustomCategoryInput, setEditCustomCategoryInput] = useState<string>('');
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
    setEditMatCode(m.code);
    setEditMatName(m.name);
    setEditMatCategory(m.category);
    setEditMatWattage(m.wattage || 'N/A');
    setIsEditCustomCategory(false);
    setEditCustomCategoryInput('');
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
    const finalCategory = isEditCustomCategory && editCustomCategoryInput.trim()
      ? editCustomCategoryInput.trim()
      : editMatCategory;

    if (isEditCustomCategory && editCustomCategoryInput.trim()) {
      addCategory({ name: editCustomCategoryInput.trim(), type: 'material' });
    }

    updateMaterial(editingMatId, {
      code: editMatCode,
      name: editMatName,
      category: finalCategory,
      wattage: editMatWattage && editMatWattage !== 'N/A' ? editMatWattage : undefined,
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
    setIsEditCustomCategory(false);
    setEditCustomCategoryInput('');
  };

  // Edit Product state
  const [showEditProdModal, setShowEditProdModal] = useState(false);
  const [editingProdId, setEditingProdId] = useState('');
  const [editProdCode, setEditProdCode] = useState('');
  const [editProdName, setEditProdName] = useState('');
  const [editProdCategory, setEditProdCategory] = useState<string>('LED Bulbs');
  const [isEditCustomProdCategory, setIsEditCustomProdCategory] = useState<boolean>(false);
  const [editCustomProdCategoryInput, setEditCustomProdCategoryInput] = useState<string>('');
  const [editProdWattage, setEditProdWattage] = useState('12W');
  const [editProdCost, setEditProdCost] = useState<number>(150);
  const [editProdStatus, setEditProdStatus] = useState<Product['status']>('Active');

  const handleOpenEditProd = (p: Product) => {
    setEditingProdId(p.id);
    setEditProdCode(p.code);
    setEditProdName(p.name);
    setEditProdCategory(p.category);
    setIsEditCustomProdCategory(false);
    setEditCustomProdCategoryInput('');
    setEditProdWattage(p.wattage || '12W');
    setEditProdCost(p.standardCost);
    setEditProdStatus(p.status);
    setShowEditProdModal(true);
  };

  const handleSaveEditProd = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = isEditCustomProdCategory && editCustomProdCategoryInput.trim()
      ? editCustomProdCategoryInput.trim()
      : editProdCategory;

    if (isEditCustomProdCategory && editCustomProdCategoryInput.trim()) {
      addCategory({ name: editCustomProdCategoryInput.trim(), type: 'product' });
    }

    updateProduct(editingProdId, {
      code: editProdCode,
      name: editProdName,
      category: finalCategory,
      wattage: editProdWattage,
      standardCost: editProdCost,
      status: editProdStatus,
    });
    if (selectedProduct?.id === editingProdId) {
      setSelectedProduct({
        ...selectedProduct,
        code: editProdCode,
        name: editProdName,
        category: finalCategory,
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

  const handleOpenEditWattage = (w: MasterWattage) => {
    setEditingWattageId(w.id);
    setEditWattageName(w.name);
    setEditWattageNumeric(Number(w.numericWatts) || 0);
    setEditWattageDesc(w.description || '');
    setEditWattageStatus(w.status || 'Active');
    setShowEditWattageModal(true);
  };

  const handleSaveAddWattage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWattageName.trim()) return;
    const formattedName = newWattageName.trim().toUpperCase().endsWith('W')
      ? newWattageName.trim().toUpperCase()
      : `${newWattageName.trim()}W`;
    const numWatts = newWattageNumeric || parseFloat(formattedName.replace(/[^0-9.]/g, '')) || 0;
    await addWattage({
      name: formattedName,
      numericWatts: numWatts,
      description: newWattageDesc.trim(),
      status: newWattageStatus,
    });
    setNewWattageName('');
    setNewWattageDesc('');
    setNewWattageNumeric(12);
    setShowAddWattageModal(false);
  };

  const handleSaveEditWattage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWattageId) return;
    const formattedName = editWattageName.trim().toUpperCase().endsWith('W')
      ? editWattageName.trim().toUpperCase()
      : `${editWattageName.trim()}W`;
    const numWatts = editWattageNumeric || parseFloat(formattedName.replace(/[^0-9.]/g, '')) || 0;
    await updateWattage(editingWattageId, {
      name: formattedName,
      numericWatts: numWatts,
      description: editWattageDesc.trim(),
      status: editWattageStatus,
    });
    setShowEditWattageModal(false);
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

          {activeTab === 'wattages' && (
            <Button
              onClick={() => setShowAddWattageModal(true)}
              className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Add Wattage Spec
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
              onClick={() => setActiveTab('wattages')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1 ${
                activeTab === 'wattages'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Wattages ({dynamicWattageList.length})
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
                    {dynamicWattageList.map((w) => (
                      <SelectItem key={w.name} value={w.name}>{w.name}</SelectItem>
                    ))}
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
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge variant="secondary" className="text-[10px]">
                              {m.category}
                            </Badge>
                            {m.wattage && (
                              <Badge variant="outline" className="text-[10px] font-semibold text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/40">
                                ⚡ {m.wattage}
                              </Badge>
                            )}
                          </div>
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
                    {dynamicWattageList.map((w) => (
                      <SelectItem key={w.name} value={w.name}>{w.name}</SelectItem>
                    ))}
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
                      <span className="text-xs text-slate-400">{(prod.bom || []).length} BOM components</span>
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
                            setEditingBOM(prod.bom || []);
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

      {/* Tab 6: Wattage Specifications Master */}
      {activeTab === 'wattages' && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#84cc16]" />
                  Wattage Ratings & Master Specifications
                </CardTitle>
                <CardDescription>
                  Enterprise power ratings for LED lamps, luminaires, drivers, and circuit assemblies. Standardized ratings are consumed globally by Products, BOMs, and Inventory filters.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search wattages..."
                  value={wattageSearch}
                  onChange={(e) => setWattageSearch(e.target.value)}
                  className="w-48 h-8 text-xs"
                />
                <Button
                  size="sm"
                  onClick={() => setShowAddWattageModal(true)}
                  className="text-xs bg-[#183638] hover:bg-[#122b2d] text-[#84cc16] border border-[#84cc16]/40 font-semibold"
                >
                  + Add Wattage Spec
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {dynamicWattageList
                .filter((w) => !wattageSearch || w.name.toLowerCase().includes(wattageSearch.toLowerCase()) || (w.description && w.description.toLowerCase().includes(wattageSearch.toLowerCase())))
                .map((w) => {
                  const associatedProducts = products.filter((p) => p.wattage === w.name);
                  return (
                    <div
                      key={w.id || w.name}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2 text-xs relative group"
                    >
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[#183638] text-[#84cc16] font-bold text-xs border border-[#84cc16]/30">
                            {w.name}
                          </Badge>
                          <span className="font-semibold text-slate-500 text-[11px]">
                            {w.numericWatts}W Nominal
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className={w.status === 'Active' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20' : 'text-slate-400'}>
                            {w.status || 'Active'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditWattage(w)}
                            className="h-6 w-6 p-0 text-slate-400 hover:text-blue-600"
                            title="Edit Wattage"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete wattage rating ${w.name}?`)) {
                                deleteWattage(w.id);
                              }
                            }}
                            className="h-6 w-6 p-0 text-slate-400 hover:text-red-600"
                            title="Delete Wattage"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 min-h-[32px]">
                        {w.description || 'General lighting and driver specification'}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t text-[11px] text-slate-400">
                        <span>Associated Models</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">
                          {associatedProducts.length} Products
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Wattage Modal */}
      {showAddWattageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#84cc16]" />
                Register Master Wattage Rating
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddWattageModal(false)}
                className="h-7 w-7 p-0 rounded-full text-slate-400 hover:text-slate-700"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleSaveAddWattage} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Wattage Label / Code (e.g. 18W, 24W)</label>
                <Input
                  required
                  placeholder="e.g. 24W"
                  value={newWattageName}
                  onChange={(e) => {
                    setNewWattageName(e.target.value);
                    const parsed = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                    if (!isNaN(parsed)) setNewWattageNumeric(parsed);
                  }}
                  className="h-9 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Numeric Rating (Watts)</label>
                  <Input
                    type="number"
                    step="0.1"
                    required
                    value={newWattageNumeric}
                    onChange={(e) => setNewWattageNumeric(Number(e.target.value))}
                    className="h-9 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <Select value={newWattageStatus} onValueChange={(val: any) => setNewWattageStatus(val)}>
                    <SelectTrigger className="h-9 font-semibold text-xs bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description / Application Notes</label>
                <Input
                  placeholder="e.g. Architectural Panels, Heavy Troffers"
                  value={newWattageDesc}
                  onChange={(e) => setNewWattageDesc(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddWattageModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold">
                  Save Wattage Spec
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Wattage Modal */}
      {showEditWattageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#84cc16]" />
                Edit Master Wattage Rating
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditWattageModal(false)}
                className="h-7 w-7 p-0 rounded-full text-slate-400 hover:text-slate-700"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleSaveEditWattage} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Wattage Label / Code</label>
                <Input
                  required
                  value={editWattageName}
                  onChange={(e) => {
                    setEditWattageName(e.target.value);
                    const parsed = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                    if (!isNaN(parsed)) setEditWattageNumeric(parsed);
                  }}
                  className="h-9 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Numeric Rating (Watts)</label>
                  <Input
                    type="number"
                    step="0.1"
                    required
                    value={editWattageNumeric}
                    onChange={(e) => setEditWattageNumeric(Number(e.target.value))}
                    className="h-9 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <Select value={editWattageStatus} onValueChange={(val: any) => setEditWattageStatus(val)}>
                    <SelectTrigger className="h-9 font-semibold text-xs bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description / Application Notes</label>
                <Input
                  value={editWattageDesc}
                  onChange={(e) => setEditWattageDesc(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditWattageModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold">
                  Update Wattage Spec
                </Button>
              </div>
            </form>
          </div>
        </div>
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
                  <Select
                    value={addBomMatId}
                    onValueChange={(val) => setAddBomMatId(val)}
                    disabled={materials.length === 0}
                  >
                    <SelectTrigger className="w-full h-8 bg-white dark:bg-slate-800 text-xs">
                      <SelectValue placeholder={materials.length === 0 ? "No materials available" : "-- Select Material --"} />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map((m) => (
                        <SelectItem key={m.id} value={m.id} className="text-xs">
                          {m.code} - {m.name} (₹{m.standardCost}/{m.uom})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold">Category *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomProdCategory(!isCustomProdCategory);
                        if (!isCustomProdCategory) setCustomProdCategoryInput('');
                      }}
                      className="text-[10px] text-[#146b68] dark:text-[#84cc16] hover:underline font-semibold"
                    >
                      {isCustomProdCategory ? '← Choose Existing' : '+ Add Custom'}
                    </button>
                  </div>
                  {isCustomProdCategory ? (
                    <Input
                      placeholder="Type custom product category..."
                      value={customProdCategoryInput}
                      onChange={(e) => setCustomProdCategoryInput(e.target.value)}
                      required
                      autoFocus
                      className="h-9 font-medium border-[#84cc16] focus:ring-[#84cc16]"
                    />
                  ) : (
                    <Select
                      value={newProdCategory}
                      onValueChange={(val) => {
                        if (val === '__custom__') {
                          setIsCustomProdCategory(true);
                          setCustomProdCategoryInput('');
                        } else {
                          setNewProdCategory(val);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {dynamicProductCategories.map((cat) => (
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold">Wattage Spec</label>
                    <span className="text-[10px] text-slate-400 font-normal">From Wattage Master</span>
                  </div>
                  <Select value={newProdWattage} onValueChange={setNewProdWattage}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder="Select Wattage Rating" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {getWattageOptionsWithFallback(newProdWattage).map((w) => (
                        <SelectItem key={w.id || w.name} value={w.name} className="text-xs">
                          {w.name} {w.description ? `• ${w.description}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <Select value={newSupCat} onValueChange={setNewSupCat}>
                  <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics (LEDs, Drivers, PCBs)">Electronics (LEDs, Drivers, PCBs)</SelectItem>
                    <SelectItem value="Mechanical (Die-Cast, Housings, Endcaps)">Mechanical (Die-Cast, Housings, Endcaps)</SelectItem>
                    <SelectItem value="Optical (Diffusers, Lenses, PMMA)">Optical (Diffusers, Lenses, PMMA)</SelectItem>
                    <SelectItem value="Hardware (Fasteners, Cables, Connectors)">Hardware (Fasteners, Cables, Connectors)</SelectItem>
                    <SelectItem value="Packaging (Cartons, Polybags)">Packaging (Cartons, Polybags)</SelectItem>
                    <SelectItem value="General Components">General Components</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Material Code *</label>
                  <Input
                    required
                    placeholder="e.g. PCB-15W-HP"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="h-9 font-mono font-semibold"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold">Category *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(!isCustomCategory);
                        if (!isCustomCategory) setCustomCategoryInput('');
                      }}
                      className="text-[10px] text-[#146b68] dark:text-[#84cc16] hover:underline font-semibold"
                    >
                      {isCustomCategory ? '← Choose Existing' : '+ Add Custom'}
                    </button>
                  </div>
                  {isCustomCategory ? (
                    <Input
                      placeholder="Type custom category..."
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      required
                      autoFocus
                      className="h-9 font-medium border-[#84cc16] focus:ring-[#84cc16]"
                    />
                  ) : (
                    <Select
                      value={newCategory}
                      onValueChange={(val) => {
                        if (val === '__custom__') {
                          setIsCustomCategory(true);
                          setCustomCategoryInput('');
                        } else {
                          setNewCategory(val);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {dynamicMaterialCategories.map((cat) => (
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold">Wattage Spec</label>
                    <span className="text-[10px] text-slate-400">Driver / PCB</span>
                  </div>
                  <Select value={newMatWattage} onValueChange={setNewMatWattage}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder="Select Wattage Spec" />
                    </SelectTrigger>
                    <SelectContent className="max-h-56 overflow-y-auto">
                      <SelectItem value="N/A" className="text-xs text-slate-500 font-medium">
                        N/A (Non-wattage part)
                      </SelectItem>
                      {dynamicWattageList.map((w) => (
                        <SelectItem key={w.id || w.name} value={w.name} className="text-xs">
                          {w.name} {w.description ? `• ${w.description}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select value={newUom} onValueChange={setNewUom}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder="Select UOM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pcs">Pcs (Pieces)</SelectItem>
                      <SelectItem value="Nos">Nos (Numbers)</SelectItem>
                      <SelectItem value="Mtr">Mtr (Meters)</SelectItem>
                      <SelectItem value="Roll">Roll (Rolls)</SelectItem>
                      <SelectItem value="Kg">Kg (Kilograms)</SelectItem>
                      <SelectItem value="Set">Set (Sets)</SelectItem>
                      <SelectItem value="Box">Box (Boxes)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Primary Supplier *</label>
                  <Select value={newSupplier} onValueChange={setNewSupplier} disabled={suppliers.length === 0}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder={suppliers.length === 0 ? "No suppliers found" : "-- Select Supplier --"} />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((s) => (
                        <SelectItem key={s.id} value={s.name} className="text-xs">
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {suppliers.length === 0 && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                      ⚠️ Please add a vendor in Vendors tab first.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Assigned Warehouse *</label>
                  <Select value={newWarehouse} onValueChange={setNewWarehouse} disabled={warehouses.length === 0}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder={warehouses.length === 0 ? "No warehouses found" : "-- Select Warehouse --"} />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((w) => (
                        <SelectItem key={w.id} value={w.name} className="text-xs">
                          {w.name} ({w.plant})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {warehouses.length === 0 && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                      ⚠️ Please add a warehouse in Warehouses tab first.
                    </p>
                  )}
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
                  <Select value={newWhPlant} onValueChange={setNewWhPlant}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder="Select Plant" />
                    </SelectTrigger>
                    <SelectContent>
                      {(plants || []).map((p) => (
                        <SelectItem key={p.id} value={`${p.name} - ${p.city}`}>
                          {p.name} ({p.city})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Storage Type *</label>
                  <Select value={newWhType} onValueChange={setNewWhType}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder="Storage Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Raw Materials">Raw Materials Store</SelectItem>
                      <SelectItem value="Finished Goods & Packaging">Finished Goods & Packaging Store</SelectItem>
                      <SelectItem value="WIP & Assembly Buffer">WIP & Assembly Buffer Store</SelectItem>
                      <SelectItem value="Quarantine & QC Hold">Quarantine & QC Hold Zone</SelectItem>
                      <SelectItem value="Engineering & Samples">Engineering & Samples Room</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Select
                  value={newWhManager}
                  onValueChange={(val) => setNewWhManager(val)}
                  disabled={!employees || employees.length === 0}
                >
                  <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                    <SelectValue placeholder={(!employees || employees.length === 0) ? "No staff members available" : "-- Select Warehouse Manager --"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(employees || []).map((emp) => (
                      <SelectItem key={emp.id} value={`${emp.name} (${emp.role})`} className="text-xs">
                        {emp.name} &bull; {emp.role} ({emp.plant || 'All Plants'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(!employees || employees.length === 0) && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                    ⚠️ No staff members available. Please onboard workforce in Employees page first.
                  </p>
                )}
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
                  <label className="block font-semibold mb-1">Material Code *</label>
                  <Input
                    required
                    value={editMatCode}
                    onChange={(e) => setEditMatCode(e.target.value)}
                    className="h-9 font-mono font-semibold"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold">Wattage Spec</label>
                    <span className="text-[10px] text-slate-400">Driver / PCB</span>
                  </div>
                  <Select value={editMatWattage} onValueChange={setEditMatWattage}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder="Select Wattage Spec" />
                    </SelectTrigger>
                    <SelectContent className="max-h-56 overflow-y-auto">
                      <SelectItem value="N/A" className="text-xs text-slate-500 font-medium">
                        N/A (Non-wattage part)
                      </SelectItem>
                      {dynamicWattageList.map((w) => (
                        <SelectItem key={w.id || w.name} value={w.name} className="text-xs">
                          {w.name} {w.description ? `• ${w.description}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                        {dynamicMaterialCategories.map((cat) => (
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
                  <label className="block font-semibold mb-1">Status</label>
                  <Select value={editMatStatus} onValueChange={(val) => setEditMatStatus(val as any)}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Discontinued">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select value={editMatUom} onValueChange={setEditMatUom}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder="Select UOM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pcs">Pcs (Pieces)</SelectItem>
                      <SelectItem value="Sets">Sets</SelectItem>
                      <SelectItem value="Meters">Meters</SelectItem>
                      <SelectItem value="Kg">Kg</SelectItem>
                      <SelectItem value="Rolls">Rolls</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select value={editMatSupplier} onValueChange={setEditMatSupplier} disabled={suppliers.length === 0}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder={suppliers.length === 0 ? "No suppliers found" : "-- Select Supplier --"} />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((s) => (
                        <SelectItem key={s.id} value={s.name} className="text-xs">
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Assigned Store / Buffer</label>
                  <Select value={editMatWarehouse} onValueChange={setEditMatWarehouse} disabled={warehouses.length === 0}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder={warehouses.length === 0 ? "No warehouses found" : "-- Select Warehouse --"} />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((w) => (
                        <SelectItem key={w.id} value={w.name} className="text-xs">
                          {w.name} ({w.plant})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <Button type="submit" size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]">
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold">Category *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditCustomProdCategory(!isEditCustomProdCategory);
                        if (!isEditCustomProdCategory) setEditCustomProdCategoryInput('');
                      }}
                      className="text-[10px] text-[#146b68] dark:text-[#84cc16] hover:underline font-semibold"
                    >
                      {isEditCustomProdCategory ? '← Choose Existing' : '+ Add Custom'}
                    </button>
                  </div>
                  {isEditCustomProdCategory ? (
                    <Input
                      placeholder="Type custom product category..."
                      value={editCustomProdCategoryInput}
                      onChange={(e) => setEditCustomProdCategoryInput(e.target.value)}
                      required
                      autoFocus
                      className="h-9 font-medium border-[#84cc16] focus:ring-[#84cc16]"
                    />
                  ) : (
                    <Select
                      value={editProdCategory}
                      onValueChange={(val) => {
                        if (val === '__custom__') {
                          setIsEditCustomProdCategory(true);
                          setEditCustomProdCategoryInput('');
                        } else {
                          setEditProdCategory(val);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {dynamicProductCategories.map((cat) => (
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold">Wattage Spec</label>
                    <span className="text-[10px] text-slate-400 font-normal">From Wattage Master</span>
                  </div>
                  <Select value={editProdWattage} onValueChange={setEditProdWattage}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder="Select Wattage Spec" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {getWattageOptionsWithFallback(editProdWattage).map((w) => (
                        <SelectItem key={w.id || w.name} value={w.name} className="text-xs">
                          {w.name} {w.description ? `• ${w.description}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <Select value={editProdStatus} onValueChange={(val) => setEditProdStatus(val as any)}>
                  <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Discontinued">Discontinued</SelectItem>
                    <SelectItem value="Engineering Hold">Engineering Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditProdModal(false)}>
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
                <Select value={editSupCat} onValueChange={setEditSupCat}>
                  <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                    <SelectValue placeholder="Category Supplied" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics (LED Diodes, Drivers, PCBs)</SelectItem>
                    <SelectItem value="Mechanical">Mechanical (Die-Cast Aluminium, Housings)</SelectItem>
                    <SelectItem value="Optical">Optical (Diffusers, Lenses, Reflectors)</SelectItem>
                    <SelectItem value="Hardware">Hardware (Screws, Gaskets, Fasteners)</SelectItem>
                    <SelectItem value="Packaging">Packaging (Retail Cartons, Corrugated Boxes)</SelectItem>
                  </SelectContent>
                </Select>
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
                <Button type="submit" size="sm" className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]">
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
                  <Select value={editWhPlant} onValueChange={setEditWhPlant}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder="Select Plant" />
                    </SelectTrigger>
                    <SelectContent>
                      {(plants || []).map((p) => (
                        <SelectItem key={p.id} value={`${p.name} - ${p.city}`}>
                          {p.name} ({p.city})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Storage Type</label>
                  <Select value={editWhType} onValueChange={setEditWhType}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder="Storage Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Raw Materials">Raw Materials Store</SelectItem>
                      <SelectItem value="Finished Goods & Packaging">Finished Goods & Packaging Store</SelectItem>
                      <SelectItem value="WIP & Assembly Buffer">WIP & Assembly Buffer Store</SelectItem>
                      <SelectItem value="Quarantine & QC Hold">Quarantine & QC Hold Zone</SelectItem>
                      <SelectItem value="Engineering & Samples">Engineering & Samples Room</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Select
                  value={editWhManager}
                  onValueChange={(val) => setEditWhManager(val)}
                  disabled={!employees || employees.length === 0}
                >
                  <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                    <SelectValue placeholder={(!employees || employees.length === 0) ? "No staff members available" : "-- Select Warehouse Manager --"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(employees || []).map((emp) => (
                      <SelectItem key={emp.id} value={`${emp.name} (${emp.role})`} className="text-xs">
                        {emp.name} &bull; {emp.role} ({emp.plant || 'All Plants'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(!employees || employees.length === 0) && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                    ⚠️ No staff members available. Please onboard workforce in Employees page first.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditWarehouseModal(false)}>
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
                  <Select value={editCustCat} onValueChange={(val) => setEditCustCat(val as any)}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder="Classification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B2B Brand OEM">B2B Brand OEM</SelectItem>
                      <SelectItem value="Regional Distributor">Regional Distributor</SelectItem>
                      <SelectItem value="Wholesale Trader">Wholesale Trader</SelectItem>
                      <SelectItem value="Direct Institutional">Direct Institutional</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select value={editCustPayment} onValueChange={setEditCustPayment}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder="Payment Terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100% Advance">100% Advance</SelectItem>
                      <SelectItem value="30 Days PDC">30 Days PDC</SelectItem>
                      <SelectItem value="45 Days Net Credit">45 Days Net Credit</SelectItem>
                      <SelectItem value="Letter of Credit (LC)">Letter of Credit (LC)</SelectItem>
                    </SelectContent>
                  </Select>
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

export default MastersPage;
