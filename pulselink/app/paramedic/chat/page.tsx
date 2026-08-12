'use client';
import { useState } from 'react';
import ClinicalSmartChat from '@/components/ClinicalSmartChat';

export default function ParamedicChatPage() {
  return (
    <div className="w-full space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Paramedic ↔ ER Doctor Live Smart Chat</h1>
        <p className="text-sm font-semibold text-slate-600 mt-1">
          Direct emergency telemetry line for transmitting images, receiving clinical directives, and consulting Hugging Face AI.
        </p>
      </div>

      <ClinicalSmartChat
        currentUserRole="paramedic"
        currentUserName="Paramedic Arjun"
        ambulanceUnit="Unit 402"
        hospitalName="City General ER"
      />
    </div>
  );
}
