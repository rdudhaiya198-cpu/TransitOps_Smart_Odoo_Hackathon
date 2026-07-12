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
        // Save to localStorage
        localStorage.setItem('transitops_token', data.access_token);
        localStorage.setItem('transitops_user', JSON.stringify({
          email: data.user.email,
          role: data.user.role || 'Fleet Manager', // Default to Fleet Manager if not returned
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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-slate-900">
      {/* Decorative gradients */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px] opacity-20 animate-pulse delay-1000"></div>

      <div className="w-full max-w-md z-10">
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl transition-all duration-300">
          
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Transit<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Ops</span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm">Smart Transport Operations Platform</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm flex flex-col gap-1">
              <span>{error}</span>
              {error.includes('FastAPI backend') && (
                <button
                  type="button"
                  onClick={handleDemoMode}
                  className="text-left font-bold underline mt-1 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  🚀 Click here to run in Demo/Offline Mode (No Backend required)
                </button>
              )}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl mb-6 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Assign Role</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <UserPlus className="w-5 h-5" />
                  </span>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 appearance-none"
                  >
                    <option value="Fleet Manager" className="bg-slate-800 text-white">Fleet Manager</option>
                    <option value="Driver" className="bg-slate-800 text-white">Driver</option>
                    <option value="Safety Officer" className="bg-slate-800 text-white">Safety Officer</option>
                    <option value="Financial Analyst" className="bg-slate-800 text-white">Financial Analyst</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
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

          <div className="mt-6 flex flex-col gap-3 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-700/60"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase tracking-widest">Or test quickly</span>
              <div className="flex-grow border-t border-slate-700/60"></div>
            </div>

            <button
              type="button"
              onClick={handleDemoMode}
              className="w-full bg-slate-700/40 hover:bg-slate-700/70 border border-slate-600/40 text-slate-300 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              ⚡ Enter Demo / Preview Mode
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
