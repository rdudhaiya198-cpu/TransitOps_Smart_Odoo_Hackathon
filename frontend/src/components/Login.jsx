import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import { Lock, Mail, UserPlus, LogIn, ArrowRight, Shield } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Fleet Manager');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister 
        ? { email, password, role } 
        : { email, password };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong');
      }

      if (isRegister) {
        setSuccess('Registration successful! Please login.');
        setIsRegister(false);
        setPassword('');
      } else {
        localStorage.setItem('transitops_token', data.access_token);
        localStorage.setItem('transitops_user', JSON.stringify({
          email: data.user.email,
          role: data.user.role || 'Fleet Manager',
          id: data.user.id
        }));
        onLoginSuccess(data.access_token, data.user);
      }
    } catch (err) {
      setError(err.message || 'Connection error with FastAPI backend. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = () => {
    const mockUser = {
      email: 'demo@transitops.com',
      role: 'Fleet Manager',
      id: 'demo-uuid-12345'
    };
    localStorage.setItem('transitops_token', 'demo-token');
    localStorage.setItem('transitops_user', JSON.stringify(mockUser));
    onLoginSuccess('demo-token', mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-earth-bg">
      {/* Decorative earthy ambient glows */}
      <div className="absolute top-0 -left-4 w-72 h-72 sm:w-96 sm:h-96 bg-earth-clay/5 rounded-full filter blur-[128px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 -right-4 w-72 h-72 sm:w-96 sm:h-96 bg-earth-sage/5 rounded-full filter blur-[128px] pointer-events-none animate-pulse delay-1000"></div>

      <div className="w-full max-w-md z-10">
        <div className="bg-earth-surface/90 border border-earth-border p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-300">
          
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-earth-clay text-white rounded-2xl mb-4 shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Transit<span className="text-earth-clay">Ops</span>
            </h1>
            <p className="text-earth-muted mt-2 text-xs sm:text-sm font-medium">Smart Transport Operations Platform</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-3 rounded-xl mb-6 text-xs sm:text-sm flex flex-col gap-1">
              <span>{error}</span>
              {error.includes('FastAPI backend') && (
                <button
                  type="button"
                  onClick={handleDemoMode}
                  className="text-left font-bold underline mt-1 text-earth-clay hover:text-earth-clay-hover transition-colors"
                >
                  🚀 Click here to run in Demo/Offline Mode
                </button>
              )}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl mb-6 text-xs sm:text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-earth-muted text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-earth-muted">
                  <Mail className="w-4.5 h-4.5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-earth-bg border border-earth-border rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-earth-text placeholder-earth-muted focus:outline-none focus:ring-2 focus:ring-earth-clay/40 focus:border-earth-clay transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-earth-muted text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-earth-muted">
                  <Lock className="w-4.5 h-4.5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-earth-bg border border-earth-border rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-earth-text placeholder-earth-muted focus:outline-none focus:ring-2 focus:ring-earth-clay/40 focus:border-earth-clay transition-all duration-200"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-earth-muted text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">Assign Role</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-earth-muted">
                    <UserPlus className="w-4.5 h-4.5" />
                  </span>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-earth-bg border border-earth-border rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-earth-text focus:outline-none focus:ring-2 focus:ring-earth-clay/40 focus:border-earth-clay transition-all duration-200 appearance-none"
                  >
                    <option value="Fleet Manager">Fleet Manager</option>
                    <option value="Driver">Driver</option>
                    <option value="Safety Officer">Safety Officer</option>
                    <option value="Financial Analyst">Financial Analyst</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-earth-clay hover:bg-earth-clay-hover text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 text-xs sm:text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isRegister ? (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Sign In <LogIn className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 text-center text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-earth-clay hover:underline font-bold transition-colors"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-earth-border"></div>
              <span className="flex-shrink mx-4 text-earth-muted text-[10px] uppercase tracking-wider font-semibold">Or test quickly</span>
              <div className="flex-grow border-t border-earth-border"></div>
            </div>

            <button
              type="button"
              onClick={handleDemoMode}
              className="w-full bg-earth-bg hover:bg-earth-border/50 border border-earth-border text-earth-text py-2.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-xs"
            >
              ⚡ Enter Demo / Preview Mode
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
