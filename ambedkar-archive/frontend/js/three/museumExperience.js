/**
 * Ambedkar Digital Archive — Feature 1: 3D Ambedkar Digital Museum
 * A virtual heritage rotunda with 8 interactive pavilions:
 * 1. Complete Works
 * 2. Letters & Correspondence
 * 3. Constitution
 * 4. Buddhism & 22 Vows
 * 5. Ideas & Philosophy
 * 6. Learning & Education
 * 7. Speeches & AV Archive
 * 8. AI Research Center
 */

class MuseumExperience {
  constructor() {
    this.badge = 'Virtual Rotunda';
    this.title = 'Ambedkar Digital Heritage Museum';
    this.hint = 'Click or tap any pavilion to explore • Rotate camera by dragging';

    this.core = null;
    this.THREE = null;
    this.pavilions = [];
    this.particles = null;
    this.raycaster = null;
    this.mouse = null;
    this.hoveredObject = null;

    this.targetCameraPos = { x: 0, y: 7, z: 22 };
    this.targetLookAt = { x: 0, y: 2, z: 0 };
    this.currentLookAt = { x: 0, y: 2, z: 0 };

    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.cameraAngle = 0;
    this.cameraDistance = 22;
    this.cameraHeight = 7;
    this.motionEnabled = true;

    // 8 Pavilions data definitions
    this.pavilionData = [
      {
        id: 'works',
        title: 'Complete Works & Writings',
        tag: 'BAWS VOLUMES (1–40+)',
        symbol: '📚',
        color: 0x3b82f6,
        description: 'Comprehensive repository of Dr. B. R. Ambedkar’s seminal published writings, research monographs, and speeches curated in the Dr. Babasaheb Ambedkar Writings and Speeches (BAWS) series.',
        quote: 'Cultivation of mind should be the ultimate aim of human existence.',
        meta: [
          { label: 'Key Texts', value: 'Annihilation of Caste, Who Were the Shudras?, The Buddha and His Dhamma' },
          { label: 'Language Options', value: 'English, Marathi, Hindi' }
        ],
        links: [
          { label: 'Explore Volumes Archive', url: '/archive.html', primary: true },
          { label: 'Open Reader', url: '/reader.html', primary: false }
        ]
      },
      {
        id: 'letters',
        title: 'Letters & Correspondence',
        tag: 'HISTORICAL EPISTLES',
        symbol: '📜',
        color: 0x10b981,
        description: 'Original correspondence between Dr. Ambedkar and global thinkers, statesmen, freedom fighters, and social activists including John Dewey, Mahatma Gandhi, W.E.B. Du Bois, and Jawaharlal Nehru.',
        quote: 'I measure the progress of a community by the degree of progress which women have achieved.',
        meta: [
          { label: 'Scope', value: 'Personal letters, political petitions, telegrams (1913–1956)' },
          { label: 'Key Theme', value: 'Democratic rights, international solidarity, educational institutions' }
        ],
        links: [
          { label: 'View Letters Archive', url: '/letters.html', primary: true }
        ]
      },
      {
        id: 'constitution',
        title: 'Constitution of India',
        tag: 'CONSTITUTION ASSEMBLY DEBATES',
        symbol: '⚖️',
        color: 0xf59e0b,
        description: 'Dr. Ambedkar served as the Chairman of the Drafting Committee. Explore the constitutional debates, the Preamble, Fundamental Rights, and the vision of Constitutional Morality.',
        quote: 'Constitution is not a mere lawyer’s document, it is the vehicle of Life, and its spirit is always the spirit of Age.',
        meta: [
          { label: 'Key Milestone', value: 'Draft presented Nov 4, 1948; Adopted Nov 26, 1949' },
          { label: 'Core Principles', value: 'Justice, Liberty, Equality, Fraternity' }
        ],
        links: [
          { label: 'Explore Constitution Hall', url: '/constitution.html', primary: true }
        ]
      },
      {
        id: 'vows',
        title: 'Buddhism & The 22 Vows',
        tag: 'DEEKSHABHOOMI (1956)',
        symbol: '☸️',
        color: 0xeab308,
        description: 'The historic Dhamma Deeksha at Nagpur on October 14, 1956, where Dr. Ambedkar and over 500,000 followers embraced Buddhism along with the revolutionary 22 ethical vows.',
        quote: 'Religion must mainly be a matter of principles only. It cannot be a matter of rules.',
        meta: [
          { label: 'Date', value: '14 October 1956 (Nagpur)' },
          { label: 'Philosophy', value: 'Navayana Buddhism — Pragmatic, rational, and humanitarian' }
        ],
        links: [
          { label: 'Read The 22 Vows', url: '/vows.html', primary: true }
        ]
      },
      {
        id: 'ideas',
        title: 'Ideas & Philosophy',
        tag: 'INTELLECTUAL MATRIX',
        symbol: '💡',
        color: 0x8b5cf6,
        description: 'Explore thematic frameworks of Ambedkarite thought: Casteless Society, Democratic Socialism, Economic Reform (The Problem of the Rupee), Women’s Emancipation, and Pragmatism.',
        quote: 'Democracy is not merely a form of government. It is primarily a mode of associated living, of conjoint communicated experience.',
        meta: [
          { label: 'Influences', value: 'Pragmatism (John Dewey), French Revolution ideals, Buddhist Dhamma' }
        ],
        links: [
          { label: 'Explore Philosophy Matrix', url: '/ideas.html', primary: true },
          { label: 'Notable Quotes', url: '/quotes.html', primary: false }
        ]
      },
      {
        id: 'learning',
        title: 'Learning & Research Center',
        tag: 'ACADEMIC RESOURCES',
        symbol: '🎓',
        color: 0xec4899,
        description: 'Curated study tracks, pedagogical timelines, quizzes, research methodologies, and syllabus aids designed for scholars, university students, and independent researchers.',
        quote: 'Educate, Agitate, Organise; Have faith in yourself.',
        meta: [
          { label: 'Tools', value: 'Study modules, self-evaluation quizzes, reading lists' }
        ],
        links: [
          { label: 'Open Learning Center', url: '/learning.html', primary: true }
        ]
      },
      {
        id: 'speeches',
        title: 'Speeches & AV Media',
        tag: 'HISTORIC BROADCASTS',
        symbol: '🎙️',
        color: 0x06b6d4,
        description: 'Authentic historical audio recordings, BBC interviews, Constituent Assembly address recordings, and rare documentary photographs documenting milestone speeches.',
        quote: 'Lost rights are never regained by begging, and by appeals to the conscience of the usurpers, but by relentless struggle.',
        meta: [
          { label: 'Famous Addresses', value: 'Constituent Assembly Closing Speech (1949), BBC 1953 Interview' }
        ],
        links: [
          { label: 'Open Media Archive', url: '/media.html', primary: true }
        ]
      },
      {
        id: 'assistant',
        title: 'AI Research Assistant',
        tag: 'CITATION & INQUIRY',
        symbol: '🤖',
        color: 0x14b8a6,
        description: 'Ask deep historical, legal, and sociological questions answered strictly using verified quotes and citations directly from the 40+ volumes of the Ambedkar archive.',
        quote: 'Be your own light (Atta Dipa Bhava).',
        meta: [
          { label: 'Capabilities', value: 'Semantic citation search, multilingual inquiry, debate analysis' }
        ],
        links: [
          { label: 'Consult AI Assistant', url: '/assistant.html', primary: true }
        ]
      }
    ];
  }

  getSections() {
    return this.pavilionData.map(p => ({
      id: p.id,
      label: `${p.symbol} ${p.title.split('&')[0].trim()}`
    }));
  }

  getFallbackData() {
    return this.pavilionData;
  }

  async init(core, THREE) {
    this.core = core;
    this.THREE = THREE;
    const scene = core.scene;

    // 1. Architectural Floor Rotunda
    const floorGeo = new THREE.CylinderGeometry(20, 20, 0.5, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0c1322,
      roughness: 0.25,
      metalness: 0.5
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.25;
    floor.receiveShadow = true;
    scene.add(floor);

    // Decorative inner gold rings
    const ringGeo = new THREE.RingGeometry(8, 8.2, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xc59b27, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);

    const outerRingGeo = new THREE.RingGeometry(18, 18.25, 64);
    const outerRing = new THREE.Mesh(outerRingGeo, ringMat);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.01;
    scene.add(outerRing);

    // Central Monument Pillar with Ashoka Chakra Motif
    const centerPillarGeo = new THREE.CylinderGeometry(2, 2.4, 6, 32);
    const centerPillarMat = new THREE.MeshStandardMaterial({
      color: 0x111c33,
      roughness: 0.3,
      metalness: 0.7
    });
    const centerPillar = new THREE.Mesh(centerPillarGeo, centerPillarMat);
    centerPillar.position.y = 3;
    scene.add(centerPillar);

    // Ashoka Spoke Emblem on Central Pillar
    const torusGeo = new THREE.TorusGeometry(1.6, 0.08, 16, 48);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xe9c46a, metalness: 0.8, roughness: 0.2 });
    const chakraRim = new THREE.Mesh(torusGeo, goldMat);
    chakraRim.position.y = 7.5;
    scene.add(chakraRim);
    this.chakraRim = chakraRim;

    // 2. Build 8 Pavilions around the perimeter
    const radius = 13.5;
    const count = this.pavilionData.length;

    this.pavilionData.forEach((data, i) => {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      const group = new THREE.Group();
      group.position.set(x, 0, z);

      // Pedestal Base
      const baseGeo = new THREE.BoxGeometry(2.4, 0.6, 2.4);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x151f33,
        roughness: 0.3,
        metalness: 0.4
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.3;
      base.castShadow = true;
      group.add(base);

      // Iconic Floating Exhibit Form (Varied geometries per section)
      let iconGeo;
      if (data.id === 'constitution') {
        iconGeo = new THREE.BoxGeometry(1.2, 1.6, 0.3); // Folio shape
      } else if (data.id === 'vows') {
        iconGeo = new THREE.TorusGeometry(0.7, 0.15, 16, 32); // Chakra ring
      } else if (data.id === 'speeches') {
        iconGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.4, 20); // Microphone capsule
      } else if (data.id === 'works') {
        iconGeo = new THREE.BoxGeometry(1.4, 1.8, 0.4); // Stately Tome
      } else if (data.id === 'ideas') {
        iconGeo = new THREE.OctahedronGeometry(0.85); // Philosophy Crystal
      } else {
        iconGeo = new THREE.DodecahedronGeometry(0.75); // Prism
      }

      const iconMat = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.2,
        metalness: 0.8,
        emissive: data.color,
        emissiveIntensity: 0.25
      });

      const iconMesh = new THREE.Mesh(iconGeo, iconMat);
      iconMesh.position.y = 2.2;
      iconMesh.castShadow = true;
      group.add(iconMesh);

      // Glow Aura Base Ring
      const auraGeo = new THREE.RingGeometry(1.2, 1.4, 32);
      const auraMat = new THREE.MeshBasicMaterial({
        color: data.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const aura = new THREE.Mesh(auraGeo, auraMat);
      aura.rotation.x = -Math.PI / 2;
      aura.position.y = 0.62;
      group.add(aura);

      // Interactive hit boundary
      const hitGeo = new THREE.CylinderGeometry(1.6, 1.6, 3.5, 16);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.y = 1.75;
      hitMesh.userData = { pavilion: data, iconMesh, aura };
      group.add(hitMesh);

      scene.add(group);
      this.pavilions.push({ group, iconMesh, aura, hitMesh, data, angle, x, z });
    });

    // 3. Ambient Ambient Particles
    const pCount = Math.floor(600 * core.deviceTier.particles);
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 45;
      pPos[i + 1] = Math.random() * 20;
      pPos[i + 2] = (Math.random() - 0.5) * 45;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xc59b27,
      size: 0.12,
      transparent: true,
      opacity: 0.6
    });
    this.particles = new THREE.Points(pGeo, pMat);
    scene.add(this.particles);

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xdce7ff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff4e0, 1.2);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = core.deviceTier.shadows;
    scene.add(dirLight);

    const blueRimLight = new THREE.PointLight(0x3b82f6, 1.8, 30);
    blueRimLight.position.set(0, 10, 0);
    scene.add(blueRimLight);

    // 5. Setup Mouse / Touch Interaction
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.bindEvents();
  }

  bindEvents() {
    const canvas = this.core.canvas;

    this.onPointerDown = (e) => {
      this.isDragging = true;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    this.onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (this.isDragging) {
        const deltaX = e.clientX - this.prevMousePos.x;
        const deltaY = e.clientY - this.prevMousePos.y;
        this.cameraAngle -= deltaX * 0.005;
        this.cameraHeight = Math.max(3, Math.min(14, this.cameraHeight - deltaY * 0.02));
        this.prevMousePos = { x: e.clientX, y: e.clientY };

        this.targetCameraPos.x = Math.sin(this.cameraAngle) * this.cameraDistance;
        this.targetCameraPos.z = Math.cos(this.cameraAngle) * this.cameraDistance;
        this.targetCameraPos.y = this.cameraHeight;
      }
    };

    this.onPointerUp = () => {
      this.isDragging = false;
    };

    this.onClick = () => {
      if (!this.raycaster || !this.core.camera) return;
      this.raycaster.setFromCamera(this.mouse, this.core.camera);
      const hitObjects = this.pavilions.map(p => p.hitMesh);
      const intersects = this.raycaster.intersectObjects(hitObjects);

      if (intersects.length > 0) {
        const pavilion = intersects[0].object.userData.pavilion;
        this.selectPavilion(pavilion);
      }
    };

    canvas.addEventListener('mousedown', this.onPointerDown);
    window.addEventListener('mousemove', this.onPointerMove);
    window.addEventListener('mouseup', this.onPointerUp);
    canvas.addEventListener('click', this.onClick);

    // Touch support
    this.onTouchStart = (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    this.onTouchMove = (e) => {
      if (e.touches.length === 1) {
        const rect = canvas.getBoundingClientRect();
        this.mouse.x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;

        if (this.isDragging) {
          const deltaX = e.touches[0].clientX - this.prevMousePos.x;
          const deltaY = e.touches[0].clientY - this.prevMousePos.y;
          this.cameraAngle -= deltaX * 0.006;
          this.cameraHeight = Math.max(3, Math.min(14, this.cameraHeight - deltaY * 0.02));
          this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

          this.targetCameraPos.x = Math.sin(this.cameraAngle) * this.cameraDistance;
          this.targetCameraPos.z = Math.cos(this.cameraAngle) * this.cameraDistance;
          this.targetCameraPos.y = this.cameraHeight;
        }
      }
    };
    this.onTouchEnd = (e) => {
      this.isDragging = false;
      if (e.changedTouches.length === 1) {
        const rect = canvas.getBoundingClientRect();
        this.mouse.x = ((e.changedTouches[0].clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.changedTouches[0].clientY - rect.top) / rect.height) * 2 + 1;
        this.onClick();
      }
    };

    canvas.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', this.onTouchEnd, { passive: true });
  }

  onSectionSelect(id) {
    const item = this.pavilionData.find(p => p.id === id);
    if (item) this.selectPavilion(item);
  }

  selectPavilion(pavilionData) {
    const pav = this.pavilions.find(p => p.data.id === pavilionData.id);
    if (!pav) return;

    // Smoothly focus camera towards pavilion
    const focusDistance = 6.5;
    const dirX = pav.x / 13.5;
    const dirZ = pav.z / 13.5;

    this.targetCameraPos.x = pav.x - dirX * focusDistance;
    this.targetCameraPos.z = pav.z - dirZ * focusDistance;
    this.targetCameraPos.y = 4.2;

    this.targetLookAt.x = pav.x;
    this.targetLookAt.y = 2.2;
    this.targetLookAt.z = pav.z;

    this.cameraAngle = Math.atan2(this.targetCameraPos.x, this.targetCameraPos.z);

    // Update bottom tray active pill
    const tray = document.getElementById('three-nav-tray');
    if (tray) {
      tray.querySelectorAll('.three-pill-item').forEach(p => {
        p.classList.toggle('active', p.getAttribute('data-id') === pavilionData.id);
      });
    }

    // Show Detail Modal
    this.core.showDetailModal(pavilionData);
  }

  setMotion(enabled) {
    this.motionEnabled = enabled;
  }

  update(delta, elapsed) {
    const camera = this.core.camera;
    if (!camera) return;

    // 1. Auto-rotation when not dragging
    if (!this.isDragging && this.motionEnabled && !document.getElementById('three-detail-modal').classList.contains('visible')) {
      this.cameraAngle += delta * 0.08;
      this.targetCameraPos.x = Math.sin(this.cameraAngle) * this.cameraDistance;
      this.targetCameraPos.z = Math.cos(this.cameraAngle) * this.cameraDistance;
    }

    // 2. Smooth camera position & lookAt interpolation (LERP)
    const factor = this.motionEnabled ? 0.05 : 0.2;
    camera.position.x += (this.targetCameraPos.x - camera.position.x) * factor;
    camera.position.y += (this.targetCameraPos.y - camera.position.y) * factor;
    camera.position.z += (this.targetCameraPos.z - camera.position.z) * factor;

    this.currentLookAt.x += (this.targetLookAt.x - this.currentLookAt.x) * factor;
    this.currentLookAt.y += (this.targetLookAt.y - this.currentLookAt.y) * factor;
    this.currentLookAt.z += (this.targetLookAt.z - this.currentLookAt.z) * factor;
    camera.lookAt(this.currentLookAt.x, this.currentLookAt.y, this.currentLookAt.z);

    // 3. Animate pavilion icons
    if (this.motionEnabled) {
      this.pavilions.forEach((p, idx) => {
        p.iconMesh.rotation.y += delta * 0.8;
        p.iconMesh.position.y = 2.2 + Math.sin(elapsed * 2 + idx) * 0.12;
      });

      if (this.chakraRim) {
        this.chakraRim.rotation.z += delta * 0.2;
      }

      if (this.particles) {
        this.particles.rotation.y = elapsed * 0.02;
      }
    }
  }

  dispose() {
    const canvas = this.core ? this.core.canvas : null;
    if (canvas) {
      canvas.removeEventListener('mousedown', this.onPointerDown);
      canvas.removeEventListener('click', this.onClick);
      canvas.removeEventListener('touchstart', this.onTouchStart);
    }
    window.removeEventListener('mousemove', this.onPointerMove);
    window.removeEventListener('mouseup', this.onPointerUp);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
  }
}

window.MuseumExperience = MuseumExperience;
