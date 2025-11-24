# Canvas Funcional #12: Flota y Equipos de Recolección

## Identidad del Formato

- **Código:** FO-DIAG-12
- **Nombre:** Inventario de Equipos de Recolección
- **Naturaleza:** Gestión de flota / auditoría de maquinaria
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Cataloga y evalúa el parque vehicular y herramientas móviles para medir la fuerza de tarea real y detectar riesgos ergonómicos u operativos. Complementa al FO-10 (activos fijos) cubriendo vehículos y herramientas dinámicas.

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Auditor):** Jefe de taller / brigadista logístico
	- Permisos: `fleet.manage`, `fleet.audit`
- **Supervisor (Inversión):** Gerente de logística
	- Permiso: `fleet.approve_maintenance`

## 3. Estructura Visual (UI - Modo Flota)

### A. Encabezado (heredado)

- **Contexto:** `Recorrido #SRV-101 / Patio de Maniobras`
- **Semana de referencia:** `Semana 42`

### B. Inventario de unidades (fleet cards)

- Carrusel de tarjetas por vehículo.
- Datos clave: código (`TR-05`), tipo (`Carreta`, `Camión`, `Montacargas`, `Tracto`), marca/modelo (`Kenworth T300`), estado físico (`🟢 Óptimo`, `🟡 Funcional`, `🟠 Deficiente`, `🔴 Inoperante`), capacidad (toneladas) y uso (`Recolección`, `Transporte`, `Apoyo`).
- Registro mediante escaneo VIN/QR o captura manual.

### C. Auditoría en acción (live ops check)

- Activada cuando el equipo está operando.
- Captura si está en operación, tipo de carga (`Orgánico`, `Mixto`, `Rechazo`) y checklist de riesgos (fugas de fluidos, humo, luces/alarmas, EPP del operador).

### D. Diagnóstico de suficiencia

- Adecuación (`Adecuado`, `Insuficiente`, `Crítico`).
- Segregación habilitada (`¿Permite separar residuos?`).
- Acción requerida: `Nada`, `Mantenimiento`, `Sustitución`.

### E. Solicitud de inversión

- Captura equipo faltante y prioridad (`High`, `Medium`, `Low`).

## 4. Estructura de Base de Datos (schema proposal)

### Tabla maestra: `fleet_assets`

| Campo           | Tipo    | Restricción        | Descripción                               |
|-----------------|---------|--------------------|-------------------------------------------|
| id              | UUID    | PK                 | Identificador del vehículo.               |
| code            | VARCHAR | UNIQUE             | Placa o número económico.                 |
| type            | ENUM    | `CART`, `TRUCK`, `FORKLIFT`, `TRACTOR` | Tipo de unidad. |
| brand_model     | VARCHAR | NULLABLE           | Marca y modelo.                            |
| capacity_tons   | DECIMAL | NOT NULL           | Capacidad de carga.                        |
| status          | ENUM    | `OPERATIONAL`, `MAINTENANCE`, `BROKEN` | Estado operativo. |
| assigned_zone_id| INT     | FK -> `zones`      | Base operativa habitual.                   |

### Tabla padre: `fleet_audits`

| Campo             | Tipo    | Restricción      | Descripción                           |
|-------------------|---------|------------------|---------------------------------------|
| id                | UUID    | PK               | Identificador de la auditoría.        |
| survey_id         | UUID    | FK -> `surveys`  | Recorrido asociado.                   |
| general_condition | ENUM    | `GOOD`, `REGULAR`, `CRITICAL` | Estado global de la flota. |
| safety_compliant  | BOOLEAN | DEFAULT TRUE     | Cumplimiento de seguridad.            |
| notes             | TEXT    | NULLABLE         | Observaciones adicionales.            |

### Tabla hija: `fleet_logs`

| Campo           | Tipo    | Restricción                 | Descripción                            |
|-----------------|---------|-----------------------------|----------------------------------------|
| id              | UUID    | PK                          | Identificador del registro.            |
| audit_id        | UUID    | FK -> `fleet_audits`        | Auditoría de referencia.               |
| vehicle_id      | UUID    | FK -> `fleet_assets`        | Vehículo evaluado.                     |
| physical_state  | ENUM    | `OPTIMAL`, `FUNCTIONAL`, `DEFICIENT`, `INOPERATIVE` | Condición observada. |
| is_operating    | BOOLEAN | DEFAULT FALSE               | Indica si estaba en operación.         |
| risk_identified | BOOLEAN | DEFAULT FALSE               | Se detectó riesgo operativo.           |
| action_needed   | ENUM    | `NONE`, `MAINTENANCE`, `REPLACE` | Acción recomendada.              |
| media_url       | TEXT    | NULLABLE                    | Evidencia fotográfica.                 |

## 5. Lógica de Negocio Crítica

- **Bloqueo de seguridad:** si `risk_identified = TRUE`, actualizar `fleet_assets.status = MAINTENANCE`, generar ticket y enviar alerta push al jefe de taller para retirar la unidad.
- **Capacidad teórica:** sumar `capacity_tons` de unidades `OPERATIONAL` y compararla contra el volumen proyectado en FO-02 para estimar déficit o superávit de flota.
- **Alertas de déficit:** cuando la capacidad disponible sea menor al 80 % del volumen diario, mostrar insight de déficit porcentual en el tablero.
