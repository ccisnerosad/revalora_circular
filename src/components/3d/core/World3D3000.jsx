import React, { memo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { MapControls, Environment, Grid } from '@react-three/drei'
import * as THREE from 'three'
import { Zone } from './Zone'
import { Truck } from './Truck'
import { FlowLines } from './FlowLines'
import { BiogestionInterior } from '@components/3d/zones/BiogestionInterior'
import { TratamientoInterior } from '@components/3d/zones/TratamientoInterior'
import { AlimentoHumanoInterior } from '@components/3d/zones/AlimentoHumanoInterior'
import { AlimentoAnimalInterior } from '@components/3d/zones/AlimentoAnimalInterior'
import { ZONES_DATA_3000, TRUCKS_DATA_3000 } from '@data/data3000'

function CameraHandler({ viewMode, targetPosition, controlsRef }) {
  const isAnimating = useRef(false)

  // Detectar cambio de modo para iniciar animación
  useEffect(() => {
    if (viewMode === 'interior' && targetPosition) {
      isAnimating.current = true
    }
  }, [viewMode, targetPosition])

  useFrame((state, delta) => {
    if (isAnimating.current && viewMode === 'interior' && targetPosition && controlsRef.current) {
      const targetVec = new THREE.Vector3(...targetPosition)
      // Zoom in: Posición elevada y centrada
      const desiredCameraPos = targetVec.clone().add(new THREE.Vector3(0, 12, 8))

      // Interpolación suave
      const step = 4 * delta
      state.camera.position.lerp(desiredCameraPos, step)
      controlsRef.current.target.lerp(targetVec, step)
      controlsRef.current.update()

      // Detener animación cuando estemos cerca
      if (state.camera.position.distanceTo(desiredCameraPos) < 0.1) {
        isAnimating.current = false
      }
    }
  })
  return null
}

const World3D3000 = memo(function World3D3000({ selectedZone, onSelect, onHover, showFlows, viewMode, targetPosition }) {
  const controlsRef = useRef()

  return (
    <>
      <CameraHandler viewMode={viewMode} targetPosition={targetPosition} controlsRef={controlsRef} />
      <color attach='background' args={['#1a1a1a']} />

      {/* Iluminación */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
      <Environment preset='city' />

      {/* Controles tipo Mapa/RTS */}
      <MapControls ref={controlsRef} enableDamping dampingFactor={0.05} minDistance={5} maxDistance={100} maxPolarAngle={Math.PI / 2.3} />

      {/* Suelo y Grid */}
      <Grid position={[0, -0.1, 0]} args={[100, 100]} cellSize={1} cellThickness={0.5} cellColor='#444' sectionSize={5} sectionThickness={1} sectionColor='#666' fadeDistance={50} />

      {/* Zonas Arquitectónicas 3000m2 */}
      <group>
        {ZONES_DATA_3000.map((zone) => (
          <Zone
            key={zone.id}
            data={zone}
            isSelected={selectedZone === zone.id}
            isAnySelected={selectedZone !== null}
            onSelect={() => onSelect(zone.id)}
            onHover={onHover}
            interior={
              zone.id === 'humano_1' || zone.id === 'humano_2' ? (
                <AlimentoHumanoInterior />
              ) : zone.id === 'animal_1' || zone.id === 'animal_2' ? (
                <AlimentoAnimalInterior />
              ) : zone.id === 'biogestion_1' || zone.id === 'biogestion_2' ? (
                <BiogestionInterior />
              ) : zone.id === 'tratamiento_1' || zone.id === 'tratamiento_2' ? (
                <TratamientoInterior />
              ) : null
            }
            viewMode={viewMode}
          />
        ))}
      </group>

      {/* Flota de Camiones */}
      <group>
        {TRUCKS_DATA_3000.map((truck) => (
          <Truck key={truck.id} type={truck.type} position={truck.position} rotation={truck.rotation} />
        ))}
      </group>

      {/* Líneas de Flujo Logístico */}
      {showFlows && <FlowLines />}
    </>
  )
})

export default World3D3000
