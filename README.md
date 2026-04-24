# Strawberina — Memecoin Landing Page

Static single-page site. No build step. Drop into any static host.

## Setup

1. Save the two mascot images into `images/`:
   - `images/strawberina-hero.jpg` — the theater-stage banner (the one with the gold "Strawberina" lettering + fruit audience)
   - `images/strawberina.jpg` — the portrait (strawberry queen with rose on the red velvet throne)
   - Optional: `images/favicon.png` — small square icon (e.g. 64x64)
2. Open `index.html` in a browser to preview locally.

## Deploy

- **Vercel**: drag the folder into the Vercel dashboard, done.
- **Netlify**: drag-and-drop onto https://app.netlify.com/drop.
- **Cloudflare Pages / GitHub Pages**: push to a repo, connect.
- **Any cheap static host**: upload the files via FTP.

## What to edit later

- **DexScreener link**: in `index.html` search for `"DexScreener"` → replace the `href="#"` on that `.link-card` with the real URL and remove `soon` class / `aria-disabled`.
- **Telegram** (if you add one): copy the pattern from the X link in header + community section.
- **Contract address**: lives in 3 spots — update all via find/replace: `2U7FD2ySFKGgBhQP44r2ZWzUFD1yd9LqbDhjttKZpump`.
- **Pump.fun link**: same — find/replace if the URL ever changes.

## Files

- `index.html` — markup + all content
- `styles.css` — all styling (dark wine + gold theme)
- `script.js` — copy-to-clipboard + scroll reveal
- `images/` — mascot art
