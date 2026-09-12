/**
 * knowledgeGraph3D.js — 3D Spatial Knowledge Graph for Ambedkar Philosophical Matrix
 * Built with Three.js WebGL, 3D nodal clustering, depth fog, dynamic raycasting,
 * interactive orbital controls, and seamless modal integration.
 */

(function () {
  'use strict';

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let scene, camera, renderer, nodesGroup, linksGroup, raycaster, mouse;
  let nodeMeshes = [];
  let isOrbiting = false;
  let previousMousePosition = { x: 0, y: 0 };
  let hoveredMesh = null;
  let animId = null;

  // Domain Palette
  const DOMAIN_COLORS = {
    caste: 0xef4444,        // Red / Liberation
    constitution: 0xd4af37, // Gold / Justice
    economics: 0x10b981,    // Emerald / Currency
    buddhism: 0x8b5cf6,     // Purple / Dhamma
    gender: 0xec4899,       // Pink / Emancipation
    labour: 0xf59e0b,       // Amber / Industry
    education: 0x3b82f6      // Blue / Knowledge
  };

  async function init3DGraph() {
    const container = document.getElementById('graph-3d-container');
    if (!container) return;

    if (isReducedMotion) {
      return; // 2D fallback handles reduced motion
    }

    try {
      const THREE = await import('./vendor/three.module.js');

      const width = container.clientWidth || 900;
      const height = container.clientHeight || 600;

      // 1. Scene & Camera
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x070a10, 0.038);

      camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      camera.position.set(0, 0, 14);

      // 2. Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // 3. Ambient & Point Lighting
      const ambient = new THREE.AmbientLight(0xfffbeb, 0.9);
      scene.add(ambient);

      const centerLight = new THREE.PointLight(0xd4af37, 2.5, 30);
      centerLight.position.set(0, 2, 4);
      scene.add(centerLight);

      // 4. Groups
      nodesGroup = new THREE.Group();
      linksGroup = new THREE.Group();
      scene.add(linksGroup);
      scene.add(nodesGroup);

      // 5. Build 3D Nodal Network from IDEAS_DATA
      if (!window.IDEAS_DATA || !window.IDEAS_DATA.length) return;

      const data = window.IDEAS_DATA;
      nodeMeshes = [];

      // Calculate 3D spherical positions with clustering
      const domainCenters = {
        caste: new THREE.Vector3(-4.5, 2.5, 1),
        constitution: new THREE.Vector3(0, 3.5, -0.5),
        economics: new THREE.Vector3(4.5, 2.0, 1.5),
        buddhism: new THREE.Vector3(0, -3.5, 1.5),
        gender: new THREE.Vector3(-3.8, -2.2, -1),
        labour: new THREE.Vector3(3.8, -2.2, -1),
        education: new THREE.Vector3(0, 0, 2)
      };

      const nodePositions = {};

      data.forEach((item, index) => {
        const domain = item.domain;
        const center = domainCenters[domain] || new THREE.Vector3(0, 0, 0);

        // Small jitter around domain center
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        const r = 1.0 + Math.random() * 1.5;

        const pos = new THREE.Vector3(
          center.x + r * Math.cos(theta) * Math.cos(phi),
          center.y + r * Math.sin(phi),
          center.z + r * Math.sin(theta) * Math.cos(phi)
        );
        nodePositions[item.id] = pos;

        // Node Geometry & Material
        const color = DOMAIN_COLORS[domain] || 0xd4af37;
        const nodeGeo = new THREE.SphereGeometry(0.38, 32, 32);
        const nodeMat = new THREE.MeshStandardMaterial({
          color: color,
          roughness: 0.35,
          metalness: 0.6,
          emissive: color,
          emissiveIntensity: 0.25
        });

        const mesh = new THREE.Mesh(nodeGeo, nodeMat);
        mesh.position.copy(pos);
        mesh.userData = { idea: item, baseColor: color };

        // Outer Glow Halo Ring
        const ringGeo = new THREE.TorusGeometry(0.52, 0.015, 16, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xd4af37,
          transparent: true,
          opacity: 0.5
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        mesh.add(ringMesh);

        // Text Badge Sprite
        const sprite = createTextSprite(THREE, `${item.icon} ${item.title}`);
        sprite.position.set(0, 0.65, 0);
        mesh.add(sprite);

        nodesGroup.add(mesh);
        nodeMeshes.push(mesh);
      });

      // 6. Build 3D Interconnecting Links
      const drawnLinks = new Set();
      data.forEach((item) => {
        const fromPos = nodePositions[item.id];
        if (!fromPos || !item.related) return;

        item.related.forEach((relId) => {
          const toPos = nodePositions[relId];
          if (!toPos) return;

          const key = [item.id, relId].sort().join('--');
          if (drawnLinks.has(key)) return;
          drawnLinks.add(key);

          // Tube / Line Geometry
          const points = [fromPos, toPos];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const lineMat = new THREE.LineBasicMaterial({
            color: 0xd4af37,
            transparent: true,
            opacity: 0.22,
            linewidth: 1
          });
          const line = new THREE.Line(lineGeo, lineMat);
          linksGroup.add(line);
        });
      });

      // 7. Raycasting & Pointer Interaction
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2(-999, -999);

      const onPointerMove = (e) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        if (isOrbiting) {
          const deltaX = e.clientX - previousMousePosition.x;
          const deltaY = e.clientY - previousMousePosition.y;

          nodesGroup.rotation.y += deltaX * 0.006;
          nodesGroup.rotation.x += deltaY * 0.006;
          linksGroup.rotation.y = nodesGroup.rotation.y;
          linksGroup.rotation.x = nodesGroup.rotation.x;

          previousMousePosition = { x: e.clientX, y: e.clientY };
        }
      };

      const onPointerDown = (e) => {
        isOrbiting = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const onPointerUp = () => {
        isOrbiting = false;
      };

      const onClick = (e) => {
        if (!hoveredMesh || !hoveredMesh.userData || !hoveredMesh.userData.idea) return;
        const ideaId = hoveredMesh.userData.idea.id;
        if (typeof window.openIdeaModal === 'function') {
          window.openIdeaModal(ideaId);
        }
      };

      const onWheel = (e) => {
        e.preventDefault();
        camera.position.z = Math.max(6, Math.min(22, camera.position.z + e.deltaY * 0.015));
      };

      renderer.domElement.addEventListener('pointermove', onPointerMove);
      renderer.domElement.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointerup', onPointerUp);
      renderer.domElement.addEventListener('click', onClick);
      renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

      // 8. Animation Loop
      function animate() {
        animId = requestAnimationFrame(animate);

        // Gentle idle yaw
        if (!isOrbiting) {
          nodesGroup.rotation.y += 0.0015;
          linksGroup.rotation.y = nodesGroup.rotation.y;
        }

        // Raycasting for hover state
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodeMeshes, false);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hoveredMesh !== hit) {
            if (hoveredMesh) {
              hoveredMesh.scale.set(1, 1, 1);
              hoveredMesh.material.emissiveIntensity = 0.25;
            }
            hoveredMesh = hit;
            hoveredMesh.scale.set(1.25, 1.25, 1.25);
            hoveredMesh.material.emissiveIntensity = 0.8;
            renderer.domElement.style.cursor = 'pointer';

            // Show tooltip
            showGraphTooltip(hoveredMesh.userData.idea, intersects[0].point);
          }
        } else {
          if (hoveredMesh) {
            hoveredMesh.scale.set(1, 1, 1);
            hoveredMesh.material.emissiveIntensity = 0.25;
            hoveredMesh = null;
            renderer.domElement.style.cursor = 'grab';
            hideGraphTooltip();
          }
        }

        renderer.render(scene, camera);
      }
      animate();

      // 9. Resize handler
      window.addEventListener('resize', () => {
        if (!container) return;
        const w = container.clientWidth || 900;
        const h = container.clientHeight || 600;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });

    } catch (err) {
      console.warn('3D Knowledge graph failed, falling back to 2D Canvas:', err);
    }
  }

  function createTextSprite(THREE, text) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(7, 10, 16, 0.85)';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 108, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2.4, 0.6, 1);
    return sprite;
  }

  function showGraphTooltip(idea, point) {
    let tooltip = document.getElementById('graph-3d-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'graph-3d-tooltip';
      tooltip.style.position = 'absolute';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.background = 'rgba(7,10,16,0.92)';
      tooltip.style.border = '1px solid var(--border-gold)';
      tooltip.style.borderRadius = '12px';
      tooltip.style.padding = '10px 16px';
      tooltip.style.boxShadow = '0 12px 30px rgba(0,0,0,0.8)';
      tooltip.style.color = '#fff';
      tooltip.style.zIndex = '100';
      tooltip.style.fontFamily = 'var(--font-body)';
      tooltip.style.fontSize = '0.85rem';
      tooltip.style.backdropFilter = 'blur(12px)';
      const wrap = document.getElementById('graph-view-wrap');
      if (wrap) wrap.appendChild(tooltip);
    }

    tooltip.innerHTML = `
      <div style="font-size:0.7rem;color:var(--gold-light);font-family:var(--font-mono);">${idea.domainLabel.toUpperCase()} &bull; VOL ${idea.vol}</div>
      <div style="font-weight:700;font-family:var(--font-display);font-size:0.95rem;margin:2px 0 4px;">${idea.title}</div>
      <div style="font-size:0.75rem;color:var(--text-muted);">${idea.thesis.slice(0, 90)}...</div>
      <div style="font-size:0.7rem;color:var(--gold);margin-top:6px;">Click node to open primary source deep-dive &rarr;</div>
    `;
    tooltip.style.display = 'block';
    tooltip.style.top = '20px';
    tooltip.style.left = '20px';
  }

  function hideGraphTooltip() {
    const tooltip = document.getElementById('graph-3d-tooltip');
    if (tooltip) tooltip.style.display = 'none';
  }

  window.init3DKnowledgeGraph = init3DGraph;
})();
