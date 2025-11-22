# 📜 Manifiesto del Proyecto: Revalora Circular

## Fase 0: Núcleo de Gestión y Acceso

### 1. Identidad y Propósito Estratégico

- **Nombre del Proyecto:** Plataforma Revalora Circular.
- **Objetivo de la Fase:** Establecer el "Sistema Nervioso Central" del proyecto. Antes de procesar una sola tonelada de residuos, debemos asegurar quién tiene las llaves de la planta y cómo se protegen los datos.
- **Tipo de Sistema:** Plataforma Modular Escalable. Una estructura robusta diseñada para crecer por secciones (módulos) sin detener su operación.
- **Estado Actual:** Cimientos e Infraestructura. Estamos construyendo los cimientos de seguridad e infraestructura.
- **Principios Operativos:** "Cero Ambigüedad, Máxima Trazabilidad". El sistema no es solo una herramienta de registro, es el garante de la transparencia normativa del proyecto. Se impone el uso de **Tipado Estricto (TypeScript)** en todo el sistema.

### 2. Estrategia de Construcción (Arquitectura de Alto Nivel)

Para cumplir con la operación obligatoria desde el Día 1 y el escalamiento industrial, la plataforma se rige por tres leyes:

#### A. Modularidad Estanca (Seguridad Operativa)

El sistema se construye como compartimentos estancos. La interfaz visual (Frontend), la lógica de negocio (Backend) y la bóveda de datos (Base de Datos) viven en espacios separados.

> **Beneficio:** Si un módulo falla o requiere mantenimiento, no compromete la integridad de los datos ni detiene toda la plataforma.

#### B. Autenticación Delegada (Fiabilidad y Costo Controlado)

No reinventaremos la rueda en seguridad. La gestión de identidades (quién entra y quién sale) se delega a un Proveedor de Alta Disponibilidad (Firebase Auth).

> **Objetivo:** Garantizar un SLA (Tiempo de actividad) del 99.9% en el acceso, reduciendo costos de mantenimiento de servidores propios y blindando el sistema contra ataques de fuerza bruta.

#### C. Interfaz Híbrida (Eficiencia)

La plataforma debe ser rápida para la lectura de datos (Dashboards) pero robusta para la gestión de transacciones. Usaremos tecnología que priorice la carga instantánea para los operadores en campo.

### 3. Alcance Funcional Inmediato: "Gobernanza ISO 27001"

Antes de activar los módulos de residuos, validaremos la operación con el Módulo de Identidad y Gobierno:

#### Perfiles de Usuario (Roles)

- **Super Admin:** Administrador Principal. Visibilidad total. Único capaz de gestionar módulos técnicos.
- **Supervisor Revalora:** Gestor Operativo. Validan la calidad de los datos y operan el día a día.
- **Operador:** Personal de Campo. Acceso simplificado y de alto contraste para registro rápido.
- **Auditor:** Observadores externos. Acceso de "Solo Lectura" para garantizar transparencia.

#### Capacidades del Sistema

- **Ingreso Seguro:** Protocolos estándares de la industria.
- **Gestión RBAC Dinámica:** Los permisos no están escritos en piedra (código), sino en la base de datos, permitiendo ajustes sin re-desplegar.
- **Trazabilidad de Usuario:** Cada acción lleva firma digital. Se audita el último acceso y la aceptación de términos.

### 4. Hoja de Ruta de la Fase 0

1. **Infraestructura:** Preparar el entorno Docker modular (`revalora-network`).
2. **Seguridad:** Conectar y configurar Firebase Auth.
3. **Génesis:** Ejecución de scripts de "Sembrado" para crear roles base y el primer Super Admin.
4. **Despliegue:** Lanzamiento del portal de acceso y validación de la matriz de permisos.

---
**Firmado:**
*Equipo de Desarrollo*
