/**
 * Krivaan Labs – Particles
 * Lightweight canvas particle system for the hero background.
 */

'use strict';

export function initParticles(canvasId = 'particles-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, particles = [], animId;

  // ── Config ───────────────────────────────────────────────────────────────

  const CONFIG = {
    count:      80,
    minRadius:  0.8,
    maxRadius:  2.4,
    minSpeed:   0.08,
    maxSpeed:   0.35,
    colors:     ['#4F8CFF', '#8B5CF6', '#00E5A8', '#93b8ff'],
    connectDist:140,
    connectOpacity: 0.12,
    fadeEdge:   0.15,   // fraction of canvas to fade at edges
  };

  // ── Resize ───────────────────────────────────────────────────────────────

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    width  = rect.width;
    height = rect.height;
    canvas.width  = width  * dpr;
    canvas.height = height * dpr;
    canvas.style.width  = width  + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  // ── Particle factory ─────────────────────────────────────────────────────

  function createParticle() {
    const r = CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius);
    const angle = Math.random() * Math.PI * 2;
    const speed = CONFIG.minSpeed + Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed);
    return {
      x:  Math.random() * width,
      y:  Math.random() * height,
      r,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
      opacity: 0.3 + Math.random() * 0.5,
    };
  }

  function initParticleSet() {
    particles = Array.from({ length: CONFIG.count }, createParticle);
  }

  // ── Edge opacity helper ───────────────────────────────────────────────────

  function edgeAlpha(p) {
    const ex = CONFIG.fadeEdge * width;
    const ey = CONFIG.fadeEdge * height;
    const fx = p.x < ex ? p.x / ex : p.x > width - ex  ? (width  - p.x) / ex : 1;
    const fy = p.y < ey ? p.y / ey : p.y > height - ey ? (height - p.y) / ey : 1;
    return Math.min(fx, fy, 1);
  }

  // ── Draw ──────────────────────────────────────────────────────────────────

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.connectDist) {
          const alpha = CONFIG.connectOpacity * (1 - dist / CONFIG.connectDist);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(79,140,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      const alpha = p.opacity * edgeAlpha(p);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.round(alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
    });
  }

  // ── Update ────────────────────────────────────────────────────────────────

  function update() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      // Wrap around edges
      if (p.x < -10)        p.x = width  + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10)        p.y = height + 10;
      if (p.y > height + 10) p.y = -10;
    });
  }

  // ── Loop ─────────────────────────────────────────────────────────────────

  function loop() {
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  // ── Mouse parallax (subtle) ───────────────────────────────────────────────

  let mouseX = width / 2, mouseY = height / 2;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Subtly nudge particles toward cursor
    particles.forEach(p => {
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        p.vx += dx / dist * 0.005;
        p.vy += dy / dist * 0.005;
        // Clamp speed
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > CONFIG.maxSpeed * 2) {
          p.vx = (p.vx / spd) * CONFIG.maxSpeed * 2;
          p.vy = (p.vy / spd) * CONFIG.maxSpeed * 2;
        }
      }
    });
  }, { passive: true });

  // ── Resize observer ───────────────────────────────────────────────────────

  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(animId);
    resize();
    initParticleSet();
    loop();
  });
  ro.observe(canvas.parentElement);

  // ── Init ─────────────────────────────────────────────────────────────────

  resize();
  initParticleSet();
  loop();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else loop();
  });
}
