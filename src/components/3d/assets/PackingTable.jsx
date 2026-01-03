import React from 'react'

export function PackingTable({ position = [0, 0, 0] }) {
  // Dimensiones: 2.4m ancho x 0.8m fondo
  return (
    <group position={position}>
      {/* Superficie de la mesa */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[2.4, 0.05, 0.8]} />
        <meshStandardMaterial color='#cfd8dc' roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Patas */}
      <mesh position={[-1.1, 0.45, -0.3]}>
        <boxGeometry args={[0.05, 0.9, 0.05]} />
        <meshStandardMaterial color='#90a4ae' />
      </mesh>
      <mesh position={[1.1, 0.45, -0.3]}>
        <boxGeometry args={[0.05, 0.9, 0.05]} />
        <meshStandardMaterial color='#90a4ae' />
      </mesh>
      <mesh position={[-1.1, 0.45, 0.3]}>
        <boxGeometry args={[0.05, 0.9, 0.05]} />
        <meshStandardMaterial color='#90a4ae' />
      </mesh>
      <mesh position={[1.1, 0.45, 0.3]}>
        <boxGeometry args={[0.05, 0.9, 0.05]} />
        <meshStandardMaterial color='#90a4ae' />
      </mesh>
    </group>
  )
}
