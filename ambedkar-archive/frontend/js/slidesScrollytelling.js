/**
 * slidesScrollytelling.js — Museum-Grade Vertical Scrollytelling for Exhibition Deck
 * Integrates GSAP ScrollTrigger pinned sections, parallax background image scaling,
 * staggered content reveals, and seamless toggle between Scrollytelling and 16:9 Deck modes.
 */

(function () {
  'use strict';

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let scrollTriggers = [];
  let currentMode = 'scroll'; // 'scroll' (default) or 'deck'

  function initScrollytelling() {
    const slides = document.querySelectorAll('.slide');
    if (!slides.length) return;

    // Set default mode on body
    document.body.classList.add('mode-scroll');
    document.body.classList.remove('mode-deck');

    // Add view mode toggle button in top chrome if not present
    setupModeToggle();

    // If reduced motion, show content cleanly without pinning
    if (isReducedMotion || !window.gsap || !window.ScrollTrigger) {
      slides.forEach((slide) => {
        slide.style.opacity = '1';
        slide.style.visibility = 'visible';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Initialize ScrollTrigger pins and staggered reveals for each chapter
    slides.forEach((slide, index) => {
      // 1. Chapter container entrance & pin
      const bodyGrid = slide.querySelector('.slide-body-grid, .title-slide-container');
      const photoFrame = slide.querySelector('.slide-photo-frame img, .portrait-bezel-frame img');
      const header = slide.querySelector('.slide-header');
      const cards = slide.querySelectorAll('.slide-card');
      const quotes = slide.querySelectorAll('.slide-quote');
      const facts = slide.querySelectorAll('.key-fact-item');

      // Parallax effect on chapter historical photo
      if (photoFrame) {
        const pTrig = gsap.fromTo(
          photoFrame,
          { scale: 1.0, yPercent: -4 },
          {
            scale: 1.08,
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: slide,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        );
        scrollTriggers.push(pTrig.scrollTrigger);
      }

      // Staggered reveal for chapter narrative elements
      const revealElements = [];
      if (header) revealElements.push(header);
      if (cards.length) revealElements.push(...cards);
      if (quotes.length) revealElements.push(...quotes);
      if (facts.length) revealElements.push(...facts);

      if (revealElements.length) {
        gsap.set(revealElements, { opacity: 0, y: 30 });

        const sTrig = ScrollTrigger.create({
          trigger: slide,
          start: 'top 75%',
          onEnter: () => {
            gsap.to(revealElements, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          },
          onLeaveBack: () => {
            gsap.to(revealElements, {
              opacity: 0.15,
              y: 20,
              duration: 0.4,
              overwrite: 'auto'
            });
          }
        });
        scrollTriggers.push(sTrig);
      }
    });

    // Refresh ScrollTrigger after layout settles
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  }

  function setupModeToggle() {
    const topActions = document.querySelector('.deck-top-actions');
    if (!topActions || document.getElementById('viewModeToggleBtn')) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'viewModeToggleBtn';
    toggleBtn.className = 'top-action-btn';
    toggleBtn.title = 'Switch between Scrollytelling and 16:9 Presentation Mode (P)';
    toggleBtn.innerHTML = `
      <span class="icon" data-icon="presentation"></span>
      <span id="viewModeLabel">16:9 Deck View</span>
    `;

    toggleBtn.addEventListener('click', () => {
      toggleMode();
    });

    // Insert before audio narration button
    topActions.insertBefore(toggleBtn, topActions.firstChild);

    // Keyboard shortcut 'P' for presentation toggle
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        toggleMode();
      }
    });
  }

  function toggleMode() {
    if (currentMode === 'scroll') {
      // Switch to 16:9 presentation deck mode
      currentMode = 'deck';
      document.body.classList.remove('mode-scroll');
      document.body.classList.add('mode-deck');

      // Kill scroll triggers while in deck mode
      scrollTriggers.forEach((st) => st && st.disable());

      const label = document.getElementById('viewModeLabel');
      if (label) label.textContent = '📜 Scrollytelling View';

      if (window.deck && typeof window.deck.showSlide === 'function') {
        window.deck.showSlide(window.deck.currentSlide || 0);
      }
      if (window.showToast) window.showToast('Switched to 16:9 Presentation Deck mode (Use Arrow Keys)');
    } else {
      // Switch to Scrollytelling mode
      currentMode = 'scroll';
      document.body.classList.remove('mode-deck');
      document.body.classList.add('mode-scroll');

      // Enable scroll triggers
      scrollTriggers.forEach((st) => st && st.enable());
      ScrollTrigger.refresh();

      const label = document.getElementById('viewModeLabel');
      if (label) label.textContent = '📽️ 16:9 Deck View';

      // Restore all slides visibility for scrolling
      const slides = document.querySelectorAll('.slide');
      slides.forEach((s) => {
        s.style.display = 'flex';
        s.style.visibility = 'visible';
        s.style.opacity = '1';
      });

      if (window.showToast) window.showToast('Switched to Vertical Scrollytelling mode');
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollytelling);
  } else {
    initScrollytelling();
  }

  // Expose toggle globally
  window.toggleSlidesMode = toggleMode;
})();
