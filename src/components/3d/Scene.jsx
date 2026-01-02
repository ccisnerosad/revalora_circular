import { Canvas } from '@react-three/fiber'
import { MapControls, Environment, Grid } from '@react-three/drei'
import { useState } from 'react'
import { Zone } from './Zone'
import { Truck } from './Truck'
import { FlowLines } from './FlowLines'
import { ZONES_DATA, TRUCKS_DATA } from '../../data/data'

export default function Scene() {
  const [selectedZone, setSelectedZone] = useState(null)
  const [hoveredZoneData, setHoveredZoneData] = useState(null)
  const [showFlows, setShowFlows] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [showControls, setShowControls] = useState(true)

  const selectedZoneData = selectedZone ? ZONES_DATA.find((z) => z.id === selectedZone) : null

  return (
    <div className='h-full w-full bg-gray-900 relative'>
      <Canvas shadows camera={{ position: [20, 30, 30], fov: 45 }} dpr={[1, 2]} onPointerMissed={() => setSelectedZone(null)}>
        <color attach='background' args={['#1a1a1a']} />

        {/* Iluminación */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
        <Environment preset='city' />

        {/* Controles tipo Mapa/RTS */}
        <MapControls enableDamping dampingFactor={0.05} minDistance={10} maxDistance={100} maxPolarAngle={Math.PI / 2.3} />

        {/* Suelo y Grid */}
        <Grid position={[0, -0.1, 0]} args={[100, 100]} cellSize={1} cellThickness={0.5} cellColor='#444' sectionSize={5} sectionThickness={1} sectionColor='#666' fadeDistance={50} />

        {/* Zonas Arquitectónicas */}
        <group>
          {ZONES_DATA.map((zone) => (
            <Zone
              key={zone.id}
              data={zone}
              isSelected={selectedZone === zone.id}
              isAnySelected={selectedZone !== null}
              onSelect={() => setSelectedZone(zone.id === selectedZone ? null : zone.id)}
              onHover={(data) => setHoveredZoneData(data)}
            />
          ))}
        </group>

        {/* Flota de Camiones */}
        <group>
          {TRUCKS_DATA.map((truck) => (
            <Truck key={truck.id} type={truck.type} position={truck.position} rotation={truck.rotation} />
          ))}
        </group>

        {/* Líneas de Flujo Logístico */}
        {showFlows && <FlowLines />}
      </Canvas>

      {/* Panel de Control (Bottom Left) */}
      <div className='absolute bottom-4 left-4 flex flex-col gap-2 pointer-events-none'>
        {/* Controles de Visibilidad */}
        <div className='bg-black/60 backdrop-blur-md p-3 rounded-lg text-white border border-white/10 pointer-events-auto'>
          <h3 className='text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider'>Visualización</h3>
          <div className='flex flex-col gap-2'>
            <label className='flex items-center gap-2 text-sm cursor-pointer hover:text-yellow-400 transition-colors'>
              <input type='checkbox' checked={showControls} onChange={(e) => setShowControls(e.target.checked)} className='accent-yellow-500' />
              <span>Guía de Controles</span>
            </label>
            <label className='flex items-center gap-2 text-sm cursor-pointer hover:text-yellow-400 transition-colors'>
              <input type='checkbox' checked={showFlows} onChange={(e) => setShowFlows(e.target.checked)} className='accent-yellow-500' />
              <span>Flujo Logístico</span>
            </label>
            <label className='flex items-center gap-2 text-sm cursor-pointer hover:text-yellow-400 transition-colors'>
              <input type='checkbox' checked={showInfo} onChange={(e) => setShowInfo(e.target.checked)} className='accent-yellow-500' />
              <span>Info. Zona</span>
            </label>
          </div>
        </div>

        {/* Guía de Navegación */}
        {showControls && (
          <div className='bg-black/60 backdrop-blur-md p-3 rounded-lg text-white border border-white/10'>
            <h3 className='text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider'>Navegación</h3>
            <ul className='text-xs text-gray-300 space-y-1'>
              <li>
                <span className='text-yellow-500'>Click Izq:</span> Rotar vista
              </li>
              <li>
                <span className='text-yellow-500'>Click Der:</span> Mover mapa
              </li>
              <li>
                <span className='text-yellow-500'>Scroll:</span> Zoom in/out
              </li>
              <li>
                <span className='text-yellow-500'>Doble Click:</span> Seleccionar
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Tooltip Sutil Fijo (Top Left) - Solo si no hay selección activa */}
      {hoveredZoneData && !selectedZone && (
        <div className='absolute top-16 left-4 pointer-events-none animate-in fade-in duration-200'>
          <div className='bg-black/40 backdrop-blur-sm px-4 py-2 rounded border-l-2 border-yellow-500'>
            <h3 className='text-white font-bold text-sm'>{hoveredZoneData.name}</h3>
            <p className='text-gray-300 text-xs'>{hoveredZoneData.desc}</p>
          </div>
        </div>
      )}

      {/* Tarjeta de Información Fija (Top Right) */}
      {selectedZoneData && showInfo && (
        <div className='absolute top-4 right-4 w-80 bg-black/80 backdrop-blur-md border-l-4 border-yellow-500 rounded-lg p-6 text-white shadow-2xl transition-all animate-in slide-in-from-right-10'>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <h2 className='text-2xl font-bold text-white leading-tight'>{selectedZoneData.name}</h2>
              <span className='text-xs font-mono text-yellow-500 uppercase tracking-widest'>Nivel {selectedZoneData.level}</span>
            </div>
            <button onClick={() => setSelectedZone(null)} className='text-gray-400 hover:text-white transition-colors'>
              ✕
            </button>
          </div>

          <p className='text-gray-300 text-sm mb-6 leading-relaxed border-b border-white/10 pb-4'>{selectedZoneData.desc}</p>

          {selectedZoneData.medidas && (
            <div className='grid grid-cols-3 gap-4 text-center'>
              <div className='bg-white/5 rounded p-2'>
                <div className='text-xs text-gray-400 mb-1'>Largo</div>
                <div className='font-mono font-bold text-yellow-400'>{selectedZoneData.medidas[0]}</div>
              </div>
              <div className='bg-white/5 rounded p-2'>
                <div className='text-xs text-gray-400 mb-1'>Ancho</div>
                <div className='font-mono font-bold text-yellow-400'>{selectedZoneData.medidas[1]}</div>
              </div>
              <div className='bg-white/5 rounded p-2'>
                <div className='text-xs text-gray-400 mb-1'>Alto</div>
                <div className='font-mono font-bold text-yellow-400'>{selectedZoneData.medidas[2]}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
