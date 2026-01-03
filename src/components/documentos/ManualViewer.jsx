import React, { useMemo, useState, useEffect } from 'react'

const ManualViewer = ({ content, tocData }) => {
  const [activeSection, setActiveSection] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [fontSize, setFontSize] = useState(1) // 1 = normal, 1.1 = large, 1.2 = xl
  const [currentMatch, setCurrentMatch] = useState(0)
  const [totalMatches, setTotalMatches] = useState(0)

  // Initialize sidebar state based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    // Set initial state
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Parsing logic (Memoized)
  const { sections, parsedBlocks } = useMemo(() => {
    // 1. Clean the content
    let text = content.replace(/^---[\s\S]*?---\s*/, '')
    text = text.replace(/<LayoutFo.*?>/, '').replace(/<\/LayoutFo>/, '')

    const lines = text.split('\n')
    const blocks = []

    // Use provided TOC or empty array
    const toc = tocData || []

    let currentBlock = { type: 'paragraph', content: [] }
    let tableBuffer = []

    const flushBlock = () => {
      if (tableBuffer.length > 0) {
        blocks.push({ type: 'table', content: tableBuffer })
        tableBuffer = []
      }
      if (currentBlock.content.length > 0) {
        blocks.push({ ...currentBlock, content: currentBlock.content.join(' ') })
        currentBlock = { type: 'paragraph', content: [] }
      }
    }

    lines.forEach((line, index) => {
      const trimmed = line.trim()
      if (!trimmed) {
        flushBlock()
        return
      }

      // Check if line matches a TOC entry
      const matchedSection = toc.find((s) => trimmed === s.title || (trimmed.startsWith(s.title) && trimmed.length < s.title.length + 5))

      if (matchedSection) {
        flushBlock()
        blocks.push({
          type: 'header',
          level: matchedSection.level,
          content: matchedSection.title,
          id: matchedSection.id
        })
        return
      }

      // Fallback header detection
      const isMainHeader = /^[A-Z]\.\s+/.test(trimmed) || /^[IVX]+\.\s+/.test(trimmed)
      const isAllCaps = trimmed.length > 4 && trimmed === trimmed.toUpperCase() && !/^\d/.test(trimmed) && !trimmed.includes('MM-01')

      if (!matchedSection && (isMainHeader || isAllCaps)) {
        flushBlock()
        const safeId = trimmed
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        blocks.push({ type: 'header', level: 2, content: trimmed, id: safeId })
        return
      }

      // Detect List items
      const isList = /^(\d+\.|[a-z]\.)\s+/.test(trimmed)
      if (isList) {
        flushBlock()
        blocks.push({ type: 'list-item', content: trimmed })
        return
      }

      // Detect Table rows
      if (line.includes('\t')) {
        if (currentBlock.content.length > 0) flushBlock()
        tableBuffer.push(line.split('\t'))
        return
      } else {
        if (tableBuffer.length > 0) {
          flushBlock()
        }
      }

      // Default to paragraph
      currentBlock.content.push(trimmed)
    })

    flushBlock()

    return { sections: toc, parsedBlocks: blocks }
  }, [content, tocData])

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -80% 0px' }
    )

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [sections])

  // Search Navigation Effect
  useEffect(() => {
    if (!searchTerm) {
      setTotalMatches(0)
      setCurrentMatch(0)
      return
    }

    // Debounce to allow rendering to complete
    const timeoutId = setTimeout(() => {
      const matches = document.querySelectorAll('mark.search-match')
      setTotalMatches(matches.length)
      if (matches.length > 0) {
        setCurrentMatch(1)
        matches[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        setCurrentMatch(0)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const navigateMatches = (direction) => {
    const matches = document.querySelectorAll('mark.search-match')
    if (matches.length === 0) return

    let nextIndex
    if (direction === 'next') {
      nextIndex = currentMatch >= matches.length ? 1 : currentMatch + 1
    } else {
      nextIndex = currentMatch <= 1 ? matches.length : currentMatch - 1
    }

    setCurrentMatch(nextIndex)
    matches[nextIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // Helper to highlight text
  const renderText = (text) => {
    if (!searchTerm || typeof text !== 'string') return text

    // Escape special regex characters in searchTerm
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedTerm})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className={`bg-brand-200 text-brand-900 rounded-sm px-0.5 font-medium search-match ${currentMatch === i + 1 ? 'ring-2 ring-brand-500' : ''}`}>
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      {/* Top Navigation Bar */}
      <nav className='sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/60 shadow-sm transition-all duration-300'>
        <div className='max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4'>
          {/* Left: Back to Menu */}
          <div className='flex items-center shrink-0'>
            {/* Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                ${isSidebarOpen ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-brand-600 border-transparent text-white hover:bg-brand-700 shadow-md shadow-brand-500/20'}
              `}>
              <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <rect width='18' height='18' x='3' y='3' rx='2' ry='2' />
                <line x1='9' x2='9' y1='3' y2='21' />
              </svg>
              <span className='hidden sm:inline'>{isSidebarOpen ? 'Ocultar Índice' : 'Índice'}</span>
            </button>
            <div className='h-6 w-px bg-gray-200 mx-4 hidden sm:block'></div>
            <h1 className='text-lg font-semibold text-gray-800 hidden md:block tracking-tight'>
              Manual Maestro <span className='text-gray-400 font-normal'>/ MM-01</span>
            </h1>
          </div>

          {/* Center: Search Bar */}
          <div className='flex-1 max-w-2xl relative group'>
            <div className='absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none'>
              <svg className='h-4 w-4 text-gray-400 group-focus-within:text-brand-500 transition-colors' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                <path fillRule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z' clipRule='evenodd' />
              </svg>
            </div>
            <input
              type='text'
              className='block w-full pl-12 pr-24 py-2 bg-gray-100/50 border-transparent text-gray-900 placeholder-gray-500 focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10 rounded-xl text-sm transition-all duration-200'
              placeholder='Buscar en el documento...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className='absolute inset-y-0 right-0 pr-2 flex items-center gap-1'>
                {totalMatches > 0 ? (
                  <>
                    <span className='text-xs text-gray-400 mr-1 font-medium tabular-nums'>
                      {currentMatch}/{totalMatches}
                    </span>
                    <button onClick={() => navigateMatches('prev')} className='p-1 hover:bg-gray-200 rounded-md text-gray-500 transition-colors' title='Anterior coincidencia'>
                      <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='m18 15-6-6-6 6' />
                      </svg>
                    </button>
                    <button onClick={() => navigateMatches('next')} className='p-1 hover:bg-gray-200 rounded-md text-gray-500 transition-colors' title='Siguiente coincidencia'>
                      <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='m6 9 6 6 6-6' />
                      </svg>
                    </button>
                  </>
                ) : (
                  <span className='text-xs text-gray-400 mr-2'>Sin resultados</span>
                )}
              </div>
            )}
          </div>

          {/* Right: Controls */}
          <div className='flex items-center gap-2 shrink-0'>
            {/* Font Size */}
            <div className='hidden sm:flex items-center bg-gray-100/50 rounded-lg p-1 mr-2'>
              <button
                onClick={() => setFontSize(Math.max(1, fontSize - 0.1))}
                className='p-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-500 hover:text-gray-900 transition-all'
                title='Disminuir texto'>
                <span className='text-xs font-bold'>A-</span>
              </button>
              <div className='w-px h-4 bg-gray-300 mx-1'></div>
              <button
                onClick={() => setFontSize(Math.min(1.3, fontSize + 0.1))}
                className='p-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-500 hover:text-gray-900 transition-all'
                title='Aumentar texto'>
                <span className='text-lg font-bold'>A+</span>
              </button>
            </div>

            <a
              href='/documentos'
              className='group flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all duration-200'
              title='Volver al listado de documentos'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='group-hover:-translate-x-1 transition-transform'>
                <path d='m15 18-6-6 6-6' />
              </svg>
              <span className='font-medium text-sm hidden sm:block'>Documentos</span>
            </a>
          </div>
        </div>
      </nav>

      <div className='flex flex-1 relative max-w-[1920px] mx-auto w-full'>
        {/* Sidebar Container */}
        <aside
          className={`
            fixed lg:sticky top-16 h-[calc(100vh-4rem)] z-40 bg-white/95 backdrop-blur-xl border-r border-gray-200/50
            transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] overflow-hidden shadow-2xl lg:shadow-none
            ${isSidebarOpen ? 'w-full sm:w-80 translate-x-0 opacity-100' : 'w-0 -translate-x-10 opacity-0'}
          `}>
          <div className='h-full overflow-y-auto custom-scrollbar p-4'>
            <h3 className='px-2 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest sticky top-0 bg-white/95 backdrop-blur-sm z-10 mb-2'>Tabla de Contenido</h3>
            <div className='space-y-0.5'>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`
                    group flex items-start gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200
                    ${activeSection === section.id ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                    ${section.level === 2 ? 'ml-4 text-xs border-l border-gray-100 pl-4' : ''}
                  `}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
                    setActiveSection(section.id)
                    // On mobile, close sidebar after click
                    if (window.innerWidth < 1024) setIsSidebarOpen(false)
                  }}>
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${activeSection === section.id ? 'bg-brand-500' : 'bg-gray-300 group-hover:bg-gray-400'}`} />
                  <span className='leading-snug'>{section.title}</span>
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={`flex-1 min-w-0 transition-all duration-500 ${isSidebarOpen ? 'lg:pl-0' : ''}`}>
          <div className='max-w-4xl mx-auto p-6 md:p-12 lg:p-16' style={{ fontSize: `${fontSize}rem` }}>
            {/* Document Header Decoration */}
            <div className='mb-12 pb-6 border-b border-gray-100'>
              <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-4'>
                <span className='w-2 h-2 rounded-full bg-brand-500 animate-pulse'></span>
                Documento Oficial
              </div>
              <h1 className='text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4'>Manual Maestro de Operaciones</h1>
              <p className='text-xl text-gray-500 font-light'>Sistema de Gestión Integral de Residuos Sólidos Urbanos</p>
            </div>

            {parsedBlocks.map((block, idx) => {
              switch (block.type) {
                case 'header':
                  const HeaderTag = block.level === 1 ? 'h2' : 'h3'
                  return (
                    <div key={idx} className='relative group scroll-mt-24'>
                      {block.level === 1 && (
                        <div className='absolute -left-6 md:-left-12 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-200 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                      )}
                      <HeaderTag
                        id={block.id}
                        className={`font-bold text-gray-900 ${
                          block.level === 1 ? 'text-3xl mt-16 mb-6 pb-4 border-b border-gray-100 tracking-tight' : 'text-xl mt-10 mb-4 text-brand-800 flex items-center gap-3'
                        }`}>
                        {block.level === 2 && <span className='w-1.5 h-1.5 rounded-full bg-brand-400' />}
                        {renderText(block.content)}
                      </HeaderTag>
                    </div>
                  )
                case 'list-item':
                  return (
                    <div key={idx} className='flex gap-4 mb-3 text-gray-700 pl-2 md:pl-4 group hover:bg-gray-50 rounded-lg transition-colors p-1'>
                      <div className='w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand-100 transition-colors'>
                        <div className='w-1.5 h-1.5 rounded-full bg-brand-500' />
                      </div>
                      <p className='leading-relaxed'>{renderText(block.content)}</p>
                    </div>
                  )
                case 'table':
                  return (
                    <div key={idx} className='my-8 overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white'>
                      <div className='overflow-x-auto'>
                        <table className='w-full text-sm text-left text-gray-600'>
                          <thead className='text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200'>
                            <tr>
                              {block.content[0].map((header, hIdx) => (
                                <th key={hIdx} className='px-6 py-3 font-bold tracking-wider whitespace-nowrap'>
                                  {renderText(header)}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className='divide-y divide-gray-100'>
                            {block.content.slice(1).map((row, rIdx) => (
                              <tr key={rIdx} className='hover:bg-gray-50/50 transition-colors'>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className='px-6 py-3 whitespace-pre-wrap leading-relaxed'>
                                    {renderText(cell)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                default:
                  return (
                    <p key={idx} className='mb-5 text-gray-600 leading-relaxed text-justify md:text-left'>
                      {renderText(block.content)}
                    </p>
                  )
              }
            })}

            {/* Footer */}
            <div className='mt-24 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 uppercase tracking-widest font-medium'>
              <span>CEDA Circular® System</span>
              <div className='flex items-center gap-2'>
                <span className='w-2 h-2 rounded-full bg-green-400'></span>
                <span>Documento Verificado</span>
              </div>
              <span>MM-01 / 2026</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ManualViewer
