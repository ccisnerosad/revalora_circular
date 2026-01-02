import { useRef, useState } from 'react'
import { Tooltip } from './Tooltip'
import { Dimensions } from './Dimensions'
import * as THREE from 'three'

export function Zone({ data, isSelected, isAnySelected, onSelect }) {
  const meshRef = useRef()
  const [hovered, setHover] = useState(false)

  const { w, h, d, x, y, z, color, name, desc, rotation, medidas, altura } = data

  // Lógica de transparencia:
  // - Si esta zona está seleccionada: Opaca
  // - Si no hay nada seleccionado: Opaca (normal)
  // - Si hay otra zona seleccionada: Transparente (fantasma)
  const isGhost = isAnySelected && !isSelected
  const opacity = isGhost ? 0.1 : hovered || isSelected ? 0.9 : 0.8
  const materialColor = isGhost ? '#444444' : hovered || isSelected ? '#ffaa00' : color

  return (
    <group position={[x, y, z]} rotation={rotation ? [rotation[0], rotation[1], rotation[2]] : [0, 0, 0]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          setHover(false)
          document.body.style.cursor = 'auto'
        }}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={materialColor} transparent opacity={opacity} roughness={0.8} metalness={0.2} depthWrite={!isGhost} />
      </mesh>

      {/* Bordes para mejor definición - Ocultar si es fantasma */}
      {!isGhost && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
          <lineBasicMaterial color='black' opacity={0.2} transparent />
        </lineSegments>
      )}

      {/* Cotas Arquitectónicas: Mostrar si está seleccionada O si hay hover (y no hay otra selección activa) */}
      {(isSelected || (hovered && !isAnySelected)) && medidas && <Dimensions w={w} h={h} d={d} medidas={medidas} showHeight={altura} />}

      {/* Tooltip: Mostrar solo en hover si no es fantasma Y NO está seleccionada */}
      {!isGhost && !isSelected && <Tooltip name={name} desc={desc} visible={hovered} />}
    </group>
  )
}
