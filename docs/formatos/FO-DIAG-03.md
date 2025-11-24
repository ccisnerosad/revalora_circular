# Canvas Funcional #03: Potencial de Aprovechamiento

## Identidad del Formato

- **Código:** FO-DIAG-03
- **Nombre:** Registro de Potencial de Aprovechamiento por Tipo de Residuo
- **Naturaleza:** Evaluación cualitativa / matriz de decisión
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Este formato funge como brújula de valorización: determina técnica y sanitariamente si un residuo es apto para rescate humano, uso animal, biofertilizante o composta. Sirve como filtro de calidad para evitar inversiones en procesos posteriores cuando el material no cumple las condiciones mínimas.

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Escritura):** Analista de calidad / Ingeniero agrónomo
  - Observación: requiere perfil técnico especializado.
  - Permiso requerido: `waste_quality.assess`
- **Supervisor (Auditoría):** Gerente de planta
  - Permiso requerido: `waste_quality.override` (puede vetar un rescate humano por seguridad)

## 3. Estructura Visual (UI - App Móvil/Tablet)

### A. Encabezado (heredado)

- **Contexto:** `Recorrido #SRV-101 / Nave C`
- **Muestra:** Auto ID (ej. `Muestra #001`)

### B. Identificación de la muestra

- **Residuo:** Autocompletado (ej. `Lechuga Orejona`)
- **Origen:** Select `Puesto de mercado`, `Bodega`, `Pasillo general`
  - Si se elige `Puesto`, aparece campo opcional para número de local.
- **Estado físico:** Control segmentado (`🟢 Fresco`, `🟡 Mixto`, `🔴 Descompuesto`)

### C. Criterios de seguridad (safety checklist)

- Evaluación previa al potencial para medir riesgo.
- **Apariencia sanitaria:** Select `Aceptable`, `Dudosa`, `No aceptable`
- **Contaminantes físicos:** Switch Sí/No (vidrio, plástico, etc.)
- **Grado de descomposición:** Slider `Bajo — Medio — Alto`
- **Riesgo sanitario:** Calculado automáticamente con opción de ajuste manual

### D. Matriz de potencial (star rating)

- Escala de 1 a 4 (Nulo, Bajo, Medio, Alto).
- **Rescate humano:** ⭐️ ⭐️ ⭐️ ⭐️ (bloqueado si el riesgo supera `Medio`)
- **Alimento animal:** ⭐️ ⭐️ ⭐️ ⭐️
- **Biofertilizante:** ⭐️ ⭐️ ⭐️ ⭐️
- **Composta:** ⭐️ ⭐️ ⭐️ ⭐️

### E. Veredicto final (actionable insight)

- **Destino recomendado:** Chips grandes con opciones como `🍽️ Banco de Alimentos`, `🐷 Ganado`, `⚡ Biodigestor`, `🍂 Composta`, `🗑️ Relleno sanitario (rechazo)`

## 4. Estructura de Base de Datos (schema proposal)

### Tabla padre: `waste_quality_assessments`

| Campo     | Tipo | Restricción | Descripción                        |
|-----------|------|-------------|------------------------------------|
| id        | UUID | PK          | Identificador único de la evaluación. |
| survey_id | UUID | FK -> `surveys` | Relación con el recorrido maestro. |
| notes     | TEXT | NULLABLE    | Observaciones generales.          |

### Tabla hija: `waste_quality_samples`

| Campo            | Tipo    | Restricción                               | Descripción                             |
|------------------|---------|-------------------------------------------|-----------------------------------------|
| id               | UUID    | PK                                        | Identificador de la muestra.            |
| assessment_id    | UUID    | FK -> `waste_quality_assessments`         | Relación con la evaluación padre.       |
| waste_type       | VARCHAR | NOT NULL                                  | Tipo de residuo.                        |
| origin_type      | ENUM    | `STALL`, `WAREHOUSE`, `AISLE`             | Origen del material.                    |
| physical_state   | ENUM    | `FRESH`, `MIXED`, `DECOMPOSED`            | Estado físico.                          |
| sanitary_risk    | ENUM    | `LOW`, `MEDIUM`, `HIGH`                   | Riesgo sanitario calculado.             |
| pot_human        | INT     | 0-3                                       | Score de potencial humano.              |
| pot_animal       | INT     | 0-3                                       | Score de potencial animal.              |
| pot_biofert      | INT     | 0-3                                       | Score de biofertilizante.               |
| pot_compost      | INT     | 0-3                                       | Score de composta.                      |
| final_verdict    | ENUM    | `HUMAN`, `ANIMAL`, `DIGESTER`, `COMPOST`, `REJECT` | Decisión final recomendada. |

## 5. Lógica de Negocio Crítica (reglas de oro)

- **Protocolo de seguridad alimentaria:**

```pseudo
if sanitary_risk == 'HIGH' or physical_state == 'DECOMPOSED':
  pot_human = 0
  disable_destino('Banco de Alimentos')
  show_alert('⛔ Material no apto para consumo humano')
```

- **Jerarquía de valor:** La UI sugiere automáticamente el destino de mayor valor en función de los puntajes (ej. alto `pot_human` preselecciona banco de alimentos, alto `pot_biofert` favorece biodigestor).
- **Validación cruzada:** Si se elige destino `Alimento animal` con contaminantes físicos marcados en `Sí`, mostrar advertencia: “¿Confirmar? Riesgo de asfixia o daño para el animal”.
