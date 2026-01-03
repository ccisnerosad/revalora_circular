import React from 'react'

export function Tank({ position = [0, 0, 0], scale = 1, color = '#cc3333' }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Cuerpo del tanque */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 3, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Tapa superior */}
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Base/Soportes */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.2, 32]} />
        <meshStandardMaterial color='#333' />
      </mesh>
    </group>
  )
}
