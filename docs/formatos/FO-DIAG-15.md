# Canvas Funcional #15: Control de Plagas y Fauna

## Identidad del Formato

- **Código:** FO-DIAG-15
- **Nombre:** Registro de Fauna Nociva
- **Naturaleza:** Bioseguridad / control de vectores
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Identifica focos de infestación y vectores de enfermedad para justificar servicios de fumigación o control animal. Diferencia plagas menores (insectos, roedores) de fauna mayor (perros, gatos) con protocolos diferenciados.

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Observador):** Brigadista de seguridad o limpieza
	- Permiso: `pest_control.report`
- **Supervisor (Acción):** Coordinador de sanidad o proveedor de fumigación
	- Permiso: `pest_control.dispatch_service`

## 3. Estructura Visual (UI - Modo Safari Urbano)

### A. Encabezado (heredado)

- **Contexto:** `Recorrido #SRV-101 / Nave C`
- **Brigada:** `Seguridad`, `Limpieza`, `Diagnóstico`

### B. Avistamiento (quick logger)

- Selección tipo de fauna (íconos grandes: ratas, cucarachas, moscas, aves, perros/gatos, otros).
- Cantidad estimada (`Baja`, `Media`, `Alta`).
- Frecuencia (`Esporádica`, `Frecuente`, `Permanente`).

### C. Etología y riesgo

- Actitud (`Pasiva`, `Agresiva`, `Reproductiva`).
- Riesgo sanitario calculado (`Bajo`, `Medio`, `Alto`).

### D. Condiciones atractivas

- Checklist de causas: residuos expuestos, agua estancada, contenedores abiertos, refugios.

### E. Acción inmediata

- Recomendación (`Limpieza profunda`, `Colocar cebos/trampas`, `Control animal`, `Sellado de grietas`).

### F. Nivel de criticidad

- Semáforo (`🟢 Monitoreo`, `🟡 Programar fumigación`, `🔴 Intervención inmediata`).

## 4. Estructura de Base de Datos (schema proposal)

### Tabla padre: `pest_sightings`

| Campo            | Tipo    | Restricción         | Descripción                              |
|------------------|---------|---------------------|------------------------------------------|
| id               | UUID    | PK                  | Identificador del avistamiento.          |
| survey_id        | UUID    | FK -> `surveys`     | Recorrido correspondiente.               |
| fauna_type       | ENUM    | `RODENTS`, `ROACHES`, `FLIES`, `BIRDS`, `FERAL_DOGS`, `OTHER` | Tipo detectado. |
| quantity_level   | ENUM    | `LOW`, `MEDIUM`, `HIGH` | Magnitud observada.                 |
| frequency        | ENUM    | `SPORADIC`, `FREQUENT`, `PERMANENT` | Recurrencia.               |
| behavior         | ENUM    | `PASSIVE`, `AGGRESSIVE`, `REPRODUCTIVE` | Actitud observada.     |
| sanitary_risk    | ENUM    | `LOW`, `MEDIUM`, `HIGH` | Nivel de riesgo sanitario.        |
| attractants      | JSONB   | NULLABLE            | Lista de condiciones atractivas.         |
| action_suggested | ENUM    | `CLEAN`, `BAIT`, `ANIMAL_CONTROL`, `SEAL` | Acción propuesta.  |
| criticality      | ENUM    | `MONITOR`, `SCHEDULED`, `URGENT` | Urgencia operativa.           |
| media_url        | TEXT    | NULLABLE            | Foto o video del evento.                 |

## 5. Lógica de Negocio Crítica

- **Protocolo de agresividad:** si `fauna_type = FERAL_DOGS` y `behavior = AGGRESSIVE`, mostrar pop-up de alerta, notificar a seguridad física y bloquear cierre sin confirmación de retiro seguro.
- **Correlación con FO-05:** cruzar con tiempos de permanencia; si `quantity_level = HIGH` y residuos llevan >12 h, generar insight de causa raíz confirmada.
- **Planificación de fumigación:** acumular eventos `RODENTS` o `ROACHES` `FREQUENT` en la misma zona para programar servicio recurrente cada semana.
