import React from 'react'

export function CompostPile({ position = [0, 0, 0], length = 8, width = 2, height = 1.5 }) {
  return (
    <group position={position}>
      {/* Base de concreto (Cama) */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[width + 0.4, length + 0.4, 0.2]} />
        <meshStandardMaterial color='#999999' roughness={0.5} />
      </mesh>

      {/* Muros de contención bajos */}
      <mesh position={[-(width / 2 + 0.1), 0.3, 0]}>
        <boxGeometry args={[0.2, 0.6, length + 0.4]} />
        <meshStandardMaterial color='#888888' />
      </mesh>
      <mesh position={[width / 2 + 0.1, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.6, length + 0.4]} />
        <meshStandardMaterial color='#888888' />
      </mesh>

      {/* Montículo de composta (Textura rugosa simulada con color) */}
      <mesh position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[width / 2.5, width / 2, length, 12, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color='#3e2723' roughness={1} />
      </mesh>
    </group>
  )
}
