/**
 * Krivaan Labs – Navigation
 * Sticky nav, mobile menu, active link, scroll-to-top.
 */

'use strict';

import { qs, qsa, addClass, removeClass, hasClass, throttle } from './utilities.js';

export function initNavigation() {
  const nav       = qs('.nav');
  const hamburger = qs('.nav__hamburger');
  const navLinks  = qs('.nav__links');

  if (!nav) return;

  // ── Sticky / scroll behaviour ───────────────────────────────────────────

  const handleScroll = throttle(() => {
    const scrolled = window.scrollY > 20;
    if (scrolled) addClass(nav, 'is-scrolled');
    else           removeClass(nav, 'is-scrolled');
  }, 50);

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  // ── Mobile hamburger ────────────────────────────────────────────────────

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = hasClass(hamburger, 'is-open');
      hamburger.classList.toggle('is-open');
      navLinks.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on nav link click
    qsa('a', navLinks).forEach(link => {
      link.addEventListener('click', () => {
        removeClass(hamburger, 'is-open');
        removeClass(navLinks, 'is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (
        hasClass(navLinks, 'is-open') &&
        !nav.contains(e.target)
      ) {
        removeClass(hamburger, 'is-open');
        removeClass(navLinks, 'is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && hasClass(navLinks, 'is-open')) {
        removeClass(hamburger, 'is-open');
        removeClass(navLinks, 'is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Active link ─────────────────────────────────────────────────────────

  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  qsa('.nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkPath = href.replace(/\/$/, '');
    // exact match or index
    if (
      linkPath === currentPath ||
      (currentPath.endsWith(linkPath) && linkPath !== '' && linkPath !== '/')
    ) {
      addClass(link, 'is-active');
    }
    // index.html / root
    if ((currentPath === '/' || currentPath.endsWith('index.html')) && (linkPath === '/' || linkPath === '' || linkPath === 'index.html')) {
      addClass(link, 'is-active');
    }
  });
}
