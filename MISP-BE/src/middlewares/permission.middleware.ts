import { NextFunction, Request, Response } from "express";
import { catchAsync, ForbiddenAccessException, UnauthorizedException } from "../utils/error.util";
import { computeUserPermissions } from "../utils/rbac.util";

const STOCK_MOVEMENT = [
  "inventory.adjust",
  "inventory.transfer",
  "procurement.grn.receive",
  "kits.issue",
  "kits.close",
  "production.scrap",
];

/**
 * Permissions required to change data, keyed by the first path segment under /mips.
 * Any one listed permission is enough. Reads stay open to every signed-in user because
 * each screen loads shared reference data (e.g. the Kits page needs materials and products).
 * Lists include every screen that legitimately writes the resource, e.g. Forecast raises POs.
 */
const WRITE_PERMISSIONS: Record<string, { default: string[]; PUT?: string[] }> = {
  users: { default: ["users.manage", "settings.manage"] },
  roles: { default: ["settings.manage"] },
  departments: { default: ["settings.manage"] },
  plants: { default: ["settings.manage"] },

  materials: { default: ["masters.manage"], PUT: ["masters.manage", ...STOCK_MOVEMENT] },
  products: { default: ["masters.manage"] },
  wattages: { default: ["masters.manage"] },
  categories: { default: ["masters.manage", "inventory.adjust"] },
  suppliers: { default: ["masters.manage"] },
  warehouses: { default: ["masters.manage"] },
  customers: { default: ["masters.manage", "orders.manage"] },

  "stock-ledgers": { default: ["masters.manage", ...STOCK_MOVEMENT] },
  "purchase-orders": {
    default: ["procurement.po.create", "procurement.po.approve", "procurement.grn.receive", "forecast.plan"],
  },
  "grn-entries": { default: ["procurement.grn.receive"] },

  kits: { default: ["kits.create", "kits.issue", "kits.reconcile", "kits.close"] },
  "production-logs": { default: ["production.log", "production.scrap"] },
  "finished-goods": { default: ["finished_goods.manage", "kits.close", "orders.manage"] },
  "finished-goods-ledger": { default: ["finished_goods.manage", "kits.close", "orders.manage"] },

  "customer-pos": { default: ["orders.manage"] },
  "outward-dispatches": { default: ["orders.manage"] },

  // Any signed-in user may append to the audit trail (as themselves, see below)
  "audit-logs": { default: [] },
};

const READ_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// Must run after authorizeUser(), which sets req.user
export const enforceWritePermissions = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  if (READ_METHODS.has(req.method)) return next();
  if (!req.user) throw new UnauthorizedException("Authentication token required");

  const resource = req.path.split("/").filter(Boolean)[0] || "";
  const rule = WRITE_PERMISSIONS[resource];
  // Unknown write endpoints are denied rather than silently allowed
  if (!rule) throw new ForbiddenAccessException("This action is not permitted.");

  // Audit entries are attributed to the signed-in user, not to whatever name the client sends
  if (resource === "audit-logs" && req.body && typeof req.body === "object") {
    req.body.user = req.user.email;
  }

  const required = (req.method === "PUT" && rule.PUT) || rule.default;
  if (required.length === 0) return next();

  const granted = await computeUserPermissions(req.user);
  if (!required.some((p) => granted.includes(p))) {
    throw new ForbiddenAccessException("You do not have permission to perform this action. Ask an administrator to update your role.");
  }
  next();
});
