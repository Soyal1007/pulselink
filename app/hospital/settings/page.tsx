'use client';
import { Settings, Info, Shield, Server, Database } from 'lucide-react';

export default function HospitalSettings() {
  return (
    <div className="w-full space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hospital Command Settings</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">Platform system parameters and clinical disclaimers.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-black text-slate-900">Platform System Info</p>
              <p className="text-xs font-semibold text-slate-500">PulseLink Version & Tech Stack</p>
            </div>
          </div>
          <div className="space-y-2 text-xs font-extrabold text-slate-700 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Version:</span>
              <span className="font-mono text-slate-900">1.0.0-production</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">FastAPI AI Backend:</span>
              <span className="text-blue-700 font-black">pulselink-y2d9.onrender.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Database & Auth:</span>
              <span className="text-emerald-700 font-black">Supabase PostgreSQL + Realtime</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-black text-slate-900">Clinical & Regulatory Disclaimer</p>
              <p className="text-xs font-semibold text-slate-500">Emergency Medical Decision Support</p>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
            PulseLink is a real-time clinical decision-support prototype system. All telemetry, vitals feeds, and automated rhythm screening outputs are designed for pre-hospital triage assistance only. Final diagnostic interpretation and treatment orders must be confirmed by qualified medical personnel.
          </p>
        </div>
      </div>
    </div>
  );
}
