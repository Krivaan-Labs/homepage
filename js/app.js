/**
 * Krivaan Labs – App Entry Point
 * Initialises all modules after DOM is ready.
 */

'use strict';

import { initNavigation }   from './navigation.js';
import { initScrollReveal, initStaggerReveal, initCounters, initHeroParallax, initSmoothScroll } from './animations.js';
import { initParticles }    from './particles.js';
import { initContactForm, initNewsletterForm } from './contact.js';

document.addEventListener('DOMContentLoaded', () => {
  // Core
  initNavigation();
  initSmoothScroll();

  // Animations
  initScrollReveal();
  initStaggerReveal();
  initCounters();
  initHeroParallax();

  // Hero particles (only on pages that have the canvas)
  initParticles('particles-canvas');

  // Forms
  initContactForm();
  initNewsletterForm();
});
