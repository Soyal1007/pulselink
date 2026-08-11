'use client';
import { Settings, Info, Shield } from 'lucide-react';

export default function HospitalSettings() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-white">Settings</h1>
      <div className="max-w-lg space-y-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <Info className="h-5 w-5 text-blue-400" />
            <p className="font-semibold text-white">Platform Information</p>
          </div>
          <p className="text-xs text-slate-400">Version: 1.0.0-hackathon</p>
          <p className="text-xs text-slate-400 mt-1">AI Model: adzetto/ecg-arrhythmia-classifier</p>
          <p className="text-xs text-slate-400 mt-1">Backend: Supabase (PostgreSQL + Realtime)</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-5 w-5 text-green-400" />
            <p className="font-semibold text-white">Medical Disclaimer</p>
          </div>
          <p className="text-xs text-slate-400">
            PulseLink is a prototype decision-support system. All AI-generated content is for
            screening purposes only. Final clinical decisions must be made by qualified professionals.
          </p>
        </div>
      </div>
    </div>
  );
}
