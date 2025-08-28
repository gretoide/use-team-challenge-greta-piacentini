# 🚀 My G.Kanban - Tablero Colaborativo en Tiempo Real

Un tablero Kanban colaborativo inspirado en Trello, desarrollado con tecnologías modernas y comunicación en tiempo real.

## ✨ Características

- **🎯 Gestión de tareas** con tarjetas personalizables
- **🔄 Drag & Drop** para mover tarjetas entre columnas
- **⚡ Tiempo real** con WebSocket para colaboración instantánea
- **👥 Múltiples usuarios** con sincronización en vivo
- **🔔 Notificaciones** toast para todas las acciones
- **📱 Interfaz responsiva** y moderna
- **🎨 Diseño intuitivo** con Bootstrap

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 14** con TypeScript
- **Bootstrap 5** para estilos y componentes
- **@dnd-kit** para drag & drop
- **Socket.io Client** para comunicación en tiempo real
- **Zustand** para gestión de estado global
- **Sonner** para notificaciones toast

### Backend
- **NestJS** con TypeScript
- **WebSocket** con Socket.io
- **MongoDB** como base de datos
- **Prisma ORM** para gestión de datos
- **Inyección de dependencias** nativa de NestJS

## 📋 Prerrequisitos

- **Node.js** 18+ 
- **npm** o **yarn**
- **MongoDB** 5.0+ (local o Atlas)
- **Git**

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd use-team-challenge-greta-piacentini
```

### 2. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env
```

**Configurar variables de entorno (.env):**
```env
DATABASE_URL="mongodb://localhost:27017/my-kanban-db"
PORT=3000
```

### 3. Configurar la Base de Datos

**Opción A: MongoDB Local**
```bash
# Iniciar MongoDB (Windows)
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"

# O si tienes MongoDB como servicio
net start MongoDB
```
### 4. Ejecutar el Seed de la Base de Datos

```bash
cd backend
node prisma/seed-mongo.js
```

**Resultado esperado:**
```
✅ Seed mejorado creado con éxito!
👥 Usuarios creados: Ana García, Carlos López, María Rodríguez
📋 Columnas creadas: 📋 Por Hacer, 🔄 En Progreso, 👀 En Revisión, ✅ Completado
🎯 Tarjetas creadas: 10

🚀 ¡Tu tablero Kanban está listo para usar!
```

### 5. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install
```

### 6. Ejecutar la Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🎮 Cómo Usar la Aplicación

### 1. **Seleccionar Usuario**
- En la esquina superior derecha, selecciona un usuario del dropdown
- Cada usuario puede ver y editar solo sus propias tarjetas

### 2. **Crear Tarjetas**
- Haz clic en el botón "+" al final de cualquier columna
- Completa el título y contenido
- Selecciona un usuario antes de crear

### 3. **Mover Tarjetas**
- **Arrastra** haciendo click sostenido sobre cada tarjeta
- **Suelta** en la columna deseada
- Los cambios se sincronizan en tiempo real

### 4. **Editar Tarjetas**
- Haz clic en cualquier tarjeta para abrir el sidebar
- Haz clic en el botón de editar (lápiz)
- Modifica título y contenido
- Guarda los cambios

### 5. **Eliminar Tarjetas**
- Abre el sidebar de la tarjeta
- Haz clic en el botón de eliminar (basura)
- Confirma la eliminación

## 🔧 Estructura del Proyecto

```
use-team-challenge-greta-piacentini/
├── backend/                 # Servidor NestJS
│   ├── src/
│   │   ├── cards/          # Módulo de tarjetas
│   │   ├── columns/        # Módulo de columnas
│   │   ├── users/          # Módulo de usuarios
│   │   ├── prisma/         # Configuración de Prisma
│   │   └── main.ts         # Punto de entrada
│   ├── prisma/
│   │   ├── schema.prisma   # Esquema de base de datos
│   │   └── seed-mongo.js   # Datos de prueba
│   └── package.json
├── frontend/                # Aplicación Next.js
│   ├── src/
│   │   ├── app/            # Páginas y layout
│   │   ├── components/     # Componentes React
│   │   ├── store/          # Estado global (Zustand)
│   │   └── hooks/          # Hooks personalizados
│   └── package.json
└── README.md
```

## 👨‍💻 Autor

**Greta Piacentini** 


