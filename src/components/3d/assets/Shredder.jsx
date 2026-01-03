import React from 'react'

export function Shredder({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Cuerpo principal */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[1.2, 1.5, 1.2]} />
        <meshStandardMaterial color='#555' />
      </mesh>
      {/* Tolva */}
      <mesh position={[0, 1.8, 0]}>
        <coneGeometry args={[0.8, 0.6, 4]} />
        <meshStandardMaterial color='#444' />
      </mesh>
    </group>
  )
}
