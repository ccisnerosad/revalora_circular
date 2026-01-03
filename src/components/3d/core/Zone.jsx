import { useRef, useState } from 'react'
import { Dimensions } from './Dimensions'
import * as THREE from 'three'

export function Zone({ data, isSelected, isAnySelected, onSelect, onHover, interior, viewMode }) {
  const meshRef = useRef()
  const [hovered, setHover] = useState(false)

  const { w, h, d, x, y, z, color, name, desc, rotation, medidas, altura } = data

  // Lógica de transparencia:
  // - Si estamos en modo interior y esta es la zona seleccionada: Muy transparente (casi invisible)
  // - Si esta zona está seleccionada: Opaca
  // - Si no hay nada seleccionado: Opaca (normal)
  // - Si hay otra zona seleccionada: Transparente (fantasma)

  const isInteriorView = isSelected && viewMode === 'interior'
  const isGhost = isAnySelected && !isSelected

  const opacity = isInteriorView ? 0.05 : isGhost ? 0.1 : hovered || isSelected ? 0.9 : 0.8
  const materialColor = isGhost ? '#444444' : hovered || isSelected ? '#ffaa00' : color
  const showEdges = !isGhost && !isInteriorView

  return (
    <group position={[x, y, z]} rotation={rotation ? [rotation[0], rotation[1], rotation[2]] : [0, 0, 0]}>
      <mesh
        ref={meshRef}
        onDoubleClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
          onHover(data)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          setHover(false)
          onHover(null)
          document.body.style.cursor = 'auto'
        }}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={materialColor}
          transparent
          opacity={opacity}
          roughness={0.8}
          metalness={0.2}
          depthWrite={!isGhost && !isInteriorView}
          side={isInteriorView ? THREE.DoubleSide : THREE.FrontSide}
        />
      </mesh>

      {/* Bordes para mejor definición - Ocultar si es fantasma o vista interior */}
      {showEdges && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
          <lineBasicMaterial color='black' opacity={0.2} transparent />
        </lineSegments>
      )}

      {/* Cotas Arquitectónicas: Mostrar si está seleccionada O si hay hover (y no hay otra selección activa) */}
      {/* Ocultar cotas en vista interior para limpiar la vista */}
      {(isSelected || (hovered && !isAnySelected)) && !isInteriorView && medidas && <Dimensions w={w} h={h} d={d} medidas={medidas} showHeight={altura !== undefined ? altura : true} />}

      {/* Renderizar interior si corresponde - Ajustado al piso (y = -h/2) */}
      {isInteriorView && interior && <group position={[0, -h / 2, 0]}>{interior}</group>}
    </group>
  )
}
