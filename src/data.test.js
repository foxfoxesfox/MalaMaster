import { test } from 'node:test'
import assert from 'node:assert/strict'
import { totals, scoreOrder, makeOrder } from './data.js'

test('tiered vs flat pricing', () => {
  const basket = { lotus: 4, beef: 5 } // 60g veg + 50g beef
  assert.deepEqual(totals(basket, 'tiered'), { grams: 110, price: 2.61 }) // 0.81 + 1.80
  assert.deepEqual(totals(basket, 'flat'), { grams: 110, price: 2.86 })
})

test('scoring', () => {
  const order = { grams: 120, budget: 10, pricing: 'flat', avoid: null }
  assert.equal(scoreOrder(order, { lotus: 8 }).score, 100) // 120g exactly
  assert.equal(scoreOrder(order, { lotus: 8 }).verdict, 'Spot on')
  assert.equal(scoreOrder(order, { lotus: 4 }).verdict, 'Under')
  assert.equal(scoreOrder({ ...order, avoid: 'prem' }, { lotus: 7, crabstick: 1 }).score, 60)
  assert.equal(scoreOrder({ ...order, budget: 1 }, { lotus: 8 }).score, 70)
  assert.equal(scoreOrder(order, {}).score, 0)
})

test('orders stay in range', () => {
  for (let i = 0; i < 200; i++) {
    const o = makeOrder()
    assert.ok(o.grams >= 300 && o.grams <= 700)
    assert.ok(o.budget > (o.grams / 100) * 2.6)
  }
})
