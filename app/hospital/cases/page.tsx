'use client';
import Link from 'next/link';
import { ChevronRight, AlertTriangle, Clock, User, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CasePriority } from '@/types';

const DEMO_CASES = [
  { id: 'case-001', ref: 'PL-20260811-CARDIAC01', name: 'Rajan Mehta', priority: 'CRITICAL' as CasePriority, status: 'hospital_notified', complaint: 'Chest pain & ST-Segment Elevation', eta: 8 },
  { id: 'case-002', ref: 'PL-20260811-TRAUMA01', name: 'Priya Sharma', priority: 'HIGH' as CasePriority, status: 'hospital_notified', complaint: 'High-Velocity MVA Trauma', eta: 14 },
  { id: 'case-003', ref: 'PL-20260811-RESP01', name: 'Arjun Nair', priority: 'MEDIUM' as CasePriority, status: 'en_route', complaint: 'Acute Asthma Exacerbation', eta: 22 },
];

const BADGE_STYLES: Record<CasePriority, string> = {
  CRITICAL: 'bg-red-100 text-red-800 border-red-300',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-300',
  MEDIUM: 'bg-amber-100 text-amber-800 border-amber-300',
  LOW: 'bg-emerald-100 text-emerald-800 border-emerald-300',
};

export default function CasesPage() {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Emergency Cases</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">Live dispatched cases en route to ER command.</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-extrabold text-slate-600">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> DEMO MODE DATA
        </div>
      </div>

      <div className="space-y-4">
        {DEMO_CASES.map((c) => (
          <Link
            key={c.id}
            href={`/hospital/cases/${c.id}`}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-blue-500 hover:shadow-md transition"
          >
            <span className={cn("rounded-full border px-3 py-1 text-xs font-black", BADGE_STYLES[c.priority])}>
              {c.priority}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-base font-black text-slate-900">{c.name}</p>
              <p className="text-xs font-extrabold text-slate-500 mt-0.5">{c.complaint} · <span className="font-mono">{c.ref}</span></p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-black text-blue-600">{c.eta} <span className="text-xs font-bold text-slate-500">min</span></p>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">ETA Arrival</p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
