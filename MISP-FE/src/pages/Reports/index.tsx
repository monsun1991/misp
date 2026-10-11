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
import { useMipsStore } from '@/store/useMipsStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const ReportsPage: React.FC = () => {
  const { auditLogs, materials, purchaseOrders, kits, productionLogs } = useMipsStore();

  const [activeTab, setActiveTab] = useState<'audit' | 'summary'>('audit');

  const exportCSV = (type: string) => {
    alert(`Exporting ${type} report to CSV...`);
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
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Immutable System Audit Logs
              </CardTitle>
              <CardDescription>
                Records of all user actions, PO changes, stock adjustments, kit issuance and supervisor closures.
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => exportCSV('Audit Logs')}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export Audit Trail
            </Button>
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
                  {auditLogs.map((log) => (
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
                </tbody>
              </table>
            </div>
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
