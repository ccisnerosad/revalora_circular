import { Canvas } from '@react-three/fiber'
import { useState, useEffect, useMemo, useCallback } from 'react'
import World3D from './World3D'
import { ZONES_DATA_PB, ZONES_DATA_PA } from '@data/data'

export default function Scene() {
  const [selectedZone, setSelectedZone] = useState(null)
  const [hoveredZoneData, setHoveredZoneData] = useState(null)
  const [showFlows, setShowFlows] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [viewMode, setViewMode] = useState('orbit')

  const selectedZoneData = selectedZone ? [...ZONES_DATA_PB, ...ZONES_DATA_PA].find((z) => z.id === selectedZone) : null

  const targetPosition = useMemo(() => {
    return selectedZoneData ? [selectedZoneData.x, selectedZoneData.y, selectedZoneData.z] : null
  }, [selectedZoneData])

  // Callbacks estables para evitar re-renders del World3D
  const handleSelect = useCallback((id) => {
    setSelectedZone((prev) => {
      const newId = prev === id ? null : id
      if (!newId) {
        // Limpiar URL al deseleccionar
        const url = new URL(window.location)
        url.searchParams.delete('interior')
        window.history.pushState({}, '', url)
        setViewMode('orbit')
      }
      return newId
    })
  }, [])

  const handleHover = useCallback((data) => {
    setHoveredZoneData(data)
  }, [])

  // Manejo de URL y navegación
  useEffect(() => {
    // Leer parámetro al cargar
    const params = new URLSearchParams(window.location.search)
    const interiorId = params.get('interior')
    if (interiorId) {
      setSelectedZone(interiorId)
      setViewMode('interior')
    }

    // Manejar navegación del navegador (atrás/adelante)
    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search)
      const id = p.get('interior')
      if (id) {
        setSelectedZone(id)
        setViewMode('interior')
      } else {
        setSelectedZone(null)
        setViewMode('orbit')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleEnterInterior = () => {
    setViewMode('interior')
    // Actualizar URL
    const url = new URL(window.location)
    url.searchParams.set('interior', selectedZone)
    window.history.pushState({}, '', url)
  }

  const handleClose = () => {
    setSelectedZone(null)
    setViewMode('orbit')
    // Limpiar URL
    const url = new URL(window.location)
    url.searchParams.delete('interior')
    window.history.pushState({}, '', url)
  }

  return (
    <div className='h-full w-full bg-gray-900 relative'>
      <Canvas shadows camera={{ position: [20, 30, 30], fov: 45 }} dpr={[1, 2]} onPointerMissed={() => viewMode !== 'interior' && handleClose()}>
        <World3D selectedZone={selectedZone} onSelect={handleSelect} onHover={handleHover} showFlows={showFlows} viewMode={viewMode} targetPosition={targetPosition} />
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

      {/* Tooltip Sutil Fijo (Top Right) - Solo si no hay selección activa */}
      {hoveredZoneData && !selectedZone && (
        <div className='absolute top-4 right-4 pointer-events-none animate-in fade-in duration-200'>
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
            <button onClick={handleClose} className='text-gray-400 hover:text-white transition-colors'>
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

          {selectedZoneData.interior && viewMode !== 'interior' && (
            <button
              onClick={handleEnterInterior}
              className='mt-4 w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors'>
              <span>👁️</span> Ver Interior
            </button>
          )}
        </div>
      )}
    </div>
  )
}
