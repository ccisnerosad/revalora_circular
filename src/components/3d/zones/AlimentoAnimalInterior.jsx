import React from 'react'
import { ToteContainer } from '@components/3d/assets/ToteContainer'
import { SortingTable } from '@components/3d/assets/SortingTable'
import { CleaningSink } from '@components/3d/assets/CleaningSink'
import { GrinderMachine } from '@components/3d/assets/GrinderMachine'
import { IndustrialDoor } from '@components/3d/assets/IndustrialDoor'
import { ALIMENTO_ANIMAL_MODULE_A, ALIMENTO_ANIMAL_MODULE_B } from '@data/interiors'

const COMPONENT_MAP = {
  'ToteContainer': ToteContainer,
  'SortingTable': SortingTable,
  'CleaningSink': CleaningSink,
  'GrinderMachine': GrinderMachine,
  'IndustrialDoor': IndustrialDoor
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

function ProductionModule({ data }) {
  return (
    <group>
      {data.map((item, index) => (
        <RenderItem key={item.id || index} item={item} />
      ))}
    </group>
  )
}

export function AlimentoAnimalInterior() {
  // La zona mide 5m x 22m.
  // Los datos en interiors.js asumen que el eje largo es X (0 a 22m).
  // En la escena, el eje largo de la zona es Z (-11 a 11m).
  // Por lo tanto, rotamos 90 grados en Y para alinear X con Z,
  // y desplazamos -11 en Z para centrar el rango 0-22 en -11 a 11.

  return (
    <group position={[0.3, 0, 11.5]} rotation={[0, Math.PI / 2, 0]}>
      <ProductionModule data={ALIMENTO_ANIMAL_MODULE_A} />
      <ProductionModule data={ALIMENTO_ANIMAL_MODULE_B} />
    </group>
  )
}
