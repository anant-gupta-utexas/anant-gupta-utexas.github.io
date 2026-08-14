# Design system — anant-gupta-utexas.github.io

Reference for the portfolio site so future edits stay consistent. This is a
hand-authored static site: **plain HTML + one CSS file + one JS file**, no
build step, no framework. GitHub Pages serves the repo root as-is; a push to
`main` deploys within ~1 minute.

- **`index.html`** — all content and structure. Semantic sections, no inline styles.
- **`assets/css/style.css`** — design tokens, fonts, layout, and every component style.
- **`assets/js/main.js`** — progressive enhancement only (theme toggle, scroll-spy).
  The site is fully usable with JS disabled.
- **`assets/fonts/`** — self-hosted WOFF2, latin subset (no CDN, no network dependency).

> The visual language is **editorial-meets-engineering**: deep blue-charcoal
> rather than pure black, warm off-white serif headlines, clean sans body,
> monospace technical labels, one muted cyan accent, thin low-contrast borders,
> modest 4–8px corners, almost no shadows, generous whitespace. No gradients,
> glows, neon, oversized pills, or colorful SaaS-style cards. The dark theme
> should feel editorial and sophisticated — it hints at engineering without
> cosplaying as engineering.

---

## 1. Color tokens

All colors are CSS custom properties. **Dark is the canonical theme** and lives
on `:root`; light mode overrides on `:root[data-theme="light"]`. Never
hard-code a color in markup — always use a token so the theme toggle keeps
working.

| Token | Dark (default) | Light | Use |
| --- | --- | --- | --- |
| `--bg-page` | `#07131B` | `#F6F6F3` | Page canvas |
| `--bg-sidebar` | `#050D14` | `#EFEFEA` | Nav rail / mobile bar |
| `--bg-surface` | `#0F1B23` | `#FCFCFA` | Cards, panels |
| `--bg-surface-hover` | `#12232D` | `#F2F2ED` | Card hover |
| `--text-primary` | `#F1F3F3` | `#171F24` | Headings, strongest text |
| `--text-body` | `#BCC1C3` | `#3A454B` | Regular paragraphs |
| `--text-secondary` | `#959A9D` | `#5C676D` | Supporting copy |
| `--text-muted` | `#6C767B` | `#79838A` | Dates, secondary labels |
| `--text-faint` | `#455258` | `#A6AEB3` | Least important info |
| `--accent` | `#54CAD9` | `#0F7A8A` | THE one accent (cyan/teal) |
| `--accent-bright` | `#61DCE8` | `#0B6472` | Hover states of accent text |
| `--accent-muted` | `#2C7883` | `#7CB9C1` | Subtle accent borders |
| `--accent-bg` | cyan @ 8% | teal @ 7% | Faint accent fills |
| `--border` | `#263239` | `#DFDFD9` | Card / rail borders |
| `--border-subtle` | body-text @ 12% | ink @ 12% | Section rules, row dividers |
| `--rule` | body-text @ 20% | ink @ 20% | Stronger separators |
| `--tag-border` | `#455258` | `#B9C0C4` | Tag chips, ghost buttons |
| `--timeline-rail` | accent @ 35% | accent @ 30% | Timeline / stack spine |

**Cyan budget:** the accent appears only where it communicates — active nav,
section eyebrows, timeline markers, repo links, primary CTA, the `.` at the end
of headlines, and stack-panel focus markers. Keep it well under 10% of any
viewport. If a change makes the page "glow", remove accent, don't add.

The important thing is that the background is **not pure black** — `#07131B`
has enough blue in it to feel rich rather than terminal-black.

## 2. Typography

Three self-hosted families, three fixed roles. Do not lean on bold — the
design depends on typography and spacing, not weight.

| Family | Weights | Role |
| --- | --- | --- |
| Cormorant Garamond | 400, 500, 400i | Display: `h1`, section titles, connect statement |
| Inter | 400, 500, 600 | Body copy, card text, layer names |
| IBM Plex Mono | 400, 500 | Nav, eyebrows, tags, dates, buttons, repo names, footer |

Scale: hero title `clamp(44px, 4.2vw, 62px)` at line-height 0.98 and
letter-spacing −0.025em; section titles `clamp(34px, 3vw, 48px)`; body 16/1.65;
small 13–14px; mono labels 10.5–12px, uppercase, letter-spacing 0.05–0.08em.
Headlines end with a cyan period (`<span class="accent">.</span>`) — that tiny
accent is enough; never colorize half a headline.

## 3. Layout

```
┌────────────┬──────────────────────────────┐
│ sidebar    │ main (max 1180px, centered)  │
│ 168px      │ 48px side gutters            │
│ sticky     │ sections: 72px vertical pad  │
└────────────┴──────────────────────────────┘
```

- One continuous charcoal canvas; sections separated by `--border-subtle`
  1px rules, **not** alternating background blocks.
- Sidebar: brand (`ANANT` cyan / `GUPTA` primary, mono), numbered nav
  (`01 About` …), footer utilities (theme toggle, email, GitHub, LinkedIn).
  Active nav item = cyan text + 2px cyan tick at the rail's left edge — no
  pill backgrounds.
- Sections and ids: `#about` (hero), `#journey`, `#work`, `#builds`,
  `#thinking`, `#connect`. Eyebrows are unnumbered (`The Journey`); only the
  sidebar nav carries the `01`–`06` numerals.
- **Hero** is a two-column grid (copy | portrait). The three facts
  (Currently / Focus / Outside work) are a three-up band nested at the foot of
  `.hero-copy`, under a rule and divided by vertical hairlines, so they align
  to the text column rather than the full page width. Keep the values short —
  the column is ~570px, so each fact gets ~190px. Below 880px everything
  stacks and the dividers flip from vertical to horizontal; reset
  `.meta-block + .meta-block`'s `border-left`, not just `.meta-block`, or the
  vertical rules survive the stack.
- **Topic clusters** (`.topics-panel .tags`) is a stacked list — one
  full-width chip per row, not the inline wrap used elsewhere. The entries
  mirror the real clusters in the knowledge base, so update them when the
  clusters change rather than inventing topics.

**Breakpoints:** ≤1140px the hero meta column drops below the copy as a 4-up
strip; ≤880px the sidebar is replaced by a sticky mobile top bar (brand + nav
row + toggle) and all grids collapse to one column; ≤560px meta goes 1-col and
connect buttons go full-width.

## 4. Components

- **Cards** (`.card`): `--bg-surface`, 1px `--border`, radius 8, padding 26px.
  Hover: surface-hover + accent-ish border + `translateY(-1px)` at 160ms. No
  shadows. Tags pinned to the bottom via flex `margin-top: auto`.
- **Tags** (`.tag`): transparent, 1px `--tag-border`, radius 4, mono 11px.
  Never filled, never colorful.
- **Buttons** (`.btn`): ghost outline, mono uppercase, radius 6. Primary CTA
  = accent border + accent text, hover fills with `--accent-bg` only.
- **Journey path** (`.path`): horizontal timeline — a 1px full-width rail at
  accent-35% with a 10px hollow circle (1.5px accent border, page-color fill)
  at the start of each phase column. Era in cyan mono, phase title in
  Inter 600, description in secondary. Below 980px it flips to a vertical rail
  with the same ingredients. The column count is hard-coded in
  `grid-template-columns` — update it when adding or merging a phase, or the
  rail runs past the last milestone.
- **Stack panel** (`.stack-panel`): one outlined surface panel listing the
  seven agent-stack layers. Marker circles: hollow = adjacent layer, filled
  cyan = concentration area. `Infrastructure` is the foundation row —
  stronger top rule + faint `--accent-bg` tint. A vertical spine connects
  markers (hidden on mobile).
- **Portrait** (`.hero-portrait`): aspect 4/5, radius 8, hairline border,
  `object-fit: cover`. `assets/images/portrait.jpg` is pre-cropped to 4:5 at
  704×880, so it fills the frame without the browser cropping further — keep
  any replacement at that ratio. The photograph is the page's source of warmth;
  don't recolor the UI to compete with it.

## 5. Theme toggle

Inline head script applies the saved theme before first paint (default dark).
`main.js` flips `data-theme` on `<html>`, persists to `localStorage`, and
relabels the buttons — the label names the mode it switches **to** (shows
"Light" while dark). Both the sidebar and mobile-bar toggles share the
`.theme-toggle` class and stay in sync.

## 6. Conventions

- **Cache-busting:** `style.css` and `main.js` are linked with a `?v=YYYYMMDD`
  token in `index.html`. Bump it on every CSS/JS change or returning visitors
  keep the stale cached file.
- **Icons:** tiny inline SVGs, `stroke="currentColor"`, 13px, feather-style.
  No icon fonts, no external sets.
- **Accessibility:** skip-link, `:focus-visible` outlines, `aria-label`s on
  icon-only controls, `prefers-reduced-motion` kills transitions and smooth
  scroll.
- **Content edits** happen directly in `index.html` — keep the copy voice
  factual and understated; the design carries the polish.
