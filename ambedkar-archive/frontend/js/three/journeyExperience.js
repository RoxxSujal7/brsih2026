/**
 * Ambedkar Digital Archive — Feature 10: Interactive Ambedkar Journey Map
 * A stylized 3D globe and celestial geography connecting 8 verified historical locations
 * across Dr. B. R. Ambedkar's global intellectual and social journey:
 * Mhow, Bombay, New York (Columbia), London (LSE), Mahad, Pune, New Delhi, Nagpur.
 */

class JourneyExperience {
  constructor() {
    this.badge = 'Global Cartography';
    this.title = 'Dr. B. R. Ambedkar: Global Journey of Liberation';
    this.hint = 'Rotate the globe or select a location pin to explore historical journeys and archival records';

    this.core = null;
    this.THREE = null;
    this.motionEnabled = true;

    this.globe = null;
    this.locationPins = [];
    this.travelArcs = [];
    this.particles = null;

    this.mouse = { x: 0, y: 0 };
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.cameraDistance = 14;
    this.targetCameraDistance = 14;
    this.targetRotation = { x: 0.3, y: -1.2 };
    this.currentRotation = { x: 0.3, y: -1.2 };

    // 8 Verified Historical Locations with accurate Geographic Coordinates (lat, lon)
    this.locations = [
      {
        id: 'mhow',
        title: 'Mhow (Dr. Ambedkar Nagar)',
        country: 'Central Provinces (Madhya Pradesh)',
        lat: 22.5539,
        lon: 75.7547,
        year: '1891',
        tag: 'BIRTHPLACE & EARLY MEMORIES',
        color: 0x3b82f6,
        description: 'Born on April 14, 1891, into an untouchable Mahar military family in the British cantonment of Mhow. His father Ramji Sakpal was a Subedar and educator.',
        quote: 'Cultivation of mind should be the ultimate aim of human existence.',
        meta: [
          { label: 'Significance', value: 'Birthplace of Babasaheb Ambedkar' },
          { label: 'Memorial', value: 'Bhim Janmabhoomi Memorial' }
        ],
        links: [
          { label: 'View 1891 Timeline', url: '/timeline.html#year-1891', primary: true },
          { label: 'Read "Waiting for a Visa"', url: '/reader.html?vol=17', primary: false }
        ]
      },
      {
        id: 'bombay',
        title: 'Bombay (Mumbai)',
        country: 'Maharashtra, India',
        lat: 18.9220,
        lon: 72.8347,
        year: '1907–1956',
        tag: 'INTELLECTUAL & ORGANIZATIONAL EPICENTER',
        color: 0x10b981,
        description: 'Elphinstone High School & College; established Bahishkrit Hitakarini Sabha (1924), legal practice at Bombay High Court, founding of Siddhartha College, and his personal library at Rajgriha containing over 50,000 books.',
        quote: 'Educate, Agitate, Organise; Have faith in yourself.',
        meta: [
          { label: 'Key Landmarks', value: 'Rajgriha (Dadar), Siddharth College, Chaityabhoomi' },
          { label: 'Publications', value: 'Mooknayak (1920), Bahishkrit Bharat (1927), Janata (1930)' }
        ],
        links: [
          { label: 'Explore Letters from Bombay', url: '/letters.html', primary: true },
          { label: 'Read Complete Works', url: '/archive.html', primary: false }
        ]
      },
      {
        id: 'newyork',
        title: 'Columbia University (New York City)',
        country: 'United States',
        lat: 40.8075,
        lon: -73.9626,
        year: '1913–1916',
        tag: 'PRAGMATISM & GLOBAL EDUCATION',
        color: 0x06b6d4,
        description: 'Awarded Baroda scholarship to pursue advanced postgraduate studies. Studied under philosopher John Dewey, Edwin Seligman, and Alexander Goldenweiser. Earned M.A. and Ph.D. with his landmark paper "Castes in India: Their Mechanism, Genesis and Development".',
        quote: 'Democracy is not merely a form of government; it is primarily a mode of associated living, of conjoint communicated experience.',
        meta: [
          { label: 'Degrees', value: 'M.A. in Economics (1915), Ph.D. (1927)' },
          { label: 'Hall of Residence', value: 'Hartley Hall, Columbia University' }
        ],
        links: [
          { label: 'Read "Castes in India"', url: '/reader.html?vol=1', primary: true },
          { label: 'Letters to Baroda State', url: '/letters.html', primary: false }
        ]
      },
      {
        id: 'london',
        title: 'London School of Economics & Gray’s Inn',
        country: 'United Kingdom',
        lat: 51.5144,
        lon: -0.1165,
        year: '1916–1923, 1930–1932',
        tag: 'LEGAL BARRISTER & DOCTOR OF SCIENCE',
        color: 0x8b5cf6,
        description: 'Completed M.Sc. and D.Sc. in Economics at LSE with his monumental thesis "The Problem of the Rupee". Called to the Bar at Gray’s Inn. Later represented Depressed Classes at the Round Table Conferences (1930–1932).',
        quote: 'My work on the problem of the rupee showed how currency manipulation robbed the Indian labouring classes.',
        meta: [
          { label: 'Institutions', value: 'London School of Economics, Gray’s Inn, British Museum Reading Room' },
          { label: 'Historic Event', value: 'Round Table Conferences (1930–32)' }
        ],
        links: [
          { label: 'Read "Problem of the Rupee"', url: '/reader.html?vol=6', primary: true },
          { label: 'Round Table Speeches', url: '/media.html', primary: false }
        ]
      },
      {
        id: 'mahad',
        title: 'Mahad (Chavdar Tale)',
        country: 'Raigad, Maharashtra',
        lat: 18.2357,
        lon: 73.4194,
        year: '1927',
        tag: 'WATER SATYAGRAHA & HUMAN DIGNITY',
        color: 0xf59e0b,
        description: 'Led the historic peaceful assertion of untouchables’ right to drink water from the public Chavdar Tale tank on March 20, 1927. On December 25, 1927, led the historic burning of the Manusmriti as a rejection of scriptural caste inequality.',
        quote: 'Lost rights are never regained by begging, and by appeals to the conscience of the usurpers, but by relentless struggle.',
        meta: [
          { label: 'Date', value: 'March 20, 1927 (Celebrated as Social Empowerment Day)' },
          { label: 'Significance', value: 'The declaration of independence for India’s depressed classes' }
        ],
        links: [
          { label: 'Explore Mahad Records', url: '/timeline.html#year-1927', primary: true }
        ]
      },
      {
        id: 'pune',
        title: 'Yerwada Jail & Pune',
        country: 'Maharashtra, India',
        lat: 18.5529,
        lon: 73.8824,
        year: '1932',
        tag: 'THE POONA PACT (SEPT 24, 1932)',
        color: 0xef4444,
        description: 'Following the British Communal Award granting separate electorates to Depressed Classes and Mahatma Gandhi’s fast-unto-death in Yerwada Jail, Dr. Ambedkar negotiated the Poona Pact, securing 148 reserved seats in provincial legislatures.',
        quote: 'I want all people to be Indians first, and Indians last.',
        meta: [
          { label: 'Pact Date', value: '24 September 1932' },
          { label: 'Outcome', value: '148 reserved seats (more than double the British award)' }
        ],
        links: [
          { label: 'Poona Pact Documents', url: '/timeline.html#year-1932', primary: true }
        ]
      },
      {
        id: 'delhi',
        title: 'New Delhi (Parliament & Law Ministry)',
        country: 'National Capital Territory, India',
        lat: 28.6139,
        lon: 77.2090,
        year: '1942–1956',
        tag: 'CONSTITUTION MAKING & LABOUR REFORM',
        color: 0xeab308,
        description: 'Labour Member of Viceroy’s Executive Council (1942–46) establishing the 8-hour workday, Employees State Insurance, and Central Water Commission. Chairman of the Constitution Drafting Committee (1947–50) and India’s first Law Minister championing the Hindu Code Bill.',
        quote: 'Constitution is not a mere lawyer’s document, it is the vehicle of Life, and its spirit is always the spirit of Age.',
        meta: [
          { label: 'Offices Held', value: 'Labour Member (1942–46), Drafting Committee Chair (1947–50), First Law Minister (1947–51)' },
          { label: 'Resignation', value: 'Resigned in 1951 over delay of Hindu Code Bill empowering women' }
        ],
        links: [
          { label: 'Constitution Archive', url: '/constitution.html', primary: true },
          { label: 'Speech on Hindu Code Bill', url: '/media.html', primary: false }
        ]
      },
      {
        id: 'nagpur',
        title: 'Nagpur (Deekshabhoomi)',
        country: 'Maharashtra, India',
        lat: 21.1278,
        lon: 79.0669,
        year: '1956',
        tag: 'DHAMMA DEEKSHA & 22 VOWS',
        color: 0xec4899,
        description: 'On October 14, 1956 (Ashoka Vijaya Dashami), Dr. Ambedkar embraced Buddhism along with his wife Savita Ambedkar and over 500,000 followers, administering the revolutionary 22 Vows to emancipate his people from religious bondage.',
        quote: 'Religion must mainly be a matter of principles only. It cannot be a matter of rules.',
        meta: [
          { label: 'Historic Date', value: '14 October 1956' },
          { label: 'Monument', value: 'Deekshabhoomi Stupa, Nagpur' }
        ],
        links: [
          { label: 'Read The 22 Vows', url: '/vows.html', primary: true },
          { label: 'Listen to Nagpur Address', url: '/media.html#yt-dhamma-1', primary: false }
        ]
      }
    ];

    // Travel routes connecting key transit points chronologically
    this.routes = [
      { from: 'mhow', to: 'bombay' },
      { from: 'bombay', to: 'newyork' },
      { from: 'newyork', to: 'london' },
      { from: 'london', to: 'bombay' },
      { from: 'bombay', to: 'mahad' },
      { from: 'bombay', to: 'pune' },
      { from: 'bombay', to: 'delhi' },
      { from: 'delhi', to: 'nagpur' }
    ];
  }

  getSections() {
    return this.locations.map(loc => ({
      id: loc.id,
      label: `📍 ${loc.title.split('(')[0].trim()}`
    }));
  }

  getFallbackData() {
    return this.locations.map(l => ({
      tag: `${l.year} • ${l.country}`,
      title: l.title,
      description: l.description,
      quote: l.quote,
      links: l.links
    }));
  }

  async init(core, THREE) {
    this.core = core;
    this.THREE = THREE;
    const scene = core.scene;

    core.camera.position.set(0, 0, this.cameraDistance);
    core.camera.lookAt(0, 0, 0);

    // 1. Stylized 3D Celestial Globe Sphere
    const globeRadius = 5.2;
    this.globeRadius = globeRadius;

    const globeGeo = new THREE.SphereGeometry(globeRadius, 48, 48);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x0a1428,
      roughness: 0.45,
      metalness: 0.5,
      emissive: 0x050b18,
      emissiveIntensity: 0.4
    });
    this.globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(this.globe);

    // Atmospheric Glow Halo
    const atmosGeo = new THREE.SphereGeometry(globeRadius * 1.05, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const atmos = new THREE.Mesh(atmosGeo, atmosMat);
    this.globe.add(atmos);

    // Equator and Latitude Grid Rings
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x1e3a8a,
      transparent: true,
      opacity: 0.4,
      wireframe: true
    });
    const gridSphereGeo = new THREE.SphereGeometry(globeRadius * 1.002, 16, 12);
    const gridMesh = new THREE.Mesh(gridSphereGeo, ringMat);
    this.globe.add(gridMesh);

    // 2. Add Location Pins
    this.locations.forEach(loc => {
      const pos = this.latLonToVector3(loc.lat, loc.lon, globeRadius);

      const pinGroup = new THREE.Group();
      pinGroup.position.copy(pos);

      // Orient pin outward from sphere center
      pinGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());

      // Beacon Needle
      const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 12);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 0.3;
      pinGroup.add(stem);

      // Floating Luminous Sphere Cap
      const capGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const capMat = new THREE.MeshStandardMaterial({
        color: loc.color,
        emissive: loc.color,
        emissiveIntensity: 0.7,
        roughness: 0.2,
        metalness: 0.8
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 0.65;
      pinGroup.add(cap);

      // Pulse ring at surface
      const ringGeo = new THREE.RingGeometry(0.15, 0.22, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: loc.color, side: THREE.DoubleSide });
      const pulseRing = new THREE.Mesh(ringGeo, ringMat);
      pulseRing.rotation.x = -Math.PI / 2;
      pulseRing.position.y = 0.01;
      pinGroup.add(pulseRing);

      // Raycast Hit Volume
      const hitGeo = new THREE.SphereGeometry(0.65, 12, 12);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hit = new THREE.Mesh(hitGeo, hitMat);
      hit.position.y = 0.35;
      hit.userData = { location: loc, pinGroup, cap };
      pinGroup.add(hit);

      this.globe.add(pinGroup);
      this.locationPins.push({ pinGroup, cap, pulseRing, hit, location: loc, pos });
    });

    // 3. Build Animated Great-Circle Travel Arcs
    this.routes.forEach(route => {
      const locA = this.locations.find(l => l.id === route.from);
      const locB = this.locations.find(l => l.id === route.to);
      if (!locA || !locB) return;

      const vA = this.latLonToVector3(locA.lat, locA.lon, globeRadius);
      const vB = this.latLonToVector3(locB.lat, locB.lon, globeRadius);

      // Compute curved bezier/spline arc through mid point raised above globe
      const mid = vA.clone().add(vB).multiplyScalar(0.5);
      const dist = vA.distanceTo(vB);
      mid.setLength(globeRadius + Math.min(2.5, dist * 0.35));

      const curve = new THREE.QuadraticBezierCurve3(vA, mid, vB);
      const points = curve.getPoints(36);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0xe9c46a,
        transparent: true,
        opacity: 0.6,
        linewidth: 2
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      this.globe.add(arcLine);
      this.travelArcs.push(arcLine);
    });

    // 4. Background Starfield
    const pCount = Math.floor(600 * core.deviceTier.particles);
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 80;
      pPos[i + 1] = (Math.random() - 0.5) * 80;
      pPos[i + 2] = (Math.random() - 0.5) * 80;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.12,
      transparent: true,
      opacity: 0.6
    });
    this.particles = new THREE.Points(pGeo, pMat);
    scene.add(this.particles);

    // 5. Lighting
    const ambient = new THREE.AmbientLight(0xbfdbfe, 0.7);
    scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.8);
    sunLight.position.set(15, 12, 18);
    scene.add(sunLight);

    const blueBackLight = new THREE.PointLight(0x0284c7, 1.4, 30);
    blueBackLight.position.set(-15, -8, -10);
    scene.add(blueBackLight);

    // 6. Raycast & Interaction
    this.raycaster = new THREE.Raycaster();
    this.bindEvents();

    // Select initial landmark (Mhow)
    this.selectLocation(this.locations[0]);
  }

  latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
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
        this.targetRotation.y += deltaX * 0.006;
        this.targetRotation.x = Math.max(-1.2, Math.min(1.2, this.targetRotation.x + deltaY * 0.006));
        this.prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    this.onPointerUp = () => {
      this.isDragging = false;
    };

    this.onClick = () => {
      if (!this.raycaster || !this.core.camera || !this.globe) return;
      this.raycaster.setFromCamera(this.mouse, this.core.camera);

      const hits = this.locationPins.map(p => p.hit);
      const intersects = this.raycaster.intersectObjects(hits);

      if (intersects.length > 0) {
        const loc = intersects[0].object.userData.location;
        this.selectLocation(loc);
      }
    };

    canvas.addEventListener('mousedown', this.onPointerDown);
    window.addEventListener('mousemove', this.onPointerMove);
    window.addEventListener('mouseup', this.onPointerUp);
    canvas.addEventListener('click', this.onClick);

    // Zoom on wheel
    this.onWheel = (e) => {
      e.preventDefault();
      this.targetCameraDistance = Math.max(8.5, Math.min(22, this.targetCameraDistance + e.deltaY * 0.015));
    };
    canvas.addEventListener('wheel', this.onWheel, { passive: false });

    // Touch Support
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
        this.targetRotation.y += deltaX * 0.007;
        this.targetRotation.x = Math.max(-1.2, Math.min(1.2, this.targetRotation.x + deltaY * 0.007));
        this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
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
    const loc = this.locations.find(l => l.id === id);
    if (loc) this.selectLocation(loc);
  }

  selectLocation(loc) {
    // Smoothly rotate globe so selected location faces camera (+Z)
    const phi = (90 - loc.lat) * (Math.PI / 180);
    const theta = (loc.lon + 180) * (Math.PI / 180);

    this.targetRotation.x = (phi - Math.PI / 2);
    this.targetRotation.y = -(theta - Math.PI / 2);

    // Sync bottom tray active pill
    const tray = document.getElementById('three-nav-tray');
    if (tray) {
      tray.querySelectorAll('.three-pill-item').forEach(p => {
        p.classList.toggle('active', p.getAttribute('data-id') === loc.id);
      });
    }

    this.core.showDetailModal(loc);
  }

  setMotion(enabled) {
    this.motionEnabled = enabled;
  }

  update(delta, elapsed) {
    const camera = this.core.camera;
    if (!camera || !this.globe) return;

    // Slow auto idle rotation if not dragging and not viewing modal
    if (!this.isDragging && this.motionEnabled && !document.getElementById('three-detail-modal').classList.contains('visible')) {
      this.targetRotation.y += delta * 0.05;
    }

    // Smooth spherical rotation interpolation
    const factor = this.motionEnabled ? 0.06 : 0.25;
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * factor;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * factor;

    this.globe.rotation.x = this.currentRotation.x;
    this.globe.rotation.y = this.currentRotation.y;

    // Camera zoom interpolation
    this.cameraDistance += (this.targetCameraDistance - this.cameraDistance) * factor;
    camera.position.z = this.cameraDistance;

    // Pulse location pins
    if (this.motionEnabled) {
      this.locationPins.forEach((p, idx) => {
        const s = 1 + Math.sin(elapsed * 3 + idx) * 0.15;
        p.cap.scale.set(s, s, s);
      });

      if (this.particles) {
        this.particles.rotation.y = elapsed * 0.01;
      }
    }
  }

  dispose() {
    const canvas = this.core ? this.core.canvas : null;
    if (canvas) {
      canvas.removeEventListener('mousedown', this.onPointerDown);
      canvas.removeEventListener('click', this.onClick);
      canvas.removeEventListener('wheel', this.onWheel);
      canvas.removeEventListener('touchstart', this.onTouchStart);
    }
    window.removeEventListener('mousemove', this.onPointerMove);
    window.removeEventListener('mouseup', this.onPointerUp);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
  }
}

window.JourneyExperience = JourneyExperience;
