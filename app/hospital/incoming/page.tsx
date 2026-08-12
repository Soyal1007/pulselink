'use client';
import Link from 'next/link';
import { Clock, ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCaseStore } from '@/store/caseStore';

export default function IncomingFleetPage() {
  const { cases } = useCaseStore();

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6 w-full">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Incoming Ambulance Fleet</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Real-time GPS dispatch tracking and active unit status.
          </p>
        </div>
        <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-2 text-xs font-extrabold text-blue-700">
          {cases.length} Active Inbound Unit{cases.length !== 1 ? 's' : ''}
        </div>
      </div>

      {cases.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-500">
          No incoming ambulance units. Waiting for dispatches.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {cases.map((c) => (
          <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-black">
                  {c.ambulance_id}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  LIVE GPS
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900">{c.patient.name}</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">Paramedic: {c.paramedic}</p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Priority:</span>
                <span className={cn('font-black',
                  c.priority === 'CRITICAL' ? 'text-red-600' :
                  c.priority === 'HIGH' ? 'text-amber-600' :
                  c.priority === 'MEDIUM' ? 'text-yellow-600' : 'text-emerald-600'
                )}>{c.priority}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Complaint:</span>
                <span className="font-bold text-slate-800 text-right max-w-[60%]">{c.patient.chief_complaint}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Vitals:</span>
                <span className="font-bold text-slate-800">HR {c.vitals.heart_rate} · SpO2 {c.vitals.spo2}% · BP {c.vitals.systolic_bp}/{c.vitals.diastolic_bp}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Distance:</span>
                <span className="font-bold text-slate-800">{c.distance_km} km away</span>
              </div>
            </div>

            <div className="rounded-xl bg-blue-600 p-4 text-white flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase text-blue-200">Estimated Arrival</p>
                <p className="text-2xl font-black">{c.eta_min} Minutes</p>
              </div>
              <Clock className="h-8 w-8 text-blue-200 opacity-80" />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>{c.acknowledged ? '✓ Acknowledged' : 'Awaiting triage'}</span>
              <Link href={`/hospital/cases/${c.id}`} className="text-blue-600 flex items-center gap-1 hover:underline">
                View Dossier <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
