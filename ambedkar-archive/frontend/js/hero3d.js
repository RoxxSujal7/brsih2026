/**
 * hero3d.js — Restrained Museum-Grade Three.js Archival Folio & Scroll-Scrub Engine
 * Features a high-fidelity 3D Constitution Folio with gold debossing on mahogany plinth.
 * Calm, dignified idle orbit; synchronized camera dolly & object rotation via GSAP ScrollTrigger.
 * Respects prefers-reduced-motion and provides instant static fallback if WebGL fails.
 */

(function () {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  async function initHero3D() {
    const container = document.getElementById('hero-3d-canvas-container');
    if (!container) return;

    // Check if user prefers reduced motion
    if (isReducedMotion) {
      showStaticFallback(container);
      return;
    }

    try {
      // Import local Three.js module (zero CDN / strict CSP)
      const THREE = await import('./vendor/three.module.js');

      const width = container.clientWidth || 600;
      const height = container.clientHeight || 480;

      // 1. Scene & Camera
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x07090e, 0.035);

      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 1.8, 4.6);
      camera.lookAt(0, 0.1, 0);

      // 2. WebGL Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // 3. Dignified Lighting (Warm Archival Vitrine)
      const ambientLight = new THREE.AmbientLight(0xfef3c7, 0.7);
      scene.add(ambientLight);

      const keySpot = new THREE.SpotLight(0xfffbeb, 4.5, 20, Math.PI / 5, 0.45, 1.2);
      keySpot.position.set(2.5, 5, 3.5);
      keySpot.castShadow = true;
      keySpot.shadow.mapSize.width = 1024;
      keySpot.shadow.mapSize.height = 1024;
      keySpot.shadow.bias = -0.0001;
      scene.add(keySpot);

      const rimLight = new THREE.DirectionalLight(0xd4af37, 1.4);
      rimLight.position.set(-3, 2, -2);
      scene.add(rimLight);

      // 4. Archival Mahogany Plinth
      const plinthGroup = new THREE.Group();

      const plinthGeo = new THREE.CylinderGeometry(1.9, 2.05, 0.28, 48);
      const plinthMat = new THREE.MeshStandardMaterial({
        color: 0x1a120b,
        roughness: 0.55,
        metalness: 0.15
      });
      const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
      plinthMesh.position.y = -0.75;
      plinthMesh.receiveShadow = true;
      plinthGroup.add(plinthMesh);

      // Plinth Gold Inlay Ring
      const ringGeo = new THREE.TorusGeometry(1.92, 0.018, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.25,
        metalness: 0.85
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = -0.62;
      plinthGroup.add(ringMesh);

      scene.add(plinthGroup);

      // 5. 3D Constitution Folio
      const bookGroup = new THREE.Group();
      bookGroup.position.set(0, -0.25, 0);

      // Generate Gold Foil Preamble Texture via Canvas
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1360;
      const ctx = canvas.getContext('2d');

      // Leather background
      ctx.fillStyle = '#1e140d';
      ctx.fillRect(0, 0, 1024, 1360);

      // Intricate Double Gold Filigree Border
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 14;
      ctx.strokeRect(40, 40, 944, 1280);

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
      ctx.lineWidth = 4;
      ctx.strokeRect(65, 65, 894, 1230);

      // Gold Ashoka Lion Emblem silhouette at top
      ctx.fillStyle = '#f5c842';
      ctx.font = 'bold 36px "Cinzel", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('सत्यमेव जयते', 512, 160);

      // Emblem emblem ring
      ctx.beginPath();
      ctx.arc(512, 230, 46, 0, Math.PI * 2);
      ctx.lineWidth = 4;
      ctx.stroke();

      // Title
      ctx.font = '800 58px "Cinzel", "Times New Roman", serif';
      ctx.fillStyle = '#f5c842';
      ctx.fillText('CONSTITUTION', 512, 360);
      ctx.font = '600 44px "Cinzel", "Times New Roman", serif';
      ctx.fillText('OF INDIA', 512, 430);

      // Preamble Opening Text
      ctx.font = 'bold 32px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#d4af37';
      ctx.fillText('WE, THE PEOPLE OF INDIA,', 512, 540);

      ctx.font = 'italic 24px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#e2d9c8';
      ctx.fillText('having solemnly resolved to constitute India into a', 512, 600);
      ctx.font = 'bold 28px "Cinzel", serif';
      ctx.fillStyle = '#f5c842';
      ctx.fillText('SOVEREIGN DEMOCRATIC REPUBLIC', 512, 650);

      ctx.font = 'italic 22px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#e2d9c8';
      ctx.fillText('and to secure to all its citizens:', 512, 710);

      ctx.font = 'bold 26px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#d4af37';
      ctx.fillText('JUSTICE, social, economic and political;', 512, 770);
      ctx.fillText('LIBERTY of thought, expression, belief, faith;', 512, 825);
      ctx.fillText('EQUALITY of status and of opportunity;', 512, 880);
      ctx.fillText('FRATERNITY assuring the dignity of the individual.', 512, 935);

      ctx.font = 'italic 22px Georgia, serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Drafting Committee Chairman: Dr. B. R. Ambedkar', 512, 1140);
      ctx.fillText('Adopted on 26 November 1949', 512, 1185);

      const coverTexture = new THREE.CanvasTexture(canvas);
      coverTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

      // Book Dimensions: 1.7 x 0.32 x 2.25
      const bookMatFront = new THREE.MeshStandardMaterial({
        map: coverTexture,
        roughness: 0.42,
        metalness: 0.25
      });
      const bookMatLeather = new THREE.MeshStandardMaterial({
        color: 0x1a110a,
        roughness: 0.6,
        metalness: 0.12
      });
      const bookMatPages = new THREE.MeshStandardMaterial({
        color: 0xdfd3b6,
        roughness: 0.8,
        metalness: 0.05
      });

      // Box geometry faces: +X, -X, +Y (cover), -Y (back), +Z, -Z
      const bookMaterials = [
        bookMatPages,   // Right (pages)
        bookMatLeather, // Left (spine)
        bookMatFront,   // Top (front cover with Preamble)
        bookMatLeather, // Bottom (back cover)
        bookMatPages,   // Front edge
        bookMatPages    // Back edge
      ];

      const bookGeo = new THREE.BoxGeometry(1.65, 0.28, 2.25);
      const bookMesh = new THREE.Mesh(bookGeo, bookMaterials);
      bookMesh.castShadow = true;
      bookMesh.receiveShadow = true;
      bookGroup.add(bookMesh);

      // Gold Ribbon Bookmark
      const ribbonGeo = new THREE.BoxGeometry(0.12, 0.02, 0.7);
      const ribbonMat = new THREE.MeshStandardMaterial({
        color: 0xb91c1c,
        roughness: 0.35,
        metalness: 0.2
      });
      const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbonMesh.position.set(0.4, 0.15, 1.25);
      ribbonMesh.rotation.x = 0.2;
      bookGroup.add(ribbonMesh);

      scene.add(bookGroup);

      // 6. Interactive Drag & Pointer Parallax
      let isDragging = false;
      let prevPointerX = 0;
      let prevPointerY = 0;
      let targetRotationY = 0.35;
      let targetRotationX = 0.25;

      const dom = renderer.domElement;
      dom.style.cursor = 'grab';

      dom.addEventListener('pointerdown', (e) => {
        isDragging = true;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
        dom.style.cursor = 'grabbing';
      });

      window.addEventListener('pointerup', () => {
        isDragging = false;
        dom.style.cursor = 'grab';
      });

      window.addEventListener('pointermove', (e) => {
        if (isDragging) {
          const deltaX = e.clientX - prevPointerX;
          const deltaY = e.clientY - prevPointerY;
          prevPointerX = e.clientX;
          prevPointerY = e.clientY;

          targetRotationY += deltaX * 0.008;
          targetRotationX = Math.max(-0.2, Math.min(0.7, targetRotationX + deltaY * 0.006));
        }
      });

      // 7. Scroll-Scrub Integration via GSAP ScrollTrigger
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: container,
          start: 'top 80%',
          end: 'bottom top',
          scrub: 1.2,
          onUpdate: (self) => {
            const progress = self.progress;
            // Dignified scroll scrub: gently tilts the book up to reveal calligraphed title
            bookGroup.rotation.y = 0.35 + progress * Math.PI * 0.6;
            camera.position.y = 1.8 - progress * 0.4;
            camera.position.z = 4.6 - progress * 0.8;
            camera.lookAt(0, 0.1, 0);
          }
        });
      }

      // 8. Animation Loop
      let reqId;
      function animate() {
        reqId = requestAnimationFrame(animate);

        // Gentle idle orbit when not being dragged
        if (!isDragging) {
          targetRotationY += 0.0025;
        }

        bookGroup.rotation.y += (targetRotationY - bookGroup.rotation.y) * 0.05;
        bookGroup.rotation.x += (targetRotationX - bookGroup.rotation.x) * 0.05;

        // Plinth follows gently
        plinthGroup.rotation.y = bookGroup.rotation.y * 0.35;

        renderer.render(scene, camera);
      }
      animate();

      // 9. Responsive Resize Handler
      function onResize() {
        if (!container) return;
        const newW = container.clientWidth || 600;
        const newH = container.clientHeight || 480;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
      window.addEventListener('resize', onResize);

    } catch (err) {
      console.warn('Three.js hero initialization error, displaying static archival fallback:', err);
      showStaticFallback(container);
    }
  }

  function showStaticFallback(container) {
    container.innerHTML = `
      <div class="hero-3d-fallback" style="width:100%;height:100%;min-height:380px;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 50%, rgba(212,175,55,0.08) 0%, rgba(7,9,14,0.95) 75%);border:1px solid var(--border-gold);border-radius:var(--radius-2xl);overflow:hidden;position:relative;">
        <img src="assets/images/constitution_cover.jpg" alt="Constitution of India Original Archival Folio" style="max-width:85%;max-height:85%;object-fit:contain;border-radius:12px;box-shadow:0 24px 60px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.2);" onerror="this.src='assets/images/ambedkar_portrait.jpg'" />
        <div style="position:absolute;bottom:20px;left:24px;right:24px;text-align:center;background:rgba(7,9,14,0.85);backdrop-filter:blur(8px);padding:10px 16px;border-radius:var(--radius-full);border:1px solid var(--border-gold);">
          <span style="font-size:0.85rem;color:var(--gold-light);font-family:var(--font-mono);font-weight:600;">📜 Original Constitution of India (1950) &bull; Archival Folio</span>
        </div>
      </div>
    `;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero3D);
  } else {
    initHero3D();
  }
})();
