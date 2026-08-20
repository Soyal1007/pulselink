'use client';
import { useState } from 'react';
import { Users, KeyRound, ShieldCheck, UserCheck, Plus, Copy, Check, Lock, Building2 } from 'lucide-react';
import { DEMO_CREDENTIALS } from '@/lib/demo/data';

export default function UsersPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const staffList = [
    { name: 'Dr. Meera Pillai', role: 'Chief Triage Doctor', email: 'doctor@demo.pulselink', accessCode: 'DOC-8821-CARD', systemId: 'KMC-DOC-7749', dept: 'Cardiology ER', status: 'active' },
    { name: 'Dr. Ravi Shankar', role: 'Emergency Physician', email: 'ravi@demo.pulselink', accessCode: 'DOC-9943-EMRG', systemId: 'KMC-DOC-8102', dept: 'Emergency Dept', status: 'active' },
    { name: 'Arjun Kumar', role: 'Lead Paramedic (Unit 402)', email: 'paramedic@demo.pulselink', accessCode: 'PARA-4029-EMS', systemId: 'PMD-IND-9023', dept: 'Fleet EMS', status: 'active' },
    { name: 'Suresh Babu', role: 'Hospital ER Director', email: 'admin@demo.pulselink', accessCode: 'HOSP-7012-BLR', systemId: 'HOSP-REG-0112', dept: 'Administration', status: 'active' },
  ];

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Staff & Security Access Codes</h1>
          <p className="text-sm font-semibold text-slate-600 mt-1">
            Manage unique login codes and official system IDs for doctors, hospital administration, and paramedic crews.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-700 transition shadow-sm">
          <Plus className="h-4 w-4" />
          Issue New Access Code
        </button>
      </div>

      {/* Hospital System Registration Box */}
      <div className="pro-card p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-600 text-white">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold">City General Hospital — Main ER Command</h2>
            <p className="text-xs text-slate-400 font-mono">Hospital Security ID: HOSP-REG-0112 · Global Node Code: HOSP-7012-BLR</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-black">
          <ShieldCheck className="h-4 w-4" />
          SYSTEM ENCRYPTION ACTIVE
        </div>
      </div>

      {/* Staff List Table */}
      <div className="pro-card p-6 space-y-4 bg-white shadow-xs">
        <h3 className="text-base font-black text-slate-900">Authorized Personnel Registry</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                <th className="pb-3">Staff Member</th>
                <th className="pb-3">Role & Department</th>
                <th className="pb-3">Unique Login Access Code</th>
                <th className="pb-3">Official License / System ID</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.map((s) => (
                <tr key={s.email} className="hover:bg-slate-50 text-slate-900">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-2xs">
                        {s.name[0]}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900">{s.name}</p>
                        <p className="text-[11px] text-slate-500 font-semibold">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="text-slate-900 font-bold">{s.role}</p>
                    <p className="text-[11px] text-slate-500">{s.dept}</p>
                  </td>
                  <td className="py-4">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1 text-blue-900 font-mono font-black text-xs">
                      <KeyRound className="h-3.5 w-3.5 text-blue-600" />
                      {s.accessCode}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="font-mono text-slate-700 font-extrabold bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-xs">
                      {s.systemId}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => copyCode(s.accessCode)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-black text-slate-700 hover:bg-slate-100 transition"
                    >
                      {copiedId === s.accessCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
                      {copiedId === s.accessCode ? 'Copied' : 'Copy Access Code'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
