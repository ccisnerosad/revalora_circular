# Canvas Funcional #00: Matriz de Levantamiento en Campo

## Identidad del Formato

- **Código:** FO-DIAG-00
- **Nombre:** Matriz de Levantamiento en Campo
- **Naturaleza:** Matriz Metodológica / Plan Maestro
- **Estado:** Fase 0 - Planeación y Control

## 1. Propósito y Contexto

Este formato establece el **Plan Maestro de Diagnóstico**. No es solo un registro, es la hoja de ruta que dicta *qué*, *cómo*, *cuándo* y *quién* debe medir cada aspecto del sistema de residuos. Garantiza la coherencia entre la caracterización, operación, infraestructura y actores.

**Nota Metodológica:** Esta matriz responde a un enfoque integrado. La información se recopila de manera simultánea durante los recorridos. Cada recorrido activa varios registros de forma paralela.

## 2. Estructura de Datos (Columnas de la Matriz)

La matriz se compone de las siguientes columnas de control:

1.  **Nº Ref:** Identificador de la línea estratégica (ej. 6.1, 6.2).
2.  **Línea de Análisis:** Categoría macro del estudio (ej. Caracterización, Dinámica Operativa).
3.  **Aspecto a Evaluar:** El objeto específico de estudio.
4.  **Variable / Indicador:** Qué se mide exactamente (ej. Toneladas/día, Horas pico).
5.  **Método de Levantamiento:** Técnica a utilizar (ej. Pesaje, Observación, Entrevista).
6.  **Frecuencia / Momento:** Cuándo debe ejecutarse (ej. 3 recorridos por día).
7.  **Responsable:** Quién ejecuta la acción.
8.  **Evidencia / Registro:** El formato hijo donde se vacían los datos (FO-DIAG-01 a 18).

## 3. Estructura Visual (UI)

### A. Encabezado
- Título: "FO-DIAG-00 MATRIZ DE LEVANTAMIENTO EN CAMPO"
- Nota Metodológica visible.

### B. Cuerpo (Tabla Maestra)
- Visualización tabular en escritorio.
- Visualización de tarjetas agrupadas por "Línea de Análisis" en móviles.
- Indicadores visuales para el estado de cada línea (Pendiente / En Progreso / Completado - *Simulado para prototipo*).

### C. Interacción
- Cada fila que apunta a un formato (ej. FO-DIAG-01) debe ser un enlace navegable hacia dicho formato digital.

## 4. Datos de la Matriz (Fuente)

Los datos provienen de la definición metodológica (script python):

- **6.1 Caracterización:** FO-01, FO-02, FO-03
- **6.2 Dinámica Operativa:** FO-04, FO-05, FO-06
- **6.3 Actores y Relaciones:** FO-07, FO-08, FO-09
- **6.4 Infraestructura:** FO-10, FO-11, FO-12
- **6.5 Condiciones Sanitarias:** FO-13, FO-14, FO-15, FO-16
- **7 y 8 Resultados:** FO-17, FO-18
