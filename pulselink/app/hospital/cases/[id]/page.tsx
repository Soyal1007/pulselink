'use client';
import { useParams } from 'next/navigation';
import {
  Heart, Activity, MapPin, Clock, CheckCircle2,
  AlertTriangle, User, Ambulance, Thermometer, Wind,
  Brain, RefreshCw, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { cn, formatTime } from '@/lib/utils';

const DEMO_CASE = {
  id: 'case-001',
  case_ref: 'PL-20260811-CARDIAC01',
  patient: { name: 'Rajan Mehta', age: 58, gender: 'Male', blood_group: 'O+', allergies: 'Penicillin', conditions: 'Hypertension, Type 2 Diabetes', medications: 'Metformin, Amlodipine' },
  priority: 'CRITICAL',
  symptoms: ['Chest pain', 'Shortness of breath'],
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
  is_demo: true,
};

export default function CaseDetailPage() {
  const params = useParams();
  const c = DEMO_CASE;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link href="/hospital/cases" className="btn-ghost p-2">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">{c.patient.name}</h1>
            <span className="badge-critical">{c.priority}</span>
            {c.is_demo && <span className="badge-demo">DEMO</span>}
          </div>
          <p className="text-xs font-mono text-slate-400">{c.case_ref}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-5 lg:col-span-2">
          {/* Patient */}
          <div className="card">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
              <User className="h-4 w-4 text-blue-400" />Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Age', c.patient.age],
                ['Gender', c.patient.gender],
                ['Blood Group', c.patient.blood_group],
                ['Allergies', c.patient.allergies],
                ['Conditions', c.patient.conditions],
                ['Medications', c.patient.medications],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <p className="text-xs text-slate-500">{k}</p>
                  <p className="font-medium text-white">{v as string}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-xs text-slate-500">Chief Complaint</p>
                <p className="font-medium text-white">{c.chief_complaint}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-500 mb-1">Symptoms</p>
                <div className="flex flex-wrap gap-2">
                  {c.symptoms.map(s => <span key={s} className="rounded-full bg-[#1a2332] px-3 py-1 text-xs text-slate-300">{s}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Vitals */}
          <div className="card">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
              <Heart className="h-4 w-4 text-red-400" />Vitals
              <span className="badge-sim ml-auto">SIMULATED DATA</span>
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Heart Rate', value: c.vitals.heart_rate, unit: 'bpm', color: 'text-red-400', warn: c.vitals.heart_rate > 100 },
                { label: 'SpO2', value: c.vitals.spo2, unit: '%', color: 'text-blue-400', warn: c.vitals.spo2 < 94 },
                { label: 'Resp. Rate', value: c.vitals.resp_rate, unit: '/min', color: 'text-cyan-400', warn: false },
                { label: 'Systolic BP', value: c.vitals.systolic_bp, unit: 'mmHg', color: 'text-purple-400', warn: c.vitals.systolic_bp > 140 },
                { label: 'Diastolic BP', value: c.vitals.diastolic_bp, unit: 'mmHg', color: 'text-purple-300', warn: false },
                { label: 'Temperature', value: `${c.vitals.temperature}°C`, unit: '', color: 'text-yellow-400', warn: false },
              ].map(({ label, value, unit, color, warn }) => (
                <div key={label} className={cn('rounded-xl p-3', warn ? 'border border-orange-700 bg-orange-950/30' : 'bg-[#0d1117]')}>
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <p className={cn('text-xl font-bold', color)}>{value}<span className="text-xs text-slate-500 ml-1">{unit}</span></p>
                  {warn && <p className="text-xs text-orange-400 mt-0.5">⚠ Abnormal</p>}
                </div>
              ))}
            </div>
          </div>

          {/* ECG / AI Result */}
          <div className="card border-orange-800 bg-orange-950/20">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
              <Activity className="h-4 w-4 text-orange-400" />AI ECG Screening
            </h3>
            <div className="flex items-center justify-between mb-3">
              <span className="badge-high">{c.ecg.risk} PRIORITY</span>
              <span className="text-xs text-slate-400">Confidence: {c.ecg.confidence}%</span>
            </div>
            <div className="space-y-2 mb-4">
              {c.ecg.patterns.map(p => (
                <div key={p} className="flex items-center gap-2 rounded-lg bg-orange-950/40 px-3 py-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-orange-400 flex-shrink-0" />
                  <span className="text-sm text-white">{p}</span>
                </div>
              ))}
            </div>
            <div className="ai-disclaimer text-left">
              AI-generated screening result. Not a medical diagnosis. Final interpretation must be performed by a qualified healthcare professional.
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Ambulance / ETA */}
          <div className="card">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
              <Ambulance className="h-4 w-4 text-green-400" />Ambulance
            </h3>
            <div className="text-center mb-4">
              <p className="text-4xl font-black text-blue-400">{c.ambulance.eta}</p>
              <p className="text-sm text-slate-400">minutes ETA</p>
              <p className="text-xs text-slate-500 mt-1">{c.ambulance.distance} km away</p>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle</span>
                <span className="font-mono text-white">{c.ambulance.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Paramedic</span>
                <span className="text-white">{c.ambulance.paramedic}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <h3 className="mb-4 font-semibold text-white">Preparedness</h3>
            <div className="space-y-2">
              <button className="btn-primary w-full">
                <CheckCircle2 className="h-4 w-4" />
                Acknowledge Case
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-700 bg-green-950/30 px-4 py-2.5 text-sm font-semibold text-green-400 transition hover:bg-green-900/30">
                <RefreshCw className="h-4 w-4" />
                Prepare for Arrival
              </button>
              <button className="btn-ghost w-full">
                <AlertTriangle className="h-4 w-4" />
                Escalate Priority
              </button>
            </div>
          </div>

          {/* Case Timeline */}
          <div className="card">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
              <Clock className="h-4 w-4 text-blue-400" />Case Timeline
            </h3>
            <div className="relative space-y-4 pl-5">
              {c.events.map((ev, i) => (
                <div key={i} className="relative">
                  <div className="timeline-dot-done absolute -left-5 top-1" />
                  {i < c.events.length - 1 && (
                    <div className="absolute -left-[17px] top-3 h-full w-0.5 bg-[#1f2d3d]" />
                  )}
                  <p className="text-sm font-medium text-white">{ev.label}</p>
                  <div className="flex gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-mono">{ev.time}</span>
                    <span>·</span>
                    <span>{ev.actor}</span>
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
