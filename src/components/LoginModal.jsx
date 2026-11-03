import React, { useState, useEffect } from 'react';
import { User, Lock, ArrowRight, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
import { useLms } from '../context/LmsContext';
import Modal, { Field, inputClass } from './ui/Modal';

export default function LoginModal() {
  const { authModal, setAuthModal, loginStudent, openEnrollment, openCounseling } = useLms();
  const open = authModal === 'login';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setUsername('');
      setPassword('');
      setShowPassword(false);
      setErrorMsg(null);
    }
  }, [open]);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg('Please enter your username (or email) and password.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await loginStudent(username.trim(), password);
      if (res && !res.success) setErrorMsg(res.message || 'Invalid credentials.');
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setAuthModal(null)}
      title="Welcome back"
      subtitle="Sign in to your student portal to continue learning."
      icon={<LogIn className="w-5 h-5" />}
      labelledBy="login-title"
    >
      <form onSubmit={handleLogin} noValidate className="space-y-4">
        {errorMsg && (
          <div role="alert" className="flex gap-2 p-3 rounded-xl bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        <Field label="Username or email" required htmlFor="login-username">
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username or email"
              autoComplete="username"
              className={`${inputClass(false)} pl-10 pr-3.5`}
            />
          </div>
        </Field>

        <Field
          label="Password"
          required
          htmlFor="login-password"
          right={
            <button
              type="button"
              onClick={() => openCounseling('Password reset')}
              className="text-[11px] font-bold text-brand-teal hover:text-brand-navy hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          }
        >
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`${inputClass(false)} pl-10 pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-brand-navy hover:bg-slate-100 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>

        <button type="submit" disabled={loading} className="btn-navy w-full justify-center py-3.5">
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-500 pt-1">
          New to CareerCore?{' '}
          <button type="button" onClick={() => openEnrollment()} className="text-brand-orange font-bold hover:underline cursor-pointer">
            Create an account
          </button>
        </p>
      </form>
    </Modal>
  );
}
