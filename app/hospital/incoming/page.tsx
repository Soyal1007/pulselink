'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Ambulance, Clock, ShieldAlert, CheckCircle2, MapPin, Heart,
  Phone, UserCheck, AlertTriangle, ChevronRight, ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const INCOMING_UNITS = [
  {
    unit_id: 'KA-01-A-0001',
    type: 'Advanced Life Support (ALS)',
    paramedic: 'Arjun Kumar',
    patient: 'Rajan Mehta (58 M)',
    condition: 'Acute STEMI / RBBB',
    eta_min: 8,
    status: 'EN_ROUTE',
    location: 'Outer Ring Road, 3.4 km away',
    speed: '68 km/h',
    vitals: { hr: 94, bp: '148/92', spo2: '94.5%' },
    prep_status: 'Cath Lab Standby Requested'
  },
  {
    unit_id: 'KA-01-A-0002',
    type: 'Trauma Resuscitation Unit',
    paramedic: 'Sita Verma',
    patient: 'Priya Sharma (32 F)',
    condition: 'High-Velocity MVA Trauma',
    eta_min: 14,
    status: 'EN_ROUTE',
    location: 'Koramangala 100ft Rd, 7.1 km away',
    speed: '54 km/h',
    vitals: { hr: 118, bp: '98/62', spo2: '96.0%' },
    prep_status: 'Trauma Bay 2 Reserved'
  },
  {
    unit_id: 'KA-01-A-0003',
    type: 'Basic Life Support (BLS)',
    paramedic: 'Rajesh Rao',
    patient: 'Arjun Nair (45 M)',
    condition: 'Acute Asthma Exacerbation',
    eta_min: 22,
    status: 'EN_ROUTE',
    location: 'Indiranagar 80ft Rd, 11.2 km away',
    speed: '48 km/h',
    vitals: { hr: 88, bp: '126/82', spo2: '91.5%' },
    prep_status: 'Nebulizer Station Assigned'
  }
];

export default function IncomingFleetPage() {
  const [units] = useState(INCOMING_UNITS);

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6 w-full">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Incoming Ambulance Fleet</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Real-time GPS dispatch tracking, ETA countdowns, and active unit status.
          </p>
        </div>
        <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-2 text-xs font-extrabold text-blue-700">
          3 Active Inbound Units
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {units.map((u) => (
          <div key={u.unit_id} className="pro-card p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-black">
                  {u.unit_id}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  LIVE GPS
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900">{u.type}</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">Paramedic in-charge: {u.paramedic}</p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Patient:</span>
                <span className="font-black text-slate-900">{u.patient}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Impression:</span>
                <span className="font-bold text-red-600">{u.condition}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Location:</span>
                <span className="font-bold text-slate-700">{u.location}</span>
              </div>
            </div>

            <div className="rounded-xl bg-blue-600 p-4 text-white flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase text-blue-200">Estimated Arrival</p>
                <p className="text-2xl font-black">{u.eta_min} Minutes</p>
              </div>
              <Clock className="h-8 w-8 text-blue-200 opacity-80" />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>{u.prep_status}</span>
              <Link href="/hospital" className="text-blue-600 flex items-center gap-1 hover:underline">
                View Telemetry <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
