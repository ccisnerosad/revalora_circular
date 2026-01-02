export const ZONES_DATA_PB = [
  {
    'id': 'maniobras',
    'name': 'Zona de Maniobras',
    'desc': 'Recepción y carga (24x9m).',
    'medidas': ['24m', '9m', '0.2m'],
    'altura': false,
    'level': 'PB',
    'w': 24,
    'h': 0.2,
    'd': 9,
    'x': 0,
    'y': 0.1,
    'z': 20.5,
    'color': '#454545',
    'label': 'Maniobras',
    'rotation': [0, 0, 0]
  },
  {
    'id': 'rechazo',
    'name': 'Rechazo',
    'desc': 'Zona de rechazo (8x5m).',
    'medidas': ['8m', '5m', '3m'],
    'altura': true,
    'level': 'PB',
    'w': 8,
    'h': 3,
    'd': 5,
    'x': -8,
    'y': 1.8,
    'z': 13.5,
    'color': '#930000',
    'label': 'Rechazo'
  },
  {
    'id': 'patio_central',
    'name': 'Patio Central Operativo',
    'desc': 'Área de operaciones (24x8m).',
    'medidas': ['24m', '8m', '0.2m'],
    'altura': false,
    'level': 'PB',
    'w': 24,
    'h': 0.2,
    'd': 8,
    'x': 0,
    'y': 0.1,
    'z': 12,
    'color': '#6d6d6d',
    'label': 'Patio Central',
    'rotation': [0, 0, 0]
  },
  {
    'id': 'pasillo_horiz',
    'name': 'Pasillo Operativo',
    'desc': 'Corredor logístico (14x3m).',
    'medidas': ['14m', '3m', '0.2m'],
    'altura': false,
    'level': 'PB',
    'w': 14,
    'h': 0.2,
    'd': 3,
    'x': 5,
    'y': 0.1,
    'z': 6.5,
    'color': '#222222',
    'label': 'Pasillo'
  },
  {
    'id': 'alimento_humano',
    'name': 'Alimento Humano',
    'desc': 'Selección (5x22m).',
    'medidas': ['5m', '22m', '3.5m'],
    'altura': true,
    'level': 'PB',
    'w': 5,
    'h': 3.5,
    'd': 22,
    'x': 9.5,
    'y': 1.75,
    'z': -6,
    'color': '#af5e00',
    'label': 'A. Humano',
    'rotation': [0, 0, 0]
  },
  {
    'id': 'separacion',
    'name': 'Separación Sanitaria',
    'desc': 'Barrera (1x22m).',
    'medidas': ['1m', '22m', '3.5m'],
    'altura': true,
    'level': 'PB',
    'w': 1,
    'h': 3.5,
    'd': 22,
    'x': 6.5,
    'y': 1.75,
    'z': -6,
    'color': '#222222'
  },
  {
    'id': 'alimento_animal',
    'name': 'Alimento Animal',
    'desc': 'Clasificación (5x22m).',
    'medidas': ['5m', '22m', '3.5m'],
    'altura': true,
    'level': 'PB',
    'w': 5,
    'h': 3.5,
    'd': 22,
    'x': 3.5,
    'y': 1.75,
    'z': -6,
    'color': '#af9500',
    'label': 'A. Animal'
  },
  {
    'id': 'pasillo_central',
    'name': 'Pasillo Central',
    'desc': 'Eje central (3x22m).',
    'medidas': ['3m', '22m', '0.2m'],
    'altura': false,
    'level': 'PB',
    'w': 3,
    'h': 0.2,
    'd': 22,
    'x': -0.5,
    'y': 0.1,
    'z': -6,
    'color': '#222222',
    'label': 'P. Central'
  },
  {
    'id': 'recoleccion',
    'name': 'Recolección',
    'desc': 'Salida de productos (14x8m).',
    'medidas': ['14m', '8m', '0.2m'],
    'altura': false,
    'level': 'PB',
    'w': 14,
    'h': 0.2,
    'd': 8,
    'x': 5,
    'y': 0.1,
    'z': -21,
    'color': '#5c6bc0',
    'label': 'Recolección',
    'labelOffset': 4
  },
  {
    'id': 'serv_tecnico',
    'name': 'Serv. Técnico',
    'desc': 'Mantenimiento (10x3m).',
    'medidas': ['10m', '3m', '3m'],
    'altura': true,
    'level': 'PB',
    'w': 10,
    'h': 3,
    'd': 3,
    'x': -7,
    'y': 1.5,
    'z': 6.5,
    'color': '#304b7e',
    'label': 'S. Técnico'
  },
  {
    'id': 'biogestion',
    'name': 'Biogestión',
    'desc': 'Procesamiento (10x14m).',
    'medidas': ['10m', '14m', '4m'],
    'altura': true,
    'level': 'PB',
    'w': 10,
    'h': 4,
    'd': 14,
    'x': -7,
    'y': 2,
    'z': -2,
    'color': '#09977f',
    'label': 'Biogestión'
  },
  {
    'id': 'tratamiento',
    'name': 'Tratamiento Final',
    'desc': 'Composta, Biofert, Biogás (10x14m).',
    'medidas': ['10m', '14m', '3m'],
    'altura': true,
    'level': 'PB',
    'w': 10,
    'h': 3,
    'd': 14,
    'x': -7,
    'y': 1.5,
    'z': -18,
    'color': '#008b09',
    'label': 'Tratamiento'
  }
]

export const ZONES_DATA_PA = [
  // Datos de zonas para Planta Alta (si es necesario)
  {
    'id': 'oficinas',
    'name': 'Oficinas',
    'desc': 'Área administrativa y de control (11x22m).',
    'medidas': ['11m', '22m', '3m'],
    'altura': true,
    'level': 'PA',
    'w': 11,
    'h': 3,
    'd': 22,
    'x': 6.5,
    'y': 5,
    'z': -6,
    'color': '#005580',
    'label': 'Oficinas'
  }
]

export const TRUCKS_DATA = [
  {
    'id': 't1',
    'type': 'clean',
    'position': [-8, 0.2, 22],
    'rotation': [0, 0, 0]
  },
  {
    'id': 't2',
    'type': 'waste',
    'position': [-4, 0.2, 22],
    'rotation': [0, 0, 0]
  },
  {
    'id': 't3',
    'type': 'clean',
    'position': [0, 0.2, 22],
    'rotation': [0, 0, 0]
  },
  {
    'id': 't4',
    'type': 'waste',
    'position': [4, 0.2, 22],
    'rotation': [0, 0, 0]
  },
  {
    'id': 't5',
    'type': 'clean',
    'position': [8, 0.2, 22],
    'rotation': [0, 0, 0]
  }
]

export const SCENE_DATA = {
  adminPos: [-6.5, 5.25, -6],
  ambientIntensity: 0.6,
  sunPosition: [100, 20, 100]
}
