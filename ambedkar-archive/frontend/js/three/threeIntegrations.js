/**
 * Ambedkar Digital Archive — 3D Experiences Master Gateway & Entry Points
 * Dynamically loads required experience modules on-demand.
 */

(function () {
  const loadedScripts = new Set();

  function loadScript(src) {
    if (loadedScripts.has(src)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        loadedScripts.add(src);
        resolve();
      };
      script.onerror = (err) => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  function ensureStylesheet(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  async function launch(experienceName, ExperienceClassConstructor) {
    ensureStylesheet('/css/threeOverlay.css');
    await loadScript('/js/three/threeCore.js');

    if (!window[ExperienceClassConstructor]) {
      const scriptPath = `/js/three/${experienceName}.js`;
      await loadScript(scriptPath);
    }

    const Constructor = window[ExperienceClassConstructor];
    if (!Constructor) {
      throw new Error(`Could not find experience constructor: ${ExperienceClassConstructor}`);
    }

    const instance = new Constructor();
    window.threeCore.launchExperience(instance);
  }

  // Global Entry Points to Modern Dedicated React Three Fiber Experiences
  window.open3DMuseum = function () {
    window.location.href = '/experience/museum';
  };

  window.open3DTimeline = function () {
    window.location.href = '/experience/timeline';
  };

  window.open3DConstitution = function () {
    window.location.href = '/experience/constitution';
  };

  window.open3DSpeeches = function () {
    return launch('speechExperience', 'SpeechExperience');
  };

  window.open3DJourney = function () {
    window.location.href = '/experience/journey';
  };

  // Wire automatic click listeners for elements with data-three-experience attributes
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-three-experience]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const exp = el.getAttribute('data-three-experience');
        if (exp === 'museum') window.open3DMuseum();
        else if (exp === 'timeline') window.open3DTimeline();
        else if (exp === 'constitution') window.open3DConstitution();
        else if (exp === 'speech' || exp === 'speeches') window.open3DSpeeches();
        else if (exp === 'journey') window.open3DJourney();
      });
    });
  });
})();
