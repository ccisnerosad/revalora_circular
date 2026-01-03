import React from 'react'
import { ShelvingUnit } from '@components/3d/assets/ShelvingUnit'
import { ColdRoom } from '@components/3d/assets/ColdRoom'
import { PackingTable } from '@components/3d/assets/PackingTable'
import { IndustrialSink } from '@components/3d/assets/IndustrialSink'
import { HeatSealer } from '@components/3d/assets/HeatSealer'
import { OrganicBin } from '@components/3d/assets/OrganicBin'
import { ALIMENTO_HUMANO_MODULE_A, ALIMENTO_HUMANO_MODULE_B } from '@data/interiors'

const COMPONENT_MAP = {
  'ColdRoom': ColdRoom,
  'ShelvingUnit': ShelvingUnit,
  'PackingTable': PackingTable,
  'IndustrialSink': IndustrialSink,
  'HeatSealer': HeatSealer,
  'OrganicBin': OrganicBin
}

function RenderItem({ item }) {
  const { type, position, rotation, args, color } = item

  if (type === 'Box') {
    return (
      <mesh position={position} rotation={rotation}>
        <boxGeometry args={args} />
        <meshStandardMaterial color={color} />
      </mesh>
    )
  }

  const Component = COMPONENT_MAP[type]
  if (!Component) return null

  return <Component position={position} rotation={rotation} />
}

function ProductionModule({ data, position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {data.map((item, index) => (
        <RenderItem key={item.id || index} item={item} />
      ))}
    </group>
  )
}

export function AlimentoHumanoInterior() {
  // La zona mide 5m x 22m.
  // Dividimos en 2 módulos idénticos de 11m de largo cada uno.
  // Centros en Z: -5.5 y +5.5

  return (
    <group>
      {/* Iluminación general blanca/clínica */}
      <ambientLight intensity={0.5} color='#ffffff' />
      <pointLight position={[0, 4, -5.5]} intensity={0.6} distance={12} color='#ffffff' />
      <pointLight position={[0, 4, 5.5]} intensity={0.6} distance={12} color='#ffffff' />

      {/* Módulo A (Posterior) */}
      <ProductionModule data={ALIMENTO_HUMANO_MODULE_A} position={[0, 0, -5.5]} />

      {/* Módulo B (Anterior) */}
      <ProductionModule data={ALIMENTO_HUMANO_MODULE_B} position={[0, 0, 5.5]} />
    </group>
  )
}
