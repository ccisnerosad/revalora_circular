# Canvas Funcional #18: Matriz de Escenarios de Intervención

## Identidad del Formato

- **Código:** FO-DIAG-18
- **Nombre:** Matriz de Escenarios de Intervención
- **Naturaleza:** Planeación de escenarios / toma de decisiones estratégicas
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Herramienta de negociación que expone cuatro alternativas de intervención y su costo-beneficio para obtener la aprobación del escenario ganador.

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Estratega):** Consultor senior / director de proyecto
	- Permiso: `scenarios.create`
- **Supervisor (Decisor):** Comité directivo CEDA / inversionistas
	- Permisos: `scenarios.vote`, `scenarios.approve`

## 3. Estructura Visual (UI - Sala de guerra / voting app)

### A. Encabezado

- Nombre de la sesión (`Taller de Cierre Fase 1`) y participantes (chips de usuarios presentes).

### B. Los 4 caminos (scenario cards)

| Escenario            | Descripción            | Alcance    | Horizonte     |
|----------------------|------------------------|------------|---------------|
| 🐢 Conservador       | Arreglar lo básico     | Limitado   | Corto plazo   |
| 🚶 Progresivo        | Mejora gradual         | Moderado   | Mediano plazo |
| 🎯 Piloto focalizado | Zona modelo            | Delimitado | Corto-mediano |
| 🚀 Óptimo            | Transformación total   | Amplio     | Largo plazo   |

### C. Matriz de evaluación

- Calificación por criterio (`Bajo`, `Medio`, `Alto`) para inversión, impacto operativo, reducción de riesgos y aceptación social (usa datos FO-09).

### D. Veredicto del taller

- Selección del escenario ganador (radio button destacado) y justificación narrativa.

### E. Tablero de acuerdos

- Captura de compromisos: acción, responsable y fecha límite.

## 4. Estructura de Base de Datos (schema proposal)

### Tabla padre: `intervention_workshops`

| Campo               | Tipo    | Restricción               | Descripción                               |
|---------------------|---------|---------------------------|-------------------------------------------|
| id                  | UUID    | PK                        | Identificador del taller.                 |
| diagnostic_report_id| UUID    | FK -> `diagnostic_reports`| Informe FO-17 en el que se apoya.         |
| date                | DATE    | NOT NULL                  | Fecha del taller.                         |
| attendees_json      | JSONB   | NOT NULL                  | Lista de participantes.                   |
| selected_scenario   | ENUM    | `CONSERVATIVE`, `PROGRESSIVE`, `FOCUSED`, `OPTIMAL` | Decisión final. |
| justification       | TEXT    | NOT NULL                  | Motivo de la elección.                    |
| status              | ENUM    | `DRAFT`, `SIGNED`         | Estado legal/contractual.                 |

### Tabla hija: `scenario_evaluations`

| Campo             | Tipo  | Restricción                  | Descripción                         |
|-------------------|-------|------------------------------|-------------------------------------|
| id                | UUID  | PK                           | Identificador de la evaluación.     |
| workshop_id       | UUID  | FK -> `intervention_workshops` | Taller al que pertenece.        |
| scenario_type     | ENUM  | `CONSERVATIVE`, `PROGRESSIVE`, `FOCUSED`, `OPTIMAL` | Escenario evaluado. |
| investment_level  | ENUM  | `LOW`, `MEDIUM`, `HIGH`      | Nivel de inversión estimado.       |
| operational_impact| ENUM  | `LOW`, `MEDIUM`, `HIGH`      | Impacto operativo previsto.        |
| risk_reduction    | ENUM  | `LOW`, `MEDIUM`, `HIGH`      | Reducción de riesgos.              |
| social_acceptance | ENUM  | `LOW`, `MEDIUM`, `HIGH`      | Aceptación social/política.        |

## 5. Lógica de Negocio Crítica

- **Proyección de presupuesto:** si se elige `OPTIMAL`, mostrar alerta solicitando aprobación directiva adicional y activar flujo especial.
- **Vinculación con plan de proyecto:** al guardar escenario ganador, habilitar fase piloto en el manifiesto y módulos operativos vinculados.
- **Registro de votación:** conservar bitácora de votos individuales para auditoría; si menos del 70 % del quórum vota, marcar el taller como pendiente de ratificación.
