'use client';
import Link from 'next/link';
import { Radio, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { DEMO_AMBULANCES } from '@/lib/demo/data';
import { cn } from '@/lib/utils';

export default function AmbulanceSelectPage() {
  const { selectedAmbulance, setSelectedAmbulance } = useAppStore();

  return (
    <div className="px-4 pt-4">
      <h1 className="mb-1 text-lg font-bold text-white">Select Ambulance</h1>
      <p className="mb-5 text-xs text-slate-400">Choose the ambulance you are operating today.</p>

      <div className="space-y-3">
        {DEMO_AMBULANCES.map((a) => (
          <button
            key={a.id}
            onClick={() => setSelectedAmbulance(a)}
            className={cn(
              'flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition touch-target',
              selectedAmbulance?.id === a.id
                ? 'border-blue-500 bg-blue-950/30'
                : 'border-[#1f2d3d] bg-[#111827] hover:border-blue-600/40'
            )}
          >
            <div className={cn(
              'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl',
              selectedAmbulance?.id === a.id ? 'bg-blue-600' : 'bg-[#1a2332]'
            )}>
              <Radio className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white">{a.vehicle_number}</p>
              <p className="text-xs text-slate-400">{a.organization}</p>
              <p className={cn('mt-1 text-xs font-semibold',
                a.status === 'available' ? 'text-green-400' : 'text-orange-400'
              )}>
                {a.status.toUpperCase().replace('_', ' ')}
              </p>
            </div>
            {selectedAmbulance?.id === a.id && (
              <span className="text-xs font-semibold text-blue-400">SELECTED</span>
            )}
          </button>
        ))}
      </div>

      {selectedAmbulance && (
        <Link href="/paramedic" className="btn-primary mt-6 w-full py-3">
          Confirm — {selectedAmbulance.vehicle_number}
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
