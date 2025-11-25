# Canvas Funcional #08: Actores Informales (Economía Sombra)

## Identidad del Formato

- **Código:** FO-DIAG-08
- **Nombre:** Registro de Actores Informales y Actividades
- **Naturaleza:** Inteligencia etnográfica / análisis socioeconómico
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Permite cuantificar la red informal que opera fuera de los canales oficiales para entender flujos alternos de residuos y evaluar riesgos de gobernanza (territorialidad, conflictos, mercados paralelos).

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Observador):** Trabajador social / brigadista especializado
  - Permiso requerido: `social_intel.create`
- **Supervisor (Estrategia):** Gerente de impacto social
  - Permiso requerido: `social_intel.analyze`

## 3. Estructura Visual (UI - Modo Discreto)

### A. Encabezado (heredado)

- **Contexto:** `Recorrido #SRV-101 / Zona de Carga`
- **Turno:** heredado del `survey`

### B. Perfil del actor (card de observación)

- **Tipo:** chips `🎒 Pepenador`, `🚛 Comprador`, `🤝 Intermediario`, `❓ Otro`
- **Modo de operación:** toggle `Solitario` / `Grupo`
- **Zona de influencia:** campo libre (ej. `Rampa 3 a 5`)
- **Horario habitual:** selector de rango (ej. `04:00 - 08:00`)

### C. Entrevista exploratoria

- Interfaz de notas rápidas.
- Antigüedad (`Reciente`, `Años`, `Histórico`)
- Material de interés: tags (`Cartón`, `Plástico`, `Fruta`, `Madera`)
- Destino conocido: select Sí/No
- Motivación: texto libre

### D. Análisis de impacto

- **Relación con el residuo:** checkboxes (`Recolección`, `Compra-Venta`, `Almacenamiento`)
- **Semáforo de interferencia:** (`Ayuda`, `Neutro`, `Estorba`)
- **Nivel de dependencia económica:** slider `Baja — Alta`

### E. Matriz de riesgo social

- Conflicto potencial (`Territorial`, `Operativo`, `Económico`)
- Nivel de riesgo (`🟢 Bajo`, `🟡 Medio`, `🔴 Alto`)

## 4. Estructura de Base de Datos (schema proposal)

### Tabla padre: `informal_census`

| Campo              | Tipo        | Restricción        | Descripción                                |
|--------------------|-------------|--------------------|--------------------------------------------|
| id                 | UUID        | PK                 | Identificador del registro.                |
| survey_id          | UUID        | FK -> `surveys`    | Vínculo con el recorrido maestro.          |
| actor_type         | ENUM        | `PICKER`, `BUYER`, `BROKER`, `OTHER` | Tipo de actor.     |
| operation_mode     | ENUM        | `SOLO`, `GROUP`    | Modalidad de trabajo.                     |
| target_waste       | ARRAY(TEXT) | NOT NULL           | Materiales de interés.                     |
| years_active       | VARCHAR     | NULLABLE           | Antigüedad estimada.                       |
| economic_dependency| ENUM        | `LOW`, `MEDIUM`, `HIGH` | Dependencia económica.           |
| operational_impact | ENUM        | `POSITIVE`, `NEUTRAL`, `NEGATIVE` | Impacto operativo. |
| conflict_risk      | ENUM        | `LOW`, `MEDIUM`, `HIGH` | Riesgo social.                    |
| notes              | TEXT        | NULLABLE           | Observaciones sensibles.                   |
| media_url          | TEXT        | NULLABLE           | Evidencia visual (si es seguro capturarla).|

## 5. Lógica de Negocio Crítica

- **Detección de redes:** si en la misma zona coinciden actores `BROKER` en modo `GROUP`, generar alerta de posible estructura organizada.
- **Protección de identidad:** no se solicitan nombres reales ni firmas por defecto para salvaguardar al observador y evitar fricciones.
- **Valoración de servicio ambiental:** cuando `operational_impact = POSITIVE`, sugerir oportunidades de formalización o alianzas en el reporte.
