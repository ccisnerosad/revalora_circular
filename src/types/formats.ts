export interface FormatStatus {
  format_id: string
  status: 'active' | 'pending' | 'inactive'
  progress: number
}

export interface SiteCondition {
  status: 'Adecuada' | 'Regular' | 'Crítica'
  leachates: 'Ninguno' | 'Mínimo' | 'Abundante'
  odors: 'Nulo' | 'Perceptible' | 'Fuerte'
  obstruction: 'Ninguna' | 'Parcial' | 'Total'
  fauna: boolean
  wasteState: 'Contenido' | 'Derrames/Mezcla Ligera' | 'Acumulación/Mezcla Grave'
  notes: string
}

export interface Generation {
  level: 'Alto' | 'Medio' | 'Bajo' | 'Crítico'
  notes: string
}

export interface Characterization {
  id: string | number
  record_id: string
  type: string
  subType: string
  state: string
  volume: number
  weight: number
  potential: {
    humano: string
    animal: string
    composta: string
    bioenergia: string
  }
  conditions: {
    contamination: string
    leachates: boolean
    odors: string
    vectors: string[]
  }
  evidence: {
    photo: string
    observations: string
  }
  notes?: string
}

export interface DiagRecord {
  id: string
  date: string
  time: string
  point_id: string
  evaluator: string
  shift: string
  siteCondition: SiteCondition | string
  generation: Generation
  volume: number
  weight: number
  wasteTypes: string[]
}

export interface PeakHour {
  hour: string
  level: number
}

export interface ConsolidatedStats {
  volume: string
  weight: string
  trend: string
}

export interface ConsolidatedData {
  peakHours: PeakHour[]
  consolidated: {
    daily: ConsolidatedStats
    weekly: ConsolidatedStats
    monthly: ConsolidatedStats
  }
}
