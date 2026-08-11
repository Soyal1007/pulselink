'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Heart, Activity, MapPin, Clock, Wifi, Building2,
  Zap, ArrowRight, Radio, CheckCircle2, Phone, ShieldCheck, Stethoscope, Sparkles
} from 'lucide-react';
import { DEMO_CREDENTIALS } from '@/lib/demo/data';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden">
      {/* Top Header Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 shadow-md shadow-red-600/30">
              <Heart className="h-5 w-5 text-white" fill="white" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">PulseLink</span>
              <span className="ml-2 rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-black text-blue-700 border border-blue-200">
                CLINICAL EMS PLATFORM
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-xs font-black uppercase tracking-wider text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-blue-600">Key Features</a>
            <a href="#how-it-works" className="transition hover:text-blue-600">Clinical Workflow</a>
            <a href="#demo" className="transition hover:text-blue-600">Portal Direct Access</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/auth/login"
              className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-extrabold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Sign In
            </Link>
            <Link
              href="/paramedic"
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700"
            >
              Paramedic App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 sm:px-6 pt-28 pb-16 text-center">
        {/* Soft Modern Gradients */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/40 blur-[100px]" />
        <div className="pointer-events-none absolute top-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-red-200/30 blur-[90px]" />

        {/* Live Status Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-extrabold text-blue-800 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Real-Time Pre-Hospital Vitals & Emergency Navigation System</span>
        </div>

        {/* Hero Title */}
        <h1 className="max-w-5xl text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Connecting <span className="text-blue-600">Ambulance Crews</span> with <span className="text-red-600">Emergency Rooms</span> in Real Time.
        </h1>

        <p className="mt-6 max-w-3xl text-base font-semibold text-slate-600 sm:text-lg leading-relaxed">
          PulseLink delivers live 12-lead ECG waveforms, continuous vitals telemetry, GPS ETA tracking, and ER triage preparedness in one unified medical platform.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
          <Link
            href="/paramedic"
            className="group flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-blue-600 px-7 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 hover:scale-[1.01]"
          >
            <Radio className="h-5 w-5 text-blue-100" />
            Launch Paramedic Suite
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/hospital"
            className="flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-7 py-4 text-sm font-black text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
          >
            <Building2 className="h-5 w-5 text-slate-500" />
            Open Hospital Command Board
          </Link>
        </div>

        {/* Responsive Features Ribbon */}
        <div id="features" className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 w-full max-w-6xl">
          {[
            { icon: Heart, label: 'Continuous Vitals', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
            { icon: Activity, label: '12-Lead ECG Stream', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
            { icon: MapPin, label: 'GPS Live Routing', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
            { icon: Clock, label: 'Accurate ETA', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
            { icon: Wifi, label: 'Offline Syncing', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
            { icon: Building2, label: 'ER Bay Readiness', color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-200' },
          ].map(({ icon: Icon, label, color, bg }) => (
            <div key={label} className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition hover:shadow-sm ${bg}`}>
              <Icon className={`h-6 w-6 ${color}`} />
              <span className="text-xs font-black text-slate-800">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Workflow Grid */}
      <section id="how-it-works" className="border-t border-slate-200 bg-white py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600">Emergency Telemetry Pipeline</h2>
            <h3 className="text-2xl font-black text-slate-900 sm:text-4xl">Designed for Zero Delay in Critical Care</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                1
              </div>
              <h4 className="text-lg font-black text-slate-900">1. Pre-Hospital Telemetry</h4>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                Paramedics input patient vitals, stream live ECG waveforms, or capture paper strips. Offline data automatically syncs when signal restores.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                2
              </div>
              <h4 className="text-lg font-black text-slate-900">2. Real-Time Telemetry Stream</h4>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                Rhythm data and vital signs are streamed instantly to the receiving emergency hospital command center via secure WebSocket/Supabase channels.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                3
              </div>
              <h4 className="text-lg font-black text-slate-900">3. Hospital ER Standby</h4>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                Emergency physicians review telemetry, prepare resuscitation bays, reserve Cath Labs, and acknowledge ambulance arrival in advance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Quick Access Section */}
      <section id="demo" className="py-16 px-4 sm:px-6 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600">Role Direct Portals</h2>
            <h3 className="text-2xl font-black text-slate-900 sm:text-3xl mt-1">Select a Clinical Role to Explore</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEMO_CREDENTIALS.map((c) => (
              <div key={c.role} className="rounded-2xl border border-slate-200 bg-white p-5 text-left space-y-2 shadow-2xs">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-blue-600">{c.role}</span>
                  <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">
                    CLINICAL ROLE
                  </span>
                </div>
                <p className="text-base font-extrabold text-slate-900">{c.name}</p>
                <p className="text-xs font-medium text-slate-500">Email: {c.email}</p>
                <div className="pt-2">
                  <Link
                    href={c.role.toLowerCase().includes('paramedic') ? '/paramedic' : '/hospital'}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-blue-700"
                  >
                    Enter Portal <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 text-center text-xs font-bold text-slate-500">
        PulseLink Clinical Emergency Platform · Designed for Emergency Medical Services & ER Command Teams
      </footer>
    </main>
  );
}
