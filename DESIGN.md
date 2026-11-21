---
name: MalaMaster
description: A mala stall in your pocket: drag pieces from steel trays into a red plastic basket and watch grams and S$ climb.
colors:
  chili: "#b3201c"
  chili-deep: "#8e1714"
  basket: "#c8262c"
  basket-slot: "#a51e23"
  amber: "#ffb000"
  cream: "#fff4e0"
  cream-2: "#f6e6c8"
  chip-white: "#ffffff"
  ink: "#231a17"
  ink-2: "#5a4a44"
  steel-hi: "#dfe2e4"
  steel-lo: "#b4babd"
  ok: "#2f7a3a"
  tier-veg: "#4f8a3a"
  tier-mush: "#8a6a45"
  tier-tofu: "#d9a21b"
  tier-meat: "#c4553a"
  tier-prem: "#6b3fa0"
typography:
  display:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "clamp(56px, 18vw, 76px)"
    fontWeight: 850
    lineHeight: 0.95
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 850
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 750
  body:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  label:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
rounded:
  swatch: "2px"
  piece: "6px"
  chip: "8px"
  tray: "10px"
  basket: "18px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "16px"
components:
  button:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "9px 18px"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "9px 18px"
  button-primary-on-basket:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
  button-big:
    padding: "14px"
    width: "100%"
  mode-pill:
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "0 11px"
    height: "44px"
  mode-pill-pressed:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
  strip-cell:
    backgroundColor: "{colors.chip-white}"
    textColor: "{colors.ink}"
    padding: "6px 2px"
    height: "56px"
  strip-cell-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
  flat-note:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.amber}"
    padding: "6px"
  ingredient-chip:
    backgroundColor: "{colors.chip-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.chip}"
    padding: "12px 12px 11px"
    height: "64px"
  chip-count:
    backgroundColor: "{colors.chili}"
    textColor: "{colors.chip-white}"
    rounded: "{rounded.pill}"
    padding: "1px 7px"
  basket-piece:
    backgroundColor: "{colors.chip-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.piece}"
    padding: "0 11px"
    height: "40px"
  text-input:
    backgroundColor: "{colors.chip-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.chip}"
    padding: "8px 10px"
---

# Design System: MalaMaster

## Overview

**Creative North Star: "The Stall Counter"**

The interface is the self-serve mala stall itself: a chili-red signboard overhead, a laminated price board ruled in ink, brushed steel trays of white ingredient pieces, and a red perforated plastic basket docked at the bottom where you drop what you pick. Every surface stands in for a physical object at the counter, and the running weight and price are the loudest thing on the screen because learning them is the point.

Density is compact and phone-first: a single column capped at 480px, full device height, one hand. One heavy grotesk carries everything, from the monumental gram readout to the 12px price cells, always with tabular numerals so totals never jitter as they climb. Depth is physical, not decorative: chips sit on the tray with a soft lift, the dragged piece lifts higher, the basket casts upward onto the tray above it.

**Key Characteristics:**
- Chili-red signboard header holding mode pills and the live grams / S$ readout.
- Ink-ruled white price strip, one cell per tier, each keyed by a tier swatch; the cells are also the tray tabs.
- Steel-gradient tray with inset bevel under a one-line tray heading, holding white chips you drag or tap.
- Red perforated plastic basket dock (rounded slots punched in darker red) as the drop target.
- Archivo Variable at 600 to 900, tabular numerals app-wide.
- Pills for every toggle and button; small radii for physical pieces.

## Colors

A warm stall palette: chili red and turmeric amber on laminated cream, with near-black ink rules and cool brushed steel as the only cool note.

### Primary
- **Chili Oil Red** (chili): the signboard header ground, the count badge on chips, the result stamp when off-target, error text, the #1 rank disc.
- **Deep Chili** (chili-deep): the recessed track behind the header's mode and pricing pills.
- **Plastic Basket Red** (basket): the basket dock's body; slightly brighter than chili so the dock reads as a separate object.
- **Basket Slot Red** (basket-slot): the rounded perforation slots (8 by 4px, 2px radius, on a staggered 22 by 16px tile) punched into the basket. Used nowhere else.

### Secondary
- **Turmeric Amber** (amber): money and limits. The S$ total in the readout, the order's budget rules line, the over-budget pill text, the flat-rate bar's text, the basket's drop-target ring, and text selection.

### Tertiary
- **Tier swatches** (tier-veg, tier-mush, tier-tofu, tier-meat, tier-prem): one colour per ingredient tier, used only as 10px swatches in the price strip, basket pieces and the drag ghost. Applied through a `data-tier` attribute that sets a local `--c`.
- **Stamp Green** (ok): the result stamp when the bowl is spot on.

### Neutral
- **Laminated Cream** (cream): the app ground, header text, primary-button text, the pressed pill.
- **Aged Cream** (cream-2): the page outside the 480px column and the hairline dividers in result facts, recap and the board.
- **Chip White** (chip-white): ingredient chips, the price strip, basket pieces, the drag ghost, the name-entry card, and text on the basket.
- **Ink** (ink): body text, all rules and outlines, the primary button, the selected price-strip cell, the flat-rate bar, rank discs.
- **Faded Ink** (ink-2): secondary text (chip piece weight, muted lines, fact labels, recap detail lines).
- **Steel** (steel-hi to steel-lo): the tray's top-to-bottom gradient. Nothing else is steel.

### Named Rules
**The Amber Is Money Rule.** Amber marks prices, budgets and limits, and the basket's "drop here" ring. It is never a general highlight.

**The Swatch-Only Tier Rule.** Tier colours appear only as small swatches next to a tier's name. They never fill chips, cells or text.

## Typography

**Display Font:** Archivo Variable (with system-ui, sans-serif)
**Body Font:** Archivo Variable
**Label/Mono Font:** Archivo Variable, tabular numerals

**Character:** One heavy grotesk, pushed to 850 for numbers and headings and kept at 600 to 800 for controls, like stall signage that's painted on and then laminated.

### Hierarchy
- **Display** (850, clamp(56px, 18vw, 76px), 0.95, -0.03em): the live gram readout. The order target uses the same voice at clamp(48px, 15vw, 64px), and the score at 64px. Units sit in a `small` at 0.35 to 0.4em.
- **Headline** (850, 28px, -0.02em, balanced wrap): panel titles (Top 10, Round total, the Orders intro).
- **Money** (800, 30px, amber): the S$ total next to the gram readout.
- **Title** (750, 15 to 19px): ingredient chip names (16px), the tray heading (15px), the order chit's amber rules line (19px, which is large enough to count as large text on chili).
- **Body** (400, 16px, 1.5): panel paragraphs, max 65ch.
- **Label** (600 to 800, 12 to 15px): pills (14px / 600; pricing pills 13px), price cells (12px / 600, rate 15px bold), the flat-rate bar (14px / 750), buttons (15px / 800; big 17px), recap detail lines (14px, ink-2).
- **Signboard** (850, clamp(15px, 4.4vw, 18px), uppercase, 0.01em): the MalaMaster wordmark only.
- **Stamp** (900, 30px, uppercase): the result verdict only.

### Named Rules
**The Tabular Rule.** Tabular numerals are on for the whole app, so climbing totals never shift sideways.

## Layout

A single column capped at 480px and centered, filling `100dvh`, in a fixed vertical stack: signboard header, price strip, a scrolling middle (trays or a panel), and the basket dock pinned at the bottom (min 132px, max 34dvh, scrolls on its own, padded for the safe area). The price strip doubles as the tray picker, so there is no separate tab row. Gutters are 16px. Gaps run in a tight 6 / 8 / 10 / 12px rhythm, and panels open up to 22px padding with 14px gaps. Touch targets are at least 44px tall for mode and pricing pills, the budget input and the Empty link, 56px for strip cells and 40px for basket pieces. The tray is an auto-fill grid of chips at least 140px wide with 8px gaps.

## Elevation & Depth

A hybrid. Ink rules and borders give structure (the price strip, tabs, buttons, inputs). Soft, layered, ink-tinted shadows show physical lift, and the steel tray uses an inset bevel instead of a drop shadow.

### Shadow Vocabulary
- **Chip lift** (`0 1px 1px rgba(35,26,23,0.12), 0 4px 10px rgba(35,26,23,0.1)`): chips resting on the tray, and the name-entry card.
- **Held piece** (`0 2px 4px rgba(35,26,23,0.15), 0 14px 28px rgba(35,26,23,0.22)`): the drag ghost only.
- **Tray bevel** (`inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -2px 4px rgba(0,0,0,0.12)`): the steel tray.
- **Basket cast** (`0 -6px 18px rgba(35,26,23,0.18)`): the dock casts upward over the content above. When it is a live drop target it adds a 3px amber inset ring and rises 4px.

### Named Rules
**The Lift Means Held Rule.** The deeper shadow belongs to a piece in the hand. Resting things get chip lift or nothing.

## Shapes

Pills (999px) for everything you toggle or press in the header and for buttons: mode and pricing pills, buttons, count badges, the over-budget pill. Small, near-square radii for physical objects: swatches 2px, basket pieces 6px, chips, ghost, inputs and stamp 8px, tray and entry card 10px. The basket dock is the one large curve (18px top corners, square bottom) because it is docked to the screen edge. The price strip is the square exception: its cells are flat ruled boxes with no radius. Borders are ink at 1px (strip cells) and 2px (buttons, inputs, strip base). The stamp uses a 4px currentColor border, rotated -5deg.

## Components

### Buttons
- **Shape:** full pill (999px), 2px ink border.
- **Default:** cream with ink text, 9px 18px padding, 15px / 800.
- **Primary:** ink fill with cream text. Inside the basket it flips to cream fill with a cream border.
- **Big:** full width, 14px padding, 17px. Used for panel actions.
- **Press:** `scale(0.96)` on `:active` over 100ms ease-smooth-out. Disabled is 45% opacity with no press.
- **Link:** on the basket only. White underlined text with a 3px offset ("Empty"), 44px tall, same 0.96 press.

### Chips
- **Ingredient chip:** a white piece on the tray, 8px radius, chip-lift shadow, min 64px tall. Name is 16px / 750 with the piece weight below in faded ink. A chili count pill sits top right once the item is in the basket. Grab cursor, 0.96 press.
- **Basket piece:** a white 6px tag, 40px tall, with a tier swatch, the name and a bold ×count. Tapping it removes one.

### Navigation
- **Mode pills:** a deep-chili track inside the signboard, 44px tall. Unpressed pills show cream text, and the pressed one fills cream with ink text. The colour change takes 150ms, and the 0.96 press applies. The pricing segment uses the same pattern with 13px text.
- **Tray tabs:** the price strip cells (see Price Strip). There is no separate tab row.

### Inputs / Fields
- **Budget input:** borderless cream field, 8px radius, 44px tall, set in the signboard.
- **Name input:** 2px ink border, 8px radius, white, inside the name-entry card.
- **Focus:** a 2px ink outline offset by 2px, which turns cream inside the header. The caret is chili.

### Price Strip (signature)
A white bar with a 2px ink base rule and 1px ink rules between cells, and also the tablist that picks the tray. Each cell is a 56px button stacking a tier swatch, the short tier name and a bold rate. The selected cell fills ink with cream text (150ms), cells press to 0.96, the arrow keys move between them, and the focus ring sits inset by 4px. At a flat-rate stall an ink bar above the strip reads the single rate in 14px / 750 amber, and the cells drop their rates.

### Steel Tray (signature)
A 10px-radius panel with a steel-hi to steel-lo vertical gradient and an inset bevel, holding the chip grid. Above it, a 15px / 750 heading names the tier and its rate per 100g.

### Drag Ghost (signature)
A white 8px tag, no border, with a tier swatch (drawn before the text) followed by the name and piece weight. It follows the finger at scale 1.06 with the held-piece shadow. If you drop it outside the basket, it springs back to its chip with a critically damped spring (damping 1, response 0.35s) that picks up the release velocity. Under reduced motion it just disappears.

### Basket Dock (signature)
Basket red punched with a staggered pattern of rounded basket-slot perforations, with white text. While a piece is held over it, it rises 4px and shows the amber ring. On a drop it plays a 180ms `thud` that settles down from 3px.

### Readout and Order Chit
In the signboard. Practice shows the monumental grams with the amber S$ total, then the pricing segment, the budget input and a "left" figure that turns into an ink pill with amber text when over budget. Orders swaps in the chit: who and which order, the target grams in display type, the rules line in 19px / 750 amber and a short hint.

### Result Stamp
A rotated (-5deg) uppercase verdict in a 4px-bordered box. Chili when off-target, green when spot on. It lands with a 220ms keyframe from scale 1.25 and opacity 0. Below it, a fact list with cream-2 hairlines and the score in display type. The round total's recap uses the same hairline rows: customer name in bold and the verdict, a 14px ink-2 line with weight and price against the target, and the score on the right at 18px.

### Top 10 List
Rows with cream-2 hairline dividers. Each has a 28px ink rank disc (chili for #1), the name in 700 and the score at 18px, pushed right.

## Do's and Don'ts

### Do:
- **Do** keep tabular numerals on every number, and units in a `small` at 0.35 to 0.4em.
- **Do** use pills for header toggles and buttons, square ruled cells for the price strip, and 2 to 10px radii for physical pieces.
- **Do** set pressed and selected states as an ink/cream swap: cream on chili-deep, ink on cream.
- **Do** start press feedback at `scale(0.96)` over 100ms with `--ease-smooth-out` on everything you press (chips, pieces, buttons, pills, strip cells, the Empty link), and take state colour changes at 150ms.
- **Do** keep touch targets at least 44px tall for controls (40px for basket pieces).
- **Do** tint shadows with ink (rgba(35,26,23,…)), not pure black, except inside the steel bevel.
- **Do** keep tap-to-add next to drag on every chip.

### Don't:
- **Don't** use amber for anything other than money, limits and the drop-target ring.
- **Don't** fill surfaces or text with tier colours. They are swatches only.
- **Don't** give resting elements the held-piece shadow.
- **Don't** use steel anywhere but the tray.
- **Don't** add a second typeface. Archivo Variable carries every role.
