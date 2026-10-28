// Layout variants (plan §5.2): a design = slot→variant map + default brand + page styles.
// Content is editable in the shell (ponytail: in production it comes from Sanity + pharmacyTokens.ts;
// images are bundled stock from the v2 repo, in production they come from the Sanity media library).
export const DEFAULT_CONTENT = {
  name: 'Demo Pharmacy', tagline: 'Your local pharmacy, bookable in a minute.',
  phone: '01234 567 890', email: 'hello@demopharmacy.co.uk', address: '1 High Street, Townsville, TS1 1AB',
  hours: 'Mon–Fri 9am–6pm · Sat 9am–1pm',
  aboutTitle: 'Caring for the neighbourhood since 1987',
  aboutBody: 'We are an independent, family-run pharmacy. Our team gives friendly, unhurried advice and a full range of NHS and private services.\nWhatever you need, we will help you get it sorted.',
  team: 'Asha Patel — Superintendent Pharmacist\nTom Reeves — Pharmacist\nLena Okafor — Dispensing Technician',
  contactIntro: 'Questions, prescriptions or appointments? Get in touch and we will reply the same day.',
};
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const paras = t => esc(t).split(/\n+/).filter(Boolean).map(p => `<p style="margin-bottom:12px">${p}</p>`).join('');
const team = C => C.team.split('\n').filter(Boolean).map(l => l.split(/\s*[—–-]\s*/)).map(([n, r]) => [esc(n), esc(r || '')]);
const ini = n => n.replace(/&\w+;/g, '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
const img = (f, alt = '') => `<img class="pic" src="img/${f}" alt="${alt}" loading="lazy">`;
const IMG = { hero: 'hero-bg.jpeg', consult: 'about-1.jpeg', checks: 'about-2.jpeg', happy: 'about-cta-bg.jpeg', travel: 'travel.jpeg', ear: 'ear-wax.jpeg', weight: 'weight-loss.jpeg' };

export const IMG_LIB = [
  { file: 'about-1.jpeg', label: 'Consultation' }, { file: 'hero-bg.jpeg', label: 'Pharmacist and customer' },
  { file: 'about-2.jpeg', label: 'Health check' }, { file: 'travel.jpeg', label: 'Travel' },
  { file: 'weight-loss.jpeg', label: 'Weight management' }, { file: 'ear-wax.jpeg', label: 'Ear care' },
  { file: 'about-cta-bg.jpeg', label: 'Happy patients' },
];
export const DEFAULT_SERVICES = [
  { tag: 'NHS', title: 'Pharmacy First', desc: 'Treatment for 7 common conditions, no GP visit.', img: IMG.consult },
  { tag: 'NHS', title: 'Repeat Prescriptions', desc: 'Order online, collect or have it delivered.', img: IMG.hero },
  { tag: 'NHS', title: 'Health Checks', desc: 'Blood pressure and wellbeing checks, walk-ins welcome.', img: IMG.checks },
  { tag: 'Private', title: 'Travel Clinic', desc: 'Vaccines and malaria advice before you go.', img: IMG.travel },
  { tag: 'Private', title: 'Weight Management', desc: 'Clinician-led programme with ongoing support.', img: IMG.weight },
  { tag: 'Private', title: 'Ear Wax Removal', desc: 'Quick, safe microsuction in-store.', img: IMG.ear },
];
// Layouts that only have room for the first N services.
export const serviceLimit = key => ({ bento: 5, editorial: 4 }[templates[key].services] ?? Infinity);
export const DEFAULT_SECTIONS = { order: ['services', 'reviews', 'faq'], hidden: [] };
const safeImg = f => IMG_LIB.some(i => i.file === f) ? f : IMG_LIB[0].file;
const FAQS = [
  ['Do I need an appointment?', 'Most services accept walk-ins, but booking online guarantees a time slot and a shorter wait.'],
  ['What is Pharmacy First?', 'An NHS service where we assess and treat seven common conditions, such as sore throat and earache, without a GP appointment.'],
  ['Can you deliver my prescription?', 'Yes. We offer free local delivery for repeat prescriptions. Ask in store or order online.'],
  ['Which private services do you offer?', 'Travel vaccinations, weight management and ear wax removal. Prices are shown when you book.'],
  ['How do I transfer my prescription to you?', 'Nominate us through the NHS App or tell any member of our team. We will do the rest.'],
];
const lnk = (x, p) => `template.html?t=${x.k}&p=${p}`;
const logo = x => {
  if (x.X.logo?.startsWith('data:image/')) return `<a class="logo" href="${lnk(x, 'home')}"><img src="${x.X.logo}" alt="${esc(x.C.name)}" style="height:40px;width:auto;display:block;background:#fff;border-radius:6px;padding:2px 6px"></a>`;
  const [a, ...b] = x.C.name.trim().split(' '); return `<a class="logo" href="${lnk(x, 'home')}">${esc(a)}${b.length ? `<b>.</b>${esc(b.join(' '))}` : ''}</a>`;
};
const nav = x => `<nav><a href="${lnk(x, 'home')}">Home</a><a href="${lnk(x, 'about')}">About</a><a href="${lnk(x, 'contact')}">Contact</a></nav>`;
const cta = x => `<a class="btn cta" href="${lnk(x, 'contact')}">Book now</a>`;
const book = () => `<div class="card" style="box-shadow:0 12px 40px rgb(0 0 0/.18);color:var(--ink)"><div class="grid g3" style="align-items:end">
  <label>Service<br><select style="width:100%;padding:10px"><option>Pharmacy First</option><option>Travel Clinic</option></select></label>
  <label>Date<br><input type="date" style="width:100%;padding:9px"></label><a class="btn" href="#" style="text-align:center">Check availability</a></div></div>`;
const contactStrip = C => `<div class="grid g3 light" style="padding:20px;border-radius:var(--radius-card)"><div><b>Call</b><br>${esc(C.phone)}</div><div><b>Visit</b><br>${esc(C.address)}</div><div><b>Open</b><br>${esc(C.hours)}</div></div>`;
const h1 = (C, s = 48) => `<h1 style="font-size:${s}px;max-width:640px;margin:10px 0 24px">${esc(C.tagline)}</h1>`;
const faqItems = n => FAQS.slice(0, n).map(([q, a], i) => `<details${i ? '' : ' open'}><summary>${q}</summary><p>${a}</p></details>`).join('');
const sCard = s => `<div class="scard"><div class="simg">${img(safeImg(s.img), esc(s.title))}</div><div class="b"><span class="tag">${esc(s.tag)}</span><h3>${esc(s.title)}</h3><p class="muted">${esc(s.desc)}</p></div></div>`;
const ovl = s => `<div class="ovl">${img(safeImg(s.img), esc(s.title))}<div class="t"><span class="tag" style="color:#fff;opacity:.8">${esc(s.tag)}</span><h3>${esc(s.title)}</h3><p style="opacity:.85;font-size:14px">${esc(s.desc)}</p></div></div>`;
const colsLinks = x => `<div><p class="fh">Services</p><a href="${lnk(x, 'home')}">Pharmacy First</a><a href="${lnk(x, 'home')}">Prescriptions</a><a href="${lnk(x, 'home')}">Travel Clinic</a></div>
  <div><p class="fh">Company</p><a href="${lnk(x, 'about')}">About us</a><a href="${lnk(x, 'contact')}">Contact</a><a href="#">Privacy</a></div>
  <div><p class="fh">Visit</p><p>${esc(x.C.address)}</p><p>${esc(x.C.phone)}</p><p>${esc(x.C.hours)}</p></div>`;

export const variants = {
  header: {
    bar: x => `<header class="h"><div class="wrap">${logo(x)}${nav(x)}${cta(x)}</div></header>`,
    centered: x => `<header class="h centered"><div class="wrap">${logo(x)}${nav(x)}</div></header>`,
    minimal: x => `<header class="h"><div class="wrap">${logo(x)}<a href="${lnk(x, 'contact')}" style="font-weight:600">Contact</a></div></header>`,
  },
  hero: {
    booking: ({ C }) => `<section class="bgimg hero-pad" style="background-image:url(img/${IMG.hero});padding:96px 0"><div class="wrap"><span class="tag">NHS &amp; private care</span>${h1(C, 52)}${book()}</div></section>`,
    simple: ({ C }) => `<section class="hero-pad"><div class="wrap"><div class="grid g2" style="align-items:center;gap:40px;margin-bottom:32px"><div>${h1(C, 44)}<p class="muted" style="margin-bottom:22px">Friendly advice, prescriptions and health services on your high street.</p><a class="btn" href="#">Book a service</a></div><div class="frame-img">${img(IMG.consult, 'Pharmacist advising a customer')}</div></div>${contactStrip(C)}</div></section>`,
    bold: ({ C }) => `<section class="bgimg" style="background-image:url(img/${IMG.hero});padding:110px 0"><div class="wrap"><h1 style="font-size:clamp(44px,8vw,84px);text-transform:uppercase;max-width:900px">${esc(C.tagline)}</h1><div style="margin-top:28px;display:flex;gap:14px;flex-wrap:wrap"><a class="btn cta" style="font-size:18px;padding:16px 32px" href="#">Book a service</a><a class="btn" style="font-size:18px;padding:16px 32px;background:none;border-color:#fff" href="#">Order prescription</a></div></div></section>`,
    quiet: ({ C }) => `<section style="padding:80px 0 0;text-align:center"><div class="wrap"><h1 style="font-size:36px;font-weight:400;max-width:560px;margin:0 auto 24px">${esc(C.tagline)}</h1><a class="btn" href="#">Book an appointment</a><div class="frame-img" style="margin-top:48px;min-height:380px">${img(IMG.checks, 'Pharmacist taking a blood pressure reading')}</div></div></section>`,
    editorial: ({ C }) => `<section class="hero-pad"><div class="wrap grid g2" style="align-items:center;gap:48px"><div><span class="tag">Independent pharmacy</span><h1 style="font-size:52px;margin:12px 0 18px">${esc(C.tagline)}</h1><a class="btn" href="#">Explore services</a></div><div class="frame-img" style="min-height:460px">${img(IMG.hero, 'Pharmacist with customer')}</div></div></section>`,
    split: ({ C }) => `<section class="light hero-pad"><div class="wrap grid g2" style="align-items:center;gap:40px"><div><span class="tag">Welcome</span>${h1(C, 46)}<a class="btn" href="#">Book now</a></div><div style="position:relative"><div class="frame-img" style="min-height:400px">${img(IMG.consult, 'Pharmacist helping a customer')}</div><div class="card" style="position:absolute;left:-24px;bottom:-24px;box-shadow:0 12px 30px #0003;max-width:260px"><b>Visit us</b><p style="margin:4px 0">${esc(C.address)}</p><p class="muted">${esc(C.hours)}</p></div></div></div></section>`,
  },
  services: {
    grid: x => `<section class="sec"><div class="wrap"><h2 style="margin-bottom:24px">NHS &amp; private services</h2><div class="grid g3">${x.X.services.map(sCard).join('')}</div></div></section>`,
    cards: x => `<section class="sec"><div class="wrap"><h2 style="margin-bottom:24px">Our services</h2><div class="grid g3">${x.X.services.map(sCard).join('')}</div></div></section>`,
    bento: x => `<section class="sec"><div class="wrap"><h2 style="margin-bottom:24px">What we do</h2><div class="grid bento">${x.X.services.slice(0, 5).map(ovl).join('')}</div></div></section>`,
    list: x => `<section class="sec"><div class="wrap" style="max-width:720px"><h2 style="margin-bottom:12px;font-weight:400">Services</h2>${x.X.services.map(s => `<div class="row" style="align-items:center"><span style="width:72px;height:56px;flex:none;border-radius:var(--radius-card);overflow:hidden">${img(safeImg(s.img), esc(s.title))}</span><span style="flex:1"><b>${esc(s.title)}</b><br><span class="muted">${esc(s.desc)}</span></span><span class="muted">${esc(s.tag)}</span></div>`).join('')}</div></section>`,
    editorial: x => `<section class="sec"><div class="wrap">${x.X.services.slice(0, 4).map((s, i) => `<div class="grid g2" style="align-items:center;gap:48px;margin-bottom:56px"><div class="frame-img" style="min-height:280px;order:${i % 2}">${img(safeImg(s.img), esc(s.title))}</div><div><span style="font:var(--font-weight-heading) 40px var(--font-heading);color:var(--color-brand-accent-text)">0${i + 1}</span><h2 style="font-size:30px;margin:6px 0 8px">${esc(s.title)}</h2><p class="muted" style="margin-bottom:16px">${esc(s.desc)}</p><a class="btn ghost" href="#">Learn more</a></div></div>`).join('')}</div></section>`,
  },
  reviews: ({ C }) => `<section class="sec light"><div class="wrap"><h2 style="margin-bottom:24px">What patients say</h2><div class="grid g3">${[['Quick, kind and so helpful.', 'Maria K.'], ['Booked Pharmacy First in minutes.', 'David R.'], ['Best pharmacy team around.', 'Priya S.']].map(([q, n]) => `<div class="card"><div class="stars">★★★★★</div><p style="margin-top:8px">“${q}”</p><div class="who"><span class="avatar">${ini(n)}</span><div><b>${n}</b><br><span class="muted" style="font-size:13px">${esc(C.name)} patient</span></div></div></div>`).join('')}</div></div></section>`,
  faq: {
    accordion: () => `<section class="sec"><div class="wrap faq" style="max-width:760px"><h2 style="margin-bottom:12px">Frequently asked questions</h2>${faqItems(5)}</div></section>`,
    twocol: () => `<section class="sec light"><div class="wrap grid g2 faq" style="gap:48px;align-items:start"><div><span class="tag">FAQ</span><h2 style="font-size:36px;margin:8px 0 12px">Answers to common questions</h2><p class="muted">Cannot find what you need? Call or visit us and we will be happy to help.</p></div><div>${faqItems(5)}</div></div></section>`,
    cards: () => `<section class="sec"><div class="wrap faq"><h2 style="margin-bottom:24px">Good to know</h2><div class="grid g2">${FAQS.slice(0, 4).map(([q, a]) => `<div class="card"><h3 style="font-size:18px;margin-bottom:8px">${q}</h3><p class="muted">${a}</p></div>`).join('')}</div></div></section>`,
  },
  footer: {
    // CTA band with photo, then link columns
    dark: x => `<footer><div class="bgimg cta-band" style="background-image:url(img/${IMG.happy})"><div class="wrap"><h2>Ready to book your visit?</h2><p>Same-day appointments available at ${esc(x.C.name)}.</p><a class="btn cta" href="${lnk(x, 'contact')}">Book now</a></div></div>
      <div class="dark"><div class="wrap"><div class="fcols"><div>${logo(x)}<p style="margin-top:10px">Caring for our community.</p></div>${colsLinks(x)}</div><div class="fbar"><span>© ${esc(x.C.name)}</span><span>Registered pharmacy</span></div></div></div></footer>`,
    // photo panel beside link columns
    light: x => `<footer class="light photo"><div class="pimg">${img(IMG.happy, 'Happy patients')}</div><div class="wrap" style="padding:0 40px"><div class="fcols" style="grid-template-columns:1fr 1fr;padding-bottom:16px"><div>${logo(x)}<p class="muted" style="margin-top:10px">${esc(x.C.address)}</p></div><div><p class="fh">Visit</p><p>${esc(x.C.phone)}</p><p>${esc(x.C.hours)}</p><a href="${lnk(x, 'contact')}" style="font-weight:700">Book now →</a></div></div><div class="fbar muted"><span>© ${esc(x.C.name)}</span><span>${esc(x.C.phone)}</span></div></div></footer>`,
    // slim bar with thumbnail strip
    minimal: x => `<footer><div style="height:160px;position:relative">${img(IMG.happy, 'Happy patients').replace('class="pic"', 'class="pic" style="border-radius:0"')}</div><div class="wrap muted" style="border-top:1px solid var(--line)"><span>© ${esc(x.C.name)}</span><span>${esc(x.C.address)}</span><span>${esc(x.C.phone)}</span></div></footer>`,
  },
  about: {
    story: ({ C }) => `<section class="bgimg" style="background-image:url(img/${IMG.consult});padding:96px 0"><div class="wrap" style="max-width:760px"><span class="tag">About us</span><h1 style="font-size:44px;margin:10px 0 20px">${esc(C.aboutTitle)}</h1><div style="max-width:620px">${paras(C.aboutBody)}</div></div></section>
      <section class="sec"><div class="wrap"><h2 style="margin-bottom:24px">Meet the team</h2><div class="grid g3">${team(C).map(([n, r]) => `<div class="card"><div class="avatar lg">${ini(n)}</div><h3 style="font-size:18px">${n}</h3><p class="muted">${r}</p></div>`).join('')}</div></div></section>`,
    split: ({ C }) => `<section class="hero-pad"><div class="wrap grid g2" style="align-items:center;gap:48px"><div class="frame-img" style="min-height:400px">${img(IMG.checks, 'Pharmacist at work')}</div><div><span class="tag">About us</span><h1 style="font-size:40px;margin:10px 0 18px">${esc(C.aboutTitle)}</h1>${paras(C.aboutBody)}</div></div></section>
      <section class="sec light"><div class="wrap" style="max-width:680px"><h2 style="margin-bottom:12px">Our team</h2>${team(C).map(([n, r]) => `<div class="row" style="align-items:center"><span class="avatar">${ini(n)}</span><b style="flex:1">${n}</b><span class="muted">${r}</span></div>`).join('')}</div></section>`,
  },
  contact: {
    cards: ({ C }) => `<section class="bgimg" style="background-image:url(img/${IMG.hero});padding:88px 0"><div class="wrap"><span class="tag">Contact</span><h1 style="font-size:44px;margin:10px 0 12px">Get in touch</h1><p style="max-width:560px;opacity:.9">${esc(C.contactIntro)}</p></div></section>
      <section class="sec"><div class="wrap"><div class="grid g3" style="margin-bottom:32px">${[['Call', C.phone], ['Email', C.email], ['Visit', C.address]].map(([a, b]) => `<div class="card"><span class="tag">${a}</span><p style="margin-top:6px"><b>${esc(b)}</b></p></div>`).join('')}</div>
      <div class="card" style="max-width:640px"><h3 style="margin-bottom:12px">Opening hours</h3><p>${esc(C.hours)}</p></div></div></section>`,
    split: ({ C }) => `<section class="hero-pad"><div class="wrap grid g2" style="gap:48px"><div><span class="tag">Contact</span><h1 style="font-size:40px;margin:10px 0 12px">Say hello</h1><p class="muted" style="margin-bottom:20px">${esc(C.contactIntro)}</p>
      <form onsubmit="return false" class="grid" style="gap:10px"><input placeholder="Your name" style="padding:12px"><input placeholder="Email" style="padding:12px"><textarea placeholder="How can we help?" rows="4" style="padding:12px;font:inherit"></textarea><button class="btn">Send message</button></form></div>
      <div><div class="frame-img" style="min-height:220px;margin-bottom:16px">${img(IMG.consult, 'Our pharmacy team')}</div><p><b>${esc(C.address)}</b></p><p>${esc(C.phone)} · ${esc(C.email)}</p><p class="muted">${esc(C.hours)}</p></div></div></section>`,
  },
};

const T = (label, cat, blurb, header, hero, services, faq, footer, about, contact, theme) =>
  ({ label, cat, blurb, header, hero, services, faq, footer, about, contact, theme });
const th = (primary, accent, font = 'clean', radius = 'soft') => ({ primary, accent, font, radius });
export const CATEGORIES = ['Simple', 'Minimal', 'Modern', 'Premium', 'Service'];
export const templates = {
  harbour: T('Harbour', 'Simple', 'Friendly neighbourhood intro, contact details up front.', 'centered', 'simple', 'cards', 'accordion', 'light', 'story', 'cards', th('#0a3238', '#2cb5a0')),
  linden: T('Linden', 'Simple', 'Warm, trust-led layout for independent pharmacies.', 'bar', 'simple', 'grid', 'twocol', 'dark', 'story', 'split', th('#065f46', '#f59e0b')),
  orchard: T('Orchard', 'Simple', 'Clean and approachable high-street design.', 'centered', 'split', 'list', 'cards', 'light', 'split', 'cards', th('#198568', '#e8468b', 'clean', 'round')),
  slate: T('Slate', 'Minimal', 'Whitespace, one booking path, restrained palette.', 'minimal', 'quiet', 'list', 'accordion', 'minimal', 'split', 'split', th('#1f2a31', '#34b44a', 'clean', 'sharp')),
  quill: T('Quill', 'Minimal', 'Calm, content-first with a tight palette.', 'minimal', 'quiet', 'cards', 'accordion', 'minimal', 'story', 'cards', th('#3b4a6b', '#c9a227', 'elegant', 'sharp')),
  haven: T('Haven', 'Minimal', 'Quiet and precise, generous spacing.', 'centered', 'quiet', 'list', 'cards', 'minimal', 'split', 'split', th('#2d4a3e', '#d98a5f', 'clean', 'soft')),
  pulse: T('Pulse', 'Modern', 'Bold type, bento service blocks, strong CTAs.', 'bar', 'bold', 'bento', 'twocol', 'dark', 'story', 'cards', th('#1f2a31', '#34b44a', 'bold', 'soft')),
  vertex: T('Vertex', 'Modern', 'High-contrast, energetic, repeated CTAs.', 'bar', 'bold', 'bento', 'cards', 'dark', 'split', 'split', th('#d4144f', '#ffb400', 'bold', 'sharp')),
  nova: T('Nova', 'Modern', 'Contemporary grid with strong colour.', 'bar', 'split', 'bento', 'twocol', 'dark', 'story', 'split', th('#4a3fb8', '#22d3a6', 'bold', 'round')),
  aurora: T('Aurora', 'Premium', 'Editorial imagery and generous type.', 'centered', 'editorial', 'editorial', 'accordion', 'light', 'split', 'cards', th('#198568', '#e8468b', 'elegant', 'soft')),
  sable: T('Sable', 'Premium', 'Refined, unhurried luxury feel.', 'centered', 'editorial', 'editorial', 'twocol', 'dark', 'story', 'split', th('#2a2230', '#b8935a', 'elegant', 'sharp')),
  ivory: T('Ivory', 'Premium', 'Spa-like calm with a curated service list.', 'minimal', 'editorial', 'list', 'accordion', 'light', 'split', 'cards', th('#5b4b3a', '#c98f7a', 'elegant', 'round')),
  compass: T('Compass', 'Service', 'Booking card straight under the hero.', 'bar', 'booking', 'grid', 'twocol', 'dark', 'story', 'cards', th('#4a3fb8', '#f59e0b')),
  beacon: T('Beacon', 'Service', 'NHS and private services first, booking-led.', 'bar', 'booking', 'cards', 'accordion', 'light', 'split', 'split', th('#0b5cad', '#ff7a45')),
  anchor: T('Anchor', 'Service', 'Appointments and Pharmacy First, no clutter.', 'centered', 'booking', 'grid', 'cards', 'dark', 'story', 'split', th('#0a3238', '#2cb5a0', 'clean', 'round')),
};

export const render = (key, page, C, X = {}) => {
  const t = templates[key];
  X = { logo: '', services: DEFAULT_SERVICES, sections: DEFAULT_SECTIONS, ...X };
  const x = { C, k: key, X };
  const parts = { services: () => variants.services[t.services](x), reviews: () => variants.reviews(x), faq: () => variants.faq[t.faq](x) };
  const home = variants.hero[t.hero](x) + (X.sections.order || []).filter(k => parts[k] && !(X.sections.hidden || []).includes(k)).map(k => parts[k]()).join('');
  const body = page === 'about' ? variants.about[t.about](x) : page === 'contact' ? variants.contact[t.contact](x) : home;
  return variants.header[t.header](x) + `<main>${body}</main>` + variants.footer[t.footer](x);
};
