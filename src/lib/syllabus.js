import { formatDuration } from '../config/site';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Opens a print-ready syllabus in a new tab; the browser's "Save as PDF" produces the download.
export function downloadSyllabus(course) {
  const sections = course.sections || [];
  const rows = sections.map((sec, i) => `
    <section>
      <h2><span>${esc(sec.weekNumber ? `Week ${sec.weekNumber}` : `Module ${i + 1}`)}</span>${esc(String(sec.title || '').replace(/^Week\s*\d+\s*:\s*/i, ''))}</h2>
      <ul>${(sec.items || []).map((it) => `<li>${esc(it.title)}${it.duration ? ` <em>${esc(it.duration)}</em>` : ''}</li>`).join('')}</ul>
    </section>`).join('');

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(course.title)} — Syllabus | CareerCore Edutech</title>
<style>
  body{font-family:Inter,system-ui,Arial,sans-serif;color:#0f172a;max-width:760px;margin:40px auto;padding:0 24px;line-height:1.55}
  header{border-bottom:4px solid #1A9C9B;padding-bottom:16px;margin-bottom:24px}
  .brand{color:#1A9C9B;font-weight:800;letter-spacing:.12em;text-transform:uppercase;font-size:11px}
  h1{color:#0A317B;margin:6px 0 8px;font-size:28px}
  .meta{display:flex;gap:18px;color:#475569;font-size:13px;font-weight:600}
  p.desc{color:#334155}
  h2{font-size:16px;color:#0A317B;margin:22px 0 8px}
  h2 span{display:inline-block;background:#FA9C16;color:#fff;border-radius:6px;padding:2px 8px;font-size:11px;margin-right:10px;vertical-align:2px}
  ul{margin:0;padding-left:20px} li{margin:4px 0;font-size:14px} em{color:#64748b;font-style:normal;font-size:12px}
  footer{margin-top:36px;border-top:1px solid #e2e8f0;padding-top:12px;font-size:12px;color:#64748b}
  @media print{body{margin:0 auto}}
</style></head><body>
<header><div class="brand">CareerCore Edutech · Program syllabus</div><h1>${esc(course.title)}</h1>
<div class="meta">${course.duration ? `<span>Duration: ${esc(formatDuration(course.duration))}</span>` : ''}${course.price ? `<span>Fee: ${esc(course.price)}</span>` : ''}${course.category ? `<span>${esc(course.category)}</span>` : ''}</div></header>
${course.description ? `<p class="desc">${esc(course.description)}</p>` : ''}
${rows || '<p>The detailed week-by-week plan is shared by your counselor on request.</p>'}
<footer>Every program includes 1-on-1 mentorship, a production-style capstone and career support. Curriculum is updated regularly with industry input.</footer>
<script>window.onload=function(){setTimeout(function(){window.print()},300)}</script>
</body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (!win) {
    // Popup blocked → fall back to downloading the file
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-syllabus.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
