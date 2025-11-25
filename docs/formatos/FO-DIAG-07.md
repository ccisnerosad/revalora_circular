# Canvas Funcional #07: Mapeo de Actores Formales

## Identidad del Formato

- **Código:** FO-DIAG-07
- **Nombre:** Registro de Actores Formales y Funciones
- **Naturaleza:** Inteligencia social / stakeholder mapping
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Identifica a los jugadores clave dentro de la estructura formal (limpieza, seguridad, administración) y su postura frente al proyecto. Evalúa poder de influencia y nivel de apoyo u oposición.

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Entrevistador):** Coordinador de diagnóstico / trabajador social
	- Permiso requerido: `stakeholders.interview`
- **Supervisor (Estrategia):** Gerente de cambio organizacional
	- Permiso requerido: `stakeholders.view_sensitive`

## 3. Estructura Visual (UI - App Tablet)

### A. Encabezado (heredado)

- **Contexto:** `Recorrido #SRV-101 / Zona Administrativa`
- **Área vinculada:** chips `Limpieza`, `Admin`, `Seguridad`, `Operación`

### B. Perfil del actor (card de identidad)

- **Búsqueda previa:** evitar duplicados mediante buscador.
- **Datos nuevos:**
	- Nombre
	- Cargo / función (con sugerencias)
	- Antigüedad (`<1 año`, `1-5 años`, `>5 años`)
	- Tipo de participación (`Directa`, `Indirecta`)

### C. La entrevista (wizard paso a paso)

- Preguntas individuales para mantener confianza.
- Funciones: “¿Qué hace con los residuos?” (incluye dictado por voz)
- Conocimiento: “¿Sabe a dónde va la basura?” (switch Sí/No)
- Historial: “¿Participó en proyectos previos?” (switch)
	- Si responde Sí, abrir campo “¿Qué pasó?”
- Dolores y deseos:
	- Problemáticas: selección de tags
	- Oportunidades: área de texto libre

### D. Matriz de poder (evaluación interna)

- Completa el entrevistador tras la charla.
- **Influencia:** slider `Baja — Alta`
- **Disposición al cambio:** semáforo (`🟢 Aliado`, `🟡 Neutro`, `🔴 Resistente`)
- **Riesgos detectados:** checklist (`Sabotaje operativo`, `Bloqueo administrativo`, `Conflicto laboral`)

## 4. Estructura de Base de Datos (schema proposal)

### Tabla padre: `stakeholder_interviews`

| Campo             | Tipo    | Restricción     | Descripción                              |
|-------------------|---------|-----------------|------------------------------------------|
| id                | UUID    | PK              | Identificador de la entrevista.          |
| survey_id         | UUID    | FK -> `surveys` | Vínculo con el recorrido maestro.        |
| stakeholder_name  | VARCHAR | NOT NULL        | Nombre del actor.                        |
| department        | ENUM    | `CLEANING`, `ADMIN`, `SECURITY`, `OPS` | Área de pertenencia. |
| role              | VARCHAR | NOT NULL        | Cargo o función.                         |
| seniority         | ENUM    | `JUNIOR`, `MID`, `SENIOR`             | Antigüedad.                              |
| participation     | ENUM    | `DIRECT`, `INDIRECT`                  | Relación con el flujo de residuos.       |
| knowledge_dest    | BOOLEAN | DEFAULT FALSE   | Conoce el destino final del residuo.     |
| past_projects     | BOOLEAN | DEFAULT FALSE   | Ha participado en proyectos previos.     |
| pain_points       | TEXT    | NULLABLE        | Problemas detectados.                    |
| influence_level   | INT     | 1-10            | Nivel de poder percibido.                |
| change_willingness| INT     | 1-10            | Disposición al cambio.                   |
| risks_detected    | JSONB   | NULLABLE        | Lista de riesgos marcados.               |
| audio_url         | TEXT    | NULLABLE        | Grabación de voz.                        |
| signature_url     | TEXT    | NULLABLE        | Firma digital.                            |

## 5. Lógica de Negocio Crítica

- **Detector de líderes negativos:**

```pseudo
if influence_level > 7 and change_willingness < 3:
		mark_as('FLAGGED_FOR_HR')
		notify_manager('Gerente de Cambio', 'Líder resistente detectado en el área')
```

- **Privacidad:** campos como `influence_level` y `risks_detected` son visibles solo para administradores internos; se ocultan a auditores externos para evitar conflictos políticos.
