// Low-poly 3D ingredients built from primitives (no external models). Units: 1 ≈ 10cm.
import { RoundedBox } from '@react-three/drei'

const M = ({ c, r = 0.55, ...p }) => <meshStandardMaterial color={c} roughness={r} flatShading {...p} />

const Disc = ({ r, h, c, holes }) => (
  <group>
    <mesh>
      <cylinderGeometry args={[r, r, h, 14]} />
      <M c={c} />
    </mesh>
    {holes &&
      [0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[Math.cos(i) * r * 0.55, h / 2 + 0.001, Math.sin(i) * r * 0.55]}>
          <cylinderGeometry args={[r * 0.16, r * 0.16, 0.004, 8]} />
          <M c={holes} />
        </mesh>
      ))}
  </group>
)

const Ball = ({ r, c, sx = 1, sy = 1, sz = 1 }) => (
  <mesh scale={[sx, sy, sz]}>
    <icosahedronGeometry args={[r, 1]} />
    <M c={c} />
  </mesh>
)

const Leaf = ({ w, l, c, rib }) => (
  <group rotation={[0, 0, 0]}>
    <mesh scale={[w, 0.05, l]}>
      <sphereGeometry args={[1, 10, 6]} />
      <M c={c} />
    </mesh>
    <mesh position={[0, 0.03, l * 0.1]} scale={[w * 0.18, 0.05, l * 0.9]}>
      <sphereGeometry args={[1, 8, 4]} />
      <M c={rib} />
    </mesh>
  </group>
)

const Stalks = ({ n, len, r, c, cap, capR, spread }) => (
  <group>
    {Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2
      const x = Math.cos(a) * spread * ((i % 3) / 2)
      const z = Math.sin(a) * spread * ((i % 3) / 2)
      return (
        <group key={i} position={[x, 0, z]} rotation={[Math.PI / 2 - 0.15 * Math.sin(i), 0, a * 0.2]}>
          <mesh>
            <cylinderGeometry args={[r, r, len, 5]} />
            <M c={c} />
          </mesh>
          {cap && (
            <mesh position={[0, len / 2, 0]} scale={[1, 0.6, 1]}>
              <sphereGeometry args={[capR, 7, 5]} />
              <M c={cap} />
            </mesh>
          )}
        </group>
      )
    })}
  </group>
)

const Slab = ({ w, h, d, c, r = 0.03 }) => (
  <RoundedBox args={[w, h, d]} radius={Math.min(r, h / 2.01)} smoothness={2}>
    <M c={c} />
  </RoundedBox>
)

const Layers = ({ w, d, cs }) => (
  <group>
    {cs.map((c, i) => (
      <mesh key={i} position={[0, i * 0.04, 0]}>
        <boxGeometry args={[w, 0.04, d]} />
        <M c={c} />
      </mesh>
    ))}
  </group>
)

const Ring = ({ R, t, c, arc = Math.PI * 2 }) => (
  <mesh rotation={[Math.PI / 2, 0, 0]}>
    <torusGeometry args={[R, t, 6, 16, arc]} />
    <M c={c} />
  </mesh>
)

const Roll = ({ r, l, c, c2 }) => (
  <group rotation={[0, 0, Math.PI / 2]}>
    <mesh>
      <cylinderGeometry args={[r, r, l, 10]} />
      <M c={c} />
    </mesh>
    {c2 && (
      <mesh position={[r * 0.35, 0, 0]}>
        <cylinderGeometry args={[r * 0.75, r * 0.75, l * 1.01, 10, 1, false, 0, Math.PI]} />
        <M c={c2} />
      </mesh>
    )}
  </group>
)

const LOOKS = {
  lotus: () => <Disc r={0.3} h={0.07} c="#f1e3c4" holes="#b49a74" />,
  potato: () => <Disc r={0.26} h={0.06} c="#f3d98b" />,
  bokchoy: () => <Leaf w={0.22} l={0.42} c="#3f8f3a" rib="#e7f1d0" />,
  broccoli: () => (
    <group>
      <mesh position={[0, -0.05, 0]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.25, 6]} />
        <M c="#8dbb5a" />
      </mesh>
      <Ball r={0.17} c="#2f6e2a" sy={0.8} />
    </group>
  ),
  spinach: () => (
    <group>
      {[-0.08, 0, 0.08].map((x, i) => (
        <group key={i} position={[x, i * 0.02, 0]} rotation={[0, (i - 1) * 0.35, 0]}>
          <Leaf w={0.1} l={0.3} c="#2f7a2c" rib="#a9cf8c" />
        </group>
      ))}
    </group>
  ),
  cabbage: () => <Leaf w={0.36} l={0.4} c="#d9ebb0" rib="#f6f8e6" />,
  lettuce: () => <Leaf w={0.3} l={0.34} c="#7cc25a" rib="#d3ecb5" />,
  sprouts: () => <Stalks n={9} len={0.35} r={0.018} c="#f4f1df" cap="#e7d57a" capR={0.03} spread={0.1} />,
  corn: () => <Roll r={0.17} l={0.32} c="#f2c23a" />,
  eggplant: () => <Roll r={0.13} l={0.28} c="#e9dcc0" c2="#4b2350" />,

  // a whole bundle: a fan of stalks gathered into a wrapped root base
  enoki: () => (
    <group>
      <Stalks n={22} len={0.6} r={0.022} c="#f5efdc" cap="#efe5c4" capR={0.04} spread={0.13} />
      <mesh position={[0, 0, -0.26]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.11, 0.16, 12]} />
        <M c="#d9cfae" />
      </mesh>
    </group>
  ),
  shimeji: () => <Stalks n={5} len={0.22} r={0.035} c="#efe6d4" cap="#9c8b78" capR={0.08} spread={0.09} />,
  woodear: () => <Ball r={0.2} c="#3b2a22" sy={0.25} sx={1.1} />,
  shiitake: () => (
    <group>
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.12, 6]} />
        <M c="#e6d6bb" />
      </mesh>
      <mesh scale={[1, 0.5, 1]}>
        <sphereGeometry args={[0.2, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <M c="#6b4a33" />
      </mesh>
    </group>
  ),
  kingoyster: () => <Slab w={0.22} h={0.06} d={0.4} c="#efe4cf" r={0.03} />,

  cheesetofu: () => (
    <group>
      <Slab w={0.26} h={0.16} d={0.26} c="#f4ead2" r={0.05} />
      <mesh position={[0, 0.081, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.06, 10]} />
        <M c="#f2c85a" />
      </mesh>
    </group>
  ),
  fishball: () => <Ball r={0.15} c="#f7f3ea" />,
  cuttleball: () => <Ball r={0.16} c="#efe2dc" />,
  taupok: () => <Slab w={0.3} h={0.26} d={0.3} c="#d9a441" r={0.05} />,
  yuba: () => <Roll r={0.09} l={0.4} c="#e9c36e" />,
  fishtofu: () => <Slab w={0.34} h={0.2} d={0.26} c="#c98d3c" r={0.06} />,
  quail: () => <Ball r={0.11} c="#f1ead8" sy={1.25} />,
  spinachnoodle: () => (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.18, 0.07, 6, 14]} />
      <M c="#6f9a3e" />
    </mesh>
  ),
  sweetpotatonoodle: () => (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.18, 0.07, 6, 14]} />
      <M c="#7a3f8f" />
    </mesh>
  ),
  glassnoodle: () => (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.16, 0.06, 6, 14]} />
      <M c="#e8eef0" transparent opacity={0.75} />
    </mesh>
  ),
  instant: () => <Slab w={0.55} h={0.12} d={0.42} c="#ecd391" r={0.05} />,
  ricecake: () => <Ball r={0.16} c="#f6f3ec" sx={1.35} sy={0.3} />,

  porkbelly: () => <Layers w={0.45} d={0.22} cs={['#f3d6cf', '#f7ede4', '#e9a99b']} />,
  porkslice: () => <Layers w={0.5} d={0.3} cs={['#eaa79c']} />,
  chicken: () => <Slab w={0.28} h={0.18} d={0.24} c="#f2d9c4" r={0.07} />,
  luncheon: () => <Slab w={0.4} h={0.07} d={0.28} c="#e79a92" r={0.02} />,
  sausage: () => <Roll r={0.08} l={0.42} c="#c2463b" />,
  bacon: () => <Layers w={0.5} d={0.14} cs={['#d9776c', '#f4e1d6']} />,

  beef: () => <Layers w={0.5} d={0.26} cs={['#a8323a']} />,
  mutton: () => <Roll r={0.12} l={0.28} c="#b9585a" c2="#f2dcd2" />,
  cuttlefish: () => <Slab w={0.36} h={0.05} d={0.22} c="#f7f2ea" r={0.02} />,
  dory: () => <Slab w={0.4} h={0.1} d={0.24} c="#fbf8f2" r={0.04} />,
  prawn: () => <Ring R={0.15} t={0.06} c="#f07c45" arc={Math.PI * 1.4} />,
  squid: () => <Ring R={0.12} t={0.035} c="#f6f1ea" />,
  crabstick: () => <Roll r={0.08} l={0.42} c="#fbf7f1" c2="#e2473a" />,
}

// Drawn a little larger than life so pieces read clearly on a phone.
export function Piece({ id }) {
  const Look = LOOKS[id]
  return (
    <group scale={1.3}>
      <Look />
    </group>
  )
}

