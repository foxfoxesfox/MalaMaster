import { useEffect, useMemo, useRef, useState } from 'react'
import { TIERS, INGREDIENTS, BY_ID, FLAT_RATE, ROUND_LENGTH, totals, scoreOrder, makeOrder } from './data.js'
import { boardReady, getTop, submitScore, qualifies } from './leaderboard.js'

const money = (n) => `S$${n.toFixed(2)}`
const TIER_NAME = Object.fromEntries(TIERS.map((t) => [t.id, t.name]))
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  const [mode, setMode] = useState('practice')
  const [baskets, setBaskets] = useState({ practice: {}, orders: {} })
  const [pricing, setPricing] = useState('tiered')
  const [budget, setBudget] = useState(12)
  const [tier, setTier] = useState('veg')
  const [game, setGame] = useState(null)
  const ghostRef = useRef(null)
  const basketRef = useRef(null)

  const which = mode === 'orders' ? 'orders' : 'practice'
  const basket = baskets[which]
  const setBasket = (fn) => setBaskets((b) => ({ ...b, [which]: fn(b[which]) }))
  const add = (id) => setBasket((b) => ({ ...b, [id]: (b[id] || 0) + 1 }))
  const remove = (id) =>
    setBasket((b) => {
      const n = { ...b, [id]: b[id] - 1 }
      if (n[id] <= 0) delete n[id]
      return n
    })

  const order = game?.orders[game.i]
  const activePricing = mode === 'orders' && order ? order.pricing : pricing
  const { grams, price } = totals(basket, activePricing)

  const drag = useDragApi(ghostRef, basketRef)

  const startRound = () => {
    setBaskets((b) => ({ ...b, orders: {} }))
    setGame({ orders: Array.from({ length: ROUND_LENGTH }, () => makeOrder()), i: 0, results: [], phase: 'picking' })
  }
  const serve = () => setGame((g) => ({ ...g, phase: 'result', results: [...g.results, scoreOrder(order, basket)] }))
  const next = () => {
    setBaskets((b) => ({ ...b, orders: {} }))
    setGame((g) => (g.i + 1 >= ROUND_LENGTH ? { ...g, phase: 'done' } : { ...g, i: g.i + 1, phase: 'picking' }))
  }

  const picking = mode === 'practice' || game?.phase === 'picking'

  return (
    <div className="app">
      <header className="hd">
        <div className="hd-bar">
          <b className="logo">MalaMaster</b>
          <nav className="modes" aria-label="Mode">
            {[['practice', 'Practice'], ['orders', 'Orders'], ['board', 'Top 10']].map(([id, label]) => (
              <button key={id} aria-pressed={mode === id} onClick={() => setMode(id)}>
                {label}
              </button>
            ))}
          </nav>
        </div>
        {mode === 'practice' && (
          <PracticeReadout {...{ grams, price, budget, setBudget, pricing, setPricing }} />
        )}
        {mode === 'orders' && game && game.phase !== 'done' && <OrderChit order={order} i={game.i} />}
      </header>

      {picking && <PriceStrip pricing={activePricing} tier={tier} setTier={setTier} />}

      <main className="main">
        {mode === 'board' && <Board />}
        {mode === 'orders' && !game && <OrdersIntro onStart={startRound} />}
        {mode === 'orders' && game?.phase === 'result' && (
          <Result order={order} result={game.results[game.i]} last={game.i + 1 >= ROUND_LENGTH} onNext={next} />
        )}
        {mode === 'orders' && game?.phase === 'done' && (
          <RoundDone orders={game.orders} results={game.results} onAgain={startRound} onBoard={() => setMode('board')} />
        )}
        {picking && <Stall tier={tier} pricing={activePricing} basket={basket} onAdd={add} drag={drag} />}
      </main>

      {picking && (
        <Basket basketRef={basketRef} basket={basket} onRemove={remove} onClear={() => setBasket(() => ({}))}>
          {mode === 'orders' && (
            <button className="btn primary" disabled={grams === 0} onClick={serve}>
              Serve
            </button>
          )}
        </Basket>
      )}
      <div ref={ghostRef} className="ghost" hidden aria-hidden="true" />
    </div>
  )
}

function PracticeReadout({ grams, price, budget, setBudget, pricing, setPricing }) {
  const left = budget - price
  return (
    <>
      <div className="readout" aria-live="polite">
        <span className="w">
          {grams}
          <small>g</small>
        </span>
        <span className="p">{money(price)}</span>
      </div>
      <div className="hd-sub">
        <div className="seg" role="group" aria-label="Pricing">
          <button aria-pressed={pricing === 'tiered'} onClick={() => setPricing('tiered')}>
            By tier
          </button>
          <button aria-pressed={pricing === 'flat'} onClick={() => setPricing('flat')}>
            Flat rate
          </button>
        </div>
        <label className="budget">
          Budget S$
          <input
            type="number"
            inputMode="decimal"
            min="1"
            max="100"
            value={budget}
            onChange={(e) => setBudget(Math.max(0, Number(e.target.value) || 0))}
          />
        </label>
        <span className={left < 0 ? 'left over' : 'left'}>{left < 0 ? `${money(-left)} over` : `${money(left)} left`}</span>
      </div>
    </>
  )
}

function OrderChit({ order, i }) {
  return (
    <div className="chit">
      <p className="chit-who">
        Order {i + 1} of {ROUND_LENGTH} · {order.customer}
      </p>
      <p className="chit-target">
        About {order.grams}
        <small>g</small>
      </p>
      <p className="chit-rules">
        Under {money(order.budget)} · {order.pricing === 'flat' ? 'Flat-rate stall' : 'Priced by tier'}
        {order.avoid && <> · No {TIER_NAME[order.avoid].toLowerCase()}</>}
      </p>
      <p className="chit-hint">The scale is hidden. Go by eye.</p>
    </div>
  )
}

// The laminated price board doubles as the tray picker.
function PriceStrip({ pricing, tier, setTier }) {
  const keys = (e) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
    if (!d) return
    const i = (TIERS.findIndex((t) => t.id === tier) + d + TIERS.length) % TIERS.length
    setTier(TIERS[i].id)
    e.currentTarget.querySelectorAll('[role=tab]')[i].focus()
  }
  return (
    <div className="board-wrap">
      {pricing === 'flat' && <p className="flat-note">Flat rate: everything {money(FLAT_RATE)} / 100g</p>}
      <div className="strip" role="tablist" aria-label="Ingredient trays, price per 100g" onKeyDown={keys}>
        {TIERS.map((t) => (
          <button
            key={t.id}
            role="tab"
            className="cell"
            aria-selected={tier === t.id}
            tabIndex={tier === t.id ? 0 : -1}
            onClick={() => setTier(t.id)}
          >
            <i className="sw" data-tier={t.id} />
            {t.short}
            {pricing !== 'flat' && <b>{t.rate.toFixed(2)}</b>}
          </button>
        ))}
      </div>
    </div>
  )
}

// One tray at a time, not stacked trays: chips use touch-action: none so they can be dragged, which would trap page scrolling.
function Stall({ tier, pricing, basket, onAdd, drag }) {
  const items = INGREDIENTS.filter((i) => i.tier === tier)
  const t = TIERS.find((x) => x.id === tier)
  return (
    <section className="stall">
      <h2 className="tray-head">
        {t.name} · {money(pricing === 'flat' ? FLAT_RATE : t.rate)}/100g
      </h2>
      <div className="tray" role="tabpanel" aria-label={t.name}>
        {items.map((ing) => (
          <Chip key={ing.id} ing={ing} count={basket[ing.id] || 0} onAdd={onAdd} drag={drag} />
        ))}
      </div>
    </section>
  )
}

function Chip({ ing, count, onAdd, drag }) {
  const s = useRef(null)
  const swallowClick = useRef(false)

  const down = (e) => {
    if (e.button !== 0) return
    swallowClick.current = false
    e.currentTarget.setPointerCapture(e.pointerId)
    const r = e.currentTarget.getBoundingClientRect()
    s.current = {
      x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, t: performance.now(), vx: 0, vy: 0,
      dragging: false, home: { x: r.left + r.width / 2, y: r.top + r.height / 2 },
    }
  }
  const move = (e) => {
    const d = s.current
    if (!d) return
    if (!d.dragging && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) {
      d.dragging = true
      drag.start(ing, e.clientX, e.clientY)
    }
    if (!d.dragging) return
    const now = performance.now()
    const dt = Math.max(8, now - d.t) / 1000
    d.vx = (e.clientX - d.lx) / dt
    d.vy = (e.clientY - d.ly) / dt
    Object.assign(d, { lx: e.clientX, ly: e.clientY, t: now })
    drag.move(e.clientX, e.clientY)
  }
  const up = (e) => {
    const d = s.current
    s.current = null
    if (!d?.dragging) return
    swallowClick.current = true
    if (drag.end(e.clientX, e.clientY, d.vx, d.vy, d.home, e.type === 'pointercancel')) onAdd(ing.id)
  }
  const click = () => {
    if (swallowClick.current) return void (swallowClick.current = false)
    onAdd(ing.id)
  }

  return (
    <button
      className="chip"
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onClick={click}
      aria-label={`Add one ${ing.unit} of ${ing.name}, about ${ing.g} grams${count ? `, ${count} in basket` : ''}`}
    >
      <span className="chip-name">{ing.name}</span>
      <span className="chip-wt">
        ~{ing.g}g {ing.unit}
      </span>
      {count > 0 && <span className="chip-ct">×{count}</span>}
    </button>
  )
}

// The ghost follows the finger outside React; releasing outside the basket springs it home.
function useDragApi(ghostRef, basketRef) {
  return useMemo(() => {
    const place = (x, y) => (ghostRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(1.06)`)
    const inBasket = (x, y) => {
      const r = basketRef.current?.getBoundingClientRect()
      return r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
    }
    return {
      start(ing, x, y) {
        const g = ghostRef.current
        g.textContent = `${ing.name} · ${ing.g}g`
        g.dataset.tier = ing.tier
        g.hidden = false
        place(x, y)
      },
      move(x, y) {
        place(x, y)
        basketRef.current?.classList.toggle('hot', inBasket(x, y))
      },
      end(x, y, vx, vy, home, cancelled) {
        const g = ghostRef.current
        const b = basketRef.current
        b?.classList.remove('hot')
        if (!cancelled && inBasket(x, y)) {
          g.hidden = true
          b.classList.remove('thud')
          void b.offsetWidth // restart the animation
          b.classList.add('thud')
          return true
        }
        if (reducedMotion()) return void (g.hidden = true)
        // critically damped spring (damping 1, response 0.35s) with the release velocity handed off
        const w = (2 * Math.PI) / 0.35
        const ax = x - home.x, ay = y - home.y
        const cap = (v) => Math.max(-2500, Math.min(2500, v)) // a wild flick shouldn't fling it off screen
        const bx = cap(vx) + w * ax, by = cap(vy) + w * ay
        const t0 = performance.now()
        const step = (now) => {
          const t = (now - t0) / 1000
          const k = Math.exp(-w * t)
          const px = home.x + (ax + bx * t) * k
          const py = home.y + (ay + by * t) * k
          if (t > 0.8 || Math.hypot(px - home.x, py - home.y) < 0.5) return void (g.hidden = true)
          place(px, py)
          requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        return false
      },
    }
  }, [ghostRef, basketRef])
}

function Basket({ basketRef, basket, onRemove, onClear, children }) {
  const items = Object.entries(basket)
  const pieces = items.reduce((a, [, n]) => a + n, 0)
  return (
    <section ref={basketRef} className="basket" aria-label="Your basket">
      <div className="basket-head">
        <b>Basket</b>
        <span className="basket-count">{pieces} {pieces === 1 ? 'piece' : 'pieces'}</span>
        {pieces > 0 && (
          <button className="link" onClick={onClear}>
            Empty
          </button>
        )}
        {children}
      </div>
      {items.length === 0 ? (
        <p className="basket-empty">Drag ingredients here, or tap one to add it.</p>
      ) : (
        <ul className="pieces">
          {items.map(([id, n]) => (
            <li key={id}>
              <button onClick={() => onRemove(id)} aria-label={`Remove one ${BY_ID[id].name}`}>
                <i className="sw" data-tier={BY_ID[id].tier} />
                {BY_ID[id].name} <b>×{n}</b>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function OrdersIntro({ onStart }) {
  return (
    <section className="panel">
      <h1>Five customers, no scale</h1>
      <p>
        Each customer wants a bowl of a certain weight, under a budget. Some stalls price by tier, some charge one flat
        rate. Some customers skip a whole tier.
      </p>
      <p>You won't see the weight until you serve. Within 5% scores full marks; going over budget or breaking a rule costs points.</p>
      <button className="btn primary big" onClick={onStart}>
        Start a round
      </button>
    </section>
  )
}

function Result({ order, result, last, onNext }) {
  const diff = result.grams - order.grams
  return (
    <section className="panel result">
      <p className={`stamp ${result.verdict === 'Spot on' ? 'good' : ''}`}>{result.verdict}</p>
      <dl className="facts">
        <div>
          <dt>Weight</dt>
          <dd>
            {result.grams}g <span>of {order.grams}g ({diff >= 0 ? '+' : ''}{diff}g)</span>
          </dd>
        </div>
        <div>
          <dt>Price</dt>
          <dd className={result.overBudget ? 'bad' : ''}>
            {money(result.price)} <span>budget {money(order.budget)}</span>
          </dd>
        </div>
        {result.broke && (
          <div>
            <dt>Rule</dt>
            <dd className="bad">Had {TIER_NAME[order.avoid].toLowerCase()} in it</dd>
          </div>
        )}
      </dl>
      <p className="score">
        {result.score}
        <small>/100</small>
      </p>
      <button className="btn primary big" onClick={onNext}>
        {last ? 'See your total' : 'Next customer'}
      </button>
    </section>
  )
}

function RoundDone({ orders, results, onAgain, onBoard }) {
  const total = results.reduce((a, r) => a + r.score, 0)
  const [top, setTop] = useState(null)
  const [err, setErr] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (boardReady) getTop().then(setTop, (e) => setErr(e.message))
  }, [])

  const rank = top && qualifies(top, total) ? top.filter((r) => r.score >= total).length + 1 : 0
  const submit = (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    submitScore(name.trim(), total).then(onBoard, (e) => {
      setErr(e.message)
      setBusy(false)
    })
  }

  return (
    <section className="panel">
      <h1>Round total</h1>
      <p className="score">
        {total}
        <small>/{ROUND_LENGTH * 100}</small>
      </p>
      <ol className="recap">
        {results.map((r, i) => (
          <li key={i}>
            <span className="recap-who">
              <b>{orders[i].customer}</b> · {r.verdict}
              <small>
                {r.grams}g of {orders[i].grams}g · {money(r.price)} of {money(orders[i].budget)}
                {r.broke && ` · had ${TIER_NAME[orders[i].avoid].toLowerCase()}`}
              </small>
            </span>
            <b>{r.score}</b>
          </li>
        ))}
      </ol>
      {rank > 0 && (
        <form className="enter" onSubmit={submit}>
          <label htmlFor="name">That's #{rank} on the board. Your name?</label>
          <div className="enter-row">
            <input id="name" maxLength={16} required autoFocus value={name} onChange={(e) => setName(e.target.value)} />
            <button className="btn primary" disabled={busy || !name.trim()}>
              {busy ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      )}
      {top && rank === 0 && <p className="muted">Not quite top 10 this time.</p>}
      {err && <p className="error" role="alert">{err}</p>}
      <button className="btn big" onClick={onAgain}>
        Play again
      </button>
    </section>
  )
}

function Board() {
  const [top, setTop] = useState(null)
  const [err, setErr] = useState(boardReady ? '' : 'The leaderboard is not connected yet.')
  useEffect(() => {
    if (boardReady) getTop().then(setTop, (e) => setErr(e.message))
  }, [])
  return (
    <section className="panel">
      <h1>Top 10</h1>
      {err && <p className="error" role="alert">{err}</p>}
      {!err && !top && <p className="muted">Loading…</p>}
      {top?.length === 0 && <p className="muted">No scores yet. Play a round of Orders to claim #1.</p>}
      {top?.length > 0 && (
        <ol className="board">
          {top.map((r, i) => (
            <li key={r.id}>
              <span className="rank">{i + 1}</span>
              <span className="who">{r.name}</span>
              <b>{r.score}</b>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
