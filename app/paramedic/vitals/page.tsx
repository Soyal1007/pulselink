'use client';
import { useState, useEffect } from 'react';
import {
  Heart, Activity, Wind, Thermometer, Brain, RefreshCw,
  Play, Pause, AlertTriangle, ShieldCheck, Bluetooth, User, Navigation, Building2, CheckCircle2, XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCaseStore, HOSPITALS } from '@/store/caseStore';
import EcgWaveformCanvas from '@/components/EcgWaveformCanvas';
import type { EcgConditionPattern } from '@/components/EcgWaveformCanvas';

export default function VitalsPage() {
  const [isStreaming, setIsStreaming] = useState(true);
  const { cases, activeCaseId, setActiveCaseId, updateCaseVitals, redirectAmbulanceToHospital } = useCaseStore();

  // Active selected patient/case
  const activeCase = cases.find((c) => c.id === activeCaseId) || cases[0];
  const patient = activeCase?.patient;
  const vitals = activeCase?.vitals || {
    heart_rate: 94,
    spo2: 95.1,
    systolic_bp: 144,
    diastolic_bp: 92,
    resp_rate: 18,
    temperature: 37.2,
  };

  const [history, setHistory] = useState<typeof vitals[]>([]);

  // Real-time telemetry simulation connected directly to the store!
  useEffect(() => {
    if (!isStreaming || !activeCase) return;
    const interval = setInterval(() => {
      const newHr = Math.min(130, Math.max(60, vitals.heart_rate + Math.floor(Math.random() * 5 - 2)));
      const newSpo2 = parseFloat(Math.min(100, Math.max(90, vitals.spo2 + (Math.random() * 0.4 - 0.2))).toFixed(1));
      const newSys = Math.min(180, Math.max(100, vitals.systolic_bp + Math.floor(Math.random() * 3 - 1)));
      const newDia = Math.min(110, Math.max(60, vitals.diastolic_bp + Math.floor(Math.random() * 3 - 1)));
      const newResp = Math.min(30, Math.max(12, vitals.resp_rate + Math.floor(Math.random() * 3 - 1)));
      const newTemp = parseFloat((37.1 + (Math.random() * 0.2 - 0.1)).toFixed(1));

      const updated = {
        heart_rate: newHr,
        spo2: newSpo2,
        systolic_bp: newSys,
        diastolic_bp: newDia,
        resp_rate: newResp,
        temperature: newTemp,
      };

      updateCaseVitals(activeCase.id, updated);
      setHistory((h) => [updated, ...h.slice(0, 7)]);
    }, 2500);

    return () => clearInterval(interval);
  }, [isStreaming, activeCase?.id, vitals]);

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Patient Vital Signs Telemetry</h1>
            <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-black flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              ZOLL X Series BLE Stream Active
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-600 mt-1">
            Real-time biometric data feed synced directly from ambulance defibrillator monitor.
          </p>
        </div>

        <button
          onClick={() => setIsStreaming(!isStreaming)}
          className={cn(
            'flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black transition shadow-sm',
            isStreaming ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'
          )}
        >
          {isStreaming ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isStreaming ? 'Pause Sensor Stream' : 'Resume Sensor Stream'}
        </button>
      </div>

      {/* PATIENT SELECTOR BAR */}
      <div className="rounded-2xl border-2 border-blue-600 bg-blue-50/40 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">Currently Streaming Vitals For</p>
              <h2 className="text-2xl font-black text-slate-900">{patient?.name || 'Unidentified Patient'}</h2>
              <p className="text-xs font-bold text-slate-600">
                {patient?.age} y/o {patient?.gender} · Blood: <strong className="text-red-600">{patient?.blood_group}</strong> · Complaint: {patient?.chief_complaint}
              </p>
            </div>
          </div>

          {/* Switch Patient Dropdown */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-extrabold uppercase text-slate-700">Switch Patient:</label>
            <select
              value={activeCase?.id || ''}
              onChange={(e) => setActiveCaseId(e.target.value)}
              className="rounded-xl border-2 border-blue-600 bg-white px-4 py-2.5 text-xs font-black text-slate-900 shadow-xs outline-none focus:ring-2 focus:ring-blue-500"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.patient.name} ({c.priority} PRIORITY — {c.case_ref})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hospital Accommodation & Redirection Panel */}
        <div className="rounded-xl border border-blue-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-blue-600" /> Multi-Hospital Facility Accommodations & Redirects
            </span>
            <span className="text-xs font-bold text-slate-500">
              Assigned Destination: <strong className="text-blue-700">{activeCase?.assigned_hospital_name || 'City General Hospital'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {HOSPITALS.map((hosp) => {
              const resp = activeCase?.hospital_responses?.find((r) => r.hospital_id === hosp.id);
              const isAssigned = activeCase?.assigned_hospital_id === hosp.id;

              return (
                <div
                  key={hosp.id}
                  className={cn(
                    'rounded-xl border p-3 flex flex-col justify-between space-y-2 transition',
                    isAssigned ? 'border-2 border-emerald-600 bg-emerald-50/40' : 'border-slate-200 bg-slate-50'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-black text-slate-900">{hosp.name}</p>
                      <p className="text-[10px] font-bold text-slate-500">{hosp.distance} km away</p>
                    </div>
                    {resp?.status === 'accepted' ? (
                      <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[9px] font-black text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> ACCEPTED
                      </span>
                    ) : resp?.status === 'declined' ? (
                      <span className="rounded-full bg-red-100 border border-red-300 px-2 py-0.5 text-[9px] font-black text-red-800 flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> DECLINED
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[9px] font-black text-amber-800">
                        PENDING
                      </span>
                    )}
                  </div>

                  {resp?.bed_type && (
                    <p className="text-[10px] font-bold text-slate-600">Bed: {resp.bed_type}</p>
                  )}

                  {!isAssigned && resp?.status === 'accepted' && (
                    <button
                      onClick={() => redirectAmbulanceToHospital(activeCase.id, hosp.id, hosp.name)}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-1.5 text-[10px] font-black text-white hover:bg-blue-700 transition"
                    >
                      <Navigation className="h-3 w-3" /> Redirect Ambulance Here
                    </button>
                  )}

                  {isAssigned && (
                    <p className="text-[10px] font-extrabold text-emerald-700 text-center uppercase tracking-wider">
                      ✓ Current Route Destination
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6 Vital Sign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Heart Rate */}
        <div className="pro-card p-6 border-l-4 border-l-red-500 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <Heart className="h-5 w-5 fill-red-500" />
              </div>
              <span className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Heart Rate</span>
            </div>
            <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-black',
              vitals.heart_rate > 100 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800')}>
              {vitals.heart_rate > 100 ? 'HIGH' : 'NORMAL'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900">{vitals.heart_rate}</span>
            <span className="text-sm font-extrabold text-slate-600">bpm</span>
          </div>
          <p className="text-xs font-bold text-slate-500">Normal Range: 60 – 100 bpm</p>
        </div>

        {/* SpO2 */}
        <div className="pro-card p-6 border-l-4 border-l-blue-500 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Oxygen Saturation (SpO2)</span>
            </div>
            <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-black',
              vitals.spo2 < 94 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800')}>
              {vitals.spo2 < 94 ? 'LOW' : 'NORMAL'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900">{vitals.spo2}</span>
            <span className="text-sm font-extrabold text-slate-600">%</span>
          </div>
          <p className="text-xs font-bold text-slate-500">Normal Target: ≥ 95%</p>
        </div>

        {/* Blood Pressure */}
        <div className="pro-card p-6 border-l-4 border-l-amber-500 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Blood Pressure (NIBP)</span>
            </div>
            <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 text-xs font-black">
              ELEVATED
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900">{vitals.systolic_bp}/{vitals.diastolic_bp}</span>
            <span className="text-sm font-extrabold text-slate-600">mmHg</span>
          </div>
          <p className="text-xs font-bold text-slate-500">Normal Range: 90-120 / 60-80 mmHg</p>
        </div>

        {/* Respiratory Rate */}
        <div className="pro-card p-6 border-l-4 border-l-purple-500 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Wind className="h-5 w-5" />
              </div>
              <span className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Respiratory Rate</span>
            </div>
            <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-xs font-black">
              NORMAL
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900">{vitals.resp_rate}</span>
            <span className="text-sm font-extrabold text-slate-600">breaths/min</span>
          </div>
          <p className="text-xs font-bold text-slate-500">Normal Range: 12 – 20 /min</p>
        </div>

        {/* Body Temperature */}
        <div className="pro-card p-6 border-l-4 border-l-emerald-500 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Thermometer className="h-5 w-5" />
              </div>
              <span className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Body Temperature</span>
            </div>
            <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-xs font-black">
              NORMAL
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900">{vitals.temperature}</span>
            <span className="text-sm font-extrabold text-slate-600">°C</span>
          </div>
          <p className="text-xs font-bold text-slate-500">Normal Range: 36.5 – 37.5 °C</p>
        </div>

        {/* Consciousness Level */}
        <div className="pro-card p-6 border-l-4 border-l-indigo-500 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Brain className="h-5 w-5" />
              </div>
              <span className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Consciousness (AVPU)</span>
            </div>
            <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-xs font-black">
              NORMAL
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">ALERT</span>
          </div>
          <p className="text-xs font-bold text-slate-500">AVPU Scale: Alert / Verbal / Pain / Unresponsive</p>
        </div>
      </div>

      {/* Live Waveform Display */}
      <div className="space-y-2">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">Continuous Monitor Telemetry Stream — {patient?.name}</h2>
        <EcgWaveformCanvas heartRate={vitals.heart_rate} pattern={(activeCase?.ecg_pattern as EcgConditionPattern) || 'RBBB'} height={220} interactive={true} />
      </div>

      {/* History Log Table */}
      <div className="pro-card p-6 space-y-4 bg-white">
        <h3 className="text-base font-black text-slate-900">Recent Biometric Readings Log for {patient?.name}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 uppercase tracking-wider">
                <th className="pb-3">Reading Time</th>
                <th className="pb-3">Heart Rate</th>
                <th className="pb-3">SpO2</th>
                <th className="pb-3">Blood Pressure</th>
                <th className="pb-3">Resp. Rate</th>
                <th className="pb-3">Temperature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((h, idx) => (
                <tr key={idx} className="hover:bg-slate-50 text-slate-900">
                  <td className="py-3 font-mono text-slate-500">-{idx * 2.5}s ago</td>
                  <td className="py-3 text-red-600 font-extrabold">{h.heart_rate} bpm</td>
                  <td className="py-3 text-blue-600 font-extrabold">{h.spo2}%</td>
                  <td className="py-3 text-amber-700 font-extrabold">{h.systolic_bp}/{h.diastolic_bp} mmHg</td>
                  <td className="py-3 text-purple-700 font-extrabold">{h.resp_rate} /min</td>
                  <td className="py-3 text-emerald-700 font-extrabold">{h.temperature} °C</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
