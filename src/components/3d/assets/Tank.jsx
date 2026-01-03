import React from 'react'

export function Tank({ position = [0, 0, 0], scale = 1, color = '#e0e0e0' }) {
  const tankMaterial = { color: color, metalness: 0.6, roughness: 0.3 }
  const steelMaterial = { color: '#2c3e50', metalness: 0.8, roughness: 0.2 }

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* --- Cuerpo Principal --- */}
      <group position={[0, 2.2, 0]}>
        {/* Cilindro Central */}
        <mesh>
          <cylinderGeometry args={[1.1, 1.1, 3.0, 32]} />
          <meshStandardMaterial {...tankMaterial} />
        </mesh>

        {/* Cúpula Superior */}
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[1.1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial {...tankMaterial} />
        </mesh>

        {/* Fondo Cónico (Salida) */}
        <mesh position={[0, -1.5, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[1.1, 0.6, 32]} />
          <meshStandardMaterial {...tankMaterial} />
        </mesh>

        {/* Anillos de Refuerzo (Soldadura/Estructura) */}
        {[-1.4, 0, 1.4].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <torusGeometry args={[1.12, 0.03, 8, 64]} />
            <meshStandardMaterial {...tankMaterial} color='#bdc3c7' />
          </mesh>
        ))}
      </group>

      {/* --- Estructura de Soporte --- */}
      {/* Patas */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <group key={i} rotation={[0, angle, 0]}>
          <mesh position={[0.9, 1.0, 0]} rotation={[0, 0, -0.1]}>
            <cylinderGeometry args={[0.08, 0.08, 2.4, 8]} />
            <meshStandardMaterial {...steelMaterial} />
          </mesh>
          {/* Base de la pata */}
          <mesh position={[1.02, 0.05, 0]}>
            <boxGeometry args={[0.3, 0.1, 0.3]} />
            <meshStandardMaterial {...steelMaterial} />
          </mesh>
        </group>
      ))}

      {/* --- Detalles Industriales --- */}
      {/* Escalera de Acceso */}
      <group position={[-1.3, 1.5, 0]} rotation={[0, 0, 0]}>
        {/* Rieles */}
        <mesh position={[0, 0, -0.25]}>
          <cylinderGeometry args={[0.03, 0.03, 3.5, 8]} />
          <meshStandardMaterial {...steelMaterial} />
        </mesh>
        <mesh position={[0, 0, 0.25]}>
          <cylinderGeometry args={[0.03, 0.03, 3.5, 8]} />
          <meshStandardMaterial {...steelMaterial} />
        </mesh>
        {/* Peldaños */}
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} position={[0, -1.5 + i * 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
            <meshStandardMaterial {...steelMaterial} />
          </mesh>
        ))}
      </group>

      {/* Tubería de Salida Inferior */}
      <group position={[0, 0.4, 0]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
          <meshStandardMaterial {...steelMaterial} />
        </mesh>
        {/* Válvula */}
        <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
          <meshStandardMaterial color='red' />
        </mesh>
      </group>

      {/* Escotilla Superior */}
      <mesh position={[0.5, 3.8, 0.5]} rotation={[0.2, 0, 0.2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial {...steelMaterial} />
      </mesh>
    </group>
  )
}
