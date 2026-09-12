/**
 * Ambedkar Digital Archive — Feature 6: 3D Constitution Experience
 * An illuminated symbolic hall centered around the Floating Folio of the Constitution
 * surrounded by 7 Constitutional Pillars: Justice, Liberty, Equality, Fraternity,
 * Fundamental Rights, Directive Principles, and Constitutional Morality.
 */

class ConstitutionExperience {
  constructor() {
    this.badge = 'Constitutional Hall';
    this.title = 'The Living Constitution: 3D Symbolic Experience';
    this.hint = 'Click the central Folio or surrounding Pillars to explore constitutional tenets';

    this.core = null;
    this.THREE = null;
    this.motionEnabled = true;
    this.pillars = [];
    this.centralBookGroup = null;
    this.raycaster = null;
    this.mouse = null;
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.cameraAngle = 0;
    this.cameraDistance = 16;
    this.cameraHeight = 6;
    this.targetLookAt = { x: 0, y: 2.2, z: 0 };
    this.currentLookAt = { x: 0, y: 2.2, z: 0 };

    this.pillarData = [
      {
        id: 'justice',
        title: 'Justice: Social, Economic & Political',
        tag: 'PREAMBLE & DIRECTIVE PRINCIPLES',
        symbol: '⚖️',
        color: 0x3b82f6,
        description: 'Justice stands first in the Preamble. For Dr. Ambedkar, political justice through democracy was hollow without social and economic justice ending caste deprivation and inequality.',
        quote: 'On the 26th of January 1950, we are going to enter into a life of contradictions. In politics we will have equality and in social and economic life we will have inequality.',
        meta: [
          { label: 'Key Articles', value: 'Preamble, Article 38 (State to secure social order), Article 39A' },
          { label: 'Assembly Speech', value: 'November 25, 1949 (Final Constituent Assembly Address)' }
        ],
        links: [
          { label: 'Read Preamble in Archive', url: '/constitution.html#preamble', primary: true }
        ]
      },
      {
        id: 'liberty',
        title: 'Liberty: Thought, Expression & Faith',
        tag: 'PART III: ARTICLES 19 & 25',
        symbol: '🕊️',
        color: 0x10b981,
        description: 'Liberty guarantees freedoms of speech, assembly, association, movement, and freedom of conscience. Ambedkar defended liberty while emphasizing it must be bounded by social responsibility.',
        quote: 'Political democracy cannot last unless there lies at the base of it social democracy.',
        meta: [
          { label: 'Key Articles', value: 'Article 19 (Six Freedoms), Article 21 (Right to Life & Liberty)' },
          { label: 'Drafting Role', value: 'Refined reasonable restrictions to protect public order and morality' }
        ],
        links: [
          { label: 'Explore Fundamental Rights', url: '/constitution.html#rights', primary: true }
        ]
      },
      {
        id: 'equality',
        title: 'Equality: Status & Opportunity',
        tag: 'ARTICLES 14–18: ABOLITION OF UNTOUCHABILITY',
        symbol: '🤝',
        color: 0xf59e0b,
        description: 'Article 14 establishes equality before law, Article 15 prohibits discrimination, Article 16 provides equal opportunity, and Article 17 permanently abolishes Untouchability and outlaws its practice.',
        quote: 'Equality may be a fiction, but nonetheless one must accept it as the governing principle.',
        meta: [
          { label: 'Historic Milestone', value: 'Article 17 — "Untouchability" is abolished and its practice in any form is forbidden' },
          { label: 'Affirmative Action', value: 'Articles 15(4) & 16(4) enabling special provisions for disadvantaged classes' }
        ],
        links: [
          { label: 'Inspect Equality Clauses', url: '/constitution.html#rights', primary: true }
        ]
      },
      {
        id: 'fraternity',
        title: 'Fraternity: Human Dignity & Unity',
        tag: 'PREAMBLE: CONJOINED ETHOS',
        symbol: '🌿',
        color: 0x8b5cf6,
        description: 'Fraternity means a sense of common brotherhood and sisterhood of all Indians. Dr. Ambedkar insisted that without fraternity, liberty and equality cannot become natural things in society.',
        quote: 'Fraternity means a sense of common brotherhood of all Indians — if Indians being one people. It is the only thing which gives unity and solidarity to social life.',
        meta: [
          { label: 'Significance', value: 'Added by Ambedkar’s committee into the Preamble draft to stress mutual dignity' },
          { label: 'Philosophical Basis', value: 'Rooted in the French Revolutionary tripos and Buddhist Maitri (compassion)' }
        ],
        links: [
          { label: 'View Preamble Analysis', url: '/constitution.html#preamble', primary: true }
        ]
      },
      {
        id: 'remedies',
        title: 'Fundamental Rights & Article 32',
        tag: 'HEART & SOUL OF THE CONSTITUTION',
        symbol: '🛡️',
        color: 0xef4444,
        description: 'Article 32 guarantees the right to move the Supreme Court by appropriate proceedings for the enforcement of Fundamental Rights through writs of Habeas Corpus, Mandamus, Prohibition, Quo Warranto, and Certiorari.',
        quote: 'If I was asked to name any particular article in this Constitution as the most important... I could not refer to any other article except this one. It is the very soul of the Constitution and the very heart of it.',
        meta: [
          { label: 'Judicial Power', value: 'Direct petition to Supreme Court (Art 32) and High Courts (Art 226)' },
          { label: 'Protection', value: 'Cannot be suspended except in accordance with constitutional provisions' }
        ],
        links: [
          { label: 'Read Article 32 Full Text', url: '/constitution.html#articles', primary: true }
        ]
      },
      {
        id: 'dpsp',
        title: 'Directive Principles of State Policy',
        tag: 'PART IV: INSTRUMENTS OF INSTRUCTIONS',
        symbol: '🏛️',
        color: 0xeab308,
        description: 'Guidelines to the legislature and executive for establishing economic democracy, fair wages, humane conditions of work, public health, free legal aid, and universal education.',
        quote: 'Directive Principles are like instruments of instructions... Whoever captures power will not be free to do what he likes with it.',
        meta: [
          { label: 'Key Provisions', value: 'Equal pay for equal work, maternity relief, protection of monuments' },
          { label: 'Governance Role', value: 'Fundamental in the governance of the country' }
        ],
        links: [
          { label: 'Explore Directive Principles', url: '/constitution.html#dpsp', primary: true }
        ]
      },
      {
        id: 'morality',
        title: 'Constitutional Morality & Rule of Law',
        tag: 'ETHICAL FOUNDATION OF DEMOCRACY',
        symbol: '🗳️',
        color: 0x06b6d4,
        description: 'Dr. Ambedkar introduced George Grote’s concept of "Constitutional Morality" to the Assembly — asserting that obedience to constitutional forms must be actively cultivated by citizens and rulers alike.',
        quote: 'Constitutional morality is not a natural sentiment. It has to be cultivated. We must realize that our people have yet to learn it.',
        meta: [
          { label: 'Concept Origin', value: 'George Grote’s History of Greece, adapted for diverse Indian democracy' },
          { label: 'Warning', value: 'Beware of hero-worship (Bhakti) in politics as it leads to degradation and dictatorship' }
        ],
        links: [
          { label: 'Read Debates on Governance', url: '/constitution.html#debates', primary: true }
        ]
      }
    ];
  }

  getSections() {
    return [
      { id: 'folio', label: '📖 Central Folio' },
      ...this.pillarData.map(p => ({ id: p.id, label: `${p.symbol} ${p.title.split(':')[0]}` }))
    ];
  }

  getFallbackData() {
    return [
      {
        tag: 'PRIMARY ARTIFACT',
        title: 'The Constitution of India: Central Folio',
        description: 'Crafted under Dr. B. R. Ambedkar’s chairmanship of the Drafting Committee, the Constitution established the sovereign, socialist, secular, democratic republic of India on January 26, 1950.',
        quote: 'However good a Constitution may be, if those who are implementing it are not good, it will prove to be bad.',
        links: [{ label: 'Read Constitution in Archive', url: '/constitution.html', primary: true }]
      },
      ...this.pillarData
    ];
  }

  async init(core, THREE) {
    this.core = core;
    this.THREE = THREE;
    const scene = core.scene;

    // Camera setup
    core.camera.position.set(0, 6, this.cameraDistance);
    core.camera.lookAt(0, 2.2, 0);

    // 1. Stately Circular Marble Base with Gold Inlay
    const floorGeo = new THREE.CylinderGeometry(15, 15, 0.4, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a1020,
      roughness: 0.25,
      metalness: 0.6
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Ashoka Chakra Inlay in floor
    const chakraGeo = new THREE.RingGeometry(4.5, 4.65, 48);
    const chakraMat = new THREE.MeshBasicMaterial({ color: 0xc59b27, side: THREE.DoubleSide });
    const chakraRing = new THREE.Mesh(chakraGeo, chakraMat);
    chakraRing.rotation.x = -Math.PI / 2;
    chakraRing.position.y = 0.01;
    scene.add(chakraRing);

    // 2. Central Illuminated Constitution Book / Folio
    this.centralBookGroup = new THREE.Group();
    this.centralBookGroup.position.set(0, 2.8, 0);

    // Pedestal
    const pedGeo = new THREE.CylinderGeometry(1.6, 2.0, 2.4, 32);
    const pedMat = new THREE.MeshStandardMaterial({ color: 0x121a2f, roughness: 0.3, metalness: 0.7 });
    const ped = new THREE.Mesh(pedGeo, pedMat);
    ped.position.y = -1.2;
    this.centralBookGroup.add(ped);

    // Open Book Geometry (Two Angled Folios)
    const coverMat = new THREE.MeshStandardMaterial({ color: 0x6e1a24, roughness: 0.4, metalness: 0.3 }); // Reddish leather
    const pageMat = new THREE.MeshStandardMaterial({
      color: 0xfbf6e9,
      roughness: 0.3,
      emissive: 0xfbf6e9,
      emissiveIntensity: 0.15
    });

    const leftPageGeo = new THREE.BoxGeometry(1.6, 0.1, 2.2);
    const leftPage = new THREE.Mesh(leftPageGeo, pageMat);
    leftPage.position.set(-0.85, 0.3, 0);
    leftPage.rotation.z = 0.15;
    this.centralBookGroup.add(leftPage);

    const rightPage = new THREE.Mesh(leftPageGeo, pageMat);
    rightPage.position.set(0.85, 0.3, 0);
    rightPage.rotation.z = -0.15;
    this.centralBookGroup.add(rightPage);

    // Spine
    const spineGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.2, 16);
    const spine = new THREE.Mesh(spineGeo, coverMat);
    spine.rotation.x = Math.PI / 2;
    spine.position.y = 0.18;
    this.centralBookGroup.add(spine);

    // Luminous halo around Constitution book
    const haloGeo = new THREE.TorusGeometry(1.9, 0.06, 16, 48);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xe9c46a });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 0.4;
    this.centralBookGroup.add(halo);
    this.centralHalo = halo;

    // Raycast hit target for Central Folio
    const bookHitGeo = new THREE.CylinderGeometry(2.4, 2.4, 3, 16);
    const bookHitMat = new THREE.MeshBasicMaterial({ visible: false });
    const bookHit = new THREE.Mesh(bookHitGeo, bookHitMat);
    bookHit.userData = { isFolio: true };
    this.centralBookGroup.add(bookHit);
    this.bookHit = bookHit;

    scene.add(this.centralBookGroup);

    // 3. 7 Surrounding Constitutional Pillars
    const radius = 9.5;
    const count = this.pillarData.length;

    this.pillarData.forEach((data, i) => {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      const group = new THREE.Group();
      group.position.set(x, 0, z);

      // Fluted Classical Column
      const colGeo = new THREE.CylinderGeometry(0.7, 0.85, 4.8, 20);
      const colMat = new THREE.MeshStandardMaterial({
        color: 0x141f36,
        roughness: 0.3,
        metalness: 0.5
      });
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.y = 2.4;
      col.castShadow = true;
      group.add(col);

      // Capital / Crown with Pillar Theme Color
      const capGeo = new THREE.CylinderGeometry(1.0, 0.7, 0.5, 20);
      const capMat = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.35,
        roughness: 0.2,
        metalness: 0.7
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 4.95;
      group.add(cap);

      // Floating Principle Orb
      const orbGeo = new THREE.IcosahedronGeometry(0.42, 1);
      const orbMat = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.9
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.y = 6.0;
      group.add(orb);

      // Hit Target
      const hitGeo = new THREE.CylinderGeometry(1.4, 1.4, 6.5, 16);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hit = new THREE.Mesh(hitGeo, hitMat);
      hit.position.y = 3.25;
      hit.userData = { pillar: data, group, orb, cap };
      group.add(hit);

      scene.add(group);
      this.pillars.push({ group, orb, cap, hit, data, angle, x, z });
    });

    // 4. Luminous Particles
    const pCount = Math.floor(500 * core.deviceTier.particles);
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 35;
      pPos[i + 1] = Math.random() * 16;
      pPos[i + 2] = (Math.random() - 0.5) * 35;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xe9c46a,
      size: 0.12,
      transparent: true,
      opacity: 0.5
    });
    this.particles = new THREE.Points(pGeo, pMat);
    scene.add(this.particles);

    // 5. Lighting
    const ambient = new THREE.AmbientLight(0xdbeafe, 0.7);
    scene.add(ambient);

    const centralLight = new THREE.PointLight(0xfff5d6, 2.2, 22);
    centralLight.position.set(0, 5, 0);
    scene.add(centralLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    // 6. Raycast & Interaction
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
        this.cameraHeight = Math.max(3, Math.min(12, this.cameraHeight - deltaY * 0.02));
        this.prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    this.onPointerUp = () => {
      this.isDragging = false;
    };

    this.onClick = () => {
      if (!this.raycaster || !this.core.camera) return;
      this.raycaster.setFromCamera(this.mouse, this.core.camera);

      const hitTargets = [this.bookHit, ...this.pillars.map(p => p.hit)];
      const intersects = this.raycaster.intersectObjects(hitTargets);

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData.isFolio) {
          this.selectFolio();
        } else if (obj.userData.pillar) {
          this.selectPillar(obj.userData.pillar);
        }
      }
    };

    canvas.addEventListener('mousedown', this.onPointerDown);
    window.addEventListener('mousemove', this.onPointerMove);
    window.addEventListener('mouseup', this.onPointerUp);
    canvas.addEventListener('click', this.onClick);

    // Mobile touch
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
          this.cameraHeight = Math.max(3, Math.min(12, this.cameraHeight - deltaY * 0.02));
          this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
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
    if (id === 'folio') {
      this.selectFolio();
    } else {
      const p = this.pillarData.find(item => item.id === id);
      if (p) this.selectPillar(p);
    }
  }

  selectFolio() {
    this.targetLookAt = { x: 0, y: 2.8, z: 0 };
    this.cameraDistance = 9;

    const data = {
      tag: 'CENTRAL ARTIFACT',
      title: 'The Constitution of India',
      description: 'The supreme legal document of the Republic of India. Dr. B. R. Ambedkar served as the Chairman of the Drafting Committee, introducing the draft on November 4, 1948, and defending its provisions across extensive Constituent Assembly Debates.',
      quote: 'I feel that the Constitution is workable; it is flexible and it is strong enough to hold the country together both in peacetime and in wartime.',
      meta: [
        { label: 'Enacted On', value: '26 November 1949 (Constitution Day)' },
        { label: 'Commenced On', value: '26 January 1950 (Republic Day)' },
        { label: 'Preamble Vow', value: 'Sovereign, Socialist, Secular, Democratic Republic' }
      ],
      links: [
        { label: 'Open Constitution Archive', url: '/constitution.html', primary: true },
        { label: 'Read Constituent Assembly Debates', url: '/constitution.html#debates', primary: false }
      ]
    };

    this.core.showDetailModal(data);
  }

  selectPillar(pillarData) {
    const pil = this.pillars.find(p => p.data.id === pillarData.id);
    if (!pil) return;

    this.targetLookAt = { x: pil.x, y: 3.5, z: pil.z };
    this.cameraDistance = 14;

    this.core.showDetailModal(pillarData);
  }

  setMotion(enabled) {
    this.motionEnabled = enabled;
  }

  update(delta, elapsed) {
    const camera = this.core.camera;
    if (!camera) return;

    // Auto slow rotate camera when not interacting
    if (!this.isDragging && this.motionEnabled && !document.getElementById('three-detail-modal').classList.contains('visible')) {
      this.cameraAngle += delta * 0.07;
    }

    const targetX = Math.sin(this.cameraAngle) * this.cameraDistance;
    const targetZ = Math.cos(this.cameraAngle) * this.cameraDistance;

    const factor = this.motionEnabled ? 0.05 : 0.2;
    camera.position.x += (targetX - camera.position.x) * factor;
    camera.position.y += (this.cameraHeight - camera.position.y) * factor;
    camera.position.z += (targetZ - camera.position.z) * factor;

    this.currentLookAt.x += (this.targetLookAt.x - this.currentLookAt.x) * factor;
    this.currentLookAt.y += (this.targetLookAt.y - this.currentLookAt.y) * factor;
    this.currentLookAt.z += (this.targetLookAt.z - this.currentLookAt.z) * factor;
    camera.lookAt(this.currentLookAt.x, this.currentLookAt.y, this.currentLookAt.z);

    // Floating animation
    if (this.motionEnabled) {
      if (this.centralBookGroup) {
        this.centralBookGroup.position.y = 2.8 + Math.sin(elapsed * 1.5) * 0.08;
      }
      if (this.centralHalo) {
        this.centralHalo.rotation.z += delta * 0.3;
      }
      this.pillars.forEach((p, idx) => {
        p.orb.position.y = 6.0 + Math.sin(elapsed * 2 + idx) * 0.14;
        p.orb.rotation.y += delta * 0.6;
      });
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

window.ConstitutionExperience = ConstitutionExperience;
