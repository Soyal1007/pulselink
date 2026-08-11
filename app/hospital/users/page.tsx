'use client';
import { Users, AlertTriangle } from 'lucide-react';

export default function UsersPage() {
  const users = [
    { role: 'Doctor', name: 'Dr. Meera Pillai', email: 'doctor@demo.pulselink', status: 'Active' },
    { role: 'Doctor', name: 'Dr. Ravi Shankar', email: 'ravi@demo.pulselink', status: 'Active' },
    { role: 'Paramedic', name: 'Arjun Kumar', email: 'paramedic@demo.pulselink', status: 'Active' },
    { role: 'Hospital Admin', name: 'Suresh Babu', email: 'admin@demo.pulselink', status: 'Active' },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Staff & Team</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">Active hospital medical personnel and EMS responders.</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-extrabold text-slate-600">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> DEMO MODE DATA
        </div>
      </div>

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.email} className="rounded-2xl border border-slate-200 bg-white p-5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-2xl bg-blue-600 flex items-center justify-center text-sm font-black text-white shadow-sm">
                {u.name[0]}
              </div>
              <div>
                <p className="text-base font-black text-slate-900">{u.name}</p>
                <p className="text-xs font-semibold text-slate-500">{u.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-black text-blue-700">
                {u.role}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {u.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
