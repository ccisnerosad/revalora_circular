import React from 'react'

export function PumpSkid({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Base */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.5, 0.2, 1]} />
        <meshStandardMaterial color='#444' />
      </mesh>
      {/* Bombas (representación simple) */}
      <mesh position={[-0.4, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
        <meshStandardMaterial color='#0066cc' />
      </mesh>
      <mesh position={[0.4, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
        <meshStandardMaterial color='#0066cc' />
      </mesh>
    </group>
  )
}
