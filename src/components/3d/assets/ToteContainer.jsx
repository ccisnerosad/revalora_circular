import React from 'react'

export function ToteContainer({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  // Dimensiones totales: ~1.2m x 1.1m x 1.0m
  const binColor = '#1976d2' // Azul industrial
  const palletColor = '#3e2723' // Madera oscura / Plástico negro

  return (
    <group position={position} rotation={rotation}>
      {/* --- Pallet Base --- */}
      <group position={[0, 0.075, 0]}>
        {/* Tablas superiores */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[1.2, 0.03, 1.0]} />
          <meshStandardMaterial color={palletColor} />
        </mesh>
        {/* Bloques soporte */}
        <mesh position={[-0.5, 0, -0.4]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color={palletColor} />
        </mesh>
        <mesh position={[0.5, 0, -0.4]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color={palletColor} />
        </mesh>
        <mesh position={[-0.5, 0, 0.4]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color={palletColor} />
        </mesh>
        <mesh position={[0.5, 0, 0.4]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color={palletColor} />
        </mesh>
      </group>

      {/* --- Cuerpo del Bin --- */}
      <group position={[0, 0.65, 0]}>
        {/* Paredes principales */}
        <mesh>
          <boxGeometry args={[1.15, 0.9, 0.95]} />
          <meshStandardMaterial color={binColor} roughness={0.4} />
        </mesh>

        {/* Borde superior reforzado */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.2, 0.05, 1.0]} />
          <meshStandardMaterial color={binColor} />
        </mesh>

        {/* Costillas de refuerzo verticales (Visuales) */}
        <mesh position={[-0.58, 0, 0]}>
          <boxGeometry args={[0.02, 0.8, 0.1]} />
          <meshStandardMaterial color={binColor} />
        </mesh>
        <mesh position={[0.58, 0, 0]}>
          <boxGeometry args={[0.02, 0.8, 0.1]} />
          <meshStandardMaterial color={binColor} />
        </mesh>
        <mesh position={[0, 0, 0.48]}>
          <boxGeometry args={[0.1, 0.8, 0.02]} />
          <meshStandardMaterial color={binColor} />
        </mesh>
        <mesh position={[0, 0, -0.48]}>
          <boxGeometry args={[0.1, 0.8, 0.02]} />
          <meshStandardMaterial color={binColor} />
        </mesh>

        {/* Contenido (Simulado) */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.1, 0.02, 0.9]} />
          <meshStandardMaterial color='#5d4037' roughness={1} />
        </mesh>
      </group>
    </group>
  )
}
