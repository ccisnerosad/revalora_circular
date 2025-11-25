# Canvas Funcional #04: Horarios Pico de Generación

## Identidad del Formato

- **Código:** FO-DIAG-04
- **Nombre:** Registro de Horarios Pico de Generación
- **Naturaleza:** Análisis temporal / mapa de calor operativo
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Detecta las horas críticas de generación de residuos para ajustar turnos, rutas y recursos. Sincroniza la logística con la realidad del sitio, evitando recorridos que llegan fuera de los picos.

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Escritura):** Analista logístico / Jefe de brigada
  - Permiso requerido: `logistics.record_peaks`
- **Supervisor (Análisis):** Coordinador de rutas
  - Permiso requerido: `logistics.optimize_routes` (reprograma camiones con estos datos)

## 3. Estructura Visual (UI - App Móvil/Tablet)

### A. Encabezado (heredado + contexto temporal)

- **Contexto:** `Recorrido #SRV-101 / Nave C`
- **Día de la semana:** cálculo automático desde la fecha (ej. `Martes`)
- **Horario operativo:** selección de apertura y cierre (ej. `04:00` a `18:00`)

### B. Matriz de calor horaria (heatmap input)

- Interfaz tipo ecualizador para capturar intensidad por franja.
- Para cada franja (`05:00 - 06:00`, `06:00 - 07:00`, etc.):
  - **Intensidad:** control segmentado con `🟢 Baja`, `🟡 Media`, `🟠 Alta`, `🔴 Crítica`
  - **Residuo predominante:** chips `Orgánico`, `Mixto`, `Contaminado`
  - Si se marca `Crítica`, aparece el campo opcional “¿Causa del pico?”

### C. Análisis de impacto (consecuencias)

- Se activa cuando existe al menos una hora en `Alta` o `Crítica`.
- **Congestión de pasillos:** slider `Fluido — Bloqueado`
- **Recolección:** switch “¿Hubo retraso?”
- **Segregación:** switch “¿Se dificultó separar?”
- **Riesgo sanitario:** select `Bajo`, `Medio`, `Alto`

### D. Recomendación táctica (output humano)

- **Hora pico principal:** sugerencia automática (ej. `06:00 - 07:00`) editable por el usuario.
- **Acción sugerida:** lista de opciones (aumentar frecuencia, colocar contenedores buffer, cambiar horario de barrido).

## 4. Estructura de Base de Datos (schema proposal)

### Tabla padre: `peak_generation_logs`

| Campo                 | Tipo    | Restricción             | Descripción                                 |
|-----------------------|---------|-------------------------|---------------------------------------------|
| id                    | UUID    | PK                      | Identificador del reporte.                  |
| survey_id             | UUID    | FK -> `surveys`         | Referencia al recorrido maestro.            |
| day_of_week           | INT     | 1-7                     | Día analizado (1 = lunes).                  |
| main_peak_hour        | TIME    | NULLABLE                | Hora más crítica detectada.                 |
| aisle_congestion      | ENUM    | `LOW`, `MEDIUM`, `HIGH` | Nivel de congestión en pasillos.            |
| collection_delay      | BOOLEAN | DEFAULT FALSE           | Indica retrasos de recolección.             |
| sanitary_risk         | ENUM    | `LOW`, `MEDIUM`, `HIGH` | Riesgo sanitario asociado.                  |
| tactical_recommendation | TEXT | NULLABLE                | Sugerencia operativa final.                 |

### Tabla hija: `hourly_intensities`

| Campo          | Tipo | Restricción                        | Descripción                                |
|----------------|------|------------------------------------|--------------------------------------------|
| id             | UUID | PK                                 | Identificador del registro horario.        |
| log_id         | UUID | FK -> `peak_generation_logs`       | Relación con la tabla padre.               |
| start_time     | TIME | NOT NULL                           | Inicio de la franja (ej. `05:00`).         |
| end_time       | TIME | NOT NULL                           | Fin de la franja (ej. `06:00`).            |
| intensity      | ENUM | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`| Nivel de generación.                        |
| dominant_waste | ENUM | `ORGANIC`, `MIXED`, `CONTAMINATED` | Residuos predominantes.                    |
| notes          | TEXT | NULLABLE                           | Observaciones o causa del pico.            |

## 5. Lógica de Negocio Crítica

- **Detección automática de picos:** la franja con intensidad `CRITICAL` se precarga en `main_peak_hour` del registro padre.
- **Validación de coherencia:** si se marca `Congestión: Alta` pero todas las franjas son `Baja`, mostrar confirmación: “¿Seguro? La congestión no coincide con la baja generación reportada”.
- **Visualización de datos:** alimenta gráficos comparativos “Hora real de recolección vs. Hora pico de generación” en el dashboard administrativo para detectar brechas de eficiencia.
