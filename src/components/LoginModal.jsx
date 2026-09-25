import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, ArrowRight, ShieldCheck, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLms } from '../context/LmsContext';

export default function LoginModal() {
  const { authModal, setAuthModal, loginStudent } = useLms();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authModal === 'login') {
      setUsername('');
      setPassword('');
      setErrorMsg(null);
    }
  }, [authModal]);

  if (authModal !== 'login') return null;

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await loginStudent(username, password);
      if (res && !res.success) {
        setErrorMsg(res.message || 'Invalid credentials.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          {/* Top Accent Stripe */}
          <div className="h-2 bg-gradient-to-r from-[#0A317B] via-[#1A9C9B] to-[#FA9C16]" />

          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="CareerCore Logo" className="h-7 w-auto" />
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0A317B]">
                    Student Portal Login
                  </h3>
                  <p className="text-xs text-gray-500">Access your enrolled courses & dashboard</p>
                </div>
              </div>
              <button 
                onClick={() => setAuthModal(null)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogin} className="mt-5 space-y-4">

              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-950 text-xs font-semibold border border-amber-200 leading-relaxed space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                    <Clock className="w-4 h-4 text-[#FA9C16] shrink-0" />
                    <span>Login Notice:</span>
                  </div>
                  <p>{errorMsg}</p>
                </div>
              )}

              {/* Username Input */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter username or email address"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 bg-[#0A317B] hover:bg-[#061e4f]"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    <>
                      <span>Sign In To Student Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2 text-xs text-gray-500">
                Need to register a new course?{' '}
                <button 
                  type="button"
                  onClick={() => setAuthModal('enroll')} 
                  className="text-[#FA9C16] font-bold hover:underline cursor-pointer"
                >
                  Enroll Now
                </button>
              </div>

            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
