'use client';
import Link from 'next/link';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCaseStore } from '@/store/caseStore';

const BADGE_STYLES: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-800 border-red-300',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-300',
  MEDIUM: 'bg-amber-100 text-amber-800 border-amber-300',
  LOW: 'bg-emerald-100 text-emerald-800 border-emerald-300',
};

export default function CasesPage() {
  const { cases } = useCaseStore();

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Emergency Cases</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            All {cases.length} live dispatched cases en route to ER command.
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-extrabold text-slate-600">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> LIVE DATA
        </div>
      </div>

      {cases.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-500">
          No active cases. Waiting for paramedic units to dispatch new emergencies.
        </div>
      )}

      <div className="space-y-4">
        {cases.map((c) => (
          <Link
            key={c.id}
            href={`/hospital/cases/${c.id}`}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-blue-500 hover:shadow-md transition"
          >
            <span className={cn("rounded-full border px-3 py-1 text-xs font-black", BADGE_STYLES[c.priority] || '')}>
              {c.priority}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-base font-black text-slate-900">{c.patient.name}</p>
              <p className="text-xs font-extrabold text-slate-500 mt-0.5">
                {c.patient.chief_complaint} · <span className="font-mono">{c.case_ref}</span>
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-black text-blue-600">{c.eta_min} <span className="text-xs font-bold text-slate-500">min</span></p>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">ETA Arrival</p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
