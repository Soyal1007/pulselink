'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Eye, EyeOff, AlertTriangle, ShieldCheck, ArrowRight, UserCheck, Stethoscope, Building2, ShieldAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { DEMO_CREDENTIALS } from '@/lib/demo/data';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) throw authError;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (profile?.role === 'paramedic') router.push('/paramedic');
      else router.push('/hospital');
    } catch (err: unknown) {
      // Direct role-based redirection logic for demo credentials
      const cleanEmail = email.toLowerCase().trim();
      if (cleanEmail.includes('paramedic') || cleanEmail.includes('arjun')) {
        router.push('/paramedic');
      } else {
        // All hospital roles (doctor, hospital admin, super admin) route to hospital command center
        router.push('/hospital');
      }
    } finally {
      setLoading(false);
    }
  }

  function quickDirectLogin(cred: typeof DEMO_CREDENTIALS[0]) {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
    
    // Direct instant routing based on role selected
    if (cred.role.toLowerCase().includes('paramedic')) {
      router.push('/paramedic');
    } else {
      router.push('/hospital');
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 text-slate-900 font-sans">
      {/* Brand Header */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 shadow-xl shadow-red-600/30">
          <Heart className="h-8 w-8 text-white" fill="white" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">PulseLink</h1>
          <p className="text-xs font-extrabold text-slate-500 mt-0.5">Clinical Telemetry & Emergency Command</p>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-black text-slate-900">Sign In to Portal</h2>
        <p className="mt-1 text-xs font-semibold text-slate-500">Access your role-based EMS or Hospital dashboard.</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              placeholder="you@hospital.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 placeholder-slate-400 pr-10 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-black text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Quick Portal Direct Access</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {DEMO_CREDENTIALS.map((c) => (
            <button
              key={c.role}
              onClick={() => quickDirectLogin(c)}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:border-blue-500 hover:bg-blue-50/50 transition group"
            >
              <div className="flex justify-between items-center">
                <p className="text-xs font-black text-blue-600 group-hover:text-blue-700">{c.role}</p>
                <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{c.name}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 pt-4 border-t border-slate-200">
          <Link
            href="/paramedic"
            className="rounded-xl bg-slate-100 py-2.5 text-center text-xs font-extrabold text-slate-700 hover:bg-slate-200 transition"
          >
            Paramedic App →
          </Link>
          <Link
            href="/hospital"
            className="rounded-xl bg-slate-100 py-2.5 text-center text-xs font-extrabold text-slate-700 hover:bg-slate-200 transition"
          >
            Hospital Board →
          </Link>
        </div>
      </div>

      <Link href="/" className="mt-6 text-xs font-extrabold text-slate-500 hover:text-slate-900 transition">
        ← Back to Home Page
      </Link>
    </div>
  );
}
