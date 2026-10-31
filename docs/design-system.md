---
name: EduTrust Fintech
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434656'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#747688'
  outline-variant: '#c4c5d9'
  surface-tint: '#1049f1'
  primary: '#003fdd'
  on-primary: '#ffffff'
  primary-container: '#2b59ff'
  on-primary-container: '#ecedff'
  inverse-primary: '#b9c3ff'
  secondary: '#006d3c'
  on-secondary: '#ffffff'
  secondary-container: '#70fda7'
  on-secondary-container: '#007440'
  tertiary: '#7d4600'
  on-tertiary: '#ffffff'
  tertiary-container: '#a05b00'
  on-tertiary-container: '#ffebdc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b9c3ff'
  on-primary-fixed: '#001356'
  on-primary-fixed-variant: '#0035be'
  secondary-fixed: '#70fda7'
  secondary-fixed-dim: '#51df8e'
  on-secondary-fixed: '#00210e'
  on-secondary-fixed-variant: '#00522c'
  tertiary-fixed: '#ffdcc0'
  tertiary-fixed-dim: '#ffb875'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6b3b00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  currency-display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  currency-display-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.025em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies the intersection of institutional academic credibility and modern neo-banking agility. Tailored for ambitious university students, it delivers an experience that is celebratory yet secure, encouraging academic achievement through automated digital-dollar disbursements.

The aesthetic fuses **Corporate / Modern Fintech** clarity with the kinetic simplicity of top-tier consumer apps like Revolut and Mercado Pago. The visual posture is transparent, crisp, and empowering:
- Generous breathing room signals stability and cognitive ease.
- High-contrast visual cues immediately distinguish confirmed payouts from pending course verifications.
- Precise typography balances financial gravitas with youthful accessibility, shedding archaic banking clunkiness in favor of immediate, frictionless clarity.

## Colors

The palette establishes an immediate hierarchy between platform authority, financial progression, and real-time verification statuses:

- **Primary (`#2B59FF` - Electric Blue):** Drives key calls-to-action, primary balances, and core brand milestones. Evokes institutional trust enhanced by neobank momentum.
- **Secondary (`#12B76A` - Emerald Growth):** Represents approved coursework, liquid digital dollar balances, and successful wallet withdrawals. Must be used with high intentionality for celebration and validation.
- **Tertiary (`#F79009` - Amber Pending):** Denotes in-review academic credentials, pending grade synchronizations, and transitional states.
- **Neutral (`#0F172A` - Slate Ink):** Serves as the anchor for primary typography and dark contrasting elements. Secondary text leverages muted slate tones (`#475467` and `#98A2B3`).
- **Canvas & Surface Layers:** Pure white (`#FFFFFF`) forms the primary card plane, suspended over an ultra-light neutral grey canvas (`#F8FAFC` to `#F1F5F9`) to define edges without dense strokes.

## Typography

Typography is powered solely by **Inter** to ensure micro-legibility of monetary figures, compact course codes, and complex transaction states across mobile displays.

- **Monetary & Numeric Treatment:** Currency metrics (`currency-display`) feature tabular numbers (`tnum`) to eliminate jitter during value updates and animations. Negative letter-spacing on display scales produces a modern neobank lockup.
- **Visual Weight & Hierarchy:** Structural titles rely on semi-bold (`600`) weights to provide contrast against the ultra-clean canvas without feeling heavy.
- **Labels & Microcopy:** Status tags and table trackers utilize tight, uppercase or title-cased labels (`label-md`, `label-sm`) with boosted letter spacing for immediate scannability on low-luminance displays.

## Layout & Spacing

The layout architecture implements a **mobile-first fluid grid** engineered around natural thumb reach and rapid thumb-scroll verification:

- **Mobile Viewport (<768px):** Single-column fluid stream with `1rem` outer canvas padding (`margin`). Critical actions remain pinned within the lower safe area. Grid structures default to single units, reserving two-column layouts for split metric tiles.
- **Tablet (768px - 1024px):** 8-column layout with `1.5rem` margins and gutters. Cards arrange into 4-column pairing grids for dual balance/payout overviews.
- **Desktop (>1024px):** 12-column layout capped at a max-width of `1200px` to maintain content density. Margins expand to `2rem`, allowing the scholarship timeline and wallet transactions to live in parallel viewports.
- **Rhythm Principle:** Internal card padding is strictly uniform at `space-lg` (24px) for desktop and `space-md` (16px) for compact mobile widgets.

## Elevation & Depth

Depth in this system is defined by soft, multi-stop ambient light rather than heavy structural borders:

- **Ambient Elevation (Resting Cards):** A dual-stop drop shadow creates floating planes without visible edges:
  `box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.05), 0px 4px 16px rgba(16, 24, 40, 0.04);`
- **Raised Elevation (Interactive / Hover):**
  `box-shadow: 0px 4px 6px rgba(16, 24, 40, 0.04), 0px 12px 24px -4px rgba(43, 89, 255, 0.08);`
  A subtle tint of the primary blue is infused into the elevation wash for lifted states.
- **Overlays & Modals:**
  `box-shadow: 0px 20px 40px -10px rgba(15, 23, 42, 0.12);`
  Accompanied by a neutral scrim with backdrop blur (`backdrop-filter: blur(8px); background: rgba(15, 23, 42, 0.4)`).
- **Surface Borders:** Borders remain hair-thin and low-contrast: `1px solid rgba(15, 23, 42, 0.06)`.

## Shapes

The design system standardizes on a curvature scale governed by `roundedness: 2`, delivering friendly, human-centric fintech aesthetics:

- **Primary Cards & Containers (`rounded-lg`):** Fixed strictly to `16px` (`1rem`). This defines account summary blocks, subject verification cards, and digital wallet modules.
- **Buttons & Input Controls (`rounded`):** Default to `8px` (`0.5rem`) for compact components and `10px` for primary touch actions, ensuring structural contrast against parent cards.
- **Status Tags & Pill Micro-elements:** Use full pill rounding (`9999px`) to distinguish categorical metadata and academic grade achievements from rectangular interactive buttons.
- **Inner Nested Elements:** Any element nested inside a 16px card adopts an `8px` or `12px` border radius to maintain optical concentricity.

## Components

### Buttons
- **Primary:** Background `#2B59FF`, text `#FFFFFF`, 0px border. Height 48px on mobile for optimal tap targets. Hover: `#1E47E0`. Active scale: `0.98`.
- **Secondary (Success/Claim):** Background `#12B76A`, text `#FFFFFF`. Reserved for explicit payout withdrawals and reward redemption flows.
- **Tertiary / Subdued:** Background `#F8FAFC`, text `#0F172A`, 1px border `rgba(15, 23, 42, 0.08)`.

### Cards (Fintech & Academic)
- **Base Style:** 16px corner radius, pure white `#FFFFFF` surface, ambient elevation shadow, 1px perimeter line `rgba(15, 23, 42, 0.06)`.
- **Wallet Balance Card:** Primary variation featuring an optional deep gradient overlay (`linear-gradient(135deg, #2B59FF 0%, #1539C2 100%)`) with white tabular typography and instant dollar balance conversion.
- **Subject Grade Card:** Contains course code, status pill (Pending vs Approved), grade score, and corresponding dollar amount earned upon course completion.

### Chips & Badges
- **Status "Aprobada" (Approved):** Soft green fill `#ECFDF3`, border `#A6F4C5`, text `#027A48`, pill-rounded.
- **Status "Pendiente" (Pending):** Soft amber fill `#FEF0C7`, border `#FEDF89`, text `#B54708`, pill-rounded.
- **Status "En Curso" (In Progress):** Soft blue fill `#EFF4FF`, border `#C7D7FE`, text `#2B59FF`, pill-rounded.

### Inputs & Form Fields
- Height 48px, 8px corner radius, border `1px solid #D0D5DD`, background `#FFFFFF`, text `#0F172A`.
- Active focus state: border `#2B59FF` paired with an outer focus ring (`box-shadow: 0 0 0 4px rgba(43, 89, 255, 0.15)`).

### Selection Controls
- **Checkboxes & Radios:** Primary `#2B59FF` filled on active with white glyphs. Inactive: `#D0D5DD` boundary with smooth color transitions.

### Lists & Transactions
- Edge-to-edge mobile list format with 16px horizontal internal padding.
- Left-aligned academic icon or avatar container (40x40px, 8px radius, `#F1F5F9` background).
- Right-aligned tabular currency displays with secondary green text for credit increments (`+$50.00 USDT`).