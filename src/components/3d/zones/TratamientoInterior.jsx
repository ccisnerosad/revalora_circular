import React from 'react'
import { CompostPile } from '@components/3d/assets/CompostPile'
import { PalletStack } from '@components/3d/assets/PalletStack'

export function TratamientoInterior() {
  // Dimensiones de la zona: 10m (ancho) x 14m (largo)
  // Coordenadas locales: X [-5, 5], Z [-7, 7]

  return (
    <group>
      {/* Iluminación cálida para zona de composta */}
      <pointLight position={[0, 5, 0]} intensity={0.4} distance={15} color='#ffaa55' />
      <pointLight position={[0, 5, 5]} intensity={0.3} distance={10} color='#ffffff' />
      <pointLight position={[0, 5, -5]} intensity={0.3} distance={10} color='#ffffff' />

      {/* --- Parte Trasera (Z negativa) --- */}

      {/* 3 Hileras de Camas de Composta */}
      {/* Distribuidas en el ancho (X: -3, 0, 3) y ocupando el largo trasero */}
      <CompostPile position={[-3, 0, -2.5]} length={8} width={2.2} />
      <CompostPile position={[0, 0, -2.5]} length={8} width={2.2} />
      <CompostPile position={[3, 0, -2.5]} length={8} width={2.2} />

      {/* --- Parte Delantera (Z positiva) --- */}

      {/* Área de Volteo / Manejo (Izquierda Delantera) */}
      {/* Representada por un suelo marcado y espacio libre para maquinaria */}
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

      {/* Área de Tarimas (Derecha Delantera) */}
      <group position={[2.5, 0, 4]}>
        {/* Suelo del área */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.5, 5]} />
          <meshStandardMaterial color='#c2b280' roughness={0.8} />
        </mesh>

        {/* Pilas de tarimas distribuidas */}
        <PalletStack position={[-1, 0, -1]} />
        <PalletStack position={[1, 0, -1]} />
        <PalletStack position={[-1, 0, 1]} />
        <PalletStack position={[1, 0, 1]} />
      </group>
    </group>
  )
}
