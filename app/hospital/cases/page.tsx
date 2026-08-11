'use client';
import Link from 'next/link';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CasePriority } from '@/types';

const DEMO_CASES = [
  { id: 'case-001', ref: 'PL-20260811-CARDIAC01', name: 'Rajan Mehta', priority: 'CRITICAL' as CasePriority, status: 'hospital_notified', complaint: 'Chest pain', eta: 8 },
  { id: 'case-002', ref: 'PL-20260811-TRAUMA01', name: 'Priya Sharma', priority: 'HIGH' as CasePriority, status: 'hospital_notified', complaint: 'Trauma', eta: 14 },
  { id: 'case-003', ref: 'PL-20260811-RESP01', name: 'Arjun Nair', priority: 'MEDIUM' as CasePriority, status: 'en_route', complaint: 'Respiratory', eta: 22 },
];

const BADGE: Record<CasePriority, string> = {
  CRITICAL: 'badge-critical', HIGH: 'badge-high', MEDIUM: 'badge-medium', LOW: 'badge-low',
};

export default function CasesPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Active Cases</h1>
        <div className="demo-banner"><AlertTriangle className="h-3.5 w-3.5" />DEMO DATA</div>
      </div>
      <div className="space-y-3">
        {DEMO_CASES.map((c) => (
          <Link key={c.id} href={`/hospital/cases/${c.id}`}
            className="flex items-center gap-4 rounded-2xl border border-[#1f2d3d] bg-[#111827] p-5 transition hover:border-blue-600/40 hover:bg-[#1a2332]">
            <span className={BADGE[c.priority]}>{c.priority}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white">{c.name}</p>
              <p className="text-xs text-slate-400">{c.complaint} · {c.ref}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-bold text-blue-400">{c.eta}min</p>
              <p className="text-xs text-slate-500">ETA</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-600 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
