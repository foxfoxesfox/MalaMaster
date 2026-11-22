import { useEffect, useRef, useState } from 'react'

const money = (n) => `S$${n.toFixed(2)}`
const STATUS = { weighing: 'Weighing your bowl…', printing: 'Printing your receipt', done: 'Take your receipt' }

// Thermal-printer checkout: the paper feeds out of the slot in jerky steps, then you tear it off with the button.
export default function Receipt({ heading, sub, lines, rows, stamp, note, actionLabel, onAction, firstStatus }) {
  const [phase, setPhase] = useState('weighing')
  const [no] = useState(() => String(1000 + Math.floor(Math.random() * 9000)))
  const [at] = useState(() => new Date())
  const btn = useRef(null)

  useEffect(() => {
    const fast = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const a = setTimeout(() => setPhase('printing'), fast ? 0 : 650)
    const b = setTimeout(() => setPhase('done'), fast ? 0 : 650 + 1900)
    return () => (clearTimeout(a), clearTimeout(b))
  }, [])
  useEffect(() => {
    if (phase === 'done') btn.current?.focus()
  }, [phase])

  return (
    <div className="printer-scrim" role="dialog" aria-modal="true" aria-label="Receipt">
      <div className="printer">
        <div className="printer-face">
          <span className="led" data-phase={phase} />
          <span aria-live="polite">{phase === 'weighing' && firstStatus ? firstStatus : STATUS[phase]}</span>
        </div>
        <div className="slot" />
      </div>
      <div className="paper-window">
        <div className={`paper${phase === 'weighing' ? '' : ' feed'}`}>
          <p className="r-brand">MALAMASTER</p>
          <p className="r-center">{heading}</p>
          {sub && <p className="r-center">{sub}</p>}
          <p className="r-center r-dim">
            NO. {no} · {at.toLocaleDateString('en-SG', { day: '2-digit', month: 'short' })}{' '}
            {at.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <hr />
          {lines.length === 0 && <p className="r-dim">(empty bowl)</p>}
          {lines.map((l) => (
            <div className="r-line" key={l.key ?? l.name}>
              <span>
                {l.name} {l.n != null && <span className="r-dim">×{l.n}</span>}
              </span>
              <span className="r-dim">{l.mid ?? (l.grams == null ? (l.name === 'Rice' ? 'bowl' : 'fixed') : `${l.grams}g`)}</span>
              <span>{l.right ?? money(l.price)}</span>
            </div>
          ))}
          <hr />
          {rows.map(([k, v, strong]) => (
            <div className={`r-row${strong ? ' strong' : ''}`} key={k}>
              <span>{k}</span>
              <span>{v}</span>
            </div>
          ))}
          {stamp && <p className={`r-stamp${stamp.good ? ' good' : ''}`}>{stamp.text}</p>}
          {note && <p className="r-note">{note}</p>}
          <Barcode value={no} />
          <p className="r-center r-dim">THANK YOU · COME AGAIN</p>
          <div className="tear" />
        </div>
      </div>
      <button ref={btn} className="btn primary big printer-btn" disabled={phase !== 'done'} onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  )
}

function Barcode({ value }) {
  // decorative bars derived from the receipt number
  const bars = [...(value + value.split('').reverse().join('') + value)].flatMap((d, i) => [1 + (+d % 3), 1 + ((+d + i) % 2)])
  return (
    <div className="barcode" aria-hidden="true">
      {bars.map((w, i) => (
        <i key={i} style={{ width: w * 2, opacity: i % 2 ? 0 : 1 }} />
      ))}
    </div>
  )
}
