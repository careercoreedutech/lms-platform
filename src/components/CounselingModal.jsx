import React, { useEffect, useState } from 'react';
import { PhoneCall, Phone, MessageCircle, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { SITE } from '../config/site';
import { validateName, isValidEmail } from '../lib/validation';
import { submitCounselingRequest } from '../lib/leads';
import Modal, { Field, inputClass } from './ui/Modal';

const TIME_SLOTS = ['Morning (9 AM – 12 PM)', 'Afternoon (12 – 4 PM)', 'Evening (4 – 8 PM)', 'Any time'];

const cleanPhone = (raw) => {
  let d = String(raw || '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return d.slice(0, 10);
};

export function ContactShortcuts({ compact = false }) {
  const wa = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hi CareerCore, I would like to know more about your programs.')}`;
  return (
    <div className={`grid grid-cols-2 gap-2 ${compact ? '' : 'mb-5'}`}>
      <a
        href={SITE.phoneHref}
        className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-brand-navy/30 text-brand-navy text-xs font-bold transition-colors"
      >
        <Phone className="w-4 h-4 text-brand-orange" />
        <span>Call {SITE.phoneDisplay}</span>
      </a>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Chat on WhatsApp</span>
      </a>
    </div>
  );
}

export function CounselingForm({ topic, defaultTrack, source = 'website', onDone }) {
  const { courses = [] } = useLms();
  const [form, setForm] = useState({ name: '', phone: '', email: '', track: defaultTrack || '', preferredTime: TIME_SLOTS[3], message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [serverError, setServerError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: k === 'phone' ? cleanPhone(e.target.value) : e.target.value }));

  const validate = () => {
    const errs = {};
    const n = validateName(form.name);
    if (n) errs.name = n;
    if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit mobile number.';
    if (form.email && !isValidEmail(form.email)) errs.email = 'Enter a valid email address.';
    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`counsel-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setStatus('sending');
    setServerError('');
    const res = await submitCounselingRequest({ ...form, topic: topic || 'Free counseling', source });
    if (res.success) {
      setStatus('sent');
    } else {
      setStatus('error');
      setServerError(res.message);
    }
  };

  if (status === 'sent') {
    return (
      <div className="text-center py-6 space-y-4" role="status">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <h4 className="text-lg font-extrabold text-brand-navy">Request received!</h4>
          <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
            Thanks, {form.name.split(' ')[0]}. A CareerCore counselor will call you on <b>+91 {form.phone}</b>
            {form.preferredTime && form.preferredTime !== 'Any time' ? ` (${form.preferredTime.toLowerCase()})` : ''} — usually within one working day.
          </p>
        </div>
        {onDone && (
          <button type="button" onClick={onDone} className="btn-primary w-full justify-center">
            Done
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {status === 'error' && (
        <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
          {serverError}
        </div>
      )}

      <Field label="Full name" required htmlFor="counsel-name" error={errors.name}>
        <input id="counsel-name" className={`${inputClass(errors.name)} px-3.5`} value={form.name} onChange={set('name')}
          placeholder="Your full name" autoComplete="name" aria-invalid={!!errors.name} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Mobile number" required htmlFor="counsel-phone" error={errors.phone}>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-slate-400 pointer-events-none">+91</span>
            <input id="counsel-phone" type="tel" inputMode="numeric" className={`${inputClass(errors.phone)} pl-12 pr-3.5`}
              value={form.phone} onChange={set('phone')} placeholder="10-digit mobile number" autoComplete="tel-national" aria-invalid={!!errors.phone} />
          </div>
        </Field>
        <Field label="Email" htmlFor="counsel-email" error={errors.email} hint="Optional">
          <input id="counsel-email" type="email" className={`${inputClass(errors.email)} px-3.5`} value={form.email} onChange={set('email')}
            placeholder="name@example.com" autoComplete="email" aria-invalid={!!errors.email} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Interested in" htmlFor="counsel-track">
          <select id="counsel-track" className={`${inputClass(false)} px-3 cursor-pointer`} value={form.track} onChange={set('track')}>
            <option value="">Not sure yet — help me choose</option>
            {courses.map((c) => <option key={c.id} value={c.title}>{c.title}</option>)}
          </select>
        </Field>
        <Field label="Best time to call" htmlFor="counsel-time">
          <select id="counsel-time" className={`${inputClass(false)} px-3 cursor-pointer`} value={form.preferredTime} onChange={set('preferredTime')}>
            {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Anything we should know?" htmlFor="counsel-msg" hint="Optional — your background, goals or questions">
        <textarea id="counsel-msg" rows={2} className={`${inputClass(false)} px-3.5 resize-none`} value={form.message} onChange={set('message')}
          placeholder="e.g. Final-year B.Tech student, want to move into AI roles" />
      </Field>

      <button type="submit" disabled={status === 'sending'} className="btn-primary w-full justify-center py-3.5">
        {status === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <PhoneCall className="w-4 h-4" />}
        <span>{status === 'sending' ? 'Sending…' : 'Request a callback'}</span>
        {status !== 'sending' && <ArrowRight className="w-4 h-4" />}
      </button>
      <p className="text-[11px] text-slate-400 text-center">Free, no-obligation call with a career counselor. We never share your number.</p>
    </form>
  );
}

export default function CounselingModal() {
  const { authModal, setAuthModal, counselTopic } = useLms();
  const open = authModal === 'counsel';
  const [formKey, setFormKey] = useState(0);
  useEffect(() => { if (open) setFormKey((k) => k + 1); }, [open]);

  const isReset = counselTopic === 'Password reset';

  return (
    <Modal
      open={open}
      onClose={() => setAuthModal(null)}
      title={isReset ? 'Reset your password' : 'Talk to the enrollment desk'}
      subtitle={isReset
        ? 'Our desk verifies your registered mobile number and resets it for you.'
        : 'Book a free 1-on-1 counseling call, or reach us directly.'}
      icon={<PhoneCall className="w-5 h-5" />}
      maxWidth="max-w-lg"
      labelledBy="counsel-title"
    >
      <ContactShortcuts />
      <div className="flex items-center gap-3 mb-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        <span>or request a callback</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <CounselingForm key={formKey} topic={counselTopic || 'Free counseling'} source="modal" onDone={() => setAuthModal(null)} />
    </Modal>
  );
}
