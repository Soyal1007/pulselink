'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart, LayoutDashboard, Ambulance, BarChart3,
  Settings, Users, AlertTriangle, Menu, X, Building2
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 w-full">
      {/* Desktop Sidebar */}
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

      {/* Mobile Drawer Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs lg:hidden flex">
          <div className="w-72 bg-white h-full flex flex-col p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
                  <Heart className="h-4 w-4 fill-white" />
                </div>
                <span className="font-black text-slate-900">PulseLink ER</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="h-6 w-6 text-slate-600" />
              </button>
            </div>

            <nav className="space-y-1 flex-1">
              {NAV.map(({ href, icon: Icon, label }) => {
                const active = pathname === href || (href !== '/hospital' && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-extrabold transition-all',
                      active ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64 w-full">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-10 shadow-2xs w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-xs font-bold text-slate-500 hidden sm:block">
              Emergency Command & Telemetry Center
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              LIVE TELEMETRY STREAM
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5">
              <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-2xs">
                M
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900">Dr. Meera Pillai</p>
                <p className="text-[10px] font-medium text-slate-500">Chief Triage Officer</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-10 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
