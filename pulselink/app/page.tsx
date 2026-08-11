import Link from 'next/link';
import {
  Heart, Zap, MapPin, Clock, Wifi, Building2,
  Activity, Shield, ArrowRight, ChevronRight,
  AlertTriangle, Radio
} from 'lucide-react';
import { DEMO_CREDENTIALS } from '@/lib/demo/data';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-white">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-[#1f2d3d]/60 bg-[#05080f]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
              <Heart className="h-4 w-4 text-white" fill="white" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-[#05080f]" />
            </div>
            <span className="text-lg font-bold tracking-tight">PulseLink</span>
          </div>
          <div className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="#how-it-works" className="transition-colors hover:text-white">How It Works</a>
            <a href="#demo" className="transition-colors hover:text-white">Demo</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm px-4 py-2">
              Sign In
            </Link>
            <Link href="/paramedic" className="btn-primary text-sm px-4 py-2">
              Launch Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-20">
        {/* Grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(37,99,235,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow blobs */}
        <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-2/3 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" />

        {/* Live badge */}
        <div className="mb-6 flex items-center gap-2 rounded-full border border-[#1f2d3d] bg-[#111827] px-4 py-1.5 text-xs font-medium text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          Hackathon Prototype — Healthcare Technology Demo
        </div>

        {/* Hero headline */}
        <h1 className="max-w-4xl text-center text-4xl font-black leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
          <span className="text-white">PULSE</span>
          <span className="text-blue-500">LINK</span>
        </h1>
        <p className="mt-4 max-w-2xl text-center text-lg font-medium text-blue-400 md:text-2xl">
          From Ambulance to Emergency Room —<br className="hidden md:block" /> Before the Patient Arrives.
        </p>
        <p className="mt-4 max-w-xl text-center text-sm text-slate-400 md:text-base">
          Real-time patient data, AI-assisted ECG screening, live ambulance tracking
          and hospital preparedness in one connected emergency platform.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/paramedic"
            className="btn-emergency inline-flex items-center gap-3 text-base"
          >
            <Radio className="h-5 w-5" />
            Launch Ambulance Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/hospital"
            className="btn-ghost inline-flex items-center gap-2 text-base px-6 py-4"
          >
            <Building2 className="h-4 w-4" />
            Open Hospital Dashboard
          </Link>
        </div>

        {/* USP Strip */}
        <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
          {[
            { icon: Heart, label: 'Live Vitals', color: 'text-red-400' },
            { icon: Activity, label: 'ECG Screening', color: 'text-blue-400' },
            { icon: Zap, label: 'AI Assistance', color: 'text-yellow-400' },
            { icon: MapPin, label: 'Live Location', color: 'text-green-400' },
            { icon: Clock, label: 'ETA Tracking', color: 'text-purple-400' },
            { icon: Wifi, label: 'Offline Sync', color: 'text-orange-400' },
            { icon: Building2, label: 'Hospital Ready', color: 'text-cyan-400' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex flex-col items-center gap-2 rounded-xl border border-[#1f2d3d] bg-[#111827] px-3 py-4 text-center">
              <Icon className={`h-5 w-5 ${color}`} />
              <span className="text-xs font-medium text-slate-300">{label}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs font-semibold uppercase tracking-widest text-blue-400/70">
          &ldquo;Give the hospital the information it needs before the patient arrives.&rdquo;
        </p>
      </section>

      {/* THE AMBULANCE IS AN EXTENSION OF THE ER */}
      <section className="border-y border-[#1f2d3d] bg-[#0d1117] py-20 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-black uppercase tracking-wide text-white md:text-5xl">
            The Ambulance Is Now an Extension of the <span className="text-red-500">ER</span>
          </h2>
          <p className="mt-4 text-slate-400">
            PulseLink creates a digital bridge between ambulances and hospital emergency departments,
            so hospitals start <strong className="text-white">preparing</strong> while the ambulance is still on the road.
          </p>

          {/* Flow diagram */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {[
              { label: 'AMBULANCE', sub: 'Paramedic + Patient', color: 'border-red-700 bg-red-950/40' },
              { label: 'PATIENT DATA', sub: 'Registration + History', color: 'border-blue-700 bg-blue-950/40' },
              { label: 'VITALS', sub: 'Live Monitoring', color: 'border-purple-700 bg-purple-950/40' },
              { label: 'ECG', sub: 'Digital / Paper', color: 'border-orange-700 bg-orange-950/40' },
              { label: 'AI SCREENING', sub: 'Abnormality Detection', color: 'border-yellow-700 bg-yellow-950/40' },
              { label: 'HOSPITAL', sub: 'Prepare Before Arrival', color: 'border-green-700 bg-green-950/40' },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className={`rounded-xl border px-4 py-3 text-center ${step.color}`}>
                  <p className="text-xs font-bold uppercase tracking-wide text-white">{step.label}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{step.sub}</p>
                </div>
                {i < arr.length - 1 && (
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-slate-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">Platform Features</p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">End-to-End Emergency Platform</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="card-hover group">
                <div className={`mb-4 inline-flex rounded-lg p-2.5 ${f.bg}`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Credentials */}
      <section id="demo" className="border-t border-[#1f2d3d] bg-[#0d1117] py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400">Demo Accounts</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Try PulseLink</h2>
            <p className="mt-2 text-sm text-slate-400">Use any of these demo accounts to explore the platform.</p>
          </div>
          <div className="demo-banner mb-6">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            These are DEMO accounts only. Connect your own Supabase project to use real authentication.
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {DEMO_CREDENTIALS.map((c) => (
              <div key={c.role} className="card rounded-xl">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-400">{c.role}</p>
                <p className="font-medium text-white">{c.name}</p>
                <div className="mt-3 space-y-1 font-mono text-xs text-slate-400">
                  <p><span className="text-slate-600">Email: </span>{c.email}</p>
                  <p><span className="text-slate-600">Password: </span>{c.password}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/paramedic" className="btn-primary px-8 py-3 text-base">
              <Radio className="h-4 w-4" />
              Paramedic View
            </Link>
            <Link href="/hospital" className="btn-ghost px-8 py-3 text-base">
              <Building2 className="h-4 w-4" />
              Hospital Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="border-t border-[#1f2d3d] py-10 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="ai-disclaimer rounded-xl p-4 text-center text-xs">
            <p className="mb-1 font-semibold uppercase tracking-wide">Medical Disclaimer</p>
            <p>
              PulseLink is a prototype clinical decision-support platform for demonstration purposes only.
              AI outputs are <strong>screening results — NOT medical diagnoses</strong>.
              This system does not replace qualified healthcare professionals.
              All AI-generated results require clinical review by a licensed healthcare professional.
              This prototype has not been clinically validated or regulatory approved.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1f2d3d] px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs text-slate-500 md:flex-row">
          <div className="flex items-center gap-2">
            <Heart className="h-3 w-3 text-red-500" fill="currentColor" />
            <span className="font-semibold text-slate-300">PulseLink</span>
            <span>— Hackathon MVP</span>
          </div>
          <p>All patient data shown is synthetic demo data. No real patient information is stored or used.</p>
        </div>
      </footer>
    </main>
  );
}

const FEATURES = [
  {
    icon: Activity,
    title: 'AI-Assisted ECG Screening',
    desc: 'Upload digital ECG data or paper ECG images. AI model screens for arrhythmias and abnormalities. All results labeled as decision-support requiring clinical review.',
    color: 'text-blue-400',
    bg: 'bg-blue-950/50',
  },
  {
    icon: Heart,
    title: 'Live Vital Monitoring',
    desc: 'Real-time vitals: HR, BP, SpO2, respiratory rate, temperature, GCS. Simulated sensor data clearly labeled. Device integration architecture ready.',
    color: 'text-red-400',
    bg: 'bg-red-950/50',
  },
  {
    icon: MapPin,
    title: 'GPS & ETA Tracking',
    desc: 'Live ambulance location and ETA on the hospital dashboard. Hospital knows exactly when the patient arrives before they do.',
    color: 'text-green-400',
    bg: 'bg-green-950/50',
  },
  {
    icon: Wifi,
    title: 'Offline-First Architecture',
    desc: 'Paramedic app works without internet. Patient data, vitals, and ECG metadata stored locally using IndexedDB, then synced automatically.',
    color: 'text-orange-400',
    bg: 'bg-orange-950/50',
  },
  {
    icon: Building2,
    title: 'Hospital Preparedness',
    desc: 'Emergency department receives structured patient data before arrival. Doctors acknowledge, assign teams, and prepare — reducing time-to-treatment.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/50',
  },
  {
    icon: Shield,
    title: 'Role-Based Security',
    desc: 'Separate views for Paramedic, Emergency Doctor, Hospital Admin, and Super Admin. Supabase RLS ensures data isolation per hospital and organization.',
    color: 'text-purple-400',
    bg: 'bg-purple-950/50',
  },
];
