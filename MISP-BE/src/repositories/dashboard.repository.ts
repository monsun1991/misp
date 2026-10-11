import { IDashboardOverview } from "../dto/dashboard.dto";
import moment from "moment-timezone";

export const getOverviewData = async (): Promise<IDashboardOverview> => {
  const overview: IDashboardOverview = {
    inventory: {
      totalRawStockUnits: 51200,
      stockValuationINR: 1485000,
      lowStockAlertsCount: 3,
      criticalShortagesCount: 1,
      stockWithEmployeesUnits: 650,
    },
    procurement: {
      openPurchaseOrdersCount: 4,
      goodsInTransitCount: 2,
      delayedDeliveriesCount: 0,
      inboundUnitsPending: 15000,
    },
    production: {
      todayTargetUnits: 260,
      todayActualUnits: 257,
      todayRejectionsUnits: 7,
      overallEfficiencyPct: 98.8,
    },
    kits: {
      activeOpenKitsCount: 3,
      inProductionKitsCount: 2,
      reconciledClosedCount: 1,
    },
    recentAuditLogs: [
      {
        id: "AUD-101",
        user: "store.manager@mips.internal",
        action: "KIT_ISSUED",
        module: "Kits",
        timestamp: moment().subtract(15, "minutes").format("hh:mm A"),
        status: "info",
      },
      {
        id: "AUD-102",
        user: "qa.inspector@mips.internal",
        action: "GRN_ACCEPTED",
        module: "Procurement",
        timestamp: moment().subtract(45, "minutes").format("hh:mm A"),
        status: "success",
      },
      {
        id: "AUD-103",
        user: "production.sup@mips.internal",
        action: "PRODUCTION_ENTRY_LOGGED",
        module: "Production",
        timestamp: moment().subtract(2, "hours").format("hh:mm A"),
        status: "success",
      },
      {
        id: "AUD-104",
        user: "system_monitor",
        action: "REORDER_POINT_BREACH",
        module: "Inventory",
        timestamp: moment().subtract(4, "hours").format("hh:mm A"),
        status: "warning",
      },
    ],
  };

  return overview;
};
