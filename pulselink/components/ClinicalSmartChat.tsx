'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Send, Image as ImageIcon, ShieldAlert, Sparkles, User, UserCheck, Ambulance,
  CheckCheck, Paperclip, AlertCircle, PhoneCall, Bot, Zap, RefreshCw, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CaseChatMessage, MessageType } from '@/types';

interface ClinicalSmartChatProps {
  caseId?: string;
  patientName?: string;
  currentUserRole: 'paramedic' | 'doctor' | 'hospital_admin';
  currentUserName: string;
  hospitalName?: string;
  ambulanceUnit?: string;
  className?: string;
}

const INITIAL_MESSAGES: CaseChatMessage[] = [
  {
    id: 'msg-1',
    case_id: 'case-demo-1',
    sender_name: 'Paramedic Arjun (Unit 402)',
    sender_role: 'paramedic',
    message_type: 'text',
    content: 'En-route with 58Y male experiencing retrosternal chest pressure radiating to left arm. Vital signs stable but ECG shows ST depressions.',
    is_urgent: true,
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'msg-2',
    case_id: 'case-demo-1',
    sender_name: 'Hugging Face Clinical AI Engine',
    sender_role: 'system',
    message_type: 'ai_summary',
    content: '⚡ Hugging Face Model adzetto/ecg-arrhythmia-classifier output: Detected Right Bundle Branch Block (87.0% conf) and ST-Segment Depression (73.0% conf). High Risk Category.',
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'msg-3',
    case_id: 'case-demo-1',
    sender_name: 'Dr. Meera Pillai (Chief Triage)',
    sender_role: 'doctor',
    message_type: 'text',
    content: 'Copy that Unit 402. Please share a clear high-res photo of the 12-lead ECG printout or ECG monitor screen so I can verify STEMI criteria.',
    created_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    id: 'msg-4',
    case_id: 'case-demo-1',
    sender_name: 'Paramedic Arjun (Unit 402)',
    sender_role: 'paramedic',
    message_type: 'image',
    content: '12-Lead ECG Monitor Capture from ZOLL X-Series:',
    media_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'msg-5',
    case_id: 'case-demo-1',
    sender_name: 'Dr. Meera Pillai (Chief Triage)',
    sender_role: 'doctor',
    message_type: 'text',
    content: 'Confirmed. Cath lab team is activated on standby. Administer Aspirin 325mg chewable and keep Oxygen saturation > 95%. ETA update?',
    is_urgent: true,
    created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
];

export default function ClinicalSmartChat({
  caseId = 'case-demo-1',
  patientName = 'Rajan Mehta (58M)',
  currentUserRole,
  currentUserName,
  hospitalName = 'City General ER',
  ambulanceUnit = 'Unit 402',
  className
}: ClinicalSmartChatProps) {
  const [messages, setMessages] = useState<CaseChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    const newMessage: CaseChatMessage = {
      id: `msg-${Date.now()}`,
      case_id: caseId,
      sender_name: `${currentUserName} (${currentUserRole === 'paramedic' ? ambulanceUnit : hospitalName})`,
      sender_role: currentUserRole,
      message_type: selectedImage ? 'image' : 'text',
      content: inputText || (selectedImage ? 'Attached Clinical Image / Telemetry Capture' : ''),
      media_url: selectedImage || undefined,
      is_urgent: isUrgent,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsUrgent(false);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleTriggerAiConsult() {
    setAiGenerating(true);
    setTimeout(() => {
      const aiResponse: CaseChatMessage = {
        id: `msg-ai-${Date.now()}`,
        case_id: caseId,
        sender_name: 'Hugging Face Clinical Assistant',
        sender_role: 'system',
        message_type: 'ai_summary',
        content: `🤖 Hugging Face Clinical Insights:\n• Patient showing acute coronary syndrome (ACS) symptoms with STEMI/RBBB patterns.\n• Recommended Actions: Sublingual Nitroglycerin (if BP > 100 mmHg), 12-lead baseline telemetry sync every 3 mins.\n• Cardiac Catheterization Lab status: Notification dispatches to ER Triage Team.`,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setAiGenerating(false);
    }, 1500);
  }

  return (
    <div className={cn('flex flex-col h-[620px] rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden', className)}>
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 py-3 text-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-sm">
              {currentUserRole === 'doctor' ? 'DOC' : 'PMD'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">Paramedic ↔ ER Doctor Live Chat</h3>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5">
                ENCRYPTED P2P
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Patient: <span className="font-bold text-slate-200">{patientName}</span> · Case Ref: <span className="font-mono text-slate-300">#CAS-8842</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerAiConsult}
            disabled={aiGenerating}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30 px-3 py-1.5 text-xs font-bold text-blue-200 transition"
          >
            <Sparkles className={cn('h-3.5 w-3.5 text-blue-300', aiGenerating && 'animate-spin')} />
            {aiGenerating ? 'Analyzing...' : 'Ask HF Clinical AI'}
          </button>
        </div>
      </div>

      {/* Message Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isMe = msg.sender_role === currentUserRole || (currentUserRole === 'paramedic' && msg.sender_role === 'paramedic') || (currentUserRole === 'doctor' && msg.sender_role === 'doctor');
          const isSystem = msg.sender_role === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="mx-auto max-w-xl rounded-xl border border-blue-200 bg-blue-50/90 p-3.5 text-xs text-slate-800 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-blue-900 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Bot className="h-4 w-4 text-blue-600" />
                    {msg.sender_name}
                  </span>
                  <span className="text-[10px] text-blue-600">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="whitespace-pre-line leading-relaxed font-medium text-slate-700">{msg.content}</p>
              </div>
            );
          }

          return (
            <div key={msg.id} className={cn('flex flex-col', isMe ? 'items-end' : 'items-start')}>
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-semibold text-slate-500">
                <span>{msg.sender_name}</span>
                <span>•</span>
                <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {msg.is_urgent && (
                  <span className="flex items-center gap-0.5 rounded-full bg-red-100 px-1.5 py-0.2 text-[9px] font-bold text-red-700 border border-red-200">
                    <ShieldAlert className="h-2.5 w-2.5" /> URGENT
                  </span>
                )}
              </div>

              <div
                className={cn(
                  'max-w-md rounded-2xl p-3.5 text-xs shadow-xs space-y-2',
                  isMe
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none',
                  msg.is_urgent && !isMe && 'border-2 border-red-500 bg-red-50/30'
                )}
              >
                {msg.media_url && (
                  <div className="relative group cursor-pointer overflow-hidden rounded-lg border border-black/10">
                    <img
                      src={msg.media_url}
                      alt="Uploaded image"
                      className="max-h-48 w-full object-cover transition group-hover:scale-105"
                      onClick={() => setPreviewModalImg(msg.media_url || null)}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition">
                      Click to Expand ECG Photo
                    </div>
                  </div>
                )}
                {msg.content && <p className="leading-relaxed font-medium">{msg.content}</p>}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Upload Preview Banner */}
      {selectedImage && (
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-100 px-4 py-2 text-xs">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-slate-700">ECG Photo / Clinical Attachment Ready</span>
          </div>
          <button onClick={() => setSelectedImage(null)} className="text-slate-500 hover:text-slate-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Input Box Footer */}
      <form onSubmit={handleSendMessage} className="border-t border-slate-200 bg-white p-3 space-y-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsUrgent(!isUrgent)}
            className={cn(
              'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition border',
              isUrgent
                ? 'bg-red-600 text-white border-red-700 shadow-xs animate-pulse'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            )}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            {isUrgent ? 'URGENT ALERT' : 'Normal'}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
          >
            <ImageIcon className="h-3.5 w-3.5 text-blue-600" />
            Send Image / ECG
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={currentUserRole === 'doctor' ? "Type clinical directive or question..." : "Type telemetry status or medical report..."}
            className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
          />

          <button
            type="submit"
            className="flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-700 transition shadow-sm"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Image Zoom Modal */}
      {previewModalImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewModalImg(null)}>
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 p-2 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-slate-800 p-2 text-white hover:bg-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
            <img src={previewModalImg} alt="Expanded Clinical Photo" className="max-h-[85vh] w-auto object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}
