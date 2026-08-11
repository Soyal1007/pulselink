'use client';
import { useState, useEffect } from 'react';
import {
  Heart, Activity, Wind, Thermometer, Brain, RefreshCw,
  Play, Pause, AlertTriangle, ShieldCheck, Bluetooth, Radio
} from 'lucide-react';
import { cn } from '@/lib/utils';
import EcgWaveformCanvas from '@/components/EcgWaveformCanvas';

export default function VitalsPage() {
  const [isStreaming, setIsStreaming] = useState(true);
  const [vitals, setVitals] = useState({
    heart_rate: 94,
    spo2: 95.0,
    systolic: 144,
    diastolic: 92,
    resp_rate: 20,
    temperature: 37.1,
    consciousness: 'ALERT',
  });

  const [history, setHistory] = useState<typeof vitals[]>([]);

  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setVitals((prev) => {
        const next = {
          heart_rate: Math.min(130, Math.max(60, prev.heart_rate + Math.floor(Math.random() * 5 - 2))),
          spo2: parseFloat(Math.min(100, Math.max(90, prev.spo2 + (Math.random() * 0.4 - 0.2))).toFixed(1)),
          systolic: Math.min(180, Math.max(100, prev.systolic + Math.floor(Math.random() * 3 - 1))),
          diastolic: Math.min(110, Math.max(60, prev.diastolic + Math.floor(Math.random() * 3 - 1))),
          resp_rate: Math.min(30, Math.max(12, prev.resp_rate + Math.floor(Math.random() * 3 - 1))),
          temperature: parseFloat((37.1 + (Math.random() * 0.2 - 0.1)).toFixed(1)),
          consciousness: 'ALERT',
        };
        setHistory((h) => [next, ...h.slice(0, 8)]);
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div className="w-full space-y-6">
      {/* Header — Edge to Edge */}
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
            isStreaming
              ? 'bg-amber-600 text-white hover:bg-amber-700'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          )}
        >
          {isStreaming ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isStreaming ? 'Pause Sensor Stream' : 'Resume Sensor Stream'}
        </button>
      </div>

      {/* 6 Vital Sign Cards Grid — Professional Light Aesthetics with Dark High-Contrast Text */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Heart Rate */}
        <div className="pro-card p-6 border-l-4 border-l-red-500 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <Heart className="h-5 w-5 fill-red-500" />
              </div>
              <span className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Heart Rate</span>
            </div>
            <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-xs font-black">
              NORMAL
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900">{vitals.heart_rate}</span>
            <span className="text-sm font-extrabold text-slate-600">bpm</span>
          </div>
          <p className="text-xs font-bold text-slate-500">Normal Range: 60 – 100 bpm</p>
        </div>

        {/* SpO2 */}
        <div className="pro-card p-6 border-l-4 border-l-blue-500 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Oxygen Saturation (SpO2)</span>
            </div>
            <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-xs font-black">
              NORMAL
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900">{vitals.spo2}</span>
            <span className="text-sm font-extrabold text-slate-600">%</span>
          </div>
          <p className="text-xs font-bold text-slate-500">Normal Target: ≥ 95%</p>
        </div>

        {/* Blood Pressure */}
        <div className="pro-card p-6 border-l-4 border-l-amber-500 space-y-3">
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
            <span className="text-5xl font-black text-slate-900">{vitals.systolic}/{vitals.diastolic}</span>
            <span className="text-sm font-extrabold text-slate-600">mmHg</span>
          </div>
          <p className="text-xs font-bold text-slate-500">Normal Range: 90-120 / 60-80 mmHg</p>
        </div>

        {/* Respiratory Rate */}
        <div className="pro-card p-6 border-l-4 border-l-purple-500 space-y-3">
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
        <div className="pro-card p-6 border-l-4 border-l-emerald-500 space-y-3">
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
        <div className="pro-card p-6 border-l-4 border-l-indigo-500 space-y-3">
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
            <span className="text-4xl font-black text-slate-900">{vitals.consciousness}</span>
          </div>
          <p className="text-xs font-bold text-slate-500">AVPU Scale: Alert / Verbal / Pain / Unresponsive</p>
        </div>
      </div>

      {/* Live Waveform Display */}
      <div className="space-y-2">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">Continuous Monitor Telemetry Stream</h2>
        <EcgWaveformCanvas heartRate={vitals.heart_rate} pattern="RBBB" height={220} interactive={true} />
      </div>

      {/* History Log Table — Light & Clear */}
      <div className="pro-card p-6 space-y-4">
        <h3 className="text-base font-black text-slate-900">Recent Biometric Readings Log</h3>
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
                  <td className="py-3 text-amber-700 font-extrabold">{h.systolic}/{h.diastolic} mmHg</td>
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
