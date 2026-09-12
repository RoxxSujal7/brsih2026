---
name: react-bits
description: Comprehensive catalog and implementation guide for React Bits — animated, interactive, and customizable React components including Text Animations, Backgrounds, Animations, and UI Components.
---

# React Bits Component Library & Skill Guide

**React Bits** (by David Haz) is an open-source collection of animated, interactive, and highly polished React components designed to make modern web interfaces dynamic and engaging.

## Component Categories

### 1. Text Animations (`src/components/react-bits/TextAnimations/`)
- **DecryptedText**: Matrix/cyber-style text decryption decoding effect on hover or scroll view.
- **BlurText**: Smooth spring blur-in letter or word animation.
- **ShinyText**: Shimmering, moving metallic light sweep across text.
- **TrueFocus**: Interactive spotlight focus on hover that blurs surrounding text.
- **SplitText**: Character or word level stagger reveals.
- **GradientText**: Animated flowing color gradient typography.
- **CountUp**: Smooth numerical counter with easing.
- **RotatingText**: Dynamic inline word rotator.
- **TextPressure**: Variable font weight that reacts to cursor proximity.

### 2. Backgrounds (`src/components/react-bits/Backgrounds/`)
- **Waves**: Smooth animated canvas wave fields.
- **Hyperspeed**: Starfield warp-speed particle acceleration.
- **Orb**: Glowing, interactive spherical gradient orb.
- **Particles**: Customizable interactive floating particle mesh.
- **GridDistortion**: Cursor-reactive liquid distortion on a geometric grid.
- **Aurora**: Soft, organic northern lights gradient fluid.
- **Ballpit**: Physics-based interactive bouncing spheres.
- **PixelBlast**: Dynamic pixel burst and particle explosion.

### 3. Components (`src/components/react-bits/Components/`)
- **Dock**: macOS-style magnification dock bar.
- **ElasticSlider**: Fluid spring-physics draggable slider.
- **TiltedCard**: 3D parallax tilt card with specular highlights.
- **InfiniteScroll**: Seamless looped marquee scroller for cards or badges.
- **SpotlightCard**: Card that reveals a radial gradient glow following the cursor.
- **PixelCard**: Card revealing an interactive retro pixel grid on hover.

### 4. Animations (`src/components/react-bits/Animations/`)
- **Magnet**: Magnetic attraction effect pulling elements toward the cursor.
- **BlobCursor**: Liquid fluid cursor follower.
- **FollowCursor**: Smooth dampened element follower.
- **StarBorder**: Moving luminous border highlight around buttons and cards.

## How to Import & Use

```jsx
// Example: Importing DecryptedText and SpotlightCard
import DecryptedText from '../components/react-bits/TextAnimations/DecryptedText/DecryptedText';
import SpotlightCard from '../components/react-bits/Components/SpotlightCard/SpotlightCard';

export function Example() {
  return (
    <SpotlightCard spotlightColor="rgba(245, 158, 11, 0.2)">
      <DecryptedText
        text="The Constitution of India"
        speed={40}
        maxIterations={15}
        animateOn="view"
      />
    </SpotlightCard>
  );
}
```
