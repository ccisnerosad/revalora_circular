import React from 'react'

export function ColdRoom({ position = [0, 0, 0] }) {
  // Dimensiones: 3m ancho x 3m alto x 5m fondo
  // Puerta en la cara frontal (3x3)
  return (
    <group position={position}>
      {/* Estructura principal */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[3, 3, 5]} />
        <meshStandardMaterial color='#e0f7fa' roughness={0.2} />
      </mesh>

      {/* Puerta corredera */}
      <mesh position={[0, 1.1, 2.51]}>
        <boxGeometry args={[1.5, 2.2, 0.1]} />
        <meshStandardMaterial color='#b0bec5' metalness={0.3} />
      </mesh>

      {/* Riel de la puerta */}
      <mesh position={[0, 2.3, 2.55]}>
        <boxGeometry args={[2.8, 0.1, 0.1]} />
        <meshStandardMaterial color='#555' />
      </mesh>

      {/* Panel de control / Termómetro */}
      <mesh position={[1.0, 1.6, 2.51]}>
        <boxGeometry args={[0.3, 0.4, 0.05]} />
        <meshStandardMaterial color='#333' />
      </mesh>
      {/* Pantalla del termómetro */}
      <mesh position={[1.0, 1.65, 2.54]}>
        <planeGeometry args={[0.2, 0.1]} />
        <meshBasicMaterial color='#00ff00' />
      </mesh>
    </group>
  )
}
