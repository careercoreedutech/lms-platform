// Build step (Vite plugin): writes per-route HTML files, sitemap.xml and robots.txt into dist/.
//
// Why: Vercel serves real files first, then dist/404.html (status 404) for anything else.
// Giving each known route its own copy of index.html means valid URLs return 200 and
// unknown ones, including made-up course slugs, return a real 404. The app still renders
// either way. A course added after the last deploy shows correctly but returns 404 until
// the next deploy.
import fs from 'fs';
import path from 'path';
import { PAGES } from '../src/content/pages.js';
import { slugify } from '../src/config/site.js';

const DEFAULT_SITE_URL = 'https://carrer-core-edutechplatfrom.vercel.app';
const DEFAULT_SUPABASE_URL = 'https://plgzsaxvydceqidiwdup.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_z_5212pzL70-D30Gw0JTsw_Cp1QJT7v';

// Portal routes: the app and its sub-paths. Kept out of the sitemap.
const APP_ROUTES = ['admin', 'mentor', 'teacher', 'portal', 'student'];

async function fetchCourseSlugs(env) {
  const url = env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;
  try {
    const res = await fetch(`${url}/rest/v1/courses?select=id,title`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    return [...new Set(rows.filter((r) => r.title).map((r) => slugify(r.title)))];
  } catch (e) {
    console.warn(`[static-routes] Could not load courses (${e.message}); course pages will return 404 status until the next successful build.`);
    return [];
  }
}

export default function staticRoutes() {
  let env = {};
  return {
    name: 'static-routes',
    apply: 'build',
    configResolved(config) {
      env = { ...process.env, ...config.env };
    },
    async closeBundle() {
      const out = path.resolve(process.cwd(), 'dist');
      const indexFile = path.join(out, 'index.html');
      if (!fs.existsSync(indexFile)) return;
      const html = fs.readFileSync(indexFile);

      const writeRoute = (route) => {
        const dir = path.join(out, route);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), html);
      };

      const pageSlugs = Object.keys(PAGES);
      const courseSlugs = await fetchCourseSlugs(env);

      [...pageSlugs, ...APP_ROUTES].forEach(writeRoute);
      courseSlugs.forEach((slug) => writeRoute(`courses/${slug}`));

      const siteUrl = (
        env.VITE_SITE_URL ||
        (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : DEFAULT_SITE_URL)
      ).replace(/\/+$/, '');
      const today = new Date().toISOString().slice(0, 10);
      const urls = ['/', ...pageSlugs.map((s) => `/${s}`), ...courseSlugs.map((s) => `/courses/${s}`)];
      const sitemap =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        urls.map((u) => `  <url><loc>${siteUrl}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
        '\n</urlset>\n';
      fs.writeFileSync(path.join(out, 'sitemap.xml'), sitemap);

      const robots = [
        'User-agent: *',
        'Allow: /',
        ...APP_ROUTES.map((r) => `Disallow: /${r}`),
        '',
        `Sitemap: ${siteUrl}/sitemap.xml`,
        '',
      ].join('\n');
      fs.writeFileSync(path.join(out, 'robots.txt'), robots);

      console.log(`[static-routes] ${pageSlugs.length} pages, ${courseSlugs.length} courses, sitemap.xml and robots.txt written.`);
    },
  };
}
