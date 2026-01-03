import React from 'react'
import { DoubleSide } from 'three'

export function Shredder({ position = [0, 0, 0], scale = 1 }) {
  const machineColor = '#607d8b' // Blue Grey
  const hopperColor = '#b0bec5' // Light Blue Grey
  const motorColor = '#263238' // Dark
  const safetyColor = '#fbc02d' // Yellow

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* --- Estructura de Soporte (Patas) --- */}
      <group position={[0, 0.6, 0]}>
        {[
          [-0.5, -0.5],
          [0.5, -0.5],
          [-0.5, 0.5],
          [0.5, 0.5]
        ].map((pos, i) => (
          <mesh key={i} position={[pos[0], 0, pos[1]]}>
            <boxGeometry args={[0.1, 1.2, 0.1]} />
            <meshStandardMaterial color={machineColor} />
          </mesh>
        ))}
        {/* Travesaños */}
        <mesh position={[0, -0.3, 0.5]}>
          <boxGeometry args={[1.1, 0.05, 0.05]} />
          <meshStandardMaterial color={machineColor} />
        </mesh>
        <mesh position={[0, -0.3, -0.5]}>
          <boxGeometry args={[1.1, 0.05, 0.05]} />
          <meshStandardMaterial color={machineColor} />
        </mesh>
        <mesh position={[0.5, -0.3, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.1, 0.05, 0.05]} />
          <meshStandardMaterial color={machineColor} />
        </mesh>
        <mesh position={[-0.5, -0.3, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.1, 0.05, 0.05]} />
          <meshStandardMaterial color={machineColor} />
        </mesh>
      </group>

      {/* --- Cámara de Trituración (Cuerpo Principal) --- */}
      <group position={[0, 1.5, 0]}>
        <mesh>
          <boxGeometry args={[1.3, 0.8, 1.3]} />
          <meshStandardMaterial color={machineColor} roughness={0.4} />
        </mesh>

        {/* Detalles de pernos/tapas laterales */}
        <mesh position={[0, 0, 0.66]}>
          <boxGeometry args={[1.1, 0.6, 0.05]} />
          <meshStandardMaterial color='#455a64' />
        </mesh>
      </group>

      {/* --- Tolva de Alimentación (Hopper) --- */}
      <group position={[0, 2.3, 0]}>
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <cylinderGeometry args={[1.0, 0.5, 0.8, 4]} />
          <meshStandardMaterial color={hopperColor} side={DoubleSide} metalness={0.5} />
        </mesh>
        {/* Borde de seguridad */}
        <mesh position={[0, 0.4, 0]} rotation={[0, Math.PI / 4, 0]}>
          <torusGeometry args={[1.0, 0.05, 4, 4]} />
          <meshStandardMaterial color={safetyColor} />
        </mesh>
      </group>

      {/* --- Sistema de Motorización --- */}
      <group position={[0.8, 1.5, 0]}>
        {/* Caja de engranajes */}
        <mesh position={[-0.1, 0, 0]}>
          <boxGeometry args={[0.4, 0.6, 0.6]} />
          <meshStandardMaterial color='#37474f' />
        </mesh>
        {/* Motor */}
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.8, 16]} />
          <meshStandardMaterial color={motorColor} />
        </mesh>
        {/* Caja de conexiones motor */}
        <mesh position={[0.6, 0.3, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color='#cfd8dc' />
        </mesh>
      </group>

      {/* --- Panel de Control --- */}
      <group position={[0, 1.4, 0.7]}>
        <mesh rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.4, 0.5, 0.15]} />
          <meshStandardMaterial color='#eeeeee' />
        </mesh>
        {/* Botón Paro de Emergencia */}
        <mesh position={[0, 0.1, 0.08]} rotation={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
          <meshStandardMaterial color='red' />
        </mesh>
      </group>

      {/* --- Salida Inferior --- */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.5, 16]} />
        <meshStandardMaterial color='#263238' />
      </mesh>
    </group>
  )
}
