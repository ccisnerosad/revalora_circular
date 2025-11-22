# Planeación Técnica: Revalora Circular

- **Fase del Proyecto:** 3. Planeación Técnica
- **Arquitectura:** Modular Escalable
- **Estandar:** ISO 27001 Compliance

## 1. Diagrama Técnico de Arquitectura

La arquitectura sigue un patrón de Microservicios Contenerizados orquestados mediante Docker Compose, con autenticación delegada.

```mermaid
graph TD
    subgraph "Nube (Proveedor Externo)"
        Auth[Firebase Auth (Identity Platform)]
    end

    subgraph "Host Docker (revalora-network)"
        direction TB
        
        subgraph "Capa Presentación (Puerto 4321)"
            Frontend[REVALORA-WEB: Astro + React]
        end
        
        subgraph "Capa Lógica (Puerto 4000)"
            Backend[REVALORA-API: Node + Express]
        end
        
        subgraph "Capa Persistencia (Puerto 5432)"
            DB[REVALORA-DB: PostgreSQL]
        end
    end

    User((Usuario)) -->|1. Credenciales| Auth
    Auth -->|2. Token JWT| User
    User -->|3. HTTPS + Bearer Token| Frontend
    Frontend -->|4. Request + Token| Backend
    Backend -.->|5. Valida Token| Auth
    Backend -->|6. Verifica Permisos (RBAC)| DB
    Backend -->|7. Query Datos| DB
```

## 2. Selección y Justificación del Stack Tecnológico

| Componente | Tecnología Seleccionada | Justificación Técnica (Criterios: Fiabilidad, Costo, Integridad) |
| :--- | :--- | :--- |
| **Lenguaje Base** | **TypeScript** | **Seguridad:** Tipado estático para reducir errores en tiempo de ejecución y mejorar la mantenibilidad ("Cero Ambigüedad"). |
| **Auth** | Firebase Authentication | **Alta Disponibilidad:** SLA de Google. **Costo:** Gratuito e ilimitado. Delegación de seguridad de credenciales. |
| **Frontend** | Astro (SSR) + React + Tailwind | **Rendimiento:** HTML estático para estructura, React para interactividad compleja. Tailwind para desarrollo UI veloz. |
| **Backend** | Node.js + Express + **Prisma ORM** | **Robustez y Velocidad:** Express por flexibilidad, Prisma para manejo seguro de datos (Type-safe DB access) y migraciones automáticas. |
| **Validación** | **Zod** | **Integridad:** Validación de esquemas en tiempo de ejecución para entradas de API y formularios, sincronizado con tipos de TS. |
| **Base de Datos** | PostgreSQL 15 | **Integridad:** Soporte relacional estricto para la integridad referencial entre Usuarios, Roles y Permisos. |
| **Infraestructura** | Docker Compose (Servicios) | **Mantenibilidad:** Carpetas independientes (`/backend`, `/frontend`) orquestadas con Docker. Sin complejidad de monorepo. |
| **Sincronización** | **OpenAPI + Generación** | **Integridad:** El Backend expone su contrato (Swagger) y el Frontend genera automáticamente los tipos TypeScript. |

## 3. Estructura de Base de Datos (Esquema ISO 27001 RBAC)

Se añaden campos de auditoría de acceso y cumplimiento legal.

### Tabla Modules (Catálogo de recursos)

- `id` (PK)
- `name` (ej. "Recolección")
- `code` (ej. "collection")
- `url` (ej. "/admin/users")
- `is_active` (Boolean)

### Tabla Permissions (Acciones atómicas)

- `id` (PK)
- `module_id` (FK -> Modules)
- `code` (ej. "collection.create")
- `description`

### Tabla Roles (Perfiles de acceso)

- `id` (PK)
- `name` (ej. "Supervisor de Planta")
- `is_system` (Boolean): Roles inmutables (SuperAdmin)

### Tabla RolePermissions (Tabla pivote)

- `role_id` (FK)
- `permission_id` (FK)

### Tabla Users

- `id` (UUID, PK)
- `auth_provider_id` (Firebase UID, Unique)
- `email`, `full_name`
- `role_id` (FK -> Roles)
- `is_active` (Boolean): Kill switch
- `last_login_at` (Timestamp): **Nuevo** (Auditoría de inactividad)
- `terms_accepted_at` (Timestamp): **Nuevo** (Cumplimiento legal/normativo)

### Tabla AuditLogs (Evidencia Forense)

- `id`
- `user_id` (Actor)
- `resource` (Entidad afectada)
- `action`
- `ip_address`
- `timestamp`

## 4. Estrategia de "Génesis" (Sembrado de Datos)

Para resolver el problema del "Huevo y la Gallina" (necesito un admin para crear usuarios, pero no hay admin), se implementará un script de Seeding:

1. **Paso 1:** El script `seed.ts` verifica si existe el rol `SUPER_ADMIN`.
2. **Paso 2:** Crea los módulos base (`AUTH`, `USERS`, `ROLES`) y sus permisos.
3. **Paso 3:** Asigna todos los permisos al rol `SUPER_ADMIN`.
4. **Paso 4:** Busca en variables de entorno `INITIAL_ADMIN_EMAIL`. Si ese usuario existe en Firebase pero no en DB, lo crea en DB y le asigna el rol `SUPER_ADMIN`.

## 5. Endpoints y Dependencias

### Estandarización de Respuestas (API Contract)

Todas las respuestas seguirán este formato para facilitar la integración con Frontend:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

O en caso de fallo:

```json
{
  "success": false,
  "data": null,
  "error": { "code": "AUTH_001", "message": "Token inválido" }
}
```

### Endpoints de Gobernanza (API V1)

#### Gestión de Roles y Permisos

- `GET /api/modules`: Listar módulos.
- `GET /api/roles`: Listar roles.
- `POST /api/roles`: Crear rol.
- `PUT /api/roles/:id/permissions`: Configurar matriz de acceso.

#### Gestión de Usuarios

- `GET /api/users`: Listar personal.
- `POST /api/users/sync`: Endpoint llamado tras el login en Frontend para asegurar que el usuario existe en DB y actualizar `last_login_at`.
- `PATCH /api/users/:id/role`: Cambiar rol (Requiere permiso `users.promote`)
