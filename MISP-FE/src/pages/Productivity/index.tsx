import React from 'react';
import {
  Users2,
  TrendingUp,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  BarChart2
} from 'lucide-react';
import { useMipsStore } from '@/store/useMipsStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const ProductivityPage: React.FC = () => {
  const { productionLogs } = useMipsStore();

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

  productionLogs.forEach((log) => {
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
    stat.totalTarget += log.targetQty;
    stat.totalActual += log.actualQty;
    stat.totalRejects += log.rejectedQty;
    stat.totalHours += log.workingHours;
    stat.entriesCount += 1;
  });

  const workerLeaderboard = Object.values(workerStats).map((w) => {
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
  workerLeaderboard.sort((a, b) => b.productivityPct - a.productivityPct);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Users2 className="w-6 h-6 text-blue-600" />
          Labour Productivity & Workforce Yield
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Performance metrics, units produced per hour, yield comparison, and operator ranking.
        </p>
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
              {workerLeaderboard[0]?.productivityPct}% Expected Output Achievement
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
          <CardTitle className="text-base font-semibold">Workforce Productivity Scorecard</CardTitle>
          <CardDescription>
            Formula: Productivity % = Actual Production &divide; Expected Production &times; 100
          </CardDescription>
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
                {workerLeaderboard.map((w, index) => (
                  <tr key={w.operator} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            index === 0
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                          }`}
                        >
                          #{index + 1}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{w.operator}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{w.supervisor}</td>
                    <td className="py-3 px-3 text-right text-slate-500">{w.totalTarget}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                      {w.totalActual}
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductivityPage;
