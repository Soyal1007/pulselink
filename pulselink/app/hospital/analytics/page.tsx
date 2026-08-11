'use client';
import { BarChart3, TrendingUp, Clock, Ambulance, AlertTriangle } from 'lucide-react';

export default function AnalyticsPage() {
  const stats = [
    { label: 'Active Ambulances', value: 3, color: 'text-blue-400' },
    { label: 'Incoming Cases Today', value: 3, color: 'text-orange-400' },
    { label: 'Critical Cases', value: 1, color: 'text-red-400' },
    { label: 'Completed Today', value: 7, color: 'text-green-400' },
    { label: 'Avg. Notification Time', value: '4.2 min', color: 'text-purple-400' },
    { label: 'Avg. Pre-Arrival Notice', value: '11.8 min', color: 'text-cyan-400' },
  ];

  const byPriority = [
    { label: 'CRITICAL', count: 1, color: 'bg-red-600', pct: 10 },
    { label: 'HIGH', count: 3, color: 'bg-orange-500', pct: 30 },
    { label: 'MEDIUM', count: 4, color: 'bg-yellow-500', pct: 40 },
    { label: 'LOW', count: 2, color: 'bg-green-600', pct: 20 },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Analytics</h1>
        <div className="demo-banner"><AlertTriangle className="h-3.5 w-3.5" />DEMO DATA</div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="card">
            <p className="text-xs text-slate-400">{label}</p>
            <p className={`mt-2 text-2xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="card mb-6">
        <h3 className="mb-4 font-semibold text-white flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-400" />
          Cases by Priority
        </h3>
        <div className="space-y-3">
          {byPriority.map(({ label, count, color, pct }) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">{label}</span>
                <span className="text-slate-400">{count} cases</span>
              </div>
              <div className="h-2 rounded-full bg-[#1f2d3d]">
                <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ai-disclaimer">
        All analytics shown use synthetic demo data. No real patient or operational data is represented.
      </div>
    </div>
  );
}
