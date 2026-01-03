import React from 'react'

export function PumpSkid({ position = [0, 0, 0], scale = 1 }) {
  const frameColor = '#455a64'
  const pumpColor = '#0277bd' // Light Blue
  const motorColor = '#263238' // Dark Grey
  const pipeColor = '#cfd8dc' // Silver/Grey

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* --- Base Skid (Marco de Acero) --- */}
      <group position={[0, 0.1, 0]}>
        {/* Largueros */}
        <mesh position={[0, 0, 0.4]}>
          <boxGeometry args={[1.6, 0.1, 0.1]} />
          <meshStandardMaterial color={frameColor} />
        </mesh>
        <mesh position={[0, 0, -0.4]}>
          <boxGeometry args={[1.6, 0.1, 0.1]} />
          <meshStandardMaterial color={frameColor} />
        </mesh>
        {/* Travesaños */}
        {[-0.7, 0, 0.7].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.9]} />
            <meshStandardMaterial color={frameColor} />
          </mesh>
        ))}
        {/* Placa de suelo (Diamond plate simulado) */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[1.5, 0.02, 0.8]} />
          <meshStandardMaterial color='#546e7a' roughness={0.8} />
        </mesh>
      </group>

      {/* --- Sistema de Bombeo Duplex --- */}
      {[-0.4, 0.4].map((x, i) => (
        <group key={i} position={[x, 0.2, 0]}>
          {/* Motor Eléctrico */}
          <group position={[0, 0.25, -0.2]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.5, 16]} />
              <meshStandardMaterial color={motorColor} />
            </mesh>
            {/* Aletas de enfriamiento */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.19, 0.19, 0.4, 8]} />
              <meshStandardMaterial color={motorColor} wireframe={false} />
            </mesh>
            {/* Caja de conexiones */}
            <mesh position={[0.15, 0.15, 0]}>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshStandardMaterial color='#78909c' />
            </mesh>
          </group>

          {/* Cabezal de Bomba (Voluta) */}
          <group position={[0, 0.25, 0.25]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
              <meshStandardMaterial color={pumpColor} />
            </mesh>
            {/* Brida de Succión (Frontal) */}
            <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
              <meshStandardMaterial color={pumpColor} />
            </mesh>
            {/* Brida de Descarga (Superior) */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
              <meshStandardMaterial color={pumpColor} />
            </mesh>
          </group>

          {/* Acoplamiento Motor-Bomba */}
          <mesh position={[0, 0.25, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
            <meshStandardMaterial color='#37474f' />
          </mesh>
        </group>
      ))}

      {/* --- Tuberías (Manifolds) --- */}
      {/* Colector de Descarga (Arriba) */}
      <group position={[0, 0.8, 0.25]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1.4, 16]} />
          <meshStandardMaterial color={pipeColor} />
        </mesh>
        {/* Válvulas de corte */}
        {[-0.4, 0.4].map((x, i) => (
          <group key={i} position={[x, -0.15, 0]}>
            <mesh>
              <cylinderGeometry args={[0.06, 0.06, 0.3, 16]} />
              <meshStandardMaterial color={pipeColor} />
            </mesh>
            {/* Volante de válvula */}
            <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.08, 0.02, 8, 16]} />
              <meshStandardMaterial color='red' />
            </mesh>
          </group>
        ))}
        {/* Salida Principal */}
        <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
          <meshStandardMaterial color={pipeColor} />
        </mesh>
      </group>
    </group>
  )
}
