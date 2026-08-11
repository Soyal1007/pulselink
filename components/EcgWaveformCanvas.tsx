'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, ZoomIn, Info, Activity } from 'lucide-react';

export type EcgConditionPattern = 'NORM' | 'RBBB' | 'AF' | 'STD' | 'STE' | 'VT';

interface EcgCanvasProps {
  heartRate?: number;
  pattern?: EcgConditionPattern;
  height?: number;
  interactive?: boolean;
}

export default function EcgWaveformCanvas({
  heartRate = 75,
  pattern = 'NORM',
  height = 220,
  interactive = true,
}: EcgCanvasProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [lead, setLead] = useState<'Lead II' | 'Lead V5' | 'Lead V1'>('Lead II');
  const [time, setTime] = useState(0);

  // Condition metadata dictionary for rich clinical metrics
  const CONDITION_DETAILS: Record<EcgConditionPattern, { title: string; pr: string; qrs: string; qtc: string; color: string }> = {
    NORM: { title: 'Normal Sinus Rhythm', pr: '154 ms', qrs: '88 ms', qtc: '412 ms', color: '#16a34a' },
    RBBB: { title: 'Right Bundle Branch Block (RBBB)', pr: '168 ms', qrs: '142 ms (Wide)', qtc: '445 ms', color: '#dc2626' },
    AF: { title: 'Atrial Fibrillation (AFib)', pr: 'Absent (f-waves)', qrs: '94 ms (Irregular)', qtc: '420 ms', color: '#ea580c' },
    STD: { title: 'ST-Segment Depression (Ischemia)', pr: '160 ms', qrs: '96 ms', qtc: '438 ms', color: '#d97706' },
    STE: { title: 'ST-Elevation (Acute STEMI Alert)', pr: '158 ms', qrs: '104 ms', qtc: '468 ms (Prolonged)', color: '#dc2626' },
    VT: { title: 'Ventricular Tachycardia (VTach)', pr: 'Dissociated', qrs: '176 ms (Very Wide)', qtc: '510 ms', color: '#b91c1c' },
  };

  const details = CONDITION_DETAILS[pattern] || CONDITION_DETAILS['NORM'];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTime((t) => (t + 0.03 * speed) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const generateWaveformPoints = (width: number, h: number) => {
    const points: string[] = [];
    const baseline = h / 2;
    const bpm = pattern === 'VT' ? 160 : pattern === 'AF' ? 115 : heartRate;
    const cycleLength = 60 / bpm;
    const pxPerSec = (width / 5) * speed;

    for (let x = 0; x < width; x += 2) {
      const t = (x / pxPerSec + time) % cycleLength;
      const phase = t / cycleLength;

      let yOffset = 0;

      if (pattern === 'VT') {
        // Wide complex monomorphic sinusoidal ventricular tachycardia
        yOffset = -80 * Math.sin(phase * 2 * Math.PI);
      } else if (pattern === 'AF') {
        // Fibrillatory baseline noise without standard P wave
        const fWave = (Math.sin(x * 0.4) * 6) + (Math.cos(x * 0.7) * 4);
        if (phase >= 0.28 && phase <= 0.36) {
          const qrsPhase = (phase - 0.28) / 0.08;
          yOffset = -60 * Math.sin(qrsPhase * Math.PI);
        } else if (phase >= 0.45 && phase <= 0.65) {
          yOffset = -18 * Math.sin(((phase - 0.45) / 0.2) * Math.PI);
        } else {
          yOffset = fWave;
        }
      } else {
        // P wave
        if (phase >= 0.1 && phase <= 0.2) {
          yOffset = -14 * Math.sin(((phase - 0.1) / 0.1) * Math.PI);
        }
        // QRS Complex
        else if (phase >= 0.28 && phase <= 0.36) {
          const qrsPhase = (phase - 0.28) / 0.08;
          if (qrsPhase < 0.25) {
            yOffset = 10 * Math.sin((qrsPhase / 0.25) * Math.PI);
          } else if (qrsPhase < 0.75) {
            const rAmplitude = pattern === 'RBBB' ? -75 : -65;
            yOffset = rAmplitude * Math.sin(((qrsPhase - 0.25) / 0.5) * Math.PI);
            if (pattern === 'RBBB' && qrsPhase > 0.55) {
              yOffset -= 32 * Math.sin(((qrsPhase - 0.55) / 0.2) * Math.PI); // Notched R' peak
            }
          } else {
            yOffset = 22 * Math.sin(((qrsPhase - 0.75) / 0.25) * Math.PI);
          }
        }
        // ST-segment & T wave
        else if (phase >= 0.42 && phase <= 0.65) {
          const tPhase = (phase - 0.42) / 0.23;
          let tAmp = -24;
          let stShift = 0;

          if (pattern === 'STD') stShift = 18; // ST Depression below baseline
          if (pattern === 'STE') stShift = -35; // ST Elevation high above baseline (STEMI)

          yOffset = stShift + tAmp * Math.sin(tPhase * Math.PI);
        }
      }

      const noise = (Math.sin(x * 0.1) * 0.5) + (Math.random() * 0.4 - 0.2);
      points.push(`${x},${baseline + yOffset + noise}`);
    }
    return points.join(' ');
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black uppercase text-slate-900">{lead}</span>
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-extrabold text-slate-700 border border-slate-200">
                {details.title}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">25 mm/s sweep speed · 10 mm/mV gain · 250 Hz</p>
          </div>
        </div>

        {interactive && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5 text-amber-600" /> : <Play className="h-3.5 w-3.5 text-emerald-600" />}
              {isPlaying ? 'Pause Waveform' : 'Live Rhythm'}
            </button>

            <select
              value={lead}
              onChange={(e) => setLead(e.target.value as any)}
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 outline-none hover:bg-slate-100 transition"
            >
              <option value="Lead II">Lead II (Standard)</option>
              <option value="Lead V5">Lead V5 (Lateral)</option>
              <option value="Lead V1">Lead V1 (Right Ventricle)</option>
            </select>
          </div>
        )}
      </div>

      {/* SVG Canvas with Clean Professional Red Medical Grid */}
      <div className="relative overflow-hidden rounded-xl border border-red-200/80 ecg-paper-grid shadow-inner" style={{ height: `${height}px` }}>
        <svg className="h-full w-full" preserveAspectRatio="none">
          <line x1="0" y1={height / 2} x2="1200" y2={height / 2} stroke="#fca5a5" strokeWidth="1" strokeDasharray="6 6" />
          <polyline
            fill="none"
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={generateWaveformPoints(1000, height)}
          />
        </svg>

        {/* Live Metrics Telemetry Bar */}
        <div className="absolute bottom-3 right-3 flex items-center gap-4 rounded-xl bg-white/95 px-4 py-2 text-xs font-mono shadow-md border border-slate-200 backdrop-blur-md">
          <span className="text-slate-600 font-semibold">PR: <strong className="text-slate-900 font-bold">{details.pr}</strong></span>
          <span className="text-slate-600 font-semibold">QRS: <strong className="text-slate-900 font-bold">{details.qrs}</strong></span>
          <span className="text-slate-600 font-semibold">QTc: <strong className="text-slate-900 font-bold">{details.qtc}</strong></span>
          <span className="text-slate-600 font-semibold">HR: <strong className="text-red-600 font-bold">{pattern === 'VT' ? 160 : heartRate} bpm</strong></span>
        </div>
      </div>
    </div>
  );
}
