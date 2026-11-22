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

test('shift scoring: line by line against an itemized order', () => {
  const order = { items: [{ id: 'lotus', grams: 60 }, { id: 'beef', grams: 40 }], pricing: 'tiered' }
  const exact = scoreBowl(order, [...P('lotus', 15, 4), ...P('beef', 10, 4)])
  assert.deepEqual([exact.points, exact.accuracy, exact.verdict, exact.streak], [110, 100, 'Spot on', 1])
  assert.equal(scoreBowl(order, [...P('lotus', 15, 4), ...P('beef', 10, 4)], 2).points, 130) // third in a row: +20
  // lotus right, beef missing entirely: lotus 100 x 60 + beef 0 x 40 → 60
  const half = scoreBowl(order, P('lotus', 15, 4), 3)
  assert.deepEqual([half.accuracy, half.points, half.streak, half.verdict], [60, 70, 0, 'Off'])
  // 20% light on lotus (48g): 100 - (20 - 10) x 2 = 80 on that line → (80 x 60 + 100 x 40) / 100 = 88
  assert.equal(scoreBowl(order, [{ id: 'lotus', g: 48 }, ...P('beef', 10, 4)]).accuracy, 88)
  // 20g of something not ordered on a 100g order costs 20
  const extra = scoreBowl(order, [...P('lotus', 15, 4), ...P('beef', 10, 4), ...P('corn', 20, 1)])
  assert.deepEqual([extra.accuracy, extra.extra], [80, 20])
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

test('orders are 3 to 5 different items, each a sensible weight in 10g steps', () => {
  for (let i = 0; i < 300; i++) {
    const o = makeOrder()
    assert.ok(o.items.length >= 3 && o.items.length <= 5)
    assert.equal(new Set(o.items.map((it) => it.id)).size, o.items.length)
    for (const it of o.items) assert.ok(it.grams % 10 === 0 && it.grams >= 10 && it.grams <= 200, `${it.id} ${it.grams}`)
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
