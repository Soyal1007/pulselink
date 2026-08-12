'use client';
import { BarChart3, AlertTriangle } from 'lucide-react';
import { useCaseStore } from '@/store/caseStore';

export default function AnalyticsPage() {
  const { cases } = useCaseStore();

  const criticalCount = cases.filter((c) => c.priority === 'CRITICAL').length;
  const highCount = cases.filter((c) => c.priority === 'HIGH').length;
  const mediumCount = cases.filter((c) => c.priority === 'MEDIUM').length;
  const lowCount = cases.filter((c) => c.priority === 'LOW').length;
  const totalCases = cases.length;
  const avgEta = totalCases > 0 ? (cases.reduce((s, c) => s + c.eta_min, 0) / totalCases).toFixed(1) : '0';
  const acknowledgedCount = cases.filter((c) => c.acknowledged).length;

  const stats = [
    { label: 'Active Ambulances', value: totalCases, color: 'text-blue-600' },
    { label: 'Critical Cases', value: criticalCount, color: 'text-red-600' },
    { label: 'High Priority', value: highCount, color: 'text-amber-600' },
    { label: 'ER Teams Ready', value: acknowledgedCount, color: 'text-emerald-600' },
    { label: 'Avg. ETA', value: avgEta + ' min', color: 'text-purple-600' },
    { label: 'Total Active Cases', value: totalCases, color: 'text-cyan-600' },
  ];

  const byPriority = [
    { label: 'CRITICAL', count: criticalCount, color: 'bg-red-600', pct: totalCases > 0 ? (criticalCount / totalCases) * 100 : 0 },
    { label: 'HIGH', count: highCount, color: 'bg-amber-500', pct: totalCases > 0 ? (highCount / totalCases) * 100 : 0 },
    { label: 'MEDIUM', count: mediumCount, color: 'bg-yellow-500', pct: totalCases > 0 ? (mediumCount / totalCases) * 100 : 0 },
    { label: 'LOW', count: lowCount, color: 'bg-emerald-600', pct: totalCases > 0 ? (lowCount / totalCases) * 100 : 0 },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Analytics</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">Live operational EMS statistics computed from active cases.</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-extrabold text-slate-600">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> LIVE DATA
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{label}</p>
            <p className={`mt-2 text-3xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <h3 className="font-extrabold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
          <BarChart3 className="h-4 w-4 text-blue-600" /> Cases Breakdown by Priority
        </h3>
        <div className="space-y-4">
          {byPriority.map(({ label, count, color, pct }) => (
            <div key={label} className="space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold">
                <span className="text-slate-800">{label}</span>
                <span className="text-slate-500">{count} case{count !== 1 ? 's' : ''}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 text-xs font-semibold text-slate-600 text-center">
        Analytics are computed in real-time from all active emergency cases in the system.
      </div>
    </div>
  );
}
