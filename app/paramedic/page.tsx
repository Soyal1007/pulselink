'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Plus, Activity, MapPin, Heart, AlertTriangle,
  Bluetooth, User, HardDrive, Smartphone, ChevronRight, X
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useCaseStore } from '@/store/caseStore';
import { cn } from '@/lib/utils';
import EcgWaveformCanvas from '@/components/EcgWaveformCanvas';
import type { EcgConditionPattern } from '@/components/EcgWaveformCanvas';

export default function ParamedicHome() {
  const { selectedAmbulance } = useAppStore();
  const { cases, activeCaseId, setActiveCaseId } = useCaseStore();

  // Get active case from shared store
  const activeCase = activeCaseId ? cases.find((c) => c.id === activeCaseId) : undefined;
  // Get all cases created by this paramedic (show recent ones)
  const myCases = cases.filter((c) => c.paramedic === 'Arjun Kumar').slice(0, 5);

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Paramedic Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 w-full flex flex-wrap items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
            <User className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Paramedic Arjun Kumar</h1>
              <span className="rounded-full bg-emerald-100 border border-emerald-300 px-3 py-0.5 text-xs font-black text-emerald-800">
                ACTIVE SHIFT
              </span>
            </div>
            <p className="text-xs font-extrabold text-slate-700 mt-1">
              Badge # EMS-BANGALORE-402 · Unit: <strong className="text-blue-700 font-black">{selectedAmbulance?.vehicle_number || 'KA-01-A-0001'}</strong>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
          <Bluetooth className="h-5 w-5 text-blue-600 animate-pulse" />
          <div className="text-left text-xs">
            <p className="font-black text-slate-900">ZOLL X Series Monitor</p>
            <p className="text-[11px] text-emerald-700 font-extrabold">BLE Sensor Paired (Telemetry Active)</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
        <div className="md:col-span-8">
          <Link href="/paramedic/case/new"
            className="flex w-full items-center justify-center gap-4 rounded-2xl bg-red-600 py-6 text-xl font-black text-white shadow-md hover:bg-red-700 transition">
            <Plus className="h-8 w-8 stroke-[3]" /> CREATE NEW EMERGENCY CASE
          </Link>
        </div>
        <div className="md:col-span-4 flex items-center gap-3">
          <Link href="/paramedic/vitals" className="rounded-2xl border border-slate-200 bg-white p-5 flex-1 flex items-center justify-between text-left hover:border-blue-400 shadow-2xs transition">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Live Vitals</p>
              <p className="text-base font-black text-slate-900">Telemetry</p>
            </div>
            <Heart className="h-6 w-6 text-red-600" />
          </Link>
          <Link href="/paramedic/tracking" className="rounded-2xl border border-slate-200 bg-white p-5 flex-1 flex items-center justify-between text-left hover:border-emerald-400 shadow-2xs transition">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Routing</p>
              <p className="text-base font-black text-slate-900">GPS ETA</p>
            </div>
            <MapPin className="h-6 w-6 text-emerald-600" />
          </Link>
        </div>
      </div>

      {/* Active Case Card (if exists) */}
      {activeCase && (
        <div className="rounded-2xl border-2 border-blue-600 bg-blue-50/30 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={cn('rounded-full px-3 py-1 text-xs font-black',
                activeCase.priority === 'CRITICAL' ? 'bg-red-600 text-white' :
                activeCase.priority === 'HIGH' ? 'bg-amber-500 text-white' :
                activeCase.priority === 'MEDIUM' ? 'bg-yellow-500 text-white' :
                'bg-emerald-600 text-white'
              )}>
                {activeCase.priority} ACTIVE CASE
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">{activeCase.case_ref}</span>
            </div>
            <button onClick={() => setActiveCaseId(null)} className="p-1.5 rounded-lg hover:bg-slate-200 transition">
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">{activeCase.patient.name}</h3>
              <p className="text-xs font-extrabold text-slate-600">
                {activeCase.patient.age} y/o {activeCase.patient.gender} · Blood: {activeCase.patient.blood_group}
              </p>
              <p className="text-xs font-semibold text-slate-700">{activeCase.patient.chief_complaint}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeCase.symptoms.map((s) => (
                  <span key={s} className="rounded-full bg-blue-100 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">{s}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'HR', value: activeCase.vitals.heart_rate, unit: 'bpm', color: 'text-red-600' },
                { label: 'SpO2', value: activeCase.vitals.spo2, unit: '%', color: 'text-blue-600' },
                { label: 'BP', value: `${activeCase.vitals.systolic_bp}/${activeCase.vitals.diastolic_bp}`, unit: '', color: 'text-slate-900' },
              ].map((v) => (
                <div key={v.label} className="rounded-xl bg-white border border-slate-200 p-3 shadow-2xs">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400">{v.label}</p>
                  <p className={cn('text-lg font-black', v.color)}>{v.value} <span className="text-[10px] text-slate-500">{v.unit}</span></p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-blue-200/60 text-xs font-bold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Case transmitted to hospital · Status: {activeCase.status.replace(/_/g, ' ')}
          </div>
        </div>
      )}

      {/* My Recent Cases */}
      {myCases.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
            My Recent Cases ({myCases.length})
          </h2>
          <div className="space-y-2">
            {myCases.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCaseId(c.id)}
                className={cn(
                  'w-full rounded-xl border bg-white p-4 flex items-center justify-between text-left transition',
                  activeCaseId === c.id ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-black',
                    c.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                    c.priority === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                    c.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-emerald-100 text-emerald-700'
                  )}>{c.priority}</span>
                  <div>
                    <p className="text-sm font-black text-slate-900">{c.patient.name}</p>
                    <p className="text-xs font-semibold text-slate-500">{c.patient.chief_complaint || 'No complaint'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-blue-600">{c.eta_min} min</p>
                  <p className="text-[10px] font-bold text-slate-400">{c.status.replace(/_/g, ' ')}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ECG Waveform */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              {activeCase ? `Live ECG Stream — ${activeCase.patient.name}` : 'Live Ambulance Monitor Waveform Stream'}
            </h2>
            <span className="text-xs font-mono font-extrabold text-slate-500">250 Hz · Lead II</span>
          </div>
          <EcgWaveformCanvas
            heartRate={activeCase?.vitals.heart_rate || 78}
            pattern={(activeCase?.ecg_pattern as any) || 'NORM'}
            height={260}
            interactive={true}
          />
        </div>

        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">ECG Acquisition Options</h2>
          <div className="space-y-3">
            {[
              { icon: Bluetooth, label: '1. Direct Monitor BLE Stream', desc: 'Pairs with ZOLL, Philips, Medtronic via BLE.', border: 'hover:border-blue-400', iconBg: 'bg-blue-100 text-blue-700' },
              { icon: Smartphone, label: '2. Paper ECG Camera Scan', desc: 'Photo of paper strip for AI digitization.', border: 'hover:border-purple-400', iconBg: 'bg-purple-100 text-purple-700' },
              { icon: HardDrive, label: '3. Digital File Upload', desc: 'Upload CSV/JSON from memory card.', border: 'hover:border-emerald-400', iconBg: 'bg-emerald-100 text-emerald-700' },
            ].map((item) => (
              <Link key={item.label} href="/paramedic/ecg"
                className={`rounded-2xl border border-slate-200 bg-white p-4 flex items-start gap-4 ${item.border} transition shadow-2xs`}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg} flex-shrink-0`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{item.label}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
