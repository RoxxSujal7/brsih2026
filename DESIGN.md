---
version: 1.0.0
name: Ambedkar-Heritage-Archive-Design-System
description: A museum-grade archival design specification fusing Apple's restrained gallery exhibition ethos with Claude's humanist editorial reading sanctuary and Louvre-tier 3D spatial curation. Built for Dr. B. R. Ambedkar's national heritage repository (60 volumes, 361 letters, speeches, scrollytelling deck, and WebGL vitrines). Strict prohibition against gratuitous commercial neon, sneaker-launch kinetics, or ungrounded spectacle. Every animation, surface, and token serves historical reverence and primary-source legibility.

colors:
  # Primary Brand & Accent
  primary: "#d4af37"              # Archival Antique Gold / Ashoka Seal Embellishment
  primary-light: "#f3e5ab"        # Illuminated Gold Leaf Highlight
  primary-dim: "#997824"          # Deep Burnished Bronze Patina
  primary-glow: "rgba(212, 175, 55, 0.22)"

  # Multi-Atmosphere Canvases & Surfaces
  # 1. Dark Slate (OLED Memorial Sanctum - Default)
  canvas-dark: "#05070a"          # Pitch Archival Black
  surface-dark-1: "#070a10"       # Vitrine Base Stage
  surface-dark-2: "#0c101a"       # Secondary Pedestal
  surface-dark-card: "rgba(14, 20, 32, 0.85)"
  surface-dark-border: "rgba(255, 255, 255, 0.08)"
  surface-dark-border-gold: "rgba(212, 175, 55, 0.35)"

  # 2. Ivory Paper (Reading Room Sanctuary)
  canvas-paper: "#e8e3d5"         # Aged Natural Linen
  surface-paper-1: "#f7f5ef"      # Hand-Pressed Rag Paper
  surface-paper-2: "#eeeae0"      # Vellum Folio Leaf
  surface-paper-card: "rgba(247, 243, 235, 0.95)"
  surface-paper-border: "rgba(43, 39, 35, 0.14)"
  surface-paper-border-gold: "rgba(179, 139, 34, 0.40)"

  # 3. Historical Sepia (Archival Manuscript Vault)
  canvas-sepia: "#dfd2b7"         # 1930s Warm Foxed Parchment
  surface-sepia-1: "#f2ebd9"      # Columbia/LSE Archival Sheet
  surface-sepia-2: "#e7ddc7"      # Typeset Ledger
  surface-sepia-card: "rgba(239, 230, 212, 0.95)"
  surface-sepia-border: "rgba(59, 44, 30, 0.16)"
  surface-sepia-border-gold: "rgba(157, 111, 26, 0.40)"

  # Text & Ink
  ink-primary-dark: "#f8fafc"     # High-contrast crisp ivory white
  ink-secondary-dark: "#94a3b8"   # Slate curatorial annotations
  ink-muted-dark: "#64748b"       # Metadata & citations
  ink-faint-dark: "#334155"

  ink-primary-light: "#1a1714"    # Deep black-brown letterpress
  ink-secondary-light: "#5e564b"  # Warm charcoal commentary
  ink-muted-light: "#887d6e"      # Muted archive index ink

  # Domain Palette (BAWS 8 Philosophical Matrix)
  domain-caste: "#ef4444"         # Annihilation of Caste / Emancipation
  domain-constitution: "#d4af37"  # Constitutional Morality / Law
  domain-economics: "#10b981"     # Problem of the Rupee / Finance
  domain-buddhism: "#8b5cf6"      # The Buddha and His Dhamma / Ethics
  domain-gender: "#ec4899"        # Hindu Code Bill / Women's Rights
  domain-labour: "#f59e0b"        # Labour Welfare / 8-Hour Workday
  domain-education: "#3b82f6"     # Bahishkrit Hitakarini / Mooknayak

typography:
  fontFamilies:
    display: "'Cinzel', Georgia, 'Times New Roman', serif"
    serif: "'Playfair Display', Georgia, serif"
    sans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    devanagari: "'Noto Serif Devanagari', 'Noto Sans Devanagari', serif"
    mono: "'JetBrains Mono', 'SF Mono', monospace"

  scales:
    hero-monumental:
      fontFamily: "var(--font-display)"
      fontSize: "clamp(2.5rem, 5.5vw, 4.2rem)"
      fontWeight: 800
      lineHeight: 1.08
      letterSpacing: "-0.02em"

    display-title:
      fontFamily: "var(--font-display)"
      fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)"
      fontWeight: 700
      lineHeight: 1.18
      letterSpacing: "-0.015em"

    chapter-headline:
      fontFamily: "var(--font-display)"
      fontSize: "1.75rem"
      fontWeight: 700
      lineHeight: 1.25
      letterSpacing: "0.01em"

    archival-quote:
      fontFamily: "var(--font-serif)"
      fontSize: "1.25rem"
      fontStyle: "italic"
      lineHeight: 1.6
      letterSpacing: "0"

    lead-text:
      fontFamily: "var(--font-sans)"
      fontSize: "1.1rem"
      fontWeight: 400
      lineHeight: 1.7
      letterSpacing: "0"

    body:
      fontFamily: "var(--font-sans)"
      fontSize: "0.95rem"
      fontWeight: 400
      lineHeight: 1.65
      letterSpacing: "0.01em"

    caption-citation:
      fontFamily: "var(--font-mono)"
      fontSize: "0.78rem"
      fontWeight: 500
      lineHeight: 1.5
      letterSpacing: "0.04em"

elevation-borders:
  double-bezel:
    outer: "border: 1px solid rgba(255, 255, 255, 0.08); background: rgba(255, 255, 255, 0.02); border-radius: 24px; padding: 2px;"
    inner: "border-radius: 22px; background: var(--surface-card); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);"
  hairline: "1px solid rgba(255, 255, 255, 0.08)"
  hairline-gold: "1px solid rgba(212, 175, 55, 0.32)"
  shadow-vitrine: "0 24px 70px rgba(0, 0, 0, 0.65), 0 0 40px rgba(212, 175, 55, 0.08)"
  shadow-plinth: "0 30px 80px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(212, 175, 55, 0.2)"
  backdrop-blur-hud: "blur(20px)"
  backdrop-blur-card: "blur(16px)"

component-patterns:
  nav-island:
    display: "floating pill header at top"
    height: "64px"
    surface: "rgba(7, 10, 16, 0.82) with 24px backdrop-filter blur"
    border: "1px solid rgba(212, 175, 55, 0.28)"
    borderRadius: "9999px"
    shadow: "0 16px 40px rgba(0,0,0,0.6)"

  side-dock:
    position: "fixed left dock at 50% vertical center"
    surface: "rgba(10, 15, 26, 0.94) with 24px backdrop-filter blur"
    border: "1px solid rgba(212, 175, 55, 0.35)"
    borderRadius: "20px"
    iconWidth: "20px"
    iconStroke: "1.75px"

  pill-button:
    borderRadius: "9999px"
    padding: "10px 22px"
    background: "linear-gradient(135deg, #c59b27, #93670c)"
    color: "#05070a"
    fontWeight: 700
    nestedBubble: "width: 24px; height: 24px; border-radius: 50%; background: #05070a; color: #f59e0b;"
    shadow: "0 8px 24px rgba(197, 155, 39, 0.35)"

  webgl-stage:
    background: "radial-gradient(circle at 50% 45%, rgba(212,175,55,0.06) 0%, rgba(7,9,14,0.95) 75%)"
    border: "1px solid rgba(212, 175, 55, 0.22)"
    borderRadius: "24px"
    lighting: "3-point studio lighting with ACESFilmic tonemapping, warm key spotlight, and gold grazing rim"
    fallback: "immediate static archival image overlay with title plaque"

micro-interactions:
  easings:
    expo-out: "cubic-bezier(0.16, 1, 0.3, 1)"
    apple-spring: "cubic-bezier(0.32, 0.72, 0, 1)"
  durations:
    rapid: "140ms"
    subtle: "280ms"
    stately: "600ms"
  motion-policy:
    strict-reduced-motion: "Bypasses all scroll hijacking, renders static images instead of WebGL rotations, instant reveals"
    scrubbing: "Lenis smooth-scroll coupled to GSAP ScrollTrigger ticker with scrub duration 1.2s"
    parallax-depth: "Foreground cards translate at 1.0x velocity; background archival plates scale from 1.0 to 1.08 with 0.4x parallax translation"
