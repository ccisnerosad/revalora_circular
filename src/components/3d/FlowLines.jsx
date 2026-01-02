import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const FLOW_POINTS = [
  // Maniobras -> Alimento Humano (Ahora a la derecha)
  [new THREE.Vector3(0, 0.5, 20), new THREE.Vector3(9.5, 0.5, 15), new THREE.Vector3(9.5, 0.5, -6)],
  // Maniobras -> Alimento Animal (Ahora a la derecha)
  [new THREE.Vector3(0, 0.5, 20), new THREE.Vector3(3.5, 0.5, 15), new THREE.Vector3(3.5, 0.5, -6)],
  // Alimento Humano -> Biogestión (Derecha a Izquierda por atrás)
  [new THREE.Vector3(9.5, 0.5, -6), new THREE.Vector3(9.5, 0.5, -18), new THREE.Vector3(-7, 0.5, -18), new THREE.Vector3(-7, 0.5, -2)],
  // Biogestión -> Tratamiento (Izquierda)
  [new THREE.Vector3(-7, 0.5, -2), new THREE.Vector3(-7, 0.5, -18)]
]

function FlowPath({ points, color = '#00ff00', speed = 1 }) {
  const curve = new THREE.CatmullRomCurve3(points)
  const materialRef = useRef()

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.dashOffset.value -= 0.01 * speed
    }
  })

  // Crear geometría de tubo a lo largo de la curva
  const geometry = new THREE.TubeGeometry(curve, 64, 0.1, 8, false)

  // Shader material personalizado para efecto de flujo
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(color) },
      dashOffset: { value: 0 },
      dashSize: { value: 2 },
      gapSize: { value: 1 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float dashOffset;
      uniform float dashSize;
      uniform float gapSize;
      varying vec2 vUv;
      
      void main() {
        float totalSize = dashSize + gapSize;
        float dash = mod(vUv.x * 20.0 + dashOffset * 10.0, totalSize);
        if (dash > dashSize) discard;
        gl_FragColor = vec4(color, 0.6);
      }
    `,
    transparent: true
  })

  return (
    <mesh geometry={geometry}>
      <primitive object={shaderMaterial} ref={materialRef} attach='material' />
    </mesh>
  )
}

export function FlowLines() {
  return (
    <group>
      {FLOW_POINTS.map((points, i) => (
        <FlowPath key={i} points={points} color={i % 2 === 0 ? '#00ff88' : '#0088ff'} />
      ))}
    </group>
  )
}
