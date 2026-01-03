import React from 'react'
import { Tank } from '@components/3d/assets/Tank'
import { PumpSkid } from '@components/3d/assets/PumpSkid'
import { Shredder } from '@components/3d/assets/Shredder'
import { ControlPanel } from '@components/3d/assets/ControlPanel'
import { BIOGESTION_MODULE } from '../../../data/interiors'

export function BiogestionInterior() {
  return (
    <group>
      {/* Luces interiores para resaltar los equipos */}
      <pointLight position={[0, 4, 0]} intensity={0.6} distance={15} color='#ffffff' />
      <pointLight position={[0, 4, 6]} intensity={0.4} distance={10} color='#ffffff' />
      <pointLight position={[0, 4, -6]} intensity={0.4} distance={10} color='#ffffff' />

      {BIOGESTION_MODULE.map((item) => {
        switch (item.type) {
          case 'PumpSkid':
            return <PumpSkid key={item.id} {...item} />
          case 'ControlPanel':
            return <ControlPanel key={item.id} {...item} />
          case 'Shredder':
            return <Shredder key={item.id} {...item} />
          case 'Tank':
            return <Tank key={item.id} {...item} />
          default:
            return null
        }
      })}
    </group>
  )
}
