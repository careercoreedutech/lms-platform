# UI refresh + QA fixes (Nov 2026)

All 26 tickets from the tester's sheet (BUG-001 … BUG-033) are fixed — see `CareerCore_bugs_fixed.xlsx` for per-ticket notes.

## One-time setup
1. `npm install` (node_modules were built on Windows; reinstall on each machine).
2. Supabase → SQL Editor → run **`supabase-create-leads-tables.sql`**. It creates `newsletter_subscribers` and `counseling_requests` (insert-only for the public site). Until this runs, newsletter and callback forms show a "couldn't send" error.

## Things to confirm
Edit them in **`src/config/site.js`**:
- `SITE.social.linkedin` — company page slug (currently `careercore-edutech`).
- `SITE.whatsapp` — WhatsApp number used by the "Chat on WhatsApp" buttons.
- `NEXT_BATCH_START` — pin the real batch date; otherwise the countdown targets the first Monday of next month, 10:00 AM IST.
- `MIN_STUDENT_AGE` — 16.

Legal pages (`src/content/pages.js`) are a starting template. Get them reviewed before going live, because the refund window, ISA terms and SLA timelines are business commitments.

## What changed
- **New pages:** course detail pages (`/courses/<slug>`), 17 Resources / Company / Legal pages, a 404 page and a syllabus PDF download.
- **Routing:** `navigate()` added to `LmsContext`. Portal paths now match whole segments only, so `/admin`, `/mentor`, `/portal` and `/student` still work.
- **Real 404 status:** `vercel.json` now lists the known routes, and the build copies `index.html` to `404.html`. `public/_redirects` does the same for Netlify.
- **Shared modal** (`src/components/ui/Modal.jsx`): handles Esc, backdrop click, scroll lock and focus trapping. Login, Registration and the new Counseling popup all use it.
- **Validation** is in `src/lib/validation.js`. Lead capture is in `src/lib/leads.js`.
- **Navbar:** the same links on every screen size. Below 1024px it switches to the hamburger menu. Public Mentor/Admin links are removed.
- **Courses section:** a responsive card grid, with the description and Enroll button always visible.
- **AI bot:** a compact launcher that hides while you scroll down, over the footer, and when a popup or menu is open.

## Design pass 2
- **Headline accent:** a new `Highlight` component (`src/components/ui/Highlight.jsx`) gives a teal→blue gradient with a hand-drawn orange underline. It replaces the muddy teal→orange gradients.
- **Why CareerCore:** the four feature cards are redesigned. They're cleaner, with no gradient top bars, and the credentials card now shows a certificate mock instead of an empty gap.
- **How it works:** rebuilt as a 4-step journey (pick a track → learn live → build a portfolio → get hired). It advances on its own, pauses on hover, and shows a visual for each step.
- **Reviews:** a masonry wall with a featured first review and pill filters.
- **FAQ section (new, `src/components/FaqSection.jsx`):** an accessible accordion. The fee range and next batch date are computed from the live data, and it includes FAQPage structured data for SEO.
- **Hero:** the floating cards now sit outside the dashboard and only show where there's room.

## Design pass 3: premium dark theme + 3D
Based on patterns from leading edtech sites (Scaler, upGrad, Masai): program quick-links in the hero, a big stats strip, program cards with next batch and skills, syllabus downloads and a dark footer.
- **3D hero:** a WebGL scene built with three.js and React Three Fiber (`src/components/three/HeroScene.jsx`). A glossy "career core" sits in a wireframe shell, with orbit rings, satellites, floating shapes and a star field, and it tilts toward the mouse.
  - It loads as a separate chunk after the page renders.
  - It falls back to a CSS orb when WebGL isn't available.
  - It stays still for users with "reduce motion" turned on.
  - It uses fewer stars and no floating shapes on phones.
- **Hero:** dark theme, "Request a callback" CTA, popular-program links, trust row with the next batch date, an animated stats strip and a tools marquee.
- **Navbar:** transparent with light text over the dark hero (white logo: `public/logo-light.png`), frosted white once you scroll.
- **Program cards:** 3D tilt with a light glare on mouse devices, category filters, start date, "You'll master" skills, price with EMI note and a Syllabus download.
- **New "Student dashboard" section:** the interactive dashboard tilts back in 3D and straightens as you scroll to it.
- **Dark footer:** a gradient newsletter panel.
- **AI bot:** the "Ask AI" hint bubble is removed, so the launcher never covers the stats strip.
- **New dependencies:** `three`, `@react-three/fiber`. The hero's Lottie strip is removed, so the main JS bundle drops from 903 KB to 313 KB.
