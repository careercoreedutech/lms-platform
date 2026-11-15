import React, { useState } from 'react';
import { KeyRound, AlertCircle } from 'lucide-react';
import { useLms } from '../context/LmsContext';
import Modal, { Field, inputClass } from './ui/Modal';
import { validatePassword } from '../lib/validation';

// Shown when an admin set a temporary password, or after opening a reset-password email link.
export default function PasswordChangeModal() {
  const { currentUser, passwordRecovery, changeOwnPassword, logout } = useLms();
  const open = !!currentUser && (currentUser.mustResetPassword || passwordRecovery);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = validatePassword(password);
    if (problem) return setError(problem);
    if (password !== confirm) return setError('The two passwords do not match.');
    setSaving(true);
    setError(null);
    const res = await changeOwnPassword(password);
    setSaving(false);
    if (!res.success) return setError(res.message);
    setPassword('');
    setConfirm('');
  };

  return (
    <Modal
      open={open}
      onClose={logout}
      title="Choose a new password"
      subtitle={passwordRecovery
        ? 'Set a new password for your account.'
        : 'Your password was set by an administrator. Please choose your own to continue.'}
      icon={<KeyRound className="w-5 h-5" />}
      labelledBy="password-change-title"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {error && (
          <div role="alert" className="flex gap-2 p-3 rounded-xl bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        <Field label="New password" required htmlFor="new-password" hint="At least 8 characters.">
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass(false)} px-3.5`}
          />
        </Field>
        <Field label="Confirm new password" required htmlFor="confirm-password">
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={`${inputClass(false)} px-3.5`}
          />
        </Field>
        <button type="submit" disabled={saving} className="btn-navy w-full justify-center py-3.5">
          {saving ? 'Saving…' : 'Save password'}
        </button>
      </form>
    </Modal>
  );
}
