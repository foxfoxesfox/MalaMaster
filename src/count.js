import { useEffect, useRef } from 'react'
import { animate } from 'animejs'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Roll a number shown in `el` from its current value to `to`. With `settle`, it overshoots a touch and
// wobbles before landing, the way a digital scale reads while the load stops moving.
export function countTo(el, to, fmt, { settle = false, duration = 420, onDone } = {}) {
  const from = el._v ?? 0
  const show = (v) => {
    el._v = v
    el.textContent = fmt(v)
  }
  if (reduced() || from === to) {
    show(to)
    onDone?.()
    return { pause() {} }
  }
  const o = { v: from }
  // a real scale only jitters a couple of percent; a big overshoot reads as a wrong weight
  const keys = settle && to > 0 ? [to * 1.02, to * 0.99, to * 1.004, to] : [to]
  return animate(o, {
    v: keys.map((k) => ({ to: k })),
    duration,
    ease: 'outQuad',
    onUpdate: () => show(o.v),
    onComplete: () => {
      show(to)
      onDone?.()
    },
  })
}

// A span whose number rolls to each new value instead of jumping. React never writes its text.
export function useCount(value, fmt, opts) {
  const ref = useRef(null)
  useEffect(() => {
    const a = countTo(ref.current, value, fmt, opts)
    return () => a.pause()
    // fmt and opts are fixed at each call site; only the value drives the roll
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return ref
}
