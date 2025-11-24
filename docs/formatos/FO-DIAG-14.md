# Canvas Funcional #14: Evaluación de Olores (Olfatometría)

## Identidad del Formato

- **Código:** FO-DIAG-14
- **Nombre:** Evaluación de Olores por Zona
- **Naturaleza:** Monitoreo ambiental / indicador de calidad de aire
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Mapea la huella olfativa de la planta para identificar fermentaciones no controladas y estimar impacto social. Correlaciona con FO-13 (lixiviados) y FO-05 (tiempos de permanencia).

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Monitor):** Brigadista ambiental / supervisor de patio
	- Permiso: `env_odor.record`
- **Supervisor (Mitigación):** Coordinador de calidad de aire
	- Permiso: `env_odor.analyze_impact`

## 3. Estructura Visual (UI - Modo Nariz Electrónica)

### A. Encabezado (heredado)

- **Contexto:** `Recorrido #SRV-101 / Zona de Compactación`
- **Condiciones climáticas:** `🌡️ 24°C / 🌬️ Viento N-E`

### B. Registro puntual (smell log)

- Tres lecturas recomendadas por turno.
- Por lectura: hora, intensidad VDI 3882 (0-6), carácter del olor (chips multiselección: orgánico, agrio, fétido, amina, químico) y persistencia (`Intermitente`, `Continua`).

### C. Evaluación de impacto

- Molestia percibida (slider).
- Checklist de afectaciones: queja de trabajadores, usuarios evitando zona, comercios vecinos afectados.

### D. Diagnóstico técnico

- Fuente probable (`Contenedor sucio`, `Drenaje colapsado`, etc.).
- Recomendación inmediata (`Lavado`, `Encalar`, `Retirar`, `Ventilar`).

### E. Veredicto de criticidad

- Nivel calculado (`🟢 Monitoreo`, `🟡 Programar lavado`, `🔴 Intervención inmediata`).

## 4. Estructura de Base de Datos (schema proposal)

### Tabla padre: `odor_surveys`

| Campo          | Tipo    | Restricción      | Descripción                             |
|----------------|---------|------------------|-----------------------------------------|
| id             | UUID    | PK               | Identificador del monitoreo.            |
| survey_id      | UUID    | FK -> `surveys`  | Recorrido asociado.                     |
| wind_condition | VARCHAR | NULLABLE         | Dirección y velocidad de viento.        |
| temperature_c  | DECIMAL | NULLABLE         | Temperatura ambiente.                   |
| general_impact | ENUM    | `LOW`, `MEDIUM`, `HIGH` | Impacto global del día.         |
| criticality    | ENUM    | `MONITOR`, `ACTION`, `URGENT` | Nivel de acción recomendado. |

### Tabla hija: `odor_readings`

| Campo          | Tipo | Restricción             | Descripción                         |
|----------------|------|-------------------------|-------------------------------------|
| id             | UUID | PK                      | Identificador de la lectura.        |
| survey_log_id  | UUID | FK -> `odor_surveys`    | Monitoreo al que pertenece.         |
| recorded_at    | TIME | NOT NULL                | Hora de registro.                   |
| intensity      | INT  | 0-6 VDI                 | Intensidad percibida.               |
| character      | ENUM | `FRUITY`, `SOUR`, `PUTRID`, `CHEMICAL`, `MIXED` | Tipo de olor. |
| persistence    | ENUM | `INTERMITTENT`, `CONTINUOUS` | Duración.                   |
| annoyance_level| INT  | 1-10                    | Molestia subjetiva.                 |
| source_suspect | VARCHAR | NULLABLE             | Fuente probable.                    |
| media_url      | TEXT | NULLABLE                | Video o evidencia ambiental.        |

## 5. Lógica de Negocio Crítica

- **Semáforo agrio:** si `character = SOUR` e `intensity >= 4`, sugerir correlación con FO-13 y recomendar inspección de lixiviados.
- **Alerta laboral:** si `character = PUTRID` e `intensity >= 5`, enviar alerta crítica indicando uso de mascarilla y rotación de personal.
- **Cruce con FO-05:** cuando se detectan lecturas `CONTINUOUS` por más de 2 horas, notificar al equipo de permanencias para validar tiempos de retención.
