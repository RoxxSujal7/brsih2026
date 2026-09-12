/**
 * Ambedkar Digital Archive — Master Spatial 3D Landing Engine
 * Apple-style Scrollytelling + Nike-style 360° Interactive Exhibit Showcase
 */

(async function () {
  // 1. Load Three.js Module
  let THREE;
  try {
    const mod = await import('/js/vendor/three.module.js');
    THREE = mod.default || mod;
    window.THREE = THREE;
  } catch (err) {
    console.error('Failed to load Three.js module:', err);
    return;
  }

  // 2. Engine State & Config
  const state = {
    canvas: null,
    renderer: null,
    scene: null,
    camera: null,
    clock: new THREE.Clock(),
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    
    // Scrollytelling
    scrollProgress: 0,
    targetCamPos: new THREE.Vector3(0, 1.2, 6.5),
    currentCamPos: new THREE.Vector3(0, 1.2, 6.5),
    targetLookAt: new THREE.Vector3(0, 0.4, 0),
    currentLookAt: new THREE.Vector3(0, 0.4, 0),
    
    // Mouse Parallax
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    
    // Nike-style Showcase Mode
    showcaseActive: false,
    activeExhibitId: 'constitution',
    exhibits: {},
    particles: null,
    lights: {},
    currentLightingPreset: 'studio_dark',
    autoRotate: true,
    wireframeMode: false,
    soundEnabled: true,
    
    // Drag & Orbit Physics
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    showcaseRotation: { x: 0, y: 0 },
    showcaseTargetRotation: { x: 0, y: 0 },
    
    // Waypoints from backend/default
    waypoints: []
  };

  // 3. Audio synthesis for tactile feedback (Web Audio API)
  const audioCtx = window.AudioContext ? new (window.AudioContext || window.webkitAudioContext)() : null;
  function playHapticSound(type) {
    if (!state.soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      const now = audioCtx.currentTime;
      if (type === 'click') {
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'switch') {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'pin') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch (e) {}
  }

  // 4. Initialize Renderer & Scene
  function initEngine() {
    let canvas = document.getElementById('spatial-bg-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'spatial-bg-canvas';
      document.body.prepend(canvas);
    }
    state.canvas = canvas;

    state.scene = new THREE.Scene();
    state.scene.fog = new THREE.FogExp2(0x07090e, 0.045);

    state.camera = new THREE.PerspectiveCamera(45, state.width / state.height, 0.1, 100);
    state.camera.position.copy(state.currentCamPos);

    state.renderer = new THREE.WebGLRenderer({
      canvas: state.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    state.renderer.setSize(state.width, state.height);
    state.renderer.setPixelRatio(state.dpr);
    state.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    state.renderer.toneMappingExposure = 1.2;
    state.renderer.shadowMap.enabled = true;
    state.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    setupLighting();
    createCosmicParticleField();
    build3DExhibits();
    bindEvents();
    loadBackendConfig();

    animate();
  }

  // 5. Lighting Setup (Apple/Nike Studio Lighting)
  function setupLighting() {
    const ambient = new THREE.AmbientLight(0x1e293b, 1.2);
    state.scene.add(ambient);
    state.lights.ambient = ambient;

    // Key Studio Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    state.scene.add(keyLight);
    state.lights.keyLight = keyLight;

    // Fill Light (Navy Blue)
    const fillLight = new THREE.DirectionalLight(0x2563eb, 1.5);
    fillLight.position.set(-8, 6, -4);
    state.scene.add(fillLight);
    state.lights.fillLight = fillLight;

    // Dramatic Rim Light (Saffron Gold)
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 2.8);
    rimLight.position.set(0, 8, -10);
    state.scene.add(rimLight);
    state.lights.rimLight = rimLight;

    // Ground Soft Pedestal Glow
    const floorGlow = new THREE.PointLight(0x38bdf8, 2.0, 15);
    floorGlow.position.set(0, -1.8, 0);
    state.scene.add(floorGlow);
    state.lights.floorGlow = floorGlow;
  }

  // 6. Particle Constellation Field
  function createCosmicParticleField() {
    const count = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const gold = new THREE.Color(0xf59e0b);
    const blue = new THREE.Color(0x38bdf8);
    const white = new THREE.Color(0xffffff);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 35;
      positions[i3 + 1] = (Math.random() - 0.5) * 25;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;

      const pick = Math.random();
      const color = pick < 0.4 ? gold : pick < 0.7 ? blue : white;
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    state.particles = new THREE.Points(geometry, material);
    state.scene.add(state.particles);
  }

  // 7. Museum-Grade 3D Procedural Exhibits
  function build3DExhibits() {
    // A. Dr. B. R. Ambedkar Memorial Bust
    const bustGroup = new THREE.Group();
    bustGroup.name = 'bust';

    // Pedestal Base (Black Granite)
    const pedestalGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.4, 32);
    const graniteMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.2
    });
    const pedestal = new THREE.Mesh(pedestalGeo, graniteMat);
    pedestal.position.y = -1.2;
    pedestal.receiveShadow = true;
    bustGroup.add(pedestal);

    // Bronze Torso
    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0x854d0e,
      roughness: 0.35,
      metalness: 0.85
    });
    const torsoGeo = new THREE.CylinderGeometry(0.5, 0.85, 1.2, 24);
    const torso = new THREE.Mesh(torsoGeo, bronzeMat);
    torso.position.y = -0.4;
    torso.castShadow = true;
    bustGroup.add(torso);

    // Head / Face
    const headGeo = new THREE.SphereGeometry(0.48, 32, 32);
    headGeo.scale(1, 1.2, 1.05);
    const head = new THREE.Mesh(headGeo, bronzeMat);
    head.position.y = 0.55;
    head.castShadow = true;
    bustGroup.add(head);

    // Iconic Horn-Rimmed Spectacles
    const specsGroup = new THREE.Group();
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.9 });
    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      roughness: 0.05,
      transmission: 0.9,
      ior: 1.5
    });

    [-0.18, 0.18].forEach(x => {
      const ringGeo = new THREE.TorusGeometry(0.12, 0.02, 16, 32);
      const ring = new THREE.Mesh(ringGeo, rimMat);
      ring.position.set(x, 0.65, 0.44);
      specsGroup.add(ring);

      const lensGeo = new THREE.CircleGeometry(0.11, 32);
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.position.set(x, 0.65, 0.44);
      specsGroup.add(lens);
    });

    // Specs Bridge
    const bridgeGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8);
    bridgeGeo.rotateZ(Math.PI / 2);
    const bridge = new THREE.Mesh(bridgeGeo, rimMat);
    bridge.position.set(0, 0.66, 0.45);
    specsGroup.add(bridge);
    bustGroup.add(specsGroup);

    // Constitution Folio under arm
    const folioGeo = new THREE.BoxGeometry(0.35, 0.8, 0.5);
    const folioMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5, metalness: 0.3 });
    const folio = new THREE.Mesh(folioGeo, folioMat);
    folio.position.set(-0.65, -0.3, 0.1);
    folio.rotation.z = -0.15;
    bustGroup.add(folio);

    state.exhibits.bust = bustGroup;
    state.scene.add(bustGroup);

    // B. The Constitution of India (Illuminated Pedestal)
    const constGroup = new THREE.Group();
    constGroup.name = 'constitution';

    // Pedestal Base Ring
    const baseGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.3, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.15, metalness: 0.4 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -1.3;
    constGroup.add(base);

    // Glowing Azure Holographic Ring
    const haloRingGeo = new THREE.TorusGeometry(1.5, 0.03, 16, 64);
    haloRingGeo.rotateX(Math.PI / 2);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const haloRing = new THREE.Mesh(haloRingGeo, haloMat);
    haloRing.position.y = -1.14;
    constGroup.add(haloRing);
    constGroup.halo = haloRing;

    // The Book Cover (Black Leather with Gold Inlay)
    const bookGeo = new THREE.BoxGeometry(1.8, 0.22, 1.3);
    const coverMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b18,
      roughness: 0.45,
      metalness: 0.3
    });
    const book = new THREE.Mesh(bookGeo, coverMat);
    book.position.y = -0.2;
    book.rotation.x = 0.35;
    book.castShadow = true;
    constGroup.add(book);

    // Gold Ashoka Seal Embossed on Cover
    const sealGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.04, 32);
    const goldSealMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.25,
      metalness: 0.95
    });
    const seal = new THREE.Mesh(sealGeo, goldSealMat);
    seal.position.set(0, -0.07, 0.15);
    seal.rotation.x = 0.35;
    constGroup.add(seal);

    // Open Parchment Fan / Pages
    const pagesGeo = new THREE.BoxGeometry(1.72, 0.16, 1.22);
    const pagesMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.8,
      metalness: 0.05
    });
    const pages = new THREE.Mesh(pagesGeo, pagesMat);
    pages.position.set(0, -0.16, 0.02);
    pages.rotation.x = 0.35;
    constGroup.add(pages);

    state.exhibits.constitution = constGroup;
    state.scene.add(constGroup);

    // C. Mahad Satyagraha Water Pillar Monument
    const mahadGroup = new THREE.Group();
    mahadGroup.name = 'mahad';

    // Water Basin Pool
    const poolGeo = new THREE.CylinderGeometry(1.8, 1.9, 0.25, 32);
    const poolMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.position.y = -1.2;
    mahadGroup.add(pool);

    // Rippling Water Surface
    const waterGeo = new THREE.CircleGeometry(1.7, 32);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.6,
      transparent: true,
      opacity: 0.85
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = -1.06;
    mahadGroup.add(water);

    // Basalt Obelisk Pillar
    const obeliskGeo = new THREE.CylinderGeometry(0.32, 0.55, 2.2, 4);
    const basaltMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85, metalness: 0.1 });
    const obelisk = new THREE.Mesh(obeliskGeo, basaltMat);
    obelisk.position.y = 0.05;
    obelisk.rotation.y = Math.PI / 4;
    obelisk.castShadow = true;
    mahadGroup.add(obelisk);

    // Brass Plaque on Pillar
    const plaqueGeo = new THREE.BoxGeometry(0.4, 0.6, 0.04);
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.85 });
    const plaque = new THREE.Mesh(plaqueGeo, brassMat);
    plaque.position.set(0, -0.1, 0.34);
    mahadGroup.add(plaque);

    state.exhibits.mahad = mahadGroup;
    state.scene.add(mahadGroup);

    // D. Historical Drafting Suite (Parker Pen & Spectacles)
    const quillGroup = new THREE.Group();
    quillGroup.name = 'quill';

    // Mahogany Desk Platform
    const deskGeo = new THREE.BoxGeometry(2.4, 0.15, 1.6);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x27170a, roughness: 0.4, metalness: 0.1 });
    const desk = new THREE.Mesh(deskGeo, woodMat);
    desk.position.y = -0.9;
    quillGroup.add(desk);

    // Open Leather Journal
    const journalGeo = new THREE.BoxGeometry(1.2, 0.08, 0.9);
    const journalMat = new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.9 });
    const journal = new THREE.Mesh(journalGeo, journalMat);
    journal.position.set(-0.35, -0.78, 0.0);
    journal.rotation.y = 0.15;
    quillGroup.add(journal);

    // Parker 51 Fountain Pen (Celluloid barrel + Gold Nib)
    const penGroup = new THREE.Group();
    const barrelGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.9, 16);
    const barrelMat = new THREE.MeshStandardMaterial({ color: 0x052e16, roughness: 0.2, metalness: 0.4 });
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    penGroup.add(barrel);

    const nibGeo = new THREE.ConeGeometry(0.035, 0.15, 16);
    const nibMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.15, metalness: 0.95 });
    const nib = new THREE.Mesh(nibGeo, nibMat);
    nib.position.y = 0.52;
    penGroup.add(nib);

    penGroup.position.set(0.45, -0.78, 0.15);
    penGroup.rotation.set(Math.PI / 2, 0, -0.6);
    quillGroup.add(penGroup);

    // Brass Ink Bottle
    const inkGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.25, 16);
    const inkMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35, metalness: 0.8 });
    const ink = new THREE.Mesh(inkGeo, inkMat);
    ink.position.set(0.65, -0.75, -0.35);
    quillGroup.add(ink);

    state.exhibits.quill = quillGroup;
    state.scene.add(quillGroup);

    // Hide all except initial exhibit
    switchExhibit('constitution', false);
  }

  // 8. Exhibit Switcher
  function switchExhibit(id, triggerSound = true) {
    if (!state.exhibits[id]) return;
    state.activeExhibitId = id;

    Object.keys(state.exhibits).forEach(key => {
      const isTarget = key === id;
      state.exhibits[key].visible = isTarget;
      if (isTarget) {
        state.exhibits[key].scale.set(0.01, 0.01, 0.01);
      }
    });

    // Reset rotation
    state.showcaseRotation.x = 0;
    state.showcaseRotation.y = 0;
    state.showcaseTargetRotation.x = 0;
    state.showcaseTargetRotation.y = 0;

    if (triggerSound) playHapticSound('switch');

    // Update UI HUD
    updateShowcaseHUD(id);

    // Log telemetry
    if (window.SpatialBackendClient) {
      window.SpatialBackendClient.logTelemetry('view', id);
    }
  }

  // 9. Update UI HUD elements
  function updateShowcaseHUD(id) {
    // Dock Active Pill
    document.querySelectorAll('.spatial-dock-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.exhibit === id);
    });

    const info = {
      constitution: {
        name: 'Constitution of India (1950)',
        period: '1947–1950',
        material: 'Hand-Calligraphed Parchment, Gold Inlay',
        desc: 'Crafted under Dr. Ambedkar\'s chairmanship of the Drafting Committee. Weighs 13 kg with 251 pages.'
      },
      bust: {
        name: 'Dr. B. R. Ambedkar Memorial Bust',
        period: '1891–1956',
        material: 'Heroic Cast Patinated Bronze',
        desc: 'Honoring the chief architect of the Republic, scholar of Columbia University and London School of Economics.'
      },
      mahad: {
        name: 'Mahad Satyagraha Water Pillar',
        period: '20 March 1927',
        material: 'Black Basalt & Commemorative Brass',
        desc: 'Monument to the liberation of Chavdar Lake — the historic declaration of human rights and equality.'
      },
      quill: {
        name: 'Drafting Instruments Suite',
        period: 'Circa 1947',
        material: 'Parker 51 Gold Nib & Journal',
        desc: 'Personal drafting pens and annotated journals used during constitutional deliberation sessions in Delhi.'
      }
    };

    const current = info[id] || info.constitution;
    const nameEl = document.getElementById('spatial-hud-name');
    const metaEl = document.getElementById('spatial-hud-meta');
    const descEl = document.getElementById('spatial-hud-desc');

    if (nameEl) nameEl.textContent = current.name;
    if (metaEl) metaEl.textContent = `${current.period} • ${current.material}`;
    if (descEl) descEl.textContent = current.desc;
  }

  // 10. Lighting Presets Switcher
  function cycleLightingPreset() {
    const presets = ['studio_dark', 'museum_gold', 'cyber_monochrome'];
    const idx = (presets.indexOf(state.currentLightingPreset) + 1) % presets.length;
    state.currentLightingPreset = presets[idx];

    playHapticSound('click');

    const config = {
      studio_dark: {
        amb: 0x1e293b,
        ambI: 1.2,
        key: 0xffffff,
        keyI: 2.4,
        fill: 0x2563eb,
        fillI: 1.5,
        rim: 0xf59e0b,
        rimI: 2.8,
        bg: 0x07090e
      },
      museum_gold: {
        amb: 0x291e10,
        ambI: 1.4,
        key: 0xfef3c7,
        keyI: 2.8,
        fill: 0xd97706,
        fillI: 1.8,
        rim: 0xf59e0b,
        rimI: 3.2,
        bg: 0x0a0805
      },
      cyber_monochrome: {
        amb: 0x111111,
        ambI: 0.8,
        key: 0xffffff,
        keyI: 3.0,
        fill: 0x64748b,
        fillI: 1.0,
        rim: 0xffffff,
        rimI: 3.5,
        bg: 0x020408
      }
    }[state.currentLightingPreset];

    state.lights.ambient.color.setHex(config.amb);
    state.lights.ambient.intensity = config.ambI;
    state.lights.keyLight.color.setHex(config.key);
    state.lights.keyLight.intensity = config.keyI;
    state.lights.fillLight.color.setHex(config.fill);
    state.lights.fillLight.intensity = config.fillI;
    state.lights.rimLight.color.setHex(config.rim);
    state.lights.rimLight.intensity = config.rimI;
    state.scene.fog.color.setHex(config.bg);
  }

  // 11. Toggle Wireframe Geometry Mode
  function toggleWireframe() {
    state.wireframeMode = !state.wireframeMode;
    playHapticSound('click');

    state.scene.traverse(child => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.wireframe = state.wireframeMode);
        } else {
          child.material.wireframe = state.wireframeMode;
        }
      }
    });

    const btn = document.getElementById('spatial-btn-wireframe');
    if (btn) btn.classList.toggle('active', state.wireframeMode);
  }

  // 12. Load Backend Configuration
  async function loadBackendConfig() {
    if (!window.SpatialBackendClient) return;
    const exp = await window.SpatialBackendClient.getExperience();
    if (exp && exp.scrollWaypoints) {
      state.waypoints = exp.scrollWaypoints;
    }
  }

  // 13. Event Listeners & Interaction Wiring
  function bindEvents() {
    // Window Resize
    window.addEventListener('resize', () => {
      state.width = window.innerWidth;
      state.height = window.innerHeight;
      state.camera.aspect = state.width / state.height;
      state.camera.updateProjectionMatrix();
      state.renderer.setSize(state.width, state.height);
    });

    // Mouse Movement Parallax
    window.addEventListener('mousemove', e => {
      state.mouse.targetX = (e.clientX / state.width - 0.5) * 2;
      state.mouse.targetY = -(e.clientY / state.height - 0.5) * 2;
    });

    // Device Orientation (Gyroscope on Mobile)
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', e => {
        if (e.gamma !== null && e.beta !== null) {
          state.mouse.targetX = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
          state.mouse.targetY = THREE.MathUtils.clamp(e.beta / 45, -1, 1);
        }
      });
    }

    // Scroll-Driven Choreography
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Interactive Showcase Stage Pointer Drag & Orbit
    const viewport = document.getElementById('spatial-stage-viewport');
    if (viewport) {
      viewport.addEventListener('pointerdown', e => {
        state.isDragging = true;
        state.previousMousePosition = { x: e.clientX, y: e.clientY };
        viewport.setPointerCapture(e.pointerId);
      });

      viewport.addEventListener('pointermove', e => {
        if (!state.isDragging) return;
        const deltaX = e.clientX - state.previousMousePosition.x;
        const deltaY = e.clientY - state.previousMousePosition.y;

        state.showcaseTargetRotation.y += deltaX * 0.008;
        state.showcaseTargetRotation.x += deltaY * 0.006;
        state.showcaseTargetRotation.x = THREE.MathUtils.clamp(state.showcaseTargetRotation.x, -0.6, 0.6);

        state.previousMousePosition = { x: e.clientX, y: e.clientY };
        state.autoRotate = false; // pause auto-spin during user drag
      });

      viewport.addEventListener('pointerup', e => {
        state.isDragging = false;
        try { viewport.releasePointerCapture(e.pointerId); } catch(err){}
        if (window.SpatialBackendClient) {
          window.SpatialBackendClient.logTelemetry('rotate', state.activeExhibitId);
        }
      });

      // Mouse Wheel to Zoom in Showcase
      viewport.addEventListener('wheel', e => {
        e.preventDefault();
        const zoomDelta = e.deltaY * 0.002;
        state.targetCamPos.z = THREE.MathUtils.clamp(state.targetCamPos.z + zoomDelta, 3.2, 7.5);
      }, { passive: false });
    }

    // Dock Pills
    document.querySelectorAll('.spatial-dock-item').forEach(btn => {
      btn.addEventListener('click', () => {
        state.userManualSelection = true;
        const id = btn.dataset.exhibit;
        if (id) switchExhibit(id);
      });
    });

    // Control Buttons
    const btnRotate = document.getElementById('spatial-btn-rotate');
    if (btnRotate) {
      btnRotate.addEventListener('click', () => {
        state.autoRotate = !state.autoRotate;
        btnRotate.classList.toggle('active', state.autoRotate);
        playHapticSound('click');
      });
    }

    const btnLight = document.getElementById('spatial-btn-light');
    if (btnLight) {
      btnLight.addEventListener('click', cycleLightingPreset);
    }

    const btnWire = document.getElementById('spatial-btn-wireframe');
    if (btnWire) {
      btnWire.addEventListener('click', toggleWireframe);
    }

    const btnSound = document.getElementById('spatial-btn-sound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        btnSound.classList.toggle('active', state.soundEnabled);
        btnSound.textContent = state.soundEnabled ? '🔊' : '🔇';
      });
    }

    // Initial scroll check
    handleScroll();
  }

  // 14. Scroll Handler (Choreographer)
  function handleScroll() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
    state.scrollProgress = progress;

    // Check if user is inside the Interactive Showcase section
    const showcaseSec = document.getElementById('interactive-showcase');
    if (showcaseSec) {
      const rect = showcaseSec.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
      state.showcaseActive = inView;
      if (state.canvas) {
        state.canvas.classList.toggle('interactive-mode', inView);
      }
    }

    // Apple Scrollytelling Milestones
    if (progress < 0.2) {
      // Hero Stage: Memorial Bust
      if (!state.userManualSelection && state.activeExhibitId !== 'bust') {
        switchExhibit('bust', false);
      }
      state.targetCamPos.set(0.5, 1.4, 6.2);
      state.targetLookAt.set(0.2, 0.5, 0);
    } else if (progress < 0.45) {
      // Archive Library Stage: Historical Drafting Suite
      if (!state.userManualSelection && state.activeExhibitId !== 'quill') {
        switchExhibit('quill', false);
      }
      state.targetCamPos.set(2.4, 1.8, 5.0);
      state.targetLookAt.set(0.2, 0.4, 0);
    } else if (progress < 0.75) {
      // Constitution & Showcase Stage: Illuminated Constitution
      if (!state.userManualSelection && state.activeExhibitId !== 'constitution') {
        switchExhibit('constitution', false);
      }
      state.targetCamPos.set(-0.1, 1.5, 4.4);
      state.targetLookAt.set(0, 0.5, 0);
    } else if (progress < 0.88) {
      // Timeline Ribbon Stage: Mahad Satyagraha Water Pillar
      if (!state.userManualSelection && state.activeExhibitId !== 'mahad') {
        switchExhibit('mahad', false);
      }
      state.targetCamPos.set(-2.5, 1.3, 5.2);
      state.targetLookAt.set(-0.3, 0.3, 0);
    } else {
      // Philosophy & Vows Stage: High Perspective Golden Halo
      state.targetCamPos.set(0, 2.5, 5.6);
      state.targetLookAt.set(0, 0.2, 0);
    }
  }

  // 15. Render Loop (60 FPS smooth interpolation)
  function animate() {
    requestAnimationFrame(animate);

    const delta = state.clock.getDelta();
    const elapsed = state.clock.getElapsedTime();

    // Mouse interpolation
    state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.05;
    state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.05;

    // Smooth Camera Lerp
    state.currentCamPos.lerp(state.targetCamPos, 0.06);
    state.currentLookAt.lerp(state.targetLookAt, 0.06);

    // Apply Parallax offset to camera
    const parallaxX = state.mouse.x * 0.35;
    const parallaxY = state.mouse.y * 0.25;
    state.camera.position.set(
      state.currentCamPos.x + parallaxX,
      state.currentCamPos.y + parallaxY,
      state.currentCamPos.z
    );
    state.camera.lookAt(state.currentLookAt);

    // Rotate Particles
    if (state.particles) {
      state.particles.rotation.y = elapsed * 0.025;
      state.particles.rotation.x = elapsed * 0.012;
    }

    // Active Exhibit Motion & Inertial Drag Rotation
    const activeExhibit = state.exhibits[state.activeExhibitId];
    if (activeExhibit) {
      // Scale-in spring animation on switch
      if (activeExhibit.scale.x < 1) {
        const nextScale = THREE.MathUtils.lerp(activeExhibit.scale.x, 1, 0.12);
        activeExhibit.scale.set(nextScale, nextScale, nextScale);
      }

      // Auto-rotation in showcase
      if (state.autoRotate && !state.isDragging) {
        state.showcaseTargetRotation.y += 0.006;
      }

      // Smooth dampening rotation
      state.showcaseRotation.x = THREE.MathUtils.lerp(state.showcaseRotation.x, state.showcaseTargetRotation.x, 0.08);
      state.showcaseRotation.y = THREE.MathUtils.lerp(state.showcaseRotation.y, state.showcaseTargetRotation.y, 0.08);

      activeExhibit.rotation.x = state.showcaseRotation.x;
      activeExhibit.rotation.y = state.showcaseRotation.y;

      // Pulse holographic halo on Constitution
      if (activeExhibit.halo) {
        activeExhibit.halo.rotation.z = elapsed * 0.5;
      }
    }

    state.renderer.render(state.scene, state.camera);
  }

  // Auto-launch when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEngine);
  } else {
    initEngine();
  }

  // Public API
  window.SpatialLandingEngine = {
    switchExhibit,
    cycleLightingPreset,
    toggleWireframe,
    playHapticSound
  };
})();
