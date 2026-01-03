import React from 'react'

export function GrinderMachine({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  // Molino industrial con tolva, cámara de molienda y motor
  const machineColor = '#455a64' // Gris oscuro maquinaria
  const hopperColor = '#90a4ae' // Gris claro tolva
  const motorColor = '#263238' // Negro motor

  return (
    <group position={position} rotation={rotation}>
      {/* --- Estructura Base --- */}
      <group position={[0, 0.4, 0]}>
        {/* Patas robustas */}
        <mesh position={[-0.5, 0, -0.5]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color={machineColor} />
        </mesh>
        <mesh position={[0.5, 0, -0.5]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color={machineColor} />
        </mesh>
        <mesh position={[-0.5, 0, 0.5]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color={machineColor} />
        </mesh>
        <mesh position={[0.5, 0, 0.5]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color={machineColor} />
        </mesh>
        {/* Plataforma de soporte */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.2, 0.1, 1.2]} />
          <meshStandardMaterial color={machineColor} />
        </mesh>
      </group>

      {/* --- Cámara de Molienda --- */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color={machineColor} />
      </mesh>

      {/* --- Tolva de Alimentación (Hopper) --- */}
      <group position={[0, 1.7, 0]}>
        {/* Parte cónica invertida */}
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.3, 0.6, 4]} />
          <meshStandardMaterial color={hopperColor} />
        </mesh>
        {/* Borde superior */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.2, 0.1, 1.2]} />
          <meshStandardMaterial color={hopperColor} />
        </mesh>
      </group>

      {/* --- Sistema Motriz --- */}
      <group position={[0.7, 1.1, 0]}>
        {/* Motor eléctrico */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.6, 16]} />
          <meshStandardMaterial color={motorColor} />
        </mesh>
        {/* Caja de conexiones */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color='#cfd8dc' />
        </mesh>
        {/* Guarda de correas (conexión motor-cámara) */}
        <mesh position={[-0.3, 0, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.3]} />
          <meshStandardMaterial color='#37474f' />
        </mesh>
      </group>

      {/* --- Salida de Material (Chute) --- */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.4, 4]} />
        <meshStandardMaterial color={hopperColor} />
      </mesh>

      {/* --- Panel de Control --- */}
      <group position={[0, 1.2, 0.65]}>
        <mesh>
          <boxGeometry args={[0.3, 0.4, 0.1]} />
          <meshStandardMaterial color='#eceff1' />
        </mesh>
        {/* Botones */}
        <mesh position={[0, 0.1, 0.06]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color='green' emissive='green' emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, -0.1, 0.06]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color='red' />
        </mesh>
      </group>
    </group>
  )
}
