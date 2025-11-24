# Canvas Funcional #00: Matriz de Levantamiento (Orquestador)

## Identidad del Formato

- **Código:** FO-DIAG-00
- **Nombre:** Matriz de Levantamiento en Campo
- **Naturaleza:** Tablero de Control / Checklist Maestro / Parent Record
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Este formato actúa como el contenedor padre de una sesión de diagnóstico. No almacena datos de residuos, sino los metadatos de la visita (quién, cuándo, dónde y bajo qué condiciones). Su ID único (`survey_id`) es la llave que agrupa todos los hallazgos de los formatos hijos (01-18).

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Escritura):** Coordinador de Brigada / Supervisor Revalora
  - Permisos requeridos: `surveys.create`, `surveys.update`
- **Secondary User (Lectura):** Auditor
  - Permiso requerido: `surveys.read`

## 3. Estructura Visual (UI - App Móvil/Tablet)

### A. Encabezado (Contexto de Misión)

- **ID Recorrido:** `[Auto: #SRV-2023-001]`
- **Zona Operativa:** `[Select: Nave C / Pasillo 3 / Compactadora]` (Fuente: tabla `zones`)
- **Turno:** `[Select: Matutino / Vespertino / Nocturno]`
- **Clima:** `[Select: Soleado / Lluvia / Nublado]` (Dato crítico para lixiviados)

### B. Cuerpo (Checklist de Activación)

- Visualización tipo acordeón por bloques.
- **Bloque Residuos (FO-01 a 03):**
  - Estado: `[🟢 Completado / 🔴 Pendiente]`
  - Acción: `+ Agregar Caracterización` → abre Canvas 01.
- **Bloque Operativo (FO-04 a 06):**
  - Estado: `[🔴 Pendiente]`
  - Acción: `+ Cronometrar Tiempos` → abre Canvas 04.
- **Bloque Riesgos (FO-13 a 16):**
  - Toggle: `¿Riesgo inminente detectado?` `[Sí/No]`
  - Al seleccionar `Sí`, se habilitan opciones para FO-16.

### C. Footer

- **Evidencia General:** Botón para capturar foto panorámica del inicio del recorrido.
- **Cierre:** Botón `Firmar y Finalizar Recorrido` (bloquea la edición).

## 4. Estructura de Base de Datos (Schema Proposal)

Para soportar este formato, se proponen las siguientes tablas en PostgreSQL.

### Tabla principal: `surveys` (Recorridos)

Esta tabla concentra la captura de campo.

| Campo      | Tipo        | Restricción       | Descripción                                      |
|------------|-------------|-------------------|--------------------------------------------------|
| id         | UUID        | PK                | Identificador único del recorrido.               |
| code       | VARCHAR(20) | UNIQUE            | Folio legible (ej. `SRV-101`).                   |
| user_id    | UUID        | FK → `users`      | Responsable del levantamiento.                   |
| zone_id    | INT         | FK → `zones`      | Zona auditada.                                   |
| shift      | ENUM        | NOT NULL          | Valores: `MORNING`, `AFTERNOON`, `NIGHT`.        |
| weather    | VARCHAR     | NULLABLE          | Condiciones climáticas.                          |
| status     | ENUM        | DEFAULT `DRAFT`   | Valores: `DRAFT`, `COMPLETED`, `SYNCED`.         |
| started_at | TIMESTAMP   | NOT NULL          | Hora real de inicio en campo.                    |
| ended_at   | TIMESTAMP   | NULLABLE          | Hora de cierre.                                  |
| geo_lat    | FLOAT       | NULLABLE          | GPS latitud (auditoría de presencia).            |
| geo_lng    | FLOAT       | NULLABLE          | GPS longitud.                                    |

### Tablas de catálogo requeridas

- `zones` (`id`, `name`, `type`, `description`).

### Relaciones (Entity Relationship)

- `surveys` 1 : N `waste_characterizations` (FO-01)
- `surveys` 1 : N `volume_logs` (FO-02)
- `surveys` 1 : N `risk_incidents` (FO-16)

> Nota de ingeniería: Todos los formatos del 01 al 18 deben incluir una columna `survey_id` (FK) obligatoria para vincularse a este registro padre.

## 5. Lógica de Negocio Crítica

- **Bloqueo de zona:** No se permite iniciar un nuevo survey en una zona si existe uno previo en estatus `DRAFT` para el mismo usuario (evita duplicados accidentales).
- **Validación de integridad:** Al intentar cambiar el `status` a `COMPLETED`, el backend valida que las alertas de riesgo marcadas en la UI cuenten con registros hijos en `risk_incidents` (FO-16). Si falta evidencia, devuelve un error.
