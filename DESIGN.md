---
version: alpha
name: Arrival Architecture
description: Restrained architectural elegance for a continuous QR-to-ballroom response experience.
colors:
  primary: "#07131D"
  limestone: "#F1EEE4"
  mineral: "#0D2435"
  silver: "#9BA7AD"
  accent: "#1677FF"
  error: "#9B251A"
typography:
  display:
    fontFamily: Bodoni Moda Variable
    fontSize: 6rem
    fontWeight: 440
    lineHeight: 0.96
    letterSpacing: "-0.035em"
  body:
    fontFamily: Albert Sans Variable
    fontSize: 1rem
    fontWeight: 450
    lineHeight: 1.5
  label:
    fontFamily: Albert Sans Variable
    fontSize: 0.7rem
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "0.14em"
rounded:
  structural: 1px
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 72px
components:
  button-primary:
    backgroundColor: "{colors.limestone}"
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    rounded: "{rounded.structural}"
    padding: 16px
    height: 56px
  button-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.limestone}"
    typography: "{typography.body}"
    rounded: "{rounded.structural}"
    padding: 16px
    height: 56px
  input:
    backgroundColor: "{colors.limestone}"
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    rounded: "{rounded.structural}"
    padding: 14px
  scene:
    backgroundColor: "{colors.mineral}"
    textColor: "{colors.silver}"
  progress-active:
    backgroundColor: "{colors.accent}"
---

## Overview

Arrival Architecture treats the opening film and the response flow as one room. A procedural white architectural masterplan, two-tower hotel massing, and simplified ballroom are rendered as one continuous WebGL scene; a CSS/SVG version preserves the same geometry on lightweight fallbacks. Precise rules, projection geometry, strong typographic scale, and controlled blue light replace campaign graphics or interface cards.

## Colors

The deep mineral blue-black represents the approach at night. Warm limestone becomes the projection surface and form canvas. Brushed silver supports wayfinding, while clear blue is reserved for light, progress, and active focus. There are no gradients or glass effects.

## Typography

Bodoni Moda Variable gives the event a formal, architectural display voice. Albert Sans Variable handles controls, answers, and small technical labels. Both are self-hosted through npm packages so the experience does not wait for remote font services.

## Layout

Every state fills the viewport. The masthead and fine rules establish a stable frame while the scene changes behind it. The form places one large question over an unboxed answer line. Mobile safe areas, 44px minimum targets, and fluid clamp-based sizing are mandatory.

## Elevation & Depth

Depth comes from perspective, line convergence, occlusion, and one soft offset shadow on the projection plane. Interfaces remain flat and structural.

## Shapes

Rectangles, one-pixel rules, and near-square corners define the system. Rounded cards, pills, organic masks, and decorative containers are excluded.

## Components

Primary actions are 56px projection bars. Secondary actions are underlined text with generous hit targets. Inputs are borderless except for a single baseline that turns blue on focus. Errors name both the issue and recovery.

## Do's and Don'ts

- Do preserve the continuity between the projection rectangle and the form surface.
- Do animate only transform, opacity, and clip-path for the authored journey.
- Do keep the reduced-motion route complete and fast.
- Don't add logos, hotel photography, gradients, glass, cards, or generic marketing sections.
- Don't introduce extra fields or retain completed drafts on the device.
