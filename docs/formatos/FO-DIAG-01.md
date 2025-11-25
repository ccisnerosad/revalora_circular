# Canvas Funcional #01: Registro de Tipo de Residuo por Zona

## Identidad del Formato

- **Código:** FO-DIAG-01
- **Nombre:** Registro de Tipo de Residuo por Zona
- **Naturaleza:** Formulario de Campo / Checklist Detallado
- **Estado:** Fase 0 - Planeación y Control

## 1. Propósito y Contexto

Este formato tiene como objetivo documentar la caracterización física de los residuos encontrados en una zona específica durante un recorrido. Permite identificar qué tipo de residuos se generan, su estado de descomposición y su nivel de contaminación, así como evaluar preliminarmente su potencial de aprovechamiento.

## 2. Estructura de Datos

El formato se divide en las siguientes secciones lógicas:

### A. Datos Generales
Metadatos del levantamiento para trazabilidad.
- Fecha y Hora
- Zona / Pasillo / Área específica
- Responsable (Evaluador / Brigada)
- Condiciones climáticas

### B. Identificación del Residuo (Tabla Principal)
Registro fila por fila de los hallazgos.
- **Tipo de residuo:** Descripción libre (ej. "Cajas de tomate").
- **Clasificación:** Fruta, Verdura, Mixto, Otro.
- **Estado Físico:** Fresco, Descompuesto, Mixto.
- **Nivel de Contaminación:** Bajo, Medio, Alto.
- **Observaciones:** Notas cualitativas.

### C. Potencial de Aprovechamiento (Criterio Técnico)
Evaluación experta sobre el destino posible del residuo.
- **Potencial Alimento Humano:** Alto/Medio/Bajo/Nulo.
- **Potencial Alimento Animal:** Alto/Medio/Bajo/Nulo.
- **Potencial Biofertilizante:** Alto/Medio/Bajo/Nulo.
- **Potencial Composta:** Alto/Medio/Bajo/Nulo.

### D. Condiciones en Sitio
Checklist de condiciones ambientales y operativas asociadas al residuo.
- Presencia de lixiviados (Sí/No)
- Olor ofensivo (Alto/Medio/Bajo)
- Presencia de fauna (Sí/No)
- Mezcla con inorgánicos (Sí/No)
- Obstaculización del paso (Sí/No)

### E. Evidencia Documental
Confirmación de respaldo multimedia.
- Fotografías, Video, Croquis.

## 3. Estructura Visual (UI)

### A. Encabezado
- Título claro y estado del registro.

### B. Formulario de Captura
- **Móvil:** Tarjetas individuales para cada residuo identificado, con selectores grandes para clasificación y estado.
- **Escritorio:** Tabla editable (grid) para captura rápida de múltiples ítems.

### C. Secciones de Evaluación
- Bloques colapsables o tarjetas separadas para "Potencial" y "Condiciones", vinculadas al residuo o a la zona en general según la lógica de negocio (en este caso, parece ser por zona/evento).

## 4. Reglas de Negocio
- No se puede cerrar el registro sin al menos un ítem de residuo identificado.
- Si "Nivel de Contaminación" es Alto, se debe forzar un comentario en Observaciones.
- Si "Olor ofensivo" es Alto, se sugiere vincular con FO-DIAG-14.

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
