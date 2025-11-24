# Canvas Funcional #11: Mapa de Puntos de Acopio

## Identidad del Formato

- **Código:** FO-DIAG-11
- **Nombre:** Mapa de Puntos de Acopio
- **Naturaleza:** Auditoría de espacios / zonificación sanitaria
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Identifica, georreferencia y evalúa los lugares donde se acumulan residuos (formales o clandestinos), verificando cumplimiento sanitario y riesgos biológicos/operativos.

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Auditor):** Brigadista de campo / inspector sanitario
  - Permiso requerido: `locations.audit`
- **Supervisor (Planeación):** Arquitecto de planta / jefe de operaciones
  - Permiso requerido: `locations.manage_zones`

## 3. Estructura Visual (UI - Modo Mapa)

### A. Encabezado (heredado)

- **Contexto:** `Recorrido #SRV-101 / Nave C`
- **Herramienta:** botón `📍 Marcar nuevo punto`

### B. Ficha del punto de acopio (location card)

Al marcar la ubicación, se capturan tres bloques:

1. **Identificación**
	- Nombre o referencia (`Esquina Local 45`)
	- Tipo de área (`Permanente`, `Temporal`, `Espontáneo`)
	- Superficie aproximada (m²)

2. **Diagnóstico físico**
	- Condición general (`🟢 Adecuada`, `🟡 Regular`, `🔴 Crítica`)
	- Infraestructura: iluminación y ventilación (`Adecuada`, `Nula`)
	- Riesgos visibles: lixiviados, olor ofensivo, fauna nociva, mezcla de residuos

3. **Evaluación funcional**
	- Capacidad (`Suficiente`, `Desbordado`)
	- Interferencia (`¿Estorba el paso?`)
	- Veredicto: `Mantener`, `Adecuar/Mejorar`, `Clausurar/Reubicar`

### C. Croquis digital (evidence layer)

- Foto panorámica obligatoria con cámara gran angular
- Lienzo de dibujo sobre la foto para marcar flujos de entrada y salida

## 4. Estructura de Base de Datos (schema proposal)

### Tabla padre: `accumulation_points`

| Campo     | Tipo    | Restricción     | Descripción                         |
|-----------|---------|-----------------|-------------------------------------|
| id        | UUID    | PK              | Identificador del punto.            |
| survey_id | UUID    | FK -> `surveys` | Recorrido donde se detecta.         |
| name      | VARCHAR | NOT NULL        | Referencia humana.                  |
| type      | ENUM    | `PERMANENT`, `TEMPORAL`, `SPONTANEOUS` | Clasificación legal. |
| area_m2   | DECIMAL | NULLABLE        | Superficie estimada.                |
| geo_lat   | FLOAT   | NOT NULL        | Coordenada geográfica.              |
| geo_lng   | FLOAT   | NOT NULL        | Coordenada geográfica.              |
| status    | ENUM    | `ACTIVE`, `FLAGGED`, `CLOSED`          | Estado operativo.   |

### Tabla hija: `point_assessments`

| Campo         | Tipo    | Restricción                  | Descripción                        |
|---------------|---------|------------------------------|------------------------------------|
| id            | UUID    | PK                           | Identificador de la evaluación.    |
| point_id      | UUID    | FK -> `accumulation_points`  | Relación con el punto.             |
| condition     | ENUM    | `ADEQUATE`, `REGULAR`, `CRITICAL` | Condición general.           |
| lighting      | ENUM    | `ADEQUATE`, `INSUFFICIENT`, `NONE` | Iluminación disponible.    |
| ventilation   | ENUM    | `ADEQUATE`, `POOR`, `NONE`        | Ventilación disponible.     |
| has_leachates | BOOLEAN | DEFAULT FALSE                 | Señal de lixiviados.               |
| odor_level    | ENUM    | `LOW`, `MEDIUM`, `HIGH`        | Nivel de olor.                     |
| has_pests     | BOOLEAN | DEFAULT FALSE                 | Presencia de fauna nociva.         |
| is_mixed      | BOOLEAN | DEFAULT FALSE                 | Mezcla de residuos.                |
| verdict       | ENUM    | `KEEP`, `IMPROVE`, `RELOCATE`  | Recomendación operativa.           |
| media_url     | TEXT    | NULLABLE                       | Foto o croquis de evidencia.       |

## 5. Lógica de Negocio Crítica

- **Regla de tiradero clandestino:** si `type = SPONTANEOUS` y `has_pests = TRUE`, el sistema fuerza `verdict = RELOCATE` y genera alerta sanitaria para el supervisor.
- **Integración con activos (FO-10):** vincular contenedores a puntos de acopio mediante `assets.current_point_id -> accumulation_points.id` para rastrear infraestructura instalada.
