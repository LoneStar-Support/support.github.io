# LoneStar Support — static website

A production-ready, **GitHub Pages–compatible** site built with HTML, [Tailwind CSS (Play CDN)](https://tailwindcss.com/docs/installation/play-cdn), a small amount of JavaScript, and shared partials loaded via `fetch()`.

## Preview locally

Because navigation and footer are loaded with `fetch()`, open the site through a **local web server** (not as a `file://` URL):

```bash
cd /path/to/support.github.io
python3 -m http.server 8000
```

Then visit `http://localhost:8000/` in your browser.

Alternatives: `npx serve .` or any static file server you prefer.

**Live reload:** `partials/navbar.html` and `partials/footer.html` are fragments only (no document root tags), so tools like Live Server may report that live reload needs a `<head>` / `<body>`. Open [`partials-preview.html`](partials-preview.html) from the same server instead—it’s a small full page that loads those partials the same way the site does. For everything else, use `index.html` or any other full page.

## Deploy on GitHub Pages

1. Push this repository to GitHub (for example branch `main`).
2. In the repo on GitHub: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select branch **`main`** and folder **`/` (root)**, then save.
5. After the first deploy finishes, note the published URL shown in the Pages settings.

### URL shapes

- **Project site** (repo named `support.github.io` under user/org `YOUR-ORG`): typically  
  `https://YOUR-ORG.github.io/support.github.io/`
- **User/organization site** (repo named `YOUR-USERNAME.github.io`): typically  
  `https://YOUR-USERNAME.github.io/`

Replace placeholders in each HTML `<title>`, meta description, and `og:url` with your real domain or GitHub Pages URL.

### Production site URL (`SITE_ORIGIN`)

Use one canonical base URL everywhere crawlers and social platforms resolve links:

- **`https://YOUR-ORG.github.io/support.github.io`** for a **project** site (this repo name), or your custom domain if you add one.
- Search and replace `YOUR-GITHUB-USERNAME` (and this path) in:
  - Every page’s `og:url`, `og:image`, `twitter:image`, and `link rel="canonical"` where present
  - [`sitemap.xml`](sitemap.xml) (`<loc>` entries)
  - [`robots.txt`](robots.txt) (`Sitemap:` line)

### SEO and sharing checklist (new or updated landing pages)

When you add a full HTML page that should be indexed:

1. **Unique** `<title>` (e.g. `Page — LoneStar Support`).
2. **Unique** `<meta name="description">` (one clear sentence).
3. **Open Graph:** `og:title`, `og:description`, `og:type` (`website`), `og:url` (absolute), `og:image` + `og:image:alt`; add `og:image:width` / `og:image:height` if using a fixed card (see [`tools.html`](tools.html) and [`assets/images/og/tools-feelings-wheel.jpg`](assets/images/og/tools-feelings-wheel.jpg)).
4. **Twitter:** `twitter:card` (`summary_large_image` for large images), `twitter:title`, `twitter:description`, `twitter:image` (match `og:image`).
5. Optional: `og:site_name`, `og:locale`, `link rel="canonical"`.
6. Add the page URL to [`sitemap.xml`](sitemap.xml). Do not list `404.html`, `partials-preview.html`, or partial fragments.

**Tools preview image:** [`assets/images/og/tools-feelings-wheel.jpg`](assets/images/og/tools-feelings-wheel.jpg) is a 1200×630 JPEG composed from the vendored feelings wheel artwork for Open Graph / Twitter previews on [`tools.html`](tools.html). Regenerate it if you change the wheel design (see plan: resize wheel on cream background).

### Verification

After deploy, use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and your platform’s card validator on `tools.html`. Confirm [`/sitemap.xml`](sitemap.xml) and [`/robots.txt`](robots.txt) return 200.

## Customize before launch

- Add your **EIN** wherever the site shows “EIN:” (hero on the home page, footer, about, donate trust strip).
- Update `YOUR-GITHUB-USERNAME` strings in Open Graph URLs (or set your production URL).
- Add **Google Analytics**: uncomment the GA snippet in each page’s `<head>` substituting your measurement ID.
- Embed your real **donation form** in `donate.html` inside `#donation-embed-region` (Donorbox, GiveLively, Stripe Checkout, etc.). Give any iframe `title="…"`.
- Swap **Unsplash** placeholders for your own photography and refresh `alt` text.
- **Home photo strip:** images live in `assets/images/autism-hugging/` as `autism-hugging-1.jpg` … `autism-hugging-18.jpg` (duplicated in both rows in `index.html` for the infinite scroll—keep both rows in sync if you add or remove photos).
- Change **contact email** and phone in `contact.html` (mailto + visible text).

## Legal pages (REVIEW BEFORE PUBLIC LAUNCH)

[`privacy.html`](privacy.html), [`terms.html`](terms.html), and [`accessibility.html`](accessibility.html) are AI-drafted **starter text** in LoneStar's voice. They are deliberately conservative, but they are **not** a substitute for attorney review:

- Have a Texas nonprofit attorney review `privacy.html` and `terms.html` before launch. The State Bar of Texas's [Texas C-BAR](https://www.texasbar.com/AM/Template.cfm?Section=Texas_C_BAR) program offers free or reduced-cost reviews for 501(c)(3) organizations.
- Both pages carry a `<!-- TODO(legal-review) -->` comment marking them as drafts.
- The Tools page ([`tools.html`](tools.html)) carries a single visible safety banner replacing the previously-hidden tool-level disclaimers in `assets/breath/`, `assets/feelings-wheel/`, and `assets/agree4me/`.
- The Donate page ([`donate.html`](donate.html)) carries a Stripe/IRS-aligned disclosure block (entity, "no goods or services", refund/cancellation policy) directly below the `#donation-embed-region` Stripe placeholder.
- Footer legal links live in [`partials/footer.html`](partials/footer.html) as a middle segment of the existing copyright row.
- Once GA is enabled in [`assets/js/includes.js`](assets/js/includes.js), revisit the Privacy Policy's cookie/tracking section and add a visible cookie disclosure if your visitor mix includes EU/UK or California residents.

## File map

- Pages: `index.html`, `about.html`, `impact.html`, `volunteers.html`, `stories.html`, `tools.html`, `donate.html`, `contact.html`, `privacy.html`, `terms.html`, `accessibility.html`, `404.html`; `partials-preview.html` (dev shell for navbar/footer only)
- SEO: `sitemap.xml`, `robots.txt`, `assets/images/og/tools-feelings-wheel.jpg` (Open Graph / Twitter image for Tools)
- Shared fragments: `partials/navbar.html`, `partials/footer.html`
- JS: `assets/js/includes.js` (loads partials + mobile menu)
- CSS: `css/site.css` (tokens, smooth scroll, skip link, light motion)
- Vendored embed: `assets/breath/` (`index.html`, `app.js`, `patterns.js`, `styles.css`) — breathing UI adapted from [breath4me.github.io](https://github.com/ButterflyGroup/breath4me.github.io) (no service worker). Update this bundle manually when you want to stay in sync with upstream behavior.
- Vendored embed: `assets/feelings-wheel/` (`index.html`, `wheel.js`, `toggle-styles.css`, wheel images) — spinnable wheel adapted from [feelingswheel.com](https://feelingswheel.com/) (see on-page attribution to Geoffrey Roberts and Lily Smith). This copy omits third-party analytics; port changes manually if you want to stay aligned with the live site.
- Vendored embed: `assets/agree4me/` (`index.html`, `script.js`, `styles.css`, `apple-touch-icon.png`, plus bundled `signature_pad.umd.min.js` and `html2pdf.bundle.min.js` with sidecar LICENSE) — Belief Agreement Generator adapted from [agree4me.com](https://agree4me.com/). This copy bundles its third-party libraries locally (zero CDN calls at runtime) and omits the upstream PWA manifest, JSON-LD schema, theme-color, and standalone OG metadata. Update this bundle manually when you want to stay aligned with upstream behavior.

## License / use

Content and code are for the LoneStar Support project; adjust as needed for your organization’s policies.
