export interface IDashboardOverview {
  inventory: {
    totalRawStockUnits: number;
    stockValuationINR: number;
    lowStockAlertsCount: number;
    criticalShortagesCount: number;
    stockWithEmployeesUnits: number;
  };
  procurement: {
    openPurchaseOrdersCount: number;
    goodsInTransitCount: number;
    delayedDeliveriesCount: number;
    inboundUnitsPending: number;
  };
  production: {
    todayTargetUnits: number;
    todayActualUnits: number;
    todayRejectionsUnits: number;
    overallEfficiencyPct: number;
  };
  kits: {
    activeOpenKitsCount: number;
    inProductionKitsCount: number;
    reconciledClosedCount: number;
  };
  recentAuditLogs: Array<{
    id: string;
    user: string;
    action: string;
    module: string;
    timestamp: string;
    status: 'success' | 'warning' | 'info';
  }>;
}
