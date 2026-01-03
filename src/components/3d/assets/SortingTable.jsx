import React from 'react'

export function SortingTable({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  // Mesa de acero inoxidable con repisa inferior y backsplash
  const steelMaterial = { color: '#cfd8dc', metalness: 0.7, roughness: 0.2 }

  return (
    <group position={position} rotation={rotation}>
      {/* --- Superficie de Trabajo --- */}
      <group position={[0, 0.9, 0]}>
        {/* Tablero principal */}
        <mesh>
          <boxGeometry args={[2.4, 0.05, 0.8]} />
          <meshStandardMaterial {...steelMaterial} />
        </mesh>
        {/* Backsplash (Borde trasero para evitar caídas) */}
        <mesh position={[0, 0.075, -0.38]}>
          <boxGeometry args={[2.4, 0.1, 0.02]} />
          <meshStandardMaterial {...steelMaterial} />
        </mesh>
        {/* Bordes laterales */}
        <mesh position={[-1.19, 0.05, 0]}>
          <boxGeometry args={[0.02, 0.05, 0.8]} />
          <meshStandardMaterial {...steelMaterial} />
        </mesh>
        <mesh position={[1.19, 0.05, 0]}>
          <boxGeometry args={[0.02, 0.05, 0.8]} />
          <meshStandardMaterial {...steelMaterial} />
        </mesh>
      </group>

      {/* --- Estructura --- */}
      {/* Patas Tubulares */}
      {[
        [-1.1, -0.3],
        [1.1, -0.3],
        [-1.1, 0.3],
        [1.1, 0.3]
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.45, pos[1]]}>
          <cylinderGeometry args={[0.03, 0.03, 0.9, 8]} />
          <meshStandardMaterial {...steelMaterial} />
        </mesh>
      ))}

      {/* --- Repisa Inferior --- */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2.2, 0.02, 0.6]} />
        <meshStandardMaterial {...steelMaterial} />
      </mesh>

      {/* --- Detalles Operativos --- */}
      {/* Tapete de corte / Zona de trabajo (Visual) */}
      <mesh position={[0, 0.93, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 0.6]} />
        <meshStandardMaterial color='#37474f' />
      </mesh>
    </group>
  )
}
