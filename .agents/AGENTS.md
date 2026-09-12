# AETHEX Visual & UI/UX Design System Rules

These style guidelines and behavioral constraints apply to all UI changes and new feature development in the AETHEX codebase:

## 1. Visual Style Constraints
*   **Color Palette (Strict Monochrome Only):**
    *   Background: Black `#050505`
    *   Surface: `#0B0B0B`
    *   Cards: `#111111`
    *   Borders: `rgba(255,255,255,0.08)`
    *   Primary Text: White `#FFFFFF`
    *   Secondary Text: `#9A9A9A`
    *   Muted: `#6B6B6B`
    *   Hover: `#ECECEC`
    *   Accent: Strictly **White**.
    *   **Prohibited:** No colorful gradients, no neons, no glassmorphism (do not use semi-transparent frosted-glass styling classes), no cyberpunk glowing effects.
*   **UI Elements:**
    *   Use thin hairline borders (`border border-white/10` or `rgba(255,255,255,0.08)`).
    *   Thin typography, massive imagery, editorial alignment.
    *   Museum-style labels, invisible containers.
    *   **Prohibited:** No rounded modern SaaS cards (prefer minimal border radius or sharp squares), no colorful buttons, no floating glass panels, no generic shadows everywhere.

## 2. Typography Rules
*   Primary Font: Neue Montreal (or alternativesatoshi/general sans).
*   Body Font: Inter.
*   Numbers: Space Grotesk.
*   Spacing: Generous letter-spacing, very clean alignment, large margins, and editorial composition.

## 3. Spacing System
*   Base unit is `8px`.
*   Allowed values: `8`, `16`, `24`, `32`, `48`, `64`, `96`, `128`, `160`.
*   Never crowd elements; allow content to breathe.

## 4. Animation and Motion Rules
*   Everything must move like a camera (slow, heavy, elegant, organic), never like a web app.
*   Use GPU-accelerated transforms (opacity, scale, rotate, blur, parallax) with Framer Motion.
*   **Prohibited:** Never animate layout-reflowing properties like `top`, `left`, `width`, or `height`.

## 5. Buttons
*   **Primary:** Solid white background, black text, large padding, minimal border-radius.
*   **Secondary:** Transparent, hairline border (`border-white/10`), underline hover animation.
