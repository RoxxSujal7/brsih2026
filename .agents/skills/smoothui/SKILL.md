---
name: smoothui
description: Beautifully designed React components with smooth animations built with Tailwind CSS and Motion. Use when designing, building, adding, or improving animated UI components, interactive cards, Siri-style orbs, AI chat interfaces, text transitions, dynamic islands, or micro-interactions. Access to 132+ animated components from the SmoothUI registry.
---

# SmoothUI - Production Animated UI Components

SmoothUI is a collection of 132+ beautifully animated components built with **React**, **Tailwind CSS**, and **Motion** (Framer Motion). It features iOS-style fluid motion, AI interfaces, particle effects, spring-physics buttons, and interactive card stacks.

## 🚀 Quick Install / Usage

### CLI Installation:
```bash
# Add a component using smoothui CLI
npx smoothui add <component-name>

# Or using shadcn CLI v3 registry
npx shadcn@latest add "https://smoothui.dev/r/<component-name>.json"
```

### MCP Server Integration:
Configure registry in `components.json`:
```json
{
  "registries": {
    "@smoothui": "https://smoothui.dev/r/{name}.json"
  }
}
```

---

## 🎨 Component Catalog (132 Components Available)

### AI & Agent Interfaces:
- `ai-input`, `ai-prompt-input`, `ai-message`, `ai-conversation`, `ai-response`
- `ai-orb-face`, `siri-orb`, `ai-loader`, `ai-diff`, `ai-citation`, `ai-sources`
- `ai-tool-call`, `ai-reasoning`, `ai-task-list`, `ai-suggestions`, `agent-avatar`
- `ai-context-meter`, `ai-branch`, `ai-approval`, `ai-artifact`

### Interactive & Motion Controls:
- `magnetic-button`, `smooth-button`, `dot-morph-button`, `clip-corners-button`, `button-copy`
- `dynamic-island`, `animated-toggle`, `animated-o-t-p-input`, `animated-file-upload`
- `animated-input`, `animated-tabs`, `animated-stepper`, `animated-progress-bar`, `animated-tags`
- `cursor-follow`, `scrubber`, `exposure-slider`, `social-selector`

### Cards & Stacks:
- `scrollable-card-stack`, `expandable-cards`, `app-download-stack`, `photo-stack`, `phototab`
- `glow-hover-card`, `matrix-card`, `switchboard-card`, `product-card`, `tweet-card`

### Text & Reveal Animations:
- `scramble-hover`, `shine-text`, `wave-text`, `typewriter-text`, `reveal-text`
- `per-character-rise`, `per-word-crossfade`, `scroll-reveal-paragraph`, `number-flow`, `price-flow`
- `bottom-up-letters`, `top-down-letters`, `depth-parallax-words`, `line-by-line-slide`

### Shaders & Fluid Transitions:
- `shader-reveal-transition`, `shader-reveal-noise-transition`, `shader-reveal-circle-transition`
- `shader-reveal-planetary-transition`, `sdf-blob-transition`, `organic-merge-transition`
- `morph-surface`, `aperture-blur-transition`, `chroma-blur-transition`, `prism-sweep-transition`

### Overlays & Layouts:
- `rich-popover`, `gooey-popover`, `drawer`, `dialog`, `basic-modal`, `basic-dropdown`
- `dropdown-menu`, `context-menu`, `combobox`, `searchable-dropdown`, `select`
- `basic-toast`, `notification-badge`, `contribution-graph`, `reviews-carousel`

---

## ⚡ Animation Design Rules (Spring Physics & Accessibility)

1. **Spring Presets**:
   - UI Transitions: `transition={{ type: "spring", duration: 0.25, bounce: 0.08 }}`
   - Playful Interactions: `transition={{ type: "spring", stiffness: 400, damping: 25 }}`
2. **Reduced Motion**: Always respect user accessibility preferences:
   ```tsx
   import { useReducedMotion } from "motion/react";
   const shouldReduceMotion = useReducedMotion();
   ```
3. **No Layout Thrashing**: Animate `transform` and `opacity` instead of `width` / `height` whenever possible.
