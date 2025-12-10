export interface Submodulo {
  nombre: string
  descripcion: string
  icono: string
  path: string
}

export interface Modulo {
  nombre: string
  descripcion: string
  icono: string
  path: string
  submodulos?: Submodulo[]
}

export interface ModulosData {
  modulos: Modulo[]
}
