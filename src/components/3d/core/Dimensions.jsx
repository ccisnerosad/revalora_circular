import { Text } from '@react-three/drei'

export function Dimensions({ w, h, d, medidas, showHeight }) {
  const fontSize = 0.4
  const color = '#ffffff'
  const lineColor = '#ffffff'

  return (
    <group>
      {/* Cota de Ancho (X) */}
      <group position={[0, h / 2 + 0.1, d / 2 + 0.5]}>
        <Text position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={fontSize} color={color} anchorX='center' anchorY='middle'>
          {medidas[0]}
        </Text>
        <mesh position={[0, 0, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w, 0.05]} />
          <meshBasicMaterial color={lineColor} />
        </mesh>
      </group>

      {/* Cota de Profundidad (Z) */}
      <group position={[w / 2 + 0.5, h / 2 + 0.1, 0]}>
        <Text position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} fontSize={fontSize} color={color} anchorX='center' anchorY='middle'>
          {medidas[1]}
        </Text>
        <mesh position={[0.2, 0, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
          <planeGeometry args={[d, 0.05]} />
          <meshBasicMaterial color={lineColor} />
        </mesh>
      </group>

      {/* Cota de Altura (Y) - Solo si showHeight es true */}
      {showHeight && (
        <group position={[-w / 2 - 0.5, 0, d / 2]}>
          <Text position={[-0.5, 0, 0]} rotation={[0, -Math.PI / 4, 0]} fontSize={fontSize} color={color} anchorX='right' anchorY='middle'>
            {medidas[2]}
          </Text>
          {/* Línea vertical completa */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.05, h, 0.05]} />
            <meshBasicMaterial color={lineColor} />
          </mesh>
          {/* Líneas tope superior e inferior */}
          <mesh position={[0, h / 2, 0]}>
            <boxGeometry args={[0.3, 0.05, 0.05]} />
            <meshBasicMaterial color={lineColor} />
          </mesh>
          <mesh position={[0, -h / 2, 0]}>
            <boxGeometry args={[0.3, 0.05, 0.05]} />
            <meshBasicMaterial color={lineColor} />
          </mesh>
        </group>
      )}
    </group>
  )
}
