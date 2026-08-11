'use client';
import { RefreshCw, CheckCircle2, XCircle, Clock, Wifi, WifiOff } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';

export default function SyncPage() {
  const { isOnline, pendingSyncCount, setPendingSyncCount, setOnline } = useAppStore();

  function simulateSync() {
    if (!isOnline || pendingSyncCount === 0) return;
    setTimeout(() => setPendingSyncCount(0), 2000);
  }

  return (
    <div className="px-4 pt-4">
      <h1 className="mb-1 text-lg font-bold text-white">Offline Sync Center</h1>
      <p className="mb-4 text-xs text-slate-400">Manage local data and synchronization status.</p>

      <div className={cn(
        'mb-5 flex items-center gap-3 rounded-2xl border px-5 py-4',
        isOnline ? 'border-green-700 bg-green-950/30' : 'border-red-700 bg-red-950/30'
      )}>
        {isOnline ? <Wifi className="h-6 w-6 text-green-400" /> : <WifiOff className="h-6 w-6 text-red-400" />}
        <div>
          <p className={cn('font-bold', isOnline ? 'text-green-400' : 'text-red-400')}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </p>
          <p className="text-xs text-slate-400">
            {isOnline ? 'Real-time sync active.' : 'Working offline — data queued locally.'}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <SyncItem icon={CheckCircle2} label="Patient Records" count={0} status="synced" />
        <SyncItem icon={CheckCircle2} label="Vitals Data" count={0} status="synced" />
        <SyncItem icon={pendingSyncCount > 0 ? Clock : CheckCircle2} label="ECG Records" count={pendingSyncCount} status={pendingSyncCount > 0 ? 'pending' : 'synced'} />
        <SyncItem icon={CheckCircle2} label="Location Updates" count={0} status="synced" />
        <SyncItem icon={CheckCircle2} label="Case Events" count={0} status="synced" />
      </div>

      {pendingSyncCount > 0 && isOnline && (
        <button onClick={simulateSync} className="btn-primary w-full py-3">
          <RefreshCw className="h-4 w-4" />
          Sync Now ({pendingSyncCount} pending)
        </button>
      )}

      {!isOnline && (
        <div className="rounded-xl border border-yellow-800/50 bg-yellow-950/20 p-4 text-xs text-yellow-300">
          <p className="font-semibold mb-1">Data Safety</p>
          <p>All data entered while offline is stored securely in the browser&apos;s local storage (IndexedDB) and will sync automatically when connectivity is restored. No data is lost during offline periods.</p>
        </div>
      )}
    </div>
  );
}

function SyncItem({ icon: Icon, label, count, status }: {
  icon: React.ElementType; label: string; count: number; status: 'synced' | 'pending' | 'error';
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#1f2d3d] bg-[#111827] px-4 py-3">
      <div className="flex items-center gap-3">
        <Icon className={cn('h-4 w-4', status === 'synced' ? 'text-green-400' : status === 'pending' ? 'text-yellow-400' : 'text-red-400')} />
        <span className="text-sm text-white">{label}</span>
      </div>
      <span className={cn('text-xs font-semibold',
        status === 'synced' ? 'text-green-400' :
        status === 'pending' ? 'text-yellow-400' : 'text-red-400'
      )}>
        {status === 'synced' ? 'SYNCED' : `${count} PENDING`}
      </span>
    </div>
  );
}
