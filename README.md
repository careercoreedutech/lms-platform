# CareerCore Edutech - Learning Management & Mentorship Platform

A modern, high-performance Learning Management System (LMS) and Course Marketplace built with React, Vite, Tailwind CSS, Supabase, and Framer Motion.

## 🚀 Features

- **Interactive Course Player**: Granular topic progression, multi-block video lessons, and fast streaming.
- **DRM-Protected Video Player**: Closed shadow DOM isolation, floating watermark, keyboard shortcut blocking, and anti-piracy protections.
- **Admin Dashboard**: Course creation & management, day/topic curriculum editor, multi-video block attachments, student feedback metrics, and real-time database synchronization.
- **Student Portal**: Enrolled courses view, progress tracking with dynamic percentage calculation, topic completion checkmarks, and notes.
- **Teacher Panel**: Cohort reviews, grading, and curriculum inspection.
- **Supabase Backend**: Realtime PostgreSQL database, authentication, row-level security, and private storage buckets.
- **Vercel-Ready**: Preconfigured with `vercel.json` for single-page application (SPA) routing, security headers, and asset caching.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS, Framer Motion, Lucide Icons, Lottie React
- **Backend / Database**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel

---

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/careercoreedutech/lms-platform.git
   cd lms-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

4. **Start local dev server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploy to Vercel

### Option 1: Import via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** > **"Project"**.
3. Import the GitHub repository: `careercoreedutech/lms-platform`.
4. Framework Preset: **Vite** (automatically detected).
5. Add the Environment Variables:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key
6. Click **Deploy**.

### Option 2: Deploy with Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 📄 License
Private & Proprietary - CareerCore Edutech
