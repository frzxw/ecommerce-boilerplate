'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const token = data.access_token;
      
      const user = await fetchAPI('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      login(token, user);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        {/* Left Side - Image (Hidden on mobile) */}
        <div className="hidden lg:block w-1/2 bg-zinc-100 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-9xl font-bold text-zinc-200 uppercase tracking-tighter opacity-50 select-none">
               Store
             </span>
          </div>
          {/* In production, use a real image here */}
          {/* <Image src="/login-bg.jpg" fill className="object-cover" /> */}
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-white">
          <div className="w-full max-w-md space-y-10">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold tracking-tighter uppercase mb-2">Welcome Back</h2>
              <p className="text-gray-500">
                Please enter your details to sign in.
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email-address" className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">
                    Email
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full border-b border-gray-300 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none transition-colors bg-transparent"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full border-b border-gray-300 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none transition-colors bg-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>

              <div className="text-center text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-bold text-black hover:underline uppercase tracking-wider text-xs">
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
