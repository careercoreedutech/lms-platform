import { MIN_STUDENT_AGE } from '../config/site';

// Requires a real domain with a TLD of 2+ letters (rejects "test@test")
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
// Letters (incl. accented), spaces, dots, apostrophes, hyphens
const NAME_RE = /^[\p{L}][\p{L} .'-]*[\p{L}.]$/u;
const USERNAME_RE = /^[A-Za-z0-9_.]{3,20}$/;

export function isValidEmail(value) {
  return EMAIL_RE.test(String(value || '').trim());
}

export function validateName(value) {
  const v = String(value || '').trim().replace(/\s+/g, ' ');
  if (!v) return 'Please enter your full name.';
  if (!NAME_RE.test(v) || (v.match(/\p{L}/gu) || []).length < 2) {
    return 'Enter a valid name (letters only).';
  }
  if (v.length > 60) return 'Name is too long.';
  return null;
}

export function validateUsername(value) {
  const v = String(value || '').trim();
  if (!v) return 'Please choose a username.';
  if (!USERNAME_RE.test(v)) return 'Use 3–20 letters, numbers, dots or underscores.';
  return null;
}

export function validateEmail(value) {
  const v = String(value || '').trim();
  if (!v) return 'Please enter your email address.';
  if (!isValidEmail(v)) return 'Enter a valid email address (e.g. name@example.com).';
  return null;
}

export function validatePassword(value) {
  const v = String(value || '');
  if (!v) return 'Please create a password.';
  if (v.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Use at least one letter and one number.';
  return null;
}

export function getAge(year, month, day, now = new Date()) {
  const y = parseInt(year, 10), m = parseInt(month, 10), d = parseInt(day, 10);
  if (!y || !m || !d) return null;
  let age = now.getFullYear() - y;
  const beforeBirthday = now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d);
  if (beforeBirthday) age -= 1;
  return age;
}

export function validateDob(year, month, day) {
  if (!year || !month || !day) return 'Please select your complete date of birth.';
  const age = getAge(year, month, day);
  if (age === null) return 'Please select a valid date of birth.';
  if (age < MIN_STUDENT_AGE) return `You must be at least ${MIN_STUDENT_AGE} years old to register.`;
  if (age > 100) return 'Please select a valid date of birth.';
  return null;
}
