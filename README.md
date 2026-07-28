# Krivaan Labs Website

A premium, AI-focused company website built with **HTML5, CSS3, and Vanilla JavaScript**. No frameworks, no build tools — just clean, fast, modern web code.

---

## Overview

Krivaan Labs builds AI agents, enterprise APIs, workflow automation platforms, and cloud consulting services for enterprise organisations. This website showcases those capabilities with a design philosophy inspired by OpenAI, Anthropic, Stripe, and Vercel.

---

## Project Structure

```
/
├── index.html           # Homepage (hero, products, solutions, why, stats, team, CTA)
├── about.html           # Mission, values, timeline, team
├── products.html        # AI Agents, Enterprise APIs, Workflow Automation, Cloud Consulting
├── solutions.html       # All solutions + industries
├── careers.html         # Open positions + hiring process
├── contact.html         # Contact form + FAQ
├── privacy.html         # Privacy Policy
├── terms.html           # Terms of Service
├── 404.html             # Custom 404 page
│
├── css/
│   ├── variables.css    # Design tokens (colours, typography, spacing, etc.)
│   ├── style.css        # Layout, components, cards, buttons, navigation
│   ├── animations.css   # Keyframes, scroll-reveal utility classes
│   └── responsive.css   # Breakpoints for all screen sizes
│
├── js/
│   ├── app.js           # Entry point — initialises all modules
│   ├── navigation.js    # Sticky nav, mobile menu, active link
│   ├── animations.js    # IntersectionObserver scroll reveal, counters, parallax
│   ├── particles.js     # Lightweight canvas particle system
│   ├── contact.js       # Form validation + Formspree integration point
│   └── utilities.js     # Debounce, throttle, DOM helpers, toast
│
├── assets/
│   ├── favicon/         # favicon.ico, apple-touch-icon, icon-192, icon-512
│   ├── images/          # OG images (og-home.png etc.)
│   ├── logos/           # Company logos
│   ├── icons/           # SVG icons
│   ├── illustrations/   # Hero illustrations
│   └── fonts/           # Optional self-hosted fonts
│
├── sitemap.xml
├── robots.txt
├── manifest.json
└── README.md
```

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Markup     | HTML5 (semantic)        |
| Styling    | CSS3 custom properties  |
| Animation  | CSS keyframes + JS RAF  |
| Scripting  | Vanilla JS ES6 modules  |
| Fonts      | Google Fonts (Inter, Space Grotesk) |
| Forms      | Formspree (configurable) |

---

## Design System

### Colours

| Token              | Value     | Usage                        |
|--------------------|-----------|------------------------------|
| `--clr-bg`         | `#050816` | Primary background            |
| `--clr-accent`     | `#4F8CFF` | Primary accent (blue)         |
| `--clr-purple`     | `#8B5CF6` | Secondary accent              |
| `--clr-highlight`  | `#00E5A8` | Highlight / success           |
| `--clr-text`       | `#F8FAFC` | Body text                     |

### Typography

- **Display headings**: Space Grotesk (700–800)
- **Body / UI**: Inter (400–600)
- Sizes defined as CSS custom properties `--fs-xs` through `--fs-6xl`

---

## Local Development

No build tools required. Open directly in a browser:

```bash
# Option 1: Open directly
open index.html

# Option 2: Serve with Python (avoids ES module CORS issues)
python3 -m http.server 8080
# then visit http://localhost:8080

# Option 3: VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

> **Important**: Because JavaScript uses ES modules (`type="module"`), you must serve the site via HTTP — not `file://`. Use any local server for development.

---

## GitHub Pages Deployment

### Method 1: Default branch (recommended)

1. Push the contents of this folder to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch**, select `main` (or `master`), root folder `/ (root)`
4. Click **Save**
5. Your site will be live at `https://<username>.github.io/<repo-name>/`

### Method 2: Custom Domain

1. Complete the GitHub Pages setup above
2. In **Settings → Pages → Custom domain**, enter your domain (e.g. `krivaanlabs.com`)
3. At your DNS provider, add:
   - **A records** pointing to GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **CNAME record**: `www` → `<username>.github.io`
4. Enable **Enforce HTTPS** once DNS propagates (up to 24 hours)

### Update canonical URLs

Before deploying, update all `<link rel="canonical">` and `og:url` meta tags in every HTML file to use your actual domain.

---

## Contact Form Setup

The contact form currently runs in demo mode (simulates success). To enable real submissions:

### Option A: Formspree

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form and copy the form ID (e.g. `xpznkqrb`)
3. In `js/contact.js`, update:
   ```js
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpznkqrb'; // your ID
   const BACKEND_ENABLED = true;
   ```

### Option B: Web3Forms

1. Create an account at [web3forms.com](https://web3forms.com) and get an `access_key`
2. Update `js/contact.js` with the Web3Forms endpoint and key

---

## JavaScript Module Reference

| Module          | Exports                                              |
|-----------------|------------------------------------------------------|
| `utilities.js`  | `debounce`, `throttle`, `qs`, `qsa`, `addClass`, `removeClass`, `toggleClass`, `hasClass`, `clamp`, `lerp`, `isValidEmail`, `showToast`, `setLocal`, `getLocal` |
| `navigation.js` | `initNavigation`                                     |
| `animations.js` | `initScrollReveal`, `initStaggerReveal`, `initCounters`, `initHeroParallax`, `initSmoothScroll`, `initTypingEffect` |
| `particles.js`  | `initParticles`                                      |
| `contact.js`    | `initContactForm`, `initNewsletterForm`              |
| `app.js`        | Entry point — imports and calls all inits            |

---

## SEO Checklist

- [x] Unique `<title>` and `<meta name="description">` on every page
- [x] `<link rel="canonical">` on every page
- [x] OpenGraph (`og:title`, `og:description`, `og:url`, `og:image`) on every page
- [x] Twitter Card meta tags on homepage
- [x] JSON-LD structured data (`Organization`) on homepage
- [x] `sitemap.xml` covering all public pages
- [x] `robots.txt` with sitemap reference
- [x] `manifest.json` for PWA metadata
- [x] Semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`, etc.)
- [x] Alt text on all meaningful images
- [x] `aria-label` on all interactive elements

---

## Accessibility

- Semantic HTML5 structure throughout
- ARIA labels on navigation, forms, icons
- `role="alert"` on form error messages
- `role="status"` on form success message
- `aria-expanded` and `aria-controls` on mobile hamburger
- `aria-required` on required form fields
- Visible `:focus-visible` states (2px accent-coloured outline)
- Sufficient colour contrast (text on dark backgrounds)
- `sr-only` class for screen-reader-only text
- `prefers-reduced-motion` media query disables all animations

---

## Performance Notes

- Zero runtime dependencies — no frameworks or libraries
- Canvas particle system paused when tab is hidden (`visibilitychange`)
- IntersectionObserver used for all scroll reveals (no scroll event listeners)
- Images served as inline SVG (no HTTP requests)
- `ResizeObserver` used for canvas sizing
- Google Fonts loaded with `preconnect` + `display=swap`
- No render-blocking resources

---

## Future Roadmap

The architecture is designed to support these features without major refactoring:

| Feature                    | Integration Point                        |
|----------------------------|------------------------------------------|
| Spring Boot backend        | `FORMSPREE_ENDPOINT` → REST API URL      |
| REST API / auth            | Add `api/` path, update nav             |
| Customer dashboard         | New `dashboard/` directory              |
| Admin panel                | New `admin/` directory                  |
| Blog CMS                   | Add `blog/` with JSON data feed         |
| AI chatbot widget          | Inject `<script>` in `<body>`           |
| Payment integration        | Stripe.js in dedicated checkout page    |
| Multi-language             | Add `lang/` directory + i18n JS module  |
| Analytics                  | Add tracking script to `<head>`         |
| Docker deployment          | Add `Dockerfile` + `nginx.conf`         |
| CI/CD                      | Add `.github/workflows/deploy.yml`      |
| Progressive Web App (full) | Add `sw.js` service worker              |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## Licence

Copyright &copy; 2025 Krivaan Labs. All rights reserved.

This codebase is proprietary. You may not use, copy, modify, or distribute any part of it without explicit written permission from Krivaan Labs.

---

*Built with ❤️ by Krivaan Labs — [krivaanlabs.com](https://krivaanlabs.com)*
# homepage
