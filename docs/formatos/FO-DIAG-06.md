# Canvas Funcional #06: Mapeo de Rutas (Logística)

## Identidad del Formato

- **Código:** FO-DIAG-06
- **Nombre:** Registro de Rutas de Recolección Actuales
- **Naturaleza:** Georreferenciación / análisis espacial
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Visualiza el “sistema circulatorio” de la planta para detectar cruces peligrosos, rutas innecesarias o zonas sin cobertura. Alimenta el algoritmo de optimización logística.

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Escritura):** Analista de logística / brigadista de campo
	- Permiso requerido: `routes.map_create`
- **Supervisor (Estrategia):** Gerente de operaciones
	- Permiso requerido: `routes.optimize`

## 3. Estructura Visual (UI - App Móvil/Tablet)

### A. Encabezado (heredado)

- **Contexto:** `Recorrido #SRV-101 / Nave C`
- **Puntos clave:**
	- Inicio (`Rampa 4`, etc.)
	- Fin (`Compactadora Norte`, etc.)

### B. Lienzo de mapeo (interactive canvas)

- Mapa/plano editable de la zona.
- **Herramientas de dibujo:**
	- Modo trazado (`✏️ Dibujar ruta`) para arrastrar líneas sobre el plano.
	- Metadatos por línea: tipo (`Recolección`, `Transporte`, `Pepena`), vehículo (`Carrito`, `Camión`, `Triciclo`), flujo (`Fluido`, `Lento`, `Colapsado`).
- **Marcadores críticos:**
	- Botón `📍 Agregar incidente`.
	- Pop-up con problema (`Congestión`, `Mezcla`, `Riesgo sanitario`), impacto (`Alto`, `Medio`, `Bajo`) y opción de foto.

### C. Análisis de eficiencia

- Métricas automáticas o estimadas:
	- Distancia total (metros)
	- Tiempo promedio (minutos)
	- Obstáculos: checklist (`Interferencia peatonal`, `Cruce de maquinaria`, `Piso en mal estado`)

### D. Recomendación

- Campo de observaciones.
- **Acción sugerida:** selección entre `Rediseñar ruta`, `Cambiar horario`, `Señalizar`, `Reparar piso`.

## 4. Estructura de Base de Datos (schema proposal)

### Tabla padre: `route_analyses`

| Campo       | Tipo    | Restricción     | Descripción                          |
|-------------|---------|-----------------|--------------------------------------|
| id          | UUID    | PK              | Identificador del análisis.          |
| survey_id   | UUID    | FK -> `surveys` | Vínculo con el recorrido maestro.    |
| start_point | VARCHAR | NOT NULL        | Punto de inicio.                     |
| end_point   | VARCHAR | NOT NULL        | Punto de término.                    |
| total_distance_m | DECIMAL | NULLABLE  | Distancia total en metros.           |
| avg_time_min    | DECIMAL | NULLABLE  | Tiempo promedio en minutos.          |
| notes       | TEXT    | NULLABLE        | Observaciones generales.             |

### Tabla hija: `route_paths`

| Campo          | Tipo   | Restricción                            | Descripción                          |
|----------------|--------|----------------------------------------|--------------------------------------|
| id             | UUID   | PK                                     | Identificador del trazo.            |
| analysis_id    | UUID   | FK -> `route_analyses`                 | Relación con la tabla padre.        |
| path_type      | ENUM   | `COLLECTION`, `TRANSPORT`, `SCAVENGING`| Tipo de actividad.                  |
| vehicle_type   | ENUM   | `CART`, `TRUCK`, `TRICYCLE`            | Vehículo utilizado.                 |
| condition      | ENUM   | `FLUID`, `CONGESTED`, `CRITICAL`       | Condición de flujo.                 |
| coordinates_json | JSONB | NOT NULL                              | Arreglo de puntos (`[{x,y}, ...]`). |

### Tabla hija: `route_incidents`

| Campo         | Tipo  | Restricción                                   | Descripción                    |
|---------------|-------|-----------------------------------------------|--------------------------------|
| id            | UUID  | PK                                            | Identificador del incidente.   |
| analysis_id   | UUID  | FK -> `route_analyses`                        | Relación con la tabla padre.   |
| incident_type | ENUM  | `CONGESTION`, `MIXING`, `SANITARY_RISK`, `BLOCKAGE` | Tipo de incidente.       |
| impact_level  | ENUM  | `LOW`, `MEDIUM`, `HIGH`                       | Gravedad del impacto.          |
| coordinate_x  | FLOAT | NOT NULL                                      | Coordenada X en el plano.      |
| coordinate_y  | FLOAT | NOT NULL                                      | Coordenada Y en el plano.      |
| media_url     | TEXT  | NULLABLE                                      | Evidencia fotográfica.         |

## 5. Lógica de Negocio Crítica

- **Validación geoespacial:** si un pin de bloqueo queda fuera de las rutas dibujadas, solicitar confirmación sobre su impacto real en el flujo.
- **Densidad de conflictos:** calcular incidentes con impacto alto por cada 100 metros de ruta; si supera el umbral, marcar la ruta como “no viable” en los reportes gerenciales.
