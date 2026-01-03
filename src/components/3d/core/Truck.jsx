import React, { forwardRef } from 'react'

export const Truck = forwardRef(({ type = 'clean', position = [0, 0, 0], rotation = [0, 0, 0], onClick, isSelected }, ref) => {
  const color = type === 'waste' ? '#5d4037' : '#ffffff'
  const cabinColor = '#37474f'
  const chassisColor = '#263238'
  const wheelColor = '#000000'

  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick()
      }}>
      {isSelected && (
        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry args={[0.2]} />
          <meshBasicMaterial color='yellow' />
        </mesh>
      )}
      {/* Chassis */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2.5, 1, 6]} />
        <meshStandardMaterial color={chassisColor} />
      </mesh>

      {/* Cabin */}
      <mesh position={[0, 1.5, 2]}>
        <boxGeometry args={[2.5, 2, 2]} />
        <meshStandardMaterial color={cabinColor} />
      </mesh>

      {/* Cargo Container */}
      <mesh position={[0, 1.75, -1]}>
        <boxGeometry args={[2.4, 2.5, 3.8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Wheels */}
      <group>
        <mesh position={[1.3, 0.4, 2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.4, 16]} />
          <meshStandardMaterial color={wheelColor} />
        </mesh>
        <mesh position={[-1.3, 0.4, 2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.4, 16]} />
          <meshStandardMaterial color={wheelColor} />
        </mesh>
        <mesh position={[1.3, 0.4, -2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.4, 16]} />
          <meshStandardMaterial color={wheelColor} />
        </mesh>
        <mesh position={[-1.3, 0.4, -2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.4, 16]} />
          <meshStandardMaterial color={wheelColor} />
        </mesh>
      </group>
    </group>
  )
})
