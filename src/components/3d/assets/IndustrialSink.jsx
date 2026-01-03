import React from 'react'

export function IndustrialSink({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Cuerpo del lavabo */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[1.2, 0.3, 0.6]} />
        <meshStandardMaterial color='#b0bec5' metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Respaldo contra salpicaduras */}
      <mesh position={[0, 1.1, -0.28]}>
        <boxGeometry args={[1.2, 0.2, 0.04]} />
        <meshStandardMaterial color='#b0bec5' metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Grifo */}
      <mesh position={[0, 1.1, -0.2]} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3]} />
        <meshStandardMaterial color='#eceff1' metalness={0.9} />
      </mesh>

      {/* Patas */}
      <mesh position={[-0.55, 0.35, -0.25]}>
        <cylinderGeometry args={[0.03, 0.03, 0.7]} />
        <meshStandardMaterial color='#90a4ae' />
      </mesh>
      <mesh position={[0.55, 0.35, -0.25]}>
        <cylinderGeometry args={[0.03, 0.03, 0.7]} />
        <meshStandardMaterial color='#90a4ae' />
      </mesh>
      <mesh position={[-0.55, 0.35, 0.25]}>
        <cylinderGeometry args={[0.03, 0.03, 0.7]} />
        <meshStandardMaterial color='#90a4ae' />
      </mesh>
      <mesh position={[0.55, 0.35, 0.25]}>
        <cylinderGeometry args={[0.03, 0.03, 0.7]} />
        <meshStandardMaterial color='#90a4ae' />
      </mesh>
    </group>
  )
}
