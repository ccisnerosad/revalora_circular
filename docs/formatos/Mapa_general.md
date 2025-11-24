# Canvas #20: Arquitectura Maestra de Operación "Revalora Circular"

## Identidad del Formato

- **Versión:** 2.0 (Deep Dive)
- **Propósito:** Definir topología de datos, flujo operativo e inteligencia del sistema completo.

## Vista 1. Topología de Datos (ERD)

Diagrama que muestra cómo se estructura la base de datos para preservar integridad referencial y trazabilidad ISO 27001. El survey es el centro de gravedad.

```mermaid
erDiagram
    %% Núcleo de Gobernanza
    SURVEY ||--|{ USER : "conducted_by"
    SURVEY ||--|| ZONE : "audit_target"
    SURVEY {
        uuid id PK
        string folio "SRV-2024-001"
        timestamp start_at
        timestamp end_at
        enum status "DRAFT, SYNCED, CLOSED"
        json geo_polygon "Area Auditada"
    }

    %% Clúster materia (residuo)
    SURVEY ||--|{ WASTE_CHARACTERIZATION : "FO-01"
    SURVEY ||--|{ WASTE_VOLUME : "FO-02"
    SURVEY ||--|{ WASTE_VALORIZATION : "FO-03"

    WASTE_CHARACTERIZATION {
        string waste_type
        enum state "FRESH, ROTTEN"
    }
    WASTE_CHARACTERIZATION ||--|| WASTE_VALORIZATION : "determines_potential"

    %% Clúster espacio-tiempo (logística)
    SURVEY ||--|{ GENERATION_PEAK : "FO-04"
    SURVEY ||--|{ RETENTION_LOG : "FO-05"
    SURVEY ||--|{ ROUTE_PATH : "FO-06"

    %% Clúster infraestructura (activos)
    SURVEY ||--|{ ASSET_AUDIT : "FO-10 (Fijo) & FO-12 (Móvil)"
    SURVEY ||--|{ ACCUMULATION_POINT : "FO-11"

    ASSET_AUDIT }|--|| MASTER_ASSET_DB : "updates_status"
    ACCUMULATION_POINT ||--o{ ASSET_AUDIT : "contains_assets"

    %% Clúster patología (riesgos)
    SURVEY ||--|{ RISK_INCIDENT : "FO-13, 14, 15, 16"
    RISK_INCIDENT {
        enum type "LEACHATE, ODOR, PEST, SAFETY"
        enum criticality "LOW, MED, HIGH"
        boolean action_required
    }

    %% Clúster social (política)
    SURVEY ||--|{ STAKEHOLDER_INTERVIEW : "FO-07 & FO-08"
    STAKEHOLDER_INTERVIEW ||--|| SOCIAL_MATRIX : "feeds_into_FO-09"

    %% Clúster estrategia (salida)
    SURVEY ||--|| DIAGNOSTIC_REPORT : "consolidates_into_FO-17"
    DIAGNOSTIC_REPORT ||--|| INTERVENTION_SCENARIO : "justifies_FO-18"
```

## Vista 2. Flujo Operativo de la Brigada (Workflow)

Secuencia que sigue la brigada en la app, con validaciones, bifurcaciones y bloqueos lógicos.

```mermaid
stateDiagram-v2
    [*] --> Inicio_Turno

    state "FO-00: Matriz Maestra" as FO00 {
        Inicio_Turno --> Selección_Zona
        Selección_Zona --> Check_Condiciones_Clima
        Check_Condiciones_Clima --> Survey_Abierto
    }

    state Survey_Abierto {
        %% Flujo paralelo
        state "Exploración Física" as F_Fisica
        state "Exploración Social" as F_Social

        F_Fisica --> Detectar_Residuo
        Detectar_Residuo --> FO01_Caracterizar : "¿Qué es?"
        FO01_Caracterizar --> FO02_Cuantificar : "¿Cuánto hay?"
        FO02_Cuantificar --> FO03_Valorizar : "¿Sirve?"

        state fork_riesgos <<fork>>
        FO03_Valorizar --> fork_riesgos
        fork_riesgos --> FO13_Lixiviados : "Líquido"
        fork_riesgos --> FO14_Olores : "Olor"
        fork_riesgos --> FO15_Fauna : "Plaga"
        fork_riesgos --> FO05_Tiempo : "Antigüedad"

        F_Social --> Detectar_Actor
        Detectar_Actor --> Entrevista : "¿Formal/Informal?"
        Entrevista --> FO07_Formal : "Empleado"
        Entrevista --> FO08_Informal : "Pepenador"
        FO07_Formal --> FO09_Matriz : "Mapea poder"
        FO08_Informal --> FO09_Matriz
    }

    Survey_Abierto --> Sincronización : "Finalizar recorrido"

    state Sincronización {
        Validar_Integridad --> Generar_Alertas : "Criticality = HIGH"
        Generar_Alertas --> Calcular_KPIs
        Calcular_KPIs --> FO17_Reporte_Borrador
    }

    FO17_Reporte_Borrador --> Taller_Decision : "Reunión directiva"
    Taller_Decision --> FO18_Seleccion_Escenario : "Firma final"
    FO18_Seleccion_Escenario --> [*]
```

## Vista 3. Motores de Inteligencia

Reglas transversales que cruzan la información de los 19 formatos para generar acciones tácticas y estratégicas.

- **Motor 1 · Calculadora de Viabilidad de Rescate (Food Rescue Engine)**
  - Inputs: FO-01 estado físico, FO-05 tiempo expuesto (<4 h), FO-13 contacto con lixiviados, FO-15 fauna cercana.
  - Lógica escalonada:
    - Si el lote está fresco, con menos de 4 horas expuesto y sin contaminantes ni fauna, destino `Consumo Humano`.
    - Si está magullado pero sin contaminación, redirigir a `Alimento Animal`.
    - En cualquier otro caso, enviar a `Biodigestor/Composta`.

- **Motor 2 · Detector de Zonas de Guerra (Conflict Heatmap)**
  - Inputs: densidad de actores informales (FO-08), resistencia social >70 % (FO-09), bloqueos de seguridad (FO-16).
  - Output: marcar zona como `No-Go` en FO-11 y bloquear órdenes para contenedores (FO-10) hasta resolver la negociación.

- **Motor 3 · Predicción de Colapso Logístico**
  - Inputs: hora pico (FO-04), volumen horario (FO-02) y capacidad de flota por turno (FO-12).
  - Regla: si el volumen supera la capacidad disponible, disparar alerta de déficit y sugerir en FO-17 la renta de unidades adicionales.

## Integración Final: Tablero de Mando

Todos los formatos alimentan un dashboard central con cuatro cuadrantes:

- **Operativo:** cantidad de residuos y logística (FO-01, FO-02, FO-04, FO-05, FO-06, FO-10, FO-12).
- **Sanitario:** riesgos biológicos activos (FO-13, FO-14, FO-15).
- **Social:** control territorial y alianzas (FO-07, FO-08, FO-09).
- **Estratégico:** decisiones ejecutivas y escenarios (FO-17, FO-18).

## Conclusión de Arquitectura

El ecosistema opera como un organismo vivo: los datos se originan en observaciones sensoriales, atraviesan validaciones técnicas y sociales, y culminan en decisiones ejecutivas respaldadas por la inteligencia de negocio.
