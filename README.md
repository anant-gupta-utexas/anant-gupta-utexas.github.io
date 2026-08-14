# anant-gupta-utexas.github.io

Personal portfolio — [anant-gupta-utexas.github.io](https://anant-gupta-utexas.github.io).

Staff AI Engineer / Data Scientist at Walmart Global Tech. I build AI systems
for production, with a focus on evaluation, agentic systems, and the
infrastructure teams need to run them reliably.

## Stack

Hand-authored static site. No framework, no build step, no external requests.

- `index.html` — all content and structure
- `assets/css/style.css` — design tokens + component styles (dark canonical, light override)
- `assets/js/main.js` — progressive enhancement (theme toggle, scroll-spy)
- `assets/fonts/` — self-hosted WOFF2 (Cormorant Garamond, Inter, IBM Plex Mono)

The visual system — tokens, type roles, layout rules, component specs — is
documented in [DESIGN.md](DESIGN.md). Read it before making visual changes.

## Local development

Serve the repo root with any static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. There is nothing to install or compile.

When `style.css` or `main.js` change, bump the `?v=` token on their links in
`index.html` so returning visitors don't get a stale cached copy.

## Deploy

GitHub Pages serves `main` at the repo root. Pushing to `main` deploys the
live site within about a minute — treat every push as a production deploy.
