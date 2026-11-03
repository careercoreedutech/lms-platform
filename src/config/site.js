// ─────────────────────────────────────────────────────────────
// Central site configuration — edit contact details, social links
// and batch dates here instead of hunting through components.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: 'CareerCore Edutech',
  legalName: 'CareerCore Edutech Private Limited',
  phoneDisplay: '+91 83418 76728',
  phoneHref: 'tel:+918341876728',
  // WhatsApp number in international format without "+" (used for wa.me links)
  whatsapp: '918341876728',
  social: {
    instagram: 'https://www.instagram.com/careercore_edutech/',
    x: 'https://x.com/CareerCore_Edu',
    facebook: 'https://www.facebook.com/people/CareerCore-Edutech/61594042732296/',
    // REVIEW: confirm this is the exact company page slug on LinkedIn
    linkedin: 'https://www.linkedin.com/company/careercore-edutech/',
  },
};

// Minimum age to register for a program
export const MIN_STUDENT_AGE = 16;

// Fixed batch start date for the countdown. Set an ISO date (with timezone) to pin it,
// e.g. '2026-12-07T10:00:00+05:30'. When null or already past, the countdown
// automatically targets the first Monday of the next month at 10:00 AM IST.
export const NEXT_BATCH_START = null;

const IST_OFFSET_MIN = 330;

function firstMondayAt10IST(year, monthIndex) {
  // Day 1 of the month, find first Monday (in IST calendar terms)
  for (let d = 1; d <= 7; d++) {
    const probe = new Date(Date.UTC(year, monthIndex, d));
    if (probe.getUTCDay() === 1) {
      // 10:00 IST == 04:30 UTC
      return new Date(Date.UTC(year, monthIndex, d, 10, 0) - IST_OFFSET_MIN * 60 * 1000);
    }
  }
  return null;
}

export function getNextBatchStart(now = new Date()) {
  if (NEXT_BATCH_START) {
    const pinned = new Date(NEXT_BATCH_START);
    if (!Number.isNaN(pinned.getTime()) && pinned > now) return pinned;
  }
  let y = now.getUTCFullYear();
  let m = now.getUTCMonth();
  for (let i = 0; i < 3; i++) {
    const candidate = firstMondayAt10IST(y, m);
    if (candidate && candidate > now) return candidate;
    m += 1;
    if (m > 11) { m = 0; y += 1; }
  }
  return new Date(now.getTime() + 30 * 24 * 3600 * 1000);
}

// "12 Wks" / "12 wk" → "12 Weeks"
export function formatDuration(value) {
  if (!value) return '';
  return String(value)
    .replace(/\b(\d+)\s*wks?\b\.?/gi, (_, n) => `${n} ${n === '1' ? 'Week' : 'Weeks'}`)
    .replace(/\bwks?\b\.?/gi, 'Weeks');
}

export function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
