import React from 'react'

export function HeatSealer({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.4, 0.1, 0.3]} />
        <meshStandardMaterial color='#37474f' />
      </mesh>

      {/* Brazo sellador */}
      <group position={[0, 0.1, -0.1]} rotation={[0.2, 0, 0]}>
        <mesh position={[0, 0.02, 0.1]}>
          <boxGeometry args={[0.35, 0.04, 0.25]} />
          <meshStandardMaterial color='#ff7043' />
        </mesh>
        {/* Mango */}
        <mesh position={[0, 0.05, 0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color='#000' />
        </mesh>
      </group>
    </group>
  )
}
