import { Html } from '@react-three/drei'

export function Tooltip({ name, desc, visible }) {
  if (!visible) return null

  return (
    <Html center distanceFactor={15} zIndexRange={[100, 0]}>
      <div className='pointer-events-none select-none rounded-lg bg-black/80 p-3 text-white backdrop-blur-sm min-w-[200px]'>
        <h3 className='mb-1 text-sm font-bold text-yellow-400'>{name}</h3>
        <p className='text-xs text-gray-200'>{desc}</p>
      </div>
    </Html>
  )
}
