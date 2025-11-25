# Canvas Funcional #17: Informe Diagnóstico (Executive Summary)

## Identidad del Formato

- **Código:** FO-DIAG-17
- **Nombre:** Informe de Diagnóstico Técnico-Operativo
- **Naturaleza:** Business intelligence / reporte ejecutivo
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Consolida los hallazgos de la fase de levantamiento para justificar la intervención piloto y convertir métricas operativas en prioridades, presupuesto y plan de acción.

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Analista):** Coordinador de proyecto / consultor senior
	- Permisos: `reports.generate`, `reports.edit_analysis`
- **Supervisor (Aprobación):** Dirección CEDA / stakeholders
	- Permiso: `reports.approve`

## 3. Estructura Visual (UI - Dashboard de reportes)

### A. Configuración del reporte

- Periodo evaluado (selector de fechas), zonas incluidas y versión del reporte (autoincremental: V1.0, V1.1…).

### B. Síntesis automática

- KPIs traídos desde otros formatos: volumen promedio (FO-02), residuo predominante (FO-01), puntos críticos (FO-13, FO-15, FO-16), eficiencia logística (FO-05, FO-06).

### C. Matriz de priorización

- Tabla editable con zona, score de criticidad calculado, nivel (`🔴 Alta`, etc.) y justificación narrativa.

### D. Mapa de riesgos

- Snapshot del heatmap de incidentes y focos; despliega top 3 riesgos a atender.

### E. Recomendaciones y escenarios

- Plantillas para estrategias, KPIs esperados y checklist de resultados (`Reducción de volumen`, `Eliminación de focos`, etc.).

## 4. Estructura de Base de Datos (schema proposal)

### Tabla padre: `diagnostic_reports`

| Campo               | Tipo      | Restricción         | Descripción                              |
|---------------------|-----------|---------------------|------------------------------------------|
| id                  | UUID      | PK                  | Identificador del informe.               |
| generated_at        | TIMESTAMP | NOT NULL            | Fecha de corte.                          |
| date_range_start    | DATE      | NOT NULL            | Inicio del periodo analizado.            |
| date_range_end      | DATE      | NOT NULL            | Fin del periodo.                         |
| zones_covered       | ARRAYINT  | NOT NULL            | IDs de zonas incluidas.                  |
| total_volume_detected | DECIMAL | NULLABLE            | Volumen consolidado.                     |
| dominant_waste_type | VARCHAR   | NULLABLE            | Residuo predominante.                    |
| criticality_score_avg | DECIMAL | NULLABLE            | Score promedio de criticidad.           |
| executive_summary   | TEXT      | NULLABLE            | Resumen ejecutivo.                       |
| status              | ENUM      | `DRAFT`, `REVIEW`, `APPROVED` | Estado del flujo.          |
| pdf_url             | TEXT      | NULLABLE            | Ruta del PDF generado.                   |

### Tabla hija: `zone_priorities`

| Campo            | Tipo  | Restricción            | Descripción                         |
|------------------|-------|------------------------|-------------------------------------|
| id               | UUID  | PK                     | Identificador del registro.         |
| report_id        | UUID  | FK -> `diagnostic_reports` | Informe al que pertenece.     |
| zone_id          | INT   | FK -> `zones`          | Zona evaluada.                     |
| calculated_score | INT   | 0-100                  | Score generado por el algoritmo.   |
| final_priority   | ENUM  | `LOW`, `MEDIUM`, `HIGH`| Prioridad definida por analista.   |
| justification    | TEXT  | NULLABLE               | Argumento cualitativo.             |

### Tabla hija: `report_findings`

| Campo        | Tipo | Restricción              | Descripción                               |
|--------------|------|--------------------------|-------------------------------------------|
| id           | UUID | PK                       | Identificador del hallazgo.               |
| report_id    | UUID | FK -> `diagnostic_reports` | Informe relacionado.                  |
| category     | ENUM | `OPERATIONAL`, `SANITARY`, `SOCIAL` | Tipo de hallazgo.            |
| finding_text | TEXT | NOT NULL                 | Descripción del hallazgo.                 |
| impact_level | ENUM | `LOW`, `MEDIUM`, `HIGH`   | Impacto asociado.                        |
| recommendation| TEXT | NOT NULL                 | Recomendación vinculada.                 |

## 5. Lógica de Negocio Crítica

- **Score de criticidad:** sumar 10 puntos por cada `safety_incident` alto, 15 por `leachate_incident` en drenaje y 20 cuando `retention_time > 12 h` para producir el ranking de zonas.
- **Bloqueo de edición:** al cambiar `status = APPROVED`, generar PDF inmutable y bloquear edición de datos crudos del periodo para preservar auditoría.
- **Versionado automático:** cada vez que se reabre un reporte aprobado, crear duplicado con versión incrementada y mantener histórico.
