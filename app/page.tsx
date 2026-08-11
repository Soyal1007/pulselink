'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Heart, Zap, MapPin, Clock, Wifi, Building2,
  Activity, Shield, ArrowRight, ChevronRight,
  AlertTriangle, Radio, CheckCircle2, Phone, ShieldCheck, Stethoscope, Sparkles
} from 'lucide-react';
import { DEMO_CREDENTIALS } from '@/lib/demo/data';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white font-sans">
      {/* Top Professional Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 shadow-md shadow-red-900/40">
              <Heart className="h-5 w-5 text-white" fill="white" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">PulseLink</span>
              <span className="ml-2 rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20">
                CLINICAL AI PLATFORM
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-blue-400">Features</a>
            <a href="#how-it-works" className="transition hover:text-blue-400">Workflow</a>
            <a href="#demo" className="transition hover:text-blue-400">Clinical Portals</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-extrabold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              Sign In
            </Link>
            <Link
              href="/paramedic"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-500"
            >
              Launch Paramedic App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
        {/* Subtle Background Grid & Gradients */}
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="pointer-events-none absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute top-2/3 right-1/4 h-[350px] w-[350px] rounded-full bg-red-600/10 blur-[100px]" />

        {/* Clinical Status Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-4 py-2 text-xs font-extrabold text-blue-300 shadow-inner">
          <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
          <span>Hugging Face AI ECG Screening & Real-Time OpenStreetMap Telemetry</span>
        </div>

        {/* Hero Headline */}
        <h1 className="max-w-5xl text-center text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
          Connecting <span className="text-blue-500">Ambulances</span> to <span className="text-red-500">Emergency Rooms</span> Before the Patient Arrives.
        </h1>

        <p className="mt-6 max-w-3xl text-center text-lg font-medium text-slate-300 sm:text-xl leading-relaxed">
          PulseLink delivers live 12-lead ECG screening, real-time vitals telemetry, GPS route navigation, and hospital ER preparedness in one unified medical platform.
        </p>

        {/* Interactive CTA Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/paramedic"
            className="group flex items-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 text-base font-black text-white shadow-xl shadow-blue-600/30 transition hover:bg-blue-500 hover:scale-[1.02]"
          >
            <Radio className="h-5 w-5 text-blue-200" />
            Launch Paramedic Suite
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/hospital"
            className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/90 px-8 py-4 text-base font-black text-slate-100 backdrop-blur-md transition hover:border-slate-500 hover:bg-slate-800"
          >
            <Building2 className="h-5 w-5 text-slate-400" />
            Open Hospital Command Board
          </Link>
        </div>

        {/* Feature Icons Ribbon */}
        <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7 w-full max-w-6xl px-4">
          {[
            { icon: Heart, label: 'Continuous Vitals', color: 'text-red-400', bg: 'border-red-900/40 bg-red-950/20' },
            { icon: Activity, label: 'AI ECG Screening', color: 'text-blue-400', bg: 'border-blue-900/40 bg-blue-950/20' },
            { icon: Zap, label: 'Hugging Face ONNX', color: 'text-yellow-400', bg: 'border-yellow-900/40 bg-yellow-950/20' },
            { icon: MapPin, label: 'Leaflet GPS Maps', color: 'text-emerald-400', bg: 'border-emerald-900/40 bg-emerald-950/20' },
            { icon: Clock, label: 'ETA Countdown', color: 'text-purple-400', bg: 'border-purple-900/40 bg-purple-950/20' },
            { icon: Wifi, label: 'Offline-First Sync', color: 'text-orange-400', bg: 'border-orange-900/40 bg-orange-950/20' },
            { icon: Building2, label: 'ER Readiness', color: 'text-cyan-400', bg: 'border-cyan-900/40 bg-cyan-950/20' },
          ].map(({ icon: Icon, label, color, bg }) => (
            <div key={label} className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition hover:border-slate-500 ${bg}`}>
              <Icon className={`h-6 w-6 ${color}`} />
              <span className="text-xs font-bold text-slate-200">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Hospital Portal & Emergency Workflow Cards */}
      <section id="how-it-works" className="border-t border-slate-800 bg-slate-900/50 py-20 px-6">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Emergency Telemetry Flow</h2>
            <h3 className="text-3xl font-black text-white sm:text-5xl">Designed for Zero Delay in Critical Care</h3>
            <p className="text-sm font-semibold text-slate-400">
              Structured pre-hospital coordination reduces door-to-balloon and door-to-needle times significantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center font-black text-xl border border-red-500/30">
                1
              </div>
              <h4 className="text-xl font-black text-white">Paramedic Telemetry Entry</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paramedics input patient vitals, select ECG morphologies, or upload ECG scans. All data is saved offline locally and streamed when connected.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-xl border border-blue-500/30">
                2
              </div>
              <h4 className="text-xl font-black text-white">AI Diagnostics & Screening</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                FastAPI ONNX engine screens 12-lead rhythm data against Hugging Face arrhythmia classifiers (`adzetto/ecg-arrhythmia-classifier`) for STEMI and RBBB detection.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-black text-xl border border-emerald-500/30">
                3
              </div>
              <h4 className="text-xl font-black text-white">Hospital ER Preparation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Triage doctors review real-time live canvas waveforms, acknowledge inbound telemetry, reserve trauma bays, and assemble cardiac cath lab teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials Quick Switch Section */}
      <section id="demo" className="py-20 px-6 border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-purple-400">Clinical Demo Access</h2>
            <h3 className="text-3xl font-black text-white mt-1">Explore Role-Based Portals</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEMO_CREDENTIALS.map((c) => (
              <div key={c.role} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 text-left space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-blue-400">{c.role}</span>
                  <span className="text-[10px] font-extrabold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">DEMO ROLE</span>
                </div>
                <p className="text-base font-extrabold text-white">{c.name}</p>
                <p className="text-xs font-mono text-slate-400">Email: {c.email}</p>
                <div className="pt-2">
                  <Link
                    href={c.role === 'Paramedic' ? '/paramedic' : '/hospital'}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-400 hover:text-blue-300"
                  >
                    Enter Portal →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-xs font-semibold text-slate-500">
        PulseLink Clinical Decision Support System · Designed for Emergency Medical Services & ER Command Teams
      </footer>
    </main>
  );
}
