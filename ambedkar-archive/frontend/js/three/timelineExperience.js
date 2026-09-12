/**
 * Ambedkar Digital Archive — Feature 3: Immersive 3D Historical Timeline
 * A chronological journey along a floating time-corridor with 8 major historical eras
 * and interactive milestone monuments connected directly to verified archive records.
 */

class TimelineExperience {
  constructor() {
    this.badge = 'Chronological Odyssey';
    this.title = 'Dr. B. R. Ambedkar: 3D Historical Journey';
    this.hint = 'Scroll or drag forward/backward to travel through time • Click any milestone to inspect verified records';

    this.core = null;
    this.THREE = null;
    this.motionEnabled = true;
    this.milestoneMeshes = [];
    this.eraPortals = [];
    this.particles = null;

    // Timeline eras
    this.eras = [
      { id: 'era-1', label: '1891–1912: Early Life & Bombay', startYear: 1891, endYear: 1912, zPos: 0, color: 0x3b82f6 },
      { id: 'era-2', label: '1913–1923: Columbia & London', startYear: 1913, endYear: 1923, zPos: -45, color: 0x10b981 },
      { id: 'era-3', label: '1924–1926: Social Awakening', startYear: 1924, endYear: 1926, zPos: -90, color: 0x06b6d4 },
      { id: 'era-4', label: '1927–1929: Mahad Satyagraha', startYear: 1927, endYear: 1929, zPos: -135, color: 0xf59e0b },
      { id: 'era-5', label: '1930–1935: Round Table & Poona Pact', startYear: 1930, endYear: 1935, zPos: -180, color: 0xef4444 },
      { id: 'era-6', label: '1936–1946: Annihilation of Caste & Labour', startYear: 1936, endYear: 1946, zPos: -225, color: 0x8b5cf6 },
      { id: 'era-7', label: '1947–1950: Constitution Drafting', startYear: 1947, endYear: 1950, zPos: -270, color: 0xeab308 },
      { id: 'era-8', label: '1951–1956: Dhamma Deeksha', startYear: 1951, endYear: 1956, zPos: -315, color: 0xec4899 }
    ];

    // Read events from window.TIMELINE_EVENTS or fallback to curated verified set
    this.events = (typeof window !== 'undefined' && window.TIMELINE_EVENTS && window.TIMELINE_EVENTS.length)
      ? window.TIMELINE_EVENTS
      : this.getBuiltInEvents();

    this.currentTrackZ = 12;
    this.targetTrackZ = 12;
    this.maxZ = 15;
    this.minZ = -340;
    this.mouse = { x: 0, y: 0 };
    this.isDragging = false;
    this.prevPointerY = 0;
  }

  getSections() {
    return this.eras.map(e => ({
      id: e.id,
      label: e.label.split(':')[0]
    }));
  }

  getFallbackData() {
    return this.events.map(ev => ({
      tag: `${ev.year} • ${ev.location || 'India'}`,
      title: ev.title,
      description: ev.detail || ev.desc,
      quote: ev.quote,
      links: [
        { label: 'View in 2D Timeline', url: `/timeline.html#year-${ev.year}`, primary: true },
        ev.bookRef ? { label: `Read in BAWS Vol. ${ev.bookRef.volNo}`, url: `/reader.html?vol=${ev.bookRef.volNo}&doc=${ev.bookRef.docId || ''}`, primary: false } : null
      ].filter(Boolean)
    }));
  }

  async init(core, THREE) {
    this.core = core;
    this.THREE = THREE;
    const scene = core.scene;

    // Reset camera orientation
    core.camera.position.set(0, 3.5, this.targetTrackZ);
    core.camera.lookAt(0, 2.5, this.targetTrackZ - 10);

    // 1. Time-corridor track (Guideway lines & floor ribbons)
    const trackGeo = new THREE.PlaneGeometry(10, 360, 1, 120);
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0x070c18,
      roughness: 0.3,
      metalness: 0.6
    });
    const track = new THREE.Mesh(trackGeo, trackMat);
    track.rotation.x = -Math.PI / 2;
    track.position.set(0, 0, -165);
    track.receiveShadow = true;
    scene.add(track);

    // Glowing track boundary rails
    const railMat = new THREE.MeshBasicMaterial({ color: 0xc59b27 });
    const leftRailGeo = new THREE.BoxGeometry(0.08, 0.08, 360);
    const leftRail = new THREE.Mesh(leftRailGeo, railMat);
    leftRail.position.set(-4.8, 0.05, -165);
    scene.add(leftRail);

    const rightRail = new THREE.Mesh(leftRailGeo, railMat);
    rightRail.position.set(4.8, 0.05, -165);
    scene.add(rightRail);

    // 2. Build Era Portals
    this.eras.forEach(era => {
      const archGroup = new THREE.Group();
      archGroup.position.set(0, 0, era.zPos);

      // Torus / Arch Gateway
      const archGeo = new THREE.TorusGeometry(5, 0.12, 16, 32, Math.PI);
      const archMat = new THREE.MeshStandardMaterial({
        color: era.color,
        emissive: era.color,
        emissiveIntensity: 0.35,
        roughness: 0.2,
        metalness: 0.8
      });
      const arch = new THREE.Mesh(archGeo, archMat);
      arch.position.y = 0;
      archGroup.add(arch);

      // Floor marker ring
      const markerGeo = new THREE.RingGeometry(4.2, 4.4, 32);
      const marker = new THREE.Mesh(markerGeo, archMat);
      marker.rotation.x = -Math.PI / 2;
      marker.position.y = 0.02;
      archGroup.add(marker);

      scene.add(archGroup);
      this.eraPortals.push({ group: archGroup, era });
    });

    // 3. Populate Milestone Pedestals along the track
    // Distribute events proportionally between year 1891 and 1956
    const minYr = 1891;
    const maxYr = 1956;
    const totalTrackLength = 320; // from 0 to -320

    this.events.forEach((ev, idx) => {
      const yearNorm = Math.max(0, Math.min(1, (ev.year - minYr) / (maxYr - minYr)));
      const zPos = -(yearNorm * totalTrackLength);
      // Alternate left and right side of track
      const isLeft = idx % 2 === 0;
      const xPos = isLeft ? -3.2 : 3.2;

      const group = new THREE.Group();
      group.position.set(xPos, 0, zPos);

      // Pedestal
      const baseGeo = new THREE.CylinderGeometry(0.75, 0.9, 1.2, 24);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x131d33,
        roughness: 0.2,
        metalness: 0.7
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.6;
      base.castShadow = true;
      group.add(base);

      // Floating Year Monolith
      const monolithGeo = new THREE.BoxGeometry(1.2, 1.4, 0.25);
      const color = this.getYearColor(ev.year);
      const monolithMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.2,
        metalness: 0.9,
        emissive: color,
        emissiveIntensity: 0.25
      });
      const monolith = new THREE.Mesh(monolithGeo, monolithMat);
      monolith.position.y = 1.9;
      monolith.castShadow = true;
      group.add(monolith);

      // Pulsing Beacon on top
      const beaconGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xfff0a8 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 2.8;
      group.add(beacon);

      // Invisible Raycast Hit Target
      const hitGeo = new THREE.BoxGeometry(2.4, 3.5, 2.4);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hit = new THREE.Mesh(hitGeo, hitMat);
      hit.position.y = 1.75;
      hit.userData = { event: ev, group, monolith, beacon };
      group.add(hit);

      scene.add(group);
      this.milestoneMeshes.push({ group, monolith, beacon, hit, event: ev, zPos, xPos });
    });

    // 4. Ambient Time Particles
    const pCount = Math.floor(800 * core.deviceTier.particles);
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 25;
      pPos[i + 1] = Math.random() * 12;
      pPos[i + 2] = -Math.random() * 340;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xc59b27,
      size: 0.14,
      transparent: true,
      opacity: 0.5
    });
    this.particles = new THREE.Points(pGeo, pMat);
    scene.add(this.particles);

    // 5. Lighting
    const ambient = new THREE.AmbientLight(0xdce7ff, 0.7);
    scene.add(ambient);

    this.headlight = new THREE.PointLight(0xfff8db, 1.8, 45);
    this.headlight.position.set(0, 4, this.targetTrackZ);
    scene.add(this.headlight);

    // 6. Interaction Setup
    this.raycaster = new THREE.Raycaster();
    this.bindEvents();
  }

  getYearColor(year) {
    if (year <= 1912) return 0x3b82f6;
    if (year <= 1923) return 0x10b981;
    if (year <= 1926) return 0x06b6d4;
    if (year <= 1929) return 0xf59e0b;
    if (year <= 1935) return 0xef4444;
    if (year <= 1946) return 0x8b5cf6;
    if (year <= 1950) return 0xeab308;
    return 0xec4899;
  }

  bindEvents() {
    const canvas = this.core.canvas;

    // Mouse Wheel Navigation (Smooth scrolling through time)
    this.onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY * 0.04;
      this.targetTrackZ = Math.max(this.minZ, Math.min(this.maxZ, this.targetTrackZ - delta));
      this.syncEraTray();
    };
    canvas.addEventListener('wheel', this.onWheel, { passive: false });

    // Drag / Touch Navigation
    this.onPointerDown = (e) => {
      this.isDragging = true;
      this.prevPointerY = e.clientY;
    };
    this.onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (this.isDragging) {
        const deltaY = e.clientY - this.prevPointerY;
        this.targetTrackZ = Math.max(this.minZ, Math.min(this.maxZ, this.targetTrackZ + deltaY * 0.18));
        this.prevPointerY = e.clientY;
        this.syncEraTray();
      }
    };
    this.onPointerUp = () => {
      this.isDragging = false;
    };

    this.onClick = () => {
      if (!this.raycaster || !this.core.camera) return;
      this.raycaster.setFromCamera(this.mouse, this.core.camera);
      const hits = this.milestoneMeshes.map(m => m.hit);
      const intersects = this.raycaster.intersectObjects(hits);

      if (intersects.length > 0) {
        const ev = intersects[0].object.userData.event;
        this.selectEvent(ev);
      }
    };

    canvas.addEventListener('mousedown', this.onPointerDown);
    window.addEventListener('mousemove', this.onPointerMove);
    window.addEventListener('mouseup', this.onPointerUp);
    canvas.addEventListener('click', this.onClick);

    // Touch events for mobile
    this.onTouchStart = (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevPointerY = e.touches[0].clientY;
      }
    };
    this.onTouchMove = (e) => {
      if (e.touches.length === 1) {
        const rect = canvas.getBoundingClientRect();
        this.mouse.x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;

        if (this.isDragging) {
          const deltaY = e.touches[0].clientY - this.prevPointerY;
          this.targetTrackZ = Math.max(this.minZ, Math.min(this.maxZ, this.targetTrackZ + deltaY * 0.25));
          this.prevPointerY = e.touches[0].clientY;
          this.syncEraTray();
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

    // Keyboard navigation (Up/Down or Left/Right arrows)
    this.onKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        this.targetTrackZ = Math.min(this.maxZ, this.targetTrackZ + 12);
        this.syncEraTray();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        this.targetTrackZ = Math.max(this.minZ, this.targetTrackZ - 12);
        this.syncEraTray();
      }
    };
    window.addEventListener('keydown', this.onKeyDown);
  }

  onSectionSelect(eraId) {
    const era = this.eras.find(e => e.id === eraId);
    if (era) {
      this.targetTrackZ = era.zPos + 8;
    }
  }

  syncEraTray() {
    let currentEra = this.eras[0];
    for (let i = 0; i < this.eras.length; i++) {
      if (this.targetTrackZ <= this.eras[i].zPos + 10) {
        currentEra = this.eras[i];
      }
    }
    const tray = document.getElementById('three-nav-tray');
    if (tray) {
      tray.querySelectorAll('.three-pill-item').forEach(p => {
        p.classList.toggle('active', p.getAttribute('data-id') === currentEra.id);
      });
    }
  }

  selectEvent(ev) {
    // Zoom slightly to milestone
    const m = this.milestoneMeshes.find(item => item.event === ev);
    if (m) {
      this.targetTrackZ = m.zPos + 6;
    }

    const detailData = {
      tag: `${ev.year} • ${ev.location || 'HISTORIC MILESTONE'}`,
      title: ev.title,
      description: ev.detail || ev.desc,
      quote: ev.quote,
      meta: [
        { label: 'Exact Date', value: ev.exactDate || String(ev.year) },
        { label: 'Location', value: ev.location || 'India' },
        ev.bookRef ? { label: 'Verified Source', value: ev.bookRef.volTitle } : null,
        ev.bookRef && ev.bookRef.chapter ? { label: 'Chapter', value: ev.bookRef.chapter } : null
      ].filter(Boolean),
      links: [
        { label: 'Open 2D Timeline Anchor', url: `/timeline.html#year-${ev.year}`, primary: true },
        ev.bookRef ? { label: `Read BAWS Vol. ${ev.bookRef.volNo}`, url: `/reader.html?vol=${ev.bookRef.volNo}&doc=${ev.bookRef.docId || ''}`, primary: false } : null
      ].filter(Boolean)
    };

    this.core.showDetailModal(detailData);
  }

  setMotion(enabled) {
    this.motionEnabled = enabled;
  }

  update(delta, elapsed) {
    const camera = this.core.camera;
    if (!camera) return;

    // Smooth Z interpolation
    const factor = this.motionEnabled ? 0.08 : 0.3;
    this.currentTrackZ += (this.targetTrackZ - this.currentTrackZ) * factor;

    camera.position.z = this.currentTrackZ;
    camera.position.y = 3.5;
    camera.position.x = Math.sin(this.currentTrackZ * 0.05) * 0.4; // subtle serpentine sway
    camera.lookAt(0, 2.2, this.currentTrackZ - 10);

    if (this.headlight) {
      this.headlight.position.z = this.currentTrackZ;
    }

    // Animate milestone beacons and monolith rotation
    if (this.motionEnabled) {
      this.milestoneMeshes.forEach((m, i) => {
        // Only animate milestones near camera to save GPU cycles
        const distToCam = Math.abs(m.zPos - this.currentTrackZ);
        if (distToCam < 50) {
          m.monolith.rotation.y = Math.sin(elapsed * 1.5 + i) * 0.15;
          m.beacon.position.y = 2.8 + Math.sin(elapsed * 3 + i) * 0.08;
        }
      });
    }
  }

  dispose() {
    const canvas = this.core ? this.core.canvas : null;
    if (canvas) {
      canvas.removeEventListener('wheel', this.onWheel);
      canvas.removeEventListener('mousedown', this.onPointerDown);
      canvas.removeEventListener('click', this.onClick);
      canvas.removeEventListener('touchstart', this.onTouchStart);
    }
    window.removeEventListener('mousemove', this.onPointerMove);
    window.removeEventListener('mouseup', this.onPointerUp);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  getBuiltInEvents() {
    return [
      { year: 1891, title: 'Birth in Mhow', location: 'Mhow, Central Provinces', desc: 'Bhimrao Ramji Ambedkar was born into the Mahar community, confronting systemic untouchability.', quote: 'Cultivation of mind should be the ultimate aim of human existence.' },
      { year: 1913, title: 'Columbia University Journey', location: 'New York City', desc: 'Commenced groundbreaking postgraduate studies under John Dewey, examining social democracy.', quote: 'Democracy is not merely a form of government; it is a mode of associated living.' },
      { year: 1927, title: 'Mahad Satyagraha', location: 'Mahad, Maharashtra', desc: 'Led historic peaceful assertion of civic water rights at Chavdar Tale and ignited social equality.', quote: 'Lost rights are never regained by begging, but by relentless struggle.' },
      { year: 1932, title: 'Poona Pact', location: 'Yerwada Central Jail, Pune', desc: 'Negotiated reservation of seats for Depressed Classes in legislatures.', quote: 'I want all people to be Indians first and Indians last.' },
      { year: 1936, title: 'Annihilation of Caste', location: 'Bombay / Lahore', desc: 'Published seminal treatise analyzing the social tyranny and economic injustice of caste.', quote: 'Reason and morality must be the governing principles in human life.' },
      { year: 1947, title: 'Chairman of Drafting Committee', location: 'New Delhi', desc: 'Appointed Chairman of the Constitution Drafting Committee by the Constituent Assembly.', quote: 'Constitution is the vehicle of Life, and its spirit is always the spirit of Age.' },
      { year: 1949, title: 'Constitution of India Adopted', location: 'New Delhi', desc: 'Presented the final draft of the Constitution establishing Sovereign Democratic Republic.', quote: 'Educate, Agitate, Organise; Have faith in yourself.' },
      { year: 1956, title: 'Dhamma Deeksha at Nagpur', location: 'Deekshabhoomi, Nagpur', desc: 'Historic conversion to Buddhism with over 500,000 followers and 22 ethical vows.', quote: 'Religion must mainly be a matter of principles only. It cannot be a matter of rules.' }
    ];
  }
}

window.TimelineExperience = TimelineExperience;
