// Shell helpers: logo upload + colour pick, share-link encoding, printable spec sheet.
import { FONTS, RADII, MODES } from './theme.js';
import { DEFAULT_CONTENT, DEFAULT_SECTIONS, IMG_LIB } from './templates.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- logo ---------- */
// Most frequent saturated colour = primary; next clearly different one = accent. Greys/near-black/white are ignored.
export function paletteFrom(data) {
  const buckets = new Map();
  for (let i = 0; i < data.length; i += 16) {
    if (data[i + 3] < 128) continue;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]], mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mx < 40 || (mx - mn) / mx < .3) continue;
    const k = (r >> 5) << 6 | (g >> 5) << 3 | (b >> 5), e = buckets.get(k) || { n: 0, r: 0, g: 0, b: 0 };
    e.n++; e.r += r; e.g += g; e.b += b; buckets.set(k, e);
  }
  const list = [...buckets.values()].sort((a, b) => b.n - a.n).map(e => [e.r / e.n, e.g / e.n, e.b / e.n].map(Math.round));
  if (!list.length) return null;
  const hex = c => '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  const far = c => Math.hypot(c[0] - list[0][0], c[1] - list[0][1], c[2] - list[0][2]) > 110;
  const acc = list.find(far);
  return { primary: hex(list[0]), accent: acc ? hex(acc) : null };
}

// Resize to <=480x160 (keeps localStorage small) and return { dataUrl, palette }.
export const loadLogo = file => new Promise((resolve, reject) => {
  if (!file?.type.startsWith('image/') || file.size > 2e6) return reject(new Error('Choose an image under 2MB'));
  const r = new FileReader();
  r.onerror = reject;
  r.onload = () => {
    const im = new Image();
    im.onerror = () => reject(new Error('Could not read that image'));
    im.onload = () => {
      const iw = im.naturalWidth || 300, ih = im.naturalHeight || 100;
      const k = Math.min(480 / iw, 160 / ih, file.type.includes('svg') ? 4 : 1);
      const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(iw * k)); c.height = Math.max(1, Math.round(ih * k));
      const g = c.getContext('2d'); g.drawImage(im, 0, 0, c.width, c.height);
      resolve({ dataUrl: c.toDataURL('image/png'), palette: paletteFrom(g.getImageData(0, 0, c.width, c.height).data) });
    };
    im.src = r.result;
  };
  r.readAsDataURL(file);
});

/* ---------- share link ---------- */
// ponytail: the logo is not in the link (too big for a URL). Upgrade path: host it, or store the whole spec server-side.
const pipe = async (bytes, stream) => new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
export async function encodeState(o) {
  const bytes = await pipe(new TextEncoder().encode(JSON.stringify(o)), new CompressionStream('deflate-raw'));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export async function decodeState(str) {
  const bytes = Uint8Array.from(atob(str.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(await pipe(bytes, new DecompressionStream('deflate-raw'))));
}
export const shareable = s => ({ primary: s.primary, accent: s.accent, font: s.font, radius: s.radius, mode: s.mode, content: s.content, services: s.services, sections: s.sections });

// Never trust a link: copy only known fields with known shapes.
export function sanitizeShared(o) {
  const hex = v => /^#[0-9a-f]{6}$/i.test(v), out = {};
  if (hex(o.primary)) out.primary = o.primary;
  if (hex(o.accent)) out.accent = o.accent;
  if (o.font in FONTS) out.font = o.font;
  if (o.radius in RADII) out.radius = o.radius;
  if (o.mode in MODES) out.mode = o.mode;
  if (o.content && typeof o.content === 'object') out.content = Object.fromEntries(Object.keys(DEFAULT_CONTENT).map(k => [k, String(o.content[k] ?? DEFAULT_CONTENT[k]).slice(0, 2000)]));
  if (Array.isArray(o.services)) out.services = o.services.slice(0, 8).map(s => ({
    tag: s.tag === 'Private' ? 'Private' : 'NHS', title: String(s.title ?? '').slice(0, 80), desc: String(s.desc ?? '').slice(0, 200),
    img: IMG_LIB.some(i => i.file === s.img) ? s.img : IMG_LIB[0].file,
  }));
  if (o.sections && Array.isArray(o.sections.order)) out.sections = {
    order: DEFAULT_SECTIONS.order.filter(k => o.sections.order.includes(k)).sort((a, b) => o.sections.order.indexOf(a) - o.sections.order.indexOf(b)),
    hidden: DEFAULT_SECTIONS.order.filter(k => (o.sections.hidden || []).includes(k)),
  };
  return out;
}

/* ---------- printable spec sheet (save as PDF from the print dialog) ---------- */
export function specHTML(s, t) {
  const f = FONTS[s.font], C = s.content;
  const sw = (n, h) => `<div class="sw"><i style="background:${esc(h)}"></i><b>${n}</b><span>${esc(h.toUpperCase())}</span></div>`;
  const shown = s.sections.order.filter(k => !s.sections.hidden.includes(k));
  return `<!doctype html><meta charset="utf-8"><title>${esc(C.name)} – website spec</title><style>
@page{margin:16mm}*{box-sizing:border-box}body{font:14px/1.5 system-ui,sans-serif;color:#1b1b24;max-width:760px;margin:0 auto;padding:24px}
h1{font-size:28px;margin:0 0 4px;color:${esc(s.primary)}}h2{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#666;border-bottom:1px solid #ddd;padding-bottom:4px;margin:26px 0 10px}
.top{display:flex;justify-content:space-between;align-items:center;gap:20px}.top img{max-height:56px;max-width:200px}
.sw{display:inline-flex;flex-direction:column;gap:2px;margin-right:18px}.sw i{width:90px;height:50px;border-radius:8px;border:1px solid #0002}
.two{display:grid;grid-template-columns:1fr 1fr;gap:6px 24px}li{margin-bottom:2px}small{color:#777}
</style>
<div class="top"><div><h1>${esc(C.name)}</h1><div>Website design specification</div></div>${s.logo?.startsWith('data:image/') ? `<img src="${s.logo}" alt="Logo">` : ''}</div>
<h2>Design</h2><p><b>${esc(t.label)}</b> · ${esc(t.cat)} · <small>${esc(t.blurb)}</small></p>
<h2>Brand</h2>${sw('Primary', s.primary)}${sw('Accent', s.accent)}
<p style="margin-top:10px"><b>Font:</b> ${esc(f.label)} &nbsp; <b>Corners:</b> ${esc(s.radius)} &nbsp; <b>Mode:</b> ${esc(s.mode || 'light')}</p>
<h2>Contact details</h2><div class="two"><div><b>Phone</b><br>${esc(C.phone)}</div><div><b>Email</b><br>${esc(C.email)}</div><div><b>Address</b><br>${esc(C.address)}</div><div><b>Hours</b><br>${esc(C.hours)}</div></div>
<h2>Home page</h2><p><b>Headline:</b> ${esc(C.tagline)}</p><p><b>Sections:</b> Hero, ${shown.map(k => ({ services: 'Services', reviews: 'Reviews', faq: 'FAQ' }[k])).join(', ') || 'none'}</p>
<h2>Services (${s.services.length})</h2><ul>${s.services.map(v => `<li><b>${esc(v.title)}</b> <small>${esc(v.tag)}</small> – ${esc(v.desc)}</li>`).join('')}</ul>
<h2>About</h2><p><b>${esc(C.aboutTitle)}</b></p><p><small>${esc(C.aboutBody).replace(/\n+/g, '<br>')}</small></p>
<p style="margin-top:30px"><small>Prepared ${new Date().toLocaleDateString('en-GB')} with the Theme Suite demo.</small></p>`;
}
