import { useState } from 'react';
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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[var(--color-surface)]">
      <div className="w-full max-w-md z-10">
        <div className="bg-white border border-[var(--color-border)] p-8 rounded-[6px] shadow-sm transition-all duration-300">
          
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-[var(--color-primary)] rounded-[6px] mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-main)]">
              Transit<span className="text-[var(--color-secondary)]">Ops</span>
            </h1>
            <p className="text-[var(--color-text-muted)] mt-2 text-sm">Smart Transport Operations Platform</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-[6px] mb-6 text-sm flex flex-col gap-1">
              <span>{error}</span>
              {error.includes('FastAPI backend') && (
                <button
                  type="button"
                  onClick={handleDemoMode}
                  className="text-left font-bold underline mt-1 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
                >
                  Enter Demo/Offline Mode (No backend required)
                </button>
              )}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-[6px] mb-6 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[var(--color-border)] rounded-[6px] pl-10 pr-4 py-2.5 text-[var(--color-text-main)] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-[var(--color-border)] rounded-[6px] pl-10 pr-4 py-2.5 text-[var(--color-text-main)] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider mb-2">Assign Role</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <UserPlus className="w-5 h-5" />
                  </span>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-white border border-[var(--color-border)] rounded-[6px] pl-10 pr-4 py-2.5 text-[var(--color-text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200 appearance-none"
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
              className="w-full mt-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium py-2.5 px-4 rounded-[6px] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
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
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium transition-colors"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-widest">Or test quickly</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button
              type="button"
              onClick={handleDemoMode}
              className="w-full bg-white hover:bg-gray-50 border border-[var(--color-border)] text-[var(--color-text-main)] py-2.5 rounded-[6px] font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              Enter Demo / Preview Mode
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
