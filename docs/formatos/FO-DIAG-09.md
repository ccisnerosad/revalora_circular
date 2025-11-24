# Canvas Funcional #09: Matriz de Poder e Intereses

## Identidad del Formato

- **Código:** FO-DIAG-09
- **Nombre:** Matriz de Actores e Intereses
- **Naturaleza:** Análisis estratégico / gestión del cambio
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Cruza los hallazgos de FO-07 y FO-08 para construir un mapa político que identifique actores con alto poder y resistencia, detectando “bombas de tiempo” y guiando la estrategia de intervención.

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Analista):** Gerente de proyecto / especialista en gobernanza
  - Permiso requerido: `strategy.manage`
- **Supervisor (Visión):** Dirección general
  - Permiso requerido: `strategy.view_dashboard`

## 3. Estructura Visual (UI - Dashboard Estratégico)

### A. Encabezado

- **Fase del diagnóstico:** control segmentado (`Inicial`, `Intermedia`, `Final`)
- **Zona de impacto:** selector (`Nave C`, `Toda la planta`, etc.)

### B. Selector de jugadores

- Importar actores desde FO-07 y FO-08 (`+ Importar`).
- Se muestra una lista (ej. “Jefe de limpieza”, “Líder de pepenadores”).
- Drag & drop para colocarlos en el tablero.

### C. Matriz interactiva

- Plano de cuadrantes con los ejes:
  - Eje Y: poder/influencia (`Bajo — Alto`)
  - Eje X: interés en el proyecto (`Bajo — Alto`)
  - Color (Z): actitud (`🟢 Aliado`, `🟡 Neutro`, `🔴 Opositor`)
- Cuadrantes resultantes y estrategia sugerida:
  - Promotores (alto poder / alto interés) → gestionar de cerca
  - Latentes (alto poder / bajo interés) → mantener satisfechos
  - Defensores (bajo poder / alto interés) → mantener informados
  - Indiferentes (bajo poder / bajo interés) → monitorear

### D. Deep dive por actor

- Tipo de interés: chips (`💰 Económico`, `⚙️ Operativo`, `👑 Político`, `🛡️ Control`)
- Riesgo de conflicto: select (`Alto`, `Medio`, `Bajo`)
- Causa probable: texto breve
- Impacto estimado: matriz para operación y gobernanza (`Alto` / `Bajo`)

### E. Motor de estrategia

- Estrategia recomendada según cuadrante (ej. “Negociar” para opositores con alto poder)
- Acción táctica: área de texto para detallar el plan

## 4. Estructura de Base de Datos (schema proposal)

### Tabla padre: `strategic_analyses`

| Campo        | Tipo      | Restricción        | Descripción                         |
|--------------|-----------|--------------------|-------------------------------------|
| id           | UUID      | PK                 | Identificador del análisis.         |
| project_phase| ENUM      | `INITIAL`, `INTERMEDIATE`, `FINAL` | Etapa del proyecto.     |
| zone_focus   | VARCHAR   | NULLABLE           | Zona analizada.                     |
| created_at   | TIMESTAMP | NOT NULL           | Fecha/hora del corte.               |

### Tabla hija: `actor_matrix_entries`

| Campo         | Tipo | Restricción                          | Descripción                               |
|---------------|------|--------------------------------------|-------------------------------------------|
| id            | UUID | PK                                   | Identificador del registro.               |
| analysis_id   | UUID | FK -> `strategic_analyses`           | Relación con la tabla padre.              |
| actor_ref_id  | UUID | NOT NULL                             | ID del actor (FO-07 u FO-08).             |
| actor_source  | ENUM | `FORMAL`, `INFORMAL`                 | Origen del actor.                         |
| influence_score | INT | 1-100                               | Poder/influencia (eje Y).                 |
| interest_score  | INT | 1-100                               | Interés (eje X).                          |
| attitude      | ENUM | `FAVORABLE`, `NEUTRAL`, `RESISTANT`  | Actitud actual.                           |
| interest_type | ENUM | `ECONOMIC`, `POLITICAL`, `CONTROL`, `OPERATIONAL` | Motivador principal. |
| conflict_risk | ENUM | `LOW`, `MEDIUM`, `HIGH`              | Riesgo potencial.                         |
| strategy_code | ENUM | `INTEGRATE`, `INFORM`, `MONITOR`, `NEGOTIATE` | Estrategia recomendada. |

## 5. Lógica de Negocio Crítica

- **Priorización de riesgos:**

```pseudo
if conflict_risk == 'HIGH' and influence_score > 70:
    trigger_alert('Amenaza de gobernanza activa')
    notify('Direccion', 'Conflicto crítico detectado')
```

- **Consistencia histórica:** cuando un actor cambia de actitud entre fases (ej. aliado → resistente), solicitar justificación para documentar la variación.
