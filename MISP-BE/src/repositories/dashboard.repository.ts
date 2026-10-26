import { AppDataSource } from "../config/data-source";
import { MaterialEntity } from "../models/material.model";
import { PurchaseOrderEntity } from "../models/purchase-order.model";
import { ProductionLogEntity } from "../models/production-log.model";
import { KitEntity } from "../models/kit.model";
import { AuditLogEntity } from "../models/audit-log.model";
import { IDashboardOverview } from "../dto/dashboard.dto";

export const getOverviewData = async (): Promise<IDashboardOverview> => {
  const matRepo = AppDataSource.getRepository(MaterialEntity);
  const poRepo = AppDataSource.getRepository(PurchaseOrderEntity);
  const prodRepo = AppDataSource.getRepository(ProductionLogEntity);
  const kitRepo = AppDataSource.getRepository(KitEntity);
  const auditRepo = AppDataSource.getRepository(AuditLogEntity);

  const materials = await matRepo.find();
  const purchaseOrders = await poRepo.find();
  const productionLogs = await prodRepo.find();
  const kits = await kitRepo.find();
  const auditLogs = await auditRepo.find({
    order: { createdAt: "DESC" },
    take: 10,
  });

  // Calculate real inventory stats from MySQL
  let totalRawStockUnits = 0;
  let stockValuationINR = 0;
  let lowStockAlertsCount = 0;
  let criticalShortagesCount = 0;
  let stockWithEmployeesUnits = 0;

  for (const m of materials) {
    const stock = Number(m.currentStock) || 0;
    const cost = Number(m.standardCost) || 0;
    totalRawStockUnits += stock;
    stockValuationINR += stock * cost;
    stockWithEmployeesUnits += Number(m.stockWithEmployees) || 0;
    if (stock <= (Number(m.reorderLevel) || 0)) {
      lowStockAlertsCount++;
    }
    if (stock <= (Number(m.safetyStock) || 0)) {
      criticalShortagesCount++;
    }
  }

  // Calculate real procurement stats from MySQL
  let openPurchaseOrdersCount = 0;
  let goodsInTransitCount = 0;
  let delayedDeliveriesCount = 0;
  let inboundUnitsPending = 0;

  for (const po of purchaseOrders) {
    if (["Draft", "Ordered", "In Transit"].includes(po.status)) {
      openPurchaseOrdersCount++;
    }
    if (po.status === "In Transit") {
      goodsInTransitCount++;
    }
    if (po.status === "Delayed") {
      delayedDeliveriesCount++;
    }
    inboundUnitsPending += Number(po.pendingQty) || 0;
  }

  // Calculate real production stats from MySQL
  let todayTargetUnits = 0;
  let todayActualUnits = 0;
  let todayRejectionsUnits = 0;

  for (const log of productionLogs) {
    const good = Number(log.goodQty) || 0;
    const rework = Number(log.reworkQty) || 0;
    const scrap = Number(log.scrapQty) || 0;
    todayActualUnits += good;
    todayRejectionsUnits += (rework + scrap);
    todayTargetUnits += (good + rework + scrap);
  }

  const overallEfficiencyPct =
    todayTargetUnits > 0
      ? Number(((todayActualUnits / todayTargetUnits) * 100).toFixed(1))
      : 100;

  // Calculate real kits stats from MySQL
  let activeOpenKitsCount = 0;
  let inProductionKitsCount = 0;
  let reconciledClosedCount = 0;

  for (const k of kits) {
    if (["Approved", "Issued"].includes(k.status)) {
      activeOpenKitsCount++;
    } else if (k.status === "In Production") {
      inProductionKitsCount++;
    } else if (["Reconciled", "Closed"].includes(k.status)) {
      reconciledClosedCount++;
    }
  }

  const recentAuditLogs = auditLogs.map((a) => ({
    id: a.id,
    user: a.user,
    action: a.action,
    module: a.module,
    timestamp:
      a.timestamp ||
      (a.createdAt ? new Date(a.createdAt).toLocaleTimeString() : ""),
    status: (a.action.includes("REJECT") || a.action.includes("SCRAP")
      ? "warning"
      : "info") as "success" | "warning" | "info",
  }));

  return {
    inventory: {
      totalRawStockUnits,
      stockValuationINR: Math.round(stockValuationINR),
      lowStockAlertsCount,
      criticalShortagesCount,
      stockWithEmployeesUnits,
    },
    procurement: {
      openPurchaseOrdersCount,
      goodsInTransitCount,
      delayedDeliveriesCount,
      inboundUnitsPending,
    },
    production: {
      todayTargetUnits,
      todayActualUnits,
      todayRejectionsUnits,
      overallEfficiencyPct,
    },
    kits: {
      activeOpenKitsCount,
      inProductionKitsCount,
      reconciledClosedCount,
    },
    recentAuditLogs,
  };
};
