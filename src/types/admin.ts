export interface PointHistory {
  id: string
  punto_id: string
  date: string
  time: string
  condition: 'Adecuada' | 'Regular' | 'Crítica'
  notes: string
  evaluator: string
}
