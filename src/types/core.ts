export interface Zone {
  id: string
  name: string
  description: string
  responsable_id?: string
}

export interface Point {
  id: string
  zona_id: string
  name: string
  type: string
  capacity: string
}
