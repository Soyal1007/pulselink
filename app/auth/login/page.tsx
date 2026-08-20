'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Eye, EyeOff, AlertTriangle, KeyRound, ShieldCheck, UserCheck, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { DEMO_CREDENTIALS } from '@/lib/demo/data';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'access_code' | 'password'>('access_code');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [systemId, setSystemId] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (loginMethod === 'access_code') {
        const found = DEMO_CREDENTIALS.find(
          (c) =>
            c.accessCode.toLowerCase() === accessCode.trim().toLowerCase() ||
            c.systemId.toLowerCase() === systemId.trim().toLowerCase()
        );

        if (found) {
          if (found.role === 'Paramedic') router.push('/paramedic');
          else router.push('/hospital');
          return;
        }

        // Try Supabase verification if configured
        const supabase = createClient();
        const { data: profile, error: dbError } = await supabase
          .from('profiles')
          .select('role')
          .or(`access_code.eq.${accessCode},doctor_license_id.eq.${systemId}`)
          .single();

        if (profile) {
          if (profile.role === 'paramedic') router.push('/paramedic');
          else router.push('/hospital');
          return;
        }

        throw new Error('Invalid Secure Access Code or Registration ID. Please check your credentials.');
      } else {
        const supabase = createClient();
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

        if (authError) throw authError;

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (profile?.role === 'paramedic') router.push('/paramedic');
        else if (profile?.role === 'doctor' || profile?.role === 'hospital_admin') router.push('/hospital');
        else router.push('/paramedic');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      setError(msg);
    } fontally: {
      setLoading(false);
    }
  }

  function fillDemo(cred: typeof DEMO_CREDENTIALS[0]) {
    setEmail(cred.email);
    setPassword(cred.password);
    setAccessCode(cred.accessCode);
    setSystemId(cred.systemId);
    setError('');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#05080f] px-4 py-8">
      {/* Logo Header */}
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-900/50">
          <Heart className="h-7 w-7 text-white" fill="white" />
        </div>
        <h1 className="text-2xl font-black text-white">PulseLink Portal</h1>
        <p className="text-xs font-semibold text-slate-400">Encrypted Clinical Authentication Gateway</p>
      </div>

      {/* Authentication Card */}
      <div className="w-full max-w-md rounded-2xl border border-[#1f2d3d] bg-[#111827] p-6 shadow-2xl space-y-5">
        <div className="flex rounded-xl bg-[#0b0f19] p-1 border border-[#1f2d3d]">
          <button
            onClick={() => setLoginMethod('access_code')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-black rounded-lg transition',
              loginMethod === 'access_code'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <KeyRound className="h-3.5 w-3.5" />
            Unique Security Code
          </button>
          <button
            onClick={() => setLoginMethod('password')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-black rounded-lg transition',
              loginMethod === 'password'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <Lock className="h-3.5 w-3.5" />
            Standard Email/Pass
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-800 bg-red-950/50 px-3.5 py-3 text-xs text-red-400 font-medium">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {loginMethod === 'access_code' ? (
            <>
              <div>
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
                  Unique Secure Login Access Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full rounded-xl border border-[#1f2d3d] bg-[#0d1117] px-4 py-3 text-sm font-mono font-bold text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. DOC-8821-CARD or PARA-4029-EMS"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                  />
                  <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Unique access token assigned to Doctor, Hospital, or Paramedic unit.
                </p>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
                  License / Registration System ID (Optional)
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#1f2d3d] bg-[#0d1117] px-4 py-3 text-sm font-mono font-bold text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. KMC-DOC-7749 or PMD-IND-9023"
                  value={systemId}
                  onChange={(e) => setSystemId(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-[#1f2d3d] bg-[#0d1117] px-4 py-3 text-sm font-bold text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  placeholder="you@pulselink.med"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="w-full rounded-xl border border-[#1f2d3d] bg-[#0d1117] px-4 py-3 text-sm font-bold text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none pr-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-black text-white hover:bg-blue-700 transition shadow-md"
          >
            {loading ? 'Verifying Credentials…' : 'Authenticate & Enter Dashboard'}
          </button>
        </form>

        {/* Demo Credentials Quick Switcher */}
        <div className="pt-3 border-t border-[#1f2d3d] space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Demo Personnel Access Codes & Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_CREDENTIALS.map((c) => (
              <button
                key={c.role}
                onClick={() => fillDemo(c)}
                className="rounded-xl border border-[#1f2d3d] bg-[#0d1117] p-2.5 text-left transition hover:border-blue-500 hover:bg-[#1a2332]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-400">{c.role}</span>
                  <span className="font-mono text-[9px] text-slate-500 font-bold">{c.accessCode}</span>
                </div>
                <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-300">{c.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Link href="/paramedic" className="flex-1 rounded-xl border border-[#1f2d3d] bg-[#0b0f19] py-2 text-center text-xs font-bold text-slate-300 hover:bg-slate-800">
            Paramedic App →
          </Link>
          <Link href="/hospital" className="flex-1 rounded-xl border border-[#1f2d3d] bg-[#0b0f19] py-2 text-center text-xs font-bold text-slate-300 hover:bg-slate-800">
            Hospital Command →
          </Link>
        </div>
      </div>

      <Link href="/" className="mt-6 text-xs font-bold text-slate-500 hover:text-blue-400">
        ← Return to PulseLink Overview Page
      </Link>
    </div>
  );
}
