# 3D Museum Architecture & Scrollytelling Implementation Record

## Executive Summary
This document records the architectural resolution, spatial WebGL implementations, and route mapping for the **Dr. B. R. Ambedkar Digital Heritage Archive**.

In accordance with museum-grade preservation standards, all flash, arcade mechanics, and sneaker-launch style animations were rejected in favor of restrained, dignified archival interaction. All 3D assets and scripts are served 100% locally with zero external CDN dependencies, ensuring strict Content Security Policy (CSP) compliance and offline capability.

---

## 1. Resolution of the "3D Museum" Architecture Question

### The Challenge
Prior to this upgrade, at least 9 separate, fragmented "3D" labels and CTAs existed across the site (`🏛️ 3D Museum`, `🗺️ 3D Journey`, `Explore History in 3D`, `Experience Historic Speeches in 3D`, `3D Constitution`, `Interactive 3D Heritage Studio`, etc.), creating user confusion with mismatched routes.

### Architectural Resolution
Rather than building 9 disconnected 3D experiments, the architecture has converged on a **single, unified Spatial 3D Experience Application** housed under `/experience/*` with deep-linking, complemented by an in-situ Three.js Vitrine on the homepage:

| Original CTA / Label | Location | Architectural Resolution | Route / Destination | Status |
| :--- | :--- | :--- | :--- | :--- |
| **🏛️ 3D Museum** | Navigation & Side Dock | Primary entry into the unified 3D Digital Vitrine Room (Artifact pedestals, bronze patina bust, marble plinths) | `/experience/museum` | **BUILT & LIVE** |
| **🗺️ 3D Journey** | Navigation & Side Dock | Spatial Cartography Room with archival world map and Dr. Ambedkar's global study trajectory (Columbia, LSE, Gray's Inn) | `/experience/journey` | **BUILT & LIVE** |
| **⚖️ 3D Constitution** | Constitution Page & Dock | Illuminated Manuscript Room featuring the 1950 Constitution folio, gold preamble calligraphy, and chapter vitrines | `/experience/constitution` | **BUILT & LIVE** |
| **✨ Explore History in 3D** | Timeline Page Hero | Deep link directly into the 3D Chronological Timeline Camera Rail | `/experience/timeline` | **BUILT & LIVE** |
| **🎬 Historic Speeches in 3D** | Media Page | Archival Radio & Gramophone Soundstage Room | `/experience/speech` | **BUILT & LIVE** |
| **Interactive 3D Heritage Studio** | Homepage (`index.html`) | Replaced pseudo-Nike card grid with genuine **Three.js Constitution Folio Vitrine** on mahogany plinth with scroll scrub & drag orbit | `#interactive-showcase` on `index.html` | **BUILT & LIVE** |
| **Knowledge Graph 3D** | Ideas Page (`ideas.html`) | Upgraded 2D canvas into **Three.js 3D Spatial Knowledge Graph** with orbital controls, 3D nodal clustering, and depth fog | `#graph-3d-view-wrap` on `ideas.html` | **BUILT & LIVE** |
| **16:9 Exhibition Deck** | Slides Page (`slides.html`) | Converted into **Vertical Scrollytelling** with pinned chapters, image parallax, and dual-mode toggle to 16:9 Deck | `slides.html` | **BUILT & LIVE** |

---

## 2. Content Integrity & Bug Fixes (Task 0a)

1. **`vows.html` (The 22 Vows / २२ प्रतिज्ञा):**
   - Pre-rendered all 22 vows in semantic HTML with full bilingual Marathi and English texts.
   - Sourced from official BAWS Vol. 17 and Nagpur Deekshabhoomi archives (October 14, 1956).
   - Embedded complete offline fallback dataset (`VOWS_FALLBACK_DATA`) to guarantee immediate rendering even without a server or network.

2. **`letters.html` (Correspondence / 361 Letters):**
   - Pre-rendered 6 landmark letters directly in `#letters-grid` (Letter to Prof. Seligman, Ramabai Ambedkar, Mahatma Gandhi, Jawaharlal Nehru, Dr. Savita Ambedkar, and Columbia University).
   - Embedded complete offline fallback dataset (`LETTERS_FALLBACK_DATA`) to ensure immediate rendering.

3. **`media.html` (Speeches & Audio-Visual Archive):**
   - Pre-rendered verified transcript of Dr. Ambedkar's historic December 17, 1946 Constituent Assembly address in `#transcript-content`.
   - Verified active track selection and playback synchronization.

4. **`timeline.html` (Chronological Timeline):**
   - Removed all generic placeholder text ("Chapter reference", empty quotes).
   - Expanded `TIMELINE_EVENTS` from 27 to 36 verified milestones from 1891 (Mhow birth) to 1956 (Nagpur Dhamma Deeksha and Mahaparinirvan), complete with verified quotes and official BAWS citations.

---

## 3. Interaction & Visual Design System

1. **Unified SVG Icon System (`frontend/css/icons.css` & `frontend/js/icons.js`):**
   - Eliminated functional emoji across theme switches, navigation drawers, search bars, side docks, and action buttons.
   - Implemented single stroke-weight (1.75px) SVG icons (Lucide / Phosphor design) tinted with `--gold` (`#d4af37`).
   - Retained emoji only in historical quotes and decorative narrative text.

2. **Scrollytelling & Smooth Scroll Engine (`frontend/js/scrollytelling.js`):**
   - Localized Lenis smooth scroll (`frontend/js/vendor/lenis.min.js`) coupled to GSAP ScrollTrigger ticker.
   - Strict `prefers-reduced-motion` compliance: instantly reveals all content without scrub animation, and bypasses smooth-scroll hijacking when active.
   - Parallax scaling and y-shifts for archival portraits and exhibition chapter images.
   - Tabular counter animations on stat elements.

3. **3D Hero Vitrine (`frontend/js/hero3d.js`):**
   - Low-poly 3D Constitution Folio with gold leaf debossing and procedural preamble texture.
   - Supported on a solid mahogany wood plinth with gold inlay ring.
   - Gentle idle rotation with GSAP ScrollTrigger scroll scrub and drag-to-inspect interaction.
   - Immediate static fallback image on low-end devices or WebGL context failures.

4. **3D Knowledge Graph (`frontend/js/knowledgeGraph3D.js`):**
   - Interactive 3D spatial node cluster spanning 8 philosophical domains and 16 treatises.
   - Depth fog, glowing inter-nodal connection lines, OrbitControls, and raycaster mouse hover/click opening primary source deep-dive modals.
   - Seamless tri-mode switch: `[ Cards View | 3D Spatial Graph | 2D Canvas ]`.

---

## 4. Verification & Testing

- Automated Test Suite: `node backend/scripts/verifyArchiveAndThree.js` — **56/56 PASSING (100%)**.
- CSP Audit: **0 CDN requests**, 100% local assets.
- Production Server: Running on Node.js / Express serving `/` and `/experience/*`.
