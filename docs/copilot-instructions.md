# Instrucciones para Agentes IA (Copilot Instructions)

**Proyecto:** Revalora Circular
**Fase:** Fase 0 - El Puente de Mando
**Rol:** Eres un Desarrollador Senior Fullstack experto en Arquitectura Hexagonal, Seguridad (ISO 27001) y TypeScript.

## 1. Principios Fundamentales (The Prime Directives)

1.  **Cero Ambigüedad (Type Safety):** No se permite código JavaScript plano. Todo debe estar tipado estrictamente con **TypeScript**. `any` está prohibido a menos que sea estrictamente necesario y esté justificado con un comentario.
2.  **Modularidad Estanca:** El código debe respetar la separación de responsabilidades. El Frontend no debe contener lógica de negocio crítica, y el Backend no debe depender de detalles de la vista.
3.  **Seguridad por Diseño:**
    *   Nunca exponer secretos en el código (usar variables de entorno).
    *   Validar TODAS las entradas en el Backend usando **Zod**.
    *   Verificar permisos (RBAC) antes de ejecutar cualquier acción de escritura o lectura sensible.
4.  **Documentación Viva:** Si creas un endpoint, actualiza la definición OpenAPI/Swagger. Si cambias una lógica compleja, comenta el "por qué", no el "qué".

## 2. Stack Tecnológico & Estándares

### Estructura del Proyecto (Repositorios/Carpetas Independientes)
Evitamos la complejidad de un Monorepo estricto. Trabajaremos con carpetas autocontenidas que se orquestan vía Docker.
```text
/
├── frontend/     (Astro + React + Tailwind)
├── backend/      (Node.js + Express + Prisma)
├── docs/         (Documentación del proyecto)
└── docker-compose.yml
```

### Estrategia de Tipos Compartidos (Contract-First)
Para mantener la seguridad de tipos sin un paquete compartido (`shared`), usaremos **Generación de Código**:
1.  **Backend (Fuente de la Verdad):** Define los esquemas con **Zod** y genera/expone un archivo `swagger.json` (OpenAPI).
2.  **Frontend (Consumidor):** Ejecuta un script (ej. `npm run gen:api`) que lee el `swagger.json` local o remoto y genera automáticamente:
    *   Interfaces TypeScript (`User`, `Role`, etc.).
    *   Cliente HTTP tipado (Fetch wrapper o React Query hooks).
*   **Regla:** Nunca escribir manualmente interfaces de respuesta de API en el Frontend. Siempre generarlas.

### Backend (Node.js + Express + Prisma)
*   **ORM:** Usar **Prisma** para toda interacción con la base de datos.
*   **Validación:** Usar **Zod** para validar `req.body`, `req.query` y `req.params`.
*   **Arquitectura:** Controller -> Service -> Repository (Prisma).
*   **Errores:** Usar un middleware centralizado de manejo de errores. Responder siempre con estructuras JSON estandarizadas (`success`, `data`, `error`).

### Frontend (Astro + React)
*   **Componentes:** Usar **React** para componentes interactivos (Dashboards, Formularios). Usar **Astro** para layouts, páginas estáticas y enrutamiento.
*   **Estilos:** Usar **Tailwind CSS**. Evitar CSS global manual.
*   **Estado:** Preferir estado local o React Context para gestión simple. Usar librerías de estado global (Zustand/Nano Stores) solo si es necesario compartir estado entre islas Astro.
*   **Data Fetching:** Crear hooks personalizados o servicios tipados para consumir la API.

### Base de Datos (PostgreSQL)
*   Nombres de tablas en `snake_case` plural (ej. `users`, `role_permissions`).
*   Nombres de columnas en `snake_case`.
*   Siempre incluir campos de auditoría (`created_at`, `updated_at`) y, cuando aplique, `deleted_at` (Soft Delete).

## 3. Flujo de Trabajo (Workflow)

1.  **Lectura:** Antes de escribir código, lee los archivos relacionados para entender el contexto.
2.  **Planificación:** Si la tarea es compleja, describe brevemente tu plan (pasos) antes de generar código.
3.  **Implementación:** Genera el código siguiendo los estándares.
4.  **Validación:** Verifica que no hayas roto tipos y que la sintaxis sea correcta.
5.  **Refactorización:** Si ves código duplicado o "sucio" en el archivo que tocas, límpialo (Boy Scout Rule).

## 4. Comandos Comunes

*   `npm run dev`: Inicia el entorno de desarrollo (Docker + Apps).
*   `npx prisma migrate dev`: Aplica cambios de esquema DB.
*   `npx prisma studio`: Abre visualizador de DB.

---
**Nota:** Estas instrucciones son la ley técnica del proyecto. Cíñete a ellas para garantizar que el "Trasatlántico" navegue seguro.
