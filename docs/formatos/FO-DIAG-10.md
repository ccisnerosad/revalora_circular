# Canvas Funcional #10: Inventario de Infraestructura

## Identidad del Formato

- **Código:** FO-DIAG-10
- **Nombre:** Inventario de Contenedores e Infraestructura Existente
- **Naturaleza:** Gestión de activos / auditoría de mantenimiento
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Digitaliza el inventario físico para crear un catálogo maestro de activos y validar si la infraestructura soporta el volumen proyectado (FO-02).

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Auditor):** Brigadista de activos / jefe de mantenimiento
	- Permisos requeridos: `assets.create`, `assets.audit_condition`
- **Supervisor (Planeación):** Gerente de compras / operaciones
	- Permiso requerido: `assets.approve_purchase`

## 3. Estructura Visual (UI - Modo Inventario)

### A. Encabezado (heredado)

- **Contexto:** `Recorrido #SRV-101 / Nave C`
- **Fase:** `Diagnóstico inicial`, `Actualización`, `Verificación`

### B. Registro de contenedores (asset tagging)

- Alta rápida con escáner QR o creación manual.
- Por cada activo:
	- Código visual (`C-NAVE-01`, autogenerado, etc.)
	- Tipo (`🗑️ Plástico`, `🏗️ Metálico`, `🛒 Rodante`, `🏭 Fijo`)
	- Capacidad (`200 L`, `1 m3`, `3 m3`, otro)
	- Estado físico (`🟢 Bueno`, `🟡 Regular`, `🔴 Deteriorado`)
	- Uso actual (`Orgánico`, `Mixto`, `Rechazo`)
	- Foto obligatoria cuando el estado no es bueno

### C. Infraestructura fija

- Checklist del entorno: área de acopio, rampas, drenajes/canaletas, señalización (cada uno con estado predefinido)

### D. Análisis de capacidad

- Capacidad suficiente (Sí/No, con cantidad faltante)
- Seguridad para operar (Sí/No)
- Requiere sustitución (Sí/No)

### E. Solicitud de requerimientos

- Necesidad específica, prioridad (`High`, `Medium`, `Low`) y justificación

## 4. Estructura de Base de Datos (schema proposal)

### Tabla maestra: `assets`

| Campo           | Tipo    | Restricción        | Descripción                              |
|-----------------|---------|--------------------|------------------------------------------|
| id              | UUID    | PK                 | Identificador único del activo.          |
| code            | VARCHAR | UNIQUE             | Código visual/QR.                        |
| type            | ENUM    | `BIN_PLASTIC`, `BIN_METAL`, `ROLLOFF`, `FIXED` | Tipo de activo. |
| capacity_m3     | DECIMAL | NOT NULL           | Capacidad nominal en m3.                 |
| material        | ENUM    | `HDPE`, `METAL`, `MIXED`                     | Material principal. |
| status          | ENUM    | `ACTIVE`, `MAINTENANCE`, `DECOMMISSIONED`    | Estado de vida.   |
| current_zone_id | INT     | FK -> `zones`      | Zona actual (para activos móviles).      |

### Tabla padre: `infrastructure_audits`

| Campo                    | Tipo      | Restricción        | Descripción                              |
|--------------------------|-----------|--------------------|------------------------------------------|
| id                       | UUID      | PK                 | Identificador de la auditoría.           |
| survey_id                | UUID      | FK -> `surveys`    | Relación con el recorrido.               |
| audit_phase              | ENUM      | `INITIAL`, `UPDATE`, `VERIFICATION` | Fase de revisión. |
| collection_area_condition| ENUM      | `GOOD`, `INSUFFICIENT`, `CRITICAL`  | Condición del área de acopio. |
| ramps_condition          | ENUM      | `OPERATIONAL`, `DAMAGED`, `NON_FUNCTIONAL` | Estado de rampas. |
| signage_condition        | ENUM      | `VISIBLE`, `DETERIORATED`, `MISSING` | Señalización. |
| capacity_sufficient      | BOOLEAN   | DEFAULT TRUE       | Evaluación de capacidad.                 |
| safety_compliant         | BOOLEAN   | DEFAULT TRUE       | Cumplimiento de seguridad.               |
| replacement_needed       | BOOLEAN   | DEFAULT FALSE      | Indica necesidad de sustitución.         |

### Tabla hija: `asset_condition_logs`

| Campo             | Tipo    | Restricción                    | Descripción                             |
|-------------------|---------|--------------------------------|-----------------------------------------|
| id                | UUID    | PK                             | Identificador del registro.             |
| audit_id          | UUID    | FK -> `infrastructure_audits`  | Auditoría a la que pertenece.           |
| asset_id          | UUID    | FK -> `assets`                 | Activo evaluado.                        |
| physical_condition| ENUM    | `GOOD`, `REGULAR`, `DETERIORATED` | Condición física observada.         |
| current_use       | ENUM    | `ORGANIC`, `MIXED`, `REJECT`   | Uso registrado durante la auditoría.    |
| notes             | TEXT    | NULLABLE                       | Comentarios adicionales.                |
| media_url         | TEXT    | NULLABLE                       | Foto de evidencia.                      |

## 5. Lógica de Negocio Crítica

- **Ciclo de vida del activo:** si una auditoría marca `physical_condition = DETERIORATED` y `replacement_needed = TRUE`, actualizar el activo a `MAINTENANCE_REQUIRED` y generar ticket de servicio.
- **Geolocalización dinámica:** al registrar un activo durante un `survey`, actualizar `current_zone_id` con la zona visitada para rastrear movimientos entre naves.
