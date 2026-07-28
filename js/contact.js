/**
 * Krivaan Labs – Contact Form
 * Client-side validation and Formspree/Web3Forms integration point.
 */

'use strict';

import { qs, qsa, addClass, removeClass, isValidEmail, showToast } from './utilities.js';

// ── Config ────────────────────────────────────────────────────────────────
// Replace FORMSPREE_ID with your actual Formspree form ID, e.g. "xpznkqrb"
// OR replace with Web3Forms access_key
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/FORMSPREE_ID';

// Set to false until a real endpoint is configured
const BACKEND_ENABLED = false;

// ── Field validators ─────────────────────────────────────────────────────

const validators = {
  name:    v => v.trim().length >= 2 ? null : 'Please enter your full name (min 2 chars).',
  email:   v => isValidEmail(v) ? null : 'Please enter a valid email address.',
  company: _ => null, // optional
  subject: v => v.trim().length >= 3 ? null : 'Please enter a subject (min 3 chars).',
  message: v => v.trim().length >= 20 ? null : 'Message must be at least 20 characters.',
};

// ── Show / clear field error ──────────────────────────────────────────────

function setError(input, message) {
  addClass(input, 'is-error');
  const errorEl = input.parentElement.querySelector('.form-error');
  if (errorEl) {
    errorEl.textContent = message;
    addClass(errorEl, 'is-visible');
  }
}

function clearError(input) {
  removeClass(input, 'is-error');
  const errorEl = input.parentElement.querySelector('.form-error');
  if (errorEl) removeClass(errorEl, 'is-visible');
}

// ── Validate entire form ──────────────────────────────────────────────────

function validateForm(form) {
  let valid = true;

  Object.keys(validators).forEach(name => {
    const input = form.elements[name];
    if (!input) return;
    const error = validators[name](input.value);
    if (error) {
      setError(input, error);
      valid = false;
    } else {
      clearError(input);
    }
  });

  return valid;
}

// ── Submit handler ────────────────────────────────────────────────────────

async function handleSubmit(form, successEl) {
  const submitBtn = qs('[type="submit"]', form);

  // Disable button + show loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.dataset.originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
  }

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  if (!BACKEND_ENABLED) {
    // Simulate successful submission (demo mode)
    await new Promise(r => setTimeout(r, 1200));
    showSuccessState(form, successEl);
    return;
  }

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      showSuccessState(form, successEl);
    } else {
      const body = await res.json().catch(() => ({}));
      const msg  = body.errors?.map(e => e.message).join(', ') || 'Submission failed. Please try again.';
      showToast(msg, 'error');
    }
  } catch (_) {
    showToast('Network error. Please check your connection and try again.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.originalText || 'Send Message';
    }
  }
}

function showSuccessState(form, successEl) {
  form.style.display = 'none';
  if (successEl) {
    successEl.classList.add('is-visible');
    successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  showToast('Message sent! We will get back to you soon.', 'success');
}

// ── Init ──────────────────────────────────────────────────────────────────

export function initContactForm() {
  const form      = qs('#contact-form');
  const successEl = qs('#form-success');
  if (!form) return;

  // Live validation on blur
  qsa('input, textarea, select', form).forEach(input => {
    input.addEventListener('blur', () => {
      const name = input.name;
      if (validators[name]) {
        const error = validators[name](input.value);
        if (error) setError(input, error);
        else        clearError(input);
      }
    });

    // Clear error on input
    input.addEventListener('input', () => clearError(input));
  });

  // Submit
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm(form)) {
      handleSubmit(form, successEl);
    }
  });
}

// ── Newsletter form (footer) ──────────────────────────────────────────────

export function initNewsletterForm() {
  const form = qs('#newsletter-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input) return;

    if (!isValidEmail(input.value)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    showToast('You\'re subscribed! Thanks for joining.', 'success');
    input.value = '';
  });
}
