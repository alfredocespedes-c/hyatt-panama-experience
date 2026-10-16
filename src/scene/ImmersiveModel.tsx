import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MutableRefObject, Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { sceneStateAt } from './sceneTimeline'

interface ModelProps {
  active: boolean
  reducedMotion: boolean
  onReady?: () => void
}

type GroupRef = THREE.Group | null

const blocks = [
  [-9, -9, 1.2, 1.8, 1.5], [-5, -10, 2.4, 1.5, 2.2], [-1, -10, 1.6, 2.1, 3], [4, -10, 2.7, 1.8, 1.2], [8, -9, 1.8, 1.7, 2.5],
  [-10, -5, 2.2, 2.5, 2], [-6, -5, 1.5, 2.1, 3.8], [-2, -5, 2.8, 1.8, 1.6], [4, -5, 1.5, 2.8, 2.4], [9, -5, 2.3, 1.8, 4],
  [-9, 0, 1.7, 2.2, 3.1], [-5, 0, 2.5, 1.5, 1.4], [5, 0, 2.2, 2.3, 2.9], [9, 1, 1.6, 2.6, 1.9],
  [-10, 5, 2.6, 1.7, 1.4], [-5, 5, 1.7, 2.5, 2.6], [0, 5, 2.4, 1.8, 1.8], [5, 5, 1.5, 2.5, 3.6], [9, 6, 2.1, 1.5, 2.1],
] as const

function setGroupOpacity(group: THREE.Group | null, opacity: number) {
  if (!group) return
  group.visible = opacity > 0.01
  group.traverse((child) => {
    if (!(child instanceof THREE.Mesh) || Array.isArray(child.material)) return
    child.material.transparent = true
    child.material.opacity = opacity
  })
}

function CityModel({ progress }: { progress: MutableRefObject<number> }) {
  const city = useRef<GroupRef>(null)
  const hotel = useRef<GroupRef>(null)
  useFrame(() => {
    const state = sceneStateAt(progress.current)
    setGroupOpacity(city.current, state.city)
    setGroupOpacity(hotel.current, Math.max(state.hotel, progress.current < .2 ? .18 : 0))
    if (hotel.current) hotel.current.rotation.y = -.12 + progress.current * .18
  })

  return (
    <group>
      <group ref={city} position={[0, -1.2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[34, 34]} />
          <meshStandardMaterial color="#d7d2c6" roughness={.95} />
        </mesh>
        {blocks.map(([x, z, w, d, h], index) => (
          <mesh key={index} position={[x, h / 2, z]} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color={index % 3 === 0 ? '#eeeade' : '#dfdbd0'} roughness={.9} />
          </mesh>
        ))}
        <Roads />
      </group>
      <group ref={hotel} position={[0, -1.15, -1]}>
        <mesh position={[0, .8, 0]} castShadow receiveShadow>
          <boxGeometry args={[8.6, 1.6, 5.4]} />
          <meshStandardMaterial color="#cfc9bb" roughness={.82} />
        </mesh>
        <mesh position={[-2.25, 5.2, -.3]} castShadow receiveShadow>
          <boxGeometry args={[2.7, 8.8, 3.2]} />
          <meshStandardMaterial color="#f2eee3" roughness={.76} />
        </mesh>
        <mesh position={[2.05, 6.45, .1]} castShadow receiveShadow>
          <boxGeometry args={[2.45, 11.3, 3]} />
          <meshStandardMaterial color="#e6e0d3" roughness={.78} />
        </mesh>
        <mesh position={[0, 2.1, 2.55]} castShadow>
          <boxGeometry args={[6.9, .25, 1.25]} />
          <meshStandardMaterial color="#b9c0be" metalness={.15} roughness={.7} />
        </mesh>
        {[-2.4, -1.2, 0, 1.2, 2.4].map((z) => (
          <mesh key={z} position={[0, 1.68, z]}>
            <boxGeometry args={[7.7, .055, .035]} />
            <meshStandardMaterial color="#879496" />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Roads() {
  return (
    <group position={[0, .03, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, .18]}><planeGeometry args={[1.1, 33]} /><meshBasicMaterial color="#b5b2aa" /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 1.34]}><planeGeometry args={[.8, 32]} /><meshBasicMaterial color="#b5b2aa" /></mesh>
      <mesh position={[0, 0, 7]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[28, .5]} /><meshBasicMaterial color="#c2beb3" /></mesh>
    </group>
  )
}

function Ballroom({ progress }: { progress: MutableRefObject<number> }) {
  const room = useRef<GroupRef>(null)
  useFrame(() => setGroupOpacity(room.current, sceneStateAt(progress.current).ballroom))
  return (
    <group ref={room} position={[0, 1.2, -16]}>
      <mesh position={[0, -2.3, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 22]} />
        <meshStandardMaterial color="#cfc9bb" roughness={.85} />
      </mesh>
      <mesh position={[-7.8, 1.4, -2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[17, 7.5]} /><meshStandardMaterial color="#d8d2c4" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[7.8, 1.4, -2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[17, 7.5]} /><meshStandardMaterial color="#d8d2c4" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.35, -10]}>
        <planeGeometry args={[15.5, 7.4]} /><meshStandardMaterial color="#c6c0b4" />
      </mesh>
      <mesh position={[0, 1.65, -9.82]}>
        <planeGeometry args={[8.8, 4.65]} />
        <meshStandardMaterial color="#f5f2e8" emissive="#1677ff" emissiveIntensity={.035} />
      </mesh>
      <mesh position={[0, 5.25, -2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 17]} /><meshStandardMaterial color="#e5dfd2" side={THREE.DoubleSide} />
      </mesh>
      {[-5, 0, 5].map((x) => <mesh key={x} position={[x, 5.12, -2]}><boxGeometry args={[.06, .05, 16]} /><meshBasicMaterial color="#809096" /></mesh>)}
    </group>
  )
}

function CameraFlight({ active, reducedMotion, progress }: { active: boolean; reducedMotion: boolean; progress: MutableRefObject<number> }) {
  const { camera, invalidate } = useThree()
  const started = useRef<number | null>(null)
  const target = useMemo(() => new THREE.Vector3(), [])
  useEffect(() => { started.current = active ? performance.now() : null }, [active])

  useFrame((state) => {
    let p = active ? Math.min(1, ((started.current ? performance.now() - started.current : 0) / 7600)) : 0
    if (reducedMotion && active) p = 1
    progress.current = p
    if (p < .72) {
      // Stay above the conceptual city while arcing toward the hotel. The
      // smooth curve avoids crossing through foreground massing on phones.
      const t = p / .72
      const eased = t * t * (3 - 2 * t)
      camera.position.set(14 * (1 - eased), 17 - eased * 9, 25 - eased * 10)
      target.set(0, .7 + eased * 2.1, -1.2)
    } else {
      const t = (p - .72) / .28
      const eased = t * t * (3 - 2 * t)
      camera.position.set(0, 8 - eased * 5.6, 15 - eased * 25)
      target.set(0, 2.1, -5 - eased * 11)
    }
    camera.lookAt(target)
    if (active && p < 1) invalidate()
  })
  return null
}

function Scene({ active, reducedMotion }: Pick<ModelProps, 'active' | 'reducedMotion'>) {
  const progress = useRef(0)
  return (
    <>
      <color attach="background" args={['#0d2435']} />
      <fog attach="fog" args={['#0d2435', 22, 55]} />
      <ambientLight intensity={1.45} color="#dce4e3" />
      <directionalLight position={[8, 16, 10]} intensity={2.6} color="#fff8e8" castShadow />
      <directionalLight position={[-10, 7, -4]} intensity={.8} color="#1677ff" />
      <CityModel progress={progress} />
      <Ballroom progress={progress} />
      <CameraFlight active={active} reducedMotion={reducedMotion} progress={progress} />
    </>
  )
}

export default function ImmersiveModel({ active, reducedMotion, onReady }: ModelProps) {
  useEffect(() => {
    const frame = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
    const retry = window.setTimeout(() => window.dispatchEvent(new Event('resize')), 180)
    return () => { cancelAnimationFrame(frame); window.clearTimeout(retry) }
  }, [])
  return (
    <Canvas
      className="model-canvas"
      dpr={[1, 1.35]}
      camera={{ fov: 43, near: .1, far: 100, position: [15, 14, 23] }}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
      shadows={!reducedMotion}
      frameloop={active && !reducedMotion ? 'always' : 'demand'}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; onReady?.() }}
    >
      <Suspense fallback={null}>
        <Scene active={active} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  )
}

// Future asset path: replace <CityModel /> with a GLB component loaded from
// public/models/hotel-concept.glb; keep CameraFlight and Ballroom unchanged.
