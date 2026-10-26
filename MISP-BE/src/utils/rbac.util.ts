import { User } from "../models";

export const ROLE_PERMISSIONS_MAP: Record<string, string[]> = {
  // SuperAdmin: Has full administrative and operational permissions
  'superadmin': [
    'inventory.view', 'inventory.adjust', 'inventory.transfer',
    'finished_goods.view', 'finished_goods.manage',
    'procurement.view', 'procurement.po.create', 'procurement.po.approve', 'procurement.grn.receive',
    'forecast.view', 'forecast.plan',
    'kits.view', 'kits.create', 'kits.issue', 'kits.reconcile', 'kits.close',
    'production.view', 'production.plan', 'production.log', 'production.scrap',
    'orders.view', 'orders.manage',
    'productivity.view',
    'masters.manage', 'masters.materials.view', 'masters.products.manage', 'masters.bom.manage', 'masters.suppliers.manage',
    'users.manage',
    'settings.manage',
    'reports.view'
  ],
  'super admin': [
    'inventory.view', 'inventory.adjust', 'inventory.transfer',
    'finished_goods.view', 'finished_goods.manage',
    'procurement.view', 'procurement.po.create', 'procurement.po.approve', 'procurement.grn.receive',
    'forecast.view', 'forecast.plan',
    'kits.view', 'kits.create', 'kits.issue', 'kits.reconcile', 'kits.close',
    'production.view', 'production.plan', 'production.log', 'production.scrap',
    'orders.view', 'orders.manage',
    'productivity.view',
    'masters.manage', 'masters.materials.view', 'masters.products.manage', 'masters.bom.manage', 'masters.suppliers.manage',
    'users.manage',
    'settings.manage',
    'reports.view'
  ],
  // Plant Manager: Full facility overview and operational approvals
  'plant manager': [
    'inventory.view', 'inventory.adjust', 'inventory.transfer',
    'finished_goods.view', 'finished_goods.manage',
    'procurement.view', 'procurement.po.create', 'procurement.po.approve', 'procurement.grn.receive',
    'forecast.view', 'forecast.plan',
    'kits.view', 'kits.create', 'kits.issue', 'kits.reconcile', 'kits.close',
    'production.view', 'production.plan', 'production.log', 'production.scrap',
    'orders.view', 'orders.manage',
    'productivity.view',
    'reports.view'
  ],
  // Management: Executive analytics, reports, view-only across manufacturing
  'management': [
    'inventory.view',
    'finished_goods.view',
    'procurement.view',
    'forecast.view',
    'kits.view',
    'production.view',
    'orders.view',
    'productivity.view',
    'reports.view'
  ],
  // Store Manager / Inventory Manager: Material storage, stock movements, GRN receiving
  'store manager': [
    'inventory.view', 'inventory.adjust', 'inventory.transfer',
    'finished_goods.view',
    'procurement.view', 'procurement.grn.receive',
    'kits.view', 'kits.issue', 'kits.reconcile',
    'orders.view',
    'masters.materials.view'
  ],
  'inventory / store manager': [
    'inventory.view', 'inventory.adjust', 'inventory.transfer',
    'finished_goods.view',
    'procurement.view', 'procurement.grn.receive',
    'kits.view', 'kits.issue', 'kits.reconcile',
    'orders.view',
    'masters.materials.view'
  ],
  'inventory manager': [
    'inventory.view', 'inventory.adjust', 'inventory.transfer',
    'finished_goods.view',
    'procurement.view', 'procurement.grn.receive',
    'kits.view', 'kits.issue', 'kits.reconcile',
    'orders.view',
    'masters.materials.view'
  ],
  // Purchase Manager: Sourcing, supplier management, purchase orders
  'purchase manager': [
    'inventory.view',
    'procurement.view', 'procurement.po.create', 'procurement.po.approve',
    'forecast.view',
    'orders.view',
    'masters.suppliers.manage',
    'reports.view'
  ],
  // Quality Inspector: Inbound QA, test certificates, scrap verification
  'quality inspector': [
    'inventory.view',
    'finished_goods.view',
    'procurement.view', 'procurement.grn.receive',
    'kits.view', 'kits.reconcile',
    'production.view', 'production.scrap',
    'reports.view'
  ],
  // Production Manager: BOMs, line schedules, kit requests, WIP tracking
  'production manager': [
    'inventory.view',
    'finished_goods.view', 'finished_goods.manage',
    'forecast.view',
    'kits.view', 'kits.create', 'kits.issue', 'kits.reconcile', 'kits.close',
    'production.view', 'production.plan', 'production.log', 'production.scrap',
    'productivity.view',
    'masters.products.manage', 'masters.bom.manage',
    'reports.view'
  ],
  // Floor Supervisor: Shift assembly, kit issuance, reconciliation
  'floor supervisor': [
    'inventory.view',
    'kits.view', 'kits.issue', 'kits.reconcile', 'kits.close',
    'production.view', 'production.log', 'production.scrap',
    'productivity.view'
  ],
  'supervisor': [
    'inventory.view',
    'kits.view', 'kits.issue', 'kits.reconcile', 'kits.close',
    'production.view', 'production.log', 'production.scrap',
    'productivity.view'
  ],
  // Worker: Shop floor assembly, kit consumption, units log
  'worker': [
    'kits.view',
    'production.log'
  ],
  'worker / assembly': [
    'kits.view',
    'production.log'
  ]
};

export function computeUserPermissions(user: User): string[] {
  const normRole = (user.role || '').toLowerCase().trim();
  
  // Super admin always has all available permissions
  if (normRole === 'superadmin' || normRole === 'super admin') {
    return ROLE_PERMISSIONS_MAP['superadmin'];
  }

  const basePermissions = ROLE_PERMISSIONS_MAP[normRole] || [];
  
  let custom: string[] = [];
  if (user.customPermissionsJson) {
    try {
      custom = JSON.parse(user.customPermissionsJson);
    } catch {
      custom = [];
    }
  }
  
  let revoked: string[] = [];
  if (user.revokedPermissionsJson) {
    try {
      revoked = JSON.parse(user.revokedPermissionsJson);
    } catch {
      revoked = [];
    }
  }

  const combined = Array.from(new Set([...basePermissions, ...custom]));
  return combined.filter(p => !revoked.includes(p));
}

export function formatUserProfile(user: User) {
  let customPermissions: string[] = [];
  if (user.customPermissionsJson) {
    try {
      customPermissions = JSON.parse(user.customPermissionsJson);
    } catch {
      customPermissions = [];
    }
  }

  let revokedPermissions: string[] = [];
  if (user.revokedPermissionsJson) {
    try {
      revokedPermissions = JSON.parse(user.revokedPermissionsJson);
    } catch {
      revokedPermissions = [];
    }
  }

  return {
    id: user.id,
    empCode: user.empCode || '',
    fullName: user.fullName || '',
    email: user.email,
    phoneNumber: user.phoneNumber || '',
    role: user.role,
    gender: user.gender,
    profilePicture: user.profilePicture,
    plant: user.plant || 'Plant 1 - Pune Hub',
    warehouse: user.warehouse || 'Main Raw Material Store',
    department: user.department || 'Final Assembly Line 1',
    team: user.team || 'Line 1 Alpha',
    workstation: user.workstation || 'General Floor',
    supervisor: user.supervisor || 'System Super Admin',
    status: user.status || 'Active',
    skills: user.skills ? (user.skills.includes(',') ? user.skills.split(',').map((s: string) => s.trim()) : [user.skills]) : [],
    pin: user.pin || '123456',
    customPermissions,
    revokedPermissions,
  };
}

