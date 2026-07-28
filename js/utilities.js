/**
 * Krivaan Labs – Utilities
 * Shared helpers: debounce, throttle, DOM, events, formatting.
 */

'use strict';

// ── Debounce ─────────────────────────────────────────────────────────────

/**
 * Returns a debounced version of fn that fires after `wait` ms of inactivity.
 * @param {Function} fn
 * @param {number} wait
 */
export function debounce(fn, wait = 200) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

// ── Throttle ─────────────────────────────────────────────────────────────

/**
 * Returns a throttled version of fn that fires at most once per `limit` ms.
 * @param {Function} fn
 * @param {number} limit
 */
export function throttle(fn, limit = 100) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

// ── DOM helpers ───────────────────────────────────────────────────────────

/**
 * Shorthand querySelector.
 * @param {string} sel
 * @param {Element} [ctx=document]
 */
export const qs = (sel, ctx = document) => ctx.querySelector(sel);

/**
 * Shorthand querySelectorAll (returns real Array).
 * @param {string} sel
 * @param {Element} [ctx=document]
 */
export const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/**
 * Add class(es) to an element (null-safe).
 */
export function addClass(el, ...classes) {
  if (el) el.classList.add(...classes);
}

/**
 * Remove class(es) from an element (null-safe).
 */
export function removeClass(el, ...classes) {
  if (el) el.classList.remove(...classes);
}

/**
 * Toggle a class on an element (null-safe).
 */
export function toggleClass(el, cls) {
  if (el) el.classList.toggle(cls);
}

/**
 * Check if element has a class (null-safe).
 */
export function hasClass(el, cls) {
  return el ? el.classList.contains(cls) : false;
}

// ── requestAnimationFrame helper ─────────────────────────────────────────

/**
 * Request animation frame with promise support.
 */
export function raf(fn) {
  return requestAnimationFrame(fn);
}

// ── Number helpers ────────────────────────────────────────────────────────

/**
 * Clamp a value between min and max.
 */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Linear interpolation.
 */
export const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Map a value from one range to another.
 */
export function mapRange(val, inMin, inMax, outMin, outMax) {
  return ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

// ── String helpers ────────────────────────────────────────────────────────

/**
 * Validate an email address.
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── Event helpers ─────────────────────────────────────────────────────────

/**
 * Add multiple events to an element at once.
 * @param {Element} el
 * @param {string[]} events
 * @param {Function} handler
 * @param {object} [options]
 */
export function onEvents(el, events, handler, options) {
  if (!el) return;
  events.forEach(evt => el.addEventListener(evt, handler, options));
}

// ── Storage helpers ───────────────────────────────────────────────────────

export function setLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* noop */ }
}

export function getLocal(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch (_) { return fallback; }
}

// ── Toast notifications ───────────────────────────────────────────────────

/**
 * Display a toast message.
 * @param {string} message
 * @param {'success'|'error'|'info'} [type='info']
 * @param {number} [duration=4000]
 */
export function showToast(message, type = 'info', duration = 4000) {
  let container = qs('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');

  const icons = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00E5A8"><path d="M20 6L9 17l-5-5"/></svg>`,
    error:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#f87171"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#4F8CFF"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  };

  toast.innerHTML = `
    ${icons[type] || icons.info}
    <span class="toast__message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
