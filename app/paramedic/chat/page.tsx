'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import {
  Heart, Activity, Wind, Thermometer, Brain, Share2,
  User, FileText, Sparkles, CheckCircle2, ShieldCheck, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import EcgWaveformCanvas from '@/components/EcgWaveformCanvas';
import ClinicalSmartChat from '@/components/ClinicalSmartChat';

export default function ParamedicChatPage() {
  const { activeCase, selectedAmbulance } = useAppStore();

  // Determine active case identity
  const activeCaseId = activeCase?.id || 'case-demo-1';
  const caseNumber = activeCase?.case_ref || (activeCase as any)?.case_number || 'PL-20260820-402';

  // Extract patient info with safe fallbacks for type schemas
  const patientName = activeCase?.patient?.name || 'Rajan Mehta';
  const age = activeCase?.patient?.age || 58;
  const gender = activeCase?.patient?.gender || 'Male';
  const bloodGroup = activeCase?.patient?.blood_group || 'B+';
  const chiefComplaint = activeCase?.patient?.chief_complaint || 'Acute substernal chest pain & shortness of breath';

  // Handle various formats for array or string fields
  const allergies = activeCase?.patient?.allergies || 
    (activeCase?.patient as any)?.medical_history?.allergies?.join(', ') || 'Penicillin';
  const medications = activeCase?.patient?.current_medication || 
    (activeCase?.patient as any)?.medical_history?.current_medications?.join(', ') || 'Aspirin, Atorvastatin';
  const preExistingConditions = activeCase?.patient?.existing_conditions || 
    (activeCase?.patient as any)?.medical_history?.pre_existing_conditions?.join(', ') || 'Hypertension, Type 2 Diabetes';

  // Live vitals simulation state
  const [vitals, setVitals] = useState({
    heart_rate: 94,
    spo2: 95.0,
    systolic: 144,
    diastolic: 92,
    resp_rate: 20,
    temperature: 37.1,
  });

  // Sync vitals periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals((prev) => ({
        heart_rate: Math.min(130, Math.max(60, prev.heart_rate + Math.floor(Math.random() * 5 - 2))),
        spo2: parseFloat(Math.min(100, Math.max(90, prev.spo2 + (Math.random() * 0.4 - 0.2))).toFixed(1)),
        systolic: Math.min(180, Math.max(100, prev.systolic + Math.floor(Math.random() * 3 - 1))),
        diastolic: Math.min(110, Math.max(60, prev.diastolic + Math.floor(Math.random() * 3 - 1))),
        resp_rate: Math.min(30, Math.max(12, prev.resp_rate + Math.floor(Math.random() * 3 - 1))),
        temperature: parseFloat((37.1 + (Math.random() * 0.2 - 0.1)).toFixed(1)),
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Dispatch custom share event to inject messages directly into the smart chat stream
  const shareToChat = (type: 'text' | 'image' | 'telemetry_alert', content: string, mediaUrl?: string) => {
    const roleSuffix = selectedAmbulance?.vehicle_number || 'Unit 402';
    const message = {
      id: `msg-share-${Date.now()}`,
      case_id: activeCaseId,
      sender_name: `Paramedic Arjun (${roleSuffix})`,
      sender_role: 'paramedic',
      message_type: type,
      content: content,
      media_url: mediaUrl,
      is_urgent: true,
      created_at: new Date().toISOString()
    };
    
    // Fire event to be picked up by ClinicalSmartChat
    window.dispatchEvent(new CustomEvent('pulselink_share_message', { detail: message }));
  };

  const handleShareVitals = () => {
    const content = `🚨 **SHARED VITAL SIGNS TELEMETRY**
• **Heart Rate:** ${vitals.heart_rate} bpm
• **Oxygen Saturation (SpO2):** ${vitals.spo2}%
• **Blood Pressure (NIBP):** ${vitals.systolic}/${vitals.diastolic} mmHg
• **Respiratory Rate:** ${vitals.resp_rate} breaths/min
• **Body Temperature:** ${vitals.temperature} °C
• **Consciousness:** ALERT`;
    shareToChat('telemetry_alert', content);
  };

  const handleShareECG = () => {
    const content = `📈 **SHARED CONTINUOUS ECG WAVEFORM**
• **Rhythm Status:** Lead II Continuous Stream
• **Acquisition Rate:** 250 Hz (ZOLL Telemetry)
• **Current Rate:** ${vitals.heart_rate} bpm
• **Suspended Patterns:** ST-Elevation Suspected`;
    shareToChat('image', content, '/demo_ecg_lead_ii.png');
  };

  const handleShareDossier = () => {
    const content = `📋 **SHARED PATIENT CLINICAL SUMMARY**
• **Patient Name:** ${patientName} (${age} y/o, ${gender})
• **Blood Group:** ${bloodGroup}
• **Chief Complaint:** ${chiefComplaint}
• **Pre-Existing Conditions:** ${preExistingConditions}
• **Active Medications:** ${medications}
• **Known Allergies:** ${allergies}`;
    shareToChat('text', content);
  };

  return (
    <div className="w-full space-y-6">
      {/* Page Title Bar */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Paramedic Tele-Consultation Hub</h1>
        <p className="text-sm font-semibold text-slate-600 mt-1">
          Unified command center containing live patient telemetry, medical reports, and secure communication channels.
        </p>
      </div>

      {/* Grid Layout: Left (Medical Telemetry & Quick Share) | Right (Clinical Smart Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        
        {/* LEFT COLUMN: Medical Report & Telemetry Dashboard (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Patient Clinical Dossier */}
          <div className="pro-card p-5 space-y-4 border-l-4 border-l-blue-600 bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="flex items-center gap-2 font-black text-slate-900 text-sm tracking-tight uppercase">
                <User className="h-4 w-4 text-blue-600" />
                Patient Dossier
              </h3>
              <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                {caseNumber}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-800">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Name</p>
                <p className="font-extrabold text-slate-900">{patientName}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Demographics</p>
                <p className="font-extrabold text-slate-900">{age} y/o · {gender}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Blood Group</p>
                <p className="font-extrabold text-slate-900">{bloodGroup}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Allergies</p>
                <p className="font-extrabold text-red-600">{allergies}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] uppercase font-bold text-slate-400">Chief Complaint</p>
                <p className="font-semibold text-slate-900 leading-tight mt-0.5">{chiefComplaint}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] uppercase font-bold text-slate-400">History</p>
                <p className="font-semibold text-slate-700 leading-tight mt-0.5">{preExistingConditions}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] uppercase font-bold text-slate-400">Current Medications</p>
                <p className="font-semibold text-slate-700 leading-tight mt-0.5">{medications}</p>
              </div>
            </div>

            <button
              onClick={handleShareDossier}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200 py-2.5 text-xs font-black text-blue-700 hover:bg-blue-100 transition mt-2 shadow-2xs"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share Summary to Chat
            </button>
          </div>

          {/* Card 2: Live Vital Signs Monitor */}
          <div className="pro-card p-5 space-y-4 border-l-4 border-l-emerald-600 bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="flex items-center gap-2 font-black text-slate-900 text-sm tracking-tight uppercase">
                <Activity className="h-4 w-4 text-emerald-600 animate-pulse" />
                Live Vitals Stream
              </h3>
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                LIVE FEED
              </span>
            </div>

            {/* 2x2 grid of vitals */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Heart Rate</span>
                  <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse" />
                </div>
                <p className="text-2xl font-black text-slate-950 mt-1">{vitals.heart_rate} <span className="text-xs font-bold text-slate-500">bpm</span></p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-500">SpO2</span>
                  <Activity className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <p className="text-2xl font-black text-slate-950 mt-1">{vitals.spo2}%</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-500">BP (NIBP)</span>
                  <Activity className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <p className="text-2xl font-black text-slate-950 mt-1">{vitals.systolic}/{vitals.diastolic} <span className="text-[10px] font-bold text-slate-400">mmHg</span></p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Respiration</span>
                  <Wind className="h-3.5 w-3.5 text-purple-500" />
                </div>
                <p className="text-2xl font-black text-slate-950 mt-1">{vitals.resp_rate} <span className="text-xs font-bold text-slate-500">/m</span></p>
              </div>
            </div>

            <button
              onClick={handleShareVitals}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 py-2.5 text-xs font-black text-emerald-700 hover:bg-emerald-100 transition mt-2 shadow-2xs"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share Vitals to Chat
            </button>
          </div>

          {/* Card 3: Continuous Defibrillator ECG Stream */}
          <div className="pro-card p-5 space-y-4 border-l-4 border-l-purple-600 bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="flex items-center gap-2 font-black text-slate-900 text-sm tracking-tight uppercase">
                <Activity className="h-4 w-4 text-purple-600" />
                ECG Waveform Stream
              </h3>
              <span className="text-[10px] font-mono font-bold text-slate-400">Lead II Continuous</span>
            </div>

            <div className="rounded-xl overflow-hidden bg-slate-900 p-1 border border-slate-800">
              <EcgWaveformCanvas heartRate={vitals.heart_rate} pattern="RBBB" height={130} interactive={false} />
            </div>

            <button
              onClick={handleShareECG}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-purple-50 border border-purple-200 py-2.5 text-xs font-black text-purple-700 hover:bg-purple-100 transition mt-2 shadow-2xs"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share ECG Rhythm Strip to Chat
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Clinical Smart Chat (7 columns) */}
        <div className="lg:col-span-7">
          <ClinicalSmartChat
            currentUserRole="paramedic"
            currentUserName="Paramedic Arjun"
            ambulanceUnit={selectedAmbulance?.vehicle_number || "Unit 402"}
            hospitalName="City General ER"
            caseId={activeCaseId}
            patientName={patientName}
            className="h-[735px] shadow-md border border-slate-200"
          />
        </div>

      </div>
    </div>
  );
}
