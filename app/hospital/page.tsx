'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Ambulance, Clock, Activity, AlertTriangle, TrendingUp,
  CheckCircle2, MapPin, Heart, ChevronRight, RefreshCw, BarChart3, ShieldAlert,
  SlidersHorizontal, Download, Filter, Search, Building2, User, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCaseStore } from '@/store/caseStore';
import EcgWaveformCanvas from '@/components/EcgWaveformCanvas';
import type { EcgConditionPattern } from '@/components/EcgWaveformCanvas';

export default function HospitalOverview() {
  const { cases, acknowledgeCase, prepareCase } = useCaseStore();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const criticalCount = cases.filter((c) => c.priority === 'CRITICAL').length;
  const acknowledgedCount = cases.filter((c) => c.acknowledged).length;

  return (
    <div className="w-full space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-slate-200 pb-6 w-full">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Emergency Command Triage Board</h1>
            <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-extrabold text-blue-700">
              City General Hospital · ER Bay 4
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            Real-time pre-hospital telemetry and emergency preparation stream. <strong className="text-slate-700">{cases.length} active cases.</strong>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 w-full">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span className="uppercase tracking-wider">Active Incoming Units</span>
            <Ambulance className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-4xl font-black text-slate-900">{cases.length} <span className="text-base font-bold text-slate-500">fleet units</span></p>
          <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> 100% Telemetry Active
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50/40 p-6 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span className="uppercase tracking-wider">Critical Alerts</span>
            <ShieldAlert className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-4xl font-black text-red-600">{criticalCount} <span className="text-base font-bold text-red-400">critical</span></p>
          <p className="text-xs font-semibold text-red-700 mt-2">Immediate intervention required</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span className="uppercase tracking-wider">ER Team Preparedness</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-4xl font-black text-slate-900">{acknowledgedCount} / {cases.length} <span className="text-base font-bold text-slate-500">ready</span></p>
          <p className="text-xs font-semibold text-slate-500 mt-2">Teams On Standby</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span className="uppercase tracking-wider">Mean Pre-Hospital ETA</span>
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-4xl font-black text-purple-700">
            {cases.length > 0 ? (cases.reduce((sum, c) => sum + c.eta_min, 0) / cases.length).toFixed(0) : 0} <span className="text-base font-bold text-purple-400">min</span>
          </p>
          <p className="text-xs font-semibold text-purple-800 mt-2">
            Pre-arrival clinical advantage
          </p>
        </div>
      </div>

      {/* Main Split: Triage Queue + Selected Case */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 w-full">
        {/* Left: Triage List */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-600">
            Incoming Ambulance Patient Stream ({cases.length})
          </h2>

          {cases.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-500">
              No active emergency cases. Waiting for incoming telemetry from paramedic units.
            </div>
          )}

          <div className="space-y-4">
            {cases.map((c) => {
              const isSelected = selectedCase?.id === c.id;
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
                          c.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
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

                  {/* Vitals */}
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

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400">
                      Ambulance {c.ambulance_id} · Paramedic: {c.paramedic}
                    </span>
                    <div className="flex gap-2">
                      {!c.acknowledged ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); acknowledgeCase(c.id); }}
                          className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-700 transition"
                        >
                          Acknowledge Triage
                        </button>
                      ) : !c.preparing ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); prepareCase(c.id); }}
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-700 transition"
                        >
                          Prepare Trauma Bay
                        </button>
                      ) : (
                        <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-extrabold text-emerald-700">
                          ✓ ER TEAM READY
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Case Monitor */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-600">
            Selected Patient Telemetry & Monitor
          </h2>

          {selectedCase ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-2xs">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Active Stream</span>
                <h3 className="text-2xl font-black text-slate-900">{selectedCase.patient.name}</h3>
                <p className="text-xs font-semibold text-slate-500">{selectedCase.patient.chief_complaint}</p>
              </div>

              {/* ECG Canvas from their selected pattern */}
              <div className="space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  12-Lead Continuous Rhythm Waveform
                </p>
                <EcgWaveformCanvas
                  heartRate={selectedCase.vitals.heart_rate}
                  pattern={(selectedCase.ecg_pattern as EcgConditionPattern) || 'NORM'}
                  height={220}
                  interactive={true}
                />
              </div>

              {/* Medical Info */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Patient Medical Info</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-500">Blood Group:</span>
                    <p className="font-black text-slate-900">{selectedCase.patient.blood_group}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500">Allergies:</span>
                    <p className="font-black text-red-700">{selectedCase.patient.allergies}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500">Medications:</span>
                    <p className="font-black text-slate-900">{selectedCase.patient.medications}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500">Conditions:</span>
                    <p className="font-black text-slate-900">{selectedCase.patient.conditions}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <p className="font-bold text-slate-500 text-xs">Symptoms:</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedCase.symptoms.map((s) => (
                      <span key={s} className="rounded-full bg-blue-100 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Event Timeline */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Case Event Timeline</p>
                {selectedCase.events.map((ev, i) => (
                  <div key={i} className="flex gap-3 text-xs items-start">
                    <span className="font-mono font-bold text-slate-500 flex-shrink-0 w-12">{ev.time}</span>
                    <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-slate-900">{ev.label}</p>
                      <p className="text-slate-500">{ev.actor}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href={`/hospital/cases/${selectedCase.id}`}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-xs font-extrabold text-white hover:bg-slate-800 transition"
              >
                Open Full Patient Clinical Dossier
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-500">
              No case selected. Click a case from the triage queue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
