---
name: unlumen-ui
description: Curated registry of beautifully designed, dark-mode-first React components built with TypeScript, Tailwind CSS, Motion, and Shadcn CLI. Use when implementing refined micro-interactions, progressive blur, glow badges, magnetic buttons, tilt cards, scramble text, or floating tooltips.
---

# Unlumen UI - Refined Motion & Dark-Mode React Components

Unlumen UI (https://ui.unlumen.com) is an open-source component distribution crafted with **React**, **TypeScript**, **Tailwind CSS**, and **Motion**. It provides high-aesthetic primitives with organic transitions, glow effects, and spatial feedback.

## 🚀 Quick Install & Usage

### Installing Components via Shadcn CLI:
```bash
# Direct from Unlumen registry
npx shadcn@latest add "https://ui.unlumen.com/r/<component-name>.json"

# Or with registry alias
npx shadcn add @unlumen-ui/<component-name>
```

### Example:
```bash
npx shadcn@latest add "https://ui.unlumen.com/r/magnetic-button.json"
npx shadcn@latest add "https://ui.unlumen.com/r/glow.json"
npx shadcn@latest add "https://ui.unlumen.com/r/progressive-blur.json"
```

---

## 🎨 Available Primitives (30 Components)

- **Interactive Motion**: `magnetic-button`, `button`, `tilt`, `tilt-card`, `cursor`, `cursor-primitive`, `floating-tooltip`, `tooltip-preview`
- **Atmosphere & Lighting**: `glow`, `glowing-badge`, `progressive-blur`, `highlight`, `velocity-highlight`
- **Text & Typography**: `scramble-text`, `shimmering-text`, `text-reveal`, `count-up`
- **Layout & Controls**: `command-menu`, `tabs`, `switch`, `slider`, `theme-switch`, `copy`, `refresh`, `kbd`
- **Data & Visuals**: `orbiting-skills`, `math-graph`, `shimmer-skeleton`, `clipped-circle`, `slot`

---

## ⚡ Design Philosophy
1. **Luminous & Dark-Tech Aesthetic**: Subtle 1px borders, smooth radial gradient glows, dark surface hierarchy (`hsl(var(--background))` to `hsl(var(--surface))`).
2. **Smooth Spring Curves**: Uses natural momentum curves for tilt, magnetic follow, and progressive blur overlays.
3. **Accessibility**: All buttons and controls support keyboard focus, aria attributes, and `prefers-reduced-motion`.
