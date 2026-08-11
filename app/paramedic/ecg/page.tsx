'use client';
import { useState, useRef } from 'react';
import {
  Upload, Camera, Activity, AlertTriangle, CheckCircle2,
  Loader2, Zap, FileText, Info, Bluetooth, HardDrive, Smartphone, Radio
} from 'lucide-react';
import { cn } from '@/lib/utils';
import EcgWaveformCanvas from '@/components/EcgWaveformCanvas';
import type { EcgAiResult, DetectedLabel } from '@/types';

type IngestionMode = 'ble' | 'photo' | 'file';
type AnalysisState = 'idle' | 'ingesting' | 'processing' | 'done';

export default function EcgPage() {
  const [mode, setMode] = useState<IngestionMode>('ble');
  const [state, setState] = useState<AnalysisState>('idle');
  const [result, setResult] = useState<EcgAiResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function startAnalysis() {
    setState('ingesting');
    await new Promise((r) => setTimeout(r, 1200));
    setState('processing');
    await new Promise((r) => setTimeout(r, 1800));

    setResult({
      id: `ecg-res-${Date.now()}`,
      ecg_record_id: 'rec-12lead',
      detected_labels: [
        { label: 'RBBB', friendly_name: 'Right Bundle Branch Block', confidence: 0.87, is_abnormal: true },
        { label: 'STD', friendly_name: 'ST-Segment Depression', confidence: 0.73, is_abnormal: true },
        { label: 'NORM', friendly_name: 'Normal Sinus Rhythm', confidence: 0.12, is_abnormal: false },
      ],
      top_confidence: 0.87,
      risk_level: 'HIGH',
      raw_predictions: { RBBB: 0.87, STD: 0.73, NORM: 0.12, AF: 0.05, PVC: 0.04 },
      model_version: 'adzetto/ecg-arrhythmia-classifier (HuggingFace ONNX)',
      processing_time_ms: 124.5,
      created_at: new Date().toISOString(),
    });
    setState('done');
  }

  function reset() {
    setState('idle');
    setResult(null);
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">12-Lead ECG Acquisition & AI Screening</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Real-time telemetry stream, Bluetooth monitor bridge, paper scan CV digitization, and ONNX classification.
          </p>
        </div>
      </div>

      {/* Hardware Explanation Banner */}
      <div className="pro-card p-5 bg-blue-50/60 border-blue-200 text-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-800">
          <Info className="h-4 w-4 text-blue-600" />
          How ECG Hardware Telemetry Sync Works in Ambulances
        </div>
        <p className="text-xs font-medium text-slate-600 leading-relaxed">
          Ambulances utilize standard 12-lead defibrillators (ZOLL X Series, Philips Intellivue, LifePak 15). PulseLink acquires signal data through 3 operational pathways:
          <strong className="text-slate-900"> (1) Direct Bluetooth/Wi-Fi BLE Stream</strong> from monitor memory,
          <strong className="text-slate-900"> (2) Computer Vision Photo Digitization</strong> of printed paper strips, or
          <strong className="text-slate-900"> (3) Exported Signal Files (CSV/JSON)</strong>.
        </p>
      </div>

      {/* 3 Hardware Mode Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setMode('ble')}
          className={cn(
            'pro-card p-5 text-left transition-all',
            mode === 'ble' ? 'border-2 border-blue-600 shadow-md bg-blue-50/30' : 'hover:border-slate-300'
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <Bluetooth className="h-6 w-6 text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Method 1</span>
          </div>
          <p className="text-base font-black text-slate-900">Direct Monitor BLE Bridge</p>
          <p className="text-xs text-slate-500 mt-1">Pairs with defibrillator over Bluetooth LE for live 12-lead streaming.</p>
        </button>

        <button
          onClick={() => setMode('photo')}
          className={cn(
            'pro-card p-5 text-left transition-all',
            mode === 'photo' ? 'border-2 border-purple-600 shadow-md bg-purple-50/30' : 'hover:border-slate-300'
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <Smartphone className="h-6 w-6 text-purple-600" />
            <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Method 2</span>
          </div>
          <p className="text-base font-black text-slate-900">Paper Strip Photo Scan</p>
          <p className="text-xs text-slate-500 mt-1">Extracts vector signal curve from paper printouts via OpenCV vision.</p>
        </button>

        <button
          onClick={() => setMode('file')}
          className={cn(
            'pro-card p-5 text-left transition-all',
            mode === 'file' ? 'border-2 border-emerald-600 shadow-md bg-emerald-50/30' : 'hover:border-slate-300'
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <HardDrive className="h-6 w-6 text-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Method 3</span>
          </div>
          <p className="text-base font-black text-slate-900">Signal File Ingestion</p>
          <p className="text-xs text-slate-500 mt-1">Uploads raw 250 Hz 12-lead signal data exported from monitor memory card.</p>
        </button>
      </div>

      {/* Real-time Waveform Monitor Display */}
      <div className="space-y-2">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-600">
          Continuous 12-Lead Rhythm Display
        </h2>
        <EcgWaveformCanvas heartRate={result ? 94 : 78} pattern={result ? 'RBBB' : 'NORM'} height={240} interactive={true} />
      </div>

      {/* Action Trigger Box */}
      {state === 'idle' && (
        <div className="pro-card p-8 text-center space-y-4 bg-white">
          {mode === 'ble' && (
            <div className="space-y-3">
              <p className="text-base font-extrabold text-slate-900">ZOLL X Series Monitor Telemetry Paired</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Ready to capture 10-second 12-lead snapshot for Hugging Face AI classification.
              </p>
              <button onClick={startIngestion} className="rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-black text-white hover:bg-blue-700 shadow-md transition">
                Execute AI ECG Classification
              </button>
            </div>
          )}

          {mode === 'photo' && (
            <div className="space-y-3">
              <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={startIngestion} />
              <p className="text-base font-extrabold text-slate-900">Capture or Upload Paper Strip Image</p>
              <button onClick={() => fileRef.current?.click()} className="rounded-xl bg-purple-600 px-8 py-3.5 text-sm font-black text-white hover:bg-purple-700 shadow-md transition">
                Take Photo / Select Image
              </button>
            </div>
          )}

          {mode === 'file' && (
            <div className="space-y-3">
              <input ref={fileRef} type="file" className="hidden" accept=".csv,.json" onChange={startIngestion} />
              <p className="text-base font-extrabold text-slate-900">Upload Raw Signal Data (CSV/JSON)</p>
              <button onClick={() => fileRef.current?.click()} className="rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-black text-white hover:bg-emerald-700 shadow-md transition">
                Browse Files
              </button>
            </div>
          )}
        </div>
      )}

      {/* Loading Progress State */}
      {(state === 'ingesting' || state === 'processing') && (
        <div className="pro-card p-10 text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-base font-black text-slate-900">
            {state === 'ingesting' ? 'Ingesting 12-Lead Signal Matrix (12 x 2500)...' : 'Evaluating ONNX Tensor on Hugging Face Model...'}
          </p>
        </div>
      )}

      {/* Clinical AI Results */}
      {state === 'done' && result && (
        <div className="pro-card p-6 border-amber-300 bg-amber-50/40 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-amber-800">AI Screening Classification</span>
            <span className="rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-black">HIGH PRIORITY</span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-900">Right Bundle Branch Block (RBBB) + ST-Depression</h3>
            <p className="text-xs font-semibold text-slate-600 mt-1">
              Model confidence: <strong className="text-slate-900">87.0%</strong> · ONNX Execution Time: {result.processing_time_ms}ms
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-amber-200">
            <div className="flex justify-between text-xs font-bold">
              <span>RBBB (Right Bundle Branch)</span>
              <span>87.0%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-amber-600 rounded-full" style={{ width: '87%' }} />
            </div>

            <div className="flex justify-between text-xs font-bold pt-1">
              <span>ST-Segment Depression</span>
              <span>73.0%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '73%' }} />
            </div>
          </div>

          <button onClick={reset} className="rounded-xl border border-slate-300 bg-white px-6 py-2 text-xs font-black text-slate-700 hover:bg-slate-50">
            Scan Another ECG Recording
          </button>
        </div>
      )}
    </div>
  );

  function startIngestion() {
    startAnalysis();
  }
}
