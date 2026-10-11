import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Material {
  id: string;
  code: string;
  name: string;
  category: 'Electronics' | 'Mechanical' | 'Optical' | 'Hardware' | 'Packaging';
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
  category: 'LED Bulbs' | 'Downlights' | 'Battens' | 'Floodlights' | 'Architectural & Gate';
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
  expectedDeliveryDate: string;
  status: 'Draft' | 'Ordered' | 'In Transit' | 'Received' | 'Partially Received' | 'Delayed' | 'Closed';
  transporter?: string;
  trackingNo?: string;
  dispatchDate?: string;
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
  category: 'B2B Brand OEM' | 'Regional Distributor' | 'Wholesale Trader' | 'Direct Institutional';
  paymentTerms: string;
}

export interface KitItem {
  materialId: string;
  materialCode: string;
  materialName: string;
  bomQtyPerUnit: number;
  totalIssuedQty: number;
  consumedQty: number;
  returnedQty: number;
  wastageQty: number;
  balanceWithEmployee: number;
}

export interface ProductionKit {
  id: string;
  kitNumber: string;
  productId: string;
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
    return activePlant.includes('Plant 1') || activePlant.includes('Pune');
  }
  const itemP = itemPlant.toLowerCase();
  const actP = activePlant.toLowerCase();
  return itemP.includes(actP) || actP.includes(itemP);
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
  
  { id: 'procurement.po.create', label: 'Create Purchase Orders (PO)', category: 'Procurement' },
  { id: 'procurement.po.approve', label: 'Approve & Dispatch POs', category: 'Procurement' },
  { id: 'procurement.grn.receive', label: 'Inbound GRN Quality Inspection', category: 'Procurement' },
  
  { id: 'forecast.view', label: 'View 4-Month Forecast Matrix', category: 'Planning' },
  { id: 'forecast.plan', label: 'Adjust Production Run Demands', category: 'Planning' },
  
  { id: 'kits.create', label: 'Create Production Kits from BOM', category: 'Kits & Floor' },
  { id: 'kits.issue', label: 'Issue Material Kits to Operators', category: 'Kits & Floor' },
  { id: 'kits.reconcile', label: 'Log Consumption, Returns & Scrap', category: 'Kits & Floor' },
  { id: 'kits.close', label: 'Supervisor Reconciliation & Kit Closure', category: 'Kits & Floor' },
  
  { id: 'production.log', label: 'Log Daily Shift Output & Units/Hour', category: 'Production' },
  { id: 'production.scrap', label: 'Record QA Rejections & Wastage', category: 'Production' },
  
  { id: 'masters.manage', label: 'Manage Materials, Products & BOMs', category: 'Master Data' },
  { id: 'settings.manage', label: 'Manage Roles, Departments & Scopes', category: 'Administration' },
  { id: 'users.manage', label: 'Onboard & Manage Workforce Directory', category: 'Administration' },
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
  const roleObj = roles.find((r) => r.name === employee.role);
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

interface MipsState {
  materials: Material[];
  products: Product[];
  stockLedger: StockLedgerEntry[];
  purchaseOrders: PurchaseOrder[];
  grnEntries: GRNEntry[];
  customerPOs: CustomerPO[];
  customers: Customer[];
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

  // Actions
  addMaterial: (material: Omit<Material, 'id'>) => void;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
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
  updatePOStatus: (id: string, status: PurchaseOrder['status'], notes?: string) => void;
  createGRN: (grn: Omit<GRNEntry, 'id'>, user: string) => void;

  // Customer PO & Outbound Dispatch Actions
  createCustomerPO: (po: Omit<CustomerPO, 'id' | 'totalAmount' | 'totalOrderedQty' | 'totalDispatchedQty' | 'totalPendingQty' | 'status'>) => void;
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

  createKit: (kit: Omit<ProductionKit, 'id' | 'kitNumber' | 'status' | 'createdDate'>) => void;
  updateKitStatus: (id: string, status: ProductionKit['status'], user: string) => void;
  recordKitProgress: (kitId: string, updates: { materialId: string; consumedQty: number; returnedQty: number; wastageQty: number }[], user: string) => void;
  reconcileAndCloseKit: (kitId: string, notes: string, user: string) => { success: boolean; error?: string };

  // Finished Goods Store (FGS) Actions
  inwardToFinishedGoods: (item: Omit<FinishedGoodItem, 'id' | 'availableQty'>, user: string) => void;
  adjustFinishedGoodsStock: (id: string, deltaQty: number, reason: string, user: string) => void;
  updateFinishedGoodStatus: (id: string, status: FinishedGoodItem['status'], notes?: string, user?: string) => void;

  addProductionLog: (log: Omit<ProductionLog, 'id' | 'unitsPerHour' | 'productivityPct'>) => void;
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

  onboardEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  updateEmployeeUBAC: (id: string, customPermissions: string[], revokedPermissions: string[]) => void;
  deactivateEmployee: (id: string) => void;
  deleteEmployee: (id: string) => void;
  setEmployees: (employees: Employee[]) => void;

  selectedPlant: string;
  setSelectedPlant: (plant: string) => void;

  resetToDefaultData: () => void;
}

const DEFAULT_MATERIALS: Material[] = [
  {
    id: 'mat-001',
    code: 'PCB-12W-FR4',
    name: '12W LED Star MCPCB (Lumileds 2835 Chipset)',
    category: 'Electronics',
    subCategory: 'LED Star Boards',
    uom: 'Pcs',
    supplier: 'Lumileds India Components',
    warehouse: 'Main Raw Material Store',
    location: 'Rack E-01 (Moisture Controlled)',
    currentStock: 3450,
    stockWithEmployees: 180,
    minStock: 2000,
    maxStock: 12000,
    reorderLevel: 3000,
    safetyStock: 1500,
    leadTimeDays: 14,
    standardCost: 42.50,
    plant: 'Plant 1 - Pune Hub',
    status: 'Active',
  },
  {
    id: 'mat-002',
    code: 'PCB-09W-FR4',
    name: '9W LED Star MCPCB (Lumileds 2835 Chipset)',
    category: 'Electronics',
    subCategory: 'LED Star Boards',
    uom: 'Pcs',
    supplier: 'Lumileds India Components',
    warehouse: 'Main Raw Material Store',
    location: 'Rack E-02 (Moisture Controlled)',
    currentStock: 4800,
    stockWithEmployees: 150,
    minStock: 2500,
    maxStock: 15000,
    reorderLevel: 3500,
    safetyStock: 1800,
    leadTimeDays: 14,
    standardCost: 32.00,
    plant: 'Plant 1 - Pune Hub',
    status: 'Active',
  },
  {
    id: 'mat-003',
    code: 'PCB-20W-BAT',
    name: '20W Linear Batten LED Module (4ft Al-Substrate)',
    category: 'Electronics',
    subCategory: 'Linear Modules',
    uom: 'Pcs',
    supplier: 'Lumileds India Components',
    warehouse: 'Main Raw Material Store',
    location: 'Rack E-05',
    currentStock: 1800,
    stockWithEmployees: 80,
    minStock: 1000,
    maxStock: 6000,
    reorderLevel: 1500,
    safetyStock: 800,
    leadTimeDays: 14,
    standardCost: 65.00,
    plant: 'Plant 1 - Pune Hub',
    status: 'Active',
  },
  {
    id: 'mat-004',
    code: 'COB-50W-BRIDG',
    name: '50W High-Lumen Bridgelux COB LED Array (5000K, 90 CRI)',
    category: 'Electronics',
    subCategory: 'COB Arrays',
    uom: 'Pcs',
    supplier: 'Bridgelux Semiconductor',
    warehouse: 'Southern Staging Store',
    location: 'Rack E-09 (Static Protected)',
    currentStock: 950,
    stockWithEmployees: 40,
    minStock: 500,
    maxStock: 3000,
    reorderLevel: 800,
    safetyStock: 400,
    leadTimeDays: 21,
    standardCost: 185.00,
    plant: 'Plant 2 - Hyderabad Hub',
    status: 'Active',
  },
  {
    id: 'mat-005',
    code: 'DRV-12W-IC',
    name: '12W Constant Current Isolated Driver (HPF > 0.95, Surge 2.5kV)',
    category: 'Electronics',
    subCategory: 'Power Supplies',
    uom: 'Pcs',
    supplier: 'Delta Electronics India',
    warehouse: 'Main Raw Material Store',
    location: 'Rack D-01',
    currentStock: 2150,
    stockWithEmployees: 120,
    minStock: 1500,
    maxStock: 8000,
    reorderLevel: 2500,
    safetyStock: 1200,
    leadTimeDays: 10,
    standardCost: 58.00,
    plant: 'Plant 1 - Pune Hub',
    status: 'Active',
  },
  {
    id: 'mat-006',
    code: 'DRV-09W-IC',
    name: '9W Constant Current Isolated Driver (HPF > 0.92)',
    category: 'Electronics',
    subCategory: 'Power Supplies',
    uom: 'Pcs',
    supplier: 'Delta Electronics India',
    warehouse: 'Main Raw Material Store',
    location: 'Rack D-02',
    currentStock: 3200,
    stockWithEmployees: 140,
    minStock: 2000,
    maxStock: 10000,
    reorderLevel: 2800,
    safetyStock: 1400,
    leadTimeDays: 10,
    standardCost: 46.00,
    plant: 'Plant 1 - Pune Hub',
    status: 'Active',
  },
  {
    id: 'mat-007',
    code: 'DRV-50W-IP67',
    name: '50W IP67 Waterproof Constant Current Driver (4kV Surge)',
    category: 'Electronics',
    subCategory: 'Outdoor Drivers',
    uom: 'Pcs',
    supplier: 'Delta Electronics India',
    warehouse: 'Heavy Luminaire Assembly Buffer',
    location: 'Rack D-07',
    currentStock: 620,
    stockWithEmployees: 30,
    minStock: 400,
    maxStock: 2500,
    reorderLevel: 600,
    safetyStock: 300,
    leadTimeDays: 14,
    standardCost: 240.00,
    plant: 'Plant 2 - Hyderabad Hub',
    status: 'Active',
  },
  {
    id: 'mat-008',
    code: 'HSG-12W-ALU',
    name: '12W Aluminium Die-Cast Thermally Conductive Housing',
    category: 'Mechanical',
    subCategory: 'Heatsinks & Enclosures',
    uom: 'Pcs',
    supplier: 'Sunlit Precision Die-Cast',
    warehouse: 'Main Raw Material Store',
    location: 'Bay M-03',
    currentStock: 6400,
    stockWithEmployees: 250,
    minStock: 2500,
    maxStock: 14000,
    reorderLevel: 4000,
    safetyStock: 2000,
    leadTimeDays: 7,
    standardCost: 34.00,
    plant: 'Plant 1 - Pune Hub',
    status: 'Active',
  },
  {
    id: 'mat-009',
    code: 'HSG-09W-ALU',
    name: '9W Aluminium Die-Cast Housing Shell',
    category: 'Mechanical',
    subCategory: 'Heatsinks & Enclosures',
    uom: 'Pcs',
    supplier: 'Sunlit Precision Die-Cast',
    warehouse: 'Main Raw Material Store',
    location: 'Bay M-04',
    currentStock: 5100,
    stockWithEmployees: 200,
    minStock: 2500,
    maxStock: 12000,
    reorderLevel: 3500,
    safetyStock: 1800,
    leadTimeDays: 7,
    standardCost: 26.50,
    plant: 'Plant 1 - Pune Hub',
    status: 'Active',
  },
  {
    id: 'mat-010',
    code: 'HSG-50W-FLD',
    name: '50W Pressure Die-Cast IP66 Floodlight Enclosure with Fin Radiator',
    category: 'Mechanical',
    subCategory: 'Heavy Castings',
    uom: 'Pcs',
    supplier: 'Sunlit Precision Die-Cast',
    warehouse: 'Southern Staging Store',
    location: 'Bay M-10',
    currentStock: 800,
    stockWithEmployees: 40,
    minStock: 400,
    maxStock: 3000,
    reorderLevel: 700,
    safetyStock: 350,
    leadTimeDays: 10,
    standardCost: 195.00,
    plant: 'Plant 2 - Hyderabad Hub',
    status: 'Active',
  },
  {
    id: 'mat-011',
    code: 'DIF-12W-PC',
    name: '12W High Transmittance Polycarbonate Frosted Dome Diffuser',
    category: 'Optical',
    subCategory: 'Diffusers',
    uom: 'Pcs',
    supplier: 'Sunlit Precision Die-Cast',
    warehouse: 'Main Raw Material Store',
    location: 'Bay O-01',
    currentStock: 7800,
    stockWithEmployees: 180,
    minStock: 3000,
    maxStock: 15000,
    reorderLevel: 4500,
    safetyStock: 2000,
    leadTimeDays: 5,
    standardCost: 12.50,
    plant: 'Plant 1 - Pune Hub',
    status: 'Active',
  },
  {
    id: 'mat-012',
    code: 'WIR-PTFE-22',
    name: '22AWG High-Temp PTFE Connecting Wire Harness (Pre-Stripped)',
    category: 'Hardware',
    subCategory: 'Wiring & Cables',
    uom: 'Sets',
    supplier: 'Apex Cables & Electrical Fasteners',
    warehouse: 'Main Raw Material Store',
    location: 'Shelf W-02',
    currentStock: 8500,
    stockWithEmployees: 250,
    minStock: 3000,
    maxStock: 20000,
    reorderLevel: 5000,
    safetyStock: 2500,
    leadTimeDays: 4,
    standardCost: 4.80,
    plant: 'Plant 1 - Pune Hub',
    status: 'Active',
  },
  {
    id: 'mat-013',
    code: 'SCR-M3-SS',
    name: 'SS M3x6 Phillips Pan Head Assembly Screws',
    category: 'Hardware',
    subCategory: 'Fasteners',
    uom: 'Pcs',
    supplier: 'Apex Cables & Electrical Fasteners',
    warehouse: 'Main Raw Material Store',
    location: 'Shelf F-08',
    currentStock: 32000,
    stockWithEmployees: 600,
    minStock: 10000,
    maxStock: 80000,
    reorderLevel: 20000,
    safetyStock: 10000,
    leadTimeDays: 3,
    standardCost: 0.75,
    plant: 'Plant 1 - Pune Hub',
    status: 'Active',
  },
  {
    id: 'mat-014',
    code: 'BOX-12W-RET',
    name: '12W Eiffel Premium Retail Printed Inner Monocarton (350 GSM)',
    category: 'Packaging',
    subCategory: 'Retail Monocartons',
    uom: 'Pcs',
    supplier: 'Packwell Corrugations',
    warehouse: 'Finished Goods Packaging Store',
    location: 'Pallet P-01',
    currentStock: 11000,
    stockWithEmployees: 0,
    minStock: 4000,
    maxStock: 25000,
    reorderLevel: 6000,
    safetyStock: 3000,
    leadTimeDays: 7,
    standardCost: 4.50,
    plant: 'Plant 1 - Pune Hub',
    status: 'Active',
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    code: 'EFL-BLB-12W',
    name: 'Eiffel 12W Prime Eco LED Bulb (B22)',
    category: 'LED Bulbs',
    wattage: '12W',
    unit: 'Unit',
    standardCost: 161.05,
    status: 'Active',
    bom: [
      { materialId: 'mat-001', materialCode: 'PCB-12W-FR4', materialName: '12W LED Star MCPCB', qtyPerUnit: 1, uom: 'Pcs' },
      { materialId: 'mat-005', materialCode: 'DRV-12W-IC', materialName: '12W Isolated Driver', qtyPerUnit: 1, uom: 'Pcs' },
      { materialId: 'mat-008', materialCode: 'HSG-12W-ALU', materialName: '12W Aluminium Housing Shell', qtyPerUnit: 1, uom: 'Pcs' },
      { materialId: 'mat-011', materialCode: 'DIF-12W-PC', materialName: '12W PC Diffuser Dome', qtyPerUnit: 1, uom: 'Pcs' },
      { materialId: 'mat-012', materialCode: 'WIR-PTFE-22', materialName: '22AWG Wire Harness', qtyPerUnit: 1, uom: 'Sets' },
      { materialId: 'mat-013', materialCode: 'SCR-M3-SS', materialName: 'SS M3x6 Assembly Screws', qtyPerUnit: 2, uom: 'Pcs' },
      { materialId: 'mat-014', materialCode: 'BOX-12W-RET', materialName: '12W Eiffel Retail Box', qtyPerUnit: 1, uom: 'Pcs' },
    ]
  },
  {
    id: 'prod-002',
    code: 'EFL-BLB-09W',
    name: 'Eiffel 9W Classic LED Bulb (B22)',
    category: 'LED Bulbs',
    wattage: '9W',
    unit: 'Unit',
    standardCost: 124.50,
    status: 'Active',
    bom: [
      { materialId: 'mat-002', materialCode: 'PCB-09W-FR4', materialName: '9W LED Star MCPCB', qtyPerUnit: 1, uom: 'Pcs' },
      { materialId: 'mat-006', materialCode: 'DRV-09W-IC', materialName: '9W Isolated Driver', qtyPerUnit: 1, uom: 'Pcs' },
      { materialId: 'mat-009', materialCode: 'HSG-09W-ALU', materialName: '9W Aluminium Housing', qtyPerUnit: 1, uom: 'Pcs' },
      { materialId: 'mat-011', materialCode: 'DIF-12W-PC', materialName: 'PC Diffuser Dome', qtyPerUnit: 1, uom: 'Pcs' },
      { materialId: 'mat-012', materialCode: 'WIR-PTFE-22', materialName: '22AWG Wire Harness', qtyPerUnit: 1, uom: 'Sets' },
      { materialId: 'mat-013', materialCode: 'SCR-M3-SS', materialName: 'SS M3x6 Screws', qtyPerUnit: 2, uom: 'Pcs' },
      { materialId: 'mat-014', materialCode: 'BOX-12W-RET', materialName: 'Retail Monocarton', qtyPerUnit: 1, uom: 'Pcs' },
    ]
  },
  {
    id: 'prod-003',
    code: 'EFL-BAT-20W',
    name: 'Eiffel 20W Linear Slim Batten (4ft)',
    category: 'Battens',
    wattage: '20W',
    unit: 'Unit',
    standardCost: 285.00,
    status: 'Active',
    bom: [
      { materialId: 'mat-003', materialCode: 'PCB-20W-BAT', materialName: '20W Linear Batten LED Module', qtyPerUnit: 2, uom: 'Pcs' },
      { materialId: 'mat-005', materialCode: 'DRV-12W-IC', materialName: 'Batten Power Driver', qtyPerUnit: 1, uom: 'Pcs' },
      { materialId: 'mat-012', materialCode: 'WIR-PTFE-22', materialName: '22AWG Wire Harness', qtyPerUnit: 2, uom: 'Sets' },
      { materialId: 'mat-013', materialCode: 'SCR-M3-SS', materialName: 'SS M3x6 Assembly Screws', qtyPerUnit: 4, uom: 'Pcs' },
    ]
  },
  {
    id: 'prod-004',
    code: 'EFL-DL-15W',
    name: 'Eiffel 15W Architectural Recessed Downlight',
    category: 'Downlights',
    wattage: '15W',
    unit: 'Unit',
    standardCost: 340.00,
    status: 'Active',
    bom: [
      { materialId: 'mat-001', materialCode: 'PCB-12W-FR4', materialName: 'LED Engine Board', qtyPerUnit: 1, uom: 'Pcs' },
      { materialId: 'mat-005', materialCode: 'DRV-12W-IC', materialName: 'Downlight Driver', qtyPerUnit: 1, uom: 'Pcs' },
      { materialId: 'mat-008', materialCode: 'HSG-12W-ALU', materialName: 'Die-Cast Downlight Trim', qtyPerUnit: 1, uom: 'Pcs' },
      { materialId: 'mat-011', materialCode: 'DIF-12W-PC', materialName: 'Frosted Optical Lens', qtyPerUnit: 1, uom: 'Pcs' },
    ]
  },
  {
    id: 'prod-005',
    code: 'EFL-FLD-50W',
    name: 'Eiffel 50W Commercial Outdoor IP66 Floodlight',
    category: 'Floodlights',
    wattage: '50W',
    unit: 'Unit',
    standardCost: 890.00,
    status: 'Active',
    bom: [
      { materialId: 'mat-004', materialCode: 'COB-50W-BRIDG', materialName: '50W Bridgelux COB LED Array', qtyPerUnit: 1, uom: 'Pcs' },
      { materialId: 'mat-007', materialCode: 'DRV-50W-IP67', materialName: '50W IP67 Waterproof Driver', qtyPerUnit: 1, uom: 'Pcs' },
      { materialId: 'mat-010', materialCode: 'HSG-50W-FLD', materialName: '50W Die-Cast Floodlight Housing', qtyPerUnit: 1, uom: 'Pcs' },
      { materialId: 'mat-012', materialCode: 'WIR-PTFE-22', materialName: 'Wire Harness', qtyPerUnit: 2, uom: 'Sets' },
      { materialId: 'mat-013', materialCode: 'SCR-M3-SS', materialName: 'SS Fasteners', qtyPerUnit: 8, uom: 'Pcs' },
    ]
  }
];

const DEFAULT_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-101',
    poNumber: 'PO-2026-089',
    supplier: 'Lumileds India Components',
    poDate: '2026-09-28',
    materialId: 'mat-001',
    materialName: '12W LED Star PCB (Lumileds Chipset)',
    orderedQty: 5000,
    receivedQty: 0,
    pendingQty: 5000,
    unitRate: 42.50,
    expectedDeliveryDate: '2026-10-06',
    status: 'In Transit',
    transporter: 'V-Trans Express (AWB: VT-892110)',
    trackingNo: 'VT-892110',
    dispatchDate: '2026-10-01',
    plant: 'Plant 1 - Pune Hub',
  },
  {
    id: 'po-102',
    poNumber: 'PO-2026-090',
    supplier: 'Delta Electronics India',
    poDate: '2026-09-29',
    materialId: 'mat-002',
    materialName: '12W Constant Current Isolated Driver (HPF)',
    orderedQty: 4000,
    receivedQty: 1000,
    pendingQty: 3000,
    unitRate: 58.00,
    expectedDeliveryDate: '2026-10-08',
    status: 'Partially Received',
    transporter: 'TCI Freight Logistics',
    trackingNo: 'TCI-54129',
    dispatchDate: '2026-10-02',
    plant: 'Plant 1 - Pune Hub',
  },
  {
    id: 'po-103',
    poNumber: 'PO-2026-091',
    supplier: 'Sunlit Precision Die-Cast',
    poDate: '2026-10-01',
    materialId: 'mat-003',
    materialName: '12W Aluminium Die-Cast Bulb Housing Shell',
    orderedQty: 6000,
    receivedQty: 0,
    pendingQty: 6000,
    unitRate: 34.00,
    expectedDeliveryDate: '2026-10-12',
    status: 'Ordered',
    plant: 'Plant 1 - Pune Hub',
  },
  {
    id: 'po-104',
    poNumber: 'PO-2026-085',
    supplier: 'Packwell Corrugations',
    poDate: '2026-09-20',
    materialId: 'mat-007',
    materialName: '12W Eiffel Premium Retail Printed Inner Box',
    orderedQty: 10000,
    receivedQty: 10000,
    pendingQty: 0,
    unitRate: 5.50,
    expectedDeliveryDate: '2026-09-29',
    status: 'Received',
    plant: 'Plant 1 - Pune Hub',
  },
  {
    id: 'po-201',
    poNumber: 'PO-2026-HYD-01',
    supplier: 'Bridgelux Semiconductor',
    poDate: '2026-10-01',
    materialId: 'mat-101',
    materialName: '50W High-Lumen Bridgelux COB LED Array',
    orderedQty: 1000,
    receivedQty: 0,
    pendingQty: 1000,
    unitRate: 185.00,
    expectedDeliveryDate: '2026-10-15',
    status: 'In Transit',
    transporter: 'Gati KWE Express (AWB: GATI-HYD-772)',
    trackingNo: 'GATI-HYD-772',
    dispatchDate: '2026-10-02',
    plant: 'Plant 2 - Hyderabad Hub',
  }
];

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001',
    name: 'Havells Consumer Luminaires',
    gstin: '27AABCH1092P1ZF',
    city: 'Pune',
    state: 'Maharashtra',
    contactPerson: 'Sanjay Deshpande',
    phone: '+91 98220 54101',
    email: 'procurement@havells.com',
    category: 'B2B Brand OEM',
    paymentTerms: '30 Days Net from Delivery Challan',
  },
  {
    id: 'cust-002',
    name: 'Bajaj Electricals Distribution Ltd',
    gstin: '27AAACB2201D1Z4',
    city: 'Mumbai',
    state: 'Maharashtra',
    contactPerson: 'Rajiv Mehta',
    phone: '+91 98201 99234',
    email: 'r.mehta@bajajelectricals.com',
    category: 'Regional Distributor',
    paymentTerms: '45 Days Credit PDC',
  },
  {
    id: 'cust-003',
    name: 'Crompton Greaves Consumer Electricals',
    gstin: '27AAACC2024L1Z2',
    city: 'Nagpur',
    state: 'Maharashtra',
    contactPerson: 'Anjali Nair',
    phone: '+91 97120 44001',
    email: 'lighting.orders@crompton.co.in',
    category: 'B2B Brand OEM',
    paymentTerms: 'Immediate upon E-Way Bill clearance',
  },
  {
    id: 'cust-004',
    name: 'Shree Balaji Electricals & Hardware',
    gstin: '36AABCS4401M1Z8',
    city: 'Secunderabad',
    state: 'Telangana',
    contactPerson: 'G. Balakrishna',
    phone: '+91 98490 33211',
    email: 'balaji.distributors@gmail.com',
    category: 'Wholesale Trader',
    paymentTerms: 'Cash on Delivery (COD) / RTGS',
  },
  {
    id: 'cust-005',
    name: 'Syska LED Innovations Pvt Ltd',
    gstin: '27AAECS9812K1Z9',
    city: 'Pune',
    state: 'Maharashtra',
    contactPerson: 'Mahesh Agarwal',
    phone: '+91 99230 88200',
    email: 'supplychain@syskaled.com',
    category: 'B2B Brand OEM',
    paymentTerms: '60 Days LC',
  },
  {
    id: 'cust-006',
    name: 'Orient Electric Commercial Division',
    gstin: '19AAHCO4491Q1ZT',
    city: 'Kolkata',
    state: 'West Bengal',
    contactPerson: 'Subhasish Sen',
    phone: '+91 98300 77123',
    email: 'commercial.east@orientelectric.com',
    category: 'Regional Distributor',
    paymentTerms: '30 Days Net',
  },
  {
    id: 'cust-007',
    name: 'Philips Lighting Signify Partner (North)',
    gstin: '06AABCS1102R1Z3',
    city: 'Gurgaon',
    state: 'Haryana',
    contactPerson: 'Rohan Chadha',
    phone: '+91 98110 55432',
    email: 'partner.orders@signify.com',
    category: 'B2B Brand OEM',
    paymentTerms: '45 Days Credit',
  }
];

const DEFAULT_CUSTOMER_POS: CustomerPO[] = [
  {
    id: 'cpo-101',
    customerPoNumber: 'PO/BAJAJ/2026/8841',
    customerName: 'Bajaj Electricals Distribution Ltd',
    customerGst: '27AAACB2201D1Z4',
    billingCity: 'Mumbai, Maharashtra',
    poDate: '2026-09-28',
    expectedDispatchDate: '2026-10-10',
    status: 'Partially Dispatched',
    plant: 'Plant 1 - Pune Hub',
    uploadedFileName: 'Bajaj_Purchase_Order_8841.pdf',
    totalOrderedQty: 8000,
    totalDispatchedQty: 4500,
    totalPendingQty: 3500,
    totalAmount: 656000,
    notes: 'Urgent festival stock for festive lighting rollout in West Zone.',
    items: [
      {
        productId: 'prod-001',
        productCode: 'BLB-12W-ECO',
        productName: 'Eiffel 12W Prime Eco LED Bulb (B22)',
        orderedQty: 5000,
        dispatchedQty: 3000,
        pendingQty: 2000,
        unitPrice: 88.00,
        uom: 'Pcs'
      },
      {
        productId: 'prod-002',
        productCode: 'BLB-9W-ECO',
        productName: 'Eiffel 9W GlowBright LED Bulb (B22)',
        orderedQty: 3000,
        dispatchedQty: 1500,
        pendingQty: 1500,
        unitPrice: 72.00,
        uom: 'Pcs'
      }
    ]
  },
  {
    id: 'cpo-102',
    customerPoNumber: 'HVL/EIF/2026/049',
    customerName: 'Havells Consumer Luminaires',
    customerGst: '27AABCH1092P1ZF',
    billingCity: 'Pune, Maharashtra',
    poDate: '2026-10-01',
    expectedDispatchDate: '2026-10-18',
    status: 'New Order',
    plant: 'Plant 1 - Pune Hub',
    uploadedFileName: 'Havells_Luminaires_Order_049.pdf',
    totalOrderedQty: 2000,
    totalDispatchedQty: 0,
    totalPendingQty: 2000,
    totalAmount: 480000,
    notes: 'OEM packaging requirements with custom barcode stickers.',
    items: [
      {
        productId: 'prod-003',
        productCode: 'BAT-20W-SLM',
        productName: 'Eiffel 20W Linear Slim Batten (4 Ft)',
        orderedQty: 2000,
        dispatchedQty: 0,
        pendingQty: 2000,
        unitPrice: 240.00,
        uom: 'Pcs'
      }
    ]
  },
  {
    id: 'cpo-103',
    customerPoNumber: 'BALAJI/PO/2026/110',
    customerName: 'Shree Balaji Electricals & Hardware',
    customerGst: '36AABCS4401M1Z8',
    billingCity: 'Secunderabad, Telangana',
    poDate: '2026-09-22',
    expectedDispatchDate: '2026-10-02',
    status: 'Fully Dispatched',
    plant: 'Plant 2 - Hyderabad Hub',
    uploadedFileName: 'Balaji_PO_110_Executed.pdf',
    totalOrderedQty: 400,
    totalDispatchedQty: 400,
    totalPendingQty: 0,
    totalAmount: 356000,
    notes: 'Delivered directly to warehouse via Safechem Logistics.',
    items: [
      {
        productId: 'prod-005',
        productCode: 'FLD-50W-IP66',
        productName: 'Eiffel 50W Industrial Floodlight (IP66)',
        orderedQty: 400,
        dispatchedQty: 400,
        pendingQty: 0,
        unitPrice: 890.00,
        uom: 'Pcs'
      }
    ]
  },
  {
    id: 'cpo-104',
    customerPoNumber: 'CROMP/WEST/2026/502',
    customerName: 'Crompton Greaves Consumer Electricals',
    customerGst: '27AAACC2024L1Z2',
    billingCity: 'Nagpur, Maharashtra',
    poDate: '2026-09-15',
    expectedDispatchDate: '2026-09-30',
    status: 'Closed',
    plant: 'Plant 1 - Pune Hub',
    uploadedFileName: 'Crompton_PO_502_Signed.pdf',
    totalOrderedQty: 4000,
    totalDispatchedQty: 3800,
    totalPendingQty: 0,
    totalAmount: 332500,
    notes: 'Client agreed to close PO at 3,800 units due to freight space limitation.',
    items: [
      {
        productId: 'prod-001',
        productCode: 'BLB-12W-ECO',
        productName: 'Eiffel 12W Prime Eco LED Bulb (B22)',
        orderedQty: 4000,
        dispatchedQty: 3800,
        pendingQty: 0,
        unitPrice: 87.50,
        uom: 'Pcs'
      }
    ]
  }
];

const DEFAULT_DISPATCH_RECORDS: OutwardDispatchRecord[] = [
  {
    id: 'disp-001',
    dispatchNo: 'DC-2026-00412',
    customerPoId: 'cpo-101',
    customerPoNumber: 'PO/BAJAJ/2026/8841',
    customerName: 'Bajaj Electricals Distribution Ltd',
    dispatchDate: '2026-10-01 04:30 PM',
    transporter: 'V-Trans Logistics India',
    vehicleNo: 'MH-12-RN-8812',
    ewayBillNo: 'EWB-991204882190',
    totalUnits: 4500,
    totalValue: 372000,
    plant: 'Plant 1 - Pune Hub',
    dispatchedBy: 'Ramesh Sharma (Store Manager)',
    notes: 'First tranche of festive lighting dispatch. 3000 pcs 12W and 1500 pcs 9W bulbs.',
    items: [
      {
        productId: 'prod-001',
        productName: 'Eiffel 12W Prime Eco LED Bulb (B22)',
        qty: 3000,
        unitPrice: 88.00
      },
      {
        productId: 'prod-002',
        productName: 'Eiffel 9W GlowBright LED Bulb (B22)',
        qty: 1500,
        unitPrice: 72.00
      }
    ]
  }
];

const DEFAULT_KITS: ProductionKit[] = [
  {
    id: 'kit-001',
    kitNumber: 'KIT-2026-1001',
    productId: 'prod-001',
    productName: 'Eiffel 12W Prime Eco LED Bulb (B22)',
    plannedBatchQty: 100,
    assignedEmployee: 'Ravi Kumar',
    supervisor: 'Suresh Patil (Supervisor - Line 1)',
    department: 'Final Assembly Line 1',
    plant: 'Plant 1 - Pune Hub',
    status: 'Issued',
    createdDate: '2026-10-02',
    issueDate: '2026-10-02 09:30 AM',
    items: [
      {
        materialId: 'mat-001',
        materialCode: 'PCB-12W-FR4',
        materialName: '12W LED Star PCB',
        bomQtyPerUnit: 1,
        totalIssuedQty: 100,
        consumedQty: 80,
        returnedQty: 10,
        wastageQty: 0,
        balanceWithEmployee: 10,
      },
      {
        materialId: 'mat-002',
        materialCode: 'DRV-12W-IC',
        materialName: '12W Constant Current Isolated Driver',
        bomQtyPerUnit: 1,
        totalIssuedQty: 100,
        consumedQty: 85,
        returnedQty: 5,
        wastageQty: 2,
        balanceWithEmployee: 8,
      },
      {
        materialId: 'mat-003',
        materialCode: 'HSG-12W-ALU',
        materialName: '12W Aluminium Housing Shell',
        bomQtyPerUnit: 1,
        totalIssuedQty: 100,
        consumedQty: 85,
        returnedQty: 10,
        wastageQty: 1,
        balanceWithEmployee: 4,
      },
      {
        materialId: 'mat-004',
        materialCode: 'DIF-12W-PC',
        materialName: '12W PC Diffuser Cup',
        bomQtyPerUnit: 1,
        totalIssuedQty: 100,
        consumedQty: 85,
        returnedQty: 15,
        wastageQty: 0,
        balanceWithEmployee: 0,
      },
    ]
  },
  {
    id: 'kit-002',
    kitNumber: 'KIT-2026-1002',
    productId: 'prod-001',
    productName: 'Eiffel 12W Prime Eco LED Bulb (B22)',
    plannedBatchQty: 150,
    assignedEmployee: 'Amit Sharma',
    supervisor: 'Suresh Patil (Supervisor - Line 1)',
    department: 'Final Assembly Line 1',
    plant: 'Plant 1 - Pune Hub',
    status: 'In Production',
    createdDate: '2026-10-02',
    issueDate: '2026-10-02 11:00 AM',
    items: [
      {
        materialId: 'mat-001',
        materialCode: 'PCB-12W-FR4',
        materialName: '12W LED Star PCB',
        bomQtyPerUnit: 1,
        totalIssuedQty: 150,
        consumedQty: 130,
        returnedQty: 10,
        wastageQty: 2,
        balanceWithEmployee: 8,
      },
      {
        materialId: 'mat-002',
        materialCode: 'DRV-12W-IC',
        materialName: '12W Constant Current Isolated Driver',
        bomQtyPerUnit: 1,
        totalIssuedQty: 150,
        consumedQty: 135,
        returnedQty: 5,
        wastageQty: 5,
        balanceWithEmployee: 5,
      }
    ]
  },
  {
    id: 'kit-003',
    kitNumber: 'KIT-2026-0988',
    productId: 'prod-002',
    productName: 'Eiffel 9W Classic LED Bulb (B22)',
    plannedBatchQty: 200,
    assignedEmployee: 'Priya Verma',
    supervisor: 'Ramesh Naidu (Supervisor - Line 2)',
    department: 'Final Assembly Line 2',
    plant: 'Plant 1 - Pune Hub',
    status: 'Closed',
    createdDate: '2026-09-30',
    issueDate: '2026-09-30 08:30 AM',
    closedDate: '2026-10-01 05:00 PM',
    reconciliationNotes: 'Batch completed successfully. 196 units produced, 4 rejected at testing station.',
    items: [
      {
        materialId: 'mat-001',
        materialCode: 'PCB-12W-FR4',
        materialName: '12W LED Star PCB',
        bomQtyPerUnit: 1,
        totalIssuedQty: 200,
        consumedQty: 196,
        returnedQty: 0,
        wastageQty: 4,
        balanceWithEmployee: 0,
      }
    ]
  },
  {
    id: 'kit-201',
    kitNumber: 'KIT-2026-HYD-01',
    productId: 'prod-001',
    productName: '50W Commercial Track Luminaire',
    plannedBatchQty: 50,
    assignedEmployee: 'Naveen Reddy',
    supervisor: 'Vikram Malhotra',
    department: 'Southern Staging Store',
    plant: 'Plant 2 - Hyderabad Hub',
    status: 'In Production',
    createdDate: '2026-10-02',
    issueDate: '2026-10-02 10:00 AM',
    items: [
      {
        materialId: 'mat-101',
        materialCode: 'COB-50W-BRIDG',
        materialName: '50W High-Lumen Bridgelux COB LED Array',
        bomQtyPerUnit: 1,
        totalIssuedQty: 50,
        consumedQty: 40,
        returnedQty: 5,
        wastageQty: 0,
        balanceWithEmployee: 5,
      },
      {
        materialId: 'mat-102',
        materialCode: 'DRV-50W-DIM',
        materialName: '50W Triac Dimmable Constant Current Driver',
        bomQtyPerUnit: 1,
        totalIssuedQty: 50,
        consumedQty: 40,
        returnedQty: 5,
        wastageQty: 1,
        balanceWithEmployee: 4,
      }
    ]
  }
];

const DEFAULT_PRODUCTION_LOGS: ProductionLog[] = [
  {
    id: 'prod-log-1',
    date: '2026-10-02',
    shift: 'Shift A (Morning)',
    orderNo: 'MO-2026-501',
    productId: 'prod-001',
    productName: 'Eiffel 12W Prime Eco LED Bulb (B22)',
    kitNumber: 'KIT-2026-1001',
    targetQty: 100,
    actualQty: 110,
    rejectedQty: 2,
    wastageQty: 1,
    operator: 'Ravi Kumar',
    supervisor: 'Suresh Patil',
    workingHours: 8,
    unitsPerHour: 13.75,
    productivityPct: 110,
    plant: 'Plant 1 - Pune Hub',
  },
  {
    id: 'prod-log-2',
    date: '2026-10-02',
    shift: 'Shift A (Morning)',
    orderNo: 'MO-2026-502',
    productId: 'prod-001',
    productName: 'Eiffel 12W Prime Eco LED Bulb (B22)',
    kitNumber: 'KIT-2026-1002',
    targetQty: 100,
    actualQty: 85,
    rejectedQty: 4,
    wastageQty: 3,
    operator: 'Amit Sharma',
    supervisor: 'Suresh Patil',
    workingHours: 8,
    unitsPerHour: 10.6,
    productivityPct: 85,
    plant: 'Plant 1 - Pune Hub',
  },
  {
    id: 'prod-log-3',
    date: '2026-10-02',
    shift: 'Shift B (Evening)',
    orderNo: 'MO-2026-503',
    productId: 'prod-003',
    productName: 'Eiffel 20W Linear Slim Batten (4ft)',
    targetQty: 60,
    actualQty: 62,
    rejectedQty: 1,
    wastageQty: 0,
    operator: 'Priya Verma',
    supervisor: 'Ramesh Naidu',
    workingHours: 7.5,
    unitsPerHour: 8.26,
    productivityPct: 103.3,
    plant: 'Plant 1 - Pune Hub',
  },
  {
    id: 'prod-log-hyd-1',
    date: '2026-10-02',
    shift: 'Shift A (Morning)',
    orderNo: 'MO-2026-HYD-501',
    productId: 'prod-001',
    productName: '50W Commercial Track Luminaire',
    kitNumber: 'KIT-2026-HYD-01',
    targetQty: 40,
    actualQty: 42,
    rejectedQty: 1,
    wastageQty: 0,
    operator: 'Naveen Reddy',
    supervisor: 'Vikram Malhotra',
    workingHours: 8,
    unitsPerHour: 5.25,
    productivityPct: 105,
    plant: 'Plant 2 - Hyderabad Hub',
  }
];

const DEFAULT_FINISHED_GOODS: FinishedGoodItem[] = [
  {
    id: 'fg-001',
    productId: 'prod-001',
    productCode: 'EFL-BLB-12W',
    productName: 'Eiffel 12W Prime Eco LED Bulb (B22)',
    category: 'LED Bulbs',
    wattage: '12W',
    batchLotNumber: 'LOT-FG-2026-KIT-098',
    plant: 'Plant 1 - Pune Hub',
    warehouse: 'Finished Goods Packaging Store',
    quantityOnHand: 3200,
    allocatedQty: 2000,
    availableQty: 1200,
    rejectionsQty: 24,
    productionDate: '2026-09-29',
    kitId: 'kit-098',
    kitNumber: 'KIT-2026-098',
    standardCost: 161.05,
    sellingPrice: 215.00,
    status: 'Ready for Dispatch',
    notes: 'Passed 100% burn-in and surge protection testing at 4kV.'
  },
  {
    id: 'fg-002',
    productId: 'prod-002',
    productCode: 'EFL-BLB-09W',
    productName: 'Eiffel 9W Classic LED Bulb (B22)',
    category: 'LED Bulbs',
    wattage: '9W',
    batchLotNumber: 'LOT-FG-2026-KIT-099',
    plant: 'Plant 1 - Pune Hub',
    warehouse: 'Finished Goods Packaging Store',
    quantityOnHand: 2400,
    allocatedQty: 1500,
    availableQty: 900,
    rejectionsQty: 18,
    productionDate: '2026-09-30',
    kitId: 'kit-099',
    kitNumber: 'KIT-2026-099',
    standardCost: 124.50,
    sellingPrice: 170.00,
    status: 'Ready for Dispatch',
    notes: 'Packed in master cartons of 50 units each.'
  },
  {
    id: 'fg-003',
    productId: 'prod-003',
    productCode: 'EFL-BAT-20W',
    productName: 'Eiffel 20W Linear Slim Batten (4ft)',
    category: 'Battens',
    wattage: '20W',
    batchLotNumber: 'LOT-FG-2026-KIT-100',
    plant: 'Plant 1 - Pune Hub',
    warehouse: 'Finished Goods Packaging Store',
    quantityOnHand: 850,
    allocatedQty: 0,
    availableQty: 850,
    rejectionsQty: 6,
    productionDate: '2026-10-02',
    kitId: 'kit-100',
    kitNumber: 'KIT-2026-100',
    standardCost: 285.00,
    sellingPrice: 395.00,
    status: 'Ready for Dispatch',
    notes: 'Commercial extrusion quality verified.'
  },
  {
    id: 'fg-004',
    productId: 'prod-005',
    productCode: 'EFL-FLD-50W',
    productName: 'Eiffel 50W Commercial Outdoor IP66 Floodlight',
    category: 'Floodlights',
    wattage: '50W',
    batchLotNumber: 'LOT-FG-2026-KIT-101',
    plant: 'Plant 1 - Pune Hub',
    warehouse: 'Finished Goods Packaging Store',
    quantityOnHand: 400,
    allocatedQty: 0,
    availableQty: 400,
    rejectionsQty: 2,
    productionDate: '2026-10-01',
    kitId: 'kit-101',
    kitNumber: 'KIT-2026-101',
    standardCost: 890.00,
    sellingPrice: 1250.00,
    status: 'Ready for Dispatch',
    notes: 'IP66 water immersion chamber passed.'
  },
  {
    id: 'fg-005',
    productId: 'prod-001',
    productCode: 'EFL-BLB-12W',
    productName: 'Eiffel 12W Prime Eco LED Bulb (B22)',
    category: 'LED Bulbs',
    wattage: '12W',
    batchLotNumber: 'LOT-FG-2026-HYD-041',
    plant: 'Plant 2 - Hyderabad Hub',
    warehouse: 'Finished Goods Packaging Store',
    quantityOnHand: 1800,
    allocatedQty: 0,
    availableQty: 1800,
    rejectionsQty: 12,
    productionDate: '2026-10-02',
    standardCost: 161.05,
    sellingPrice: 215.00,
    status: 'Ready for Dispatch',
    notes: 'Hyderabad facility production run.'
  }
];

const DEFAULT_FINISHED_GOODS_LEDGER: FinishedGoodsLedgerEntry[] = [
  {
    id: 'fg-led-001',
    date: '2026-09-29 05:40 PM',
    productId: 'prod-001',
    productCode: 'EFL-BLB-12W',
    productName: 'Eiffel 12W Prime Eco LED Bulb (B22)',
    batchLotNumber: 'LOT-FG-2026-KIT-098',
    transactionType: 'Production Inward',
    referenceNo: 'KIT-2026-098',
    plant: 'Plant 1 - Pune Hub',
    warehouse: 'Finished Goods Packaging Store',
    inQty: 6200,
    outQty: 0,
    balanceQty: 6200,
    user: 'supervisor.line1@mips.internal',
    notes: 'Shift A & B completion transferred from assembly to Finished Goods Store.'
  },
  {
    id: 'fg-led-002',
    date: '2026-10-01 04:30 PM',
    productId: 'prod-001',
    productCode: 'EFL-BLB-12W',
    productName: 'Eiffel 12W Prime Eco LED Bulb (B22)',
    batchLotNumber: 'LOT-FG-2026-KIT-098',
    transactionType: 'Customer Dispatch',
    referenceNo: 'DC-2026-00412',
    plant: 'Plant 1 - Pune Hub',
    warehouse: 'Finished Goods Packaging Store',
    inQty: 0,
    outQty: 3000,
    balanceQty: 3200,
    user: 'Ramesh Sharma (Store Manager)',
    notes: 'Dispatched to Bajaj Electricals Distribution Ltd under DC-2026-00412 (Truck MH-12-RN-8812).'
  },
  {
    id: 'fg-led-003',
    date: '2026-09-30 06:10 PM',
    productId: 'prod-002',
    productCode: 'EFL-BLB-09W',
    productName: 'Eiffel 9W Classic LED Bulb (B22)',
    batchLotNumber: 'LOT-FG-2026-KIT-099',
    transactionType: 'Production Inward',
    referenceNo: 'KIT-2026-099',
    plant: 'Plant 1 - Pune Hub',
    warehouse: 'Finished Goods Packaging Store',
    inQty: 3900,
    outQty: 0,
    balanceQty: 3900,
    user: 'supervisor.line1@mips.internal',
    notes: 'Completed batch passed QA high-voltage spark testing.'
  },
  {
    id: 'fg-led-004',
    date: '2026-10-01 04:30 PM',
    productId: 'prod-002',
    productCode: 'EFL-BLB-09W',
    productName: 'Eiffel 9W Classic LED Bulb (B22)',
    batchLotNumber: 'LOT-FG-2026-KIT-099',
    transactionType: 'Customer Dispatch',
    referenceNo: 'DC-2026-00412',
    plant: 'Plant 1 - Pune Hub',
    warehouse: 'Finished Goods Packaging Store',
    inQty: 0,
    outQty: 1500,
    balanceQty: 2400,
    user: 'Ramesh Sharma (Store Manager)',
    notes: 'Dispatched to Bajaj Electricals Distribution Ltd under DC-2026-00412.'
  }
];

const DEFAULT_STOCK_LEDGER: StockLedgerEntry[] = [
  {
    id: 'led-001',
    date: '2026-10-01 09:00 AM',
    materialId: 'mat-001',
    materialCode: 'PCB-12W-FR4',
    materialName: '12W LED Star PCB (Lumileds Chipset)',
    transactionType: 'Opening Stock',
    referenceNo: 'SYS-INIT',
    warehouse: 'Main Raw Material Store',
    plant: 'Plant 1 - Pune Hub',
    inQty: 5000,
    outQty: 0,
    balanceQty: 5000,
    user: 'admin@mips.internal',
    notes: 'Initial physical inventory balance upload',
    supplier: 'Lumileds India Components',
    batchNo: 'LOT-LM-2609-INIT'
  },
  {
    id: 'led-002',
    date: '2026-10-01 02:15 PM',
    materialId: 'mat-001',
    materialCode: 'PCB-12W-FR4',
    materialName: '12W LED Star PCB (Lumileds Chipset)',
    transactionType: 'Kit Issue',
    referenceNo: 'KIT-2026-0988',
    warehouse: 'Main Raw Material Store',
    plant: 'Plant 1 - Pune Hub',
    inQty: 0,
    outQty: 200,
    balanceQty: 4800,
    user: 'store.manager@mips.internal',
    notes: 'Issued to Line 2 for batch 200',
    sourceDestination: 'Assembly Line 2'
  },
  {
    id: 'led-003',
    date: '2026-10-02 10:00 AM',
    materialId: 'mat-001',
    materialCode: 'PCB-12W-FR4',
    materialName: '12W LED Star PCB (Lumileds Chipset)',
    transactionType: 'Kit Issue',
    referenceNo: 'KIT-2026-1001',
    warehouse: 'Main Raw Material Store',
    plant: 'Plant 1 - Pune Hub',
    inQty: 0,
    outQty: 100,
    balanceQty: 4700,
    user: 'store.manager@mips.internal',
    notes: 'Issued to Ravi Kumar (Worker)',
    sourceDestination: 'Final Assembly Line 1'
  },
  {
    id: 'led-004',
    date: '2026-10-02 11:30 AM',
    materialId: 'mat-001',
    materialCode: 'PCB-12W-FR4',
    materialName: '12W LED Star PCB (Lumileds Chipset)',
    transactionType: 'Kit Issue',
    referenceNo: 'KIT-2026-1002',
    warehouse: 'Main Raw Material Store',
    plant: 'Plant 1 - Pune Hub',
    inQty: 0,
    outQty: 150,
    balanceQty: 4550,
    user: 'store.manager@mips.internal',
    notes: 'Issued to Amit Sharma (Worker)',
    sourceDestination: 'Final Assembly Line 1'
  },
  {
    id: 'led-005',
    date: '2026-10-02 03:45 PM',
    materialId: 'mat-001',
    materialCode: 'PCB-12W-FR4',
    materialName: '12W LED Star PCB (Lumileds Chipset)',
    transactionType: 'Supplier Inbound (Direct)',
    referenceNo: 'INV-2026-9812',
    warehouse: 'Main Raw Material Store',
    plant: 'Plant 1 - Pune Hub',
    inQty: 1000,
    outQty: 0,
    balanceQty: 5550,
    user: 'Store Incharge (Gate Receipt)',
    notes: 'Urgent lot delivery against spot requisition',
    supplier: 'Lumileds India Components',
    invoiceNo: 'INV-2026-9812',
    batchNo: 'LOT-LM-865-B4',
    unitCost: 42.50
  },
  {
    id: 'led-006',
    date: '2026-10-03 08:30 AM',
    materialId: 'mat-002',
    materialCode: 'DRV-12W-IC',
    materialName: '12W Constant Current Isolated Driver (HPF)',
    transactionType: 'Return to Vendor (RTV)',
    referenceNo: 'DN-2026-042',
    warehouse: 'Main Raw Material Store',
    plant: 'Plant 1 - Pune Hub',
    inQty: 0,
    outQty: 50,
    balanceQty: 2100,
    user: 'QA Lead (Anand Deshmukh)',
    notes: 'Power factor tested at 0.78 (below specified 0.90 threshold)',
    supplier: 'Delta Electronics India',
    debitNoteNo: 'DN-2026-042',
    batchNo: 'DLT-DRV-2026-W38'
  },
  {
    id: 'led-hyd-001',
    date: '2026-10-01 09:00 AM',
    materialId: 'mat-101',
    materialCode: 'COB-50W-BRIDG',
    materialName: '50W High-Lumen Bridgelux COB LED Array',
    transactionType: 'Opening Stock',
    referenceNo: 'SYS-INIT-HYD',
    warehouse: 'Southern Staging Store',
    plant: 'Plant 2 - Hyderabad Hub',
    inQty: 1000,
    outQty: 0,
    balanceQty: 1000,
    user: 'admin@mips.internal',
    notes: 'Initial physical inventory balance for Hyderabad Hub',
    supplier: 'Bridgelux Semiconductor',
    batchNo: 'BRDG-50W-5000K-90CRI'
  }
];

const DEFAULT_ROLES: Role[] = [
  {
    id: 'role-001',
    name: 'Super Admin',
    description: 'Full system configuration, master data, user & role administration, and unrestricted operational access.',
    isSystem: true,
    permissions: [
      'inventory.view', 'inventory.adjust', 'inventory.transfer',
      'procurement.po.create', 'procurement.po.approve', 'procurement.grn.receive',
      'forecast.view', 'forecast.plan',
      'kits.create', 'kits.issue', 'kits.reconcile', 'kits.close',
      'production.log', 'production.scrap',
      'masters.manage', 'settings.manage', 'users.manage'
    ]
  },
  {
    id: 'role-002',
    name: 'Management',
    description: 'Executive overview, KPI dashboards, 4-month inventory forecasts, cost accounting, and labour yield analysis.',
    isSystem: true,
    permissions: [
      'inventory.view', 'procurement.view', 'forecast.view', 'kits.view', 'production.view', 'productivity.view', 'reports.view'
    ]
  },
  {
    id: 'role-003',
    name: 'Inventory / Store Manager',
    description: 'Responsible for raw material warehouses, stock ledger accuracy, GRN physical verification, kit issuance, and stock adjustments.',
    isSystem: true,
    permissions: [
      'inventory.view', 'inventory.adjust', 'inventory.transfer',
      'procurement.grn.receive', 'kits.issue', 'kits.reconcile', 'masters.materials.view'
    ]
  },
  {
    id: 'role-004',
    name: 'Purchase Manager',
    description: 'Procurement cycle, vendor management, purchase orders, carrier in-transit tracking, and supplier pricing.',
    isSystem: true,
    permissions: [
      'procurement.po.create', 'procurement.po.approve', 'procurement.view', 'forecast.view', 'masters.suppliers.manage'
    ]
  },
  {
    id: 'role-005',
    name: 'Production Manager',
    description: 'BOM structures, production batch orders, shop floor planning, kit creation, and floor productivity expected output.',
    isSystem: true,
    permissions: [
      'production.plan', 'production.log', 'kits.create', 'kits.view', 'masters.products.manage', 'masters.bom.manage'
    ]
  },
  {
    id: 'role-006',
    name: 'Supervisor',
    description: 'Assembly line leadership, assigned worker oversight, physical kit issuance, progress tracking, and kit reconciliation sign-off.',
    isSystem: true,
    permissions: [
      'kits.issue', 'kits.reconcile', 'production.log', 'productivity.view'
    ]
  },
  {
    id: 'role-007',
    name: 'Worker',
    description: 'Shop floor assembly operator, component consumption, kit return hand-off, and daily unit count logging.',
    isSystem: true,
    permissions: [
      'kits.view_assigned', 'production.log_output'
    ]
  }
];

const DEFAULT_DEPARTMENTS: Department[] = [
  {
    id: 'dept-001',
    name: 'Final Assembly Line 1',
    plant: 'Plant 1 - Pune Hub',
    manager: 'Anand Deshmukh',
    description: 'Assembly of 9W, 12W, and 15W Eco LED bulbs (B22 & E27)',
    activeTeams: ['Line 1 Alpha', 'Line 1 Beta']
  },
  {
    id: 'dept-002',
    name: 'Final Assembly Line 2',
    plant: 'Plant 1 - Pune Hub',
    manager: 'Anand Deshmukh',
    description: 'Linear 20W Battens, Slim Downlights and Gate Luminaires',
    activeTeams: ['Line 2 Battens', 'Line 2 Architectural']
  },
  {
    id: 'dept-003',
    name: 'SMT & LED PCB Mounting',
    plant: 'Plant 1 - Pune Hub',
    manager: 'Rajesh Kulkarni',
    description: 'Surface Mount Technology pick-and-place lines and reflow ovens',
    activeTeams: ['SMT Shift 1', 'SMT Shift 2']
  },
  {
    id: 'dept-004',
    name: 'Quality Control & Burn-In Testing',
    plant: 'Plant 1 - Pune Hub',
    manager: 'Pooja Iyer',
    description: '48-hour burn-in aging racks, lumen sphere photometric tests, high-voltage surge testing',
    activeTeams: ['QC Inspection', 'Aging Test Lab']
  },
  {
    id: 'dept-005',
    name: 'Raw Material Stores & Logistics',
    plant: 'Plant 1 - Pune Hub',
    manager: 'Ramesh Sharma',
    description: 'Inbound dock, quarantined inspection bins, electronic components storage racks',
    activeTeams: ['Store Keepers', 'Inward Dock QA']
  },
  {
    id: 'dept-006',
    name: 'Packaging & Finished Goods Dispatch',
    plant: 'Plant 1 - Pune Hub',
    manager: 'Dinesh Joshi',
    description: 'Automated retail carton boxing, blister packaging, shrink-wrap palletizing',
    activeTeams: ['Pack Line Alpha', 'Dispatch Team']
  },
  {
    id: 'dept-007',
    name: 'Architectural Luminaire Assembly',
    plant: 'Plant 2 - Hyderabad Hub',
    manager: 'Vikram Malhotra',
    description: 'Commercial downlights, track lights and customized linear pendant assembly',
    activeTeams: ['Hyderabad Line Alpha', 'Hyderabad Staging']
  },
  {
    id: 'dept-008',
    name: 'Regional Staging & Southern Distribution',
    plant: 'Plant 2 - Hyderabad Hub',
    manager: 'Sanjay Rao',
    description: 'Finished goods staging and southern zone dispatch hub',
    activeTeams: ['Dispatch Southern Hub', 'Logistics Team']
  }
];

const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    empCode: 'EMP-0001',
    name: 'System Super Admin',
    email: 'admin@gmail.com',
    phone: '+91 98220 11001',
    role: 'Superadmin',
    plant: 'All Plants (Global)',
    department: 'Executive Management',
    team: 'Operations Leadership',
    supervisor: 'Board of Directors',
    status: 'Active',
    joiningDate: '2026-10-01',
    workstation: 'HQ Office',
    skills: ['ERP Governance', 'Plant Operations', 'System Security', 'UBAC Scopes']
  },
  {
    id: 'emp-101',
    empCode: 'EMP-1001',
    name: 'Anand Deshmukh',
    email: 'anand.deshmukh@eiffel.in',
    phone: '+91 98220 11002',
    role: 'Plant Manager',
    plant: 'Plant 1 - Pune Hub',
    department: 'Executive Management',
    team: 'Plant 1 Leadership',
    supervisor: 'System Super Admin',
    status: 'Active',
    joiningDate: '2026-10-01',
    workstation: 'Manager Cabin - Pune',
    skills: ['Lean Manufacturing', 'OEE Optimization', 'Plant Sizing', 'Six Sigma']
  },
  {
    id: 'emp-102',
    empCode: 'EMP-1002',
    name: 'Dr. Vikram Malhotra',
    email: 'vikram.malhotra@eiffel.in',
    phone: '+91 98220 11003',
    role: 'Quality Inspector',
    plant: 'Plant 1 - Pune Hub',
    department: 'Quality Assurance & Photometric Testing Lab',
    team: 'Reliability Engineering',
    supervisor: 'Anand Deshmukh',
    status: 'Active',
    joiningDate: '2026-10-01',
    workstation: 'Photometric Darkroom & Sphere Lab',
    skills: ['Integrating Sphere', 'Spectroradiometer', 'Hi-Pot Surge', 'CCT Chromaticity Binning']
  },
  {
    id: 'emp-103',
    empCode: 'EMP-1003',
    name: 'Ramesh Sharma',
    email: 'ramesh.sharma@eiffel.in',
    phone: '+91 98220 11004',
    role: 'Store Manager',
    plant: 'Plant 1 - Pune Hub',
    department: 'Raw Material Stores & Inbound Logistics',
    team: 'Inbound Logistics',
    supervisor: 'Anand Deshmukh',
    status: 'Active',
    joiningDate: '2026-10-01',
    workstation: 'Inbound Dock 1 - Pune',
    skills: ['Stock Ledger Reconciliations', 'GRN Validation', 'FIFO Storage', 'Barcode Verification']
  },
  {
    id: 'emp-104',
    empCode: 'EMP-1004',
    name: 'Sneha Kulkarni',
    email: 'sneha.kulkarni@eiffel.in',
    phone: '+91 98220 11005',
    role: 'Purchase Manager',
    plant: 'Plant 1 - Pune Hub',
    department: 'Procurement, Sourcing & Vendor Governance',
    team: 'Vendor Governance',
    supervisor: 'Anand Deshmukh',
    status: 'Active',
    joiningDate: '2026-10-01',
    workstation: 'Procurement Office',
    skills: ['Vendor Negotiation', '4-Month Material Run Forecasting', 'Import Logistics', 'PO Issuance']
  },
  {
    id: 'emp-105',
    empCode: 'EMP-1005',
    name: 'Suresh Patil',
    email: 'suresh.patil@eiffel.in',
    phone: '+91 98220 11006',
    role: 'Floor Supervisor',
    plant: 'Plant 1 - Pune Hub',
    department: 'Final Assembly Line 1',
    team: 'Line 1 Alpha',
    supervisor: 'Anand Deshmukh',
    status: 'Active',
    joiningDate: '2026-10-01',
    workstation: 'Line 1 Supervisory Station',
    skills: ['Kit Issuance', 'BOM Reconciliation', 'Shop Floor Shift Balancing', 'Worker Productivity Tracking']
  },
  {
    id: 'emp-201',
    empCode: 'EMP-2001',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@eiffel.in',
    phone: '+91 98220 11007',
    role: 'Worker',
    plant: 'Plant 1 - Pune Hub',
    department: 'Final Assembly Line 1',
    team: 'Line 1 Alpha',
    supervisor: 'Suresh Patil',
    status: 'Active',
    joiningDate: '2026-10-01',
    workstation: 'Station 2 - Housing Assembly & Cap Press',
    skills: ['Pneumatic Screwdriver', 'B22 Cap Press', 'Heat-Sink Paste Dispensing']
  },
  {
    id: 'emp-202',
    empCode: 'EMP-2002',
    name: 'Amit Sharma',
    email: 'amit.sharma@eiffel.in',
    phone: '+91 98220 11008',
    role: 'Worker',
    plant: 'Plant 1 - Pune Hub',
    department: 'Final Assembly Line 1',
    team: 'Line 1 Alpha',
    supervisor: 'Suresh Patil',
    status: 'Active',
    joiningDate: '2026-10-01',
    workstation: 'Station 1 - Driver Potting & Wire Soldering',
    skills: ['Lead-Free Soldering', 'Potting Gel Injection', 'Wire Harness Routing']
  },
  {
    id: 'emp-203',
    empCode: 'EMP-2003',
    name: 'Sunil Jadhav',
    email: 'sunil.jadhav@eiffel.in',
    phone: '+91 98220 11009',
    role: 'Worker',
    plant: 'Plant 1 - Pune Hub',
    department: 'Final Assembly Line 1',
    team: 'Line 1 Alpha',
    supervisor: 'Suresh Patil',
    status: 'Active',
    joiningDate: '2026-10-01',
    workstation: 'Station 4 - High-Voltage Ageing & Lumens Check',
    skills: ['End-of-Line Testing', 'Ageing Tunnel Loading', 'Optical Diffuser Snap-Fitting']
  },
  {
    id: 'emp-301',
    empCode: 'EMP-3001',
    name: 'Naveen Reddy',
    email: 'naveen.reddy@eiffel.in',
    phone: '+91 98220 11010',
    role: 'Plant Manager',
    plant: 'Plant 2 - Hyderabad Hub',
    department: 'Executive Management',
    team: 'Plant 2 Leadership',
    supervisor: 'System Super Admin',
    status: 'Active',
    joiningDate: '2026-10-01',
    workstation: 'Plant Office - Cherlapally',
    skills: ['Commercial Luminaire Fabrication', 'IP66 Gasket Sealing', 'Production Planning']
  },
  {
    id: 'emp-302',
    empCode: 'EMP-3002',
    name: 'Priya Nair',
    email: 'priya.nair@eiffel.in',
    phone: '+91 98220 11011',
    role: 'Store Manager',
    plant: 'Plant 2 - Hyderabad Hub',
    department: 'Raw Material Stores & Inbound Logistics',
    team: 'Southern Depot Logistics',
    supervisor: 'Naveen Reddy',
    status: 'Active',
    joiningDate: '2026-10-01',
    workstation: 'Store Desk - Hyderabad',
    skills: ['Inter-Plant Transit GRN', 'High-Bay Staging', 'FIFO Dispatch']
  },
  {
    id: 'emp-303',
    empCode: 'EMP-3003',
    name: 'K. Srinivas',
    email: 'k.srinivas@eiffel.in',
    phone: '+91 98220 11012',
    role: 'Floor Supervisor',
    plant: 'Plant 2 - Hyderabad Hub',
    department: 'Commercial Luminaire Fabrication',
    team: 'Line 2 Bravo',
    supervisor: 'Naveen Reddy',
    status: 'Active',
    joiningDate: '2026-10-01',
    workstation: 'Floodlight Jig Line',
    skills: ['Die-Cast Heavy Assembly', 'IP67 Driver Integration', 'Torque Calibration']
  }
];

const DEFAULT_PLANTS: PlantLocation[] = [
  {
    id: 'plant-01',
    code: 'PLANT-01',
    name: 'Plant 1 - Pune Hub',
    city: 'Pune, Maharashtra',
    type: 'Full Manufacturing & SMT',
    manager: 'Anand Deshmukh',
    warehousesCount: 3,
    departmentsCount: 6,
    description: 'Primary manufacturing facility with 4 active assembly lines and SMT capability.',
    status: 'Active',
  },
  {
    id: 'plant-02',
    code: 'PLANT-02',
    name: 'Plant 2 - Hyderabad Hub',
    city: 'Hyderabad, Telangana',
    type: 'Assembly & Staging',
    manager: 'Vikram Malhotra',
    warehousesCount: 1,
    departmentsCount: 2,
    description: 'Secondary staging, architectural luminaire testing, and distribution plant.',
    status: 'Active',
  }
];

export const useMipsStore = create<MipsState>()(
  persist(
    (set, get) => ({
      materials: DEFAULT_MATERIALS,
      products: DEFAULT_PRODUCTS,
      stockLedger: DEFAULT_STOCK_LEDGER,
      purchaseOrders: DEFAULT_PURCHASE_ORDERS,
      grnEntries: [],
      customerPOs: DEFAULT_CUSTOMER_POS,
      customers: DEFAULT_CUSTOMERS,
      dispatchRecords: DEFAULT_DISPATCH_RECORDS,
      kits: DEFAULT_KITS,
      finishedGoods: DEFAULT_FINISHED_GOODS,
      finishedGoodsLedger: DEFAULT_FINISHED_GOODS_LEDGER,
      productionLogs: DEFAULT_PRODUCTION_LOGS,
      roles: DEFAULT_ROLES,
      departments: DEFAULT_DEPARTMENTS,
      employees: DEFAULT_EMPLOYEES,
      plants: DEFAULT_PLANTS,
      selectedPlant: 'Plant 1 - Pune Hub',
      setSelectedPlant: (plant) => set({ selectedPlant: plant }),
      auditLogs: [
        {
          id: 'aud-001',
          timestamp: '2026-10-02 09:30 AM',
          user: 'store.manager@mips.internal',
          action: 'KIT_ISSUED',
          module: 'Kits',
          details: 'KIT-2026-1001 issued to Ravi Kumar with 100 components.'
        },
        {
          id: 'aud-002',
          timestamp: '2026-10-02 10:15 AM',
          user: 'purchase.manager@mips.internal',
          action: 'PO_DISPATCHED',
          module: 'Procurement',
          details: 'PO-2026-089 marked as In Transit with V-Trans Express.'
        }
      ],

      addMaterial: (newMat) => {
        const id = `mat-${Date.now()}`;
        const activePlant = get().selectedPlant;
        const plant = newMat.plant || (activePlant.startsWith('All') ? 'Plant 1 - Pune Hub' : activePlant);
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
      },

      updateMaterial: (id, updates) => {
        set((state) => ({
          materials: state.materials.map((m) => (m.id === id ? { ...m, ...updates } : m))
        }));
      },

      adjustStock: (materialId, adjustmentQty, reason, user, meta) => {
        const material = get().materials.find((m) => m.id === materialId);
        if (!material) return;

        const newStock = Math.max(0, material.currentStock + adjustmentQty);
        const activePlant = get().selectedPlant;
        const plant = material.plant || (activePlant.startsWith('All') ? 'Plant 1 - Pune Hub' : activePlant);

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
      },

      createPurchaseOrder: (poData) => {
        const activePlant = get().selectedPlant;
        const plant = poData.plant || (activePlant.startsWith('All') ? 'Plant 1 - Pune Hub' : activePlant);
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
      },

      createGRN: (grnData, user) => {
        const id = `grn-${Date.now()}`;
        const activePlant = get().selectedPlant;
        const targetPO = get().purchaseOrders.find((p) => p.poNumber === grnData.poNumber);
        const plant = grnData.plant || targetPO?.plant || (activePlant.startsWith('All') ? 'Plant 1 - Pune Hub' : activePlant);
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
      },

      createCustomerPO: (poData) => {
        const activePlant = get().selectedPlant;
        const plant = poData.plant || (activePlant.startsWith('All') ? 'Plant 1 - Pune Hub' : activePlant);
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
      },

      dispatchCustomerPO: (dispatchData) => {
        const targetPO = get().customerPOs.find((p) => p.id === dispatchData.customerPoId);
        if (!targetPO) return;

        const activePlant = get().selectedPlant;
        const plant = targetPO.plant || (activePlant.startsWith('All') ? 'Plant 1 - Pune Hub' : activePlant);
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
      },

      createKit: (kitData) => {
        const id = `kit-${Date.now()}`;
        const kitNumber = `KIT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const activePlant = get().selectedPlant;
        const plant = kitData.plant || (activePlant.startsWith('All') ? 'Plant 1 - Pune Hub' : activePlant);
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
        const plant = kit.plant || (activePlant.startsWith('All') ? 'Plant 1 - Pune Hub' : activePlant);
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

        return { success: true };
      },

      inwardToFinishedGoods: (itemData, user) => {
        const id = `fg-${Date.now()}`;
        const activePlant = get().selectedPlant;
        const plant = itemData.plant || (activePlant.startsWith('All') ? 'Plant 1 - Pune Hub' : activePlant);
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
      },

      addProductionLog: (logData) => {
        const workingHours = logData.workingHours || 8;
        const unitsPerHour = Number((logData.actualQty / workingHours).toFixed(2));
        const productivityPct = Number(((logData.actualQty / logData.targetQty) * 100).toFixed(1));
        const activePlant = get().selectedPlant;
        const plant = logData.plant || (activePlant.startsWith('All') ? 'Plant 1 - Pune Hub' : activePlant);

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
      },

      updateDepartment: (id, updates) => {
        set((state) => ({
          departments: state.departments.map((d) => (d.id === id ? { ...d, ...updates } : d))
        }));
      },

      deleteDepartment: (id) => {
        set((state) => ({
          departments: state.departments.filter((d) => d.id !== id)
        }));
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
      },

      updatePlant: (id, updates) => {
        set((state) => ({
          plants: state.plants.map((p) => (p.id === id ? { ...p, ...updates } : p))
        }));
      },

      deletePlant: (id) => {
        set((state) => ({
          plants: state.plants.filter((p) => p.id !== id)
        }));
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
          materials: DEFAULT_MATERIALS,
          products: DEFAULT_PRODUCTS,
          stockLedger: DEFAULT_STOCK_LEDGER,
          purchaseOrders: DEFAULT_PURCHASE_ORDERS,
          grnEntries: [],
          customerPOs: DEFAULT_CUSTOMER_POS,
          customers: DEFAULT_CUSTOMERS,
          dispatchRecords: DEFAULT_DISPATCH_RECORDS,
          kits: DEFAULT_KITS,
          finishedGoods: DEFAULT_FINISHED_GOODS,
          finishedGoodsLedger: DEFAULT_FINISHED_GOODS_LEDGER,
          productionLogs: DEFAULT_PRODUCTION_LOGS,
          roles: DEFAULT_ROLES,
          departments: DEFAULT_DEPARTMENTS,
          employees: DEFAULT_EMPLOYEES,
          plants: DEFAULT_PLANTS,
          selectedPlant: 'Plant 1 - Pune Hub',
        });
      }
    }),
    {
      name: 'mips_manufacturing_store_v7',
    }
  )
);
