# Canvas Funcional #13: Lixiviados y Escurrimientos

## Identidad del Formato

- **Código:** FO-DIAG-13
- **Nombre:** Registro de Lixiviados y Escurrimientos
- **Naturaleza:** Auditoría ambiental / control de riesgo biológico
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Detecta, clasifica y mapea fugas de líquidos contaminantes para activar protocolos de limpieza urgente y evitar sanciones o focos infecciosos.

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Inspector):** Brigadista de seguridad e higiene
	- Permiso: `env_risk.report`
- **Supervisor (Acción):** Jefe de limpieza / coordinador ambiental
	- Permiso: `env_risk.dispatch_cleanup`

## 3. Estructura Visual (UI - Modo Hazmat)

### A. Encabezado (heredado)

- **Contexto:** `Recorrido #SRV-101 / Pasillo 2`
- **Punto específico:** `Contenedor C-04`

### B. Análisis del derrame (investigación forense)

- Origen del residuo (`Orgánico`, `Mixto`, `Rechazo`).
- Tipo de fuga (`Superficial`, `Subterránea`).
- Características físicas: color (`⚪️ Claro`, `🟤 Oscuro`, `⚫️ Turbio`), intensidad de olor (slider bajo-medio-alto), frecuencia (`Esporádico`, `Frecuente`, `Permanente`), dimensión en metros.

### C. Evaluación de impacto (matriz de riesgo)

- Checklist ambiental: llegada a drenaje, olores en áreas sensibles, fauna nociva.
- Riesgo visual (`Bajo`, `Medio`, `Alto`).

### D. Veredicto de criticidad

- Nivel y acción automática: `🟢 Bajo` (monitoreo), `🟡 Medio` (programar limpieza), `🔴 Alto` (limpieza inmediata).

### E. Evidencia obligatoria

- Foto geotag registrada y video opcional del flujo activo.

## 4. Estructura de Base de Datos (schema proposal)

### Tabla padre: `leachate_incidents`

| Campo            | Tipo    | Restricción         | Descripción                           |
|------------------|---------|---------------------|---------------------------------------|
| id               | UUID    | PK                  | Identificador del incidente.          |
| survey_id        | UUID    | FK -> `surveys`     | Recorrido en el que se detecta.       |
| location_detail  | VARCHAR | NOT NULL            | Descripción específica del sitio.     |
| source_waste     | ENUM    | `ORGANIC`, `MIXED`, `REJECT` | Residuo causante.            |
| leak_type        | ENUM    | `SURFACE`, `UNDERGROUND`     | Tipo de fuga.                |
| color            | ENUM    | `CLEAR`, `DARK`, `TURBID`    | Color observado.             |
| odor_intensity   | ENUM    | `LOW`, `MEDIUM`, `HIGH`      | Intensidad de olor.          |
| extension_meters | DECIMAL | NULLABLE             | Extensión estimada en metros.        |
| frequency        | ENUM    | `SPORADIC`, `FREQUENT`, `PERMANENT` | Frecuencia reportada. |
| drains_risk      | BOOLEAN | DEFAULT FALSE        | Indica si llega al drenaje.          |
| criticality      | ENUM    | `LOW`, `MEDIUM`, `HIGH`      | Nivel de alerta.             |
| action_status    | ENUM    | `REPORTED`, `CLEANUP_SCHEDULED`, `RESOLVED` | Estado del ticket. |
| media_url        | TEXT    | NOT NULL             | Evidencia visual obligatoria.        |

## 5. Lógica de Negocio Crítica

- **Disparador de emergencia:** si `criticality = HIGH` o `drains_risk = TRUE`, crear orden de trabajo con prioridad urgente y notificar al supervisor con alerta push.
- **Control de cierre:** incidentes `HIGH` requieren cargar evidencia del antes y después antes de marcarse como `RESOLVED`.
- **Seguimiento temporal:** si `frequency = PERMANENT`, generar recordatorio diario hasta que el estado cambie a `CLEANUP_SCHEDULED`.
