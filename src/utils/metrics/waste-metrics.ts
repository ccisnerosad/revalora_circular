import type { DiagRecord, PeakHour } from '@app-types/formats'

/**
 * Obtiene la fecha más reciente de los registros.
 * Si no hay registros, devuelve la fecha actual.
 */
export const getLatestDate = (records: DiagRecord[]): Date => {
  if (!records.length) return new Date()

  // Ordenar registros por fecha descendente para encontrar el más reciente
  const sorted = [...records].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  // Usamos la fecha del último registro como "hoy" para la simulación
  // Aseguramos que sea el final del día para incluir todo el registro
  const latest = new Date(sorted[0].date + 'T23:59:59')
  return latest
}

/**
 * Obtiene el valor numérico de generación basado en la etiqueta de texto.
 * @param gen Nivel de generación ('Alto', 'Medio', 'Bajo')
 */
export const getGenerationValue = (gen: string): number => {
  switch (gen) {
    case 'Alto':
      return 100
    case 'Medio':
      return 50
    case 'Bajo':
      return 25
    default:
      return 0
  }
}

/**
 * Calcula estadísticas de volumen y peso para un periodo de tiempo.
 * @param records Lista de registros
 * @param days Número de días a calcular hacia atrás
 * @param offsetDays Días de desplazamiento (para comparar con periodos anteriores)
 * @param referenceDate Fecha de referencia (opcional, por defecto usa la más reciente de los registros)
 */
export const calculateStats = (records: DiagRecord[], days: number, offsetDays: number = 0, referenceDate?: Date) => {
  // Si no se provee fecha de referencia, calculamos la última disponible
  const today = referenceDate ? new Date(referenceDate) : getLatestDate(records)

  // Normalizar today al final del día para comparaciones inclusivas
  today.setHours(23, 59, 59, 999)

  const startDate = new Date(today)
  startDate.setDate(today.getDate() - days - offsetDays)
  // Ajustar startDate al inicio del día
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(today)
  endDate.setDate(today.getDate() - offsetDays)
  // endDate ya está al final del día por la copia de today

  const filtered = records.filter((r) => {
    const rDate = new Date(r.date + 'T12:00:00') // Usar mediodía para evitar problemas de zona horaria
    return rDate >= startDate && rDate <= endDate
  })

  const volume = filtered.reduce((acc, r) => acc + r.volume, 0)
  const weight = filtered.reduce((acc, r) => acc + r.weight, 0)

  return { volume, weight }
}

/**
 * Formatea el porcentaje de tendencia entre dos valores.
 */
export const formatTrend = (current: number, previous: number): string => {
  if (previous === 0) return current > 0 ? '+100%' : '0%'
  const diff = ((current - previous) / previous) * 100
  return `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`
}

/**
 * Calcula los horarios pico de generación promediando los niveles por hora.
 */
export const calculatePeakHours = (records: DiagRecord[], days?: number, referenceDate?: Date): PeakHour[] => {
  let filteredRecords = records

  if (days) {
    const today = referenceDate ? new Date(referenceDate) : getLatestDate(records)
    today.setHours(23, 59, 59, 999)

    const startDate = new Date(today)
    startDate.setDate(today.getDate() - days)
    startDate.setHours(0, 0, 0, 0)

    filteredRecords = records.filter((r) => {
      const rDate = new Date(r.date + 'T12:00:00')
      return rDate >= startDate && rDate <= today
    })
  }

  const hoursMap = new Map<string, { total: number; count: number }>()

  filteredRecords.forEach((r) => {
    const hour = r.time.split(':')[0] + ':00'
    // Handle generation being an object or string (legacy)
    const genLevel = typeof r.generation === 'string' ? r.generation : r.generation.level
    const val = getGenerationValue(genLevel)
    if (!hoursMap.has(hour)) hoursMap.set(hour, { total: 0, count: 0 })
    const h = hoursMap.get(hour)!
    h.total += val
    h.count++
  })

  return Array.from(hoursMap.entries())
    .map(([hour, data]) => ({
      hour,
      level: Math.round(data.total / data.count)
    }))
    .sort((a, b) => a.hour.localeCompare(b.hour))
}

/**
 * Genera una etiqueta de texto legible para el rango de fechas seleccionado.
 * Útil para dar contexto al usuario sobre qué periodo está viendo.
 */
export const getDateRangeLabel = (days: number, referenceDate?: Date): string => {
  const today = referenceDate ? new Date(referenceDate) : new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - days + 1)

  const formatDate = (d: Date) => d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })

  return `${formatDate(startDate)} - ${formatDate(today)}`
}
