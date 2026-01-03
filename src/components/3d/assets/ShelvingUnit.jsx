import React from 'react'

export function ShelvingUnit({ position = [0, 0, 0] }) {
  // Dimensiones: 1.2m ancho x 0.6m fondo x 2m alto
  return (
    <group position={position}>
      {/* Postes verticales */}
      <mesh position={[-0.58, 1, -0.28]}>
        <boxGeometry args={[0.04, 2, 0.04]} />
        <meshStandardMaterial color='#555' />
      </mesh>
      <mesh position={[0.58, 1, -0.28]}>
        <boxGeometry args={[0.04, 2, 0.04]} />
        <meshStandardMaterial color='#555' />
      </mesh>
      <mesh position={[-0.58, 1, 0.28]}>
        <boxGeometry args={[0.04, 2, 0.04]} />
        <meshStandardMaterial color='#555' />
      </mesh>
      <mesh position={[0.58, 1, 0.28]}>
        <boxGeometry args={[0.04, 2, 0.04]} />
        <meshStandardMaterial color='#555' />
      </mesh>

      {/* Estantes (5 niveles) */}
      {[0.2, 0.6, 1.0, 1.4, 1.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[1.2, 0.05, 0.6]} />
          <meshStandardMaterial color='#888' roughness={0.4} metalness={0.6} />
        </mesh>
      ))}
    </group>
  )
}
