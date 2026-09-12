---
name: awesome-design-md
description: "Curated collection of 74 DESIGN.md design system specifications analyzed from top brands (Linear, Stripe, Apple, Vercel, Raycast, Supabase, Claude, Cursor, Figma, Framer, Tesla, etc.) for AI coding agents to generate consistent, brand-level UI."
---

# Awesome DESIGN.md - Brand Design Systems for AI Agents

`awesome-design-md` provides **74 production-grade, reverse-engineered `DESIGN.md` design system specifications** from leading technology companies, luxury brands, creative platforms, and fintech leaders.

Every `DESIGN.md` is structured in clean, agent-readable markdown format according to the Google Stitch design specification standard. It details:
- **Color Systems & Tokens**: Exact hex codes for canvas, surfaces, hair lines, brand accents, muted inks, and semantic states.
- **Typography Hierarchies**: Font families, sizing, line-heights, letter-spacing, and optical tracking.
- **Elevation, Borders & Radius**: Hairline borders, backdrop blur levels, box-shadows, and corner rounding.
- **Spacing & Layout Grids**: Gap metrics, container widths, bento grid structures, and section rhythms.
- **Component Patterns**: Buttons, inputs, feature cards, navigation bars, badges, and modals.
- **Micro-Interactions & Motion**: Hover states, active press physics, transition curves, and timing.

---

## 📂 Quick Access & Usage in Projects

### 1. How an Agent or Developer Uses This Skill
When designing a page, component, or entire web app inspired by or matching a specific brand aesthetic:
1. Locate the brand in `design-md/<brand-name>/DESIGN.md`.
2. Inspect or read the tokens and guidelines.
3. Copy or reference the design tokens directly into your project's `DESIGN.md`, CSS custom properties (`:root`), or Tailwind config.

### 2. Copying a Brand Design System into a Project
To adopt a design system directly into your workspace root:
```bash
# Example: Apply Linear design system to current project
Copy-Item .agents/skills/awesome-design-md/design-md/linear.app/DESIGN.md ./DESIGN.md
```

Or for Stripe:
```bash
Copy-Item .agents/skills/awesome-design-md/design-md/stripe/DESIGN.md ./DESIGN.md
```

---

## 🏛️ Brand Directory by Category (74 Systems)

### 🚀 Developer Tools & Cloud Infrastructure
- **`linear.app`** (`design-md/linear.app/DESIGN.md`): Deep charcoal `#010102`, lavender-blue accent `#5e6ad2`, SF Pro tracking, hairpins.
- **`vercel`** (`design-md/vercel/DESIGN.md`): High-contrast monochrome, geometric Geist sans, ultra-sharp border radii, glowing borders.
- **`stripe`** (`design-md/stripe/DESIGN.md`): Vibrant mesh gradients, Slate/Indigo palette, refined typography, enterprise trust.
- **`supabase`** (`design-md/supabase/DESIGN.md`): Emerald green accents, dark slate panels, Postgres-inspired developer aesthetic.
- **`raycast`** (`design-md/raycast/DESIGN.md`): Floating command-palette glow, crimson-red brand accent, keyboard-first focus rings.
- **`cursor`** (`design-md/cursor/DESIGN.md`): Modern AI IDE design, dark canvas, high-legibility monospaced and sans typography.
- **`resend`** (`design-md/resend/DESIGN.md`): Minimalist monochrome, pristine whitespace, subtle gray borders, precision typography.
- **`posthog`** (`design-md/posthog/DESIGN.md`): Playful retro-modern developer tools with bold hedgehog accents.
- **`sentry`** (`design-md/sentry/DESIGN.md`): Developer error tracking palette, purple/violet accents, dense analytical layouts.
- **`clickhouse`** (`design-md/clickhouse/DESIGN.md`): High-speed database aesthetic, yellow/black data contrast.
- **`mongodb`** (`design-md/mongodb/DESIGN.md`): Forest green accents, slate surfaces, database documentation structure.
- **`hashicorp`** (`design-md/hashicorp/DESIGN.md`): DevOps utility, geometric typography, structured cards.
- **`warp`** (`design-md/warp/DESIGN.md`): Modern terminal UI, vibrant cyan/blue gradients, dark mode mastery.
- **`mintlify`** (`design-md/mintlify/DESIGN.md`): Clean modern documentation design, emerald highlights, high readability.
- **`sanity`** (`design-md/sanity/DESIGN.md`): Editorial structured content canvas, vibrant coral/red highlights.
- **`expo`** (`design-md/expo/DESIGN.md`): Mobile developer framework aesthetic, clean monochrome and blue accents.

### 🤖 AI Models & Next-Gen Platforms
- **`claude`** (`design-md/claude/DESIGN.md`): Warm editorial parchment, terracotta/amber warmth, literary serifs, calm intelligence.
- **`x.ai`** (`design-md/x.ai/DESIGN.md`): Stark black/white, minimal high-contrast futuristic AI interface.
- **`mistral.ai`** (`design-md/mistral.ai/DESIGN.md`): Warm European editorial, vintage orange accents, retro-modern pixel touches.
- **`replicate`** (`design-md/replicate/DESIGN.md`): Minimalist machine learning API canvas, monospaced typography, clean grid lines.
- **`runwayml`** (`design-md/runwayml/DESIGN.md`): Generative video dark studio, neon accents, media-heavy bento grid.
- **`elevenlabs`** (`design-md/elevenlabs/DESIGN.md`): Audio/voice AI aesthetic, waveform-friendly dark panels, violet accents.
- **`cohere`** (`design-md/cohere/DESIGN.md`): Enterprise LLM branding, organic earth tones meets modern AI tech.
- **`together.ai`** (`design-md/together.ai/DESIGN.md`): High-performance open-source AI cloud styling.
- **`ollama`** (`design-md/ollama/DESIGN.md`): Utilitarian local AI, clean black-and-white terminal feel with friendly typography.
- **`minimax`** (`design-md/minimax/DESIGN.md`): Multimodal AI interface styling.
- **`voltagent`** (`design-md/voltagent/DESIGN.md`): Agentic AI workflow aesthetic.

### 🎨 Creative Tools & Design Systems
- **`apple`** (`design-md/apple/DESIGN.md`): Human Interface Guidelines, SF Pro, liquid glassmorphism, physical spring motion, restrained luxury.
- **`figma`** (`design-md/figma/DESIGN.md`): Multi-color collaborative canvas, playful toolbars, ultra-responsive tactile controls.
- **`framer`** (`design-md/framer/DESIGN.md`): Interactive website canvas, smooth micro-interactions, dark mode elegance.
- **`webflow`** (`design-md/webflow/DESIGN.md`): Visual web development aesthetic, deep blues, structured inspector panels.
- **`notion`** (`design-md/notion/DESIGN.md`): Warm paper canvas, serif and sans hybrid, emoji-friendly, clean modular blocks.
- **`miro`** (`design-md/miro/DESIGN.md`): Collaborative whiteboard, vibrant sticky-note colors, friendly canvas controls.
- **`cal`** (`design-md/cal/DESIGN.md`): Scheduling platform aesthetic, clean white/dark mode toggle, seamless form inputs.

### 🏎️ Luxury, Automotive & High-End Industrial
- **`ferrari`** (`design-md/ferrari/DESIGN.md`): Corsa Red, high-gloss blacks, carbon fiber textures, aerodynamic elegance.
- **`lamborghini`** (`design-md/lamborghini/DESIGN.md`): Angular geometric polygons, intense yellow/orange, brutalist hypercar precision.
- **`bugatti`** (`design-md/bugatti/DESIGN.md`): Ultra-luxury French automotive, French Racing Blue, horseshoe curve motifs.
- **`bmw`** & **`bmw-m`** (`design-md/bmw/DESIGN.md`, `design-md/bmw-m/DESIGN.md`): Bavarian precision, tri-color M striping, clean metallic surfaces.
- **`tesla`** (`design-md/tesla/DESIGN.md`): Ultra-minimalist electric mobility, stark white, touch-first layouts, futuristic simplicity.
- **`spacex`** (`design-md/spacex/DESIGN.md`): Mission-control telemetry, monospaced data readouts, space black backgrounds.

### 💳 Fintech, Crypto & Modern Commerce
- **`shopify`** (`design-md/shopify/DESIGN.md`): Polaris design system, commerce-focused layouts, high-converting checkout flows.
- **`revolut`** (`design-md/revolut/DESIGN.md`): Ultra-smooth fintech, holographic card gradients, spring-animated financial charts.
- **`wise`** (`design-md/wise/DESIGN.md`): Forest green high-trust currency transfer, bold high-contrast numbers.
- **`coinbase`** (`design-md/coinbase/DESIGN.md`): Institutional crypto blue, clean asset tables, real-time ticker layouts.
- **`kraken`** (`design-md/kraken/DESIGN.md`): Deep purple crypto trading, dark terminal charts, security-focused UI.
- **`binance`** (`design-md/binance/DESIGN.md`): Gold and dark slate crypto exchange aesthetics.
- **`mastercard`** (`design-md/mastercard/DESIGN.md`): Intersecting circles, iconic red/orange branding, global financial trust.

### 🕹️ Media, Entertainment & Retro Design
- **`spotify`** (`design-md/spotify/DESIGN.md`): Spotify Green `#1ed760`, pitch black surfaces, album art glow, music player controls.
- **`playstation`** (`design-md/playstation/DESIGN.md`): Sony gaming blue glow, geometric symbol motifs, cinematic fullscreen media.
- **`nintendo-2001`** (`design-md/nintendo-2001/DESIGN.md`): Nostalgic GameCube/GBA era aesthetic, chunky buttons, vibrant playful hues.
- **`dell-1996`** (`design-md/dell-1996/DESIGN.md`): Classic 90s enterprise web, bevel borders, system fonts, retro nostalgia.
- **`theverge`** & **`wired`** (`design-md/theverge/DESIGN.md`, `design-md/wired/DESIGN.md`): Cutting-edge editorial journalism, neon split grids, high-contrast serif/sans.

---

## 🛠️ How to Implement Any DESIGN.md in Code

Each `DESIGN.md` contains exact token definitions. Here is an example of applying the `linear.app` specification to CSS:

```css
:root {
  /* Linear Palette Tokens */
  --linear-canvas: #010102;
  --linear-surface-1: #0f1011;
  --linear-surface-2: #141516;
  --linear-hairline: #23252a;
  --linear-primary: #5e6ad2;
  --linear-primary-hover: #828fff;
  --linear-ink: #f7f8f8;
  --linear-ink-muted: #d0d6e0;
  --linear-ink-subtle: #8a8f98;

  /* Typography Scale */
  --font-linear: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --tracking-display: -0.04em;
  --tracking-headline: -0.02em;
}

body {
  background-color: var(--linear-canvas);
  color: var(--linear-ink);
  font-family: var(--font-linear);
}

.linear-card {
  background-color: var(--linear-surface-1);
  border: 1px solid var(--linear-hairline);
  border-radius: 8px;
  padding: 24px;
  transition: border-color 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.linear-card:hover {
  border-color: var(--linear-primary);
}

.linear-btn-primary {
  background-color: var(--linear-primary);
  color: #ffffff;
  font-weight: 500;
  border-radius: 6px;
  padding: 8px 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.15s ease;
}

.linear-btn-primary:hover {
  background-color: var(--linear-primary-hover);
}
```

---

## 💡 Best Practices for AI Pair Programming
1. **Never guess tokens**: Always read the corresponding `design-md/<brand>/DESIGN.md` to get genuine hex colors, font pairings, and borders.
2. **Combine with component libraries**: Use tokens from `awesome-design-md` together with `@magicui`, `@smoothui`, or `shadcn/ui` components for instant, world-class aesthetic quality.
3. **Respect brand personality**: A developer dashboard should lean toward `linear.app` or `raycast`, an enterprise app toward `stripe` or `shopify`, an AI assistant toward `claude` or `cursor`, and a mobile experience toward `apple`.
