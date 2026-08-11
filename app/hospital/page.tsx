'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Ambulance, Clock, Activity, AlertTriangle, TrendingUp,
  CheckCircle2, MapPin, Heart, ChevronRight, RefreshCw, BarChart3, ShieldAlert,
  SlidersHorizontal, Download, Filter, Search, Building2, User, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import EcgWaveformCanvas from '@/components/EcgWaveformCanvas';

const CASES = [
  {
    id: 'case-001',
    case_ref: 'PL-20260811-CARDIAC01',
    patient_name: 'Rajan Mehta',
    age: 58,
    gender: 'Male',
    priority: 'CRITICAL',
    chief_complaint: 'Acute substernal chest pain & dyspnea (ST-Elevation Suspected)',
    symptoms: ['Radiating chest pain', 'Dyspnea', 'Diaphoresis'],
    ambulance: 'KA-01-A-0001 (ALS Unit)',
    eta_min: 8,
    status: 'hospital_notified',
    ai_result: 'RBBB + ST-Depression (87% confidence - HuggingFace ONNX)',
    heart_rate: 94,
    spo2: 94.5,
    systolic_bp: 148,
    diastolic_bp: 92,
    resp_rate: 22,
    created_at: '4 mins ago',
  },
  {
    id: 'case-002',
    case_ref: 'PL-20260811-TRAUMA01',
    patient_name: 'Priya Sharma',
    age: 32,
    gender: 'Female',
    priority: 'HIGH',
    chief_complaint: 'High-velocity motor vehicle accident trauma',
    symptoms: ['Multiple fractures', 'Hypotension', 'Tachycardia'],
    ambulance: 'KA-01-A-0002 (Trauma Unit)',
    eta_min: 14,
    status: 'hospital_notified',
    ai_result: 'Sinus Tachycardia (91% confidence)',
    heart_rate: 118,
    spo2: 96.0,
    systolic_bp: 98,
    diastolic_bp: 62,
    resp_rate: 26,
    created_at: '7 mins ago',
  },
  {
    id: 'case-003',
    case_ref: 'PL-20260811-RESP01',
    patient_name: 'Arjun Nair',
    age: 45,
    gender: 'Male',
    priority: 'MEDIUM',
    chief_complaint: 'Acute asthma exacerbation',
    symptoms: ['Wheezing', 'Shortness of breath'],
    ambulance: 'KA-01-A-0003 (BLS Unit)',
    eta_min: 22,
    status: 'en_route',
    ai_result: 'Normal Sinus Rhythm (94% confidence)',
    heart_rate: 88,
    spo2: 91.5,
    systolic_bp: 126,
    diastolic_bp: 82,
    resp_rate: 20,
    created_at: '12 mins ago',
  },
];

export default function HospitalOverview() {
  const [cases] = useState(CASES);
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());
  const [preparing, setPreparing] = useState<Set<string>>(new Set());
  const [selectedCase, setSelectedCase] = useState(CASES[0]);

  function acknowledge(caseId: string) {
    setAcknowledged((prev) => new Set([...prev, caseId]));
  }

  function prepare(caseId: string) {
    setPreparing((prev) => new Set([...prev, caseId]));
  }

  return (
    <div className="w-full space-y-8">
      {/* Top Header Bar — Full Width */}
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-slate-200 pb-6 w-full">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Emergency Command Triage Board</h1>
            <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-extrabold text-blue-700">
              City General Hospital · ER Bay 4
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            Real-time pre-hospital telemetry, AI ECG diagnostics, and emergency preparation stream.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-700 hover:bg-slate-50 shadow-xs">
            <Filter className="h-4 w-4 text-slate-500" />
            Filter Triage
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-blue-700 shadow-sm">
            <Download className="h-4 w-4" />
            Export Shift Log
          </button>
        </div>
      </div>

      {/* Clinical KPI Statistics Cards Grid — Full Width */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 w-full">
        <div className="pro-card p-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span className="uppercase tracking-wider">Active Incoming Units</span>
            <Ambulance className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-4xl font-black text-slate-900">3 Fleet Units</p>
          <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> 100% Telemetry Active
          </p>
        </div>

        <div className="pro-card p-6 border-red-200 bg-red-50/20">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span className="uppercase tracking-wider">Critical STEMI / RBBB Alerts</span>
            <ShieldAlert className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-4xl font-black text-red-600">1 Critical</p>
          <p className="text-xs font-semibold text-red-700 mt-2">
            RBBB + ST-Depression detected by AI
          </p>
        </div>

        <div className="pro-card p-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span className="uppercase tracking-wider">ER Team Preparedness</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-4xl font-black text-slate-900">{acknowledged.size} / 3 Ready</p>
          <p className="text-xs font-semibold text-slate-500 mt-2">
            Trauma & Cath Lab Teams On Standby
          </p>
        </div>

        <div className="pro-card p-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span className="uppercase tracking-wider">Mean Pre-Hospital Advantage</span>
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-4xl font-black text-purple-700">14.6 min</p>
          <p className="text-xs font-semibold text-purple-800 mt-2">
            +8.2 minutes earlier preparation
          </p>
        </div>
      </div>

      {/* Main Split Layout: Triage List + Selected Case Live Monitor — Full Width */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 w-full">
        {/* Left Column: Triage Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-600">
            Incoming Ambulance Patient Stream
          </h2>

          <div className="space-y-4">
            {cases.map((c) => {
              const isSelected = selectedCase.id === c.id;
              const isAck = acknowledged.has(c.id);
              const isPrep = preparing.has(c.id);

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={cn(
                    'pro-card p-6 cursor-pointer transition-all',
                    isSelected ? 'border-2 border-blue-600 shadow-md ring-4 ring-blue-500/10' : 'hover:border-slate-300'
                  )}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={cn(
                          'rounded-full px-3 py-1 text-xs font-extrabold',
                          c.priority === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                        )}>
                          {c.priority} PRIORITY
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400">{c.case_ref}</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">{c.patient_name}, {c.age} y/o ({c.gender})</h3>
                      <p className="text-xs font-semibold text-slate-600 mt-1">{c.chief_complaint}</p>
                    </div>

                    <div className="text-right">
                      <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-2 text-center">
                        <p className="text-[10px] font-extrabold uppercase text-blue-600">Ambulance ETA</p>
                        <p className="text-3xl font-black text-blue-700">{c.eta_min} <span className="text-xs font-bold text-blue-900">min</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Vitals Ribbon */}
                  <div className="grid grid-cols-4 gap-3 my-4 rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-slate-400">Heart Rate</p>
                      <p className="text-base font-extrabold text-slate-900">{c.heart_rate} <span className="text-[10px] font-normal text-slate-500">bpm</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-slate-400">SpO2</p>
                      <p className={cn('text-base font-extrabold', c.spo2 < 94 ? 'text-red-600' : 'text-slate-900')}>{c.spo2}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-slate-400">Blood Pressure</p>
                      <p className="text-base font-extrabold text-slate-900">{c.systolic_bp}/{c.diastolic_bp}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-slate-400">Resp Rate</p>
                      <p className="text-base font-extrabold text-slate-900">{c.resp_rate} <span className="text-[10px] font-normal text-slate-500">/min</span></p>
                    </div>
                  </div>

                  {/* Action bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400">{c.ambulance}</span>

                    <div className="flex gap-2">
                      {!isAck ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); acknowledge(c.id); }}
                          className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-700 transition"
                        >
                          Acknowledge Triage
                        </button>
                      ) : !isPrep ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); prepare(c.id); }}
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

        {/* Right Column: Selected Case Detailed Monitor & AI Diagnostics (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-600">
            Selected Patient Telemetry & AI Diagnostic Canvas
          </h2>

          <div className="pro-card p-6 space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Active Stream</span>
              <h3 className="text-2xl font-black text-slate-900">{selectedCase.patient_name}</h3>
              <p className="text-xs font-semibold text-slate-500">{selectedCase.chief_complaint}</p>
            </div>

            {/* Continuous Live Interactive ECG Canvas */}
            <div className="space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                12-Lead Continuous Rhythm Waveform
              </p>
              <EcgWaveformCanvas
                heartRate={selectedCase.heart_rate}
                pattern={selectedCase.priority === 'CRITICAL' ? 'RBBB' : 'NORM'}
                height={220}
                interactive={true}
              />
            </div>

            {/* AI Diagnostics Box */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-800">
                  Hugging Face AI ECG Classification
                </span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  adzetto/ecg-arrhythmia-classifier
                </span>
              </div>
              <p className="text-lg font-black text-slate-900">{selectedCase.ai_result}</p>
              
              <div className="space-y-2 pt-2 border-t border-blue-200/60 text-xs">
                <div className="flex justify-between font-semibold">
                  <span>Right Bundle Branch Block (RBBB)</span>
                  <span className="font-mono font-bold">87.0%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '87%' }} />
                </div>

                <div className="flex justify-between font-semibold pt-1">
                  <span>ST-Segment Depression</span>
                  <span className="font-mono font-bold">73.0%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full" style={{ width: '73%' }} />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <Link
              href={`/hospital/cases/${selectedCase.id}`}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-xs font-extrabold text-white hover:bg-slate-800 transition"
            >
              Open Full Patient Clinical Dossier
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
