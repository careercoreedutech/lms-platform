import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, BookOpen, CheckCircle2, Clock, ArrowRight, AlertCircle, Eye, EyeOff, AtSign, GraduationCap } from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { MIN_STUDENT_AGE } from '../config/site';
import { validateName, validateUsername, validateEmail, validatePassword, validateDob } from '../lib/validation';
import Modal, { Field, inputClass } from './ui/Modal';

// Helper to sanitize phone numbers:
// - Disallows '+' symbol and prevents typing or pasting it
// - Strips duplicate country codes (+91 or 91)
// - Strips leading 0 (trunk prefix)
// - Strictly enforces only numbers (0-9) and max 10 digits
const sanitizePhoneNumber = (raw) => {
  if (!raw) return '';
  let str = String(raw).trim();
  // Strip leading +91 or +
  if (str.startsWith('+91')) {
    str = str.slice(3);
  } else if (str.startsWith('+')) {
    str = str.replace(/^\++/, '');
  }
  // Strip non-digit characters
  let digits = str.replace(/\D/g, '');
  // If user pasted 12 digits starting with country code 91 (e.g. 917416777662)
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    // Leading 0 trunk prefix
    digits = digits.slice(1);
  }
  // Strict 10 digits max
  return digits.slice(0, 10);
};

const MONTHS = [
  { value: '01', name: 'January' },
  { value: '02', name: 'February' },
  { value: '03', name: 'March' },
  { value: '04', name: 'April' },
  { value: '05', name: 'May' },
  { value: '06', name: 'June' },
  { value: '07', name: 'July' },
  { value: '08', name: 'August' },
  { value: '09', name: 'September' },
  { value: '10', name: 'October' },
  { value: '11', name: 'November' },
  { value: '12', name: 'December' },
];

const currentYear = new Date().getFullYear();
const maxYear = currentYear - MIN_STUDENT_AGE; // youngest allowed birth year
const minYear = 1950;
const YEARS = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);

const isLeapYear = (y) => {
  const year = parseInt(y, 10);
  if (!year) return false;
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

const getDaysInMonth = (monthVal, yearVal) => {
  if (!monthVal) return 31;
  const m = parseInt(monthVal, 10);
  if ([4, 6, 9, 11].includes(m)) return 30;
  if (m === 2) {
    return isLeapYear(yearVal) ? 29 : 28;
  }
  return 31;
};


const FIELD_ORDER = ['name', 'username', 'email', 'phone', 'dob', 'password'];

const emptyForm = (course) => ({
  name: '',
  username: '',
  email: '',
  phone: '',
  dobMonth: '',
  dobDate: '',
  dobYear: '',
  password: '',
  course,
});

export default function EnrollmentModal() {
  const { authModal, setAuthModal, registerStudent, courses, selectedEnrollCourse } = useLms();
  const open = authModal === 'enroll';
  const defaultCourse = selectedEnrollCourse || courses[0]?.title || 'Full Stack Web Dev';

  const [formData, setFormData] = useState(() => emptyForm(defaultCourse));
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(emptyForm(defaultCourse));
      setErrors({});
      setStatusMessage(null);
      setErrorMsg(null);
      setShowPassword(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEnrollCourse, open]);

  const purePhone = sanitizePhoneNumber(formData.phone);
  const isPhoneValid = purePhone.length === 10 && /^[6-9]/.test(purePhone);

  const validators = {
    name: () => validateName(formData.name),
    username: () => validateUsername(formData.username),
    email: () => validateEmail(formData.email),
    phone: () => {
      if (!purePhone) return 'Please enter your mobile number.';
      if (purePhone.length !== 10) return `Mobile number must be 10 digits (${purePhone.length}/10).`;
      if (!/^[6-9]/.test(purePhone)) return 'Indian mobile numbers start with 6, 7, 8 or 9.';
      return null;
    },
    dob: () => validateDob(formData.dobYear, formData.dobMonth, formData.dobDate),
    password: () => validatePassword(formData.password),
  };

  const validateAll = () => {
    const errs = {};
    FIELD_ORDER.forEach((k) => {
      const msg = validators[k]();
      if (msg) errs[k] = msg;
    });
    return errs;
  };

  // Re-validate a field on blur, and clear its error while the user fixes it
  const blur = (k) => () => {
    if (!formData[k] && k !== 'dob') return;
    setErrors((prev) => ({ ...prev, [k]: validators[k]() || undefined }));
  };
  const update = (patch, key) => {
    setFormData((f) => ({ ...f, ...patch }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // DOB errors show as soon as all three parts are chosen
  useEffect(() => {
    if (formData.dobYear && formData.dobMonth && formData.dobDate) {
      setErrors((prev) => ({ ...prev, dob: validators.dob() || undefined }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.dobYear, formData.dobMonth, formData.dobDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateAll();
    setErrors(errs);
    const firstBad = FIELD_ORDER.find((k) => errs[k]);
    if (firstBad) {
      setErrorMsg(null);
      document.getElementById(`enroll-${firstBad === 'dob' ? 'dob-month' : firstBad}`)?.focus();
      return;
    }

    const monthObj = MONTHS.find((m) => m.value === formData.dobMonth);
    const formattedDob = `${String(formData.dobDate).padStart(2, '0')} ${monthObj?.name || formData.dobMonth} ${formData.dobYear}`;

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await registerStudent({
        ...formData,
        name: formData.name.trim().replace(/\s+/g, ' '),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: purePhone,
        dob: formattedDob,
      });
      if (res && res.success) {
        setStatusMessage(res.message);
      } else {
        setErrorMsg(res?.message || 'Could not complete registration. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const coursesList = Array.from(new Set([...(formData.course ? [formData.course] : []), ...courses.map((c) => c.title)]));
  const dobComplete = formData.dobMonth && formData.dobDate && formData.dobYear;
  const dobLabel = dobComplete
    ? `${String(formData.dobDate).padStart(2, '0')} ${MONTHS.find((m) => m.value === formData.dobMonth)?.name} ${formData.dobYear}`
    : '';
  const selectClass = (bad) => `${inputClass(bad)} px-3 cursor-pointer`;

  return (
    <Modal
      open={open}
      onClose={() => setAuthModal(null)}
      title={statusMessage ? 'Application submitted' : 'Student registration'}
      subtitle={statusMessage ? 'We’ll notify you once your account is approved.' : 'Create your account to enroll in a CareerCore program.'}
      icon={<GraduationCap className="w-5 h-5" />}
      maxWidth="max-w-xl"
      labelledBy="enroll-title"
    >
      {statusMessage ? (
        <div className="text-center space-y-4" role="status">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-brand-orange flex items-center justify-center mx-auto ring-8 ring-amber-50/60">
            <Clock className="w-7 h-7" />
          </div>
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
            {statusMessage}
          </div>
          <dl className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1.5 text-xs text-slate-600">
            {[
              ['Applicant', formData.name],
              ['Date of birth', dobLabel],
              ['Phone / WhatsApp', `+91 ${purePhone}`],
              ['Email', formData.email],
              ['Program', formData.course],
              ['Status', 'Pending admin approval'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt>{k}</dt>
                <dd className={`font-bold text-right ${k === 'Status' ? 'text-brand-orange' : 'text-brand-navy'}`}>{v}</dd>
              </div>
            ))}
          </dl>
          <button type="button" onClick={() => setAuthModal('login')} className="btn-navy w-full justify-center py-3">
            <span>Go to student login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-4">
          {errorMsg && (
            <div role="alert" className="flex gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}

          <Field label="Program" htmlFor="enroll-course">
            <div className="relative">
              <BookOpen className="w-4 h-4 text-brand-teal absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="enroll-course"
                value={formData.course}
                onChange={(e) => update({ course: e.target.value }, 'course')}
                className={`${inputClass(false)} pl-10 pr-3 font-bold text-brand-navy cursor-pointer`}
              >
                {coursesList.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name" required htmlFor="enroll-name" error={errors.name}>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="enroll-name" type="text" name="student_fullname" autoComplete="name"
                  value={formData.name}
                  onChange={(e) => update({ name: e.target.value }, 'name')}
                  onBlur={blur('name')}
                  placeholder="As on your ID"
                  aria-invalid={!!errors.name} aria-describedby={errors.name ? 'enroll-name-error' : undefined}
                  className={`${inputClass(errors.name)} pl-10 pr-3.5`}
                />
              </div>
            </Field>

            <Field label="Username" required htmlFor="enroll-username" error={errors.username}>
              <div className="relative">
                <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="enroll-username" type="text" name="new_student_username" autoComplete="off"
                  value={formData.username}
                  onChange={(e) => update({ username: e.target.value.replace(/\s/g, '') }, 'username')}
                  onBlur={blur('username')}
                  placeholder="e.g. priya_codes"
                  aria-invalid={!!errors.username} aria-describedby={errors.username ? 'enroll-username-error' : undefined}
                  className={`${inputClass(errors.username)} pl-10 pr-3.5`}
                />
              </div>
            </Field>
          </div>

          <Field label="Email address" required htmlFor="enroll-email" error={errors.email}>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="enroll-email" type="email" name="student_email" autoComplete="email"
                value={formData.email}
                onChange={(e) => update({ email: e.target.value }, 'email')}
                onBlur={blur('email')}
                placeholder="name@example.com"
                aria-invalid={!!errors.email} aria-describedby={errors.email ? 'enroll-email-error' : undefined}
                className={`${inputClass(errors.email)} pl-10 pr-3.5`}
              />
            </div>
          </Field>

          <Field
            label="Mobile number"
            required
            htmlFor="enroll-phone"
            error={errors.phone}
            right={formData.phone ? (
              <span className={`text-[11px] font-bold flex items-center gap-1 ${isPhoneValid ? 'text-emerald-600' : 'text-slate-400'}`}>
                {isPhoneValid ? (<><CheckCircle2 className="w-3.5 h-3.5" /> Valid</>) : `${purePhone.length}/10`}
              </span>
            ) : null}
          >
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-slate-400 pointer-events-none">+91</span>
              <input
                id="enroll-phone" type="tel" inputMode="numeric" name="student_phone" autoComplete="tel-national"
                value={formData.phone}
                onChange={(e) => update({ phone: sanitizePhoneNumber(e.target.value) }, 'phone')}
                onKeyDown={(e) => { if (['+', '-', '.', 'e', 'E'].includes(e.key)) e.preventDefault(); }}
                onPaste={(e) => {
                  e.preventDefault();
                  update({ phone: sanitizePhoneNumber(e.clipboardData?.getData('text') || '') }, 'phone');
                }}
                onBlur={blur('phone')}
                placeholder="10-digit mobile number"
                maxLength={10}
                aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'enroll-phone-error' : undefined}
                className={`${inputClass(errors.phone)} pl-12 pr-3.5`}
              />
            </div>
          </Field>

          <Field
            label="Date of birth"
            required
            htmlFor="enroll-dob-month"
            error={errors.dob}
            hint={`You must be at least ${MIN_STUDENT_AGE} years old.`}
            right={dobComplete && !errors.dob ? (
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {dobLabel}
              </span>
            ) : null}
          >
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Date of birth">
              <select
                id="enroll-dob-month" aria-label="Month" value={formData.dobMonth}
                aria-invalid={!!errors.dob}
                onChange={(e) => {
                  const newMonth = e.target.value;
                  const maxDays = getDaysInMonth(newMonth, formData.dobYear);
                  update({ dobMonth: newMonth, dobDate: formData.dobDate && parseInt(formData.dobDate, 10) > maxDays ? String(maxDays) : formData.dobDate }, 'dob');
                }}
                className={selectClass(errors.dob)}
              >
                <option value="" disabled>Month</option>
                {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.name}</option>)}
              </select>
              <select
                aria-label="Day" value={formData.dobDate} aria-invalid={!!errors.dob}
                onChange={(e) => update({ dobDate: e.target.value }, 'dob')}
                className={selectClass(errors.dob)}
              >
                <option value="" disabled>Day</option>
                {Array.from({ length: getDaysInMonth(formData.dobMonth, formData.dobYear) }, (_, i) => (
                  <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
                ))}
              </select>
              <select
                aria-label="Year" value={formData.dobYear} aria-invalid={!!errors.dob}
                onChange={(e) => {
                  const newYear = e.target.value;
                  const maxDays = getDaysInMonth(formData.dobMonth, newYear);
                  update({ dobYear: newYear, dobDate: formData.dobDate && parseInt(formData.dobDate, 10) > maxDays ? String(maxDays) : formData.dobDate }, 'dob');
                }}
                className={selectClass(errors.dob)}
              >
                <option value="" disabled>Year</option>
                {YEARS.map((y) => <option key={y} value={String(y)}>{y}</option>)}
              </select>
            </div>
          </Field>

          <Field label="Create password" required htmlFor="enroll-password" error={errors.password} hint="At least 8 characters, with a letter and a number.">
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="enroll-password" type={showPassword ? 'text' : 'password'} name="new_student_password" autoComplete="new-password"
                value={formData.password}
                onChange={(e) => update({ password: e.target.value }, 'password')}
                onBlur={blur('password')}
                placeholder="Create a strong password"
                aria-invalid={!!errors.password} aria-describedby={errors.password ? 'enroll-password-error' : undefined}
                className={`${inputClass(errors.password)} pl-10 pr-11`}
              />
              <button
                type="button" onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-brand-navy hover:bg-slate-100 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </Field>

          <p className="text-[11px] text-slate-400"><span className="text-red-500">*</span> Required fields</p>

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3.5">
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting application…</span>
              </>
            ) : (
              <>
                <span>Submit application</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-500">
            Already registered?{' '}
            <button type="button" onClick={() => setAuthModal('login')} className="text-brand-navy font-bold hover:underline cursor-pointer">
              Student login
            </button>
          </p>
        </form>
      )}
    </Modal>
  );
}
