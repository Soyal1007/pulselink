'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Heart, Activity, AlertTriangle, MapPin, Phone, Droplets, Pill, Stethoscope, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCaseStore } from '@/store/caseStore';
import EcgWaveformCanvas from '@/components/EcgWaveformCanvas';
import type { EcgConditionPattern } from '@/components/EcgWaveformCanvas';

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.id as string;
  const { cases, acknowledgeCase, prepareCase } = useCaseStore();

  const caseData = cases.find((c) => c.id === caseId);

  if (!caseData) {
    return (
      <div className="w-full space-y-6">
        <Link href="/hospital/cases" className="flex items-center gap-2 text-sm font-black text-slate-800 hover:text-blue-600 transition">
          <ChevronLeft className="h-5 w-5" /> Back to Cases
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-base font-semibold text-slate-500">
          Case not found. It may have been closed or is not yet available.
        </div>
      </div>
    );
  }

  const { patient, vitals } = caseData;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link href="/hospital/cases" className="flex items-center gap-2 text-sm font-black text-slate-800 hover:text-blue-600 transition">
          <ChevronLeft className="h-5 w-5" /> All Cases
        </Link>
        <div className="flex items-center gap-3">
          <span className={cn('rounded-full px-3 py-1 text-xs font-black border',
            caseData.priority === 'CRITICAL' ? 'bg-red-100 text-red-700 border-red-300' :
            caseData.priority === 'HIGH' ? 'bg-amber-100 text-amber-700 border-amber-300' :
            caseData.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
            'bg-emerald-100 text-emerald-700 border-emerald-300'
          )}>{caseData.priority} PRIORITY</span>
          <span className="text-xs font-mono font-bold text-slate-500">{caseData.case_ref}</span>
        </div>
      </div>

      {/* Patient Identity Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-md">
            {patient.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{patient.name}</h1>
            <p className="text-xs font-extrabold text-slate-600 mt-1">
              {patient.age} y/o · {patient.gender} · Blood: <strong className="text-red-600">{patient.blood_group}</strong> · Phone: {patient.phone}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 border border-blue-200 px-6 py-3 text-center">
            <p className="text-[10px] font-extrabold uppercase text-blue-600">ETA</p>
            <p className="text-3xl font-black text-blue-700">{caseData.eta_min} <span className="text-xs text-blue-500">min</span></p>
          </div>
          {!caseData.acknowledged ? (
            <button onClick={() => acknowledgeCase(caseData.id)}
              className="rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-black text-white hover:bg-blue-700 transition shadow-sm">
              Acknowledge
            </button>
          ) : !caseData.preparing ? (
            <button onClick={() => prepareCase(caseData.id)}
              className="rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-black text-white hover:bg-emerald-700 transition shadow-sm">
              Prepare Bay
            </button>
          ) : (
            <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-3 text-sm font-black text-emerald-700">✓ ER Ready</span>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Clinical Info */}
        <div className="lg:col-span-7 space-y-5">
          {/* Vitals Grid */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-600" /> Real-Time Vital Signs
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Heart Rate', value: vitals.heart_rate, unit: 'bpm', danger: vitals.heart_rate > 110 || vitals.heart_rate < 50 },
                { label: 'SpO2', value: vitals.spo2 + '%', unit: '', danger: vitals.spo2 < 94 },
                { label: 'Blood Pressure', value: `${vitals.systolic_bp}/${vitals.diastolic_bp}`, unit: 'mmHg', danger: vitals.systolic_bp > 180 || vitals.systolic_bp < 90 },
                { label: 'Respiratory Rate', value: vitals.resp_rate, unit: '/min', danger: vitals.resp_rate > 25 },
                { label: 'Temperature', value: vitals.temperature + '°C', unit: '', danger: vitals.temperature > 38.5 },
                { label: 'ECG Pattern', value: caseData.ecg_pattern, unit: '', danger: caseData.ecg_pattern !== 'NORM' },
              ].map((v) => (
                <div key={v.label} className={cn('rounded-xl border p-4 text-center', v.danger ? 'border-red-200 bg-red-50/50' : 'border-slate-200 bg-slate-50')}>
                  <p className="text-[10px] font-extrabold uppercase text-slate-500">{v.label}</p>
                  <p className={cn('text-xl font-black mt-1', v.danger ? 'text-red-600' : 'text-slate-900')}>
                    {v.value} <span className="text-[10px] font-normal text-slate-400">{v.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Chief Complaint & Symptoms */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-blue-600" /> Clinical Presentation
            </h3>
            <p className="text-base font-black text-slate-900">{patient.chief_complaint}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {caseData.symptoms.map((s) => (
                <span key={s} className="rounded-full bg-blue-100 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-800">{s}</span>
              ))}
            </div>
            {caseData.symptom_notes && (
              <p className="text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">{caseData.symptom_notes}</p>
            )}
            <p className="text-xs font-bold text-slate-500">Onset: {caseData.symptom_onset}</p>
          </div>

          {/* Medical History */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Pill className="h-4 w-4 text-purple-600" /> Patient Medical History
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
                <p className="font-extrabold text-red-700 mb-1">Drug Allergies</p>
                <p className="font-bold text-red-900">{patient.allergies || 'None known'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-extrabold text-slate-600 mb-1">Current Medications</p>
                <p className="font-bold text-slate-900">{patient.medications || 'None'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-extrabold text-slate-600 mb-1">Pre-Existing Conditions</p>
                <p className="font-bold text-slate-900">{patient.conditions || 'None'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: ECG + Timeline */}
        <div className="lg:col-span-5 space-y-5">
          {/* ECG Waveform */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" /> Live ECG Rhythm Monitor
            </h3>
            <EcgWaveformCanvas
              heartRate={vitals.heart_rate}
              pattern={(caseData.ecg_pattern as EcgConditionPattern) || 'NORM'}
              height={200}
              interactive={true}
            />
            <p className="text-xs font-semibold text-slate-500 text-center">
              Pattern: <strong className="text-slate-800">{caseData.ecg_pattern}</strong> · {vitals.heart_rate} bpm · Lead II 250Hz
            </p>
          </div>

          {/* Ambulance Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-600" /> Ambulance & Dispatch Info
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-bold text-slate-500">Vehicle</p>
                <p className="font-black text-slate-900">{caseData.ambulance_id}</p>
              </div>
              <div>
                <p className="font-bold text-slate-500">Paramedic</p>
                <p className="font-black text-slate-900">{caseData.paramedic}</p>
              </div>
              <div>
                <p className="font-bold text-slate-500">Distance</p>
                <p className="font-black text-slate-900">{caseData.distance_km} km</p>
              </div>
              <div>
                <p className="font-bold text-slate-500">Status</p>
                <p className="font-black text-blue-700">{caseData.status.replace(/_/g, ' ')}</p>
              </div>
            </div>
          </div>

          {/* Event Timeline */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-600" /> Case Event Timeline
            </h3>
            <div className="space-y-3">
              {caseData.events.map((ev, i) => (
                <div key={i} className="flex gap-3 text-xs items-start">
                  <span className="font-mono font-bold text-slate-500 flex-shrink-0 w-12">{ev.time}</span>
                  <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-slate-900">{ev.label}</p>
                    <p className="text-slate-500">{ev.actor}</p>
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
