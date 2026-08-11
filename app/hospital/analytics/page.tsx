'use client';
import { BarChart3, TrendingUp, Clock, Ambulance, AlertTriangle } from 'lucide-react';

export default function AnalyticsPage() {
  const stats = [
    { label: 'Active Ambulances', value: 3, color: 'text-blue-600' },
    { label: 'Incoming Cases Today', value: 3, color: 'text-amber-600' },
    { label: 'Critical Cases', value: 1, color: 'text-red-600' },
    { label: 'Completed Today', value: 7, color: 'text-emerald-600' },
    { label: 'Avg. Notification Time', value: '4.2 min', color: 'text-purple-600' },
    { label: 'Avg. Pre-Arrival Notice', value: '11.8 min', color: 'text-cyan-600' },
  ];

  const byPriority = [
    { label: 'CRITICAL', count: 1, color: 'bg-red-600', pct: 10 },
    { label: 'HIGH', count: 3, color: 'bg-amber-500', pct: 30 },
    { label: 'MEDIUM', count: 4, color: 'bg-yellow-500', pct: 40 },
    { label: 'LOW', count: 2, color: 'bg-emerald-600', pct: 20 },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Analytics</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">Operational EMS statistics and priority metrics.</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-extrabold text-slate-600">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> DEMO MODE DATA
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
          <BarChart3 className="h-4 w-4 text-blue-600" />
          Cases Breakdown by Priority
        </h3>
        <div className="space-y-4">
          {byPriority.map(({ label, count, color, pct }) => (
            <div key={label} className="space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold">
                <span className="text-slate-800">{label}</span>
                <span className="text-slate-500">{count} cases</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 text-xs font-semibold text-slate-600 text-center">
        All analytics shown use synthetic demo data. No real patient or operational data is represented.
      </div>
    </div>
  );
}
