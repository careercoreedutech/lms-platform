// Opens a print-ready certificate of completion in a new tab ("Save as PDF" to download).
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function openCertificate({ studentName, courseTitle, completedOn = new Date() }) {
  const date = completedOn.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Certificate — ${esc(courseTitle)} | CareerCore Edutech</title>
<style>
  @page{size:A4 landscape;margin:0}
  body{margin:0;font-family:Inter,system-ui,Arial,sans-serif;color:#0f172a;background:#f1f5f9}
  .cert{box-sizing:border-box;width:297mm;height:210mm;margin:0 auto;background:#fff;padding:22mm;border:10px solid #0A317B;outline:3px solid #1A9C9B;outline-offset:-22px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
  .brand{color:#1A9C9B;font-weight:800;letter-spacing:.2em;text-transform:uppercase;font-size:13px}
  h1{color:#0A317B;font-size:40px;margin:14px 0 6px}
  .sub{color:#475569;font-size:15px}
  .name{font-size:34px;font-weight:800;color:#0f172a;margin:22px 0 6px;border-bottom:2px solid #FA9C16;padding:0 30px 6px}
  .course{font-size:22px;font-weight:700;color:#0A317B;margin:10px 0 26px}
  .foot{display:flex;gap:80px;font-size:13px;color:#475569}
  .foot b{display:block;color:#0f172a;font-size:14px}
  @media print{body{background:#fff}}
</style></head><body>
<div class="cert">
  <div class="brand">CareerCore Edutech</div>
  <h1>Certificate of Completion</h1>
  <div class="sub">This certifies that</div>
  <div class="name">${esc(studentName)}</div>
  <div class="sub">has successfully completed every lesson of</div>
  <div class="course">${esc(courseTitle)}</div>
  <div class="foot"><div><b>${esc(date)}</b>Date of completion</div><div><b>CareerCore Edutech</b>Issued by</div></div>
</div>
</body></html>`;

  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  const win = window.open(url, '_blank');
  if (win) {
    win.addEventListener('load', () => setTimeout(() => { try { win.print(); } catch (e) {} }, 300));
  }
  setTimeout(() => URL.revokeObjectURL(url), 60000);
  return !!win;
}
