# Canvas Funcional #01: Caracterización de Residuos

## Identidad del Formato

- **Código:** FO-DIAG-01
- **Nombre:** Registro de Tipo de Residuo por Zona
- **Naturaleza:** Formato hijo de `FO-DIAG-00`
- **Estado:** Fase 0 - Gobernanza

## 1. Propósito y Contexto

Este módulo es el ojo clínico del sistema. Su función es cualitativa: no mide peso (lo hace `FO-DIAG-02`), sino que describe. Transforma “basura” en datos accionables (ej. “Esto no es basura, es tomate fresco rescatable”) y alimenta el algoritmo de potencial de aprovechamiento.

## 2. Actores (ISO 27001 RBAC)

- **Primary User (Escritura):** Brigadista / Clasificador
  - Permiso requerido: `waste_char.create`
- **Supervisor (Validación):** Supervisor Revalora
  - Permiso requerido: `waste_char.approve` (cierra el registro cuando detecta anomalías)

## 3. Estructura Visual (UI - App Móvil)

### A. Encabezado (heredado, solo lectura)

- **Contexto:** `Recorrido #SRV-101 / Nave C / Lluvioso`
- **Hora:** Timestamp automático del dispositivo

### B. Cuerpo: Lista de Hallazgos (dinámico)

- Se representa como tarjetas de residuo.
- **Tarjeta de residuo #1** (botón “+ Agregar otro residuo”):
  - **Nombre/Tipo:** Input con autocompletado (`Jitomate`, `Cebolla`, `Cartón`)
  - **Clasificación:** Chips (`🍎 Fruta`, `🥦 Verdura`, `🥡 Mixto`, `🧱 Otro`)
  - **Estado físico:** Select (`Fresco`, `Descompuesto`, `Mixto`)
  - **Contaminación:** Slider (`Bajo — Medio — Alto`)
  - **Potencial (matriz visual):**
    - Humano: `[⭐️ ⭐️ ⭐️ ⭐️]` (0 a 4)
    - Animal: `[⭐️ ⭐️ ⭐️ ⭐️]`
    - Biofertilizante: `[⭐️ ⭐️ ⭐️ ⭐️]`
    - Composta: `[⭐️ ⭐️ ⭐️ ⭐️]`

### C. Condiciones del sitio (generales de la zona)

- **Factores ambientales (switches):**
  - [ ] ¿Lixiviados presentes?
  - [ ] ¿Fauna nociva visible?
  - [ ] ¿Mezcla con inorgánicos?
  - [ ] ¿Obstruye el paso?
- **Nivel de olor:** Iconos (`👃 Suave`, `🤢 Medio`, `☠️ Ofensivo`)

### D. Evidencia

- **Cámara:** Botón para tomar foto (obligatorio si la contaminación > media)
- **Observaciones:** Área de texto con dictado por voz

## 4. Estructura de Base de Datos (schema proposal)

Para normalizar la relación uno-a-muchos, se proponen dos tablas: una caracterización padre y múltiples detalles de residuo.

### Tabla padre: `waste_characterizations`

Representa el evento de evaluación para un punto específico.

| Campo              | Tipo         | Restricción                | Descripción                                       |
|--------------------|--------------|----------------------------|---------------------------------------------------|
| id                 | UUID         | PK                         | ID único de la caracterización.                   |
| survey_id          | UUID         | FK → `surveys`             | Vínculo con el recorrido maestro (`FO-DIAG-00`).  |
| has_leachates      | BOOLEAN      | DEFAULT FALSE              | Presencia de lixiviados.                          |
| odor_level         | ENUM         | `LOW`, `MEDIUM`, `HIGH`    | Nivel de olor.                                    |
| has_pests          | BOOLEAN      | DEFAULT FALSE              | Señala fauna nociva.                              |
| is_mixed_inorganic | BOOLEAN      | DEFAULT FALSE              | Mezcla con inorgánicos.                           |
| is_blocking_path   | BOOLEAN      | DEFAULT FALSE              | Indica obstrucción de paso.                       |
| media_urls         | ARRAY(TEXT)  | NULLABLE                   | Rutas a fotos o videos en almacenamiento en nube. |
| notes              | TEXT         | NULLABLE                   | Observaciones generales.                          |

### Tabla hija: `waste_details`

Cada fila del formato físico se traduce a un registro detallado.

| Campo               | Tipo    | Restricción                         | Descripción                                  |
|---------------------|---------|-------------------------------------|----------------------------------------------|
| id                  | UUID    | PK                                  | ID del detalle.                              |
| characterization_id | UUID    | FK → `waste_characterizations`      | Referencia al registro padre.                |
| waste_name          | VARCHAR | NOT NULL                            | Ejemplo: “Jitomate bola”.                     |
| category            | ENUM    | `FRUIT`, `VEG`, `MIXED`, `OTHER`    | Clasificación.                               |
| physical_state      | ENUM    | `FRESH`, `DECOMPOSED`, `MIXED`      | Estado físico.                               |
| contamination_level | ENUM    | `LOW`, `MEDIUM`, `HIGH`             | Nivel de contaminación.                      |
| potential_human     | INT     | 0-3                                 | Escala Likert para consumo humano.           |
| potential_animal    | INT     | 0-3                                 | Escala Likert para consumo animal.           |
| potential_biofert   | INT     | 0-3                                 | Escala Likert para biofertilizante.          |
| potential_compost   | INT     | 0-3                                 | Escala Likert para composta.                 |

## 5. Lógica de Negocio Crítica

- **Validación de potencial:** Si se selecciona estado `Descompuesto`, el sistema bloquea el potencial humano y lo fuerza a `0` (nulo) para evitar errores críticos.
- **Trigger de riesgo:** Si `has_leachates = TRUE` o `has_pests = TRUE`, se dispara una bandera roja en el dashboard del supervisor.
- **Autocompletado inteligente:** El campo `waste_name` aprende de los ingresos más comunes de la semana anterior para sugerir opciones rápidas.
