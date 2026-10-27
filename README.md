# Theme Suite demo
Proof of the v2 theme-template plan (`v2-pharmacy-theme-templates-plan.pdf`). No build, no deps.

![Design Suite gallery: 15 designs with category filter and search](docs/gallery.png)

    cd theme-suite-demo && python3 -m http.server 5173   # open http://localhost:5173

- `theme.js`     token contract, 3 font presets, radius presets, palette inputs, WCAG AA check/auto-fix (§5.1)
- `base.css`     shared styles; hover/light/dark derived from primary+accent via `color-mix()`
- `templates.js` 15 designs (5 categories) as slot→variant maps + variant components + editable default content (§5.2)
- `template.html` the "demo app": renders one design + page (home|about|contact), applies CSS vars and content posted from the shell (§5.4)
- `index.html` shell: gallery (category filter + search, live thumbnails) → per-design customiser (brand try-on, Home/About/Contact content editor, spec JSON)

Port to v2: theme.js/base.css tokens -> `app/globals.scss` + `themes/*.css`; templates.js maps -> `@healthya-team/pharmacy-themes`
variant props; the shell's state -> Sanity `siteTheme` doc.
