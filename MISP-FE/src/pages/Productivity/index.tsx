import React, { useState, useMemo } from 'react';
import {
  Users2,
  TrendingUp,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  BarChart2,
  Search,
  X
} from 'lucide-react';
import { useMipsStore, isPlantMatch } from '@/store/useMipsStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TablePagination, usePagination } from '@/components/common/TablePagination';

export const ProductivityPage: React.FC = () => {
  const { productionLogs: rawLogs, products, selectedPlant } = useMipsStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [wattageFilter, setWattageFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Plant filtered logs
  const plantLogs = rawLogs.filter((l) => isPlantMatch(l.plant, selectedPlant));

  // Filter logs by date range & wattage
  const filteredLogs = useMemo(() => {
    return plantLogs.filter((log) => {
      // Date filter
      const logDate = log.date ? log.date.split('T')[0] : '';
      if (startDate && logDate && logDate < startDate) return false;
      if (endDate && logDate && logDate > endDate) return false;

      // Wattage filter
      if (wattageFilter !== 'All') {
        const prod = products.find((p) => p.id === log.productId || p.name === log.productName);
        const matchesWattage = prod?.wattage === wattageFilter || log.productName.includes(wattageFilter);
        if (!matchesWattage) return false;
      }

      return true;
    });
  }, [plantLogs, products, wattageFilter, startDate, endDate]);

  // Aggregate worker-level stats
  const workerStats: Record<
    string,
    {
      operator: string;
      supervisor: string;
      totalTarget: number;
      totalActual: number;
      totalRejects: number;
      totalHours: number;
      entriesCount: number;
    }
  > = {};

  filteredLogs.forEach((log) => {
    if (!workerStats[log.operator]) {
      workerStats[log.operator] = {
        operator: log.operator,
        supervisor: log.supervisor,
        totalTarget: 0,
        totalActual: 0,
        totalRejects: 0,
        totalHours: 0,
        entriesCount: 0,
      };
    }
    const stat = workerStats[log.operator];
    stat.totalTarget += Number(log.targetQty) || 0;
    stat.totalActual += Number(log.actualQty) || 0;
    stat.totalRejects += Number(log.rejectedQty) || 0;
    stat.totalHours += Number(log.workingHours) || 0;
    stat.entriesCount += 1;
  });

  const workerLeaderboard = useMemo(() => {
    const list = Object.values(workerStats).map((w) => {
      const productivityPct = w.totalTarget > 0 ? Number(((w.totalActual / w.totalTarget) * 100).toFixed(1)) : 100;
      const unitsPerHour = w.totalHours > 0 ? Number((w.totalActual / w.totalHours).toFixed(1)) : 0;
      const rejectionRate = w.totalActual > 0 ? Number(((w.totalRejects / w.totalActual) * 100).toFixed(1)) : 0;

      return {
        ...w,
        productivityPct,
        unitsPerHour,
        rejectionRate,
      };
    });

    // Sort by productivity descending
    list.sort((a, b) => b.productivityPct - a.productivityPct);
    return list;
  }, [workerStats]);

  // Search filter on leaderboard
  const searchedLeaderboard = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return workerLeaderboard;
    return workerLeaderboard.filter(
      (w) =>
        w.operator.toLowerCase().includes(q) ||
        w.supervisor.toLowerCase().includes(q)
    );
  }, [workerLeaderboard, searchTerm]);

  // Pagination
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    paginatedItems,
  } = usePagination(searchedLeaderboard, 10);

  // Auto-reset page
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, wattageFilter, startDate, endDate]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users2 className="w-6 h-6 text-blue-600" />
              Labour Productivity & Workforce Yield
            </h1>
            <Badge variant="outline" className="bg-[#183638]/10 text-[#146b68] dark:text-[#d4e967] border-[#146b68]/30 text-[11px] font-semibold">
              {selectedPlant}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Performance metrics, units produced per hour, yield comparison, and operator ranking for {selectedPlant}.
          </p>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Operators
            </CardTitle>
            <Users2 className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workerLeaderboard.length} Workers</div>
            <div className="text-xs text-slate-400 mt-0.5">Tracked on shop floor</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Top Yield Performer
            </CardTitle>
            <Award className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{workerLeaderboard[0]?.operator || 'N/A'}</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {workerLeaderboard[0]?.productivityPct || 0}% Expected Output Achievement
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Overall Floor Rejection Rate
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {(
                workerLeaderboard.reduce((acc, w) => acc + w.rejectionRate, 0) /
                (workerLeaderboard.length || 1)
              ).toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Quality tolerance threshold: &lt; 3.0%</div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Table */}
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold">Workforce Productivity Scorecard</CardTitle>
              <CardDescription>
                Formula: Productivity % = Actual Production &divide; Expected Production &times; 100
              </CardDescription>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="relative min-w-[200px] flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search operator, supervisor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Wattage Filter */}
            <Select value={wattageFilter} onValueChange={setWattageFilter}>
              <SelectTrigger className="w-[135px] h-8 text-xs">
                <SelectValue placeholder="All Wattages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Wattages</SelectItem>
                <SelectItem value="5W">5W Production</SelectItem>
                <SelectItem value="9W">9W Production</SelectItem>
                <SelectItem value="12W">12W Production</SelectItem>
                <SelectItem value="15W">15W Production</SelectItem>
                <SelectItem value="20W">20W Production</SelectItem>
                <SelectItem value="50W">50W Production</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range Filter */}
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
            </div>

            {/* Clear All */}
            {(searchTerm || wattageFilter !== 'All' || startDate || endDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setWattageFilter('All');
                  setStartDate('');
                  setEndDate('');
                }}
                className="h-8 text-xs text-slate-500 hover:text-red-600 px-2"
              >
                Reset
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Operator Name</th>
                  <th className="py-2.5 px-3">Reporting Supervisor</th>
                  <th className="py-2.5 px-3 text-right">Expected Output</th>
                  <th className="py-2.5 px-3 text-right">Actual Output</th>
                  <th className="py-2.5 px-3 text-right">Hours Logged</th>
                  <th className="py-2.5 px-3 text-right">Units / Hour</th>
                  <th className="py-2.5 px-3 text-right">Rejection %</th>
                  <th className="py-2.5 px-3 text-center">Productivity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                      No operator productivity records match the selected filters.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((w, index) => {
                    const globalRank = (currentPage - 1) * pageSize + index + 1;
                    return (
                      <tr key={w.operator} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                globalRank === 1
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                              }`}
                            >
                              #{globalRank}
                            </div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{w.operator}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-500">{w.supervisor}</td>
                        <td className="py-3 px-3 text-right text-slate-500">{w.totalTarget.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                          {w.totalActual.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-500">{w.totalHours} hrs</td>
                        <td className="py-3 px-3 text-right font-semibold text-blue-600">{w.unitsPerHour} u/h</td>
                        <td className="py-3 px-3 text-right font-medium text-red-500">{w.rejectionRate}%</td>
                        <td className="py-3 px-3 text-center">
                          <Badge
                            variant="outline"
                            className={
                              w.productivityPct >= 100
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }
                          >
                            {w.productivityPct}%
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            pageSizeOptions={[5, 10, 20, 50]}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductivityPage;
