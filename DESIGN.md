---
name: MalaMaster
description: A mala stall in your pocket: pick pieces from steel bins with tongs, drop them in a red plastic basket on the scale, and check out with a printed receipt.
colors:
  chili: "#b3201c"
  chili-deep: "#8e1714"
  amber: "#ffb000"
  basket: "#c8262c"
  basket-slot: "#7d1418"
  basket-floor: "#a51e23"
  cream: "#fff4e0"
  cream-2: "#f6e6c8"
  tag-white: "#ffffff"
  ink: "#231a17"
  ink-2: "#5a4a44"
  counter-steel: "#d8dcde"
  bin-steel: "#c9cdd0"
  tong-steel: "#c3c8cc"
  lcd-glass: "#b9d3a4"
  lcd-ink: "#1f3318"
  printer-body: "#2a2320"
  led-ready: "#6fd07a"
  paper: "#fbfaf6"
  paper-ink: "#26211e"
  paper-dim: "#6f6762"
  paper-note: "#f1eee6"
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
    fontSize: "19px"
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
  receipt:
    fontFamily: "ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.45
  lcd:
    fontFamily: "ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1
rounded:
  swatch: "2px"
  tag: "3px"
  lcd: "4px"
  stamp: "6px"
  field: "8px"
  card: "10px"
  printer: "16px"
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
  button-primary-on-bar:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    height: "44px"
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
    backgroundColor: "{colors.tag-white}"
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
  bin-label:
    backgroundColor: "{colors.tag-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tag}"
    padding: "3px 6px"
  scale-lcd:
    backgroundColor: "{colors.lcd-glass}"
    textColor: "{colors.lcd-ink}"
    typography: "{typography.lcd}"
    rounded: "{rounded.lcd}"
    padding: "5px 10px"
  action-bar:
    backgroundColor: "{colors.chili}"
    textColor: "{colors.cream}"
    padding: "10px 16px"
  printer:
    backgroundColor: "{colors.printer-body}"
    textColor: "{colors.cream}"
    rounded: "{rounded.printer}"
    padding: "14px 16px 18px"
    width: "340px"
  receipt-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    typography: "{typography.receipt}"
    padding: "20px 16px 22px"
    width: "308px"
  text-input:
    backgroundColor: "{colors.tag-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "8px 10px"
---

# Design System: MalaMaster

## Overview

**Creative North Star: "The Stall Counter"**

The interface is the self-serve mala stall itself. A chili-red signboard hangs overhead. Below it sits a real 3D counter: one long stepped steel shelf holding every ingredient in sections, each under a hanging coloured price sign, with a clip-on tag on every bin, a pair of red-gripped tongs, and a red perforated plastic basket on a steel scale with a green LCD. Checking out prints a thermal receipt. Every surface stands in for a physical object at the counter. The running weight and price stay the loudest thing in the DOM, because learning them is the point.

The DOM chrome is compact and phone-first: a single column (480px, widening to 760px on large screens), full device height, one hand. Archivo Variable carries every interface role with tabular numerals. The only other type is system monospace, and only on machine-made surfaces: the scale LCD and the receipt. Depth comes from the 3D scene's light and contact shadows. The DOM stays mostly flat, apart from the tags and the printer that sit on top of the scene.

**Key Characteristics:**
- Chili-red signboard header holding mode pills and the live grams / S$ readout.
- One long stepped shelf you walk along (swipe, wheel, or the shelf map), with hanging section signs and clip-on bin tags.
- A 3D steel counter: bins with white DOM price tags, tongs that follow the pointer, a perforated red basket on a scale with a green LCD.
- Low-poly, flat-shaded ingredients drawn at 1.3x, falling onto the pile under gravity with no bounce.
- A chili action bar with the piece count, an Empty basket link and a cream checkout button.
- A dark receipt printer that feeds monospace paper with a torn zigzag edge and a rubber stamp.

## Colors

A warm stall palette: chili red and turmeric amber on laminated cream, with near-black ink rules, cool brushed steel for the counter, and the off-white paper and green LCD of the stall's machines.

### Primary
- **Chili Oil Red** (chili): the signboard header, the action bar, the tongs' rubber grips, the receipt stamp when off-target, error text, the #1 rank disc.
- **Deep Chili** (chili-deep): the recessed track behind the header's mode and pricing pills.
- **Plastic Basket Red** (basket): the basket wall and its rim; slightly brighter than chili so the basket reads as its own object.
- **Basket Slot Red** (basket-slot): the rounded perforation slots punched into the basket wall.
- **Basket Floor Red** (basket-floor): the basket's solid floor disc.

### Secondary
- **Turmeric Amber** (amber): money and limits. The S$ total in the readout, the order's rules line, the over-budget pill text, the flat-rate bar's text, the printer's working LED, and text selection.

### Tertiary
- **Tier swatches** (tier-veg, tier-mush, tier-tofu, tier-meat, tier-prem): one colour per ingredient tier, used for section signs, the shelf map segments and the 3px top edge of each bin tag. Applied through a `data-tier` attribute that sets a local `--c`.
- **Stamp Green** (ok): the receipt stamp when the bowl is spot on or in budget.
- **Ready Green** (led-ready): the printer LED once the receipt is ready to take.

### Neutral
- **Laminated Cream** (cream): the app ground, header and action-bar text, the pressed pill, the action-bar button.
- **Aged Cream** (cream-2): the page outside the column and the hairline dividers in the recap and the board.
- **Tag White** (tag-white): the price strip, bin price tags, and the name-entry card and input.
- **Ink** (ink): body text, all rules and outlines, the primary button, the selected strip cell, the flat-rate bar, rank discs.
- **Faded Ink** (ink-2): secondary text (bin-tag weights, muted lines, recap details, the loading placeholder).
- **Counter Steel** (counter-steel): the 3D counter surface and the background of the lazy-load placeholder.
- **Bin Steel** (bin-steel): bins and the scale platform (metalness 0.35, roughness 0.35). Bin walls lighten to #e4e7e9 while the pointer is over them.
- **Tong Steel** (tong-steel): the tong arms, paddles and hinge ring (metalness 0.7, roughness 0.22).
- **LCD Glass / LCD Ink** (lcd-glass, lcd-ink): the scale readout only.
- **Printer Body** (printer-body): the receipt printer's housing. Its paper slot is darker still (#0d0a09).
- **Paper / Paper Ink / Paper Dim / Paper Note** (paper, paper-ink, paper-dim, paper-note): the receipt sheet, its print, its secondary print, and the boxed note. Dashed rules print in #8c8480.

### Named Rules
**The Amber Is Money Rule.** Amber marks prices, budgets and limits, plus the printer's working LED. It is never a general highlight.

**The Swatch-Only Tier Rule.** Tier colours appear only as small swatches next to a tier's name. They never fill cells or text. The 3D ingredients carry their own food colours instead.

**The Machine Palette Rule.** LCD green and receipt paper belong to the stall's machines (scale and printer). They never become UI surfaces.

## Typography

**Display Font:** Archivo Variable (with system-ui, sans-serif)
**Body Font:** Archivo Variable
**Label/Mono Font:** Archivo Variable with tabular numerals for UI; system monospace (ui-monospace, SF Mono, Menlo) for machine output only.

**Character:** One heavy grotesk, pushed to 850 for numbers and headings and kept at 600 to 800 for controls, like stall signage that's painted on and then laminated. The machines print in plain monospace.

### Hierarchy
- **Display** (850, clamp(56px, 18vw, 76px), 0.95, -0.03em): the live gram readout. The order target uses the same voice at clamp(48px, 15vw, 64px), and the round score at 64px. Units sit in a `small` at 0.35 to 0.4em.
- **Headline** (850, 28px, -0.02em, balanced wrap): panel titles (Top 10, Round total, the Orders intro).
- **Money** (800, 30px, amber): the S$ total next to the gram readout.
- **Title** (750, 19px): the order chit's amber rules line, sized to count as large text on chili.
- **Body** (400, 16px, 1.5): panel paragraphs, max 65ch.
- **Label** (600 to 800, 11 to 15px): pills (14px / 600; pricing pills 13px), price cells (12px / 600, rate 15px bold), the flat-rate bar (14px / 750), bin tags (11px; name 800, weight 650 in ink-2), the Empty basket link (14px / 600), buttons (15px / 800; big 17px), recap details (14px, ink-2).
- **Signboard** (850, clamp(15px, 4.4vw, 18px), uppercase, 0.01em): the MalaMaster wordmark only.
- **LCD** (system mono, 700, 15px): the scale readout ("480 g", or "– – – g" when the scale is hidden).
- **Receipt** (system mono, 500, 13px, 1.45): the receipt body. The brand line is 18px / 800 with 0.12em tracking, strong total rows are 15px / 800, and the note is 12px. The receipt stamp is Archivo at 900, 20px, uppercase.

### Named Rules
**The Tabular Rule.** Tabular numerals are on for the whole app, so climbing totals never shift sideways.

**The Machine Type Rule.** Monospace appears only where a machine prints it: the scale LCD and the receipt. Everything a person reads as UI is Archivo.

## Layout

A single centered column, `--col` wide (480px, or 760px from a 900px viewport), filling `100dvh`, in a fixed vertical stack: the signboard header, the 3D stage (flex, at least 320px), the shelf map, and the action bar pinned at the bottom with safe-area padding. The shelf map sits just above the action bar so it's in thumb reach on a phone. From 900px wide the column becomes a two-column grid up to 1200px: the signboard turns into a 360px left rail (logo, full-width mode tabs, readout, controls or the order chit) and the stall, shelf map and action bar take the rest of the screen.

While the 3D canvas boots, a counter-steel cover reads "Setting up the stall…". The first three drops that miss the basket get a short ink pill over the scale, "Let go over the red basket to drop it in", which fades in and out over 1.8s.

The Orders intro ("60-second shift") fills the screen top to bottom: title and one-line promise, an example chit in the same chili red as the real one, three numbered steps (pick by eye, serve fast, stay close) in ink discs, and Start at the bottom within thumb reach. The shelf sits at the back and the basket on its scale at the front. The camera uses the narrowest field of view that keeps the whole stall in frame, so the counter always fills the stage. The 3D code is lazy-loaded behind a "Setting up the stall…" placeholder in counter steel.

Gutters are 16px. Gaps run in a tight 6 / 8 / 10 / 12px rhythm, and panels open up to 22px padding with 14px gaps. Touch targets are at least 44px tall for pills, the budget input, the Empty basket link and the action-bar button, and 56px for strip cells. The receipt opens as a scrim over the column only (same `--col`), with the printer at most 340px wide and the paper at most 308px.

## Elevation & Depth

A hybrid. In the DOM, ink rules and borders give structure (buttons, inputs, bin tags), and shadows are rare. The 3D scene supplies the real depth: ambient light plus two directional lights, soft contact shadows under everything (opacity 0.35, blur 2.4), and real geometry for bins, basket and tongs.

### Shadow Vocabulary
- **Card lift** (`0 1px 1px rgba(35,26,23,0.12), 0 4px 10px rgba(35,26,23,0.1)`): the name-entry card.
- **Tag lift** (`0 1px 2px rgba(35,26,23,0.2)`): bin price tags pinned over the scene.
- **LCD bezel** (`inset 0 1px 2px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.5)`): the recessed scale display.
- **Printer** (`0 2px 4px rgba(0,0,0,0.3), 0 16px 32px rgba(0,0,0,0.35)`): the printer housing floating over the scrim.
- **Scrim** (rgba(35,26,23,0.55)): dims the column behind the receipt.

### Named Rules
**The Scene Owns Depth Rule.** Physical depth lives in the 3D scene's light and contact shadows. DOM shadows stay small and are used only on objects laid over the scene (tags, LCD, printer, entry card).

## Shapes

Pills (999px) for everything you toggle or press in the chrome: mode and pricing pills, buttons, the over-budget pill. Small, near-square radii for printed or mounted objects: swatches 2px, bin tags 3px, LCD 4px, receipt stamp 6px, inputs 8px, entry card 10px, printer 16px. Borders are ink at 1px (bin tags) and 2px (buttons, inputs). Stamps use a currentColor border and a slight counter-clockwise rotation. The receipt ends in an 8px zigzag torn edge cut with a CSS mask. In 3D, bins are open steel boxes, the scale platform is a rounded box, and the basket is a flared, perforated cylinder with a torus rim.

## Components

### Buttons
- **Shape:** full pill (999px), 2px ink border.
- **Default:** cream with ink text, 9px 18px padding, 15px / 800.
- **Primary:** ink fill with cream text. On the action bar it flips to cream fill with a cream border, 44px tall.
- **Big:** full width, 14px padding, 17px. Used for panel actions and the receipt's tear-off button.
- **Press:** `scale(0.96)` on `:active` over 100ms ease-smooth-out. Disabled is 45% opacity with no press. The receipt button stays invisible until printing finishes.
- **Link:** underlined, inheriting the text colour, with a 3px offset, 44px tall and the same 0.96 press ("Empty basket").

### Navigation
- **Mode pills:** a deep-chili track inside the signboard, 44px tall. Unpressed pills show cream text, and the pressed one fills cream with ink text. The colour change takes 150ms, and the 0.96 press applies. The pricing segment uses the same pattern with 13px text.
- **Shelf map:** walks the shelf to a section (see Shelf, Signs and Shelf Map).

### Inputs / Fields
- **Budget input:** borderless cream field, 8px radius, 44px tall, set in the signboard.
- **Name input:** 2px ink border, 8px radius, white, inside the name-entry card.
- **Focus:** a 2px ink outline offset by 2px, which turns cream inside the header. The caret is chili.

### Shelf, Signs and Shelf Map (signature)
- **Shelf:** 3 rows deep and 14 columns long, each row stepped 0.32 higher than the one in front, on steel risers with a back panel. Ingredients fill it column by column in tier order (veg, mushrooms, tofu & balls, noodles & carbs, meat, beef & seafood), so each section runs along its length.
- **Walking:** the camera frames about 5 columns on a phone and more on wider screens. Pressing anywhere that isn't a bin or piece and dragging sideways walks along the shelf; the wheel or trackpad does the same. The basket slides with you, so it is always in front. You start at the vegetable end.
- **Section signs:** a coloured sign hangs over each section with its name (uppercase, 10px, 850) and its price per 100g (or "Flat rate", or "Noodles S$1 each"). A section the order bans turns ink and reads "No …".
- **Bin tags:** white clip-on tags with a 3px top edge in the tier colour, the name in 800 and the typical grab weight in ink-2. The price lives on the section sign, not the tag.
- **Shelf map:** a 50px ink bar between the stall and the action bar, one coloured segment per section sized by its bin count, with a cream outline window showing what's in view. Tapping a segment walks there. A banned section is hatched and struck through.

### 3D Stall (signature)
- **Counter and bins:** a counter-steel surface holding open bin-steel boxes, each with six randomly placed copies of one ingredient. The whole bin is the grab target, so small pieces are easy to hit, and its walls lighten while the pointer is over it.
- **Bin price tags:** white DOM tags (1px ink border, 3px radius, tag lift) pinned to each bin's front lip every frame. Each shows the name in 800 and the piece weight in ink-2.
- **Ingredients:** low-poly, flat-shaded primitives (discs, leaves, stalks, balls, slabs, layered strips, rolls, rings) in food colours, drawn at 1.3x so they read on a phone. No external models.
- **Basket on the scale:** a basket-red wall textured with rounded basket-slot perforations, a basket-floor disc and a torus rim, standing on a rounded bin-steel platform. While a held piece is over it, the basket widens to 1.04x (damped).
- **Scale LCD:** a DOM label pinned in front of the scale, lcd-ink on lcd-glass with an inset bezel. It shows grams in Practice and "– – – g" in Orders.
- **Tongs:** tong-steel arms with chili rubber grips and a hinge ring, laid across the screen so the jaws read from above. With a mouse they follow the pointer, eased with a factor of 28. On touch they stay hidden until a grab. The jaws close with damping while holding.
- **Pick and drop:** grab a bin to pick a piece. A held piece hangs just under the jaws with a slight sway (±0.04 rad). Released over the basket, it falls under gravity onto its spot in the pile, damping into place with no bounce. Released anywhere else, it springs back to its bin along a short arc (critically damped, at most 0.9s). Tapping a bin adds one. Grabbing a piece in the basket takes it out.
- **Keyboard and screen readers:** a visually hidden list of "Add one…" buttons per ingredient, plus "Take the last piece out". It appears as a white panel at the top left once it has focus.

### Extras Counters
Rice and scrambled egg are pill-shaped − n + counters in the Practice header, side by side on one phone row. Each button is a 44px-tall tap area drawn as a small chili-deep disc around a stroked plus or minus icon, so the pair fits a 390px row without shrinking the target. "New bowl" resets both to zero.

### Action Bar
A chili strip under the stage with cream text. From left to right: the piece count (700), the "Empty basket" link once there are pieces, and the cream "Check out" (Practice) or "Serve" (Orders) button pushed to the right. The button is disabled while the basket is empty.

### Receipt Printer (signature)
- **Scrim:** ink at 55% over the column only, fading in over 200ms. The receipt is a modal dialog.
- **Printer:** a printer-body housing (16px radius, printer shadow) with a status line ("Weighing your bowl…", then "Printing your receipt", then "Take your receipt") and an LED that is amber while working and ready-green when done. A dark paper slot runs along its bottom edge.
- **Paper:** paper-coloured, set in 13px system mono, feeding out of the slot in 16 steps over 1.9s, after a 650ms weighing pause. The bottom edge is a torn zigzag. In order: the centered MALAMASTER brand line, the heading and customer, the receipt number and time in paper-dim, a dashed rule, item lines (name and ×count, grams, price), another dashed rule, total rows (strong rows in 800), the rubber stamp, a note box on paper-note, a decorative barcode built from the receipt number, and "THANK YOU · COME AGAIN".
- **Stamp:** Archivo 900, 20px, uppercase, 3px currentColor border, 6px radius, rotated -4deg at 85% opacity. Chili when off-target or over budget, ok-green when spot on or in budget.
- **Action:** a full-width primary pill under the paper ("New bowl", "Next customer", "See your total"). It gets focus once printing is done.
- **Reduced motion:** the paper is shown in place right away, with no weighing pause or feed.

### Shift Clock and Score Pop-up
In Orders the signboard shows the shift: an m:ss clock (22px, 850, amber in the last 10 seconds), points and bowls served, the streak once it passes 1, and a 4px amber bar that drains left to right. Below it sits the current customer's chit. Each serve shows an ink pop-up over the stall for about a second: the points in 44px amber (green when spot on, red when a rule was broken) and a line with the verdict, % off, streak bonus and over-budget note. The shift ends in a long printed shift receipt, one line per bowl (customer, weight against target, points).

### Round Recap and Top 10 List
Rows with cream-2 hairline dividers. Each recap row shows the customer in bold and the verdict, a 14px ink-2 line with weight and price against the target, and the score on the right at 18px. Each Top 10 row has a 28px ink rank disc (chili for #1), the name in 700 and the score at 18px, pushed right. The round total sits above in 64px display type. A white name-entry card (10px radius, card lift) appears when the score makes the board.

## Do's and Don'ts

### Do:
- **Do** keep tabular numerals on every number, and units in a `small` at 0.35 to 0.4em.
- **Do** use pills for chrome toggles and buttons, square ruled segments for the shelf map, and 2 to 16px radii for printed or mounted objects.
- **Do** set pressed and selected states as an ink/cream swap: cream on chili-deep, ink on cream.
- **Do** start press feedback at `scale(0.96)` over 100ms with `--ease-smooth-out` on everything you press, and take state colour changes at 150ms.
- **Do** keep touch targets at least 44px tall for controls (56px for strip cells).
- **Do** pin DOM labels (tags, LCD) to their 3D anchors every frame, rather than drawing text into the scene.
- **Do** keep 3D motion damped and physical: gravity onto the pile, springs back to the bin, no bounce.
- **Do** keep an accessible non-3D path for adding and removing pieces.

### Don't:
- **Don't** use amber for anything other than money, limits and the printer's working LED.
- **Don't** fill surfaces or text with tier colours. They are swatches only.
- **Don't** use monospace outside the scale LCD and the receipt.
- **Don't** use LCD green or receipt paper as UI surfaces.
- **Don't** add heavy DOM shadows. Depth belongs to the 3D scene.
