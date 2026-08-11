'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Eye, EyeOff, AlertTriangle } from 'lucide-react';
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

      // Get profile to redirect based on role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (profile?.role === 'paramedic') router.push('/paramedic');
      else if (profile?.role === 'doctor' || profile?.role === 'hospital_admin') router.push('/hospital');
      else router.push('/paramedic'); // default
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      if (msg.includes('Invalid login')) {
        setError('Invalid email or password. Please check your credentials.');
      } else {
        // Allow demo navigation without Supabase
        setError('Supabase not configured. Use the demo buttons below to navigate.');
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#05080f] px-4">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-900/50">
          <Heart className="h-7 w-7 text-white" fill="white" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black text-white">PulseLink</h1>
          <p className="text-xs text-slate-500">Smart Ambulance Platform</p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl border border-[#1f2d3d] bg-[#111827] p-6">
        <h2 className="mb-1 text-lg font-semibold text-white">Sign In</h2>
        <p className="mb-6 text-xs text-slate-400">Access your PulseLink dashboard.</p>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-800 bg-red-950/50 px-3 py-2.5 text-xs text-red-400">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                className="input pr-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#1f2d3d]" />
          <span className="text-xs text-slate-600">or try a demo account</span>
          <div className="h-px flex-1 bg-[#1f2d3d]" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {DEMO_CREDENTIALS.map((c) => (
            <button
              key={c.role}
              onClick={() => fillDemo(c)}
              className="rounded-lg border border-[#1f2d3d] bg-[#0d1117] px-3 py-2 text-left transition hover:border-blue-600/50 hover:bg-[#1a2332]"
            >
              <p className="text-xs font-semibold text-blue-400">{c.role}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{c.name}</p>
            </button>
          ))}
        </div>

        <div className="mt-5 flex gap-2">
          <Link href="/paramedic" className="btn-ghost w-full text-xs py-2">
            Paramedic Demo →
          </Link>
          <Link href="/hospital" className="btn-ghost w-full text-xs py-2">
            Hospital Demo →
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-600">
        Supabase authentication required for full functionality.
        <br />Use demo navigation links above to explore without setup.
      </p>
      <Link href="/" className="mt-3 text-xs text-blue-500 hover:underline">← Back to Home</Link>
    </div>
  );
}
