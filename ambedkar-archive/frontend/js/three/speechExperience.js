/**
 * Ambedkar Digital Archive — Feature 8: Immersive Historical Speech Experience
 * A 3D archival soundstage featuring a vintage broadcast microphone,
 * acoustic sound wave visualizer ripples, synchronized transcript reader,
 * and playback controls respecting browser autoplay policies.
 */

class SpeechExperience {
  constructor() {
    this.badge = 'Archival Soundstage';
    this.title = 'Historic Speeches & Broadcasts';
    this.hint = 'Select a speech to enter the listening chamber • Toggle Play to activate acoustic ripples and transcript';

    this.core = null;
    this.THREE = null;
    this.motionEnabled = true;
    this.speeches = (typeof window !== 'undefined' && window.MEDIA_DATA && window.MEDIA_DATA.length)
      ? window.MEDIA_DATA.filter(m => m.transcript && m.transcript.length)
      : this.getBuiltInSpeeches();

    this.currentSpeechIndex = 0;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 180; // normalized seconds for timeline simulation
    this.currentSegmentIndex = 0;

    this.micGroup = null;
    this.soundRipples = [];
    this.particles = null;

    this.mouse = { x: 0, y: 0 };
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.cameraAngle = 0;
    this.cameraDistance = 8.5;
    this.cameraHeight = 3.6;
  }

  getSections() {
    return this.speeches.map((s, idx) => ({
      id: `speech-${idx}`,
      label: `🎙️ ${s.title.split(':')[0].substring(0, 24)}...`
    }));
  }

  getFallbackData() {
    return this.speeches.map(s => ({
      tag: `${s.date} • ${s.source || 'ALL INDIA RADIO'}`,
      title: s.title,
      description: s.description,
      quote: s.transcript && s.transcript[0] ? s.transcript[0].text : '',
      links: [
        { label: 'Open in Media Archive', url: `/media.html#${s.id}`, primary: true }
      ]
    }));
  }

  async init(core, THREE) {
    this.core = core;
    this.THREE = THREE;
    const scene = core.scene;

    core.camera.position.set(0, this.cameraHeight, this.cameraDistance);
    core.camera.lookAt(0, 2.8, 0);

    // 1. Acoustic Studio Floor & Stage
    const stageGeo = new THREE.CylinderGeometry(8, 8.5, 0.4, 40);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x090e1a,
      roughness: 0.35,
      metalness: 0.5
    });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = -0.2;
    stage.receiveShadow = true;
    scene.add(stage);

    // Wooden parquet inlay ring
    const woodRingGeo = new THREE.RingGeometry(3.5, 3.65, 48);
    const goldMat = new THREE.MeshBasicMaterial({ color: 0xc59b27, side: THREE.DoubleSide });
    const woodRing = new THREE.Mesh(woodRingGeo, goldMat);
    woodRing.rotation.x = -Math.PI / 2;
    woodRing.position.y = 0.01;
    scene.add(woodRing);

    // 2. Vintage Broadcast Ribbon Microphone Assembly
    this.micGroup = new THREE.Group();
    this.micGroup.position.set(0, 0, 0);

    // Mic Stand Base
    const baseGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.15, 32);
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.95,
      roughness: 0.15
    });
    const base = new THREE.Mesh(baseGeo, chromeMat);
    base.position.y = 0.08;
    this.micGroup.add(base);

    // Vertical Stand Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.8, 16);
    const shaft = new THREE.Mesh(shaftGeo, chromeMat);
    shaft.position.y = 1.48;
    this.micGroup.add(shaft);

    // Mic Mounting Ring / Shockmount
    const shockGeo = new THREE.TorusGeometry(0.65, 0.04, 16, 32);
    const shock = new THREE.Mesh(shockGeo, chromeMat);
    shock.position.y = 2.9;
    this.micGroup.add(shock);

    // Vintage Mic Capsule (Pill Ribbon Microphone)
    const capGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.9, 24);
    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0xc59b27,
      metalness: 0.85,
      roughness: 0.25
    });
    const capsule = new THREE.Mesh(capGeo, bronzeMat);
    capsule.position.y = 2.9;
    this.micGroup.add(capsule);

    // Perforated Grille Screen
    const grilleGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.5, 24);
    const grilleMat = new THREE.MeshStandardMaterial({
      color: 0x1a2333,
      metalness: 0.9,
      roughness: 0.4,
      wireframe: true
    });
    const grille = new THREE.Mesh(grilleGeo, grilleMat);
    grille.position.y = 2.9;
    this.micGroup.add(grille);

    // "AIR" / Broadcast Call-Letter Sign on top
    const signGeo = new THREE.BoxGeometry(0.7, 0.3, 0.15);
    const signMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.y = 3.6;
    this.micGroup.add(sign);

    scene.add(this.micGroup);

    // 3. Acoustic Soundwave Ripples (Expand outward when playing)
    for (let i = 0; i < 5; i++) {
      const rippleGeo = new THREE.RingGeometry(0.8, 0.88, 48);
      const rippleMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0
      });
      const ripple = new THREE.Mesh(rippleGeo, rippleMat);
      ripple.rotation.x = -Math.PI / 2;
      ripple.position.y = 0.05;
      scene.add(ripple);
      this.soundRipples.push({ mesh: ripple, phase: i * 0.2 });
    }

    // 4. Studio Lighting & Spotlights
    const ambient = new THREE.AmbientLight(0x94a3b8, 0.6);
    scene.add(ambient);

    const micSpotlight = new THREE.SpotLight(0xfff7ed, 2.4, 15, Math.PI / 5, 0.3);
    micSpotlight.position.set(0, 6.5, 2.5);
    micSpotlight.target = this.micGroup;
    scene.add(micSpotlight);

    const rimLight = new THREE.PointLight(0x0ea5e9, 1.2, 14);
    rimLight.position.set(-3, 3, -2);
    scene.add(rimLight);

    // 5. Floating Dust/Aura Particles
    const pCount = Math.floor(300 * core.deviceTier.particles);
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 12;
      pPos[i + 1] = Math.random() * 6;
      pPos[i + 2] = (Math.random() - 0.5) * 12;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.4
    });
    this.particles = new THREE.Points(pGeo, pMat);
    scene.add(this.particles);

    // 6. Bind User Interaction
    this.bindEvents();

    // Select first speech
    this.selectSpeech(0);
  }

  bindEvents() {
    const canvas = this.core.canvas;

    this.onPointerDown = (e) => {
      this.isDragging = true;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    this.onPointerMove = (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.prevMousePos.x;
        const deltaY = e.clientY - this.prevMousePos.y;
        this.cameraAngle -= deltaX * 0.006;
        this.cameraHeight = Math.max(1.8, Math.min(6.5, this.cameraHeight - deltaY * 0.015));
        this.prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    this.onPointerUp = () => {
      this.isDragging = false;
    };

    canvas.addEventListener('mousedown', this.onPointerDown);
    window.addEventListener('mousemove', this.onPointerMove);
    window.addEventListener('mouseup', this.onPointerUp);

    // Touch
    this.onTouchStart = (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    this.onTouchMove = (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        const deltaX = e.touches[0].clientX - this.prevMousePos.x;
        const deltaY = e.touches[0].clientY - this.prevMousePos.y;
        this.cameraAngle -= deltaX * 0.007;
        this.cameraHeight = Math.max(1.8, Math.min(6.5, this.cameraHeight - deltaY * 0.015));
        this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    this.onTouchEnd = () => {
      this.isDragging = false;
    };

    canvas.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', this.onTouchEnd, { passive: true });

    // Keyboard space to play/pause
    this.onKeyDown = (e) => {
      if (e.code === 'Space' && !['input', 'textarea'].includes((e.target.tagName || '').toLowerCase())) {
        e.preventDefault();
        this.togglePlayback();
      }
    };
    window.addEventListener('keydown', this.onKeyDown);
  }

  onSectionSelect(sectionId) {
    const idx = parseInt(sectionId.replace('speech-', ''), 10);
    if (!isNaN(idx) && this.speeches[idx]) {
      this.selectSpeech(idx);
    }
  }

  selectSpeech(index) {
    this.currentSpeechIndex = index;
    this.currentTime = 0;
    this.currentSegmentIndex = 0;
    this.isPlaying = false;

    const s = this.speeches[index];
    this.renderSpeechPanel(s);
  }

  togglePlayback() {
    this.isPlaying = !this.isPlaying;
    const s = this.speeches[this.currentSpeechIndex];
    this.renderSpeechPanel(s);
  }

  renderSpeechPanel(s) {
    const transcriptHtml = (s.transcript || []).map((seg, idx) => `
      <div class="three-transcript-segment ${idx === this.currentSegmentIndex ? 'active' : ''}" data-idx="${idx}" style="margin-bottom: 8px;">
        <span style="color: var(--three-gold-bright); font-size: 0.76rem; font-weight: 700; margin-right: 6px;">[${seg.time}]</span>
        ${seg.text}
      </div>
    `).join('');

    const formattedTime = this.formatTime(this.currentTime);
    const durationTime = s.duration || '20:00';

    const panelData = {
      tag: `${s.date} • ${s.source || 'BROADCAST RECORD'}`,
      title: s.title,
      description: `
        <div style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 8px;">${s.description}</div>
        <div class="three-audio-bar">
          <button type="button" class="three-btn ${this.isPlaying ? 'three-btn-primary' : ''}" id="three-speech-play-btn" style="min-width: 90px;">
            ${this.isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <div style="flex: 1; font-size: 0.82rem; font-variant-numeric: tabular-nums; color: #cbd5e1;">
            <span id="three-speech-curr-time">${formattedTime}</span> / ${durationTime}
          </div>
        </div>
        <div class="three-transcript-box" id="three-speech-transcript">
          ${transcriptHtml}
        </div>
      `,
      links: [
        { label: 'Open in Media Archive', url: `/media.html#${s.id}`, primary: true },
        s.url ? { label: 'Watch Source Broadcast', url: s.url, primary: false, external: true } : null
      ].filter(Boolean)
    };

    this.core.showDetailModal(panelData);

    // Bind Play/Pause button inside detail modal
    setTimeout(() => {
      const btn = document.getElementById('three-speech-play-btn');
      if (btn) {
        btn.onclick = () => this.togglePlayback();
      }
    }, 50);
  }

  formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  setMotion(enabled) {
    this.motionEnabled = enabled;
  }

  update(delta, elapsed) {
    const camera = this.core.camera;
    if (!camera) return;

    // Camera orbital navigation
    const targetX = Math.sin(this.cameraAngle) * this.cameraDistance;
    const targetZ = Math.cos(this.cameraAngle) * this.cameraDistance;
    const factor = this.motionEnabled ? 0.06 : 0.25;

    camera.position.x += (targetX - camera.position.x) * factor;
    camera.position.y += (this.cameraHeight - camera.position.y) * factor;
    camera.position.z += (targetZ - camera.position.z) * factor;
    camera.lookAt(0, 2.8, 0);

    // Speech playback simulation and transcript highlighting
    if (this.isPlaying) {
      this.currentTime += delta;
      const s = this.speeches[this.currentSpeechIndex];
      const timeDisplay = document.getElementById('three-speech-curr-time');
      if (timeDisplay) {
        timeDisplay.textContent = this.formatTime(this.currentTime);
      }

      // Check transcript segment advancement every ~10s of simulated audio
      const segments = s.transcript || [];
      const newIdx = Math.min(segments.length - 1, Math.floor(this.currentTime / 12));
      if (newIdx !== this.currentSegmentIndex) {
        this.currentSegmentIndex = newIdx;
        const transcriptBox = document.getElementById('three-speech-transcript');
        if (transcriptBox) {
          transcriptBox.querySelectorAll('.three-transcript-segment').forEach((el, idx) => {
            el.classList.toggle('active', idx === newIdx);
            if (idx === newIdx) {
              el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          });
        }
      }

      // Animate acoustic soundwave ripples
      if (this.motionEnabled) {
        this.soundRipples.forEach(r => {
          let progress = ((elapsed * 0.8 + r.phase) % 1);
          r.mesh.scale.set(1 + progress * 7, 1 + progress * 7, 1);
          r.mesh.material.opacity = (1 - progress) * 0.6;
        });
      }
    } else {
      // Fade out ripples when stopped
      this.soundRipples.forEach(r => {
        r.mesh.material.opacity *= 0.9;
      });
    }

    if (this.motionEnabled && this.particles) {
      this.particles.rotation.y = elapsed * 0.015;
    }
  }

  dispose() {
    const canvas = this.core ? this.core.canvas : null;
    if (canvas) {
      canvas.removeEventListener('mousedown', this.onPointerDown);
      canvas.removeEventListener('touchstart', this.onTouchStart);
    }
    window.removeEventListener('mousemove', this.onPointerMove);
    window.removeEventListener('mouseup', this.onPointerUp);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  getBuiltInSpeeches() {
    return [
      {
        id: 'speech-constituent-assembly-1946',
        title: 'Maiden Address to the Constituent Assembly',
        date: 'December 17, 1946',
        source: 'Constituent Assembly of India Debates',
        description: 'Historic maiden speech on the Objectives Resolution calling for unity, social democracy, and fundamental human rights.',
        duration: '21:00',
        transcript: [
          { time: '00:00', text: 'Mr. Chairman, Sir, I have not had the opportunity of speaking on this Resolution before, and I am grateful for the chance now accorded to me to express my views.' },
          { time: '03:15', text: 'I know today we are divided politically, socially, and economically. We are a group of warring camps, and I probably am one of the leaders of such a camp.' },
          { time: '05:00', text: 'But, Sir, with all our differences, with all our conflicting loyalties, I have not the slightest doubt in my mind that we shall in some form be a united people.' },
          { time: '08:30', text: 'Our difficulty is not with the British; our difficulty is with ourselves. We have to decide whether we are to place the country above our groups or whether we are to place our groups above the country.' }
        ]
      }
    ];
  }
}

window.SpeechExperience = SpeechExperience;
