/**
 * scrollytelling.js — Museum-grade Scrollytelling & Lenis Smooth Scroll Engine
 * Enforces restrained, dignified pacing inspired by Apple product pages & archival exhibits.
 * Respects prefers-reduced-motion by falling back to instant reveals and native browser scrolling.
 */

(function () {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenisInstance = null;

  function initScrollytelling() {
    // 1. Initialize Lenis (if vendor available and motion permitted)
    if (typeof Lenis !== 'undefined' && !isReducedMotion) {
      lenisInstance = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.5,
        infinite: false
      });

      // Synchronize with GSAP ScrollTrigger if available
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        lenisInstance.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
          lenisInstance.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenisInstance.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    }

    // 2. Register Scroll Reveals
    initScrollReveals();

    // 3. Register Stat Counter animations
    initStatCounters();
  }

  function initScrollReveals() {
    if (isReducedMotion) {
      // Instant reveal for accessibility
      document.querySelectorAll('.scroll-reveal, .vow-card, .letter-card, .milestone-card').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      const revealTargets = document.querySelectorAll(
        '.scroll-reveal, .card-hover, .vow-card, .timeline-event, .stat-card'
      );

      revealTargets.forEach((el, index) => {
        // Prevent duplicate animation binding
        if (el.dataset.revealed) return;
        el.dataset.revealed = 'true';

        gsap.fromTo(
          el,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    }
  }

  function initStatCounters() {
    const counterElements = document.querySelectorAll('.stat-number, [data-count-to]');
    if (!counterElements.length) return;

    if (isReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Keep static text
      return;
    }

    counterElements.forEach((el) => {
      const rawText = el.textContent.trim();
      const match = rawText.match(/^([^\d]*)(\d[\d,]*)(.*)$/);
      if (!match) return;

      const prefix = match[1];
      const targetNum = parseInt(match[2].replace(/,/g, ''), 10);
      const suffix = match[3];

      const counter = { val: 0 };

      gsap.to(counter, {
        val: targetNum,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(counter.val).toLocaleString()}${suffix}`;
        }
      });
    });
  }

  // Expose API
  window.ArchiveScrolly = {
    get lenis() {
      return lenisInstance;
    },
    refresh: () => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      initScrollReveals();
    },
    initScrollReveals,
    initStatCounters
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollytelling);
  } else {
    initScrollytelling();
  }
})();
