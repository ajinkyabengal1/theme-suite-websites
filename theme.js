// Shared by shell + template iframe. Palette derivation + WCAG contrast (plan §5.1).
// ponytail: Google Fonts are loaded by <link> in index.html/template.html. Production uses next/font (self-hosted, no third-party request).
export const FONTS = {
  clean:   { label: 'Clean Sans',      body: 'system-ui,-apple-system,"Segoe UI",sans-serif', heading: 'system-ui,-apple-system,"Segoe UI",sans-serif', weight: 700 },
  elegant: { label: 'Elegant Serif',   body: 'Georgia,"Times New Roman",serif',               heading: 'Georgia,"Times New Roman",serif',               weight: 600 },
  bold:    { label: 'Modern & Bold',   body: '"Avenir Next","Trebuchet MS",sans-serif',       heading: '"Avenir Next","Trebuchet MS",sans-serif',       weight: 900 },
  humanist:  { label: 'Humanist',        body: 'Optima,Candara,"Segoe UI",Calibri,sans-serif', heading: 'Optima,Candara,"Segoe UI",Calibri,sans-serif', weight: 700 },
  rounded:   { label: 'Friendly Rounded', body: 'ui-rounded,"SF Pro Rounded",Quicksand,Nunito,"Segoe UI",sans-serif', heading: 'ui-rounded,"SF Pro Rounded",Quicksand,Nunito,"Segoe UI",sans-serif', weight: 800 },
  classic:   { label: 'Classic Serif',   body: 'Palatino,"Palatino Linotype","Book Antiqua",serif', heading: 'Palatino,"Palatino Linotype","Book Antiqua",serif', weight: 700 },
  geometric: { label: 'Geometric',       body: '"Century Gothic","Avenir Next",Futura,"Trebuchet MS",sans-serif', heading: '"Century Gothic","Avenir Next",Futura,"Trebuchet MS",sans-serif', weight: 700 },
  inter:     { label: 'Inter',            body: 'Inter,system-ui,sans-serif',               heading: 'Inter,system-ui,sans-serif',               weight: 700 },
  geist:     { label: 'Geist',            body: 'Geist,system-ui,sans-serif',               heading: 'Geist,system-ui,sans-serif',               weight: 700 },
  plex:      { label: 'IBM Plex Sans',    body: '"IBM Plex Sans",system-ui,sans-serif',     heading: '"IBM Plex Sans",system-ui,sans-serif',     weight: 600 },
  jakarta:   { label: 'Plus Jakarta Sans', body: '"Plus Jakarta Sans",system-ui,sans-serif', heading: '"Plus Jakarta Sans",system-ui,sans-serif', weight: 800 },
  poppins:   { label: 'Poppins',          body: 'Poppins,system-ui,sans-serif',             heading: 'Poppins,system-ui,sans-serif',             weight: 600 },
  nunito:    { label: 'Nunito',           body: 'Nunito,system-ui,sans-serif',              heading: 'Nunito,system-ui,sans-serif',              weight: 800 },
};
export const RADII = { sharp: ['2px', '2px'], soft: ['14px', '10px'], round: ['28px', '999px'] };
// Standard colour names. First five match the real v2 forks (Kepple, Central, CareFirst, Strachan, iCare).
export const PRESETS = {
  'Royal Purple':  { primary: '#4a3fb8', accent: '#f59e0b' },
  'Deep Teal':     { primary: '#0a3238', accent: '#2cb5a0' },
  'Forest Green':  { primary: '#065f46', accent: '#f59e0b' },
  'Emerald':       { primary: '#198568', accent: '#e8468b' },
  'Charcoal':      { primary: '#1f2a31', accent: '#34b44a' },
  'Ocean Blue':    { primary: '#0b5cad', accent: '#ff7a45' },
  'Navy':          { primary: '#14246b', accent: '#6f8cf0' },
  'Crimson':       { primary: '#b3123f', accent: '#ffb400' },
  'Sunset Orange': { primary: '#b84a0b', accent: '#2a7de1' },
  'Rose Pink':     { primary: '#b02a6b', accent: '#7dd3c0' },
  'Slate Grey':    { primary: '#3b4a6b', accent: '#c9a227' },
  'Warm Brown':    { primary: '#5b4b3a', accent: '#c98f7a' },
};

const lin = c => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
export const lum = h => { const [r, g, b] = rgb(h).map(lin); return .2126 * r + .7152 * g + .0722 * b; };
export const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
const darken = (h, t) => '#' + rgb(h).map(v => Math.round(v * (1 - t)).toString(16).padStart(2, '0')).join('');

// Auto-adjust: darken primary until white text on it passes AA (4.5:1).
export function fixPrimary(h) {
  let n = 0; while (contrast(h, '#ffffff') < 4.5 && n++ < 40) h = darken(h, .05);
  return h;
}

// Only primary/accent/fonts/radius are inputs; hover/light/dark/etc are derived in base.css via color-mix().
export function toVars({ primary, accent, font, radius }) {
  const f = FONTS[font], r = RADII[radius];
  return {
    '--color-brand-primary': primary, '--color-brand-accent': accent,
    '--font-heading': f.heading, '--font-body': f.body, '--font-weight-heading': f.weight,
    '--radius-card': r[0], '--radius-btn': r[1],
  };
}
