'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Eye, EyeOff, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
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
      else if (profile?.role === 'doctor' || profile?.role === 'hospital_admin') router.push('/hospital');
      else router.push('/paramedic');
    } catch (err: unknown) {
      // Fallback demo routing if Supabase auth credentials are not active
      if (email.includes('doctor') || email.includes('hospital')) {
        router.push('/hospital');
      } else {
        router.push('/paramedic');
      }
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(cred: typeof DEMO_CREDENTIALS[0]) {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 font-sans">
      {/* Brand Header */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 shadow-xl shadow-red-900/50">
          <Heart className="h-8 w-8 text-white" fill="white" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black text-white tracking-tight">PulseLink</h1>
          <p className="text-xs font-bold text-slate-400 mt-0.5">Clinical AI Emergency Platform</p>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="text-2xl font-black text-white">Sign In to Dashboard</h2>
        <p className="mt-1 text-xs font-semibold text-slate-400">Choose a portal or sign in with your credentials.</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="you@hospital.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-black text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 transition"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Quick Demo Roles</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {DEMO_CREDENTIALS.map((c) => (
            <button
              key={c.role}
              onClick={() => fillDemo(c)}
              className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-left hover:border-blue-500/50 hover:bg-slate-800/80 transition"
            >
              <p className="text-xs font-black text-blue-400">{c.role}</p>
              <p className="text-xs font-bold text-slate-300 truncate mt-0.5">{c.name}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 pt-4 border-t border-slate-800">
          <Link
            href="/paramedic"
            className="rounded-xl bg-slate-800 py-2.5 text-center text-xs font-black text-white hover:bg-slate-700 transition"
          >
            Paramedic App →
          </Link>
          <Link
            href="/hospital"
            className="rounded-xl bg-slate-800 py-2.5 text-center text-xs font-black text-white hover:bg-slate-700 transition"
          >
            Hospital Board →
          </Link>
        </div>
      </div>

      <Link href="/" className="mt-6 text-xs font-bold text-slate-400 hover:text-white transition">
        ← Back to Landing Page
      </Link>
    </div>
  );
}
