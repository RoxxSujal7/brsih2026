---
name: neobrutalism
description: NeoBrutalism & RetroUI design system and component library for React, Tailwind CSS, and Shadcn. Use when building retro-modern, high-contrast, brutalist user interfaces featuring bold black borders, hard offset drop-shadows, vivid accent colors, raw typography, and tactile press states.
---

# NeoBrutalism & RetroUI Design System

NeoBrutalism (https://neobrutalism.dev / https://retroui.dev) brings the popular neo-brutalist / retro aesthetic to modern React and Tailwind CSS applications. It pairs raw utilitarian geometry with vibrant accents and playful micro-interactions.

## 🎯 Key Design Hallmarks

1. **High Contrast Borders**:
   - Sharp, solid 2px or 3px black borders (`border-2 border-black dark:border-white`).
2. **Hard Offset Shadows (No Gaussian Blur)**:
   - `shadow-[4px_4px_0px_0px_#000]` or `shadow-md`
   - Active / Press state translates by 2px and shrinks shadow:
     `hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`
3. **Vibrant Palettes with Monospaced Accents**:
   - High-saturation primary colors: Yellow (`#FFE600`), Pink/Magenta (`#FF66C4`), Cyan (`#00F0FF`), Lime (`#A6FF00`).
   - Monospace tags, uppercase badges, bold chunky buttons.
4. **Sharp or Micro-Rounded Corners**:
   - Zero border-radius (`rounded-none`) or subtle retro rounding (`rounded-md` / 6px).

---

## 📦 Component Catalog (37 Components Available)

### Core Inputs & Controls:
- `Button`, `IconButton`, `Input`, `Textarea`, `Checkbox`, `Radio`, `Switch`, `Slider`
- `Toggle`, `ToggleGroup`, `Select`, `Field`, `Label`

### Navigation & Overlays:
- `Accordion`, `Dialog`, `Drawer`, `Menu`, `ContextMenu`, `Popover`, `Tooltip`
- `Breadcrumb`, `Tab`, `Command`, `CommandDisplay`, `TableOfContents`

### Data, Feedback & Display:
- `Alert`, `Avatar`, `Badge`, `Card`, `Calendar`, `Carousel`, `Empty`, `Loader`
- `Progress`, `Table`, `Text`, `Sonner` (Toast), `charts`

---

## 💻 Installation & Usage

```bash
# Add RetroUI theme tokens to Tailwind:
npx shadcn@latest add "https://retroui.dev/r/retroui-theme.json"

# Add individual components:
npx shadcn@latest add "https://retroui.dev/r/button.json"
npx shadcn@latest add "https://retroui.dev/r/card.json"
npx shadcn@latest add "https://retroui.dev/r/accordion.json"
```
