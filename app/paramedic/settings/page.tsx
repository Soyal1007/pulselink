'use client';
import { Settings, Info, Shield } from 'lucide-react';

export default function ParamedicSettings() {
  return (
    <div className="px-4 pt-4">
      <h1 className="mb-5 text-lg font-bold text-white">Settings</h1>
      <div className="space-y-3">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <Info className="h-5 w-5 text-blue-400" />
            <p className="font-semibold text-white">About PulseLink</p>
          </div>
          <p className="text-xs text-slate-400">Version: 1.0.0-hackathon</p>
          <p className="text-xs text-slate-400 mt-1">AI Model: adzetto/ecg-arrhythmia-classifier (DS-CNN 12-lead)</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-5 w-5 text-green-400" />
            <p className="font-semibold text-white">Medical Disclaimer</p>
          </div>
          <p className="text-xs text-slate-400">
            PulseLink is a prototype clinical decision-support tool. All AI outputs are screening
            results for decision support only — not medical diagnoses. Final clinical interpretation
            must be performed by qualified healthcare professionals.
          </p>
        </div>
      </div>
    </div>
  );
}
