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

## Customize before launch

- Add your **EIN** wherever the site shows “EIN:” (hero on the home page, footer, about, donate trust strip).
- Update `YOUR-GITHUB-USERNAME` strings in Open Graph URLs (or set your production URL).
- Add **Google Analytics**: uncomment the GA snippet in each page’s `<head>` substituting your measurement ID.
- Embed your real **donation form** in `donate.html` inside `#donation-embed-region` (Donorbox, GiveLively, Stripe Checkout, etc.). Give any iframe `title="…"`.
- Swap **Unsplash** placeholders for your own photography and refresh `alt` text.
- **Home photo strip:** images live in `assets/images/autism-hugging/` as `autism-hugging-1.jpg` … `autism-hugging-18.jpg` (duplicated in both rows in `index.html` for the infinite scroll—keep both rows in sync if you add or remove photos).
- Change **contact email** and phone in `contact.html` (mailto + visible text).

## File map

- Pages: `index.html`, `about.html`, `impact.html`, `volunteers.html`, `stories.html`, `tools.html`, `donate.html`, `contact.html`, `404.html`; `partials-preview.html` (dev shell for navbar/footer only)
- Shared fragments: `partials/navbar.html`, `partials/footer.html`
- JS: `assets/js/includes.js` (loads partials + mobile menu)
- CSS: `css/site.css` (tokens, smooth scroll, skip link, light motion)
- Vendored embed: `assets/breath/` (`index.html`, `app.js`, `patterns.js`, `styles.css`) — breathing UI adapted from [breath4me.github.io](https://github.com/ButterflyGroup/breath4me.github.io) (no service worker). Update this bundle manually when you want to stay in sync with upstream behavior.
- Vendored embed: `assets/feelings-wheel/` (`index.html`, `wheel.js`, `toggle-styles.css`, wheel images) — spinnable wheel adapted from [feelingswheel.com](https://feelingswheel.com/) (see on-page attribution to Geoffrey Roberts and Lily Smith). This copy omits third-party analytics; port changes manually if you want to stay aligned with the live site.

## License / use

Content and code are for the LoneStar Support project; adjust as needed for your organization’s policies.
