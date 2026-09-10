/**
 * apple-design.js — Apple Fluid Physics & Direct Manipulation Engine
 * Implements WWDC "Designing Fluid Interfaces" principles for the web:
 *  - 1:1 direct pointer tracking with offset preservation
 *  - Analytical interruptible spring physics (damping ratio + response)
 *  - Momentum projection via exponential decay
 *  - Rubber-banding soft boundary resistance
 *  - Zero-latency pointerdown response
 *  - Gesture-driven Apple Bottom Sheet & Carousel Inertia
 */

(function (window, document) {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // 1. APPLE PHYSICS ENGINE
  // ─────────────────────────────────────────────────────────────
  const ApplePhysics = {
    /**
     * Momentum projection via exponential decay (WWDC 2018 sample code)
     * @param {number} initialVelocity - Pixels per second
     * @param {number} decelerationRate - 0.998 for standard iOS scroll feel, 0.99 for snappier
     * @returns {number} Projected resting offset in pixels
     */
    project(initialVelocity, decelerationRate = 0.998) {
      return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
    },

    /**
     * Apple Rubber-Banding progressive soft boundary resistance
     * @param {number} overshoot - Distance beyond boundary in px
     * @param {number} dimension - Container dimension (width or height) in px
     * @param {number} constant - Default 0.55
     * @returns {number} Resisted displacement in px
     */
    rubberband(overshoot, dimension, constant = 0.55) {
      if (dimension <= 0) return 0;
      const absOvershoot = Math.abs(overshoot);
      const res = (absOvershoot * dimension * constant) / (dimension + constant * absOvershoot);
      return overshoot < 0 ? -res : res;
    },

    /**
     * Subtle multimodal haptic feedback with graceful fallback
     * @param {('light'|'medium'|'heavy'|'selection'|'success'|'warning')} type
     */
    haptic(type = 'light') {
      if (!('vibrate' in navigator)) return;
      try {
        const patterns = {
          light: [8],
          medium: [18],
          heavy: [28],
          selection: [5],
          success: [10, 40, 15],
          warning: [20, 50, 20],
        };
        navigator.vibrate(patterns[type] || [10]);
      } catch (e) {
        // Vibration not permitted in non-user gesture contexts
      }
    },

    /**
     * Analytical Spring Solver with Interruption and Velocity Handoff
     * @param {object} options
     * @param {number} options.from - Initial value
     * @param {number} options.to - Target value
     * @param {number} [options.velocity=0] - Initial velocity in px/s
     * @param {number} [options.damping=1.0] - Damping ratio (1.0 = critically damped, <1 = bouncy)
     * @param {number} [options.response=0.35] - Response time in seconds (stiffness proxy)
     * @param {function} options.onUpdate - Callback receives current value and velocity
     * @param {function} [options.onComplete] - Callback on settle
     * @returns {object} Controller with stop() method
     */
    spring({ from, to, velocity = 0, damping = 1.0, response = 0.35, onUpdate, onComplete }) {
      // Respect prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        onUpdate(to, 0);
        if (onComplete) onComplete();
        return { stop: () => {} };
      }

      let active = true;
      let animId = null;

      const omega0 = (2 * Math.PI) / Math.max(response, 0.05); // Natural angular frequency
      const zeta = damping; // Damping ratio
      let currentVal = from;
      let currentVel = velocity;
      let lastTime = performance.now();

      const step = (now) => {
        if (!active) return;
        const dt = Math.min((now - lastTime) / 1000, 0.064); // Cap max dt to avoid tunneling
        lastTime = now;

        const x = currentVal - to; // Displacement from target

        if (zeta >= 1.0) {
          // Critically damped or over-damped
          const decay = Math.exp(-omega0 * dt);
          const c1 = x;
          const c2 = currentVel + omega0 * x;
          currentVal = to + (c1 + c2 * dt) * decay;
          currentVel = (c2 - omega0 * (c1 + c2 * dt)) * decay;
        } else {
          // Under-damped (oscillates / bounces slightly)
          const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
          const decay = Math.exp(-zeta * omega0 * dt);
          const c1 = x;
          const c2 = (currentVel + zeta * omega0 * x) / omegaD;
          const cos = Math.cos(omegaD * dt);
          const sin = Math.sin(omegaD * dt);
          currentVal = to + decay * (c1 * cos + c2 * sin);
          currentVel = decay * (-zeta * omega0 * (c1 * cos + c2 * sin) + omegaD * (-c1 * sin + c2 * cos));
        }

        onUpdate(currentVal, currentVel);

        // Settlement threshold check: both position and velocity within fine bounds
        if (Math.abs(currentVal - to) < 0.25 && Math.abs(currentVel) < 5) {
          active = false;
          onUpdate(to, 0);
          if (onComplete) onComplete();
        } else {
          animId = requestAnimationFrame(step);
        }
      };

      animId = requestAnimationFrame(step);

      return {
        stop: () => {
          active = false;
          if (animId) cancelAnimationFrame(animId);
        },
        getCurrent: () => ({ value: currentVal, velocity: currentVel }),
      };
    },
  };

  // ─────────────────────────────────────────────────────────────
  // 2. GESTURE TRACKER (1:1 Tracking & Velocity Measurement)
  // ─────────────────────────────────────────────────────────────
  class VelocityTracker {
    constructor() {
      this.history = [];
    }

    add(position, time = performance.now()) {
      this.history.push({ position, time });
      // Keep only recent points within ~100ms
      while (this.history.length > 1 && time - this.history[0].time > 100) {
        this.history.shift();
      }
    }

    getVelocity() {
      if (this.history.length < 2) return 0;
      const first = this.history[0];
      const last = this.history[this.history.length - 1];
      const dt = (last.time - first.time) / 1000;
      if (dt <= 0.001) return 0;
      return (last.position - first.position) / dt; // px/s
    }

    reset() {
      this.history = [];
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 3. APPLE GESTURE BOTTOM SHEET & QUICK INSPECTOR
  // ─────────────────────────────────────────────────────────────
  class AppleSheetController {
    constructor() {
      this.sheetEl = null;
      this.scrimEl = null;
      this.handleEl = null;
      this.isOpen = false;
      this.currentY = 0;
      this.sheetHeight = 520;
      this.activeSpring = null;
      this.tracker = new VelocityTracker();
      this.isDragging = false;
      this.grabOffsetY = 0;
      this.startPointerY = 0;
    }

    init() {
      if (document.getElementById('apple-quick-sheet')) {
        this.sheetEl = document.getElementById('apple-quick-sheet');
        this.scrimEl = document.getElementById('apple-quick-scrim');
        this.handleEl = this.sheetEl.querySelector('.apple-sheet-handle-zone');
        this.bindEvents();
        return;
      }

      // Create Scrim
      this.scrimEl = document.createElement('div');
      this.scrimEl.id = 'apple-quick-scrim';
      this.scrimEl.className = 'apple-sheet-scrim';
      document.body.appendChild(this.scrimEl);

      // Create Sheet
      this.sheetEl = document.createElement('div');
      this.sheetEl.id = 'apple-quick-sheet';
      this.sheetEl.className = 'apple-sheet';
      this.sheetEl.setAttribute('role', 'dialog');
      this.sheetEl.setAttribute('aria-modal', 'true');
      this.sheetEl.setAttribute('aria-label', 'Archive Quick Settings and Companion');

      this.sheetEl.innerHTML = `
        <div class="apple-sheet-handle-zone" title="Drag down to dismiss">
          <div class="apple-sheet-pill"></div>
        </div>
        <div class="apple-sheet-header">
          <h3 class="apple-sheet-title">
            <span>✨</span>
            <span>Archive Quick Companion</span>
          </h3>
          <button class="apple-sheet-close-btn" aria-label="Close" data-apple-close>×</button>
        </div>
        <div class="apple-sheet-body">
          
          <!-- Atmosphere Switcher -->
          <div class="apple-setting-group">
            <div class="apple-setting-group-title">Reading Atmosphere</div>
            <div class="apple-setting-row">
              <span class="apple-setting-label">Sanctuary Theme</span>
              <div class="apple-segmented-control" role="group" aria-label="Select Theme">
                <button class="apple-segment-btn" data-sheet-theme="dark">🌙 Dark</button>
                <button class="apple-segment-btn" data-sheet-theme="paper">📜 Paper</button>
                <button class="apple-segment-btn" data-sheet-theme="sepia">🏺 Sepia</button>
              </div>
            </div>
          </div>

          <!-- Typography Optical Scaling -->
          <div class="apple-setting-group">
            <div class="apple-setting-group-title">Scholarly Typography</div>
            <div class="apple-setting-row">
              <span class="apple-setting-label">Type Scale</span>
              <div class="apple-segmented-control" role="group" aria-label="Adjust Type Scale">
                <button class="apple-segment-btn" data-typescale="compact">Compact</button>
                <button class="apple-segment-btn active" data-typescale="balanced">Balanced</button>
                <button class="apple-segment-btn" data-typescale="large">Generous</button>
              </div>
            </div>
          </div>

          <!-- Direct Works Teleport -->
          <div class="apple-setting-group">
            <div class="apple-setting-group-title">Instant Treatise Teleport</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <a href="archive.html?search=Annihilation%20of%20Caste" class="btn btn-secondary btn-sm" style="font-size:0.8rem;justify-content:flex-start;padding:8px 12px;">
                <span>⚡ Caste (1936)</span>
              </a>
              <a href="archive.html?search=Buddha%20and%20His%20Dhamma" class="btn btn-secondary btn-sm" style="font-size:0.8rem;justify-content:flex-start;padding:8px 12px;">
                <span>☸️ Dhamma (1957)</span>
              </a>
              <a href="constitution.html" class="btn btn-secondary btn-sm" style="font-size:0.8rem;justify-content:flex-start;padding:8px 12px;">
                <span>🏛️ Constitution</span>
              </a>
              <a href="timeline.html#1927" class="btn btn-secondary btn-sm" style="font-size:0.8rem;justify-content:flex-start;padding:8px 12px;">
                <span>💧 Mahad (1927)</span>
              </a>
            </div>
          </div>

          <!-- Quick Shortcuts & Info -->
          <div class="apple-setting-group" style="background:rgba(212,175,55,0.06);border-color:rgba(212,175,55,0.18);">
            <div class="apple-setting-row">
              <div>
                <div style="font-weight:600;font-size:0.875rem;color:var(--gold);">Fluid Pro-Tips</div>
                <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
                  Press <kbd style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;">Cmd</kbd>+<kbd style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;">K</kbd> anytime for Spotlight. Swipe down on this pill to flick dismiss.
                </div>
              </div>
            </div>
          </div>

        </div>
      `;

      document.body.appendChild(this.sheetEl);
      this.handleEl = this.sheetEl.querySelector('.apple-sheet-handle-zone');

      // Create Floating Quick Capsule Trigger Button
      this.createFloatingTrigger();
      this.bindEvents();
    }

    createFloatingTrigger() {
      if (document.getElementById('apple-quick-trigger')) return;
      const trigger = document.createElement('button');
      trigger.id = 'apple-quick-trigger';
      trigger.className = 'apple-quick-pill';
      trigger.setAttribute('aria-label', 'Open Archive Companion');
      trigger.innerHTML = `
        <span class="apple-icon" aria-hidden="true">⚜️</span>
        <span>Quick Companion</span>
      `;
      trigger.addEventListener('click', () => {
        ApplePhysics.haptic('light');
        this.open();
      });
      document.body.appendChild(trigger);
    }

    bindEvents() {
      // Close button and scrim click
      this.scrimEl.addEventListener('click', () => this.close());
      const closeBtn = this.sheetEl.querySelector('[data-apple-close]');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          ApplePhysics.haptic('selection');
          this.close();
        });
      }

      // Keyboard Esc
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Sheet Themes
      this.sheetEl.querySelectorAll('[data-sheet-theme]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const theme = btn.dataset.sheetTheme;
          ApplePhysics.haptic('selection');
          if (window.AppState && window.AppState.setSiteTheme) {
            window.AppState.setSiteTheme(theme, true);
          } else {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('site_theme', theme);
          }
          this.updateActiveThemeButtons();
        });
      });

      // Type Scale Buttons
      this.sheetEl.querySelectorAll('[data-typescale]').forEach((btn) => {
        btn.addEventListener('click', () => {
          ApplePhysics.haptic('selection');
          const scale = btn.dataset.typescale;
          this.sheetEl.querySelectorAll('[data-typescale]').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          if (scale === 'compact') {
            document.documentElement.style.fontSize = '93.75%'; // 15px
          } else if (scale === 'large') {
            document.documentElement.style.fontSize = '106.25%'; // 17px
          } else {
            document.documentElement.style.fontSize = '100%'; // 16px default
          }
        });
      });

      // 1:1 Direct Manipulation with Pointer Events
      const onPointerDown = (e) => {
        // Stop any active spring animation immediately on grab (Interruptibility!)
        if (this.activeSpring) {
          this.activeSpring.stop();
          this.activeSpring = null;
        }

        this.isDragging = true;
        this.handleEl.setPointerCapture(e.pointerId);
        this.startPointerY = e.clientY;
        this.grabOffsetY = e.clientY - this.currentY;
        this.tracker.reset();
        this.tracker.add(e.clientY);
        this.sheetEl.style.transition = 'none';
      };

      const onPointerMove = (e) => {
        if (!this.isDragging) return;
        const nowY = e.clientY;
        this.tracker.add(nowY);

        let deltaY = nowY - this.startPointerY;
        let newY = deltaY;

        // If dragging upwards past top bound (y < 0), rubber-band!
        if (newY < 0) {
          newY = ApplePhysics.rubberband(newY, 300, 0.45);
        }

        this.currentY = newY;
        this.sheetEl.style.transform = `translateX(-50%) translateY(${newY}px)`;

        // Adjust scrim opacity proportional to drag-down
        const progress = Math.max(0, 1 - (newY / (this.sheetHeight || 400)));
        this.scrimEl.style.opacity = (progress * 0.95).toFixed(3);
      };

      const onPointerUp = (e) => {
        if (!this.isDragging) return;
        this.isDragging = false;
        try {
          this.handleEl.releasePointerCapture(e.pointerId);
        } catch (_) {}

        const releaseVelocity = this.tracker.getVelocity(); // px/s
        const projectedDelta = ApplePhysics.project(releaseVelocity, 0.998);
        const projectedRestingY = this.currentY + projectedDelta;

        // If flicked down (velocity > 400) or projected past threshold, dismiss!
        if (releaseVelocity > 450 || projectedRestingY > 160 || this.currentY > 180) {
          this.close(releaseVelocity);
        } else {
          // Snap back open with spring carrying release velocity
          this.snapToOpen(releaseVelocity);
        }
      };

      this.handleEl.addEventListener('pointerdown', onPointerDown);
      this.handleEl.addEventListener('pointermove', onPointerMove);
      this.handleEl.addEventListener('pointerup', onPointerUp);
      this.handleEl.addEventListener('pointercancel', onPointerUp);
    }

    updateActiveThemeButtons() {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      this.sheetEl.querySelectorAll('[data-sheet-theme]').forEach((btn) => {
        if (btn.dataset.sheetTheme === current) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    open() {
      if (!this.sheetEl) this.init();
      this.updateActiveThemeButtons();
      this.isOpen = true;
      this.sheetHeight = this.sheetEl.getBoundingClientRect().height || 520;
      this.scrimEl.classList.add('open');
      this.scrimEl.style.opacity = '1';

      if (this.activeSpring) this.activeSpring.stop();

      // Animate up from 105% to 0 using Apple Critically Damped Spring (damping 1.0, response 0.38)
      this.currentY = this.sheetHeight;
      this.activeSpring = ApplePhysics.spring({
        from: this.sheetHeight,
        to: 0,
        velocity: -600,
        damping: 1.0,
        response: 0.36,
        onUpdate: (val) => {
          this.currentY = val;
          this.sheetEl.style.transform = `translateX(-50%) translateY(${val}px)`;
        },
        onComplete: () => {
          this.currentY = 0;
          this.sheetEl.classList.add('open');
        },
      });
    }

    snapToOpen(initialVelocity = 0) {
      if (this.activeSpring) this.activeSpring.stop();

      // Under-damped slightly if carrying momentum (WWDC rule: bounce only when gesture carried momentum)
      const hasMomentum = Math.abs(initialVelocity) > 200;
      const damping = hasMomentum ? 0.84 : 1.0;

      this.activeSpring = ApplePhysics.spring({
        from: this.currentY,
        to: 0,
        velocity: initialVelocity,
        damping: damping,
        response: 0.34,
        onUpdate: (val) => {
          this.currentY = val;
          this.sheetEl.style.transform = `translateX(-50%) translateY(${val}px)`;
        },
        onComplete: () => {
          this.currentY = 0;
          this.scrimEl.style.opacity = '1';
        },
      });
    }

    close(initialVelocity = 0) {
      this.isOpen = false;
      this.scrimEl.classList.remove('open');
      this.scrimEl.style.opacity = '0';
      this.sheetEl.classList.remove('open');

      if (this.activeSpring) this.activeSpring.stop();

      const targetY = this.sheetHeight + 40;
      this.activeSpring = ApplePhysics.spring({
        from: this.currentY,
        to: targetY,
        velocity: Math.max(initialVelocity, 400),
        damping: 1.0,
        response: 0.32,
        onUpdate: (val) => {
          this.currentY = val;
          this.sheetEl.style.transform = `translateX(-50%) translateY(${val}px)`;
        },
        onComplete: () => {
          this.currentY = targetY;
          this.sheetEl.style.transform = `translateX(-50%) translateY(105%)`;
        },
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 4. APPLE HORIZONTAL CAROUSEL WITH MOMENTUM & RUBBER-BANDING
  // ─────────────────────────────────────────────────────────────
  function attachAppleCarousel(container) {
    if (!container || container.dataset.appleCarouselActive) return;
    container.dataset.appleCarouselActive = 'true';
    container.classList.add('apple-carousel-grabbable');

    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;
    let animId = null;
    const tracker = new VelocityTracker();

    container.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a') && e.pointerType === 'mouse') {
        // Allow link click on desktop if not dragging
      }
      isDown = true;
      if (animId) cancelAnimationFrame(animId);
      container.setPointerCapture(e.pointerId);
      startX = e.clientX;
      scrollLeftStart = container.scrollLeft;
      tracker.reset();
      tracker.add(e.clientX);
    });

    container.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      tracker.add(e.clientX);
      const deltaX = e.clientX - startX;
      let newScroll = scrollLeftStart - deltaX;

      // Soft rubber-band resistance at boundaries
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (newScroll < 0) {
        newScroll = -ApplePhysics.rubberband(-newScroll, container.clientWidth, 0.4);
      } else if (newScroll > maxScroll) {
        const over = newScroll - maxScroll;
        newScroll = maxScroll + ApplePhysics.rubberband(over, container.clientWidth, 0.4);
      }

      container.scrollLeft = newScroll;
    });

    const finishDrag = (e) => {
      if (!isDown) return;
      isDown = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch (_) {}

      const releaseVelocity = -tracker.getVelocity(); // Invert to match scroll direction
      if (Math.abs(releaseVelocity) > 80) {
        const projectedOffset = ApplePhysics.project(releaseVelocity, 0.996);
        const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
        let targetScroll = Math.max(0, Math.min(maxScroll, container.scrollLeft + projectedOffset));

        ApplePhysics.spring({
          from: container.scrollLeft,
          to: targetScroll,
          velocity: releaseVelocity,
          damping: 0.92,
          response: 0.42,
          onUpdate: (val) => {
            container.scrollLeft = val;
          },
        });
      }
    };

    container.addEventListener('pointerup', finishDrag);
    container.addEventListener('pointercancel', finishDrag);
  }

  // ─────────────────────────────────────────────────────────────
  // 5. GLOBAL INITIALIZATION
  // ─────────────────────────────────────────────────────────────
  const appleSheet = new AppleSheetController();

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Sheet
    appleSheet.init();

    // 2. Attach Carousel physics to timeline preview if present
    const tp = document.getElementById('timeline-preview');
    if (tp) attachAppleCarousel(tp);

    // 3. Attach Carousel physics to any .apple-carousel container
    document.querySelectorAll('.apple-carousel').forEach(attachAppleCarousel);

    // 4. Subtle Haptics on all theme switches and primary action buttons
    document.querySelectorAll('.theme-toggle-btn, .theme-btn, .lang-btn').forEach((btn) => {
      btn.addEventListener('pointerdown', () => ApplePhysics.haptic('selection'));
    });

    document.querySelectorAll('.btn-primary, .btn-gold').forEach((btn) => {
      btn.addEventListener('pointerdown', () => ApplePhysics.haptic('light'));
    });
  });

  // Export to window for global access
  window.ApplePhysics = ApplePhysics;
  window.AppleSheet = appleSheet;
  window.attachAppleCarousel = attachAppleCarousel;

})(window, document);
