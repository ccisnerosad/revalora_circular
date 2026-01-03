import React from 'react'

export function ControlPanel({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const cabinetColor = '#eceff1' // Light Grey RAL 7035
  const screenColor = '#212121' // Dark screen
  const standColor = '#37474f' // Dark Grey Stand

  return (
    <group position={position} rotation={rotation}>
      {/* --- Gabinete Principal --- */}
      <group position={[0, 0, 0]}>
        {/* Caja */}
        <mesh>
          <boxGeometry args={[0.8, 1.0, 0.3]} />
          <meshStandardMaterial color={cabinetColor} roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Puerta (Borde sutil) */}
        <mesh position={[0, 0, 0.155]}>
          <boxGeometry args={[0.78, 0.98, 0.01]} />
          <meshStandardMaterial color={cabinetColor} />
        </mesh>
        {/* Bisagras */}
        <mesh position={[-0.38, 0.3, 0.16]}>
          <boxGeometry args={[0.02, 0.08, 0.02]} />
          <meshStandardMaterial color='#546e7a' />
        </mesh>
        <mesh position={[-0.38, -0.3, 0.16]}>
          <boxGeometry args={[0.02, 0.08, 0.02]} />
          <meshStandardMaterial color='#546e7a' />
        </mesh>
        {/* Manija */}
        <mesh position={[0.35, 0, 0.17]}>
          <boxGeometry args={[0.02, 0.15, 0.04]} />
          <meshStandardMaterial color='#263238' />
        </mesh>
      </group>

      {/* --- Interfaz de Usuario (HMI) --- */}
      <group position={[0, 0.2, 0.16]}>
        {/* Marco Pantalla */}
        <mesh>
          <boxGeometry args={[0.5, 0.35, 0.02]} />
          <meshStandardMaterial color='#424242' />
        </mesh>
        {/* Pantalla Brillante */}
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[0.45, 0.3]} />
          <meshStandardMaterial color={screenColor} emissive='#00e676' emissiveIntensity={0.1} roughness={0.2} />
        </mesh>
      </group>

      {/* --- Botonera --- */}
      <group position={[0, -0.25, 0.16]}>
        {/* Botón Start (Verde) */}
        <mesh position={[-0.2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
          <meshStandardMaterial color='#00c853' />
        </mesh>
        {/* Botón Stop (Rojo) */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
          <meshStandardMaterial color='#d50000' />
        </mesh>
        {/* Selector (Negro) */}
        <mesh position={[0.2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.03, 0.08, 0.04]} />
          <meshStandardMaterial color='#212121' />
        </mesh>
        {/* Paro de Emergencia (Seta Roja) */}
        <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
          <meshStandardMaterial color='#ff0000' />
        </mesh>
        <mesh position={[0, -0.15, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.14, 0.14, 0.02]} />
          <meshStandardMaterial color='#ffeb3b' />
        </mesh>
      </group>

      {/* --- Baliza de Señalización (Torreta) --- */}
      <group position={[0.25, 0.5, 0]}>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 16]} />
          <meshStandardMaterial color='green' emissive='green' emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 16]} />
          <meshStandardMaterial color='#ff9800' />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 16]} />
          <meshStandardMaterial color='red' />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
          <meshStandardMaterial color='#37474f' />
        </mesh>
      </group>

      {/* --- Soporte de Piso (Pedestal) --- */}
      <group position={[0, -1.0, 0]}>
        <mesh>
          <boxGeometry args={[0.15, 1.0, 0.15]} />
          <meshStandardMaterial color={standColor} />
        </mesh>
        {/* Base al suelo */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[0.4, 0.05, 0.4]} />
          <meshStandardMaterial color={standColor} />
        </mesh>
      </group>
    </group>
  )
}
