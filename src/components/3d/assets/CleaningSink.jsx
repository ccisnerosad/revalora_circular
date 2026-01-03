import React from 'react'

export function CleaningSink({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  // Tarja industrial doble de acero inoxidable
  const steelMaterial = { color: '#b0bec5', metalness: 0.6, roughness: 0.3 }

  return (
    <group position={position} rotation={rotation}>
      {/* --- Cuerpo Principal --- */}
      <group position={[0, 0.85, 0]}>
        {/* Bloque principal */}
        <mesh>
          <boxGeometry args={[1.6, 0.3, 0.8]} />
          <meshStandardMaterial {...steelMaterial} />
        </mesh>

        {/* Backsplash alto */}
        <mesh position={[0, 0.25, -0.38]}>
          <boxGeometry args={[1.6, 0.2, 0.04]} />
          <meshStandardMaterial {...steelMaterial} />
        </mesh>

        {/* Simulación de huecos (tinas) usando planos oscuros */}
        <mesh position={[-0.4, 0.151, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.6, 0.6]} />
          <meshStandardMaterial color='#455a64' />
        </mesh>
        <mesh position={[0.4, 0.151, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.6, 0.6]} />
          <meshStandardMaterial color='#455a64' />
        </mesh>
      </group>

      {/* --- Grifería --- */}
      <group position={[0, 1.1, -0.35]}>
        {/* Base grifo */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.2, 0.1, 0.1]} />
          <meshStandardMaterial color='#eceff1' />
        </mesh>
        {/* Cuello de ganso (simplificado) */}
        <mesh position={[0, 0.2, 0.1]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial color='#eceff1' />
        </mesh>
      </group>

      {/* --- Patas con refuerzos --- */}
      {[
        [-0.7, -0.3],
        [0.7, -0.3],
        [-0.7, 0.3],
        [0.7, 0.3]
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.35, pos[1]]}>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
          <meshStandardMaterial {...steelMaterial} />
        </mesh>
      ))}

      {/* Travesaños inferiores */}
      <mesh position={[0, 0.2, -0.3]}>
        <boxGeometry args={[1.4, 0.03, 0.03]} />
        <meshStandardMaterial {...steelMaterial} />
      </mesh>
      <mesh position={[0, 0.2, 0.3]}>
        <boxGeometry args={[1.4, 0.03, 0.03]} />
        <meshStandardMaterial {...steelMaterial} />
      </mesh>
      <mesh position={[-0.7, 0.2, 0]}>
        <boxGeometry args={[0.03, 0.03, 0.6]} />
        <meshStandardMaterial {...steelMaterial} />
      </mesh>
      <mesh position={[0.7, 0.2, 0]}>
        <boxGeometry args={[0.03, 0.03, 0.6]} />
        <meshStandardMaterial {...steelMaterial} />
      </mesh>
    </group>
  )
}
