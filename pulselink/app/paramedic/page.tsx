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
  const [hardwareState, setHardwareState] = useState<'paired' | 'scanning' | 'disconnected'>('paired');

  return (
    <div className="w-full space-y-6">
      {/* Full-width Top Hero Status Banner */}
      <div className="pro-card p-6 w-full flex flex-wrap items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white shadow-md">
        <div className="flex items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
            <User className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black tracking-tight">Paramedic Arjun Kumar</h1>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-0.5 text-xs font-bold text-emerald-400">
                ACTIVE SHIFT
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Badge # EMS-BANGALORE-402 · Unit: <strong className="text-white font-bold">{selectedAmbulance?.vehicle_number || 'KA-01-A-0001'}</strong>
            </p>
          </div>
        </div>

        {/* Hardware Monitor Integration Status */}
        <div className="flex items-center gap-4 rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 backdrop-blur-md">
          <Bluetooth className="h-5 w-5 text-blue-400 animate-pulse" />
          <div className="text-left text-xs">
            <p className="font-bold text-white">ZOLL X Series Monitor</p>
            <p className="text-[11px] text-emerald-400 font-semibold">BLE Sensor Paired (Telemetry Stream Active)</p>
          </div>
        </div>
      </div>

      {/* Primary Emergency Action Bar — Edge-to-Edge */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        <div className="md:col-span-8">
          <Link
            href="/paramedic/case/new"
            className="flex w-full items-center justify-center gap-4 rounded-2xl bg-red-600 py-6 text-xl font-black text-white shadow-lg hover:bg-red-700 transition transform active:scale-98"
          >
            <Plus className="h-8 w-8 stroke-[3]" />
            CREATE NEW EMERGENCY PATIENT CASE
          </Link>
        </div>

        <div className="md:col-span-4 flex items-center gap-3">
          <Link href="/paramedic/vitals" className="pro-card-hover flex-1 p-5 flex items-center justify-between text-left">
            <div>
              <p className="text-xs font-extrabold uppercase text-slate-400">Live Vitals</p>
              <p className="text-lg font-black text-slate-900">Patient Telemetry</p>
            </div>
            <Heart className="h-6 w-6 text-red-600" />
          </Link>
          <Link href="/paramedic/tracking" className="pro-card-hover flex-1 p-5 flex items-center justify-between text-left">
            <div>
              <p className="text-xs font-extrabold uppercase text-slate-400">Routing</p>
              <p className="text-lg font-black text-slate-900">GPS ETA</p>
            </div>
            <MapPin className="h-6 w-6 text-emerald-600" />
          </Link>
        </div>
      </div>

      {/* Main Full Width Grid: Hardware Stream + ECG Realtime Waveform */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Left Column: Live Rhythm Stream (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-600">
              Live Ambulance Defibrillator / Monitor Waveform Stream
            </h2>
            <span className="text-xs font-mono font-bold text-slate-400">250 Hz · Lead II Continuous</span>
          </div>

          <EcgWaveformCanvas heartRate={78} pattern="NORM" height={260} interactive={true} />
        </div>

        {/* Right Column: Hardware Connection & Sensor Modes (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-600">
            ECG Acquisition Options
          </h2>

          <div className="space-y-3">
            <Link href="/paramedic/ecg" className="pro-card-hover p-5 flex items-start gap-4 block">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                <Bluetooth className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900">1. Direct Monitor BLE Stream</p>
                <p className="text-xs text-slate-500 mt-1">
                  Pairs with ZOLL, Philips Intellivue, or Medtronic LifePak monitor via Bluetooth / Wi-Fi.
                </p>
              </div>
            </Link>

            <Link href="/paramedic/ecg" className="pro-card-hover p-5 flex items-start gap-4 block">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex-shrink-0">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900">2. Paper ECG Camera Scan</p>
                <p className="text-xs text-slate-500 mt-1">
                  Takes a high-res photo of printed paper strip for computer vision digitization.
                </p>
              </div>
            </Link>

            <Link href="/paramedic/ecg" className="pro-card-hover p-5 flex items-start gap-4 block">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex-shrink-0">
                <HardDrive className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900">3. Digital File Upload</p>
                <p className="text-xs text-slate-500 mt-1">
                  Uploads raw CSV or JSON signal data exported from monitor memory card.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
