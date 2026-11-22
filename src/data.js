// Prices: S$ per 100g, averaged from listed Singapore stall prices (see PRODUCT.md).
export const FLAT_RATE = 2.6
// Some stalls don't weigh everything. Rice is a separate S$0.50 line in one Singapore review;
// noodles at a fixed price per piece is an estimate (no source found).
export const RICE_PRICE = 0.5
export const NOODLE_PRICE = 1.0
// A Hot Hideout's scrambled egg topping, charged separately (Eatbook, 2024).
export const EGG_PRICE = 1.5

export const TIERS = [
  { id: 'veg', name: 'Vegetables', short: 'Veg', rate: 1.35 },
  { id: 'mush', name: 'Mushrooms', short: 'Mush', rate: 2.1 },
  { id: 'tofu', name: 'Tofu & balls', short: 'Tofu', rate: 2.6 },
  // no stall source lists a noodle rate; priced like tofu & balls
  { id: 'carb', name: 'Noodles & carbs', short: 'Noodle', rate: 2.6 },
  { id: 'meat', name: 'Meat', short: 'Meat', rate: 2.95 },
  { id: 'prem', name: 'Beef & seafood', short: 'Beef/Sea', rate: 3.6 },
]

// unit: what one grab of the tongs picks up. g: typical weight. v: how much one grab varies (0.2 = ±20%).
// Factory-made items (noodle blocks, crab sticks, balls, eggs) barely vary; leaves and handfuls vary a lot.
// Sourced (see README): stalls hand out enoki as a whole bundle, like supermarket packs (100–300g; 100g here);
// crab stick 14–18g on brand labels; quail egg ~10g whole; instant noodle pack 70–79g incl. sachet.
// Everything else is an estimate. Edit freely.
// Baseline (hh: true) is A Hot Hideout's line-up as named in reviews (Eatbook 2024, Seth Lui, Hui Xin):
// lotus root, potato, cabbage, spinach, enoki, tofu skin, cheese tofu, luncheon meat, pork belly, sausage,
// chicken, prawn, cuttlefish, dory fish, rice cake, instant/spinach/sweet potato noodles, scrambled egg.
// Everything else is an additional common Singapore stall ingredient.
export const INGREDIENTS = [
  { id: 'lotus', tier: 'veg', name: 'Lotus root', unit: 'slice', g: 15, v: 0.2, hh: true },
  { id: 'potato', tier: 'veg', name: 'Potato', unit: 'slice', g: 12, v: 0.2, hh: true },
  { id: 'cabbage', tier: 'veg', name: 'Cabbage', unit: 'leaf', g: 30, v: 0.3, hh: true },
  { id: 'spinach', tier: 'veg', name: 'Spinach', unit: 'tong-ful', g: 30, v: 0.3, hh: true },
  { id: 'bokchoy', tier: 'veg', name: 'Bok choy', unit: 'leaf', g: 25, v: 0.3 },
  { id: 'broccoli', tier: 'veg', name: 'Broccoli', unit: 'floret', g: 18, v: 0.3 },
  { id: 'lettuce', tier: 'veg', name: 'Lettuce', unit: 'leaf', g: 15, v: 0.3 },
  { id: 'sprouts', tier: 'veg', name: 'Beansprouts', unit: 'tong-ful', g: 40, v: 0.35 },
  { id: 'corn', tier: 'veg', name: 'Corn', unit: 'chunk', g: 35, v: 0.15 },
  { id: 'eggplant', tier: 'veg', name: 'Eggplant', unit: 'chunk', g: 20, v: 0.2 },

  { id: 'enoki', tier: 'mush', name: 'Enoki', unit: 'bundle', g: 100, v: 0.05, hh: true },
  { id: 'shimeji', tier: 'mush', name: 'Shimeji', unit: 'clump', g: 25, v: 0.25 },
  { id: 'woodear', tier: 'mush', name: 'Wood ear', unit: 'piece', g: 8, v: 0.3 },
  { id: 'shiitake', tier: 'mush', name: 'Shiitake', unit: 'cap', g: 15, v: 0.2 },
  { id: 'kingoyster', tier: 'mush', name: 'King oyster', unit: 'slice', g: 12, v: 0.2 },

  { id: 'yuba', tier: 'tofu', name: 'Tofu skin', unit: 'roll', g: 15, v: 0.2, hh: true },
  { id: 'cheesetofu', tier: 'tofu', name: 'Cheese tofu', unit: 'piece', g: 15, v: 0.08, hh: true },
  { id: 'fishball', tier: 'tofu', name: 'Fish ball', unit: 'ball', g: 12, v: 0.08 },
  { id: 'cuttleball', tier: 'tofu', name: 'Cuttlefish ball', unit: 'ball', g: 14, v: 0.08 },
  { id: 'taupok', tier: 'tofu', name: 'Tau pok', unit: 'piece', g: 10, v: 0.15 },
  { id: 'fishtofu', tier: 'tofu', name: 'Fish tofu', unit: 'piece', g: 20, v: 0.08 },
  { id: 'quail', tier: 'tofu', name: 'Quail egg', unit: 'egg', g: 10, v: 0.08 },

  { id: 'instant', tier: 'carb', name: 'Instant noodles', unit: 'block', g: 65, v: 0.03, noodle: true, hh: true },
  { id: 'spinachnoodle', tier: 'carb', name: 'Spinach noodles', unit: 'bundle', g: 50, v: 0.15, noodle: true, hh: true },
  { id: 'sweetpotatonoodle', tier: 'carb', name: 'Sweet potato noodles', unit: 'bundle', g: 50, v: 0.15, noodle: true, hh: true },
  { id: 'ricecake', tier: 'carb', name: 'Rice cake', unit: 'slice', g: 10, v: 0.1, hh: true },
  { id: 'glassnoodle', tier: 'carb', name: 'Glass noodles', unit: 'bundle', g: 30, v: 0.2, noodle: true },

  { id: 'luncheon', tier: 'meat', name: 'Luncheon meat', unit: 'slice', g: 12, v: 0.1, hh: true },
  { id: 'porkbelly', tier: 'meat', name: 'Pork belly', unit: 'slice', g: 10, v: 0.25, hh: true },
  { id: 'sausage', tier: 'meat', name: 'Sausage', unit: 'piece', g: 20, v: 0.1, hh: true },
  { id: 'chicken', tier: 'meat', name: 'Chicken', unit: 'chunk', g: 15, v: 0.25, hh: true },
  { id: 'porkslice', tier: 'meat', name: 'Pork slices', unit: 'slice', g: 10, v: 0.25 },
  { id: 'bacon', tier: 'meat', name: 'Bacon', unit: 'slice', g: 10, v: 0.2 },

  { id: 'prawn', tier: 'prem', name: 'Prawn', unit: 'prawn', g: 18, v: 0.2, hh: true },
  { id: 'cuttlefish', tier: 'prem', name: 'Cuttlefish', unit: 'piece', g: 12, v: 0.2, hh: true },
  { id: 'dory', tier: 'prem', name: 'Dory fish', unit: 'chunk', g: 20, v: 0.2, hh: true },
  { id: 'beef', tier: 'prem', name: 'Beef', unit: 'slice', g: 10, v: 0.25 },
  { id: 'mutton', tier: 'prem', name: 'Mutton', unit: 'slice', g: 10, v: 0.25 },
  { id: 'squid', tier: 'prem', name: 'Squid', unit: 'ring', g: 8, v: 0.2 },
  { id: 'crabstick', tier: 'prem', name: 'Crab stick', unit: 'stick', g: 16, v: 0.08 },
]

// What's in one tray, Hot Hideout's baseline first.
export const trayItems = (tier) => INGREDIENTS.filter((i) => i.tier === tier)

export const BY_ID = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i]))
const RATE = Object.fromEntries(TIERS.map((t) => [t.id, t.rate]))
const rateOf = (id, pricing) => (pricing === 'flat' ? FLAT_RATE : RATE[BY_ID[id].tier])

// The weight of one grab: the typical weight, nudged up or down within the ingredient's spread.
export function pickWeight(id, rand = Math.random) {
  const { g, v } = BY_ID[id]
  return Math.max(1, Math.round(g * (1 + (rand() * 2 - 1) * v)))
}

// stall: { pricing: 'tiered'|'flat', noodlesFixed?: bool, rice?: number, egg?: number }
// A fixed-price item is taken out before weighing, so it adds to the price but not to the scale.
export const isFixed = (id, stall) => !!stall.noodlesFixed && !!BY_ID[id].noodle

// pieces: [{ id, g }] — every grab keeps its own weight
export function totals(pieces, stall) {
  let grams = 0
  let price = (stall.rice || 0) * RICE_PRICE + (stall.egg || 0) * EGG_PRICE
  for (const p of pieces) {
    if (isFixed(p.id, stall)) {
      price += NOODLE_PRICE
      continue
    }
    grams += p.g
    price += (p.g / 100) * rateOf(p.id, stall.pricing)
  }
  return { grams, price: Math.round(price * 100) / 100 }
}

// Receipt lines: one per ingredient, in the order first picked; fixed-price lines carry no weight.
export function lineItems(pieces, stall) {
  const lines = new Map()
  for (const p of pieces) {
    const l = lines.get(p.id) || { name: BY_ID[p.id].name, n: 0, grams: 0 }
    l.n += 1
    l.grams += p.g
    lines.set(p.id, l)
  }
  const out = [...lines].map(([id, l]) =>
    isFixed(id, stall)
      ? { ...l, grams: null, price: l.n * NOODLE_PRICE }
      : { ...l, price: Math.round(l.grams * rateOf(id, stall.pricing)) / 100 },
  )
  if (stall.rice > 0) out.push({ name: 'Rice', n: stall.rice, grams: null, price: stall.rice * RICE_PRICE })
  if (stall.egg > 0) out.push({ name: 'Scrambled egg', n: stall.egg, grams: null, price: stall.egg * EGG_PRICE })
  return out
}

// A shift is a race: serve as many bowls as you can in SHIFT_SECONDS.
export const SHIFT_SECONDS = 60

// Points for one bowl in a shift:
// +10 for serving it, plus accuracy (100 within 3% of the target, minus 4 per extra 1% off, 0 from 28% off),
// plus a streak bonus (+10, +20, +30… for each bowl in a row within 5%), minus 25 if over budget.
// Breaking a "no X" rule earns only the 10 for serving. Rushing pays only if the bowls stay close.
export function scoreBowl(order, pieces, streak = 0) {
  const { grams, price } = totals(pieces, order)
  const err = grams ? (Math.abs(grams - order.grams) / order.grams) * 100 : 100
  const accuracy = err <= 3 ? 100 : Math.max(0, Math.round(100 - (err - 3) * 4))
  const overBudget = price > order.budget
  const broke = !!order.avoid && pieces.some((p) => BY_ID[p.id].tier === order.avoid)
  const streakAfter = !broke && err <= 5 ? streak + 1 : 0
  const bonus = streakAfter > 1 ? (streakAfter - 1) * 10 : 0
  const points = !grams ? 0 : broke ? 10 : Math.max(0, 10 + accuracy + bonus - (overBudget ? 25 : 0))
  const verdict = broke
    ? 'Rule broken'
    : err <= 5
      ? 'Spot on'
      : err <= 12
        ? 'Close'
        : grams > order.grams
          ? 'Too much'
          : 'Too little'
  return { points, grams, price, err, accuracy, bonus, verdict, overBudget, broke, streak: streakAfter }
}

const CUSTOMERS = ['Wei Ling', 'Jun Hao', 'Priya', 'Marcus', 'Siew Mei', 'Darren', 'Aisha', 'Kai', 'Bee Hoon', 'Ravi']

// Deterministic pseudo-random in [0,1) for stable 3D layouts.
export const rnd = (s) => {
  const x = Math.sin(s * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

// Where the n-th piece lands in the basket (basket-local), so the pile grows in layers.
export function pilePose(n) {
  const r = 0.92 * Math.sqrt(rnd(n * 3 + 1))
  const a = rnd(n * 3 + 2) * Math.PI * 2
  return {
    pos: [Math.cos(a) * r, 0.12 + Math.min(0.55, Math.floor(n / 8) * 0.08) + rnd(n) * 0.04, Math.sin(a) * r],
    rot: [(rnd(n + 7) - 0.5) * 0.6, rnd(n + 9) * Math.PI * 2, (rnd(n + 11) - 0.5) * 0.6],
  }
}

// The next customer in a shift: never the same person twice in a row.
export function nextOrder(prev, rand = Math.random) {
  const pool = CUSTOMERS.filter((c) => c !== prev?.customer)
  return { ...makeOrder(rand), customer: pool[Math.floor(rand() * pool.length)] }
}

// S$ per 100g of the weighed food only; rice, egg and per-pack noodles would skew it.
export function weighedPer100(pieces, stall) {
  const { grams, price } = totals(pieces.filter((p) => !isFixed(p.id, stall)), { pricing: stall.pricing })
  return grams ? (price / grams) * 100 : null
}

// rand is injectable so the self-check can be deterministic
export function makeOrder(rand = Math.random) {
  const pick = (a) => a[Math.floor(rand() * a.length)]
  const grams = 250 + Math.round((rand() * 350) / 10) * 10 // 250-600g: quick bowls for a timed shift
  const pricing = rand() < 0.5 ? 'tiered' : 'flat'
  // budget leaves 10-40% headroom over the flat-rate cost of the target
  const budget = Math.ceil((grams / 100) * FLAT_RATE * (1.1 + rand() * 0.3))
  const avoid = rand() < 0.4 ? pick(['meat', 'prem', 'mush']) : null
  const noodlesFixed = rand() < 0.35
  // some want rice or scrambled egg, sometimes two; it comes out of the same budget
  const rice = rand() < 0.3 ? (rand() < 0.3 ? 2 : 1) : 0
  const egg = rand() < 0.25 ? (rand() < 0.3 ? 2 : 1) : 0
  const extra = Math.ceil(rice * RICE_PRICE + egg * EGG_PRICE)
  return { customer: pick(CUSTOMERS), grams, budget: budget + extra, pricing, avoid, noodlesFixed, rice, egg }
}
