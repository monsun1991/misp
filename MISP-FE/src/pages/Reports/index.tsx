import React, { useState } from 'react';
import {
  FileBarChart,
  ShieldCheck,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Boxes,
  Truck
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useMipsStore } from '@/store/useMipsStore';
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

export const ReportsPage: React.FC = () => {
  const { auditLogs, materials, purchaseOrders, kits, productionLogs } = useMipsStore();

  const [activeTab, setActiveTab] = useState<'audit' | 'summary'>('audit');
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const dynamicModules = React.useMemo(() => {
    return Array.from(new Set(auditLogs.map((l) => l.module).filter(Boolean)));
  }, [auditLogs]);

  const filteredAuditLogs = React.useMemo(() => {
    return auditLogs.filter((log) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        log.user.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q);

      const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;

      const logDate = log.timestamp ? log.timestamp.split(' ')[0] : '';
      const matchesDate =
        (!startDate || logDate >= startDate) &&
        (!endDate || logDate <= endDate);

      return matchesSearch && matchesModule && matchesDate;
    });
  }, [auditLogs, searchTerm, moduleFilter, startDate, endDate]);

  const {
    currentPage: auditPage,
    setCurrentPage: setAuditPage,
    pageSize: auditPageSize,
    setPageSize: setAuditPageSize,
    totalItems: totalAuditItems,
    totalPages: totalAuditPages,
    paginatedItems: paginatedAuditLogs,
  } = usePagination(filteredAuditLogs, 15);

  React.useEffect(() => {
    setAuditPage(1);
  }, [searchTerm, moduleFilter, startDate, endDate]);

  const exportCSV = (type: string) => {
    const reports: Record<string, { headers: string[]; rows: unknown[][] }> = {
      'Audit Logs': {
        headers: ['Timestamp', 'User', 'Module', 'Action', 'Details'],
        rows: filteredAuditLogs.map((l) => [l.timestamp, l.user, l.module, l.action, l.details]),
      },
      'Stock Valuation': {
        headers: ['Code', 'Name', 'Category', 'Wattage', 'UOM', 'Plant', 'Warehouse', 'Current Stock', 'With Employees', 'Reorder Level', 'Safety Stock', 'Standard Cost (INR)', 'Stock Value (INR)', 'Supplier', 'Status'],
        rows: materials.map((m) => {
          const stock = Number(m.currentStock) || 0;
          const cost = Number(m.standardCost) || 0;
          return [m.code, m.name, m.category, m.wattage, m.uom, m.plant, m.warehouse, stock, Number(m.stockWithEmployees) || 0, Number(m.reorderLevel) || 0, Number(m.safetyStock) || 0, cost, (stock * cost).toFixed(2), m.supplier, m.status];
        }),
      },
      Procurement: {
        headers: ['PO Number', 'PO Date', 'Supplier', 'Material', 'Ordered Qty', 'Received Qty', 'Pending Qty', 'Unit Rate (INR)', 'Total Amount (INR)', 'Expected Delivery', 'Status', 'Plant'],
        rows: purchaseOrders.map((po) => {
          const rate = Number(po.unitRate ?? po.unitPrice) || 0;
          const ordered = Number(po.orderedQty) || 0;
          return [po.poNumber, po.poDate, po.supplier, po.materialName, ordered, Number(po.receivedQty) || 0, Number(po.pendingQty) || 0, rate, Number(po.totalAmount) || ordered * rate, po.expectedDeliveryDate, po.status, po.plant];
        }),
      },
      'Kit Reconciliation': {
        headers: ['Kit Number', 'Created', 'Product', 'Planned Qty', 'Employee', 'Supervisor', 'Status', 'Material Code', 'Material', 'Issued', 'Consumed', 'Returned', 'Wastage', 'Balance With Employee', 'Closed', 'Reconciliation Notes'],
        // One row per kit line so issue/consumption is accountable per material
        rows: kits.flatMap((k) => {
          const items = Array.isArray(k.items) && k.items.length > 0 ? k.items : [null];
          return items.map((item) => [
            k.kitNumber, k.createdDate, k.productName, Number(k.plannedBatchQty) || 0, k.assignedEmployee, k.supervisor, k.status,
            item?.materialCode, item?.materialName, Number(item?.totalIssuedQty) || 0, Number(item?.consumedQty) || 0,
            Number(item?.returnedQty) || 0, Number(item?.wastageQty) || 0, Number(item?.balanceWithEmployee) || 0,
            k.closedDate, k.reconciliationNotes,
          ]);
        }),
      },
      'Production Yield': {
        headers: ['Date', 'Shift', 'Order No', 'Product', 'Kit Number', 'Operator', 'Supervisor', 'Target Qty', 'Actual Qty', 'Rejected Qty', 'Wastage Qty', 'Working Hours', 'Units/Hour', 'Productivity %', 'Plant'],
        rows: productionLogs.map((pl) => [pl.date, pl.shift, pl.orderNo, pl.productName, pl.kitNumber, pl.operator, pl.supervisor, Number(pl.targetQty) || 0, Number(pl.actualQty) || 0, Number(pl.rejectedQty) || 0, Number(pl.wastageQty) || 0, Number(pl.workingHours) || 0, Number(pl.unitsPerHour) || 0, Number(pl.productivityPct) || 0, pl.plant]),
      },
    };

    const report = reports[type];
    if (!report) return;
    if (report.rows.length === 0) {
      toast.info(`No ${type} records to export.`);
      return;
    }

    const escapeCell = (value: unknown) => {
      let text = value === undefined || value === null ? '' : String(value);
      // Stop spreadsheet apps from executing user-entered text as a formula
      if (typeof value === 'string' && /^[=+\-@]/.test(text)) text = `'${text}`;
      return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };
    const csv = [report.headers, ...report.rows].map((row) => row.map(escapeCell).join(',')).join('\r\n');

    // BOM so Excel reads UTF-8 (₹, names) correctly
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MIPS_${type.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-[#146b68] dark:text-[#84cc16]" />
            Audit Trail & Management Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete compliance journal, transactional audit trails, and exportable operational summaries.
          </p>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center">
          <button
            onClick={() => setActiveTab('audit')}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'audit'
                ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            System Audit Trail
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'summary'
                ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Exportable Summaries
          </button>
        </div>
      </div>

      {/* Tab 1: Audit Trail */}
      {activeTab === 'audit' && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Immutable System Audit Logs
                </CardTitle>
                <CardDescription>
                  Records of all user actions, PO changes, stock adjustments, kit issuance and supervisor closures.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 max-w-xs">
                  <Input
                    placeholder="Search user, action, details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 text-xs w-44"
                  />
                </div>

                <Select value={moduleFilter} onValueChange={setModuleFilter}>
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="All Modules" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Modules</SelectItem>
                    {dynamicModules.map((mod) => (
                      <SelectItem key={mod} value={mod}>
                        {mod}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-1.5 text-xs">
                  <DatePicker
                    value={startDate}
                    onChange={setStartDate}
                    placeholder="Start date"
                    className="w-32"
                  />
                  <span className="text-slate-400 text-[10px]">to</span>
                  <DatePicker
                    value={endDate}
                    onChange={setEndDate}
                    placeholder="End date"
                    className="w-32"
                  />
                  {(startDate || endDate) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setStartDate('');
                        setEndDate('');
                      }}
                      className="h-8 px-2 text-xs text-rose-500 hover:text-rose-700"
                    >
                      Clear
                    </Button>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => exportCSV('Audit Logs')}
                  className="h-8 text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">User / Identity</th>
                    <th className="py-2.5 px-3">Module</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Details & Audit Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">{log.user}</td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="text-[10px]">
                          {log.module}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-blue-600 text-[11px]">
                        {log.action}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{log.details}</td>
                    </tr>
                  ))}
                  {filteredAuditLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No audit logs found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <TablePagination
              currentPage={auditPage}
              totalPages={totalAuditPages}
              totalItems={totalAuditItems}
              pageSize={auditPageSize}
              pageSizeOptions={[10, 15, 25, 50]}
              onPageChange={setAuditPage}
              onPageSizeChange={setAuditPageSize}
            />
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Exportable Operational Summaries */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Boxes className="w-4 h-4 text-blue-600" />
                Inventory Stock & Valuation Report
              </CardTitle>
              <CardDescription>
                Snapshot of all warehouse stock balances, reorder positions, and current asset valuations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-slate-500">Total Items: {materials.length}</span>
                <Button size="sm" onClick={() => exportCSV('Stock Valuation')} className="text-xs">
                  <Download className="w-3.5 h-3.5 mr-1" /> Download CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" />
                Procurement & Inbound GRN Report
              </CardTitle>
              <CardDescription>
                Detailed purchase orders, vendor performance, transit delays, and accepted vs rejected quantities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-slate-500">Total Orders: {purchaseOrders.length}</span>
                <Button size="sm" onClick={() => exportCSV('Procurement')} className="text-xs">
                  <Download className="w-3.5 h-3.5 mr-1" /> Download CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Kit Reconciliation & Accountability Report
              </CardTitle>
              <CardDescription>
                Employee-wise material issue, consumption, scrap, and supervisor verified closure logs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-slate-500">Total Kits: {kits.length}</span>
                <Button size="sm" onClick={() => exportCSV('Kit Reconciliation')} className="text-xs">
                  <Download className="w-3.5 h-3.5 mr-1" /> Download CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileBarChart className="w-4 h-4 text-amber-600" />
                Daily Shift Production & Labour Yield
              </CardTitle>
              <CardDescription>
                Operator output, units/hour, expected outputs, actual yields, and QA rejection ratios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-slate-500">Total Shift Logs: {productionLogs.length}</span>
                <Button size="sm" onClick={() => exportCSV('Production Yield')} className="text-xs">
                  <Download className="w-3.5 h-3.5 mr-1" /> Download CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
