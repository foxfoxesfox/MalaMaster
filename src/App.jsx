import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { TIERS, FLAT_RATE, NOODLE_PRICE, RICE_PRICE, EGG_PRICE, SHIFT_SECONDS, totals, lineItems, scoreBowl, nextOrder, weighedPer100, pilePose, pickWeight } from './data.js'
import { boardReady, getTop, submitScore, qualifies } from './leaderboard.js'
import Receipt from './Receipt.jsx'
import { useCount } from './count.js'

// three.js is big; load it after the first paint
const Stall3D = lazy(() => import('./Stall3D.jsx'))

const money = (n) => `S$${n.toFixed(2)}`
const TIER_NAME = Object.fromEntries(TIERS.map((t) => [t.id, t.name]))

export default function App() {
  const [mode, setMode] = useState('practice')
  const [bowls, setBowls] = useState({ practice: [], orders: [] })
  const [pricing, setPricing] = useState('tiered')
  const [extras, setExtras] = useState({ noodlesFixed: false, rice: 0, egg: 0 })
  const [budget, setBudget] = useState(12)
  const [shift, setShift] = useState(null)
  const [receipt, setReceipt] = useState(null)
  const [weighing, setWeighing] = useState(false)

  const which = mode === 'orders' ? 'orders' : 'practice'
  const pieces = bowls[which]
  const setPieces = (fn) => setBowls((b) => ({ ...b, [which]: fn(b[which]) }))
  const add = (id, from) =>
    setPieces((b) => [...b, { key: crypto.randomUUID(), id, g: pickWeight(id), from, pose: pilePose(b.length) }])
  const remove = (key) => setPieces((b) => b.filter((p) => p.key !== key))

  const order = shift?.order
  const stall = mode === 'orders' && order ? order : { pricing, ...extras }
  const { grams, price } = totals(pieces, stall)

  // The shift clock only runs while you're picking; weighing and the score pop-up are on the house.
  const picking = shift?.phase === 'picking'
  useEffect(() => {
    if (!picking) return
    const t0 = performance.now()
    const start = shift.left
    const id = setInterval(() => {
      const left = Math.max(0, start - (performance.now() - t0) / 1000)
      setShift((s) => (s.phase === 'picking' ? { ...s, left } : s))
    }, 100)
    return () => clearInterval(id)
    // restart the interval only when picking starts or stops, not on every tick
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picking])
  useEffect(() => {
    if (picking && shift.left <= 0) endShift()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picking, shift?.left])

  const startShift = () => {
    setBowls((b) => ({ ...b, orders: [] }))
    setReceipt(null)
    setShift({ order: nextOrder(null), served: [], points: 0, streak: 0, best: 0, left: SHIFT_SECONDS, phase: 'picking', flash: null })
  }

  // Serve → quick weigh → score pop-up → next customer, until the clock runs out.
  const served = () => {
    const r = scoreBowl(order, pieces, shift.streak)
    setShift((s) => ({
      ...s,
      served: [...s.served, { order: s.order, r }],
      points: s.points + r.points,
      streak: r.streak,
      best: Math.max(s.best, r.streak),
      phase: 'flash',
      flash: r,
    }))
    setTimeout(() => {
      setWeighing(false)
      setBowls((b) => ({ ...b, orders: [] }))
      setShift((s) => (s.phase === 'flash' ? { ...s, order: nextOrder(s.order), phase: 'picking', flash: null } : s))
    }, 1100)
  }

  const endShift = () => {
    const s = shift
    const spotOn = s.served.filter((x) => x.r.verdict === 'Spot on').length
    const v = shiftVerdict(s.points, s.served.length)
    setBowls((b) => ({ ...b, orders: [] }))
    setShift({ ...s, phase: 'done' })
    setReceipt({
      heading: 'SHIFT RECEIPT',
      sub: `${SHIFT_SECONDS} SECONDS · ${s.served.length} BOWL${s.served.length === 1 ? '' : 'S'}`,
      firstStatus: "Time's up! Adding up your shift…",
      lines: s.served.map(({ order: o, r }, i) => ({ key: i, name: o.customer, mid: `${r.grams}/${o.grams}g`, right: `+${r.points}` })),
      rows: [
        ['BOWLS SERVED', String(s.served.length)],
        ['SPOT ON (≤5%)', String(spotOn)],
        ['BEST STREAK', String(s.best)],
        ['POINTS', String(s.points), true],
      ],
      stamp: { text: v.stamp, good: s.points >= 300 },
      note: v.note,
      actionLabel: 'See where you rank',
      onAction: () => setReceipt(null),
    })
  }

  const checkout = () => {
    if (mode === 'orders') return served()
    const lines = lineItems(pieces, stall)
    const rate = pricing === 'flat' ? `Flat ${money(FLAT_RATE)}/100g` : 'By tier'
    const r100 = weighedPer100(pieces, stall)
    const left = budget - price
    setReceipt({
      heading: 'PRACTICE BOWL',
      lines,
      rows: [
        ['WEIGHT', `${grams} g`],
        ['PRICING', rate],
        ['TOTAL', money(price), true],
        ['BUDGET', money(budget)],
        [left < 0 ? 'OVER BY' : 'UNDER BY', money(Math.abs(left))],
      ],
      stamp: { text: left < 0 ? 'Over budget' : 'In budget', good: left >= 0 },
      note: r100 ? `The weighed food came to ${money(r100)} per 100g.` : null,
      firstStatus: 'Ringing up your bowl…',
      actionLabel: 'New bowl',
      onAction: () => {
        setReceipt(null)
        setPieces(() => [])
        setExtras((x) => ({ ...x, rice: 0, egg: 0 }))
      },
    })
  }

  const showStall = mode === 'practice' || (mode === 'orders' && shift && (shift.phase !== 'done' || receipt))
  const leaving = (id) => {
    // walking away mid-shift ends it without a score
    if (shift && shift.phase !== 'done' && id !== 'orders') setShift(null)
    setMode(id)
  }

  return (
    <div className="app">
      <header className="hd">
        <div className="hd-bar">
          <b className="logo">MalaMaster</b>
          <nav className="modes" aria-label="Mode">
            {[['practice', 'Practice'], ['orders', 'Orders'], ['board', 'Top 10']].map(([id, label]) => (
              <button key={id} aria-pressed={mode === id} disabled={!!receipt} onClick={() => leaving(id)}>
                {label}
              </button>
            ))}
          </nav>
        </div>
        {mode === 'practice' && (
          <PracticeReadout {...{ grams, price, budget, setBudget, pricing, setPricing, extras, setExtras }} />
        )}
        {mode === 'orders' && shift && shift.phase !== 'done' && <OrderChit order={order} shift={shift} />}
      </header>

      <main className="main">
        {mode === 'board' && <Board />}
        {mode === 'orders' && !shift && <OrdersIntro onStart={startShift} />}
        {mode === 'orders' && shift?.phase === 'done' && !receipt && (
          <RoundDone shift={shift} onAgain={startShift} onBoard={() => leaving('board')} />
        )}
        {showStall && (
          <div className="play">
            <Suspense fallback={<p className="stage stage-loading">Setting up the stall…</p>}>
              <Stall3D
                pieces={pieces}
                onAdd={add}
                onRemove={remove}
                grams={grams}
                pricing={stall.pricing}
                noodlesFixed={!!stall.noodlesFixed}
                avoid={mode === 'orders' ? order?.avoid : null}
                scale={mode === 'practice' ? 'live' : weighing ? 'weigh' : 'none'}
                quick={mode === 'orders'}
                onWeighed={checkout}
              />
            </Suspense>
            {shift?.flash && mode === 'orders' && <ScoreFlash r={shift.flash} />}
            <div className="actions">
              <span className="count" aria-live="polite">
                {weighing ? 'Weighing…' : `${pieces.length} ${pieces.length === 1 ? 'piece' : 'pieces'}`}
              </span>
              {pieces.length > 0 && !weighing && (
                <button className="link" onClick={() => setPieces(() => [])}>
                  Empty basket
                </button>
              )}
              <button
                className="btn primary"
                disabled={pieces.length === 0 || weighing}
                onClick={mode === 'orders' ? () => setWeighing(true) : checkout}
              >
                {mode === 'orders' ? 'Serve' : 'Check out'}
              </button>
            </div>
            {receipt && <Receipt {...receipt} />}
          </div>
        )}
      </main>
    </div>
  )
}

// The score for one bowl pops over the stall for a beat before the next customer.
function ScoreFlash({ r }) {
  return (
    <div className={`flash${r.verdict === 'Spot on' ? ' good' : r.broke ? ' bad' : ''}`} role="status">
      <b>+{r.points}</b>
      <span>
        {r.verdict}
        {!r.broke && ` · ${Math.round(r.err)}% off`}
        {r.bonus > 0 && ` · streak +${r.bonus}`}
        {r.overBudget && ' · over budget'}
      </span>
    </div>
  )
}

// One honest line about how the shift went.
const shiftVerdict = (points, bowls) =>
  points >= 600
    ? { stamp: 'Stall-ready', note: `${bowls} bowls and you kept them close. You can eyeball a bowl.` }
    : points >= 300
      ? { stamp: 'Good shift', note: 'Quick hands. A few bowls drifted; tighten those and the streak bonus adds up.' }
      : points >= 120
        ? { stamp: 'Warming up', note: 'Accuracy pays more than speed here. Try Practice with the scale showing.' }
        : { stamp: 'Rough shift', note: 'Try Practice first: the scale shows you the weight as you go.' }

const fmtG = (v) => String(Math.round(v))

const Icon = ({ d }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
)

// − n + counter for fixed-price extras
function Stepper({ label, each, n, step }) {
  return (
    <div className="stepper" role="group" aria-label={`${label}, ${money(each)} each`}>
      <span>
        {label} <small>{money(each)}</small>
      </span>
      <button aria-label={`One less ${label.toLowerCase()}`} disabled={n === 0} onClick={() => step(-1)}>
        <Icon d="M3 7h8" />
      </button>
      <b aria-live="polite">{n}</b>
      <button aria-label={`One more ${label.toLowerCase()}`} disabled={n >= 9} onClick={() => step(1)}>
        <Icon d="M3 7h8M7 3v8" />
      </button>
    </div>
  )
}

function PracticeReadout({ grams, price, budget, setBudget, pricing, setPricing, extras, setExtras }) {
  const gRef = useCount(grams, fmtG, { duration: 380 })
  const pRef = useCount(price, money, { duration: 380 })
  const left = budget - price
  return (
    <>
      <div className="readout">
        <span className="w" aria-label={`${grams} grams`}>
          <span ref={gRef} />
          <small>g</small>
        </span>
        <span className="p" ref={pRef} aria-label={money(price)} />
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
      <div className="hd-extras" aria-label="Fixed-price extras">
        <Stepper label="Rice" each={RICE_PRICE} n={extras.rice} step={(d) => setExtras((x) => ({ ...x, rice: x.rice + d }))} />
        <Stepper label="Egg" each={EGG_PRICE} n={extras.egg} step={(d) => setExtras((x) => ({ ...x, egg: x.egg + d }))} />
        <button
          className="chip-toggle"
          aria-pressed={extras.noodlesFixed}
          onClick={() => setExtras((x) => ({ ...x, noodlesFixed: !x.noodlesFixed }))}
        >
          Noodles {money(NOODLE_PRICE)} each
        </button>
      </div>
    </>
  )
}

function OrderChit({ order, shift }) {
  const low = shift.left <= 10
  return (
    <div className="chit">
      <div className="shift-bar">
        <span className={low ? 'clock low' : 'clock'} aria-label={`${Math.ceil(shift.left)} seconds left`}>
          {Math.floor(Math.ceil(shift.left) / 60)}:{String(Math.ceil(shift.left) % 60).padStart(2, '0')}
        </span>
        <span>
          <b>{shift.points}</b> pts · {shift.served.length} served
          {shift.streak > 1 && <> · streak ×{shift.streak}</>}
        </span>
      </div>
      <div className="shift-time" style={{ transform: `scaleX(${shift.left / SHIFT_SECONDS})` }} />
      <p className="chit-who">{order.customer} wants</p>
      <p className="chit-target">
        About {order.grams}
        <small>g</small>
      </p>
      <p className="chit-rules">
        Under {money(order.budget)} · {order.pricing === 'flat' ? 'Flat-rate stall' : 'Priced by tier'}
        {order.avoid && <> · No {TIER_NAME[order.avoid].toLowerCase()}</>}
        {order.rice > 0 && <> · {order.rice} rice</>}
        {order.egg > 0 && <> · {order.egg} scrambled egg{order.egg > 1 ? 's' : ''}</>}
      </p>
      {order.noodlesFixed && <p className="chit-hint">Noodles here are {money(NOODLE_PRICE)} each and aren't weighed.</p>}
    </div>
  )
}

function OrdersIntro({ onStart }) {
  return (
    <section className="panel intro">
      <div>
        <h1>60-second shift</h1>
        <p className="muted">Customers keep coming. Build each bowl by eye; the scale only comes out when you serve.</p>
      </div>
      <figure className="sample-chit" aria-label="Example order">
        <figcaption>Example order · Wei Ling</figcaption>
        <p className="sample-target">
          About 450<small>g</small>
        </p>
        <p className="sample-rules">Under S$15.00 · Priced by tier · No meat</p>
      </figure>
      <ol className="how">
        <li>
          <span>
            <b>Pick by eye.</b> Grab pieces off the shelf with the tongs and drop them in the basket.
          </span>
        </li>
        <li>
          <span>
            <b>Serve fast.</b> The scale weighs it, you see your points, and the next customer steps up.
          </span>
        </li>
        <li>
          <span>
            <b>Stay close.</b> Each bowl is +10, plus up to +100 for accuracy and a growing bonus for every bowl in a row within 5%. Over budget costs 25; breaking a rule leaves just the 10.
          </span>
        </li>
      </ol>
      <button className="btn primary big" onClick={onStart}>
        Start the shift
      </button>
    </section>
  )
}

function RoundDone({ shift, onAgain, onBoard }) {
  const total = shift.points
  const [top, setTop] = useState(null)
  const [err, setErr] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const sent = useRef(false)

  useEffect(() => {
    if (boardReady) getTop().then(setTop, (e) => setErr(e.message))
  }, [])

  const rank = top && qualifies(top, total) ? top.filter((r) => r.score >= total).length + 1 : 0
  const submit = (e) => {
    e.preventDefault()
    if (sent.current) return
    sent.current = true
    setBusy(true)
    setErr('')
    submitScore(name.trim(), total).then(onBoard, (e) => {
      sent.current = false
      setErr(e.message)
      setBusy(false)
    })
  }

  return (
    <section className="panel">
      <h1>Shift total</h1>
      <p className="score">
        {total}
        <small> pts</small>
      </p>
      <p className="verdict">{shiftVerdict(total, shift.served.length).note}</p>
      <ol className="recap">
        {shift.served.map(({ order: o, r }, i) => (
          <li key={i}>
            <span className="recap-who">
              <span>
                <b>{o.customer}</b> · {r.verdict}
              </span>
              <small>
                {r.grams}g of {o.grams}g · {money(r.price)} of {money(o.budget)}
              </small>
            </span>
            <b>+{r.points}</b>
          </li>
        ))}
      </ol>
      {shift.served.length === 0 && <p className="muted">No bowls served this time.</p>}
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
      <div className="end-actions">
        <button className="btn primary big" onClick={onAgain}>
          Start another shift
        </button>
        <button className="btn big" onClick={onBoard}>
          See the Top 10
        </button>
      </div>
    </section>
  )
}

function Board() {
  const [top, setTop] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    if (boardReady) getTop().then(setTop, (e) => setErr(e.message))
  }, [])
  return (
    <section className="panel">
      <h1>Top 10</h1>
      {!boardReady && <p className="muted">The shared board isn't set up on this copy of the game yet.</p>}
      {err && <p className="error" role="alert">{err}</p>}
      {boardReady && !err && !top && <p className="muted">Loading…</p>}
      {top?.length === 0 && <p className="muted">No scores yet. Work an Orders shift to claim #1.</p>}
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
