'use client';
import { Users, AlertTriangle } from 'lucide-react';

export default function UsersPage() {
  const users = [
    { role: 'Doctor', name: 'Dr. Meera Pillai', email: 'doctor@demo.pulselink', status: 'active' },
    { role: 'Doctor', name: 'Dr. Ravi Shankar', email: 'ravi@demo.pulselink', status: 'active' },
    { role: 'Paramedic', name: 'Arjun Kumar', email: 'paramedic@demo.pulselink', status: 'active' },
    { role: 'Hospital Admin', name: 'Suresh Babu', email: 'admin@demo.pulselink', status: 'active' },
  ];
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Users</h1>
        <div className="demo-banner"><AlertTriangle className="h-3.5 w-3.5" />DEMO DATA</div>
      </div>
      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.email} className="card flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {u.name[0]}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">{u.name}</p>
              <p className="text-xs text-slate-400">{u.email}</p>
            </div>
            <span className="text-xs font-medium text-blue-400">{u.role}</span>
            <span className="h-2 w-2 rounded-full bg-green-400" />
          </div>
        ))}
      </div>
    </div>
  );
}
