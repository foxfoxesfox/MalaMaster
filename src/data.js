// Prices: S$ per 100g, averaged from listed Singapore stall prices (see PRODUCT.md).
// Piece weights are estimates: no source publishes them. Edit freely.
export const FLAT_RATE = 2.6

export const TIERS = [
  { id: 'veg', name: 'Vegetables', short: 'Veg', rate: 1.35 },
  { id: 'mush', name: 'Mushrooms', short: 'Mush', rate: 2.1 },
  { id: 'tofu', name: 'Tofu & balls', short: 'Tofu', rate: 2.6 },
  { id: 'meat', name: 'Meat', short: 'Meat', rate: 2.95 },
  { id: 'prem', name: 'Premium', short: 'Prem', rate: 3.6 },
]

// unit: what one drag picks up
export const INGREDIENTS = [
  { id: 'lotus', tier: 'veg', name: 'Lotus root', unit: 'slice', g: 15 },
  { id: 'potato', tier: 'veg', name: 'Potato', unit: 'slice', g: 12 },
  { id: 'bokchoy', tier: 'veg', name: 'Bok choy', unit: 'leaf', g: 25 },
  { id: 'broccoli', tier: 'veg', name: 'Broccoli', unit: 'floret', g: 18 },
  { id: 'cabbage', tier: 'veg', name: 'Cabbage', unit: 'leaf', g: 30 },
  { id: 'lettuce', tier: 'veg', name: 'Lettuce', unit: 'leaf', g: 15 },
  { id: 'sprouts', tier: 'veg', name: 'Beansprouts', unit: 'pinch', g: 40 },
  { id: 'corn', tier: 'veg', name: 'Corn', unit: 'chunk', g: 35 },

  { id: 'enoki', tier: 'mush', name: 'Enoki', unit: 'clump', g: 30 },
  { id: 'shimeji', tier: 'mush', name: 'Shimeji', unit: 'clump', g: 20 },
  { id: 'woodear', tier: 'mush', name: 'Wood ear', unit: 'piece', g: 8 },
  { id: 'shiitake', tier: 'mush', name: 'Shiitake', unit: 'cap', g: 15 },
  { id: 'kingoyster', tier: 'mush', name: 'King oyster', unit: 'slice', g: 12 },

  { id: 'fishball', tier: 'tofu', name: 'Fish ball', unit: 'ball', g: 12 },
  { id: 'cuttleball', tier: 'tofu', name: 'Cuttlefish ball', unit: 'ball', g: 14 },
  { id: 'taupok', tier: 'tofu', name: 'Tau pok', unit: 'piece', g: 10 },
  { id: 'yuba', tier: 'tofu', name: 'Beancurd skin', unit: 'roll', g: 15 },
  { id: 'fishtofu', tier: 'tofu', name: 'Fish tofu', unit: 'piece', g: 20 },
  { id: 'quail', tier: 'tofu', name: 'Quail egg', unit: 'egg', g: 10 },
  { id: 'glassnoodle', tier: 'tofu', name: 'Glass noodles', unit: 'bundle', g: 30 },
  { id: 'instant', tier: 'tofu', name: 'Instant noodles', unit: 'block', g: 60 },

  { id: 'porkbelly', tier: 'meat', name: 'Pork belly', unit: 'slice', g: 10 },
  { id: 'chicken', tier: 'meat', name: 'Chicken', unit: 'chunk', g: 15 },
  { id: 'luncheon', tier: 'meat', name: 'Luncheon meat', unit: 'slice', g: 12 },
  { id: 'sausage', tier: 'meat', name: 'Sausage', unit: 'piece', g: 20 },
  { id: 'bacon', tier: 'meat', name: 'Bacon', unit: 'slice', g: 10 },

  { id: 'beef', tier: 'prem', name: 'Beef', unit: 'slice', g: 10 },
  { id: 'mutton', tier: 'prem', name: 'Mutton', unit: 'slice', g: 10 },
  { id: 'prawn', tier: 'prem', name: 'Prawn', unit: 'prawn', g: 18 },
  { id: 'squid', tier: 'prem', name: 'Squid', unit: 'ring', g: 8 },
  { id: 'crabstick', tier: 'prem', name: 'Crab stick', unit: 'stick', g: 15 },
]

export const BY_ID = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i]))
const RATE = Object.fromEntries(TIERS.map((t) => [t.id, t.rate]))

// basket: { [ingredientId]: count }
export function totals(basket, pricing) {
  let grams = 0
  let price = 0
  for (const [id, n] of Object.entries(basket)) {
    const ing = BY_ID[id]
    const g = ing.g * n
    grams += g
    price += (g / 100) * (pricing === 'flat' ? FLAT_RATE : RATE[ing.tier])
  }
  return { grams, price: Math.round(price * 100) / 100 }
}

// 0-100 for one order. Weight accuracy is the core; budget and "no X" rules cost points.
export function scoreOrder(order, basket) {
  const { grams, price } = totals(basket, order.pricing)
  if (grams === 0) return { score: 0, grams, price, verdict: 'Empty', overBudget: false, broke: false }
  const errPct = (Math.abs(grams - order.grams) / order.grams) * 100
  let score = 100 - errPct * 2
  const overBudget = price > order.budget
  if (overBudget) score -= 30
  const broke = order.avoid ? Object.keys(basket).some((id) => basket[id] > 0 && BY_ID[id].tier === order.avoid) : false
  if (broke) score -= 40
  score = Math.max(0, Math.round(score))
  const verdict = errPct <= 5 ? 'Spot on' : grams > order.grams ? 'Over' : 'Under'
  return { score, grams, price, verdict, overBudget, broke }
}

const CUSTOMERS = ['Wei Ling', 'Jun Hao', 'Priya', 'Marcus', 'Siew Mei', 'Darren', 'Aisha', 'Kai', 'Bee Hoon', 'Ravi']

export const ROUND_LENGTH = 5

// rand is injectable so the self-check can be deterministic
export function makeOrder(rand = Math.random) {
  const pick = (a) => a[Math.floor(rand() * a.length)]
  const grams = 300 + Math.round((rand() * 400) / 10) * 10 // 300-700g
  const pricing = rand() < 0.5 ? 'tiered' : 'flat'
  // budget leaves 10-40% headroom over the flat-rate cost of the target
  const budget = Math.ceil((grams / 100) * FLAT_RATE * (1.1 + rand() * 0.3))
  const avoid = rand() < 0.4 ? pick(['meat', 'prem', 'mush']) : null
  return { customer: pick(CUSTOMERS), grams, budget, pricing, avoid }
}
