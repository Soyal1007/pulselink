'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Plus, Activity, MapPin, Heart, AlertTriangle,
  CheckCircle2, Clock, Ambulance, Bluetooth, Wifi,
  Radio, User, ChevronRight, BarChart2, ShieldCheck, Zap, HardDrive, Smartphone
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { DEMO_AMBULANCES } from '@/lib/demo/data';
import { cn } from '@/lib/utils';
import EcgWaveformCanvas from '@/components/EcgWaveformCanvas';

export default function ParamedicHome() {
  const { activeCase, selectedAmbulance } = useAppStore();

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* High-Contrast Paramedic Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 w-full flex flex-wrap items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
            <User className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Paramedic Arjun Kumar</h1>
              <span className="rounded-full bg-emerald-100 border border-emerald-300 px-3 py-0.5 text-xs font-black text-emerald-800">
                ACTIVE SHIFT
              </span>
            </div>
            <p className="text-xs font-extrabold text-slate-700 mt-1">
              Badge # EMS-BANGALORE-402 · Unit: <strong className="text-blue-700 font-black">{selectedAmbulance?.vehicle_number || 'KA-01-A-0001'}</strong>
            </p>
          </div>
        </div>

        {/* Hardware Status Tag */}
        <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
          <Bluetooth className="h-5 w-5 text-blue-600 animate-pulse" />
          <div className="text-left text-xs">
            <p className="font-black text-slate-900">ZOLL X Series Monitor</p>
            <p className="text-[11px] text-emerald-700 font-extrabold">BLE Sensor Paired (Telemetry Stream Active)</p>
          </div>
        </div>
      </div>

      {/* Primary Emergency Action Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        <div className="md:col-span-8">
          <Link
            href="/paramedic/case/new"
            className="flex w-full items-center justify-center gap-4 rounded-2xl bg-red-600 py-6 text-xl font-black text-white shadow-md hover:bg-red-700 transition"
          >
            <Plus className="h-8 w-8 stroke-[3]" />
            CREATE NEW EMERGENCY PATIENT CASE
          </Link>
        </div>

        <div className="md:col-span-4 flex items-center gap-3">
          <Link href="/paramedic/vitals" className="rounded-2xl border border-slate-200 bg-white p-5 flex-1 flex items-center justify-between text-left hover:border-blue-400 shadow-2xs transition">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Live Vitals</p>
              <p className="text-base font-black text-slate-900">Patient Telemetry</p>
            </div>
            <Heart className="h-6 w-6 text-red-600" />
          </Link>
          <Link href="/paramedic/tracking" className="rounded-2xl border border-slate-200 bg-white p-5 flex-1 flex items-center justify-between text-left hover:border-emerald-400 shadow-2xs transition">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Routing</p>
              <p className="text-base font-black text-slate-900">GPS ETA</p>
            </div>
            <MapPin className="h-6 w-6 text-emerald-600" />
          </Link>
        </div>
      </div>

      {/* Waveform & Acquisition Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Waveform Stream */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Live Ambulance Defibrillator / Monitor Waveform Stream
            </h2>
            <span className="text-xs font-mono font-extrabold text-slate-500">250 Hz · Lead II Continuous</span>
          </div>

          <EcgWaveformCanvas heartRate={78} pattern="NORM" height={260} interactive={true} />
        </div>

        {/* Options */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
            ECG Acquisition Options
          </h2>

          <div className="space-y-3">
            <Link href="/paramedic/ecg" className="rounded-2xl border border-slate-200 bg-white p-4 flex items-start gap-4 block hover:border-blue-400 transition shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 flex-shrink-0">
                <Bluetooth className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">1. Direct Monitor BLE Stream</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Pairs with ZOLL, Philips Intellivue, or Medtronic LifePak monitor via BLE.
                </p>
              </div>
            </Link>

            <Link href="/paramedic/ecg" className="rounded-2xl border border-slate-200 bg-white p-4 flex items-start gap-4 block hover:border-purple-400 transition shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 flex-shrink-0">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">2. Paper ECG Camera Scan</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Takes a photo of paper strip for AI vision digitization.
                </p>
              </div>
            </Link>

            <Link href="/paramedic/ecg" className="rounded-2xl border border-slate-200 bg-white p-4 flex items-start gap-4 block hover:border-emerald-400 transition shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 flex-shrink-0">
                <HardDrive className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">3. Digital File Upload</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Uploads raw CSV or JSON signal data from memory card.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
