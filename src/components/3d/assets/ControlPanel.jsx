import React from 'react'

export function ControlPanel({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Gabinete */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.8, 0.2]} />
        <meshStandardMaterial color='#222' />
      </mesh>
      {/* Pantalla/Botones */}
      <mesh position={[0, 0.2, 0.11]}>
        <planeGeometry args={[0.4, 0.2]} />
        <meshBasicMaterial color='#00ff00' />
      </mesh>
    </group>
  )
}
