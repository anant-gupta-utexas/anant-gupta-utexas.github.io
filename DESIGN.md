# Design system — anant-gupta-utexas.github.io

Reference for the portfolio site so future edits stay consistent. This is a
hand-authored static site: **plain HTML + one CSS file + one JS file**, no
build step, no framework. GitHub Pages serves the repo root as-is; a push to
`main` deploys within ~1 minute.

- **`index.html`** — all content and structure. Section styles are inline
  (that's how the design was exported); shared/stateful styles live in CSS.
- **`assets/css/style.css`** — design tokens, fonts, and component styles.
- **`assets/js/main.js`** — progressive-enhancement interactivity only.
- **`assets/fonts/`** — self-hosted WOFF2 (no CDN, no network dependency).

> The visual language is **editorial / print-inspired**: restrained, typographic,
> lots of intentional whitespace, one accent color. Restraint *is* the aesthetic —
> when in doubt, remove rather than add.

---

## 1. Color tokens

All colors are CSS custom properties defined in `:root` (light) and
`:root[data-theme="dark"]` (dark) in `style.css`. **Never hard-code a color in
markup or CSS** — always use a token, so dark mode keeps working.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--ink` | `#1d2126` | `#e7e9ec` | Primary text, borders, dark panels |
| `--paper` | `#f1f2f3` | `#16191d` | Page background, inverted text |
| `--accent` | `oklch(0.52 0.11 240)` | `oklch(0.72 0.11 240)` | The one accent — links, active nav, emphasis |
| `--accent-11` | accent @ 11% | accent @ 14% | Faint accent fills (e.g. Venn circles) |
| `--accent-55` | accent @ 55% | accent @ 55% | Mid-strength accent (tier symbols) |

**Translucent shades** use the RGB-triple tokens so they invert with the theme:

```css
color: rgba(var(--ink-rgb), .65);   /* 65%-opacity ink; flips in dark mode */
border: 1px solid rgba(var(--ink-rgb), .25);
```

Common ink opacities in use: `.7 .65 .6 .55 .5 .45 .4 .3 .25 .18`.

**Fixed (never-invert) tokens** — for elements that must stay dark in *both*
themes (the Contact panel):

| Token | Value |
| --- | --- |
| `--ink-fixed` / `--ink-fixed-rgb` | `#1d2126` / `29,33,38` |
| `--paper-fixed` / `--paper-fixed-rgb` | `#f1f2f3` / `241,242,243` |

> Rule of thumb: content colors use `--ink` / `--paper`. Only the intentionally
> always-dark Contact section uses the `*-fixed` tokens.

---

## 2. Typography

Two self-hosted families, subset by `unicode-range`:

| Family | Role | Where |
| --- | --- | --- |
| **Instrument Serif** (400, + italic) | Display / editorial | Logo, section headings, hero, pull-quotes, taglines, layer names |
| **Libre Franklin** (400/500/600) | Body / UI | Paragraphs, nav, labels, everything else |
| `ui-monospace, Menlo` | Mono accents | Tags, kbd, section markers, tech chips |

**Type scale** (px, as used in markup — not a rigid ramp, but stay near these):

```
11  11.5  12  12.5   → labels, tags, section markers, mono chips
13  13.5  14  14.5   → body copy, card descriptions, italic asides
15  15.5  16  16.5   → lead paragraphs, card titles
17  18  22  24       → pull-quotes, layer detail name, project names
32                   → logo
38                   → section headings (h2)
clamp(24px,2.6vw,34px)  → contact quote
clamp(42px,4.6vw,62px)  → hero headline (fluid)
```

- Headings & display: `font-weight: 400` Instrument Serif (never bold it — the
  serif carries the weight).
- Emphasis inside display text: wrap in `<em style="color:var(--accent)">` —
  italic + accent (e.g. hero "*ensure*").
- Body emphasis: `font-weight: 600` Libre Franklin.
- Italic Instrument Serif is the "voice" style — taglines, lessons, asides.

---

## 3. Layout

- **Shell:** CSS grid `200px 1fr` — sticky left sidebar + scrolling main
  column (`.app-shell`). Collapses to a single column under **820px**.
- **Section padding:** `104px 72px 72px` desktop (top bumped for rhythm),
  `72px 28px` mobile. Sections separated by a `1px solid var(--ink)` bottom
  border.
- **Content width:** cap prose with `max-width` in `em` (`40–52em`) so lines
  don't run too long.
- **Section markers:** each `<section>` has `data-num="NN"` +
  `data-screen-label="…"`; CSS renders `NN / LABEL` in the top-left gutter via
  `::before`. **When adding a section, set both attributes** or the marker
  won't show.

---

## 4. Components & patterns

- **Sidebar masthead:** logo `AG.` (accent period) → italic tagline
  (`est. 2016, still climbing`) → nav → `⌘K` hint + theme toggle pinned bottom
  (`margin-top:auto` on the first pinned control).
- **Nav scroll-spy:** `.nav-link` dims to `rgba(var(--ink-rgb),.4)`;
  `.is-active` goes accent. Driven by an IntersectionObserver in `main.js`.
- **Card rows** (Work / The Climb): a `grid` row with a `1px` top hairline;
  the *last* card in a group carries `border-bottom:1px solid var(--ink)` to
  close the stack. **If you add/remove a last card, move that closing border.**
- **The Stack explorer:** a list of `.layer-row` buttons + a `.layer-detail`
  panel. Data lives in the `#layers-data` JSON `<script>`; `main.js` renders
  the active layer. Supports click + arrow keys, with a swap animation.
- **Command palette (`⌘K`):** overlay in `index.html` (`#cmdk`), logic in
  `main.js`. To add a command, push to the `COMMANDS` array (label, hint, run).
- **Hover states:** converted from the design's `style-hover` to
  `[data-hv="hvN"]:hover` rules in CSS (`hv1` = accent border, `hv2` = paper
  border). Reuse these instead of inline `:hover`.

---

## 5. Motion

Quiet and purposeful. Everything is wrapped for accessibility:

```css
@media (prefers-reduced-motion: reduce) { /* animations disabled */ }
```

- `fadeUp` — hero entrance.
- `panelIn` — Stack detail swap (`.layer-detail.swap`).
- Theme + palette transitions: `.16s–.3s ease`.
- Keep new motion in this register. No parallax, no particles, no auto-play.

---

## 6. Theming (dark mode)

- Toggle in the sidebar; state saved to `localStorage.theme`. **Dark is the
  default** for first-time visitors; a returning visitor's saved choice wins.
- An **inline script in `<head>`** sets `data-theme` *before first paint* to
  avoid a flash — keep it there and inline.
- Because everything is tokenized, dark mode is a single variable swap. A new
  element automatically supports dark mode **if it only uses tokens**.

---

## 7. How to make common changes

- **Edit copy:** find the text in `index.html` and edit in place.
- **Add a project card:** copy an existing card row; keep the closing
  `border-bottom` on whichever card is now last.
- **Add a nav section:** add the `<section id data-num data-screen-label>`, add a
  matching `.nav-link` in the sidebar, and add a `Go to …` entry to `COMMANDS`
  in `main.js`.
- **Change a color globally:** edit the token in `:root` (and its dark
  counterpart). Never search-replace hex values in markup.
- **Bust caches after CSS/JS edits:** the `<link>`/`<script>` carry a
  `?v=YYYYMMDD…` query — bump it so returning visitors get the new file.

---

## 8. Conventions & guardrails

- **Plain static only** — no build step, no framework, no npm. If a change
  needs a bundler, reconsider it.
- **Tokens, not literals** — every color goes through a CSS variable.
- **Progressive enhancement** — the page must read fully with JS disabled; JS
  only *enhances* (scroll-spy, palette, explorer, theme).
- **Self-contained** — no external CDNs, fonts, or scripts. Everything ships in
  the repo (matters for privacy and offline/first-paint).
- **Accessibility** — honor `prefers-reduced-motion`; keep focus styles
  (`:focus-visible`); keep `aria-*` on the palette and toggle.
- **Deploy is live** — pushing `main` publishes immediately. Preview locally
  (`python3 -m http.server`) before merging.

### Known cleanup opportunity

`assets/images/` still contains ~90 images from the **previous** portfolio
(`project-*`, tech-stack logos, `blog-*`, avatars) that this design does **not**
reference. They're kept for now but can be pruned to slim the repo — the current
site only needs `assets/images/new_logo.png` (favicon).
