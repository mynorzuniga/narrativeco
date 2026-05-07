# NarrativeCo — agent rules (design system)

Agents working in this repository **must** treat this file and the design system as the single source of truth for visual and UX decisions. Do not bypass them with ad hoc choices.

## Before you build UI

1. **Read `system.md` (this file)** every time you implement or change user-facing UI, unless the task is explicitly non-UI (e.g. pure infra or config with no design impact).
2. **Open the in-app design system** at the home page: tabs **Color**, **Sizing**, **Typography**, and **Components** mirror what we ship (under **Components**, use subtabs such as **CTA** and **Header and footer**). Prefer reading the underlying definitions in code (paths below) so you use exact values, not approximations.
3. **Read the user’s instructions** and map each requirement to something that exists in the design system. If there is no match, **stop and ask the user** — do not invent tokens, fonts, scales, or patterns.

## Design system sources (code)

Use these files; extend them only when the user explicitly asks to evolve the system.

| Area | Location |
|------|----------|
| Color scales, brand hex, neutrals | `app/lib/color-palettes.ts` |
| Typography scale (headings, body sizes, weights) | `app/lib/typography-scale.ts` |
| Heading font (Bebas Neue), body stack, utilities | `app/globals.css`, `app/layout.tsx` |
| Tab structure and feature layout | `app/design-system-tabs.tsx`, `app/*-tab.tsx` |
| **App footer chrome** (`DsAppFooter`) | `app/ui/ds-app-footer.tsx` |
| **Components (docs + specs in UI)** | `app/components-tab.tsx` — **Components → CTA**, **Components → Header and footer** (footer live spec + demo uses `DsAppFooter`) |
| **CTA buttons (main + secondary)** — **use these for buttons** | `app/ui/ds-cta-buttons.tsx` (`DsCtaMainButton`, `DsCtaSecondaryButton`) |

## Rules

- **No arbitrary design decisions.** Spacing, type sizes, weights, colors, and fonts must come from the design system or from tokens/constants that encode the same values. If you need a value that is not defined, **ask the user** whether to add it to the system and where.
- **Do not invent** new palette stops, random rem values outside the sizing convention, extra heading levels, or alternate fonts “that look similar.”
- **Light mode only** for this product unless the user changes that globally. Do not reintroduce dark-mode variants without instruction.
- **Pair user requests with the system.** Example: “add a primary/secondary button” → import and use `DsCtaMainButton` / `DsCtaSecondaryButton` from `app/ui/ds-cta-buttons.tsx` (see **Components → CTA**), which already apply `color-palettes.ts`, `typography-scale.ts` (Heading 5), and documented sizing — do not rebuild one-off buttons unless the spec truly diverges (then extend the system with the user).
- **When something cannot align cleanly** (ambiguous copy, missing token, conflicting requirements, or no equivalent in the system), **ask the user** with a short, concrete question — do not guess or pick a popular default.

## When in doubt

Ask. A small clarification is better than shipping an invented design that will not match NarrativeCo.
