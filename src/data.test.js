import { test } from 'node:test'
import assert from 'node:assert/strict'
import { totals, lineItems, scoreBowl, makeOrder, nextOrder, weighedPer100, pickWeight, INGREDIENTS, TIERS, trayItems } from './data.js'

const P = (id, g, n = 1) => Array.from({ length: n }, () => ({ id, g }))

test('tiered vs flat pricing', () => {
  const bowl = [...P('lotus', 15, 4), ...P('beef', 10, 5)] // 60g veg + 50g beef
  assert.deepEqual(totals(bowl, { pricing: 'tiered' }), { grams: 110, price: 2.61 }) // 0.81 + 1.80
  assert.deepEqual(totals(bowl, { pricing: 'flat' }), { grams: 110, price: 2.86 })
})

test('receipt lines group by ingredient and keep each grab weight', () => {
  const lines = lineItems([{ id: 'lotus', g: 14 }, { id: 'beef', g: 11 }, { id: 'lotus', g: 17 }], { pricing: 'tiered' })
  assert.deepEqual(lines.map((l) => [l.name, l.n, l.grams]), [['Lotus root', 2, 31], ['Beef', 1, 11]])
})

test('fixed-price noodles and rice skip the scale', () => {
  const bowl = [...P('lotus', 15, 4), ...P('instant', 65, 2)]
  const stall = { pricing: 'flat', noodlesFixed: true, rice: 1 }
  assert.deepEqual(totals(bowl, stall), { grams: 60, price: 4.06 }) // 1.56 + 2 x 1.00 + 0.50
  assert.deepEqual(totals(bowl, { pricing: 'flat' }), { grams: 190, price: 4.94 })
  const lines = lineItems(bowl, stall)
  assert.deepEqual(lines.map((l) => [l.name, l.grams, l.price]), [['Lotus root', 60, 1.56], ['Instant noodles', null, 2], ['Rice', null, 0.5]])
})

test('rice and scrambled egg are fixed add-ons, any number of them', () => {
  assert.deepEqual(totals(P('lotus', 15, 4), { pricing: 'flat', egg: 1 }), { grams: 60, price: 3.06 })
  const many = { pricing: 'flat', rice: 2, egg: 3 }
  assert.deepEqual(totals([], many), { grams: 0, price: 5.5 }) // 2 x 0.50 + 3 x 1.50
  assert.deepEqual(lineItems([], many).map((l) => [l.name, l.n, l.price]), [['Rice', 2, 1], ['Scrambled egg', 3, 4.5]])
})

test('every tray fits the stall (max 10 bins) and ids are unique', () => {
  for (const t of TIERS) assert.ok(trayItems(t.id).length <= 10, t.id)
  assert.equal(new Set(INGREDIENTS.map((i) => i.id)).size, INGREDIENTS.length)
})

test('shift scoring: accuracy, streak, budget, rules', () => {
  const order = { grams: 120, budget: 10, pricing: 'flat', avoid: null }
  const exact = scoreBowl(order, P('lotus', 15, 8)) // 120g
  assert.deepEqual([exact.points, exact.verdict, exact.streak], [110, 'Spot on', 1])
  assert.equal(scoreBowl(order, P('lotus', 15, 8), 1).points, 120) // second in a row: +10
  assert.equal(scoreBowl(order, P('lotus', 15, 8), 3).points, 140) // fourth in a row: +30
  const off = scoreBowl(order, P('lotus', 15, 6), 2) // 90g, 25% under
  assert.deepEqual([off.points, off.verdict, off.streak], [10 + 12, 'Too little', 0])
  assert.equal(scoreBowl(order, P('lotus', 15, 4)).points, 10) // 50% off: just the serve
  assert.equal(scoreBowl({ ...order, budget: 1 }, P('lotus', 15, 8)).points, 85)
  const broke = scoreBowl({ ...order, avoid: 'prem' }, [...P('lotus', 15, 7), ...P('crabstick', 15)])
  assert.deepEqual([broke.points, broke.verdict, broke.streak], [10, 'Rule broken', 0])
  assert.equal(scoreBowl(order, []).points, 0)
})

test('each grab stays within its ingredient spread', () => {
  for (const ing of INGREDIENTS) {
    for (const r of [0, 0.5, 0.999]) {
      const g = pickWeight(ing.id, () => r)
      assert.ok(g >= Math.floor(ing.g * (1 - ing.v)) && g <= Math.ceil(ing.g * (1 + ing.v)), `${ing.id} ${g}`)
    }
  }
  assert.equal(pickWeight('instant', () => 0.5), 65)
})

test('orders stay in range', () => {
  for (let i = 0; i < 200; i++) {
    const o = makeOrder()
    assert.ok(o.grams >= 250 && o.grams <= 600)
    assert.ok(o.budget > (o.grams / 100) * 2.6)
  }
})

test('the next customer is never the one just served', () => {
  let o = nextOrder(null)
  for (let i = 0; i < 100; i++) {
    const n = nextOrder(o)
    assert.notEqual(n.customer, o.customer)
    o = n
  }
})

test('per-100g ignores rice, egg and per-pack noodles', () => {
  const bowl = [...P('lotus', 15, 4), ...P('instant', 65, 1)]
  assert.equal(weighedPer100(bowl, { pricing: 'tiered', noodlesFixed: true, rice: 2, egg: 1 }), 1.35)
  assert.equal(weighedPer100([], { pricing: 'flat' }), null)
})
