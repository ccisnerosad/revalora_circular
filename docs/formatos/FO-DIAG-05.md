# Canvas Funcional #05: Tiempo de Permanencia (Latencia)

## Identidad del Formato

- **Código:** FO-DIAG-05
- **Nombre:** Registro de Tiempo de Permanencia del Residuo
- **Naturaleza:** Cronometraje logístico / evaluación de riesgo temporal
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

- Medir el tiempo que un residuo permanece en la zona antes de su retiro.
- **Objetivo operativo:** detectar cuellos de botella (ej. retraso del camión).
- **Objetivo sanitario:** impedir que el residuo supere el umbral de fermentación (~6 horas) en áreas públicas.

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Escritura):** Analista de tiempos y movimientos / Brigadista
  - Permiso requerido: `logistics.track_time`
- **Supervisor (Alerta):** Coordinador de calidad
  - Permiso requerido: `logistics.view_alerts` (recibe notificación si un punto rebasa 12 horas)

## 3. Estructura Visual (UI - App Móvil/Tablet)

### A. Encabezado (heredado)

- **Contexto:** `Recorrido #SRV-101 / Pasillo 4`
- **Punto de acumulación:** select/input (`Esquina Local 45`, `Contenedor C-20`, etc.)

### B. Rastreador de tiempo (timer interface)

- Modo dual: `En vivo` o `Registro histórico`.
- Por cada evento:
  - **Residuo:** autocompletado (`Cáscara de piña`, etc.)
  - **Cronometría:**
    - Inicio (generación): time picker (ej. `08:00`)
    - Fin (retiro): time picker (ej. `14:30`)
    - Delta calculado: display con total (`06 h 30 min`)
  - **Semáforo de riesgo:** indicador automático (`🟢`, `🟡`, `🟠`, `🔴`)

### C. Evaluación de estado final (post-mortem)

- **Condición al retiro:** select `Fresco`, `Mixto`, `Descompuesto`
- **Impacto visible:** matriz rápida para olor, lixiviados y fauna (bajo/medio/alto o sí/no)
- **¿Pérdida de valor?:** switch para marcar deterioro económico

### D. Análisis causa-raíz (motivo del retraso)

- Obligatorio cuando el tiempo supera 2 horas.
- **Causas posibles:** `Ruta inexistente`, `Contenedor lleno`, `Retraso de chofer`, `Falta de segregación`, `Otro (especificar)`

## 4. Estructura de Base de Datos (schema proposal)

### Tabla padre: `retention_logs`

| Campo              | Tipo    | Restricción        | Descripción                               |
|--------------------|---------|--------------------|-------------------------------------------|
| id                 | UUID    | PK                 | Identificador del registro.               |
| survey_id          | UUID    | FK -> `surveys`    | Vínculo con el recorrido maestro.         |
| accumulation_point | VARCHAR | NOT NULL           | Ubicación física del punto de acumulación.|
| notes              | TEXT    | NULLABLE           | Observaciones generales.                  |

### Tabla hija: `retention_entries`

| Campo            | Tipo      | Restricción                              | Descripción                               |
|------------------|-----------|------------------------------------------|-------------------------------------------|
| id               | UUID      | PK                                       | Identificador del evento.                 |
| log_id           | UUID      | FK -> `retention_logs`                   | Relación con la tabla padre.              |
| waste_type       | VARCHAR   | NOT NULL                                 | Tipo de residuo.                          |
| start_time       | TIMESTAMP | NOT NULL                                 | Inicio de la acumulación.                 |
| end_time         | TIMESTAMP | NOT NULL                                 | Fin de la acumulación (retiro).           |
| duration_minutes | INT       | Calculado                                 | Diferencia total en minutos.              |
| risk_level       | ENUM      | `ADEQUATE`, `MODERATE`, `HIGH`, `CRITICAL`| Clasificación de riesgo temporal.         |
| condition_at_exit| ENUM      | `FRESH`, `MIXED`, `DECOMPOSED`           | Estado del residuo al retiro.             |
| has_leachates    | BOOLEAN   | DEFAULT FALSE                            | Indicador de lixiviados.                  |
| has_pests        | BOOLEAN   | DEFAULT FALSE                            | Presencia de fauna nociva.                |
| value_loss       | BOOLEAN   | DEFAULT FALSE                            | Pérdida económica asociada.               |
| delay_cause      | ENUM      | `NO_ROUTE`, `FULL_CONTAINER`, `DELAY`, `BAD_SEGREGATION`, `OTHER` | Causa raíz del retraso. |

## 5. Lógica de Negocio Crítica

- **Clasificación de riesgo:**

```pseudo
if duration_minutes < 120:
    risk_level = 'ADEQUATE'
elif duration_minutes < 360:
    risk_level = 'MODERATE'
elif duration_minutes < 720:
    risk_level = 'HIGH'
else:
    risk_level = 'CRITICAL'
```

- **Correlación de descomposición:** si se registra `risk_level = ADEQUATE` (ej. 30 minutos) pero `condition_at_exit = DECOMPOSED`, lanzar advertencia para investigar si el residuo ya estaba comprometido desde el origen.
