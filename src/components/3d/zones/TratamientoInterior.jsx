import React from 'react'
import { CompostPile } from '@components/3d/assets/CompostPile'
import { PalletStack } from '@components/3d/assets/PalletStack'
import { TRATAMIENTO_FINAL_MODULE } from '../../../data/interiors'

export function TratamientoInterior() {
  // Dimensiones de la zona: 10m (ancho) x 14m (largo)
  // Coordenadas locales: X [-5, 5], Z [-7, 7]

  return (
    <group>
      {/* Iluminación cálida para zona de composta */}
      <pointLight position={[0, 5, 0]} intensity={0.4} distance={15} color='#ffaa55' />
      <pointLight position={[0, 5, 5]} intensity={0.3} distance={10} color='#ffffff' />
      <pointLight position={[0, 5, -5]} intensity={0.3} distance={10} color='#ffffff' />

      {/* --- Renderizado de Activos desde Datos --- */}
      {TRATAMIENTO_FINAL_MODULE.map((item) => {
        switch (item.type) {
          case 'CompostPile':
            return <CompostPile key={item.id} {...item} />
          case 'PalletStack':
            return <PalletStack key={item.id} {...item} />
          default:
            return null
        }
      })}

      {/* --- Elementos de Infraestructura (Suelos/Marcas) --- */}

      {/* Área de Volteo / Manejo (Izquierda Delantera) */}
      <group position={[-2.5, 0.02, 4]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.5, 5]} />
          <meshStandardMaterial color='#001133' roughness={0.6} />
        </mesh>
        {/* Texto o marca en el suelo */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1, 1.2, 32]} />
          <meshBasicMaterial color='#ffffff' opacity={0.3} transparent />
        </mesh>
      </group>

      {/* Suelo Área de Tarimas (Derecha Delantera) */}
      <group position={[2.5, 0, 4]}>
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.5, 5]} />
          <meshStandardMaterial color='#c2b280' roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}
