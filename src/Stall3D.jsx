import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { BY_ID, INGREDIENTS, TIERS, rnd } from './data.js'
import { Piece } from './pieces.jsx'
import { countTo } from './count.js'

// World layout (1 unit ≈ 10cm): bins at the back, the basket on its scale at the front.
export const BASKET = new THREE.Vector3(0, 0.05, 1.75)
const BASKET_R = 1.22
const CARRY_Y = 1.35
const BIN = { w: 1.3, d: 1.05 }
const SP = 1.42 // bin pitch along the shelf
const DZ = 1.55 // depth of each shelf step
const RISE = 0.32 // each step back sits a little higher, like a stall's chiller display
const Z_FRONT = -1.0 // the front shelf, just behind the basket
const ROWS = 3
const COLS = Math.ceil(INGREDIENTS.length / ROWS)
const SHELF_W = COLS * SP
const BACK_Z = Z_FRONT - (ROWS - 1) * DZ

// Ingredients fill the shelf column by column, so each section (veg, mushrooms, …) runs along its length.
const binHome = (i) => {
  const c = Math.floor(i / ROWS)
  const r = i % ROWS
  return new THREE.Vector3((c - (COLS - 1) / 2) * SP, r * RISE, Z_FRONT - r * DZ)
}
// How many columns fit on screen: about 5 on a phone, more on wider screens.
const useView = () => {
  const { size } = useThree()
  return Math.min(COLS, Math.max(4.6, (size.width / size.height) * 6))
}
// Where each section of the shelf starts and ends, for its sign and the shelf map.
const SECTIONS = TIERS.map((t) => {
  const idx = INGREDIENTS.flatMap((ing, i) => (ing.tier === t.id ? [i] : []))
  const xs = idx.map((i) => binHome(i).x)
  return { ...t, from: Math.min(...xs) - SP / 2, to: Math.max(...xs) + SP / 2, count: idx.length }
})

// reduced motion: pieces land and return instantly, no sway
const STILL = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const LIFT = 0.24 // how far the basket rises when it sits on the scale
const LABEL_AT = new THREE.Vector3(0, 0.24, BIN.d / 2)
const steel = { color: '#c9cdd0', metalness: 0.35, roughness: 0.35 }

export default function Stall3D(props) {
  const [mouse, setMouse] = useState(false)
  const [ready, setReady] = useState(false)
  const [hint, setHint] = useState(0)
  const misses = useRef(0)
  const labels = useRef([])
  // where you're standing along the shelf (world x); the shelf map and gestures both steer `target`
  const pan = useRef({ x: -99, target: -99, max: 0 }) // start at the vegetable end, like walking in
  const items = INGREDIENTS
  // the first few drops that miss the basket get a nudge; after that the player has it
  const onMiss = () => {
    if (misses.current++ >= 3) return
    setHint((h) => h + 1)
  }
  useEffect(() => {
    if (!hint) return
    const t = setTimeout(() => setHint(0), 1800)
    return () => clearTimeout(t)
  }, [hint])
  return (
    <>
    <div
      className="stage"
      onPointerMove={(e) => setMouse(e.pointerType === 'mouse')}
      onPointerLeave={() => setMouse(false)}
      onWheel={(e) => (pan.current.target += (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * 0.012)}
    >
      <Canvas dpr={[1, 2]} camera={{ position: [0, 9.5, 6.6], fov: 38 }} onCreated={() => requestAnimationFrame(() => setReady(true))}>
        <color attach="background" args={['#d8dcde']} />
        <ambientLight intensity={1.4} />
        <directionalLight position={[-3, 8, 4]} intensity={1.8} />
        <directionalLight position={[4, 5, -3]} intensity={0.5} />
        <Rig />
        <Scene {...props} mouse={mouse} labels={labels} onMiss={onMiss} pan={pan} />
      </Canvas>
      {!ready && <p className="stage-loading stage-cover">Setting up the stall…</p>}
      {hint > 0 && (
        <p key={hint} className="drop-hint" role="status">
          Let go over the red basket to drop it in
        </p>
      )}
      {/* the scale's display; its digits are rolled by anime.js, never by React */}
      <span ref={(el) => (labels.current.lcd = el)} className="lcd" aria-hidden="true" />
      {/* hanging section signs over the shelf */}
      {SECTIONS.map((t, k) => (
        <span
          key={t.id}
          ref={(el) => ((labels.current.signs ||= [])[k] = el)}
          className={t.id === props.avoid ? 'section-sign banned' : 'section-sign'}
          data-tier={t.id}
          aria-hidden="true"
        >
          {t.id === props.avoid ? `No ${t.name.toLowerCase()}` : t.name}
          <small>{sectionPrice(t, props)}</small>
        </span>
      ))}
      {/* clip-on price tags: plain DOM, pinned to each bin's front lip every frame */}
      {items.map((ing, i) => (
        <span
          key={ing.id}
          ref={(el) => (labels.current[i] = el)}
          className={ing.tier === props.avoid ? 'bin-label banned' : 'bin-label'}
          data-tier={ing.tier}
          aria-hidden="true"
        >
          <b>{ing.name}</b>
          <span>{props.noodlesFixed && ing.noodle ? 'S$1 each' : `~${ing.g}g`}</span>
        </span>
      ))}
      <ul className="sr-only">
        {items.map((ing) => (
          <li key={ing.id}>
            <button onClick={() => props.onAdd(ing.id, [0, 2, 0])}>Add one {ing.unit} of {ing.name}, about {ing.g} grams</button>
          </li>
        ))}
        {props.pieces.slice(-1).map((p) => (
          <li key={p.key}>
            <button onClick={() => props.onRemove(p.key)}>Take the last piece out ({BY_ID[p.id].name})</button>
          </li>
        ))}
      </ul>
    </div>
    {/* the whole shelf in miniature: tap a section to walk to it */}
    <div className="aisle" aria-label="Shelf sections">
      {SECTIONS.map((t) => (
        <button
          key={t.id}
          data-tier={t.id}
          className={t.id === props.avoid ? 'banned' : undefined}
          style={{ flexGrow: t.count }}
          onClick={() => (pan.current.target = (t.from + t.to) / 2)}
        >
          {t.short}
        </button>
      ))}
      <i ref={(el) => (labels.current.window = el)} className="aisle-window" />
    </div>
    </>
  )
}

const sectionPrice = (t, { pricing, noodlesFixed }) =>
  t.id === 'carb' && noodlesFixed
    ? 'Noodles S$1 each'
    : pricing === 'flat'
      ? 'Flat rate'
      : `S$${t.rate.toFixed(2)} / 100g`

// Point the camera at the stall, then use the narrowest field of view that keeps every corner on screen.
function Rig() {
  const { camera, size } = useThree()
  const view = useView()
  useEffect(() => {
    const x = (view * SP) / 2 + 0.1
    const z0 = BACK_Z - BIN.d / 2 - 0.1
    const z1 = 3.35
    const top = (ROWS - 1) * RISE + 1.1 // room for the section signs
    const cz = (z0 + z1) / 2
    camera.position.set(0, 11, cz + 5)
    camera.lookAt(0, 0, cz)
    camera.aspect = size.width / size.height
    camera.updateMatrixWorld()
    const corners = [-x, x].flatMap((cx) => [[z0, top], [z1, 0.9], [z1, 0]].map(([z, y]) => new THREE.Vector3(cx, y, z)))
    const v = new THREE.Vector3()
    for (let fov = 15; fov <= 80; fov += 0.5) {
      camera.fov = fov
      camera.updateProjectionMatrix()
      if (corners.every((c) => (v.copy(c).project(camera), Math.abs(v.x) < 1 && Math.abs(v.y) < 0.97))) break
    }
  }, [camera, size, view])
  return null
}

function Scene({ pieces, onAdd, onRemove, mouse, labels, scale, grams, onWeighed, onMiss, quick, pan }) {
  const items = INGREDIENTS
  const { camera, raycaster, pointer, gl, size } = useThree()
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -CARRY_Y), [])
  const hit = useMemo(() => new THREE.Vector3(0, CARRY_Y, 0), [])
  const tip = useRef(new THREE.Vector3(0, CARRY_Y, 0))
  const carry = useRef(null)
  const [held, setHeld] = useState(null)
  const [flights, setFlights] = useState([])
  const overBasket = useRef(false)
  const view = useView()
  const panDrag = useRef(null)
  const basket = useRef()
  const platX = useRef(scale === 'none' ? 7 : 0)
  const lcdAt = useMemo(() => new THREE.Vector3(), [])

  // Practice: the display follows every drop. Orders: nothing until the bowl is served,
  // then the scale slides in, the reading climbs and settles, and the receipt follows.
  useEffect(() => {
    const lcd = labels.current.lcd
    if (!lcd || scale === 'none') return
    if (scale === 'live') {
      const a = countTo(lcd, grams, (v) => `${Math.round(v)} g`, { settle: true, duration: 650 })
      return () => a.pause()
    }
    lcd._v = 0
    lcd.textContent = '0 g'
    let a
    // a shift can't wait three seconds per bowl, so it gets the quick version
    const [wait, roll, hold] = quick ? [250, 650, 250] : [700, 1500, 650]
    let t = setTimeout(() => {
      a = countTo(lcd, grams, (v) => `${Math.round(v)} g`, {
        settle: true,
        duration: roll,
        onDone: () => (t = setTimeout(onWeighed, hold)),
      })
    }, wait)
    return () => (clearTimeout(t), a?.pause())
    // onWeighed is recreated by the parent each render; the sequence is keyed on scale/grams only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, grams, labels])

  useFrame((_, dt) => {
    // walk along the shelf: the camera and your basket slide together
    const P = pan.current
    P.max = Math.max(0, SHELF_W / 2 - (view * SP) / 2 + 0.2)
    P.target = THREE.MathUtils.clamp(P.target, -P.max, P.max)
    P.x = STILL ? P.target : THREE.MathUtils.damp(P.x, P.target, 9, dt)
    camera.position.x = P.x
    if (basket.current) basket.current.position.x = P.x
    const win = labels.current.window
    if (win) {
      // the map has 12px side padding; place the window inside it
      win.style.left = `calc(12px + (100% - 24px) * ${(P.x - (view * SP) / 2 + SHELF_W / 2) / SHELF_W})`
      win.style.width = `calc((100% - 24px) * ${Math.min(1, (view * SP) / SHELF_W)})`
    }
    ;(labels.current.signs || []).forEach((el, k) => {
      if (!el) return
      const t = SECTIONS[k]
      const v = lcdAt.set((t.from + t.to) / 2, (ROWS - 1) * RISE + 0.75, BACK_Z - 0.6).project(camera)
      el.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px) translate(-50%, -50%)`
      el.style.visibility = 'visible'
    })

    raycaster.setFromCamera(pointer, camera)
    if (raycaster.ray.intersectPlane(plane, hit)) {
      hit.x = THREE.MathUtils.clamp(hit.x, P.x - (view * SP) / 2, P.x + (view * SP) / 2)
      hit.z = THREE.MathUtils.clamp(hit.z, BACK_Z - DZ, 3.2)
    }
    tip.current.lerp(hit, 1 - Math.exp(-dt * 28))
    items.forEach((_, i) => {
      const el = labels.current[i]
      if (!el) return
      const v = binHome(i).add(LABEL_AT).project(camera)
      el.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px) translate(-50%, -50%)`
      el.style.visibility = 'visible'
    })
    platX.current = THREE.MathUtils.damp(platX.current, scale === 'none' ? 7 : 0, 7, dt)
    const lcd = labels.current.lcd
    if (lcd) {
      lcd.hidden = platX.current > 5
      lcd.style.visibility = 'visible'
      const v = lcdAt.set(pan.current.x + platX.current, 0.1, BASKET.z + 1.5).project(camera)
      lcd.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px) translate(-50%, -50%)`
    }
    overBasket.current = !!carry.current && Math.hypot(tip.current.x - pan.current.x, tip.current.z - BASKET.z) < BASKET_R
  })

  const homeOf = (id) => binHome(items.findIndex((x) => x.id === id)).add({ x: 0, y: 0.15, z: 0 })

  const grab = (id, fromKey) => (e) => {
    e.stopPropagation()
    if (scale === 'weigh') return // hands off while it's being weighed
    gl.domElement.setPointerCapture?.(e.pointerId)
    hit.copy(e.point).setY(CARRY_Y)
    tip.current.copy(hit)
    carry.current = { id, fromKey, x: e.clientX, y: e.clientY, t: performance.now() }
    if (fromKey) onRemove(fromKey)
    setHeld(id)
  }

  useEffect(() => {
    const move = (e) => {
      const d = panDrag.current
      if (d) pan.current.target = d.x0 - (e.clientX - d.px) * ((view * SP) / size.width)
    }
    const up = (e) => {
      panDrag.current = null
      const c = carry.current
      if (!c) return
      carry.current = null
      setHeld(null)
      const tap = Math.hypot(e.clientX - c.x, e.clientY - c.y) < 8 && performance.now() - c.t < 350
      const p = tip.current.clone()
      // judge the drop by where the pointer let go, not where the (slightly trailing) tongs are
      const r = gl.domElement.getBoundingClientRect()
      const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
      raycaster.setFromCamera(ndc, camera)
      const at = raycaster.ray.intersectPlane(plane, new THREE.Vector3()) || p
      const inBasket = Math.hypot(at.x - pan.current.x, at.z - BASKET.z) < BASKET_R
      if (e.type !== 'pointercancel' && (inBasket || (tap && !c.fromKey))) return onAdd(c.id, p.toArray())
      // dropped elsewhere (or a tap on a basket piece): it goes back to its bin
      if (!tap && !c.fromKey) onMiss()
      setFlights((f) => [...f, { key: Math.random(), id: c.id, from: p, to: homeOf(c.id) }])
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  })

  useEffect(() => {
    gl.domElement.style.cursor = held ? 'grabbing' : ''
  }, [held, gl])

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        onPointerDown={(e) => {
          e.stopPropagation()
          panDrag.current = { px: e.clientX, x0: pan.current.target }
        }}
      >
        <planeGeometry args={[80, 60]} />
        <meshStandardMaterial color="#d8dcde" metalness={0.2} roughness={0.55} />
      </mesh>
      <ContactShadows position={[0, 0, 0]} scale={12} blur={2.4} opacity={0.35} far={3} />

      <Shelf />
      {items.map((ing, i) => (
        <Bin key={ing.id} ing={ing} at={binHome(i)} onGrab={grab(ing.id, null)} />
      ))}

      <Basket over={overBasket} platX={platX} onScale={scale !== 'none'} groupRef={basket}>
        {pieces.map((p) => (
          <BasketPiece key={p.key} piece={p} onGrab={grab(p.id, p.key)} basketX={pan.current.x} />
        ))}
      </Basket>

      {flights.map((f) => (
        <Flight key={f.key} {...f} onDone={() => setFlights((all) => all.filter((x) => x.key !== f.key))} />
      ))}

      {held && <Held id={held} tip={tip} />}
      <Tongs tip={tip} closed={!!held} visible={!!held || mouse} />
    </>
  )
}

// Stepped steel display: each row stands on a riser a little higher than the one in front.
function Shelf() {
  const w = SHELF_W + 0.3
  return (
    <group>
      {[1, 2].map((r) => (
        <mesh key={r} position={[0, (r * RISE) / 2 - 0.01, Z_FRONT - r * DZ]}>
          <boxGeometry args={[w, r * RISE, DZ]} />
          <meshStandardMaterial color="#b9bec1" metalness={0.3} roughness={0.45} />
        </mesh>
      ))}
      <mesh position={[0, ROWS * RISE / 2 + 0.55, BACK_Z - DZ / 2 - 0.05]}>
        <boxGeometry args={[w, ROWS * RISE + 1.1, 0.1]} />
        <meshStandardMaterial color="#a9aeb2" metalness={0.35} roughness={0.4} />
      </mesh>
    </group>
  )
}

function Bin({ ing, at, onGrab }) {
  const copies = useMemo(
    () =>
      Array.from({ length: 5 }, (_, k) => ({
        pos: [(rnd(k + ing.g) - 0.5) * 0.7, 0.1 + (k > 3 ? 0.09 : 0), (rnd(k * 2 + ing.g) - 0.5) * 0.5],
        rot: [0, rnd(k * 5 + ing.g) * Math.PI * 2, 0],
      })),
    [ing.g],
  )
  const [hot, setHot] = useState(false)
  return (
    <group position={at}>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[BIN.w, 0.04, BIN.d]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      {[
        [0, BIN.d / 2, BIN.w, 0.04],
        [0, -BIN.d / 2, BIN.w, 0.04],
        [BIN.w / 2, 0, 0.04, BIN.d],
        [-BIN.w / 2, 0, 0.04, BIN.d],
      ].map(([x, z, w, d], k) => (
        <mesh key={k} position={[x, 0.12, z]}>
          <boxGeometry args={[w, 0.24, d]} />
          <meshStandardMaterial {...steel} color={hot ? '#e4e7e9' : steel.color} />
        </mesh>
      ))}
      {copies.map((c, k) => (
        <group key={k} position={c.pos} rotation={c.rot}>
          <Piece id={ing.id} />
        </group>
      ))}
      {/* the whole bin is the grab target, so small pieces are still easy to hit on a phone */}
      <mesh
        position={[0, 0.3, 0]}
        visible={false}
        onPointerDown={onGrab}
        onPointerOver={() => setHot(true)}
        onPointerOut={() => setHot(false)}
      >
        <boxGeometry args={[BIN.w, 0.6, BIN.d]} />
      </mesh>
    </group>
  )
}

function perforatedTexture() {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 64
  const x = c.getContext('2d')
  x.fillStyle = '#c8262c'
  x.fillRect(0, 0, 128, 64)
  x.fillStyle = '#7d1418'
  for (const [cx, cy] of [[8, 10], [72, 10], [40, 42], [104, 42]]) {
    x.beginPath()
    x.roundRect(cx, cy, 34, 12, 6)
    x.fill()
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(9, 3)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function Basket({ over, platX, onScale, groupRef, children }) {
  const tex = useMemo(() => perforatedTexture(), [])
  const rim = useRef()
  const lift = useRef()
  const plat = useRef()
  useFrame((_, dt) => {
    const target = over.current ? 1.04 : 1
    rim.current.scale.x = rim.current.scale.z = THREE.MathUtils.damp(rim.current.scale.x, target, 14, dt)
    plat.current.position.x = platX.current
    plat.current.visible = platX.current < 6.5
    // the basket steps up onto the platform once it has slid underneath
    const up = onScale && platX.current < 0.4 ? LIFT : 0
    lift.current.position.y = THREE.MathUtils.damp(lift.current.position.y, up, 12, dt)
  })
  return (
    <group ref={groupRef} position={BASKET}>
      <group ref={plat} position={[7, 0, 0]}>
        <RoundedBox args={[3.05, LIFT, 2.95]} radius={0.08} position={[0, LIFT / 2 - 0.05, 0]}>
          <meshStandardMaterial {...steel} />
        </RoundedBox>
        <mesh position={[0, 0.1, 1.48]}>
          <boxGeometry args={[0.9, 0.16, 0.04]} />
          <meshStandardMaterial color="#2a2320" roughness={0.4} />
        </mesh>
      </group>
      <group ref={lift}>
        <group ref={rim}>
          <mesh position={[0, 0.46, 0]}>
            <cylinderGeometry args={[1.3, 1.02, 0.86, 40, 1, true]} />
            <meshStandardMaterial map={tex} side={THREE.DoubleSide} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[1.02, 1.02, 0.05, 40]} />
            <meshStandardMaterial color="#a51e23" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.89, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.3, 0.055, 8, 48]} />
            <meshStandardMaterial color="#c8262c" roughness={0.5} />
          </mesh>
        </group>
        {children}
      </group>
    </group>
  )
}

// A piece arrives from wherever the tongs let go and drops onto the pile (gravity, no bounce).
function BasketPiece({ piece, onGrab, basketX }) {
  const g = useRef()
  const v = useRef(0)
  const done = useRef(false)
  const [px, py, pz] = piece.pose.pos
  const start = useMemo(
    () => new THREE.Vector3(...(piece.from || [px + basketX, 2, pz])).sub(BASKET).sub({ x: basketX, y: 0, z: 0 }),
    // the start point is fixed when the piece lands; later walking doesn't replay the drop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [piece.from, px, pz],
  )
  useEffect(() => {
    g.current.position.copy(start)
  }, [start])
  useFrame((_, dt) => {
    if (done.current) return
    const p = g.current.position
    if (STILL) v.current = -1e3
    p.x = THREE.MathUtils.damp(p.x, px, 12, dt)
    p.z = THREE.MathUtils.damp(p.z, pz, 12, dt)
    v.current -= 22 * dt
    p.y += v.current * dt
    for (const k of [0, 1, 2]) {
      const axis = 'xyz'[k]
      g.current.rotation[axis] = THREE.MathUtils.damp(g.current.rotation[axis], piece.pose.rot[k], 10, dt)
    }
    if (p.y <= py) {
      p.set(px, py, pz)
      done.current = true
    }
  })
  return (
    <group ref={g} onPointerDown={onGrab}>
      <Piece id={piece.id} />
    </group>
  )
}

// Critically damped spring back to the bin, with a small lift so it arcs instead of sliding.
function Flight({ id, from, to, onDone }) {
  const g = useRef()
  const t = useRef(0)
  useEffect(() => {
    g.current.position.copy(from)
  }, [from])
  useFrame((_, dt) => {
    t.current += dt
    if (STILL) return onDone()
    const p = g.current.position
    p.x = THREE.MathUtils.damp(p.x, to.x, 9, dt)
    p.z = THREE.MathUtils.damp(p.z, to.z, 9, dt)
    p.y = THREE.MathUtils.damp(p.y, to.y, 6, dt)
    if (t.current > 0.9 || p.distanceTo(to) < 0.02) onDone()
  })
  return (
    <group ref={g}>
      <Piece id={id} />
    </group>
  )
}

function Held({ id, tip }) {
  const g = useRef()
  useFrame((s) => {
    g.current.position.copy(tip.current).add({ x: 0, y: -0.12, z: 0 })
    if (!STILL) g.current.rotation.z = Math.sin(s.clock.elapsedTime * 3) * 0.04 // a little sway from the hand
  })
  return (
    <group ref={g}>
      <Piece id={id} />
    </group>
  )
}

function Tongs({ tip, closed, visible }) {
  const g = useRef()
  const armA = useRef()
  const armB = useRef()
  const jaw = useRef(0.1)
  useFrame((_, dt) => {
    g.current.visible = visible
    g.current.position.copy(tip.current)
    jaw.current = THREE.MathUtils.damp(jaw.current, closed ? 0.02 : 0.1, 30, dt)
    armA.current.rotation.z = jaw.current
    armB.current.rotation.z = -jaw.current
  })
  const L = 3.4
  // Lay the tongs across the screen (handles to the lower right, rising toward the hand) so the jaws read from above.
  const orient = useMemo(() => {
    const y = new THREE.Vector3(0.75, 0.45, 0.5).normalize()
    const x = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), y).normalize()
    const z = new THREE.Vector3().crossVectors(x, y)
    // jaws open in local x, which here is horizontal, so the camera sees them part
    return new THREE.Euler().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z))
  }, [])
  const metal = <meshStandardMaterial color="#c3c8cc" metalness={0.7} roughness={0.22} />
  return (
    <group ref={g} rotation={orient}>
      {[armA, armB].map((r, i) => (
        <group key={i} ref={r} position={[0, L, 0]}>
          <mesh position={[0, -L / 2, 0]}>
            <boxGeometry args={[0.16, L, 0.05]} />
            {metal}
          </mesh>
          {/* red rubber grip near the hinge */}
          <mesh position={[0, -0.75, 0]}>
            <boxGeometry args={[0.2, 1.2, 0.09]} />
            <meshStandardMaterial color="#b3201c" roughness={0.8} />
          </mesh>
          {/* scalloped gripping paddle at the tip */}
          <mesh position={[(i ? -1 : 1) * 0.04, -L + 0.12, 0]}>
            <boxGeometry args={[0.08, 0.3, 0.24]} />
            {metal}
          </mesh>
        </group>
      ))}
      <mesh position={[0, L + 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.13, 0.04, 8, 16]} />
        {metal}
      </mesh>
    </group>
  )
}
