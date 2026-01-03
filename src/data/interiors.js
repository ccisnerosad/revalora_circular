// --- Módulo A (Posterior) ---
export const ALIMENTO_HUMANO_MODULE_A = [
  // --- Zona 1: Almacenamiento Frío (Fondo) ---
  {
    id: 'cold_room_a',
    type: 'ColdRoom',
    position: [0.9, 0, -2.9],
    rotation: [0, 0, 0]
  },

  // --- Zona 2: Área de Proceso (Centro) ---
  {
    id: 'packing_table_1_a',
    type: 'PackingTable',
    position: [0, 0, 1.5],
    rotation: [0, 0, 0]
  },
  {
    id: 'packing_table_2_a',
    type: 'PackingTable',
    position: [0, 0, 3.5],
    rotation: [0, 0, 0]
  },

  // Contenedor Orgánico
  {
    id: 'organic_bin_a',
    type: 'OrganicBin',
    position: [0, 0, 2.5],
    rotation: [0, 0, 0]
  },

  // Estanterías Perimetrales (Muro Izquierdo)
  {
    id: 'shelf_l_1_a',
    type: 'ShelvingUnit',
    position: [-2.4, 0, 1.0],
    rotation: [0, Math.PI / 2, 0]
  },
  {
    id: 'shelf_l_2_a',
    type: 'ShelvingUnit',
    position: [-2.4, 0, 2.2],
    rotation: [0, Math.PI / 2, 0]
  },

  // Estanterías Perimetrales (Muro Derecho)
  {
    id: 'shelf_r_1_a',
    type: 'ShelvingUnit',
    position: [2.4, 0, 1.0],
    rotation: [0, -Math.PI / 2, 0]
  },
  {
    id: 'shelf_r_2_a',
    type: 'ShelvingUnit',
    position: [2.4, 0, 2.2],
    rotation: [0, -Math.PI / 2, 0]
  },

  // --- Zona 3: Servicios e Higiene (Frente) ---
  // Lavamanos
  {
    id: 'sink_1_a',
    type: 'IndustrialSink',
    position: [-2.3, 0, 4.0],
    rotation: [0, Math.PI / 2, 0]
  },
  {
    id: 'sink_2_a',
    type: 'IndustrialSink',
    position: [-2.3, 0, 5.0],
    rotation: [0, Math.PI / 2, 0]
  },

  // Selladoras
  {
    id: 'sealer_table_a',
    type: 'Box',
    args: [0.6, 0.9, 2],
    position: [2.3, 0.45, 4.5],
    color: '#cfd8dc'
  },
  {
    id: 'sealer_1_a',
    type: 'HeatSealer',
    position: [2.3, 0.9, 4.0],
    rotation: [0, -Math.PI / 2, 0]
  },
  {
    id: 'sealer_2_a',
    type: 'HeatSealer',
    position: [2.3, 0.9, 5.0],
    rotation: [0, -Math.PI / 2, 0]
  }
]

// --- Módulo B (Anterior) ---
export const ALIMENTO_HUMANO_MODULE_B = [
  // --- Zona 1: Almacenamiento Frío (Frente - Invertido) ---
  {
    id: 'cold_room_b',
    type: 'ColdRoom',
    position: [0.9, 0, 2.9], // Invertido Z
    rotation: [0, Math.PI, 0] // Rotado 180°
  },

  // --- Zona 2: Área de Proceso (Centro - Invertido) ---
  {
    id: 'packing_table_1_b',
    type: 'PackingTable',
    position: [0, 0, -1.5], // Invertido Z
    rotation: [0, 0, 0]
  },
  {
    id: 'packing_table_2_b',
    type: 'PackingTable',
    position: [0, 0, -3.5], // Invertido Z
    rotation: [0, 0, 0]
  },

  // Contenedor Orgánico
  {
    id: 'organic_bin_b',
    type: 'OrganicBin',
    position: [0, 0, -2.5], // Invertido Z
    rotation: [0, 0, 0]
  },

  // Estanterías Perimetrales (Muro Izquierdo)
  {
    id: 'shelf_l_1_b',
    type: 'ShelvingUnit',
    position: [-2.4, 0, -1.0], // Invertido Z
    rotation: [0, Math.PI / 2, 0]
  },
  {
    id: 'shelf_l_2_b',
    type: 'ShelvingUnit',
    position: [-2.4, 0, -2.2], // Invertido Z
    rotation: [0, Math.PI / 2, 0]
  },

  // Estanterías Perimetrales (Muro Derecho)
  {
    id: 'shelf_r_1_b',
    type: 'ShelvingUnit',
    position: [2.4, 0, -1.0], // Invertido Z
    rotation: [0, -Math.PI / 2, 0]
  },
  {
    id: 'shelf_r_2_b',
    type: 'ShelvingUnit',
    position: [2.4, 0, -2.2], // Invertido Z
    rotation: [0, -Math.PI / 2, 0]
  },

  // --- Zona 3: Servicios e Higiene (Fondo - Invertido) ---
  // Lavamanos
  {
    id: 'sink_1_b',
    type: 'IndustrialSink',
    position: [-2.3, 0, -4.0], // Invertido Z
    rotation: [0, Math.PI / 2, 0]
  },
  {
    id: 'sink_2_b',
    type: 'IndustrialSink',
    position: [-2.3, 0, -5.0], // Invertido Z
    rotation: [0, Math.PI / 2, 0]
  },

  // Selladoras
  {
    id: 'sealer_table_b',
    type: 'Box',
    args: [0.6, 0.9, 2],
    position: [2.3, 0.45, -4.5], // Invertido Z
    color: '#cfd8dc'
  },
  {
    id: 'sealer_1_b',
    type: 'HeatSealer',
    position: [2.3, 0.9, -4.0], // Invertido Z
    rotation: [0, -Math.PI / 2, 0]
  },
  {
    id: 'sealer_2_b',
    type: 'HeatSealer',
    position: [2.3, 0.9, -5.0], // Invertido Z
    rotation: [0, -Math.PI / 2, 0]
  }
]
