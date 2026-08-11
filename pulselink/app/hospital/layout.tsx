'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart, Bell, LayoutDashboard, Ambulance, BarChart3,
  Settings, Users, AlertTriangle, ChevronDown, Menu, X, Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/hospital', icon: LayoutDashboard, label: 'Overview & Triage Queue' },
  { href: '/hospital/incoming', icon: Ambulance, label: 'Incoming Fleet' },
  { href: '/hospital/cases', icon: AlertTriangle, label: 'Emergency Cases' },
  { href: '/hospital/analytics', icon: BarChart3, label: 'Clinical Analytics' },
  { href: '/hospital/users', icon: Users, label: 'Staff & Team' },
  { href: '/hospital/settings', icon: Settings, label: 'Settings' },
];

export default function HospitalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 w-full">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white shadow-xs lg:flex z-30">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
            <Heart className="h-5 w-5 fill-white" />
          </div>
          <div>
            <p className="text-base font-extrabold text-slate-900 tracking-tight">PulseLink</p>
            <p className="text-[11px] font-semibold text-slate-500">Hospital Command Portal</p>
          </div>
        </div>

        <div className="p-4 mx-3 my-3 rounded-xl bg-blue-50/80 border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-blue-600" />
            <p className="text-xs font-bold text-slate-900">City General Hospital</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            ER Triage Active (24/7)
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/hospital' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all',
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <Icon className={cn('h-4 w-4', active ? 'text-white' : 'text-slate-400')} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area — Full Edge to Edge */}
      <div className="flex flex-1 flex-col lg:pl-64 w-full">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md lg:px-10 shadow-2xs w-full">
          <div className="text-xs font-bold text-slate-500">
            Emergency Command & Telemetry Center
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              LIVE TELEMETRY STREAM
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5">
              <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-2xs">
                M
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">Dr. Meera Pillai</p>
                <p className="text-[10px] font-medium text-slate-500">Chief Triage Officer</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
