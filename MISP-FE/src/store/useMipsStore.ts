import { create } from 'zustand';
import { toast } from 'react-toastify';
import { mipsService } from '@/api/services/mips.service';

// Auto-purge legacy demo store data from browser localStorage
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const legacyKeys = [
      'mips_manufacturing_store_v10_clean',
      'mips_manufacturing_store_v9',
      'mips_manufacturing_store_v8',
      'mips_manufacturing_store_v7',
      'mips_manufacturing_store_v6',
      'mips_manufacturing_store_v5',
      'mips_manufacturing_store_v4',
      'mips_manufacturing_store_v3',
      'mips_manufacturing_store_v2',
      'mips_manufacturing_store_v1',
      'mips-storage'
    ];
    legacyKeys.forEach((key) => window.localStorage.removeItem(key));
  }
} catch (e) {
  // Ignore SSR/storage errors
}

// Saves are optimistic: surface DB failures instead of letting the screen drift from MySQL silently
const reportSyncError = (message: string) => (err: unknown) => {
  console.warn(`${message}:`, err);
  toast.error(`${message}. Your last change was not saved to the server - please refresh and retry.`, {
    toastId: message,
  });
};

// Accepts an already-parsed array or a JSON string column; a malformed row yields [] instead of throwing
const parseJsonArray = (value: any, json?: any): any[] => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(json)) return json;
  if (typeof json === 'string' && json) {
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return [];
};

export interface Material {
  id: string;
  code: string;
  name: string;
  category: string;
  wattage?: string;
  subCategory?: string;
  uom: string; // e.g. 'Pcs', 'Meters', 'Sets', 'Kg'
  supplier: string;
  warehouse: string;
  plant?: string;
  location: string;
  currentStock: number;
  stockWithEmployees: number;
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  safetyStock: number;
  leadTimeDays: number;
  standardCost: number; // in INR
  status: 'Active' | 'Inactive';
}

export interface BOMItem {
  materialId: string;
  materialCode: string;
  materialName: string;
  qtyPerUnit: number;
  uom: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  wattage: string; // '5W', '9W', '12W', '15W', '20W', '50W'
  unit: string;
  standardCost: number;
  status: 'Active' | 'Discontinued';
  bom: BOMItem[];
}

export interface StockLedgerEntry {
  id: string;
  date: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  transactionType:
    | 'Opening Stock'
    | 'Goods Receipt (GRN)'
    | 'Supplier Inbound (Direct)'
    | 'Kit Issue'
    | 'Material Return'
    | 'Return to Vendor (RTV)'
    | 'Adjustment (+)'
    | 'Adjustment (-)'
    | 'Wastage / Scrap'
    | 'Sample / Engineering Issue'
    | 'Warehouse Transfer';
  referenceNo: string;
  warehouse: string;
  plant?: string;
  inQty: number;
  outQty: number;
  balanceQty: number;
  user: string;
  notes?: string;
  supplier?: string;
  invoiceNo?: string;
  batchNo?: string;
  unitCost?: number;
  debitNoteNo?: string;
  sourceDestination?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  poDate: string;
  materialId: string;
  materialName: string;
  orderedQty: number;
  receivedQty: number;
  pendingQty: number;
  unitRate: number;
  unitPrice?: number;
  expectedDeliveryDate: string;
  status: 'Draft' | 'Ordered' | 'In Transit' | 'Received' | 'Partially Received' | 'Delayed' | 'Closed';
  transporter?: string;
  trackingNo?: string;
  trackingNumber?: string;
  dispatchDate?: string;
  notes?: string;
  totalAmount?: number;
  plant?: string;
}

export interface GRNEntry {
  id: string;
  grnNumber: string;
  poNumber: string;
  date: string;
  supplier: string;
  materialId: string;
  materialName: string;
  receivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  damagedQty: number;
  warehouse: string;
  plant?: string;
  inspectedBy: string;
  notes?: string;
}

export interface CustomerPOItem {
  productId: string;
  productCode: string;
  productName: string;
  orderedQty: number;
  dispatchedQty: number;
  pendingQty: number;
  unitPrice: number;
  uom: string;
}

export interface CustomerPO {
  id: string;
  customerPoNumber: string;
  customerName: string;
  customerGst?: string;
  billingCity: string;
  poDate: string;
  expectedDispatchDate: string;
  items: CustomerPOItem[];
  totalAmount: number;
  totalOrderedQty: number;
  totalDispatchedQty: number;
  totalPendingQty: number;
  status: 'New Order' | 'In Production' | 'Partially Dispatched' | 'Fully Dispatched' | 'Closed';
  uploadedFileName?: string;
  notes?: string;
  plant: string;
}

export interface OutwardDispatchRecord {
  id: string;
  dispatchNo: string;
  customerPoId: string;
  customerPoNumber: string;
  customerName: string;
  dispatchDate: string;
  transporter: string;
  vehicleNo: string;
  ewayBillNo: string;
  items: { productId: string; productName: string; qty: number; unitPrice: number }[];
  totalUnits: number;
  totalValue: number;
  plant: string;
  dispatchedBy: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  gstin: string;
  city: string;
  state: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: string;
  paymentTerms: string;
}

export interface MasterCategory {
  id: string;
  name: string;
  type: string; // 'material' | 'product' | 'customer'
  description?: string;
}

export interface MasterWattage {
  id: string;
  name: string;
  numericWatts?: number;
  description?: string;
  status: 'Active' | 'Inactive';
}

export interface KitItem {
  materialId: string;
  materialCode: string;
  materialName: string;
  bomQtyPerUnit: number;
  totalIssuedQty: number;
  issuedQty?: number;
  consumedQty: number;
  returnedQty: number;
  wastageQty: number;
  balanceWithEmployee: number;
  uom?: string;
}

export interface ProductionKit {
  id: string;
  kitNumber: string;
  productId: string;
  productCode?: string;
  productName: string;
  plannedBatchQty: number;
  assignedEmployee: string;
  supervisor: string;
  department: string;
  plant?: string;
  status: 'Draft' | 'Approved' | 'Issued' | 'In Production' | 'Reconciled' | 'Closed';
  createdDate: string;
  issueDate?: string;
  closedDate?: string;
  reconciliationNotes?: string;
  items: KitItem[];
}

export interface ProductionLog {
  id: string;
  date: string;
  shift: 'Shift A (Morning)' | 'Shift B (Evening)' | 'General Shift';
  orderNo: string;
  productId: string;
  productName: string;
  kitNumber?: string;
  targetQty: number;
  actualQty: number;
  rejectedQty: number;
  wastageQty: number;
  operator: string;
  supervisor: string;
  workingHours: number;
  unitsPerHour: number;
  productivityPct: number;
  plant?: string;
}

export interface FinishedGoodItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  category: string;
  wattage?: string;
  batchLotNumber: string;
  plant: string;
  warehouse: string;
  quantityOnHand: number;
  allocatedQty: number; // Reserved for pending customer orders
  availableQty: number; // quantityOnHand - allocatedQty
  rejectionsQty: number; // Final QA rejected
  productionDate: string;
  kitId?: string;
  kitNumber?: string;
  standardCost: number;
  sellingPrice: number;
  status: 'Ready for Dispatch' | 'Under QC' | 'Quarantine' | 'Depleted';
  notes?: string;
}

export interface FinishedGoodsLedgerEntry {
  id: string;
  date: string;
  productId: string;
  productCode: string;
  productName: string;
  batchLotNumber: string;
  transactionType: 'Production Inward' | 'Customer Dispatch' | 'Stock Adjustment' | 'QA Quarantine' | 'Manual Inward';
  referenceNo: string;
  plant: string;
  warehouse: string;
  inQty: number;
  outQty: number;
  balanceQty: number;
  user: string;
  notes?: string;
}

/**
 * Universal matcher for filtering any entity by active plant location context.
 */
export const isPlantMatch = (itemPlant?: string, activePlant?: string): boolean => {
  if (!activePlant || activePlant.startsWith('All Plants') || activePlant === 'All') {
    return true;
  }
  if (!itemPlant) {
    return true;
  }
  const itemP = itemPlant.toLowerCase();
  const actP = activePlant.toLowerCase();
  return itemP.includes(actP) || actP.includes(itemP);
};

export const getDynamicWattages = (wattages?: MasterWattage[], products?: Product[]): string[] => {
  if (wattages && wattages.length > 0) {
    return wattages
      .filter((w) => w.status !== 'Inactive')
      .sort((a, b) => (Number(a.numericWatts) || 0) - (Number(b.numericWatts) || 0))
      .map((w) => w.name);
  }
  const fromProds = products ? products.map((p) => p.wattage).filter(Boolean) : [];
  const defaults = ['3W', '5W', '7W', '9W', '10W', '12W', '15W', '18W', '20W', '24W', '30W', '36W', '40W', '50W', '100W'];
  return Array.from(new Set([...defaults, ...fromProds]));
};

export interface EmployeeAccountability {
  employeeId: string;
  name: string;
  department: string;
  materialsHeld: Array<{
    materialId: string;
    materialName: string;
    issuedTotal: number;
    consumedTotal: number;
    returnedTotal: number;
    currentBalance: number;
  }>;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystem?: boolean;
  permissions: string[];
}

export interface Department {
  id: string;
  name: string;
  plant: string;
  manager: string;
  description?: string;
  activeTeams: string[];
}

export interface Employee {
  id: string;
  empCode: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  plant: string;
  department: string;
  team: string;
  supervisor: string;
  status: 'Active' | 'Onboarding' | 'Probation' | 'Inactive';
  joiningDate: string;
  workstation?: string;
  assignedWorkers?: string[];
  skills?: string[];
  // UBAC: User-Based Access Control direct permission grants and restrictions
  customPermissions?: string[];
  revokedPermissions?: string[];
}

export interface PermissionDefinition {
  id: string;
  label: string;
  category: string;
  description?: string;
}

export const AVAILABLE_PERMISSIONS: PermissionDefinition[] = [
  { id: 'inventory.view', label: 'View Stock Balances & Locations', category: 'Inventory' },
  { id: 'inventory.adjust', label: 'Authorized Stock Adjustments (+/-)', category: 'Inventory' },
  { id: 'inventory.transfer', label: 'Inter-Warehouse Stock Transfer', category: 'Inventory' },
  { id: 'finished_goods.view', label: 'View Finished Goods Store', category: 'Inventory' },
  
  { id: 'procurement.view', label: 'View Purchase Orders & GRNs', category: 'Procurement' },
  { id: 'procurement.po.create', label: 'Create Purchase Orders (PO)', category: 'Procurement' },
  { id: 'procurement.po.approve', label: 'Approve & Dispatch POs', category: 'Procurement' },
  { id: 'procurement.grn.receive', label: 'Inbound GRN Quality Inspection', category: 'Procurement' },
  
  { id: 'forecast.view', label: 'View 4-Month Forecast Matrix', category: 'Planning' },
  { id: 'forecast.plan', label: 'Adjust Production Run Demands', category: 'Planning' },
  
  { id: 'kits.view', label: 'View Production Kits', category: 'Kits & Floor' },
  { id: 'kits.create', label: 'Create Production Kits from BOM', category: 'Kits & Floor' },
  { id: 'kits.issue', label: 'Issue Material Kits to Operators', category: 'Kits & Floor' },
  { id: 'kits.reconcile', label: 'Log Consumption, Returns & Scrap', category: 'Kits & Floor' },
  { id: 'kits.close', label: 'Supervisor Reconciliation & Kit Closure', category: 'Kits & Floor' },
  
  { id: 'production.view', label: 'View Production Logs', category: 'Production' },
  { id: 'production.plan', label: 'Plan Production Runs', category: 'Production' },
  { id: 'production.log', label: 'Log Daily Shift Output & Units/Hour', category: 'Production' },
  { id: 'production.scrap', label: 'Record QA Rejections & Wastage', category: 'Production' },
  { id: 'productivity.view', label: 'View Productivity Dashboard', category: 'Production' },

  { id: 'orders.view', label: 'View Customer POs & Dispatches', category: 'Orders & Dispatch' },
  { id: 'orders.manage', label: 'Record Customer POs & Dispatch Goods', category: 'Orders & Dispatch' },
  
  { id: 'masters.manage', label: 'Manage Materials, Products & BOMs', category: 'Master Data' },
  { id: 'settings.manage', label: 'Manage Roles, Departments & Scopes', category: 'Administration' },
  { id: 'users.manage', label: 'Onboard & Manage Workforce Directory', category: 'Administration' },
  { id: 'reports.view', label: 'View Audit Trail & Export Reports', category: 'Administration' },
];

/**
 * Calculates effective permissions for an employee considering RBAC role + UBAC direct grants and revocations
 */
export function getEffectivePermissions(employee: Partial<Employee> | undefined, roles: Role[]): {
  effective: string[];
  fromRole: string[];
  ubacGrants: string[];
  ubacRevoked: string[];
} {
  if (!employee) {
    return { effective: [], fromRole: [], ubacGrants: [], ubacRevoked: [] };
  }
  const normEmpRole = (employee.role || '').toLowerCase().replace(/[\s/_-]+/g, '');
  const roleObj = roles.find((r) => {
    const normR = r.name.toLowerCase().replace(/[\s/_-]+/g, '');
    return normR === normEmpRole || r.name.toLowerCase() === (employee.role || '').toLowerCase();
  });
  const fromRole = roleObj?.permissions || [];
  const ubacGrants = employee.customPermissions || [];
  const ubacRevoked = employee.revokedPermissions || [];

  const combined = Array.from(new Set([...fromRole, ...ubacGrants]));
  const effective = combined.filter((p) => !ubacRevoked.includes(p));

  return {
    effective,
    fromRole,
    ubacGrants,
    ubacRevoked,
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
}

export interface PlantLocation {
  id: string;
  code: string;
  name: string;
  city: string;
  type: string;
  manager: string;
  warehousesCount: number;
  departmentsCount: number;
  description: string;
  status: 'Active' | 'Commissioning' | 'Inactive';
}

export interface SupplierItem {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  leadTimeAvg: number;
  gstNumber?: string;
  address?: string;
}

export interface WarehouseItem {
  id: string;
  name: string;
  plant: string;
  type: string;
  capacityUnits: number;
  manager?: string;
}

interface MipsState {
  materials: Material[];
  products: Product[];
  stockLedger: StockLedgerEntry[];
  purchaseOrders: PurchaseOrder[];
  grnEntries: GRNEntry[];
  customerPOs: CustomerPO[];
  customers: Customer[];
  suppliers: SupplierItem[];
  warehouses: WarehouseItem[];
  dispatchRecords: OutwardDispatchRecord[];
  kits: ProductionKit[];
  finishedGoods: FinishedGoodItem[];
  finishedGoodsLedger: FinishedGoodsLedgerEntry[];
  productionLogs: ProductionLog[];
  auditLogs: AuditLog[];
  roles: Role[];
  departments: Department[];
  employees: Employee[];
  plants: PlantLocation[];
  categories: MasterCategory[];
  wattages: MasterWattage[];

  // Actions
  addCategory: (cat: Omit<MasterCategory, 'id'>) => Promise<MasterCategory>;
  deleteCategory: (id: string) => Promise<void>;
  addWattage: (w: Omit<MasterWattage, 'id'>) => Promise<MasterWattage>;
  updateWattage: (id: string, updates: Partial<MasterWattage>) => Promise<MasterWattage>;
  deleteWattage: (id: string) => Promise<void>;
  addMaterial: (material: Omit<Material, 'id'>) => void;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (
    materialId: string,
    adjustmentQty: number,
    reason: string,
    user: string,
    meta?: {
      transactionType?: StockLedgerEntry['transactionType'];
      supplier?: string;
      invoiceNo?: string;
      batchNo?: string;
      unitCost?: number;
      warehouse?: string;
      debitNoteNo?: string;
      referenceNo?: string;
      sourceDestination?: string;
    }
  ) => void;
  
  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void;
  updatePO: (id: string, updates: Partial<PurchaseOrder>) => void;
  updatePOStatus: (id: string, status: PurchaseOrder['status'], notes?: string) => void;
  createGRN: (grn: Omit<GRNEntry, 'id'>, user: string) => void;

  // Customer PO & Outbound Dispatch Actions
  createCustomerPO: (po: Omit<CustomerPO, 'id' | 'totalAmount' | 'totalOrderedQty' | 'totalDispatchedQty' | 'totalPendingQty' | 'status'>) => void;
  updateCustomerPO: (id: string, updates: Partial<CustomerPO>) => void;
  dispatchCustomerPO: (dispatchData: {
    customerPoId: string;
    transporter: string;
    vehicleNo: string;
    ewayBillNo: string;
    items: { productId: string; qty: number }[];
    closeAfterDispatch?: boolean;
    user: string;
    notes?: string;
  }) => void;
  closeCustomerPO: (id: string, reason?: string, user?: string) => void;
  addCustomer: (cust: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  createKit: (kit: Omit<ProductionKit, 'id' | 'kitNumber' | 'status' | 'createdDate'>) => { success: boolean; error?: string };
  updateKitStatus: (id: string, status: ProductionKit['status'], user: string) => void;
  recordKitProgress: (kitId: string, updates: { materialId: string; consumedQty: number; returnedQty: number; wastageQty: number }[], user: string) => void;
  reconcileAndCloseKit: (kitId: string, notes: string, user: string) => { success: boolean; error?: string };

  // Finished Goods Store (FGS) Actions
  inwardToFinishedGoods: (item: Omit<FinishedGoodItem, 'id' | 'availableQty'>, user: string) => void;
  adjustFinishedGoodsStock: (id: string, deltaQty: number, reason: string, user: string) => void;
  updateFinishedGoodStatus: (id: string, status: FinishedGoodItem['status'], notes?: string, user?: string) => void;

  addProductionLog: (log: Omit<ProductionLog, 'id' | 'unitsPerHour' | 'productivityPct'>) => void;
  updateProductionLog: (id: string, updates: Partial<ProductionLog>) => void;
  deleteProductionLog: (id: string) => void;
  addAuditLog: (user: string, action: string, module: string, details: string) => void;
  
  // Dynamic Roles, Departments & Onboarding Actions
  addRole: (role: Omit<Role, 'id'>) => void;
  updateRole: (id: string, updates: Partial<Role>) => void;
  deleteRole: (id: string) => void;

  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  // Plant & Location Actions
  addPlant: (plant: Omit<PlantLocation, 'id'>) => void;
  updatePlant: (id: string, updates: Partial<PlantLocation>) => void;
  deletePlant: (id: string) => void;

  // Suppliers & Warehouses
  addSupplier: (supplier: Omit<SupplierItem, 'id'>) => void;
  updateSupplier: (id: string, updates: Partial<SupplierItem>) => void;
  deleteSupplier: (id: string) => void;

  addWarehouse: (warehouse: Omit<WarehouseItem, 'id'>) => void;
  updateWarehouse: (id: string, updates: Partial<WarehouseItem>) => void;
  deleteWarehouse: (id: string) => void;

  onboardEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  updateEmployeeUBAC: (id: string, customPermissions: string[], revokedPermissions: string[]) => void;
  deactivateEmployee: (id: string) => void;
  deleteEmployee: (id: string) => void;
  setEmployees: (employees: Employee[]) => void;

  selectedPlant: string;
  setSelectedPlant: (plant: string) => void;

  initData: () => Promise<void>;
  resetToDefaultData: () => void;
}

export const useMipsStore = create<MipsState>()((set, get) => ({
      materials: [],
      products: [],
      stockLedger: [],
      purchaseOrders: [],
      grnEntries: [],
      customerPOs: [],
      customers: [],
      suppliers: [],
      warehouses: [],
      dispatchRecords: [],
      kits: [],
      finishedGoods: [],
      finishedGoodsLedger: [],
      productionLogs: [],
      roles: [],
      departments: [],
      employees: [],
      plants: [],
      categories: [],
      wattages: [],
      selectedPlant: 'All Plants (Global View)',
      setSelectedPlant: (plant) => set({ selectedPlant: plant }),
      auditLogs: [],

      addMaterial: (newMat) => {
        const id = `mat-${Date.now()}`;
        const activePlant = get().selectedPlant;
        const plant = newMat.plant || (!activePlant || activePlant.startsWith('All') ? (get().plants[0]?.name || '') : activePlant);
        const material: Material = { ...newMat, plant, id };
        set((state) => ({
          materials: [...state.materials, material],
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'admin@mips.internal',
              action: 'MATERIAL_CREATED',
              module: 'Master Data',
              details: `Added new material ${material.code} - ${material.name} (${plant})`
            },
            ...state.auditLogs
          ]
        }));
        mipsService.createMaterial(material).catch(reportSyncError('Failed to sync material to DB'));
      },

      updateMaterial: (id, updates) => {
        set((state) => ({
          materials: state.materials.map((m) => (m.id === id ? { ...m, ...updates } : m))
        }));
        mipsService.updateMaterial(id, updates).catch(reportSyncError('Failed to update material in DB'));
      },

      deleteMaterial: (id) => {
        set((state) => ({
          materials: state.materials.filter((m) => m.id !== id)
        }));
        mipsService.deleteMaterial(id).catch(reportSyncError('Failed to delete material from DB'));
      },

      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: `prod-${Date.now()}`
        };
        set((state) => ({
          products: [newProduct, ...state.products]
        }));
        mipsService.createProduct(newProduct).catch(reportSyncError('Failed to sync product to DB'));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p))
        }));
        mipsService.updateProduct(id, updates).catch(reportSyncError('Failed to update product in DB'));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id)
        }));
        mipsService.deleteProduct(id).catch(reportSyncError('Failed to delete product from DB'));
      },

      adjustStock: (materialId, adjustmentQty, reason, user, meta) => {
        const material = get().materials.find((m) => m.id === materialId);
        if (!material) return;

        const newStock = Math.max(0, material.currentStock + adjustmentQty);
        const activePlant = get().selectedPlant;
        const plant = material.plant || (!activePlant || activePlant.startsWith('All') ? (get().plants[0]?.name || '') : activePlant);

        const defaultTxType: StockLedgerEntry['transactionType'] =
          adjustmentQty >= 0 ? 'Adjustment (+)' : 'Adjustment (-)';
        const transactionType = meta?.transactionType || defaultTxType;

        const defaultRef =
          adjustmentQty >= 0
            ? `IN-${Math.floor(1000 + Math.random() * 9000)}`
            : `OUT-${Math.floor(1000 + Math.random() * 9000)}`;
        const referenceNo = meta?.referenceNo || meta?.invoiceNo || meta?.debitNoteNo || defaultRef;

        const entry: StockLedgerEntry = {
          id: `led-${Date.now()}`,
          date: new Date().toLocaleString(),
          materialId,
          materialCode: material.code,
          materialName: material.name,
          transactionType,
          referenceNo,
          warehouse: meta?.warehouse || material.warehouse,
          plant,
          inQty: adjustmentQty >= 0 ? adjustmentQty : 0,
          outQty: adjustmentQty < 0 ? Math.abs(adjustmentQty) : 0,
          balanceQty: newStock,
          user,
          notes: reason,
          supplier: meta?.supplier || material.supplier,
          invoiceNo: meta?.invoiceNo,
          batchNo: meta?.batchNo,
          unitCost: meta?.unitCost || material.standardCost,
          debitNoteNo: meta?.debitNoteNo,
          sourceDestination: meta?.sourceDestination
        };

        set((state) => ({
          materials: state.materials.map((m) => (m.id === materialId ? { ...m, currentStock: newStock } : m)),
          stockLedger: [entry, ...state.stockLedger],
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user,
              action: transactionType.toUpperCase().replace(/[\s\(\)\-\/\+]+/g, '_'),
              module: 'Inventory',
              details: `${transactionType} for ${material.code} by ${adjustmentQty > 0 ? '+' : ''}${adjustmentQty} ${material.uom}. ${
                meta?.supplier ? `Party: ${meta.supplier}. ` : ''
              }${meta?.batchNo ? `Batch: ${meta.batchNo}. ` : ''}Reason: ${reason}`
            },
            ...state.auditLogs
          ]
        }));

        mipsService.createStockLedger(entry).catch(reportSyncError('Failed to sync stock ledger'));
        mipsService.updateMaterial(materialId, { currentStock: newStock }).catch(reportSyncError('Failed to sync material stock'));
      },

      createPurchaseOrder: (poData) => {
        const activePlant = get().selectedPlant;
        const plant = poData.plant || (!activePlant || activePlant.startsWith('All') ? (get().plants[0]?.name || '') : activePlant);
        const po: PurchaseOrder = {
          ...poData,
          plant,
          id: `po-${Date.now()}`,
          poNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
          receivedQty: 0,
          pendingQty: poData.orderedQty,
        };

        set((state) => ({
          purchaseOrders: [po, ...state.purchaseOrders],
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'purchase.manager@mips.internal',
              action: 'PO_CREATED',
              module: 'Procurement',
              details: `Created PO ${po.poNumber} for ${po.materialName} (${po.orderedQty} units) at ${plant}`
            },
            ...state.auditLogs
          ]
        }));

        mipsService.createPurchaseOrder(po).catch(reportSyncError('Failed to sync purchase order'));
      },

      updatePO: (id, updates) => {
        set((state) => ({
          purchaseOrders: state.purchaseOrders.map((p) => (p.id === id ? { ...p, ...updates } : p)),
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'purchase.manager@mips.internal',
              action: 'PO_UPDATED',
              module: 'Procurement',
              details: `Updated details for PO ID: ${id}`
            },
            ...state.auditLogs
          ]
        }));

        mipsService.updatePurchaseOrder(id, updates).catch(reportSyncError('Failed to update PO'));
      },

      updatePOStatus: (id, status, notes) => {
        set((state) => ({
          purchaseOrders: state.purchaseOrders.map((p) => (p.id === id ? { ...p, status } : p)),
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'purchase.manager@mips.internal',
              action: 'PO_STATUS_CHANGED',
              module: 'Procurement',
              details: `Updated PO ${id} to ${status}. ${notes || ''}`
            },
            ...state.auditLogs
          ]
        }));

        mipsService.updatePurchaseOrder(id, { status, notes }).catch(reportSyncError('Failed to update PO status'));
      },

      createGRN: (grnData, user) => {
        const id = `grn-${Date.now()}`;
        const activePlant = get().selectedPlant;
        const targetPO = get().purchaseOrders.find((p) => p.poNumber === grnData.poNumber);
        const plant = grnData.plant || targetPO?.plant || (!activePlant || activePlant.startsWith('All') ? (get().plants[0]?.name || '') : activePlant);
        const grn: GRNEntry = { ...grnData, plant, id };
        
        // Update PO pending & received quantity
        const updatedPOs = get().purchaseOrders.map((p) => {
          if (p.poNumber === grn.poNumber) {
            const newReceived = p.receivedQty + grn.acceptedQty;
            const newPending = Math.max(0, p.orderedQty - newReceived);
            return {
              ...p,
              receivedQty: newReceived,
              pendingQty: newPending,
              status: (newPending === 0 ? 'Received' : 'Partially Received') as PurchaseOrder['status']
            };
          }
          return p;
        });

        // Add accepted stock to material inventory
        const material = get().materials.find((m) => m.id === grn.materialId);
        const newBalance = (material?.currentStock || 0) + grn.acceptedQty;
        const updatedMaterials = get().materials.map((m) =>
          m.id === grn.materialId ? { ...m, currentStock: newBalance } : m
        );

        // Add Stock Ledger entry
        const ledgerEntry: StockLedgerEntry = {
          id: `led-${Date.now()}`,
          date: new Date().toLocaleString(),
          materialId: grn.materialId,
          materialCode: material?.code || '',
          materialName: grn.materialName,
          transactionType: 'Goods Receipt (GRN)',
          referenceNo: grn.grnNumber,
          warehouse: grn.warehouse,
          plant,
          inQty: grn.acceptedQty,
          outQty: 0,
          balanceQty: newBalance,
          user,
          notes: `GRN received against ${grn.poNumber}. Accepted: ${grn.acceptedQty}, Rejected: ${grn.rejectedQty}, Damaged: ${grn.damagedQty}`
        };

        set((state) => ({
          grnEntries: [grn, ...state.grnEntries],
          purchaseOrders: updatedPOs,
          materials: updatedMaterials,
          stockLedger: [ledgerEntry, ...state.stockLedger],
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user,
              action: 'GRN_CREATED',
              module: 'Procurement',
              details: `Generated GRN ${grn.grnNumber} for ${grn.acceptedQty} units of ${grn.materialName} (${plant}).`
            },
            ...state.auditLogs
          ]
        }));

        mipsService.createGRNEntry(grn).catch(reportSyncError('Failed to sync GRN'));
        mipsService.createStockLedger(ledgerEntry).catch(reportSyncError('Failed to sync GRN ledger'));
        if (targetPO) {
          const newReceived = targetPO.receivedQty + grn.acceptedQty;
          const newPending = Math.max(0, targetPO.orderedQty - newReceived);
          mipsService.updatePurchaseOrder(targetPO.id, {
            receivedQty: newReceived,
            pendingQty: newPending,
            status: (newPending === 0 ? 'Received' : 'Partially Received')
          }).catch(reportSyncError('Failed to update PO in GRN'));
        }
        if (material) {
          mipsService.updateMaterial(material.id, { currentStock: newBalance }).catch(reportSyncError('Failed to update material stock in GRN'));
        }
      },

      createCustomerPO: (poData) => {
        const activePlant = get().selectedPlant;
        const plant = poData.plant || (!activePlant || activePlant.startsWith('All') ? (get().plants[0]?.name || '') : activePlant);
        const totalOrderedQty = poData.items.reduce((sum, item) => sum + item.orderedQty, 0);
        const totalAmount = poData.items.reduce((sum, item) => sum + item.orderedQty * item.unitPrice, 0);

        const newPO: CustomerPO = {
          ...poData,
          id: `cpo-${Date.now()}`,
          plant,
          totalOrderedQty,
          totalDispatchedQty: 0,
          totalPendingQty: totalOrderedQty,
          totalAmount,
          status: 'New Order',
          items: poData.items.map((i) => ({
            ...i,
            dispatchedQty: 0,
            pendingQty: i.orderedQty,
          })),
        };

        set((state) => ({
          customerPOs: [newPO, ...state.customerPOs],
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'sales.dispatch@mips.internal',
              action: 'CUSTOMER_PO_RECORDED',
              module: 'Customer Orders',
              details: `Received Customer PO ${newPO.customerPoNumber} from ${newPO.customerName} for ₹${totalAmount.toLocaleString()} (${totalOrderedQty} units).`
            },
            ...state.auditLogs
          ]
        }));

        mipsService.createCustomerPO({
          customerPoNumber: newPO.customerPoNumber,
          customerName: newPO.customerName,
          customerGst: newPO.customerGst,
          billingCity: newPO.billingCity,
          poDate: newPO.poDate,
          expectedDispatchDate: newPO.expectedDispatchDate,
          totalAmount: newPO.totalAmount,
          totalOrderedQty: newPO.totalOrderedQty,
          totalDispatchedQty: newPO.totalDispatchedQty,
          totalPendingQty: newPO.totalPendingQty,
          status: newPO.status,
          uploadedFileName: newPO.uploadedFileName,
          notes: newPO.notes,
          plant: newPO.plant,
          items: newPO.items,
        }).catch(reportSyncError('Failed to sync Customer PO to MySQL'));
      },

      updateCustomerPO: (id, updates) => {
        set((state) => ({
          customerPOs: state.customerPOs.map((p) => (p.id === id ? { ...p, ...updates } : p)),
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'sales.dispatch@mips.internal',
              action: 'CUSTOMER_PO_UPDATED',
              module: 'Customer Orders',
              details: `Updated Customer PO ID: ${id}`
            },
            ...state.auditLogs
          ]
        }));
        mipsService.updateCustomerPO(id, updates).catch(reportSyncError('Failed to update Customer PO in MySQL'));
      },

      dispatchCustomerPO: (dispatchData) => {
        const targetPO = get().customerPOs.find((p) => p.id === dispatchData.customerPoId);
        if (!targetPO) return;

        const activePlant = get().selectedPlant;
        const plant = targetPO.plant || (!activePlant || activePlant.startsWith('All') ? (get().plants[0]?.name || '') : activePlant);
        const dispatchNo = `DC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        let totalDispatchUnits = 0;
        let totalDispatchValue = 0;

        const dispatchItems = dispatchData.items.map((inp) => {
          const poItem = targetPO.items.find((item) => item.productId === inp.productId);
          const unitPrice = poItem?.unitPrice || 0;
          totalDispatchUnits += inp.qty;
          totalDispatchValue += inp.qty * unitPrice;
          return {
            productId: inp.productId,
            productName: poItem?.productName || 'Finished LED Product',
            qty: inp.qty,
            unitPrice,
          };
        });

        const newDispatch: OutwardDispatchRecord = {
          id: `disp-${Date.now()}`,
          dispatchNo,
          customerPoId: targetPO.id,
          customerPoNumber: targetPO.customerPoNumber,
          customerName: targetPO.customerName,
          dispatchDate: new Date().toLocaleString(),
          transporter: dispatchData.transporter,
          vehicleNo: dispatchData.vehicleNo,
          ewayBillNo: dispatchData.ewayBillNo,
          items: dispatchItems,
          totalUnits: totalDispatchUnits,
          totalValue: totalDispatchValue,
          plant,
          dispatchedBy: dispatchData.user || 'Store & Dispatch Manager',
          notes: dispatchData.notes,
        };

        // Update target Customer PO items and aggregate totals
        let allItemsFulfilled = true;
        let totalDispatched = 0;
        let totalPending = 0;

        const updatedItems = targetPO.items.map((item) => {
          const dispatchedInThisRun = dispatchData.items.find((d) => d.productId === item.productId)?.qty || 0;
          const newDispatched = item.dispatchedQty + dispatchedInThisRun;
          const newPending = Math.max(0, item.orderedQty - newDispatched);
          if (newPending > 0) allItemsFulfilled = false;
          totalDispatched += newDispatched;
          totalPending += newPending;
          return {
            ...item,
            dispatchedQty: newDispatched,
            pendingQty: newPending,
          };
        });

        let newStatus: CustomerPO['status'] = 'Partially Dispatched';
        if (dispatchData.closeAfterDispatch || allItemsFulfilled) {
          newStatus = allItemsFulfilled ? 'Fully Dispatched' : 'Closed';
        }

        const updatedPOs = get().customerPOs.map((p) =>
          p.id === targetPO.id
            ? {
                ...p,
                items: updatedItems,
                totalDispatchedQty: totalDispatched,
                totalPendingQty: totalPending,
                status: newStatus,
              }
            : p
        );

        // Deduct dispatched items from Finished Goods Store (FIFO by available batch)
        const currentFG = [...get().finishedGoods];
        const newFgLedgers: FinishedGoodsLedgerEntry[] = [];
        const touchedFgIds = new Set<string>();

        dispatchData.items.forEach((inp) => {
          let neededQty = inp.qty;
          if (neededQty <= 0) return;

          for (let i = 0; i < currentFG.length && neededQty > 0; i++) {
            const fg = currentFG[i];
            if (fg.productId === inp.productId && fg.quantityOnHand > 0) {
              const deductQty = Math.min(fg.quantityOnHand, neededQty);
              neededQty -= deductQty;
              const newOnHand = fg.quantityOnHand - deductQty;
              const newAllocated = Math.max(0, fg.allocatedQty - deductQty);
              const newAvailable = Math.max(0, newOnHand - newAllocated);
              touchedFgIds.add(fg.id);

              currentFG[i] = {
                ...fg,
                quantityOnHand: newOnHand,
                allocatedQty: newAllocated,
                availableQty: newAvailable,
                status: newOnHand === 0 ? 'Depleted' : fg.status,
              };

              newFgLedgers.push({
                id: `fg-led-${Date.now()}-${fg.id}`,
                date: new Date().toLocaleString(),
                productId: fg.productId,
                productCode: fg.productCode,
                productName: fg.productName,
                batchLotNumber: fg.batchLotNumber,
                transactionType: 'Customer Dispatch',
                referenceNo: dispatchNo,
                plant,
                warehouse: fg.warehouse,
                inQty: 0,
                outQty: deductQty,
                balanceQty: newOnHand,
                user: dispatchData.user || 'Store & Dispatch Manager',
                notes: `Dispatched to ${targetPO.customerName} against PO ${targetPO.customerPoNumber} via ${dispatchData.transporter || 'Carrier'} (${dispatchData.vehicleNo || 'Direct'}).`
              });
            }
          }
        });

        set((state) => ({
          customerPOs: updatedPOs,
          dispatchRecords: [newDispatch, ...state.dispatchRecords],
          finishedGoods: currentFG,
          finishedGoodsLedger: [...newFgLedgers, ...state.finishedGoodsLedger],
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: dispatchData.user || 'Dispatch Manager',
              action: 'CUSTOMER_GOODS_DISPATCHED',
              module: 'Customer Orders',
              details: `Generated Outward Challan ${dispatchNo} for ${totalDispatchUnits} units to ${targetPO.customerName} (Status: ${newStatus}). Deducted from Finished Goods Store.`
            },
            ...state.auditLogs
          ]
        }));

        mipsService.createOutwardDispatch({
          id: newDispatch.id,
          dispatchedBy: newDispatch.dispatchedBy,
          dispatchNo: newDispatch.dispatchNo,
          customerPoId: newDispatch.customerPoId,
          customerPoNumber: newDispatch.customerPoNumber,
          customerName: newDispatch.customerName,
          dispatchDate: new Date().toISOString().split('T')[0],
          transporter: newDispatch.transporter,
          vehicleNumber: newDispatch.vehicleNo,
          ewayBillNumber: newDispatch.ewayBillNo,
          totalDispatchedUnits: newDispatch.totalUnits,
          notes: newDispatch.notes,
          plant: newDispatch.plant,
          items: newDispatch.items,
        }).catch(reportSyncError('Failed to sync Outward Dispatch to MySQL'));
        mipsService
          .updateCustomerPO(targetPO.id, {
            items: updatedItems,
            totalDispatchedQty: totalDispatched,
            totalPendingQty: totalPending,
            status: newStatus,
          })
          .catch(reportSyncError('Failed to sync Customer PO dispatch totals'));
        currentFG
          .filter((fg) => touchedFgIds.has(fg.id))
          .forEach((fg) =>
            mipsService
              .updateFinishedGood(fg.id, {
                quantityOnHand: fg.quantityOnHand,
                allocatedQty: fg.allocatedQty,
                availableQty: fg.availableQty,
                status: fg.status,
              })
              .catch(reportSyncError('Failed to sync Finished Goods deduction'))
          );
        newFgLedgers.forEach((entry) =>
          mipsService.createFinishedGoodsLedger(entry).catch(reportSyncError('Failed to sync Finished Goods Ledger'))
        );
      },

      closeCustomerPO: (id, reason, user = 'Plant Dispatch Head') => {
        set((state) => ({
          customerPOs: state.customerPOs.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: 'Closed',
                  notes: p.notes ? `${p.notes} | Closed manually: ${reason}` : `Closed manually: ${reason}`
                }
              : p
          ),
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user,
              action: 'CUSTOMER_PO_CLOSED',
              module: 'Customer Orders',
              details: `Closed Customer PO ${id}. Reason: ${reason || 'Manual closure'}`
            },
            ...state.auditLogs
          ]
        }));
        mipsService.updateCustomerPO(id, { status: 'Closed', notes: reason }).catch(reportSyncError('Failed to close Customer PO in MySQL'));
      },

      addCustomer: (newCust) => {
        const id = `cust-${Date.now()}`;
        const customer: Customer = { ...newCust, id };
        set((state) => ({
          customers: [...state.customers, customer],
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'sales.head@mips.internal',
              action: 'CUSTOMER_CREATED',
              module: 'Master Data',
              details: `Added new buyer / client: ${customer.name} (GSTIN: ${customer.gstin}).`
            },
            ...state.auditLogs
          ]
        }));
        mipsService.createCustomer(customer).catch(reportSyncError('Failed to sync Customer to MySQL'));
      },

      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c)),
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'sales.head@mips.internal',
              action: 'CUSTOMER_UPDATED',
              module: 'Master Data',
              details: `Updated details for customer ID: ${id}`
            },
            ...state.auditLogs
          ]
        }));
        mipsService.updateCustomer(id, updates).catch(reportSyncError('Failed to update Customer in MySQL'));
      },

      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'sales.head@mips.internal',
              action: 'CUSTOMER_DELETED',
              module: 'Master Data',
              details: `Deleted customer ID: ${id}`
            },
            ...state.auditLogs
          ]
        }));
        mipsService.deleteCustomer(id).catch(reportSyncError('Failed to delete Customer from MySQL'));
      },

      createKit: (kitData) => {
        // Enforce inventory limit: verify available warehouse stock for every kit item
        const shortages: string[] = [];
        for (const item of kitData.items) {
          const mat = get().materials.find((m) => m.id === item.materialId);
          const availableStock = mat?.currentStock || 0;
          if (availableStock < item.totalIssuedQty) {
            shortages.push(
              `${item.materialName} (${item.materialCode}): Required ${item.totalIssuedQty}, Available ${availableStock}`
            );
          }
        }

        if (shortages.length > 0) {
          return {
            success: false,
            error: `Insufficient stock to issue kit:\n• ${shortages.join('\n• ')}`
          };
        }

        const id = `kit-${Date.now()}`;
        const kitNumber = `KIT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const activePlant = get().selectedPlant;
        const plant = kitData.plant || (!activePlant || activePlant.startsWith('All') ? (get().plants[0]?.name || '') : activePlant);
        const kit: ProductionKit = {
          ...kitData,
          plant,
          id,
          kitNumber,
          status: 'Issued',
          createdDate: new Date().toISOString().split('T')[0],
          issueDate: new Date().toLocaleString(),
        };

        // Deduct from warehouse stock and transfer to stockWithEmployees
        const updatedMaterials = get().materials.map((mat) => {
          const kitItem = kit.items.find((item) => item.materialId === mat.id);
          if (kitItem) {
            return {
              ...mat,
              currentStock: Math.max(0, mat.currentStock - kitItem.totalIssuedQty),
              stockWithEmployees: mat.stockWithEmployees + kitItem.totalIssuedQty
            };
          }
          return mat;
        });

        // Add ledger entries for kit issue
        const newLedgerEntries: StockLedgerEntry[] = kit.items.map((item) => {
          const mat = get().materials.find((m) => m.id === item.materialId);
          const currentBal = mat?.currentStock || 0;
          return {
            id: `led-${Date.now()}-${item.materialId}`,
            date: new Date().toLocaleString(),
            materialId: item.materialId,
            materialCode: item.materialCode,
            materialName: item.materialName,
            transactionType: 'Kit Issue',
            referenceNo: kitNumber,
            warehouse: mat?.warehouse || 'Main Raw Material Store',
            plant: kit.plant,
            inQty: 0,
            outQty: item.totalIssuedQty,
            balanceQty: Math.max(0, currentBal - item.totalIssuedQty),
            user: kit.supervisor,
            notes: `Issued kit ${kitNumber} to ${kit.assignedEmployee} for ${kit.plannedBatchQty} units of ${kit.productName}`
          };
        });

        set((state) => ({
          kits: [kit, ...state.kits],
          materials: updatedMaterials,
          stockLedger: [...newLedgerEntries, ...state.stockLedger],
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: kit.supervisor,
              action: 'KIT_ISSUED',
              module: 'Kits',
              details: `Created and issued ${kitNumber} to ${kit.assignedEmployee} (${plant})`
            },
            ...state.auditLogs
          ]
        }));

        mipsService.createKit(kit).catch(reportSyncError('Failed to sync Kit to MySQL'));
        newLedgerEntries.forEach((entry) =>
          mipsService.createStockLedger(entry).catch(reportSyncError('Failed to sync kit issue ledger'))
        );
        updatedMaterials
          .filter((mat) => kit.items.some((item) => item.materialId === mat.id))
          .forEach((mat) =>
            mipsService
              .updateMaterial(mat.id, { currentStock: mat.currentStock, stockWithEmployees: mat.stockWithEmployees })
              .catch(reportSyncError('Failed to sync material stock on kit issue'))
          );
        return { success: true };
      },

      updateKitStatus: (id, status, user) => {
        set((state) => ({
          kits: state.kits.map((k) => (k.id === id ? { ...k, status } : k)),
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user,
              action: 'KIT_STATUS_UPDATED',
              module: 'Kits',
              details: `Kit ${id} status updated to ${status}`
            },
            ...state.auditLogs
          ]
        }));
        mipsService.updateKit(id, { status }).catch(reportSyncError('Failed to update Kit in MySQL'));
      },

      recordKitProgress: (kitId, updates, user) => {
        set((state) => ({
          kits: state.kits.map((kit) => {
            if (kit.id !== kitId) return kit;
            const updatedItems = kit.items.map((item) => {
              const u = updates.find((up) => up.materialId === item.materialId);
              if (!u) return item;
              const remaining = Math.max(0, item.totalIssuedQty - (u.consumedQty + u.returnedQty + u.wastageQty));
              return {
                ...item,
                consumedQty: u.consumedQty,
                returnedQty: u.returnedQty,
                wastageQty: u.wastageQty,
                balanceWithEmployee: remaining
              };
            });
            return {
              ...kit,
              status: 'In Production',
              items: updatedItems
            };
          }),
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user,
              action: 'KIT_PROGRESS_LOGGED',
              module: 'Kits',
              details: `Logged material consumption & returns for Kit ${kitId}`
            },
            ...state.auditLogs
          ]
        }));
        const updatedKit = get().kits.find((k) => k.id === kitId);
        if (updatedKit) {
          mipsService
            .updateKit(kitId, { status: updatedKit.status, items: updatedKit.items })
            .catch(reportSyncError('Failed to sync kit progress to MySQL'));
        }
      },

      reconcileAndCloseKit: (kitId, notes, user) => {
        const kit = get().kits.find((k) => k.id === kitId);
        if (!kit) return { success: false, error: 'Kit not found' };

        // BRD Rule: Issued = Consumed + Returned + Approved Wastage
        const hasDiscrepancy = kit.items.some(
          (item) => item.totalIssuedQty !== (item.consumedQty + item.returnedQty + item.wastageQty)
        );

        if (hasDiscrepancy && !notes) {
          return {
            success: false,
            error: 'Reconciliation does not balance: Issued != (Consumed + Returned + Wastage). Supervisor approval notes required.'
          };
        }

        // Return remaining returned stock back to inventory and reduce stockWithEmployees
        const updatedMaterials = get().materials.map((mat) => {
          const kitItem = kit.items.find((item) => item.materialId === mat.id);
          if (kitItem) {
            return {
              ...mat,
              currentStock: mat.currentStock + kitItem.returnedQty,
              stockWithEmployees: Math.max(0, mat.stockWithEmployees - kitItem.totalIssuedQty)
            };
          }
          return mat;
        });

        // Add return ledger entries if returnedQty > 0
        const returnLedgers: StockLedgerEntry[] = kit.items
          .filter((item) => item.returnedQty > 0)
          .map((item) => {
            const mat = get().materials.find((m) => m.id === item.materialId);
            return {
              id: `led-${Date.now()}-ret-${item.materialId}`,
              date: new Date().toLocaleString(),
              materialId: item.materialId,
              materialCode: item.materialCode,
              materialName: item.materialName,
              transactionType: 'Material Return',
              referenceNo: kit.kitNumber,
              warehouse: mat?.warehouse || 'Main Raw Material Store',
              plant: kit.plant,
              inQty: item.returnedQty,
              outQty: 0,
              balanceQty: (mat?.currentStock || 0) + item.returnedQty,
              user,
              notes: `Returned from closed kit ${kit.kitNumber} by ${kit.assignedEmployee}`
            };
          });

        // Compute good finished units produced from assembly consumption
        const primaryItem = kit.items[0];
        const goodUnitsProduced = primaryItem ? Math.max(0, primaryItem.consumedQty) : kit.plannedBatchQty;
        const primaryScrap = primaryItem ? primaryItem.wastageQty : 0;

        const product = get().products.find((p) => p.id === kit.productId);
        const activePlant = get().selectedPlant;
        const plant = kit.plant || (!activePlant || activePlant.startsWith('All') ? (get().plants[0]?.name || '') : activePlant);
        const batchLotNumber = `LOT-FG-${kit.kitNumber}`;

        let newFgItem: FinishedGoodItem | null = null;
        let newFgLedger: FinishedGoodsLedgerEntry | null = null;

        if (goodUnitsProduced > 0) {
          newFgItem = {
            id: `fg-${Date.now()}`,
            productId: kit.productId,
            productCode: product?.code || 'FG-LED',
            productName: kit.productName,
            category: product?.category || 'LED Products',
            wattage: product?.wattage,
            batchLotNumber,
            plant,
            warehouse: 'Finished Goods Packaging Store',
            quantityOnHand: goodUnitsProduced,
            allocatedQty: 0,
            availableQty: goodUnitsProduced,
            rejectionsQty: primaryScrap,
            productionDate: new Date().toLocaleDateString('en-CA'),
            kitId: kit.id,
            kitNumber: kit.kitNumber,
            standardCost: product?.standardCost || 150,
            sellingPrice: Number(((product?.standardCost || 150) * 1.35).toFixed(2)),
            status: 'Ready for Dispatch',
            notes: `Auto-inwarded from closed assembly kit ${kit.kitNumber} (Operator: ${kit.assignedEmployee}). Passed QA.`
          };

          newFgLedger = {
            id: `fg-led-${Date.now()}`,
            date: new Date().toLocaleString(),
            productId: kit.productId,
            productCode: product?.code || 'FG-LED',
            productName: kit.productName,
            batchLotNumber,
            transactionType: 'Production Inward',
            referenceNo: kit.kitNumber,
            plant,
            warehouse: 'Finished Goods Packaging Store',
            inQty: goodUnitsProduced,
            outQty: 0,
            balanceQty: goodUnitsProduced,
            user,
            notes: `Production assembly completion from Kit ${kit.kitNumber}. ${goodUnitsProduced} good units passed QA, ${primaryScrap} rejected.`
          };
        }

        set((state) => ({
          kits: state.kits.map((k) =>
            k.id === kitId
              ? {
                  ...k,
                  status: 'Closed',
                  closedDate: new Date().toLocaleString(),
                  reconciliationNotes: notes || 'Kit reconciled and closed cleanly.'
                }
              : k
          ),
          materials: updatedMaterials,
          stockLedger: [...returnLedgers, ...state.stockLedger],
          finishedGoods: newFgItem ? [newFgItem, ...state.finishedGoods] : state.finishedGoods,
          finishedGoodsLedger: newFgLedger ? [newFgLedger, ...state.finishedGoodsLedger] : state.finishedGoodsLedger,
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user,
              action: 'KIT_CLOSED_RECONCILED',
              module: 'Kits',
              details: `Supervisor ${user} reconciled and closed ${kit.kitNumber}. ${goodUnitsProduced} finished units transferred to Finished Goods Store. Notes: ${notes}`
            },
            ...state.auditLogs
          ]
        }));

        const closedKit = get().kits.find((k) => k.id === kitId);
        mipsService
          .updateKit(kitId, {
            status: 'Closed',
            closedDate: closedKit?.closedDate,
            reconciliationNotes: closedKit?.reconciliationNotes,
            items: kit.items,
          })
          .catch(reportSyncError('Failed to sync kit closure to MySQL'));
        returnLedgers.forEach((entry) =>
          mipsService.createStockLedger(entry).catch(reportSyncError('Failed to sync kit return ledger'))
        );
        updatedMaterials
          .filter((mat) => kit.items.some((item) => item.materialId === mat.id))
          .forEach((mat) =>
            mipsService
              .updateMaterial(mat.id, { currentStock: mat.currentStock, stockWithEmployees: mat.stockWithEmployees })
              .catch(reportSyncError('Failed to sync material stock on kit close'))
          );
        if (newFgItem) {
          mipsService.createFinishedGood(newFgItem).catch(reportSyncError('Failed to sync kit output to Finished Goods'));
        }
        if (newFgLedger) {
          mipsService.createFinishedGoodsLedger(newFgLedger).catch(reportSyncError('Failed to sync Finished Goods Ledger'));
        }

        return { success: true };
      },

      inwardToFinishedGoods: (itemData, user) => {
        const id = `fg-${Date.now()}`;
        const activePlant = get().selectedPlant;
        const plant = itemData.plant || (!activePlant || activePlant.startsWith('All') ? (get().plants[0]?.name || '') : activePlant);
        const availableQty = Math.max(0, itemData.quantityOnHand - (itemData.allocatedQty || 0));

        const newItem: FinishedGoodItem = {
          ...itemData,
          id,
          plant,
          availableQty,
          notes: itemData.notes || `Manual FGS inward recorded by ${user}`
        };

        const ledgerEntry: FinishedGoodsLedgerEntry = {
          id: `fg-led-${Date.now()}`,
          date: new Date().toLocaleString(),
          productId: newItem.productId,
          productCode: newItem.productCode,
          productName: newItem.productName,
          batchLotNumber: newItem.batchLotNumber,
          transactionType: 'Manual Inward',
          referenceNo: `FGS-IN-${Math.floor(1000 + Math.random() * 9000)}`,
          plant,
          warehouse: newItem.warehouse,
          inQty: newItem.quantityOnHand,
          outQty: 0,
          balanceQty: newItem.quantityOnHand,
          user,
          notes: newItem.notes
        };

        set((state) => ({
          finishedGoods: [newItem, ...state.finishedGoods],
          finishedGoodsLedger: [ledgerEntry, ...state.finishedGoodsLedger],
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user,
              action: 'FGS_INWARD',
              module: 'Finished Goods',
              details: `Inwarded ${newItem.quantityOnHand} units of ${newItem.productName} (Batch: ${newItem.batchLotNumber}) into ${newItem.warehouse}`
            },
            ...state.auditLogs
          ]
        }));

        mipsService.createFinishedGood(newItem).catch(reportSyncError('Failed to sync Finished Good to MySQL'));
        mipsService.createFinishedGoodsLedger(ledgerEntry).catch(reportSyncError('Failed to sync Finished Goods Ledger to MySQL'));
      },

      adjustFinishedGoodsStock: (id, deltaQty, reason, user) => {
        const target = get().finishedGoods.find((f) => f.id === id);
        if (!target) return;

        const newOnHand = Math.max(0, target.quantityOnHand + deltaQty);
        const newAvailable = Math.max(0, newOnHand - target.allocatedQty);
        const updatedStatus = newOnHand === 0 ? 'Depleted' : target.status;

        const ledgerEntry: FinishedGoodsLedgerEntry = {
          id: `fg-led-${Date.now()}`,
          date: new Date().toLocaleString(),
          productId: target.productId,
          productCode: target.productCode,
          productName: target.productName,
          batchLotNumber: target.batchLotNumber,
          transactionType: 'Stock Adjustment',
          referenceNo: `ADJ-FG-${Math.floor(1000 + Math.random() * 9000)}`,
          plant: target.plant,
          warehouse: target.warehouse,
          inQty: deltaQty > 0 ? deltaQty : 0,
          outQty: deltaQty < 0 ? Math.abs(deltaQty) : 0,
          balanceQty: newOnHand,
          user,
          notes: `FGS Adjustment: ${reason} (Authorized: ${user})`
        };

        set((state) => ({
          finishedGoods: state.finishedGoods.map((f) =>
            f.id === id
              ? {
                  ...f,
                  quantityOnHand: newOnHand,
                  availableQty: newAvailable,
                  status: updatedStatus,
                  notes: `${f.notes || ''} | Adjusted: ${reason}`
                }
              : f
          ),
          finishedGoodsLedger: [ledgerEntry, ...state.finishedGoodsLedger],
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user,
              action: 'FGS_STOCK_ADJUSTMENT',
              module: 'Finished Goods',
              details: `Adjusted FGS stock for ${target.productName} (${deltaQty > 0 ? '+' : ''}${deltaQty} units). New balance: ${newOnHand}. Reason: ${reason}`
            },
            ...state.auditLogs
          ]
        }));

        mipsService.updateFinishedGood(id, { quantityOnHand: newOnHand, availableQty: newAvailable, status: updatedStatus }).catch(reportSyncError('Failed to update Finished Good in MySQL'));
        mipsService.createFinishedGoodsLedger(ledgerEntry).catch(reportSyncError('Failed to sync Finished Goods Ledger in MySQL'));
      },

      updateFinishedGoodStatus: (id, status, notes, user = 'Quality Incharge') => {
        const target = get().finishedGoods.find((f) => f.id === id);
        if (!target) return;

        set((state) => ({
          finishedGoods: state.finishedGoods.map((f) =>
            f.id === id
              ? {
                  ...f,
                  status,
                  notes: notes ? `${f.notes || ''} | Status changed to ${status}: ${notes}` : f.notes
                }
              : f
          ),
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user,
              action: 'FGS_STATUS_CHANGED',
              module: 'Finished Goods',
              details: `Changed QA status of batch ${target.batchLotNumber} (${target.productName}) to "${status}". Notes: ${notes || 'None'}`
            },
            ...state.auditLogs
          ]
        }));

        mipsService.updateFinishedGood(id, { status, notes }).catch(reportSyncError('Failed to update Finished Good status in MySQL'));
      },

      addProductionLog: (logData) => {
        const workingHours = logData.workingHours || 8;
        const unitsPerHour = Number((logData.actualQty / workingHours).toFixed(2));
        const productivityPct = Number(((logData.actualQty / logData.targetQty) * 100).toFixed(1));
        const activePlant = get().selectedPlant;
        const plant = logData.plant || (!activePlant || activePlant.startsWith('All') ? (get().plants[0]?.name || '') : activePlant);

        const log: ProductionLog = {
          ...logData,
          plant,
          id: `prod-log-${Date.now()}`,
          unitsPerHour,
          productivityPct
        };

        set((state) => ({
          productionLogs: [log, ...state.productionLogs],
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: log.supervisor,
              action: 'PRODUCTION_ENTRY',
              module: 'Production',
              details: `Production logged for ${log.productName}: ${log.actualQty} units (Target: ${log.targetQty}, ${productivityPct}%) at ${plant}`
            },
            ...state.auditLogs
          ]
        }));

        mipsService.createProductionLog(log).catch(reportSyncError('Failed to sync Production Log to MySQL'));
      },

      updateProductionLog: (id, updates) => {
        set((state) => ({
          productionLogs: state.productionLogs.map((log) => {
            if (log.id !== id) return log;
            const updated = { ...log, ...updates };
            const workingHours = updated.workingHours || 8;
            updated.unitsPerHour = Number((updated.actualQty / workingHours).toFixed(2));
            updated.productivityPct = Number(((updated.actualQty / updated.targetQty) * 100).toFixed(1));
            return updated;
          }),
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: updates.supervisor || 'Production Manager',
              action: 'PRODUCTION_UPDATE',
              module: 'Production',
              details: `Updated production log #${id} - Target: ${updates.targetQty ?? 'unchanged'}, Actual: ${updates.actualQty ?? 'unchanged'}`
            },
            ...state.auditLogs
          ]
        }));

        mipsService.updateProductionLog(id, updates).catch(reportSyncError('Failed to update Production Log in MySQL'));
      },

      deleteProductionLog: (id) => {
        set((state) => ({
          productionLogs: state.productionLogs.filter((log) => log.id !== id),
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'Supervisor',
              action: 'PRODUCTION_DELETE',
              module: 'Production',
              details: `Deleted production entry #${id}`
            },
            ...state.auditLogs
          ]
        }));

        mipsService.deleteProductionLog(id).catch(reportSyncError('Failed to delete Production Log from MySQL'));
      },

      addAuditLog: (user, action, module, details) => {
        set((state) => ({
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user,
              action,
              module,
              details
            },
            ...state.auditLogs
          ]
        }));

        mipsService.createAuditLog({ user, action, module, details, timestamp: new Date().toLocaleString() }).catch(reportSyncError('Failed to sync Audit Log to MySQL'));
      },

      // Dynamic Roles Actions
      addRole: (newRole) => {
        const id = `role-${Date.now()}`;
        const role: Role = { ...newRole, id };
        set((state) => ({
          roles: [...state.roles, role],
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'admin@mips.internal',
              action: 'ROLE_CREATED',
              module: 'Settings & RBAC',
              details: `Created new custom role: ${role.name}`
            },
            ...state.auditLogs
          ]
        }));
        mipsService.createRole(newRole).then((saved) => {
          if (saved && saved.id) {
            set((state) => ({
              roles: state.roles.map((r) => (r.id === id ? { ...r, id: saved.id } : r))
            }));
          }
        }).catch(reportSyncError('Failed to sync Role to MySQL'));
      },

      updateRole: (id, updates) => {
        set((state) => ({
          roles: state.roles.map((r) => (r.id === id ? { ...r, ...updates } : r)),
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'admin@mips.internal',
              action: 'ROLE_UPDATED',
              module: 'Settings & RBAC',
              details: `Updated role permissions for ID: ${id}`
            },
            ...state.auditLogs
          ]
        }));
        mipsService.updateRole(id, updates).catch(reportSyncError('Failed to update Role in MySQL'));
      },

      deleteRole: (id) => {
        const target = get().roles.find((r) => r.id === id);
        if (target?.isSystem) {
          alert('Cannot delete protected system role.');
          return;
        }
        set((state) => ({
          roles: state.roles.filter((r) => r.id !== id),
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'admin@mips.internal',
              action: 'ROLE_DELETED',
              module: 'Settings & RBAC',
              details: `Deleted role: ${target?.name}`
            },
            ...state.auditLogs
          ]
        }));
        mipsService.deleteRole(id).catch(reportSyncError('Failed to delete Role from MySQL'));
      },

      // Dynamic Department Actions
      addDepartment: (newDept) => {
        const id = `dept-${Date.now()}`;
        const dept: Department = { ...newDept, id };
        set((state) => ({
          departments: [...state.departments, dept],
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'admin@mips.internal',
              action: 'DEPARTMENT_CREATED',
              module: 'Settings & Org',
              details: `Created department ${dept.name} at ${dept.plant}`
            },
            ...state.auditLogs
          ]
        }));
        mipsService.createDepartment(newDept).then((saved) => {
          if (saved && saved.id) {
            set((state) => ({
              departments: state.departments.map((d) => (d.id === id ? { ...d, id: saved.id } : d))
            }));
          }
        }).catch(reportSyncError('Failed to sync Department to MySQL'));
      },

      updateDepartment: (id, updates) => {
        set((state) => ({
          departments: state.departments.map((d) => (d.id === id ? { ...d, ...updates } : d))
        }));
        mipsService.updateDepartment(id, updates).catch(reportSyncError('Failed to update Department in MySQL'));
      },

      deleteDepartment: (id) => {
        set((state) => ({
          departments: state.departments.filter((d) => d.id !== id)
        }));
        mipsService.deleteDepartment(id).catch(reportSyncError('Failed to delete Department from MySQL'));
      },

      // Master Categories Actions
      addCategory: async (newCat) => {
        const id = `cat-${Date.now()}`;
        const cat: MasterCategory = { ...newCat, id };
        set((state) => ({
          categories: [...state.categories, cat]
        }));
        try {
          const saved = await mipsService.createCategory(newCat);
          if (saved && saved.id) {
            set((state) => ({
              categories: state.categories.map((c) => (c.id === id ? { ...c, id: saved.id } : c))
            }));
            return saved;
          }
        } catch (err) {
          reportSyncError('Failed to sync Category to MySQL')(err);
        }
        return cat;
      },

      deleteCategory: async (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id)
        }));
        try {
          await mipsService.deleteCategory(id);
        } catch (err) {
          reportSyncError('Failed to delete Category from MySQL')(err);
        }
      },

      // Master Wattages Actions
      addWattage: async (newW) => {
        const id = `watt-${Date.now()}`;
        const w: MasterWattage = { ...newW, id };
        set((state) => ({
          wattages: [...state.wattages, w].sort((a, b) => (Number(a.numericWatts) || 0) - (Number(b.numericWatts) || 0))
        }));
        try {
          const saved = await mipsService.createWattage(newW);
          if (saved && saved.id) {
            set((state) => ({
              wattages: state.wattages.map((item) => (item.id === id ? { ...item, ...saved } : item))
                .sort((a, b) => (Number(a.numericWatts) || 0) - (Number(b.numericWatts) || 0))
            }));
            return saved;
          }
        } catch (err) {
          reportSyncError('Failed to sync Wattage to MySQL')(err);
        }
        return w;
      },

      updateWattage: async (id, updates) => {
        set((state) => ({
          wattages: state.wattages.map((w) => (w.id === id ? { ...w, ...updates } : w))
            .sort((a, b) => (Number(a.numericWatts) || 0) - (Number(b.numericWatts) || 0))
        }));
        try {
          const updated = await mipsService.updateWattage(id, updates);
          return updated;
        } catch (err) {
          reportSyncError('Failed to update Wattage in MySQL')(err);
        }
        return {} as MasterWattage;
      },

      deleteWattage: async (id) => {
        set((state) => ({
          wattages: state.wattages.filter((w) => w.id !== id)
        }));
        try {
          await mipsService.deleteWattage(id);
        } catch (err) {
          reportSyncError('Failed to delete Wattage from MySQL')(err);
        }
      },

      // Plant & Location Actions
      addPlant: (newPlant) => {
        const id = `plant-${Date.now()}`;
        const plant: PlantLocation = { ...newPlant, id };
        set((state) => ({
          plants: [...state.plants, plant],
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'admin@mips.internal',
              action: 'PLANT_LOCATION_CREATED',
              module: 'Settings & UBAC',
              details: `Created facility ${plant.name} (${plant.code}) in ${plant.city}`
            },
            ...state.auditLogs
          ]
        }));
        mipsService.createPlant(newPlant).then((saved) => {
          if (saved && saved.id) {
            set((state) => ({
              plants: state.plants.map((p) => (p.id === id ? { ...p, id: saved.id } : p))
            }));
          }
        }).catch(reportSyncError('Failed to sync Plant to MySQL'));
      },

      updatePlant: (id, updates) => {
        set((state) => ({
          plants: state.plants.map((p) => (p.id === id ? { ...p, ...updates } : p))
        }));
        mipsService.updatePlant(id, updates).catch(reportSyncError('Failed to update Plant in MySQL'));
      },

      deletePlant: (id) => {
        set((state) => ({
          plants: state.plants.filter((p) => p.id !== id)
        }));
        mipsService.deletePlant(id).catch(reportSyncError('Failed to delete Plant from MySQL'));
      },

      // Suppliers & Warehouses
      addSupplier: (supplierData) => {
        const id = `sup-${Date.now()}`;
        const supplier: SupplierItem = { ...supplierData, id };
        set((state) => ({
          suppliers: [...state.suppliers, supplier],
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'procurement.head@mips.internal',
              action: 'SUPPLIER_CREATED',
              module: 'Master Data',
              details: `Added new supplier: ${supplier.name}`
            },
            ...state.auditLogs
          ]
        }));
        mipsService.createSupplier(supplier).catch(reportSyncError('Failed to sync Supplier to MySQL'));
      },

      updateSupplier: (id, updates) => {
        set((state) => ({
          suppliers: state.suppliers.map((s) => (s.id === id ? { ...s, ...updates } : s))
        }));
        mipsService.updateSupplier(id, updates).catch(reportSyncError('Failed to update Supplier in MySQL'));
      },

      deleteSupplier: (id) => {
        set((state) => ({
          suppliers: state.suppliers.filter((s) => s.id !== id)
        }));
        mipsService.deleteSupplier(id).catch(reportSyncError('Failed to delete Supplier from MySQL'));
      },

      addWarehouse: (warehouseData) => {
        const id = `wh-${Date.now()}`;
        const warehouse: WarehouseItem = { ...warehouseData, id };
        set((state) => ({
          warehouses: [...state.warehouses, warehouse],
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'store.head@mips.internal',
              action: 'WAREHOUSE_CREATED',
              module: 'Master Data',
              details: `Created new warehouse: ${warehouse.name} at ${warehouse.plant}`
            },
            ...state.auditLogs
          ]
        }));
        mipsService.createWarehouse(warehouse).catch(reportSyncError('Failed to sync Warehouse to MySQL'));
      },

      updateWarehouse: (id, updates) => {
        set((state) => ({
          warehouses: state.warehouses.map((w) => (w.id === id ? { ...w, ...updates } : w))
        }));
        mipsService.updateWarehouse(id, updates).catch(reportSyncError('Failed to update Warehouse in MySQL'));
      },

      deleteWarehouse: (id) => {
        set((state) => ({
          warehouses: state.warehouses.filter((w) => w.id !== id)
        }));
        mipsService.deleteWarehouse(id).catch(reportSyncError('Failed to delete Warehouse from MySQL'));
      },

      initData: async () => {
        try {
          const [
            materials,
            products,
            purchaseOrders,
            kits,
            productionLogs,
            stockLedgers,
            customerPOs,
            outwardDispatches,
            finishedGoods,
            roles,
            departments,
            plants,
            customers,
            suppliers,
            warehouses,
            grnEntries,
            auditLogs,
            users,
            categories,
            wattages,
            finishedGoodsLedger,
          ] = await Promise.allSettled([
            mipsService.getMaterials(),
            mipsService.getProducts(),
            mipsService.getPurchaseOrders(),
            mipsService.getKits(),
            mipsService.getProductionLogs(),
            mipsService.getStockLedgers(),
            mipsService.getCustomerPOs(),
            mipsService.getOutwardDispatches(),
            mipsService.getFinishedGoods(),
            mipsService.getRoles(),
            mipsService.getDepartments(),
            mipsService.getPlants(),
            mipsService.getCustomers(),
            mipsService.getSuppliers(),
            mipsService.getWarehouses(),
            mipsService.getGRNEntries(),
            mipsService.getAuditLogs(),
            mipsService.getUsers(),
            mipsService.getCategories(),
            mipsService.getWattages(),
            mipsService.getFinishedGoodsLedger(),
          ]).then((results) => {
            // One failing endpoint must not blank out every other module
            const failed = results.filter((r) => r.status === 'rejected').length;
            if (failed > 0) {
              toast.warning(`${failed} data section(s) failed to load from the server. Some screens may look empty - please refresh.`, {
                toastId: 'initData-partial',
              });
            }
            return results.map((r, i) => {
              if (r.status === 'fulfilled') return r.value;
              console.warn(`initData: endpoint #${i} failed to load`, r.reason);
              return undefined;
            });
          });

          set({
            materials: (materials || []).map((m: any) => ({
              ...m,
              currentStock: Number(m.currentStock) || 0,
              stockWithEmployees: Number(m.stockWithEmployees) || 0,
              safetyStock: Number(m.safetyStock) || 0,
              minStock: Number(m.minStock) || 0,
              maxStock: Number(m.maxStock) || 0,
              standardCost: Number(m.standardCost) || 0,
              reorderLevel: Number(m.reorderLevel ?? m.reorderPoint ?? 0),
            })),
            categories: categories || [],
            wattages: (wattages || []).map((w: any) => ({
              ...w,
              numericWatts: Number(w.numericWatts) || 0,
            })),
            products: (products || []).map((p: any) => ({
              ...p,
              standardCost: Number(p.standardCost) || 0,
              bom: parseJsonArray(p.bom, p.bomJson),
            })),
            purchaseOrders: (purchaseOrders || []).map((po: any) => ({
              ...po,
              orderedQty: Number(po.orderedQty) || 0,
              receivedQty: Number(po.receivedQty) || 0,
              pendingQty: Number(po.pendingQty) || 0,
              unitPrice: Number(po.unitPrice ?? po.unitRate ?? 0),
              totalAmount: Number(po.totalAmount) || 0,
              items: parseJsonArray(po.items, po.itemsJson),
            })),
            kits: (kits || []).map((k: any) => {
              const rawItems = parseJsonArray(k.items, k.itemsJson);
              return {
                ...k,
                plannedBatchQty: Number(k.plannedBatchQty) || 0,
                completedQty: Number(k.completedQty) || 0,
                wastageQty: Number(k.wastageQty) || 0,
                items: (rawItems || []).map((item: any) => ({
                  ...item,
                  qtyPerUnit: Number(item.qtyPerUnit) || 0,
                  totalIssuedQty: Number(item.totalIssuedQty ?? item.issuedQty ?? 0),
                  consumedQty: Number(item.consumedQty) || 0,
                  returnedQty: Number(item.returnedQty) || 0,
                  wastageQty: Number(item.wastageQty) || 0,
                  balanceWithEmployee: Number(item.balanceWithEmployee ?? item.heldByWorker ?? 0),
                })),
              };
            }),
            productionLogs: (productionLogs || []).map((pl: any) => ({
              ...pl,
              targetQty: Number(pl.targetQty) || 0,
              actualQty: Number(pl.actualQty) || 0,
              rejectedQty: Number(pl.rejectedQty) || 0,
              workingHours: Number(pl.workingHours) || 0,
              unitsPerHour: Number(pl.unitsPerHour) || 0,
              productivityPct: Number(pl.productivityPct) || 0,
            })),
            stockLedger: (stockLedgers || []).map((sl: any) => ({
              ...sl,
              inQty: Number(sl.inQty) || 0,
              outQty: Number(sl.outQty) || 0,
              balanceQty: Number(sl.balanceQty) || 0,
            })),
            customerPOs: (customerPOs || []).map((cpo: any) => {
              const rawItems = parseJsonArray(cpo.items, cpo.itemsJson);
              return {
                ...cpo,
                totalAmount: Number(cpo.totalAmount) || 0,
                totalOrderedQty: Number(cpo.totalOrderedQty) || 0,
                totalDispatchedQty: Number(cpo.totalDispatchedQty) || 0,
                totalPendingQty: Number(cpo.totalPendingQty) || 0,
                items: (rawItems || []).map((item: any) => ({
                  ...item,
                  orderedQty: Number(item.orderedQty) || 0,
                  dispatchedQty: Number(item.dispatchedQty) || 0,
                  pendingQty: Number(item.pendingQty) || 0,
                  unitPrice: Number(item.unitPrice) || 0,
                })),
              };
            }),
            dispatchRecords: (outwardDispatches || []).map((dc: any) => {
              const rawItems = parseJsonArray(dc.items, dc.itemsJson);
              return {
                ...dc,
                totalDispatchedUnits: Number(dc.totalDispatchedUnits) || 0,
                items: (rawItems || []).map((item: any) => ({
                  ...item,
                  qty: Number(item.qty) || 0,
                  unitPrice: Number(item.unitPrice) || 0,
                })),
              };
            }),
            finishedGoods: (finishedGoods || []).map((fg: any) => ({
              ...fg,
              quantityOnHand: Number(fg.quantityOnHand) || 0,
              allocatedQty: Number(fg.allocatedQty) || 0,
              availableQty: Number(fg.availableQty) || 0,
              sellingPrice: Number(fg.sellingPrice) || 0,
              standardCost: Number(fg.standardCost) || 0,
            })),
            finishedGoodsLedger: (finishedGoodsLedger || []).map((led: any) => ({
              ...led,
              inQty: Number(led.inQty) || 0,
              outQty: Number(led.outQty) || 0,
              balanceQty: Number(led.balanceQty) || 0,
            })),
            roles: (roles || []).map((r: any) => ({
              ...r,
              permissions: parseJsonArray(r.permissions, r.permissionsJson),
            })),
            departments: (departments || []).map((d: any) => ({
              ...d,
              activeTeams: parseJsonArray(d.activeTeams, d.activeTeamsJson),
            })),
            plants: plants || [],
            customers: customers || [],
            suppliers: (suppliers || []).map((s: any) => ({
              ...s,
              leadTimeDays: Number(s.leadTimeDays) || 0,
            })),
            warehouses: (warehouses || []).map((wh: any) => ({
              ...wh,
              capacity: Number(wh.capacity) || 0,
            })),
            grnEntries: (grnEntries || []).map((grn: any) => ({
              ...grn,
              receivedQty: Number(grn.receivedQty) || 0,
              acceptedQty: Number(grn.acceptedQty) || 0,
              rejectedQty: Number(grn.rejectedQty) || 0,
            })),
            auditLogs: auditLogs || [],
            employees: (users || []).map((u: any) => ({
              id: u.id,
              empCode: u.empCode || '',
              name: u.fullName || u.email,
              email: u.email,
              phone: u.phoneNumber || '',
              role: u.role || 'Worker',
              plant: u.plant || '',
              department: u.department || '',
              team: u.team || '',
              supervisor: u.supervisor || '',
              status: u.status || 'Active',
              joiningDate: u.createdAt ? u.createdAt.split('T')[0] : '2026-01-01',
              workstation: u.workstation,
              skills: Array.isArray(u.skills)
                ? u.skills
                : typeof u.skills === 'string' && u.skills
                ? u.skills.split(',').map((s: string) => s.trim())
                : [],
              customPermissions: u.customPermissions || [],
              revokedPermissions: u.revokedPermissions || [],
            })),
          });
        } catch (err) {
          reportSyncError('Failed to initialize store from MySQL backend')(err);
        }
      },

      // Employee Onboarding Actions
      onboardEmployee: (newEmp) => {
        const id = `emp-${Date.now()}`;
        const employee: Employee = { ...newEmp, id };
        set((state) => ({
          employees: [employee, ...state.employees],
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'admin@mips.internal',
              action: 'EMPLOYEE_ONBOARDED',
              module: 'Workforce Onboarding',
              details: `Onboarded ${employee.name} (${employee.empCode}) as ${employee.role} in ${employee.department}`
            },
            ...state.auditLogs
          ]
        }));
      },

      updateEmployee: (id, updates) => {
        set((state) => ({
          employees: state.employees.map((e) => (e.id === id ? { ...e, ...updates } : e))
        }));
      },

      updateEmployeeUBAC: (id, customPermissions, revokedPermissions) => {
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === id ? { ...e, customPermissions, revokedPermissions } : e
          ),
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'admin@mips.internal',
              action: 'UBAC_PERMISSIONS_UPDATED',
              module: 'User-Based Access Control (UBAC)',
              details: `Updated direct UBAC permissions for employee ID ${id}: +${customPermissions.length} grants, -${revokedPermissions.length} restrictions`
            },
            ...state.auditLogs
          ]
        }));
      },

      deactivateEmployee: (id) => {
        set((state) => ({
          employees: state.employees.map((e) => (e.id === id ? { ...e, status: 'Inactive' } : e)),
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'admin@mips.internal',
              action: 'EMPLOYEE_DEACTIVATED',
              module: 'Workforce Onboarding',
              details: `Deactivated employee record ${id}`
            },
            ...state.auditLogs
          ]
        }));
      },

      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((e) => e.id !== id),
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              user: 'admin@mips.internal',
              action: 'EMPLOYEE_DELETED',
              module: 'Workforce Onboarding',
              details: `Deleted employee record ${id}`
            },
            ...state.auditLogs
          ]
        }));
      },

      setEmployees: (employees) => {
        set({ employees });
      },

      resetToDefaultData: () => {
        set({
          materials: [],
          products: [],
          stockLedger: [],
          purchaseOrders: [],
          grnEntries: [],
          customerPOs: [],
          customers: [],
          suppliers: [],
          warehouses: [],
          dispatchRecords: [],
          kits: [],
          finishedGoods: [],
          finishedGoodsLedger: [],
          productionLogs: [],
          roles: [],
          departments: [],
          employees: [],
          plants: [],
          selectedPlant: 'All Plants (Global View)',
          auditLogs: [],
        });
      }
    })
);
