import React from 'react'

export function IndustrialDoor({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  // Puerta industrial ancha (tipo cortina o corrediza)
  // Dimensiones: 3m ancho x 3m alto
  const frameColor = '#37474f'
  const doorColor = '#cfd8dc'

  return (
    <group position={position} rotation={rotation}>
      {/* Marco */}
      <group>
        {/* Poste Izquierdo */}
        <mesh position={[-1.6, 1.5, 0]}>
          <boxGeometry args={[0.2, 3.0, 0.2]} />
          <meshStandardMaterial color={frameColor} />
        </mesh>
        {/* Poste Derecho */}
        <mesh position={[1.6, 1.5, 0]}>
          <boxGeometry args={[0.2, 3.0, 0.2]} />
          <meshStandardMaterial color={frameColor} />
        </mesh>
        {/* Dintel Superior */}
        <mesh position={[0, 3.1, 0]}>
          <boxGeometry args={[3.4, 0.2, 0.2]} />
          <meshStandardMaterial color={frameColor} />
        </mesh>
      </group>

      {/* Hoja de la puerta (Enrollable/Seccional) */}
      <group position={[0, 1.5, 0]}>
        <mesh>
          <boxGeometry args={[3.0, 2.9, 0.05]} />
          <meshStandardMaterial color={doorColor} roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Detalles de secciones horizontales */}
        {[0.5, 0, -0.5, -1.0].map((y, i) => (
          <mesh key={i} position={[0, y, 0.03]}>
            <boxGeometry args={[2.9, 0.02, 0.01]} />
            <meshStandardMaterial color='#90a4ae' />
          </mesh>
        ))}
      </group>

      {/* Señalización de seguridad (opcional) */}
      <mesh position={[0, 3.3, 0.11]}>
        <planeGeometry args={[1, 0.2]} />
        <meshStandardMaterial color='#fbc02d' />
      </mesh>
    </group>
  )
}
