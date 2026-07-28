/**
 * Krivaan Labs – Animations
 * Scroll-reveal (IntersectionObserver), counter animation, hero parallax.
 */

'use strict';

import { qs, qsa, addClass, throttle } from './utilities.js';

// ── Scroll Reveal ─────────────────────────────────────────────────────────

export function initScrollReveal() {
  const elements = qsa('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          addClass(entry.target, 'is-visible');
          // Unobserve after first reveal for performance
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}

// ── Staggered children reveal ─────────────────────────────────────────────

export function initStaggerReveal() {
  const parents = qsa('.stagger-children');
  if (!parents.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = Array.from(entry.target.children);
          children.forEach(child => {
            addClass(child, 'reveal');
            // Short delay so the class is registered before is-visible
            requestAnimationFrame(() => addClass(child, 'is-visible'));
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  parents.forEach(p => observer.observe(p));
}

// ── Counter Animation ─────────────────────────────────────────────────────

/**
 * Animate a number counting up from 0 to target.
 * @param {HTMLElement} el – element whose text content is updated
 * @param {number} target
 * @param {number} duration – ms
 * @param {string} [suffix] – appended after the number (e.g. '+', 'x')
 */
function animateCounter(el, target, duration = 1800, suffix = '') {
  const start = performance.now();
  const isFloat = String(target).includes('.');
  const decimals = isFloat ? (String(target).split('.')[1] || '').length : 0;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    const current = isFloat
      ? (eased * target).toFixed(decimals)
      : Math.round(eased * target);
    el.textContent = current + suffix;

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }

  requestAnimationFrame(step);
}

export function initCounters() {
  const counters = qsa('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const dur    = parseInt(el.dataset.duration || '1800', 10);
          animateCounter(el, target, dur, suffix);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

// ── Hero Parallax ─────────────────────────────────────────────────────────

export function initHeroParallax() {
  const hero = qs('.hero');
  if (!hero) return;

  const orbs = qsa('.aurora__orb');
  const illustration = qs('.hero__illustration');

  const handleMouseMove = throttle(e => {
    const { innerWidth: W, innerHeight: H } = window;
    const mx = (e.clientX / W - 0.5); // -0.5 to 0.5
    const my = (e.clientY / H - 0.5);

    orbs.forEach((orb, i) => {
      const depth = 0.02 + i * 0.015;
      orb.style.transform = `translate(${mx * depth * 120}px, ${my * depth * 80}px) scale(${1 + Math.abs(mx) * 0.04})`;
    });

    if (illustration) {
      illustration.style.transform = `translate(${mx * 12}px, ${my * 10}px)`;
    }
  }, 16);

  hero.addEventListener('mousemove', handleMouseMove, { passive: true });
}

// ── Smooth scroll for anchor links ────────────────────────────────────────

export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ── Typing / headline text effect (optional) ──────────────────────────────

export function initTypingEffect(selector = '.hero__type-text', words = [], interval = 2800) {
  const el = qs(selector);
  if (!el || !words.length) return;

  let idx = 0;
  el.textContent = words[0];

  function next() {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    el.style.transition = 'opacity 0.3s, transform 0.3s';
    setTimeout(() => {
      idx = (idx + 1) % words.length;
      el.textContent = words[idx];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 320);
  }

  setInterval(next, interval);
}
