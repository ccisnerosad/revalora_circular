import React from 'react'

export function OrganicBin({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  // Dimensiones: 1.2m x 1.2m (Contenedor grande industrial)
  return (
    <group position={position} rotation={rotation}>
      {/* Cuerpo */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color='#33691e' />
      </mesh>

      {/* Tapa */}
      <mesh position={[0, 1.22, 0]}>
        <boxGeometry args={[1.25, 0.05, 1.25]} />
        <meshStandardMaterial color='#1b5e20' />
      </mesh>

      {/* Etiqueta "Orgánico" */}
      <mesh position={[0, 0.8, 0.61]}>
        <planeGeometry args={[0.8, 0.4]} />
        <meshBasicMaterial color='#fff' />
      </mesh>
    </group>
  )
}
