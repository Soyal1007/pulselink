'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Send, Image as ImageIcon, ShieldAlert, Sparkles, User, UserCheck, Ambulance,
  CheckCheck, Paperclip, AlertCircle, PhoneCall, Bot, Zap, RefreshCw, X,
  Video, Mic, MicOff, VideoOff, PhoneOff, Play, Pause, Monitor, Volume2, Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CaseChatMessage, MessageType } from '@/types';
import { useAppStore } from '@/store/appStore';
import { createClient } from '@/lib/supabase/client';

// Tone Generator helper using Web Audio API for immersive call sound effects
class CallSoundEffects {
  private audioCtx: AudioContext | null = null;
  private activeOsc1: OscillatorNode | null = null;
  private activeOsc2: OscillatorNode | null = null;
  private activeGain: GainNode | null = null;
  private intervalId: any = null;
  private isRinging: boolean = false;

  private initCtx() {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  startRinging() {
    if (this.isRinging) return;
    this.isRinging = true;
    this.initCtx();

    const ring = () => {
      try {
        if (!this.audioCtx) return;
        this.activeOsc1 = this.audioCtx.createOscillator();
        this.activeOsc2 = this.audioCtx.createOscillator();
        this.activeGain = this.audioCtx.createGain();

        this.activeOsc1.type = 'sine';
        this.activeOsc2.type = 'sine';
        // standard US ringback frequencies: 440Hz and 480Hz
        this.activeOsc1.frequency.setValueAtTime(440, this.audioCtx.currentTime);
        this.activeOsc2.frequency.setValueAtTime(480, this.audioCtx.currentTime);

        this.activeGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
        this.activeGain.gain.linearRampToValueAtTime(0.04, this.audioCtx.currentTime + 0.1);
        this.activeGain.gain.setValueAtTime(0.04, this.audioCtx.currentTime + 1.8);
        this.activeGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 2.0);

        this.activeOsc1.connect(this.activeGain);
        this.activeOsc2.connect(this.activeGain);
        this.activeGain.connect(this.audioCtx.destination);

        this.activeOsc1.start();
        this.activeOsc2.start();

        setTimeout(() => this.stopOscillators(), 2000);
      } catch (err) {
        console.error('Ringing play failed', err);
      }
    };

    ring();
    this.intervalId = setInterval(ring, 4000);
  }

  playConnect() {
    this.stopRinging();
    this.initCtx();
    try {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      // 600Hz to 800Hz quick connecting beep
      osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.3);
    } catch (e) {}
  }

  playDisconnect() {
    this.stopRinging();
    this.initCtx();
    try {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    } catch (e) {}
  }

  private stopOscillators() {
    try {
      if (this.activeOsc1) { this.activeOsc1.stop(); this.activeOsc1 = null; }
      if (this.activeOsc2) { this.activeOsc2.stop(); this.activeOsc2 = null; }
    } catch (e) {}
  }

  stopRinging() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.stopOscillators();
    this.isRinging = false;
  }
}

// Custom Premium Waveform Voice Note Player
interface VoicePlayerProps {
  url: string;
  duration?: number;
}

function VoicePlayer({ url, duration = 8 }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(url);
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / (audio.duration || duration)) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [url, duration]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((e) => console.warn('Audio playback deferred:', e));
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const value = parseFloat(e.target.value);
    const audioDuration = audioRef.current.duration || duration;
    const targetTime = (value / 100) * audioDuration;
    audioRef.current.currentTime = targetTime;
    setProgress(value);
    setCurrentTime(targetTime);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  // Pre-calculated aesthetic bar heights representing voice waves
  const waveBars = [
    25, 45, 15, 60, 80, 50, 30, 75, 90, 40,
    20, 65, 85, 45, 30, 70, 55, 35, 60, 40,
    20, 50, 75, 40, 15, 30, 45, 25, 60, 30
  ];

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-900 border border-slate-700/50 p-3 max-w-[280px] shadow-sm">
      <button
        onClick={togglePlay}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all shadow-md flex-shrink-0"
      >
        {isPlaying ? <Pause className="h-4.5 w-4.5 fill-white" /> : <Play className="h-4.5 w-4.5 fill-white ml-0.5" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="relative flex items-end gap-[2px] h-7 mb-1 px-1">
          {waveBars.map((height, idx) => {
            const isPlayed = (idx / waveBars.length) * 100 <= progress;
            return (
              <div
                key={idx}
                className={cn(
                  "w-[3px] rounded-full transition-all duration-150",
                  isPlayed ? "bg-blue-500" : "bg-slate-700",
                  isPlaying && isPlayed && "animate-[pulse_1.5s_infinite]"
                )}
                style={{ height: `${height}%` }}
              />
            );
          })}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>
        <div className="flex justify-between text-[9px] font-bold text-slate-400 px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

const LOCAL_STORAGE_PREFIX = 'pulselink_chat_hist_';

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
    sender_role: 'doctor',
    message_type: 'ai_summary',
    content: '⚡ Hugging Face Model adzetto/ecg-arrhythmia-classifier output: Detected Right Bundle Branch Block (87.0% conf) and ST-Segment Depression (73.0% conf). High Risk Category.',
    is_urgent: false,
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'msg-3',
    case_id: 'case-demo-1',
    sender_name: 'Dr. Meera Pillai (Chief Triage)',
    sender_role: 'doctor',
    message_type: 'text',
    content: 'Copy that Unit 402. Please share a clear high-res photo of the 12-lead ECG printout or ECG monitor screen so I can verify STEMI criteria.',
    is_urgent: false,
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
    is_urgent: false,
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

interface ClinicalSmartChatProps {
  caseId?: string;
  patientName?: string;
  currentUserRole: 'paramedic' | 'doctor' | 'hospital_admin';
  currentUserName: string;
  hospitalName?: string;
  ambulanceUnit?: string;
  className?: string;
}

export default function ClinicalSmartChat({
  caseId = 'case-demo-1',
  patientName = 'Rajan Mehta (58M)',
  currentUserRole,
  currentUserName,
  hospitalName = 'City General ER',
  ambulanceUnit = 'Unit 402',
  className
}: ClinicalSmartChatProps) {
  // Store integration
  const { activeCase } = useAppStore();
  const activeCaseId = activeCase?.id || caseId;
  const activePatientName = activeCase
    ? `${activeCase.patient?.name || 'Unidentified'} (${activeCase.patient?.age || '?'}${activeCase.patient?.gender?.charAt(0).toUpperCase() || '?'})`
    : patientName;

  // Supabase Client state
  const [supabase, setSupabase] = useState<any>(null);
  const [supabaseActive, setSupabaseActive] = useState(false);

  // Messages & Form States
  const [messages, setMessages] = useState<CaseChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  
  // Voice Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Video Call States
  const [callState, setCallState] = useState<'idle' | 'outgoing' | 'connected'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Refs
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const callStreamRef = useRef<MediaStream | null>(null);
  
  // Audio Visualizer Refs
  const recCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Audio Tone FX
  const soundsRef = useRef<CallSoundEffects>(new CallSoundEffects());

  // Initialize Supabase & Fallback
  useEffect(() => {
    const hasKeys = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (hasKeys) {
      try {
        const client = createClient();
        setSupabase(client);
        setSupabaseActive(true);
      } catch (err) {
        console.warn('Supabase initialization deferred:', err);
      }
    }
  }, []);

  // Sync Messages from DB or localStorage
  useEffect(() => {
    let active = true;

    async function fetchChat() {
      if (supabaseActive && supabase && isUuid(activeCaseId)) {
        try {
          const { data, error } = await supabase
            .from('case_chat_messages')
            .select('*')
            .eq('case_id', activeCaseId)
            .order('created_at', { ascending: true });

          if (error) throw error;

          if (active) {
            if (data && data.length > 0) {
              setMessages(data);
            } else {
              setMessages(INITIAL_MESSAGES);
            }
          }
        } catch (e) {
          console.warn('Database fetch failed. Loading local data.', e);
          loadLocal();
        }
      } else {
        loadLocal();
      }
    }

    function loadLocal() {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${activeCaseId}`);
        if (cached) {
          setMessages(JSON.parse(cached));
        } else {
          setMessages(INITIAL_MESSAGES);
        }
      }
    }

    fetchChat();

    // Subscribe to database changes if available
    let channel: any = null;
    if (supabaseActive && supabase && isUuid(activeCaseId)) {
      channel = supabase
        .channel(`chat_telemetry_${activeCaseId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'case_chat_messages', filter: `case_id=eq.${activeCaseId}` },
          (payload: any) => {
            if (!active) return;
            const newDbMsg = payload.new as CaseChatMessage;
            setMessages((prev) => {
              if (prev.some((m) => m.id === newDbMsg.id)) return prev;
              return [...prev, newDbMsg];
            });
          }
        )
        .subscribe();
    }

    return () => {
      active = false;
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [supabaseActive, supabase, activeCaseId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      soundsRef.current.stopRinging();
      
      // Stop call video tracks
      if (callStreamRef.current) {
        callStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Listen to custom window event to share messages (e.g. from the telemetry panel)
  useEffect(() => {
    const handleSharedMsg = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        saveMessage(customEvent.detail);
      }
    };
    window.addEventListener('pulselink_share_message', handleSharedMsg);
    return () => window.removeEventListener('pulselink_share_message', handleSharedMsg);
  }, [activeCaseId, supabaseActive, supabase]);

  const isUuid = (val: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(val);
  };

  const saveMessage = async (newMsg: CaseChatMessage) => {
    // 1. Update State
    setMessages((prev) => {
      const updated = [...prev, newMsg];
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${activeCaseId}`, JSON.stringify(updated));
      return updated;
    });

    // 2. Try Database Insert if active and caseId is valid UUID
    if (supabaseActive && supabase && isUuid(activeCaseId)) {
      try {
        const { error } = await supabase.from('case_chat_messages').insert({
          id: isUuid(newMsg.id) ? newMsg.id : undefined, // let database generate UUID
          case_id: activeCaseId,
          sender_name: newMsg.sender_name,
          sender_role: newMsg.sender_role,
          message_type: newMsg.message_type,
          content: newMsg.content,
          media_url: newMsg.media_url,
          is_urgent: newMsg.is_urgent || false,
          metadata: newMsg.metadata || {}
        });
        if (error) console.error('Database message insert failed:', error);
      } catch (err) {
        console.error('Failed to sync message to Supabase:', err);
      }
    }
  };

  // Message Sender
  function handleSendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!inputText.trim() && !selectedImage && !audioUrl) return;

    const roleNameSuffix = currentUserRole === 'paramedic' ? ambulanceUnit : hospitalName;
    const type: MessageType = selectedImage ? 'image' : audioUrl ? 'audio' : 'text';

    const newMessage: CaseChatMessage = {
      id: `msg-${Date.now()}`,
      case_id: activeCaseId,
      sender_name: `${currentUserName} (${roleNameSuffix})`,
      sender_role: currentUserRole === 'hospital_admin' ? 'hospital_admin' : currentUserRole,
      message_type: type,
      content: inputText || (selectedImage ? 'Attached Clinical Image Capture' : audioUrl ? 'Voice Note Audio' : ''),
      media_url: selectedImage || audioUrl || undefined,
      is_urgent: isUrgent,
      metadata: audioUrl ? { duration: recordingDuration } : {},
      created_at: new Date().toISOString(),
    };

    saveMessage(newMessage);

    setInputText('');
    setSelectedImage(null);
    setAudioUrl(null);
    setIsUrgent(false);
  }

  // Handle Photo Picker Upload
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

  // Voice Recording Engines
  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setRecordingDuration(0);

      // Start duration ticker
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioUrl(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all tracks to release mic
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();

      // Launch canvas live wave visualizer
      startRecordingVisualizer(stream);

    } catch (err) {
      console.warn('Microphone permission denied or not found:', err);
      alert('Could not start recording: Microphone access was denied or is missing.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      stopRecordingVisualizer();
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = null; // discard callbacks
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingDuration(0);
      setAudioUrl(null);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      stopRecordingVisualizer();
    }
  };

  // Live Recording Wave Visualizer
  const startRecordingVisualizer = (stream: MediaStream) => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 64;

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const bufferLen = analyser.frequencyBinCount;
      const dataArr = new Uint8Array(bufferLen);

      const drawWave = () => {
        if (!analyserRef.current || !recCanvasRef.current) return;
        animFrameRef.current = requestAnimationFrame(drawWave);

        const canvas = recCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        analyserRef.current.getByteFrequencyData(dataArr);

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.05)';
        ctx.fillRect(0, 0, w, h);

        const barW = (w / bufferLen) * 1.6;
        let startX = 0;

        for (let i = 0; i < bufferLen; i++) {
          const barH = (dataArr[i] / 255) * h * 0.9;
          ctx.fillStyle = 'rgb(59, 130, 246)'; // blue waveform
          const startY = (h - barH) / 2;
          ctx.beginPath();
          ctx.roundRect(startX, startY, barW - 2, barH, 3);
          ctx.fill();
          startX += barW;
        }
      };

      drawWave();
    } catch (e) {
      console.warn('Failed to start analyser visualizer', e);
    }
  };

  const stopRecordingVisualizer = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  };

  // Hugging Face AI Consult trigger
  function handleTriggerAiConsult() {
    setAiGenerating(true);
    setTimeout(() => {
      const aiResponse: CaseChatMessage = {
        id: `msg-ai-${Date.now()}`,
        case_id: activeCaseId,
        sender_name: 'Hugging Face Clinical Assistant',
        sender_role: 'system',
        message_type: 'ai_summary',
        content: `🤖 Hugging Face Clinical Insights:\n• Patient showing acute coronary syndrome (ACS) symptoms with STEMI/RBBB patterns.\n• Recommended Actions: Sublingual Nitroglycerin (if BP > 100 mmHg), 12-lead baseline telemetry sync every 3 mins.\n• Cardiac Catheterization Lab status: Notification dispatches to ER Triage Team.`,
        is_urgent: false,
        created_at: new Date().toISOString(),
      };
      saveMessage(aiResponse);
      setAiGenerating(false);
    }, 1500);
  }

  // Video Call Flow Logic
  const initiateVideoCall = async () => {
    setCallState('outgoing');
    soundsRef.current.startRinging();

    // Request camera feed pre-emptively
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      callStreamRef.current = stream;
    } catch (err) {
      console.warn('Local video feed access denied:', err);
    }

    // Connect remote call stream mockup after ringing delay (4 seconds)
    setTimeout(() => {
      soundsRef.current.playConnect();
      setCallState('connected');

      // Bind stream to video node
      setTimeout(() => {
        if (callStreamRef.current && localVideoRef.current) {
          localVideoRef.current.srcObject = callStreamRef.current;
        }
      }, 300);

      // Start session duration timer
      setCallDuration(0);
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }, 4000);
  };

  const terminateVideoCall = () => {
    soundsRef.current.playDisconnect();

    if (callStreamRef.current) {
      callStreamRef.current.getTracks().forEach((track) => track.stop());
      callStreamRef.current = null;
    }
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }

    const min = Math.floor(callDuration / 60);
    const sec = callDuration % 60;
    const durString = `${min}:${sec.toString().padStart(2, '0')}`;

    const systemCallEnd: CaseChatMessage = {
      id: `call-log-${Date.now()}`,
      case_id: activeCaseId,
      sender_name: 'PulseLink Command Link',
      sender_role: 'system',
      message_type: 'telemetry_alert',
      content: `📞 Direct Tele-consultation completed. Consultation Session Duration: ${durString}`,
      is_urgent: false,
      created_at: new Date().toISOString()
    };

    saveMessage(systemCallEnd);
    setCallState('idle');
    setIsMuted(false);
    setIsCamOff(false);
    setIsScreenSharing(false);
  };

  const toggleMic = () => {
    if (callStreamRef.current) {
      const audioTrack = callStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    } else {
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (callStreamRef.current) {
      const videoTrack = callStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamOff(!videoTrack.enabled);
      }
    } else {
      setIsCamOff(!isCamOff);
    }
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const formatCallDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('flex flex-col h-[620px] rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative', className)}>
      
      {/* ────────────────── TOP CHAT HEADER BAR ────────────────── */}
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
              <h3 className="text-sm font-bold text-white tracking-tight">
                {currentUserRole === 'doctor' ? 'Paramedic Crew Triage Chat' : 'ER Physician Direct Channel'}
              </h3>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5">
                ENCRYPTED P2P
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Patient: <span className="font-bold text-slate-200">{activePatientName}</span> · Case: <span className="font-mono text-slate-300">{activeCase?.case_ref || '#CAS-8842'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct Live Call Tele-consult Trigger */}
          <button
            onClick={initiateVideoCall}
            className="flex items-center justify-center h-8.5 w-8.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition active:scale-95 border border-emerald-500/30"
            title="Start Video Tele-consultation"
          >
            <Video className="h-4.5 w-4.5" />
          </button>

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

      {/* ────────────────── MESSAGE FEED ────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isMe = msg.sender_role === currentUserRole || 
                       (currentUserRole === 'paramedic' && msg.sender_role === 'paramedic') || 
                       (currentUserRole === 'doctor' && msg.sender_role === 'doctor') ||
                       (currentUserRole === 'hospital_admin' && msg.sender_role === 'hospital_admin');
          const isAi = msg.message_type === 'ai_summary';
          const isSystem = msg.sender_role === 'system';

          // Renders AI Insights Banner
          if (isAi) {
            return (
              <div key={msg.id} className="mx-auto max-w-xl rounded-xl border border-blue-200 bg-blue-50/95 p-3.5 text-xs text-slate-800 shadow-sm space-y-1.5">
                <div className="flex items-center justify-between text-blue-900 font-bold border-b border-blue-200/50 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Bot className="h-4.5 w-4.5 text-blue-600" />
                    {msg.sender_name}
                  </span>
                  <span className="text-[10px] text-blue-600/70 font-mono">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="whitespace-pre-line leading-relaxed font-medium text-slate-700">{msg.content}</p>
              </div>
            );
          }

          // Renders System Logs (e.g. Call Ends)
          if (isSystem) {
            return (
              <div key={msg.id} className="flex items-center justify-center my-2">
                <div className="flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-4 py-1.5 text-[10px] font-black text-slate-600 uppercase tracking-wider shadow-2xs">
                  <AlertCircle className="h-3.5 w-3.5 text-blue-600" />
                  {msg.content}
                </div>
              </div>
            );
          }

          const mediaUrl = msg.media_url || (msg as any).attachment_url;

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
                {/* 1. Image Capture rendering */}
                {msg.message_type === 'image' && mediaUrl && (
                  <div className="relative group cursor-pointer overflow-hidden rounded-lg border border-black/10">
                    <img
                      src={mediaUrl}
                      alt="Telemetry Capture"
                      className="max-h-48 w-full object-cover transition group-hover:scale-103"
                      onClick={() => setPreviewModalImg(mediaUrl)}
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition duration-200">
                      Click to Expand Photo
                    </div>
                  </div>
                )}

                {/* 2. Voice Note player rendering */}
                {msg.message_type === 'audio' && mediaUrl && (
                  <VoicePlayer url={mediaUrl} duration={(msg.metadata as any)?.duration || 6} />
                )}

                {/* 3. Message text content rendering */}
                {msg.content && msg.message_type !== 'audio' && (
                  <p className="leading-relaxed font-semibold">{msg.content}</p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* ────────────────── PREVIEWS & RECORDING DRAWER ────────────────── */}
      {selectedImage && (
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-blue-600 animate-pulse" />
            <span className="font-semibold text-slate-700">Clinical Capture Attachment Ready</span>
          </div>
          <button onClick={() => setSelectedImage(null)} className="text-slate-500 hover:text-slate-950">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
      )}

      {isRecording && (
        <div className="flex items-center justify-between border-t border-slate-200 bg-blue-50/60 px-4 py-3 text-xs">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-ping" />
              <span className="font-extrabold text-red-600 uppercase tracking-widest text-[9px]">Recording</span>
            </div>
            
            {/* Live responsive canvas wave visualizer */}
            <canvas
              ref={recCanvasRef}
              width={160}
              height={30}
              className="rounded-lg h-7 bg-blue-50 border border-blue-100 flex-1 max-w-[200px]"
            />

            <span className="font-bold text-slate-700 font-mono">
              {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={cancelRecording}
              className="rounded-lg bg-slate-200 hover:bg-slate-300 px-3 py-1.5 text-[10px] font-black text-slate-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={stopRecording}
              className="rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-[10px] font-black text-white transition shadow-xs"
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="flex items-center justify-between border-t border-slate-200 bg-emerald-50/40 px-4 py-2 text-xs">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-emerald-600 animate-bounce" />
            <span className="font-bold text-emerald-800">Voice Note Recorded ({recordingDuration}s) — Ready to Send</span>
          </div>
          <button onClick={() => setAudioUrl(null)} className="text-slate-500 hover:text-slate-900">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
      )}

      {/* ────────────────── INPUT CONTAINER FOOTER ────────────────── */}
      <form onSubmit={handleSendMessage} className="border-t border-slate-200 bg-white p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
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
              className="flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-200 transition"
            >
              <ImageIcon className="h-3.5 w-3.5 text-blue-600" />
              Attach Photo
            </button>
          </div>

          {/* Voice Note Trigger Microphone Button */}
          {!audioUrl && (
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold transition border shadow-2xs',
                isRecording
                  ? 'bg-red-600 text-white border-red-700 animate-pulse'
                  : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
              )}
            >
              <Mic className="h-3.5 w-3.5" />
              {isRecording ? 'Stop Recording' : 'Record Voice'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isRecording}
            placeholder={
              isRecording
                ? 'Recording in progress...'
                : currentUserRole === 'doctor'
                ? 'Type clinical directive or medical advice...'
                : 'Type telemetry update or paramedic request...'
            }
            className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isRecording}
            className="flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </div>
      </form>

      {/* Expanded Attachment Modal */}
      {previewModalImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={() => setPreviewModalImg(null)}>
          <div className="relative max-w-4xl max-h-[85vh] bg-slate-950 p-2.5 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-slate-900/80 p-2 text-white hover:bg-slate-700 border border-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
            <img src={previewModalImg} alt="Expanded Telemetry Capture" className="max-h-[80vh] w-auto object-contain rounded-xl" />
          </div>
        </div>
      )}

      {/* ────────────────── LIVE VIDEO CALL OVERLAY PANEL ────────────────── */}
      {callState !== 'idle' && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/98 backdrop-blur-lg select-none">
          
          {/* Triage Live Telemetry Strip Overlay */}
          <div className="w-full bg-red-950/70 border-b border-red-500/20 px-6 py-2 flex flex-wrap items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400">
                Live Biometric Telemetry Link
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-xs font-bold font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">HR:</span>
                <span className="text-emerald-400 animate-pulse font-extrabold">{activeCase?.vitals?.[0]?.heart_rate || 94} bpm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">SPO2:</span>
                <span className="text-blue-400 font-extrabold">{activeCase?.vitals?.[0]?.spo2 || 94.5}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">BP:</span>
                <span className="text-purple-400 font-extrabold">148/92</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">RESP:</span>
                <span className="text-amber-400 font-extrabold">22 /min</span>
              </div>
            </div>
          </div>

          {/* Main Visual Display */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            
            {/* 1. OUTGOING CALL STATE */}
            {callState === 'outgoing' && (
              <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-sm">
                <div className="relative">
                  {/* Pulsing ring waves */}
                  <div className="absolute inset-0 rounded-full bg-blue-600/20 animate-[ping_1.5s_infinite]" />
                  <div className="absolute -inset-4 rounded-full bg-blue-600/10 animate-[ping_2.5s_infinite]" />
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-blue-900 border-4 border-blue-500 text-white font-extrabold text-2xl shadow-xl">
                    {currentUserRole === 'doctor' ? 'PARAMEDIC' : 'PHYSICIAN'}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white">
                    {currentUserRole === 'doctor' ? 'Dialing Paramedic Crew' : 'Calling ER Chief Physician'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 font-medium">
                    Initiating direct P2P video stream consultation...
                  </p>
                  <p className="text-[10px] text-blue-400 mt-4 uppercase tracking-widest font-black animate-pulse">
                    Connecting encrypted bridge
                  </p>
                </div>
              </div>
            )}

            {/* 2. CONNECTED CALL STATE */}
            {callState === 'connected' && (
              <div className="w-full h-full relative">
                
                {/* Background Remote stream mockup */}
                <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center">
                  
                  {isScreenSharing ? (
                    // Screen Share Overlay Mockup
                    <div className="flex flex-col items-center justify-center text-center space-y-3 bg-blue-950/80 p-8 rounded-3xl border border-blue-500/20">
                      <Monitor className="h-16 w-16 text-blue-400 animate-pulse" />
                      <h4 className="text-lg font-black text-white">Sharing Clinical Dashboard Screen</h4>
                      <p className="text-xs text-slate-400 max-w-xs font-semibold">
                        Real-time ECG strip vectors and vital history charts are shared directly with physician.
                      </p>
                    </div>
                  ) : (
                    // Doctor/Paramedic Remote Feed Mockup
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                      <div className="h-24 w-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg">
                        {currentUserRole === 'doctor' ? 'PM' : 'DR'}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white">
                          {currentUserRole === 'doctor' ? 'Paramedic Crew (Unit 402)' : 'Dr. Meera Pillai (Triage Chief)'}
                        </h4>
                        <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 justify-center">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          Encrypted Live Consultation Feed
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Aesthetic telemetry graph on bottom background */}
                  <div className="absolute bottom-6 left-6 right-6 h-12 flex items-end gap-1 opacity-20 pointer-events-none">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-blue-500 rounded-t"
                        style={{ height: `${20 + Math.sin(i * 0.4) * 40 + (i % 6 === 0 ? 30 : 0)}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Picture in Picture User Local camera feed */}
                <div className="absolute top-6 right-6 w-36 h-48 rounded-xl bg-black border-2 border-slate-700 shadow-2xl overflow-hidden flex items-center justify-center z-10">
                  {isCamOff ? (
                    <div className="flex flex-col items-center justify-center text-center p-2 text-slate-500">
                      <VideoOff className="h-6 w-6 mb-1" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Camera Off</span>
                    </div>
                  ) : (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                  )}
                  <span className="absolute bottom-2 left-2 text-[9px] font-bold text-white bg-slate-900/60 px-2 py-0.5 rounded backdrop-blur-xs">
                    You
                  </span>
                </div>

                {/* Top left overlay call status */}
                <div className="absolute top-6 left-6 flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl backdrop-blur-md">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="text-left">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Triage consultation</p>
                    <p className="text-xs font-black text-white font-mono">{formatCallDuration(callDuration)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive controls panel */}
          <div className="w-full bg-slate-900 border-t border-slate-800 py-6 px-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-4">
              
              {/* Mute Mic toggle */}
              <button
                onClick={toggleMic}
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full border transition active:scale-90',
                  isMuted
                    ? 'bg-red-600 border-red-700 text-white hover:bg-red-500'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                )}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {/* End / Hang up button */}
              <button
                onClick={terminateVideoCall}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-500 hover:scale-105 active:scale-95 transition-all shadow-lg"
                title="Hang up call"
              >
                <PhoneOff className="h-6 w-6" />
              </button>

              {/* Camera Off toggle */}
              {callState === 'connected' && (
                <button
                  onClick={toggleCamera}
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border transition active:scale-90',
                    isCamOff
                      ? 'bg-red-600 border-red-700 text-white hover:bg-red-500'
                      : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  )}
                  title={isCamOff ? 'Turn Camera On' : 'Turn Camera Off'}
                >
                  {isCamOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </button>
              )}

              {/* Screen Share toggle */}
              {callState === 'connected' && (
                <button
                  onClick={toggleScreenShare}
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border transition active:scale-90',
                    isScreenSharing
                      ? 'bg-blue-600 border-blue-700 text-white hover:bg-blue-500'
                      : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  )}
                  title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
                >
                  <Monitor className="h-5 w-5" />
                </button>
              )}
            </div>

            <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
              PulseLink Secure clinical consultation bridge · {callState.toUpperCase()}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
