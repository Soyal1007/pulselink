'use client';
import { useState } from 'react';
import ClinicalSmartChat from '@/components/ClinicalSmartChat';

export default function HospitalChatPage() {
  return (
    <div className="w-full space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">ER Triage ↔ Ambulance Fleet Live Smart Chat</h1>
        <p className="text-sm font-semibold text-slate-600 mt-1">
          Real-time clinical collaboration channel between Chief Triage Doctor and en-route paramedic crews.
        </p>
      </div>

      <ClinicalSmartChat
        currentUserRole="doctor"
        currentUserName="Dr. Meera Pillai"
        hospitalName="City General Hospital (ER)"
        ambulanceUnit="Unit 402"
      />
    </div>
  );
}
