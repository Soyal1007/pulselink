'use client';
import { useParams } from 'next/navigation';
import {
  Heart, Activity, MapPin, Clock, CheckCircle2,
  AlertTriangle, User, Ambulance, Thermometer, Wind,
  Brain, RefreshCw, ChevronLeft, ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const DEMO_CASE = {
  id: 'case-001',
  case_ref: 'PL-20260811-CARDIAC01',
  patient: { name: 'Rajan Mehta', age: 58, gender: 'Male', blood_group: 'O+', allergies: 'Penicillin', conditions: 'Hypertension, Type 2 Diabetes', medications: 'Metformin, Amlodipine' },
  priority: 'CRITICAL',
  symptoms: ['Chest pain', 'Shortness of breath', 'Diaphoresis'],
  chief_complaint: 'Chest pain and shortness of breath — onset approx. 40 min ago',
  vitals: { heart_rate: 94, systolic_bp: 148, diastolic_bp: 94, spo2: 94.5, resp_rate: 22, temperature: 37.2, consciousness: 'alert' },
  ecg: { ai_result: 'RBBB + ST-T Changes', confidence: 87, risk: 'HIGH', patterns: ['Right Bundle Branch Block (RBBB)', 'ST-segment Depression'] },
  ambulance: { id: 'KA-01-A-0001', paramedic: 'Arjun Kumar', eta: 8, distance: 6.4 },
  status: 'hospital_notified',
  events: [
    { time: '10:21', label: 'Emergency case created', actor: 'Arjun Kumar (Paramedic)' },
    { time: '10:22', label: 'Patient information recorded', actor: 'Arjun Kumar' },
    { time: '10:23', label: 'Vitals recorded', actor: 'System' },
    { time: '10:24', label: 'ECG uploaded and analyzed', actor: 'AI Service' },
    { time: '10:25', label: 'Hospital notified', actor: 'Arjun Kumar' },
  ],
};

export default function CaseDetailPage() {
  const params = useParams();
  const c = DEMO_CASE;
  const [acknowledged, setAcknowledged] = useState(false);
  const [prepared, setPrepared] = useState(false);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/hospital/cases" className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 hover:bg-slate-50 shadow-2xs">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{c.patient.name}</h1>
              <span className="rounded-full bg-red-100 border border-red-200 px-3 py-0.5 text-xs font-black text-red-700">
                {c.priority} PRIORITY
              </span>
            </div>
            <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">{c.case_ref}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {acknowledged && (
            <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-extrabold text-emerald-700">
              ✓ TRIAGE ACKNOWLEDGED
            </span>
          )}
          {prepared && (
            <span className="rounded-xl bg-blue-50 border border-blue-200 px-3 py-2 text-xs font-extrabold text-blue-700">
              ✓ BAY 4 READY
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Left column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Patient Details */}
          <div className="pro-card p-6 space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-slate-700">
              <User className="h-4 w-4 text-blue-600" /> Patient Medical Profile
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Age & Gender</p>
                <p className="font-black text-slate-900 text-sm mt-0.5">{c.patient.age} y/o ({c.patient.gender})</p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Blood Group</p>
                <p className="font-black text-slate-900 text-sm mt-0.5">{c.patient.blood_group}</p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Known Allergies</p>
                <p className="font-black text-red-600 text-sm mt-0.5">{c.patient.allergies}</p>
              </div>
              <div className="col-span-2 sm:col-span-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Pre-existing Conditions</p>
                <p className="font-extrabold text-slate-900 text-xs mt-0.5">{c.patient.conditions}</p>
              </div>
            </div>

            <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-4 space-y-1.5">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">Chief Complaint & Symptoms</p>
              <p className="text-sm font-black text-slate-900">{c.chief_complaint}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {c.symptoms.map(s => (
                  <span key={s} className="rounded-full bg-blue-100 border border-blue-200 px-3 py-1 text-xs font-extrabold text-blue-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Vitals Grid */}
          <div className="pro-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-slate-700">
                <Heart className="h-4 w-4 text-red-600" /> Pre-Hospital Telemetry Vitals
              </h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold text-slate-600">
                LIVE SENSOR FEED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Heart Rate', value: c.vitals.heart_rate, unit: 'bpm', color: 'text-red-600', warn: false },
                { label: 'SpO2', value: c.vitals.spo2, unit: '%', color: 'text-blue-600', warn: false },
                { label: 'Resp Rate', value: c.vitals.resp_rate, unit: '/min', color: 'text-slate-900', warn: false },
                { label: 'Systolic BP', value: c.vitals.systolic_bp, unit: 'mmHg', color: 'text-red-600', warn: true },
                { label: 'Diastolic BP', value: c.vitals.diastolic_bp, unit: 'mmHg', color: 'text-slate-900', warn: false },
                { label: 'Temperature', value: `${c.vitals.temperature}°C`, unit: '', color: 'text-slate-900', warn: false },
              ].map(({ label, value, unit, color, warn }) => (
                <div key={label} className={cn('rounded-xl border p-4 text-center', warn ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-slate-50')}>
                  <p className="text-[10px] font-extrabold uppercase text-slate-400">{label}</p>
                  <p className={cn('text-2xl font-black mt-1', color)}>{value} <span className="text-xs font-bold text-slate-500">{unit}</span></p>
                  {warn && <p className="text-[10px] font-extrabold text-red-600 mt-1">⚠ Elevated</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* ETA Card */}
          <div className="pro-card p-6 space-y-4 text-center">
            <h3 className="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
              <Ambulance className="h-4 w-4 text-blue-600" /> Inbound Transport Unit
            </h3>
            <div className="rounded-2xl bg-blue-600 p-5 text-white shadow-md">
              <p className="text-4xl font-black">{c.ambulance.eta} <span className="text-lg font-bold">MIN</span></p>
              <p className="text-xs font-extrabold uppercase tracking-wider text-blue-200 mt-1">{c.ambulance.distance} km away</p>
            </div>
            <div className="text-xs space-y-1 text-slate-600 font-semibold text-left border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span>Vehicle:</span>
                <span className="font-bold text-slate-900">{c.ambulance.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Paramedic:</span>
                <span className="font-bold text-slate-900">{c.ambulance.paramedic}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pro-card p-6 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">ER Action Panel</h3>
            <button
              onClick={() => setAcknowledged(true)}
              className="w-full rounded-xl bg-blue-600 py-3 text-xs font-extrabold text-white hover:bg-blue-700 shadow-sm transition"
            >
              ✓ Acknowledge Triage
            </button>
            <button
              onClick={() => setPrepared(true)}
              className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-extrabold text-white hover:bg-emerald-700 shadow-sm transition"
            >
              ⚡ Prepare Trauma Bay 4
            </button>
          </div>

          {/* Case Timeline */}
          <div className="pro-card p-6 space-y-3">
            <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
              <Clock className="h-4 w-4 text-slate-600" /> Audit Timeline
            </h3>
            <div className="space-y-3 pt-2">
              {c.events.map((ev, i) => (
                <div key={i} className="flex items-start gap-3 text-xs border-l-2 border-blue-500 pl-3">
                  <div>
                    <p className="font-extrabold text-slate-900">{ev.label}</p>
                    <p className="text-[10px] font-semibold text-slate-500">{ev.time} · {ev.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
