import React, { useMemo } from 'react'

export function PalletStack({ position = [0, 0, 0] }) {
  const pallets = [0, 1, 2, 3, 4] // 5 tarimas apiladas

  // Geometría reutilizable para las tablas
  const woodColor = '#d2b48c'

  return (
    <group position={position}>
      {pallets.map((i) => (
        <group key={i} position={[0, i * 0.16, 0]} rotation={[0, i * 0.08, 0]}>
          {/* Runners (vigas inferiores) */}
          <mesh position={[-0.5, 0.07, 0]}>
            <boxGeometry args={[0.1, 0.14, 1.2]} />
            <meshStandardMaterial color={woodColor} />
          </mesh>
          <mesh position={[0, 0.07, 0]}>
            <boxGeometry args={[0.1, 0.14, 1.2]} />
            <meshStandardMaterial color={woodColor} />
          </mesh>
          <mesh position={[0.5, 0.07, 0]}>
            <boxGeometry args={[0.1, 0.14, 1.2]} />
            <meshStandardMaterial color={woodColor} />
          </mesh>

          {/* Top Deck (tablas superiores) */}
          <mesh position={[0, 0.145, 0]}>
            <boxGeometry args={[1.2, 0.02, 1.2]} />
            <meshStandardMaterial color={woodColor} />
          </mesh>

          {/* Bottom Deck (tablas inferiores) */}
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[1.2, 0.02, 1.2]} />
            <meshStandardMaterial color={woodColor} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
