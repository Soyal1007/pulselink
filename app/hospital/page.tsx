'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Ambulance, Clock, Activity, AlertTriangle, TrendingUp,
  CheckCircle2, MapPin, Heart, ChevronRight, RefreshCw, BarChart3, ShieldAlert,
  SlidersHorizontal, Download, Filter, Search, Building2, User, Info, Check, X, Navigation
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCaseStore, HOSPITALS } from '@/store/caseStore';
import EcgWaveformCanvas from '@/components/EcgWaveformCanvas';
import type { EcgConditionPattern } from '@/components/EcgWaveformCanvas';

export default function HospitalOverview() {
  const { cases, hospitalRespondToCase, prepareCase } = useCaseStore();

  // Simulate current hospital identity (e.g. City General Hospital or Apollo)
  const [currentHospital, setCurrentHospital] = useState(HOSPITALS[0]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [bedTypeInput, setBedTypeInput] = useState('Emergency Red Zone Bay');

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const criticalCount = cases.filter((c) => c.priority === 'CRITICAL').length;

  return (
    <div className="w-full space-y-8">
      {/* Top Header & Hospital Identity Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-slate-200 pb-6 w-full">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Emergency Command Triage Board</h1>
            <div className="flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-extrabold text-blue-700">
              <Building2 className="h-4 w-4" />
              <span>Viewing As:</span>
              <select
                value={currentHospital.id}
                onChange={(e) => {
                  const h = HOSPITALS.find((x) => x.id === e.target.value);
                  if (h) setCurrentHospital(h);
                }}
                className="bg-transparent font-black underline cursor-pointer outline-none"
              >
                {HOSPITALS.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            Interconnected Multi-Hospital Triage Network. <strong className="text-slate-900">{cases.length} active emergency broadcasts.</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-700 hover:bg-slate-50 shadow-xs">
            <Filter className="h-4 w-4 text-slate-500" /> Filter Triage
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-blue-700 shadow-sm">
            <Download className="h-4 w-4" /> Export Shift Log
          </button>
        </div>
      </div>

      {/* Main Split: Triage List + Selected Case */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 w-full">
        {/* Left: Triage List */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-600">
            City-Wide Emergency Patient Stream ({cases.length})
          </h2>

          <div className="space-y-4">
            {cases.map((c) => {
              const isSelected = selectedCase?.id === c.id;
              const myResponse = c.hospital_responses?.find((r) => r.hospital_id === currentHospital.id);
              const isAssignedToMe = c.assigned_hospital_id === currentHospital.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={cn(
                    'rounded-2xl border bg-white p-6 cursor-pointer transition-all shadow-2xs',
                    isSelected ? 'border-2 border-blue-600 shadow-md ring-4 ring-blue-500/10' : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={cn('rounded-full px-3 py-1 text-xs font-extrabold',
                          c.priority === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-200' :
                          c.priority === 'HIGH' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                          'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        )}>
                          {c.priority} PRIORITY
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400">{c.case_ref}</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">{c.patient.name}, {c.patient.age} y/o ({c.patient.gender})</h3>
                      <p className="text-xs font-semibold text-slate-600 mt-1">{c.patient.chief_complaint}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-2 text-center">
                        <p className="text-[10px] font-extrabold uppercase text-blue-600">ETA</p>
                        <p className="text-3xl font-black text-blue-700">{c.eta_min} <span className="text-xs font-bold text-blue-900">min</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Vitals Ribbon */}
                  <div className="grid grid-cols-4 gap-3 my-4 rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-slate-400">HR</p>
                      <p className="text-base font-extrabold text-slate-900">{c.vitals.heart_rate} <span className="text-[10px] font-normal text-slate-500">bpm</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-slate-400">SpO2</p>
                      <p className={cn('text-base font-extrabold', c.vitals.spo2 < 94 ? 'text-red-600' : 'text-slate-900')}>{c.vitals.spo2}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-slate-400">BP</p>
                      <p className="text-base font-extrabold text-slate-900">{c.vitals.systolic_bp}/{c.vitals.diastolic_bp}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-slate-400">Resp</p>
                      <p className="text-base font-extrabold text-slate-900">{c.vitals.resp_rate} <span className="text-[10px] font-normal text-slate-500">/min</span></p>
                    </div>
                  </div>

                  {/* Multi-Hospital Response Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-500">
                      Destination: <strong className="text-slate-900">{c.assigned_hospital_name || 'Unassigned'}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      {!myResponse ? (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => hospitalRespondToCase(c.id, currentHospital.id, currentHospital.name, 'accepted', bedTypeInput)}
                            className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-emerald-700 transition"
                          >
                            <Check className="h-3.5 w-3.5" /> Accept Accommodation
                          </button>
                          <button
                            onClick={() => hospitalRespondToCase(c.id, currentHospital.id, currentHospital.name, 'declined', undefined, 'No available beds')}
                            className="flex items-center gap-1 rounded-xl bg-red-100 text-red-700 px-3 py-1.5 text-xs font-extrabold hover:bg-red-200 transition"
                          >
                            <X className="h-3.5 w-3.5" /> Decline
                          </button>
                        </div>
                      ) : (
                        <span className={cn('rounded-xl border px-3 py-1.5 text-xs font-extrabold flex items-center gap-1',
                          myResponse.status === 'accepted' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                        )}>
                          {myResponse.status === 'accepted' ? '✓ Accommodation Offered' : '✗ Facility Declined'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Case Monitor & Hospital Action Panel */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-600">
            Selected Patient Telemetry & Accommodation Status
          </h2>

          {selectedCase ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-2xs">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Active Stream</span>
                <h3 className="text-2xl font-black text-slate-900">{selectedCase.patient.name}</h3>
                <p className="text-xs font-semibold text-slate-500">{selectedCase.patient.chief_complaint}</p>
              </div>

              {/* ECG Canvas */}
              <div className="space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  12-Lead Continuous Rhythm Waveform
                </p>
                <EcgWaveformCanvas
                  heartRate={selectedCase.vitals.heart_rate}
                  pattern={(selectedCase.ecg_pattern as EcgConditionPattern) || 'NORM'}
                  height={200}
                  interactive={true}
                />
              </div>

              {/* Inter-Hospital Response Status Grid */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center justify-between">
                  <span>Hospital Accommodation Offers</span>
                  <span className="text-[10px] text-blue-600 font-bold">Interconnected Live</span>
                </p>

                <div className="space-y-2">
                  {selectedCase.hospital_responses && selectedCase.hospital_responses.length > 0 ? (
                    selectedCase.hospital_responses.map((resp, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl bg-white border border-slate-200 p-3 text-xs">
                        <div>
                          <p className="font-black text-slate-900">{resp.hospital_name}</p>
                          <p className="text-[10px] text-slate-500">{resp.bed_type} · {resp.responded_at}</p>
                        </div>
                        <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-black',
                          resp.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        )}>
                          {resp.status.toUpperCase()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No hospital responses recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Offer Facility Accommodation Controls */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 space-y-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-blue-900">
                  Offer Accommodation from {currentHospital.name}
                </p>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">Facility / Bed Type Available</label>
                  <input
                    type="text"
                    value={bedTypeInput}
                    onChange={(e) => setBedTypeInput(e.target.value)}
                    placeholder="e.g. Cath Lab, Red Zone Bay 2"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => hospitalRespondToCase(selectedCase.id, currentHospital.id, currentHospital.name, 'accepted', bedTypeInput)}
                    className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-black text-white hover:bg-emerald-700 transition"
                  >
                    Accept & Confirm Facility
                  </button>
                  <button
                    onClick={() => hospitalRespondToCase(selectedCase.id, currentHospital.id, currentHospital.name, 'declined', undefined, 'No capacity')}
                    className="rounded-xl bg-red-100 text-red-700 px-4 py-2.5 text-xs font-black hover:bg-red-200 transition"
                  >
                    Decline
                  </button>
                </div>
              </div>

              <Link
                href={`/hospital/cases/${selectedCase.id}`}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-xs font-extrabold text-white hover:bg-slate-800 transition"
              >
                Open Full Patient Dossier <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
