import React from 'react'
import { Tank } from '@components/3d/assets/Tank'
import { PumpSkid } from '@components/3d/assets/PumpSkid'
import { Shredder } from '@components/3d/assets/Shredder'
import { ControlPanel } from '@components/3d/assets/ControlPanel'

export function BiogestionInterior() {
  // Distribución de 6 líneas de producción (2 filas x 3 columnas)
  // El espacio es de 10m de ancho x 14m de largo.

  // Columnas en X (Ancho 10m): -3, 0, 3
  const cols = [-3, 0, 3]
  // Filas en Z (Largo 14m): -3.5 (Fondo), 3.5 (Frente)
  const rows = [-3.5, 3.5]

  return (
    <group>
      {/* Luces interiores para resaltar los equipos */}
      <pointLight position={[0, 4, 0]} intensity={0.6} distance={15} color='#ffffff' />
      <pointLight position={[0, 4, 6]} intensity={0.4} distance={10} color='#ffffff' />
      <pointLight position={[0, 4, -6]} intensity={0.4} distance={10} color='#ffffff' />

      {rows.map((zRow, rowIndex) => (
        <group key={`row-${rowIndex}`} position={[0, 0, zRow]}>
          {cols.map((xCol, colIndex) => (
            <group key={`col-${colIndex}`} position={[xCol, 0, 0]}>
              {/* Skid de Bombeo (Frente del grupo) */}
              <PumpSkid position={[0, 0, 2]} scale={0.8} />

              {/* Tablero de Control (Lateral al Skid) */}
              <ControlPanel position={[0.6, 1, 2.2]} rotation={[0, -Math.PI / 2, 0]} />

              {/* Triturador (Centro del grupo) */}
              <Shredder position={[0, 0, 0.5]} scale={0.9} />

              {/* Tanque Pulmón/Mezclador (Fondo del grupo) */}
              <Tank position={[0, 0, -1.5]} scale={0.9} color='#cc3333' />
            </group>
          ))}
        </group>
      ))}
    </group>
  )
}
