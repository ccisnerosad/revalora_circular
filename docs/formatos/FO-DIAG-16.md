# Canvas Funcional #16: Seguridad Física y Riesgos

## Identidad del Formato

- **Código:** FO-DIAG-16
- **Nombre:** Condiciones de Riesgo en Pasillos y Accesos
- **Naturaleza:** Auditoría de seguridad industrial (HSE)
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Detecta peligros físicos que amenazan a personas o frenan la operación logística para construir un mapa de riesgos y priorizar mantenimiento (bacheo, iluminación, señalización).

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Inspector):** Brigadista de seguridad industrial / supervisor de operaciones
	- Permiso: `safety_risk.report`
- **Supervisor (Acción):** Gerente de mantenimiento o seguridad
	- Permiso: `safety_risk.dispatch_repair`

## 3. Estructura Visual (UI - Modo Inspector)

### A. Encabezado (heredado)

- **Contexto:** `Recorrido #SRV-101 / Rampa de Acceso Norte`
- **Acceso específico:** `Puerta 3`

### B. Reporte de incidente (hazard card)

- Selección de tipo de riesgo (obstáculo, derrame, bloqueo, desnivel, falta de señalización).
- Ubicación georreferenciada.
- Impactos potenciales (`Peatón`, `Vehicular`, `Operativo`).

### C. Evaluación de circulación

- Flujo peatonal y vehicular (semáforo seguro/inseguro).
- Accesos libres (`Sí/No`).
- Estado de señalización (`Adecuada`, `Deficiente`, `Inexistente`).

### D. Veredicto de seguridad

- Nivel (`🟢 Bajo`, `🟡 Medio`, `🔴 Alto`).
- Medida inmediata (`Acordonar`, `Retirar obstáculo`, `Solicitar bacheo`, `Señal temporal`).

### E. Evidencia

- Foto obligatoria y video opcional del flujo vehicular.

## 4. Estructura de Base de Datos (schema proposal)

### Tabla padre: `safety_incidents`

| Campo         | Tipo  | Restricción               | Descripción                          |
|---------------|-------|---------------------------|--------------------------------------|
| id            | UUID  | PK                        | Identificador del incidente.         |
| survey_id     | UUID  | FK -> `surveys`           | Recorrido asociado.                  |
| risk_type     | ENUM  | `OBSTACLE`, `SPILL`, `BLOCKAGE`, `UNEVEN_FLOOR`, `NO_SIGNAGE` | Tipo detectado. |
| impact_target | ARRAY | ENUM `PEDESTRIAN`, `VEHICLE`, `OPERATIONAL` | Público en riesgo. |
| risk_level    | ENUM  | `LOW`, `MEDIUM`, `HIGH`   | Severidad calculada.                 |
| location_geo  | POINT | NOT NULL                  | Coordenadas geográficas.             |
| signage_status| ENUM  | `ADEQUATE`, `DEFICIENT`, `MISSING` | Calidad de señalización.  |
| action_taken  | ENUM  | `CORDONED`, `REMOVED`, `REPORTED` | Medida inmediata aplicada. |
| status        | ENUM  | `OPEN`, `IN_PROGRESS`, `RESOLVED` | Estado del ticket.         |
| media_url     | TEXT  | NOT NULL                  | Evidencia visual obligatoria.        |

## 5. Lógica de Negocio Crítica

- **Protocolo riesgo crítico:** si `risk_level = HIGH`, bloquear envío hasta confirmar acordonamiento; generar alerta a seguridad patrimonial.
- **Mapa de calor:** agrupar incidentes por coordenadas; si se registran más de 3 en 10 m durante el último mes, marcar la zona como punto negro en el tablero gerencial.
- **Escalada automática:** incidentes `NO_SIGNAGE` repetidos más de dos veces en una semana generan ticket preventivo para instalaciones.
