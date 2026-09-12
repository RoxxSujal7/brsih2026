/**
 * Ambedkar Digital Archive — Three.js Core Engine & Experience Harness
 * Provides WebGL detection, adaptive device tiering, lazy loading,
 * clean resource disposal, accessible HUD, and 2D fallback view.
 */

class ThreeCoreEngine {
  constructor() {
    this.threeModule = null;
    this.activeExperience = null;
    this.animationFrameId = null;
    this.container = null;
    this.canvas = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.fallbackActive = false;
    this.deviceTier = this.detectDeviceTier();
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Check WebGL / WebGL2 support safely
   */
  isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  /**
   * Classify device into tier: 'high', 'medium', or 'low'
   */
  detectDeviceTier() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory || 4; // GB if supported

    if (isMobile || cores <= 2 || memory < 3) {
      return {
        tier: 'low',
        dpr: 1,
        particles: 0.25,
        shadows: false,
        antialias: false,
        powerPreference: 'low-power'
      };
    } else if (cores <= 4 || memory <= 4 || window.innerWidth < 1024) {
      return {
        tier: 'medium',
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        particles: 0.6,
        shadows: false,
        antialias: true,
        powerPreference: 'default'
      };
    } else {
      return {
        tier: 'high',
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        particles: 1.0,
        shadows: true,
        antialias: true,
        powerPreference: 'high-performance'
      };
    }
  }

  /**
   * Lazy load the Three.js library from local vendor folder
   */
  async loadThree() {
    if (this.threeModule) return this.threeModule;
    try {
      this.threeModule = await import('/js/vendor/three.module.js');
      return this.threeModule;
    } catch (err) {
      console.warn('Failed to load local three.module.js, attempting relative import...', err);
      this.threeModule = await import('../vendor/three.module.js');
      return this.threeModule;
    }
  }

  /**
   * Ensure overlay DOM structure exists
   */
  ensureOverlayDOM() {
    let container = document.getElementById('three-experience-overlay');
    if (!container) {
      container = document.createElement('div');
      container.id = 'three-experience-overlay';
      container.className = 'three-experience-container';
      container.setAttribute('role', 'dialog');
      container.setAttribute('aria-modal', 'true');
      container.setAttribute('aria-label', '3D Interactive Experience');

      container.innerHTML = `
        <header class="three-hud-header">
          <div class="three-title-group">
            <span class="three-title-badge" id="three-hud-badge">Digital Museum</span>
            <h2 class="three-hud-title" id="three-hud-title">Experience Title</h2>
          </div>
          <div class="three-hud-controls">
            <button type="button" class="three-btn" id="three-btn-mode-toggle" title="Toggle 2D Accessible View">
              <span class="btn-icon">🔄</span>
              <span class="btn-label" id="three-mode-label">2D View</span>
            </button>
            <button type="button" class="three-btn" id="three-btn-motion-toggle" title="Toggle Motion Effects">
              <span class="btn-icon">⚡</span>
              <span class="btn-label" id="three-motion-label">${this.prefersReducedMotion ? 'Motion Off' : 'Motion On'}</span>
            </button>
            <button type="button" class="three-btn three-btn-exit" id="three-btn-exit" title="Exit 3D Experience (Esc)" aria-label="Exit experience">
              <span class="btn-icon">✕</span>
              <span class="btn-label">Exit</span>
            </button>
          </div>
        </header>

        <div class="three-hint-badge" id="three-hud-hint">
          Click or drag to explore • Select items for verified archive records
        </div>

        <canvas class="three-canvas" id="three-primary-canvas" tabindex="0" aria-label="Interactive 3D WebGL Canvas"></canvas>

        <div class="three-fallback-view" id="three-fallback-view" aria-label="Accessible 2D Archive View">
          <div class="three-fallback-grid" id="three-fallback-grid"></div>
        </div>

        <nav class="three-tray" id="three-nav-tray" aria-label="Experience Sections"></nav>

        <aside class="three-detail-modal" id="three-detail-modal" aria-live="polite">
          <div class="three-detail-header">
            <div>
              <span class="three-detail-tag" id="three-modal-tag">Archive Item</span>
              <h3 class="three-detail-title" id="three-modal-title">Item Title</h3>
            </div>
            <button type="button" class="three-close-btn" id="three-modal-close" aria-label="Close details">✕</button>
          </div>
          <div class="three-detail-desc" id="three-modal-desc"></div>
          <div class="three-detail-quote" id="three-modal-quote" style="display: none;"></div>
          <div class="three-detail-meta" id="three-modal-meta"></div>
          <div class="three-detail-actions" id="three-modal-actions"></div>
        </aside>

        <div class="three-loader" id="three-scene-loader">
          <div class="three-spinner"></div>
          <div class="three-loader-text" id="three-loader-text">Loading 3D Experience...</div>
        </div>
      `;

      document.body.appendChild(container);

      // Event listeners for top controls
      document.getElementById('three-btn-exit').addEventListener('click', () => this.exit());
      document.getElementById('three-modal-close').addEventListener('click', () => this.hideDetailModal());
      document.getElementById('three-btn-mode-toggle').addEventListener('click', () => this.toggleFallbackView());
      document.getElementById('three-btn-motion-toggle').addEventListener('click', () => this.toggleMotion());

      // Global keyboard handler
      window.addEventListener('keydown', (e) => {
        if (!this.container || !this.container.classList.contains('active')) return;
        if (e.key === 'Escape') {
          if (document.getElementById('three-detail-modal').classList.contains('visible')) {
            this.hideDetailModal();
          } else {
            this.exit();
          }
        }
      });
    }

    this.container = container;
    this.canvas = document.getElementById('three-primary-canvas');
    return container;
  }

  /**
   * Launch an experience instance
   */
  async launchExperience(experienceInstance) {
    this.ensureOverlayDOM();
    this.activeExperience = experienceInstance;
    this.fallbackActive = false;

    // Lock body scrolling
    document.body.style.overflow = 'hidden';
    this.container.classList.add('active');

    // Reset HUD
    const badge = document.getElementById('three-hud-badge');
    const title = document.getElementById('three-hud-title');
    const hint = document.getElementById('three-hud-hint');
    const loader = document.getElementById('three-scene-loader');
    const fallback = document.getElementById('three-fallback-view');
    const canvas = this.canvas;

    badge.textContent = experienceInstance.badge || 'Digital Heritage';
    title.textContent = experienceInstance.title || '3D Experience';
    hint.textContent = experienceInstance.hint || 'Click or drag to explore • Tap items for verified archive records';
    loader.style.display = 'flex';
    loader.style.opacity = '1';
    fallback.classList.remove('active');
    canvas.style.display = 'block';

    // Populate navigation tray
    this.renderTray(experienceInstance.getSections ? experienceInstance.getSections() : []);

    // Check WebGL support
    if (!this.isWebGLAvailable()) {
      console.warn('WebGL is not supported or disabled on this device. Switching to Accessible 2D view.');
      this.showFallbackView(experienceInstance);
      loader.style.display = 'none';
      return;
    }

    try {
      const THREE = await this.loadThree();
      await this.initRenderer(THREE);
      await experienceInstance.init(this, THREE);
      loader.style.opacity = '0';
      setTimeout(() => { loader.style.display = 'none'; }, 300);
      this.startRenderLoop();
    } catch (err) {
      console.error('Error initializing 3D experience:', err);
      loader.style.display = 'none';
      this.showFallbackView(experienceInstance);
    }
  }

  /**
   * Setup WebGLRenderer and Scene
   */
  async initRenderer(THREE) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: this.deviceTier.antialias,
        alpha: false,
        powerPreference: this.deviceTier.powerPreference
      });
      this.renderer.setClearColor(0x060913, 1);
    }

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.deviceTier.dpr);

    if (this.deviceTier.shadows) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    } else {
      this.renderer.shadowMap.enabled = false;
    }

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060913);

    this.camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    this.camera.position.set(0, 5, 18);

    // Bind window resize
    this.handleResize = () => {
      if (!this.renderer || !this.camera) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      if (this.activeExperience && this.activeExperience.onResize) {
        this.activeExperience.onResize(w, h);
      }
    };
    window.addEventListener('resize', this.handleResize);
  }

  /**
   * Start main animation frame loop
   */
  startRenderLoop() {
    const clock = {
      startTime: performance.now(),
      lastTime: performance.now(),
      getElapsedTime: () => (performance.now() - clock.startTime) / 1000,
      getDelta: () => {
        const now = performance.now();
        const delta = (now - clock.lastTime) / 1000;
        clock.lastTime = now;
        return Math.min(delta, 0.1);
      }
    };

    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (this.activeExperience && this.activeExperience.update) {
        this.activeExperience.update(delta, elapsed);
      }

      if (this.renderer && this.scene && this.camera && !this.fallbackActive) {
        this.renderer.render(this.scene, this.camera);
      }
    };

    animate();
  }

  /**
   * Render lower navigation pill tray
   */
  renderTray(sections) {
    const tray = document.getElementById('three-nav-tray');
    tray.innerHTML = '';
    if (!sections || !sections.length) {
      tray.style.display = 'none';
      return;
    }

    tray.style.display = 'flex';
    sections.forEach((sec, idx) => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `three-pill-item ${idx === 0 ? 'active' : ''}`;
      pill.textContent = sec.label;
      pill.setAttribute('data-id', sec.id);
      pill.addEventListener('click', () => {
        tray.querySelectorAll('.three-pill-item').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        if (this.activeExperience && this.activeExperience.onSectionSelect) {
          this.activeExperience.onSectionSelect(sec.id, sec);
        }
      });
      tray.appendChild(pill);
    });
  }

  /**
   * Show exhibit detail modal
   */
  showDetailModal(data) {
    const modal = document.getElementById('three-detail-modal');
    document.getElementById('three-modal-tag').textContent = data.tag || 'ARCHIVE RECORD';
    document.getElementById('three-modal-title').textContent = data.title || '';
    document.getElementById('three-modal-desc').textContent = data.description || '';

    const quoteEl = document.getElementById('three-modal-quote');
    if (data.quote) {
      quoteEl.textContent = `“${data.quote}”`;
      quoteEl.style.display = 'block';
    } else {
      quoteEl.style.display = 'none';
    }

    const metaEl = document.getElementById('three-modal-meta');
    metaEl.innerHTML = '';
    if (data.meta && Array.isArray(data.meta)) {
      data.meta.forEach(m => {
        const row = document.createElement('div');
        row.innerHTML = `<strong>${m.label}:</strong> ${m.value}`;
        metaEl.appendChild(row);
      });
    }

    const actionsEl = document.getElementById('three-modal-actions');
    actionsEl.innerHTML = '';
    if (data.links && Array.isArray(data.links)) {
      data.links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.className = link.primary ? 'three-btn three-btn-primary' : 'three-btn';
        a.textContent = link.label;
        if (link.external) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
        actionsEl.appendChild(a);
      });
    }

    modal.classList.add('visible');
  }

  /**
   * Hide detail modal
   */
  hideDetailModal() {
    const modal = document.getElementById('three-detail-modal');
    if (modal) modal.classList.remove('visible');
  }

  /**
   * Switch between 3D WebGL and 2D accessible view
   */
  toggleFallbackView() {
    this.fallbackActive = !this.fallbackActive;
    const fallback = document.getElementById('three-fallback-view');
    const canvas = this.canvas;
    const modeLabel = document.getElementById('three-mode-label');

    if (this.fallbackActive) {
      canvas.style.display = 'none';
      fallback.classList.add('active');
      modeLabel.textContent = '3D View';
      this.showFallbackView(this.activeExperience);
    } else {
      fallback.classList.remove('active');
      canvas.style.display = 'block';
      modeLabel.textContent = '2D View';
    }
  }

  /**
   * Populate and show 2D fallback cards
   */
  showFallbackView(experienceInstance) {
    const grid = document.getElementById('three-fallback-grid');
    grid.innerHTML = '';

    const items = experienceInstance && experienceInstance.getFallbackData
      ? experienceInstance.getFallbackData()
      : [];

    if (!items.length) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 40px;">No fallback records found.</div>`;
      return;
    }

    items.forEach(item => {
      const card = document.createElement('article');
      card.className = 'three-fallback-card';
      card.innerHTML = `
        <span class="three-detail-tag">${item.tag || 'ARCHIVE'}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        ${item.quote ? `<blockquote class="three-detail-quote">“${item.quote}”</blockquote>` : ''}
        <div style="margin-top: 14px; display: flex; gap: 8px; flex-wrap: wrap;">
          ${(item.links || []).map(l => `<a href="${l.url}" class="three-btn ${l.primary ? 'three-btn-primary' : ''}">${l.label}</a>`).join('')}
        </div>
      `;
      grid.appendChild(card);
    });

    document.getElementById('three-fallback-view').classList.add('active');
    this.canvas.style.display = 'none';
    this.fallbackActive = true;
    document.getElementById('three-mode-label').textContent = '3D View';
  }

  /**
   * Toggle reduced motion
   */
  toggleMotion() {
    this.prefersReducedMotion = !this.prefersReducedMotion;
    const label = document.getElementById('three-motion-label');
    label.textContent = this.prefersReducedMotion ? 'Motion Off' : 'Motion On';
    if (this.activeExperience && this.activeExperience.setMotion) {
      this.activeExperience.setMotion(!this.prefersReducedMotion);
    }
  }

  /**
   * Exit the current experience and free all WebGL resources cleanly
   */
  exit() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.handleResize) {
      window.removeEventListener('resize', this.handleResize);
      this.handleResize = null;
    }

    if (this.activeExperience) {
      if (this.activeExperience.dispose) {
        this.activeExperience.dispose();
      }
      this.activeExperience = null;
    }

    // Cleanly dispose Three.js scene hierarchy
    if (this.scene) {
      this.disposeObject(this.scene);
      this.scene = null;
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer = null;
    }

    this.hideDetailModal();
    if (this.container) {
      this.container.classList.remove('active');
    }

    // Restore body scroll
    document.body.style.overflow = '';
  }

  /**
   * Recursively dispose geometry, materials, and textures
   */
  disposeObject(obj) {
    if (!obj) return;
    for (let i = obj.children.length - 1; i >= 0; i--) {
      this.disposeObject(obj.children[i]);
      obj.remove(obj.children[i]);
    }
    if (obj.geometry) {
      obj.geometry.dispose();
    }
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(m => this.disposeMaterial(m));
      } else {
        this.disposeMaterial(obj.material);
      }
    }
  }

  /**
   * Dispose material and attached textures
   */
  disposeMaterial(material) {
    if (!material) return;
    for (const key of Object.keys(material)) {
      const prop = material[key];
      if (prop && typeof prop === 'object' && 'minFilter' in prop && typeof prop.dispose === 'function') {
        prop.dispose();
      }
    }
    material.dispose();
  }
}

// Export singleton instance to window
window.threeCore = new ThreeCoreEngine();
