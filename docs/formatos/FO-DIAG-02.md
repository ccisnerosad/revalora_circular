# Canvas Funcional #02: Registro de Volumen y Pesaje

## Identidad del Formato

- **Código:** FO-DIAG-02
- **Nombre:** Registro de Volumen Diario de Residuos por Zona
- **Naturaleza:** Formato hijo de `FO-DIAG-00`
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Este formato alimenta el KPI maestro (Toneladas por día). Registra la generación de residuos a lo largo del tiempo para detectar picos y requiere una interfaz ágil, optimizada para personal que opera básculas móviles o manipula contenedores.

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Escritura):** Operador de báscula / Brigadista
  - Permiso requerido: `waste_volume.create`
- **Supervisor (Validación):** Jefe de planta
  - Permiso requerido: `waste_volume.approve` (valida coherencia con la bitácora de salida)

## 3. Estructura Visual (UI - App Móvil/Tablet)

### A. Encabezado (heredado y configurable)

- **Contexto:** `Recorrido #SRV-101 / Nave C`
- **Turno:** Heredado de `FO-DIAG-00`
- **Instrumento:** Toggle `Báscula digital` / `Estimación volumétrica`
  - Si se elige estimación: seleccionar contenedor patrón (`Tambo 200L`, `Gaylord`, `Caja plástica`)

### B. Cuerpo: Bitácora de Pesaje (timeline)

- Visualización en línea de tiempo vertical.
- **Registro #1 - 09:00** (botón “+ Nuevo pesaje”):
  - **Hora registrada:** Auto 09:05 (editable con justificación)
  - **Tipo predominante:** Select `Orgánico` / `Mixto` / `Contaminado`
  - **Valor capturado:**
    - Báscula: input en kilogramos (ej. `150.5` kg)
    - Volumen: input de contenedores (ej. `2.5`) -> el sistema calcula m3 y kg aproximados
  - **Foto evidencia:** botón de captura o galería
- Repetir para cada evento (Registro #2, #3, etc.).

### C. Consolidado (calculadora automática)

- **Total acumulado:** display principal (ej. `1,450 kg`)
- **Volumen equivalente:** display secundario (ej. `4.2 m3`)

### D. Condiciones operativas (checklist rápido)

- **Estado del área (saturación):** `Baja`, `Media`, `Alta`
- **Interferencias:** switch Sí/No (retrasos por tráfico, personal, etc.)

## 4. Estructura de Base de Datos (schema proposal)

Se registran la metodología y las condiciones para calificar la confiabilidad del dato (pesaje real vs. estimación).

### Tabla padre: `volume_logs`

| Campo           | Tipo      | Restricción            | Descripción                                      |
|-----------------|-----------|------------------------|--------------------------------------------------|
| id              | UUID      | PK                     | Identificador único del reporte.                 |
| survey_id       | UUID      | FK -> `surveys`        | Referencia al recorrido maestro.                 |
| methodology     | ENUM      | `SCALE`, `ESTIMATION`  | Método principal utilizado.                      |
| container_ref_id| INT       | FK -> `containers`     | Contenedor patrón usado en estimación.           |
| area_saturation | ENUM      | `LOW`, `MEDIUM`, `HIGH`| Nivel de saturación del área.                    |
| has_delays      | BOOLEAN   | DEFAULT FALSE          | Indica retrasos operativos.                      |
| total_weight_kg | DECIMAL   | Calculado              | Peso total acumulado (caché).                    |
| notes           | TEXT      | NULLABLE               | Observaciones generales.                         |

### Tabla hija: `volume_entries`

| Campo           | Tipo    | Restricción                    | Descripción                                      |
|-----------------|---------|--------------------------------|--------------------------------------------------|
| id              | UUID    | PK                             | Identificador del pesaje.                        |
| log_id          | UUID    | FK -> `volume_logs`            | Referencia al reporte padre.                     |
| recorded_at     | TIMESTAMP | NOT NULL                     | Hora del evento.                                 |
| waste_category  | ENUM    | `ORGANIC`, `MIXED`, `OTHER`    | Categoría predominante registrada.               |
| quantity_input  | DECIMAL | NOT NULL                       | Valor capturado (kg o número de contenedores).   |
| calculated_kg   | DECIMAL | NOT NULL                       | Peso final (real o convertido).                  |
| calculated_m3   | DECIMAL | NOT NULL                       | Volumen calculado en metros cúbicos.             |
| media_url       | TEXT    | NULLABLE                       | Evidencia fotográfica o enlace a almacenamiento. |

## 5. Lógica de Negocio Crítica

- **Motor de conversión:** Si la metodología es `ESTIMATION`, el backend consulta la tabla `containers` para obtener volumen y densidad del residuo y calcular `calculated_kg`.
- **Fórmula guía:** `cantidad ingresada * volumen contenedor * densidad residuo = peso aproximado`.
- **Validación de tolerancia:** Si un registro supera los 1,000 kg, se exige evidencia fotográfica antes de guardar.
- **Alerta de saturación:** Si `area_saturation` se marca como `HIGH` en dos registros consecutivos, se dispara una alerta en el dashboard del gerente (posible cuello de botella).
  