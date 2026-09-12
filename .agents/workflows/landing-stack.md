---
description: Build high-converting, anti-slop landing pages using the Landing Page Stack (UI/UX Pro Max + 21st.dev/SmoothUI/MagicUI components + visual browser verification).
---

# The Landing Page Stack Workflow

Based on Naman Soni's *Landing Page Stack* methodology: prevents AI from building generic, blind Tailwind templates by enforcing a strict 4-phase sequence:

```
Phase 1: References & Visual Spec  ──►  Phase 2: build.md Spec  ──►  Phase 3: Section-by-Section Build  ──►  Phase 4: Visual Browser Audit
```

---

## Phase 1: Reference Images & Visual Direction

Do NOT write code immediately. Establish visual anchors first:

1. **Query UI/UX Pro Max** for the target business type:
   ```bash
   python .agents/skills/ui-ux-pro-max/scripts/search.py "<business-type>" --domain product
   python .agents/skills/ui-ux-pro-max/scripts/search.py "<style-name>" --domain style
   ```
2. **Generate or attach 3 distinct reference concepts**:
   - Layout: Desktop 16:10 ratio, asymmetric grids, generous whitespace.
   - Distinct art directions: e.g., Minimal Monochrome vs. Dark-Tech Luminous vs. Bold Neo-Brutalist.

---

## Phase 2: Create the Build Specification (`build.md`)

Synthesize the references and UI/UX Pro Max tokens into a concrete specification document saved at `build.md`:

```markdown
# [Product Name] Landing Page Build Spec

## 1. Section Order & Intent
- **Hero**: Value proposition, primary CTA, interactive visual anchor.
- **Social Proof / Logo Rail**: Trust marquee, partner badges.
- **Problem / Agitation**: Pain points addressed before solution.
- **Feature Bento Grid**: Core capabilities with interactive cards.
- **Interactive Demo / Showcase**: Product preview or before/after slider.
- **Testimonials / Proof**: Quote stack or masonry reviews.
- **Pricing / Tiers**: Comparison cards with clear highlighted tier.
- **FAQ**: Accordion addressing objections.
- **Footer**: Navigation, legal, and final subtle CTA.

## 2. Typographic Scale (Desktop / Mobile in px)
- H1: 56px / 36px (tight leading 1.1)
- H2: 38px / 28px
- H3: 24px / 20px
- Body: 16px / 15px (line-height 1.6)
- Small / Caption: 13px / 12px

## 3. Color System (Strict Hex / OKLCH Tokens)
- Canvas / Background: ...
- Surface / Card: ...
- Text Primary / Muted: ...
- Accent / Brand: ...
- Border / Ring: ...

## 4. Spacing Scale (4px Base Unit)
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px, section-gap: 96px+

## 5. Mobile Adjustments (Breakpoint: 375px - 768px)
- Specify exact column stacks, padding contractions, and hidden non-essential graphics.
```

---

## Phase 3: Section-by-Section Implementation

> [!IMPORTANT]
> **RULE:** Build ONLY ONE section at a time. Never build the whole page in a single prompt.

For each section (e.g. `[Hero]`, `[Features]`, `[Pricing]`):
1. **Search Component Registries**:
   - Check local catalogs:
     - **21st.dev**: Search components matching section intent.
     - **SmoothUI** (`.agents/skills/smoothui/`): `siri-orb`, `magnetic-button`, `scrollable-card-stack`.
     - **Magic UI** (`.agents/skills/magic-ui/`): `marquee`, `globe`, `bento-grid`, `border-beam`.
     - **Unlumen UI** (`.agents/skills/unlumen-ui/`): `glow`, `progressive-blur`, `tilt-card`.
2. **Strict Design Token Enforcement**:
   - Apply *only* the fonts, hex colors, and spacing from `build.md`.
   - Strip out default third-party demo colors.
3. **Mobile-First Responsiveness**:
   - Ensure clean wrapping from `375px` upwards.
4. **Pause & Check**:
   - Stop execution after the section. Review assumptions before moving forward.

---

## Phase 4: Visual Browser Audit ("The Step Nobody Does")

Use the Antigravity **Browser Subagent** (`browser_subagent`) to render and inspect the live running dev server:
1. Open `http://localhost:<port>`.
2. Check typography wrapping (no 1-word awkward orphans).
3. Check contrast against dark/light surfaces (minimum 4.5:1).
4. Verify mobile viewports (375px iPhone, 768px iPad, 1440px Desktop).
5. Fix issues before declaring the section complete.
