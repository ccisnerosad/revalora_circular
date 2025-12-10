# Plan de Escalabilidad Técnica: Revalora Circular

Este documento detalla la estrategia para migrar el prototipo actual (basado en archivos JSON estáticos) a una arquitectura robusta y escalable utilizando una base de datos relacional y una API RESTful.

## 1. Arquitectura Propuesta

La arquitectura evolucionará de un sitio estático (SSG) a una aplicación web dinámica (SSR/Hybrid) desplegada en Netlify.

*   **Frontend:** Astro (SSR) desplegado en **Netlify**. Se aprovechará el adaptador de Netlify ya configurado para el manejo de peticiones dinámicas.
*   **Backend / API:** **Express.js**. Se desplegará como un servicio web independiente en una plataforma de bajo costo como **Render** o **Railway** (Free Tier disponible), o alternativamente como funciones serverless en Netlify si se adapta. La elección principal es Express estándar para evitar vendor lock-in.
*   **Base de Datos:** **PostgreSQL** gestionado por **Supabase**. Ofrece una capa gratuita generosa, gestión de usuarios (Auth) y excelente soporte para JSONB.

## 2. Diseño de Base de Datos (PostgreSQL)

El esquema relacional se basará en la estructura JSON prototipada en `data/core`, `data/admin` y `data/formatos`.

### Tablas Principales

#### `zonas`
*   `id` (UUID, PK)
*   `nombre` (VARCHAR)
*   `descripcion` (TEXT)
*   `responsable_id` (UUID, FK -> usuarios)
*   `created_at` (TIMESTAMP)

#### `puntos_acopio`
*   `id` (UUID, PK)
*   `zona_id` (UUID, FK -> zonas)
*   `nombre` (VARCHAR)
*   `tipo` (VARCHAR)
*   `capacidad` (VARCHAR)
*   `created_at` (TIMESTAMP)

#### `formatos_definicion`
*   `id` (VARCHAR, PK) - Ej: 'FO-DIAG-01'
*   `nombre` (VARCHAR)
*   `estructura` (JSONB) - Define los campos y validaciones del formulario.
*   `version` (INT)

#### `registros_formatos`
*   `id` (UUID, PK)
*   `formato_id` (VARCHAR, FK -> formatos_definicion)
*   `punto_id` (UUID, FK -> puntos_acopio)
*   `usuario_id` (UUID, FK -> usuarios)
*   `fecha_registro` (TIMESTAMP)
*   `datos` (JSONB) - Almacena las respuestas del formulario.

#### `historial_puntos`
*   `id` (UUID, PK)
*   `punto_id` (UUID, FK -> puntos_acopio)
*   `fecha` (TIMESTAMP)
*   `condicion` (VARCHAR)
*   `notas` (TEXT)
*   `evaluador_id` (UUID, FK -> usuarios)

## 3. Estrategia de API

Se desarrollará una API REST con **Express.js** para exponer los datos a Astro y gestionar la lógica de negocio.

### Endpoints Clave

#### Zonas
*   `GET /api/zonas`: Listar todas las zonas.
*   `POST /api/zonas`: Crear una nueva zona.
*   `PUT /api/zonas/:id`: Actualizar información de una zona.
*   `DELETE /api/zonas/:id`: Eliminar una zona (soft delete preferible).
*   `GET /api/zonas/:id/puntos`: Listar puntos de acopio de una zona específica.

#### Puntos de Acopio
*   `GET /api/puntos`: Listar todos los puntos.
*   `POST /api/puntos`: Registrar un nuevo punto de acopio.
*   `PUT /api/puntos/:id`: Actualizar datos de un punto.
*   `DELETE /api/puntos/:id`: Dar de baja un punto.
*   `GET /api/puntos/:id/historial`: Obtener historial de evaluaciones de un punto.

#### Registros y Formatos
*   `POST /api/registros`: Guardar un nuevo registro de formato (llenado de formulario).
*   `GET /api/formatos/:id/registros`: Obtener registros consolidados para reportes.

## 4. Integración con Astro

### Librería de Cliente API (Fetch Wrapper)

Para estandarizar las peticiones y manejar errores, se creará una librería interna (ej: `src/utils/apiClient.ts`).

*   **Configuración Centralizada:** Base URL definida por variables de entorno (`API_URL`).
*   **Interceptors:** Inyección automática de headers (Content-Type, Authorization).
*   **Manejo de Errores:** Estandarización de respuestas de error para el frontend.

```typescript
// Ejemplo de uso propuesto
import { apiClient } from '../utils/apiClient';

const zonas = await apiClient.get('/zonas');
```

### Fetching de Datos

Astro consumirá la API utilizando este cliente, principalmente en el modo SSR.

### Manejo de Estado
Para formularios interactivos y actualizaciones en tiempo real (ej: dashboard de monitoreo), se utilizarán "Islands Architecture" con componentes de React, Vue o Svelte hidratados en el cliente.

## 5. Fases de Migración

1.  **Fase 1 (Actual):** Prototipado con JSON estáticos en `data/`.
2.  **Fase 2 (Infraestructura):**
    *   Configurar proyecto en **Supabase** (PostgreSQL).
    *   Inicializar repositorio para Backend **Express**.
    *   Crear script de migración: JSON -> PostgreSQL.
3.  **Fase 3 (Desarrollo API):**
    *   Implementar endpoints de lectura (GET) en Express.
    *   Desplegar Backend en **Render/Railway**.
4.  **Fase 4 (Conexión Frontend):**
    *   Implementar `apiClient` en Astro.
    *   Reemplazar importaciones de JSON por llamadas a la API.
5.  **Fase 5 (Funcionalidad Completa):**
    *   Implementar endpoints de escritura (POST/PUT/DELETE).
    *   Conectar formularios del frontend a la API.
