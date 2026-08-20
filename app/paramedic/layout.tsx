'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Plus, Activity, MapPin, Settings, Wifi, WifiOff,
  Heart, RefreshCw, Bell, Radio, ShieldCheck, MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';

export default function ParamedicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isOnline, setOnline, pendingSyncCount, selectedAmbulance } = useAppStore();

  useEffect(() => {
    const handler = () => setOnline(navigator.onLine);
    window.addEventListener('online', handler);
    window.addEventListener('offline', handler);
    setOnline(navigator.onLine);
    return () => {
      window.removeEventListener('online', handler);
      window.removeEventListener('offline', handler);
    };
  }, [setOnline]);

  const navItems = [
    { href: '/paramedic', icon: Home, label: 'Dashboard' },
    { href: '/paramedic/chat', icon: MessageSquare, label: 'Smart Chat' },
    { href: '/paramedic/vitals', icon: Activity, label: 'Vitals Stream' },
    { href: '/paramedic/ecg', icon: Activity, label: 'ECG Scanner' },
    { href: '/paramedic/tracking', icon: MapPin, label: 'GPS Tracking' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 w-full">
      {/* Top Header — Full Edge to Edge */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3.5 shadow-xs w-full">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs">
            <Heart className="h-5 w-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">PulseLink EMS</span>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200">
                Paramedic Portal
              </span>
            </div>
            {selectedAmbulance && (
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Radio className="h-3 w-3 text-blue-600" /> Unit: {selectedAmbulance.vehicle_number}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {pendingSyncCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-700">
              <RefreshCw className="h-3.5 w-3.5" />
              {pendingSyncCount} Pending Sync
            </div>
          )}
          <div className={cn(
            'flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold border shadow-2xs',
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-red-50 text-red-700 border-red-200'
          )}>
            {isOnline ? <Wifi className="h-3.5 w-3.5 text-emerald-600" /> : <WifiOff className="h-3.5 w-3.5 text-red-600" />}
            {isOnline ? 'NETWORK CONNECTED' : 'OFFLINE MODE'}
          </div>
        </div>
      </header>

      {/* Main Content Area — Full Edge to Edge Container */}
      <main className="flex-1 pb-24 pt-4 px-6 md:px-10 lg:px-12 w-full">
        {children}
      </main>

      {/* Bottom Nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-lg w-full">
        <div className="grid grid-cols-5 max-w-7xl mx-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/paramedic' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-1 py-3 text-xs font-bold transition-all',
                  active ? 'text-blue-600 bg-blue-50/60' : 'text-slate-500 hover:text-slate-800'
                )}
              >
                <Icon className={cn('h-5 w-5', active ? 'text-blue-600 scale-110' : 'text-slate-400')} />
                <span className="text-[11px]">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
