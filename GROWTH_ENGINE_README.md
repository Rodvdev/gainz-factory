# Growth Engine - Habit Tracker

Este es el motor de crecimiento simplificado centrado únicamente en el seguimiento de hábitos para Gainz Factory.

## 🚀 Características

- ✅ Seguimiento de hábitos diarios, semanales y mensuales
- 📊 Estadísticas de progreso y rachas
- 📅 Vista de calendario para visualizar el progreso
- 🎯 Configuración de objetivos personalizados
- 📝 Notas en las entradas de hábitos

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── [locale]/
│   │   └── [tenantSlug]/
│   │       └── growth/
│   │           ├── layout.tsx           # Layout con sidebar
│   │           ├── navigation.ts        # Configuración de navegación
│   │           └── habit/
│   │               ├── page.tsx         # Lista principal de hábitos
│   │               ├── new/
│   │               │   └── page.tsx     # Crear nuevo hábito
│   │               └── [id]/
│   │                   └── page.tsx     # Detalle del hábito
│   └── api/
│       └── graphql/
│           └── route.ts                 # Servidor Apollo GraphQL
├── components/
│   └── growth/
│       └── EngineSidebar.tsx           # Sidebar de navegación
├── lib/
│   ├── apollo-client.ts                # Cliente Apollo
│   ├── db.ts                          # Configuración de Prisma
│   ├── utils.ts                       # Utilidades (cn function)
│   └── graphql/
│       └── growth/
│           ├── queries.ts             # Schema y resolvers GraphQL
│           └── types.ts               # Tipos TypeScript
└── prisma/
    └── schema.prisma                  # Esquema de base de datos
```

## 🗄️ Base de Datos

### Modelos Prisma

- **Habit**: Representa un hábito con frecuencia, objetivo y metadatos
- **HabitEntry**: Registra las entradas diarias con estado y notas opcionales

### Estados de Entrada

- `COMPLETED`: Hábito completado exitosamente
- `SKIPPED`: Hábito omitido intencionalmente
- `PARTIAL`: Hábito completado parcialmente
- `FAILED`: Hábito no completado

## 🔧 Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/gainz_factory?schema=public"

# Example configuration (reemplazar en producción)
TENANT_ID="example-tenant-id"
USER_ID="example-user-id"
```

### 2. Base de Datos

```bash
# Generar cliente Prisma
npx prisma generate

# Crear migración inicial (cuando tengas una base de datos configurada)
npx prisma migrate dev --name init

# Ver la base de datos (opcional)
npx prisma studio
```

### 3. Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

## 🚦 Rutas Principales

- `/[locale]/[tenantSlug]/growth/habit` - Lista de hábitos
- `/[locale]/[tenantSlug]/growth/habit/new` - Crear nuevo hábito
- `/[locale]/[tenantSlug]/growth/habit/[id]` - Detalle del hábito

## 🔗 GraphQL API

El servidor GraphQL está disponible en `/api/graphql` y incluye:

### Queries
- `myHabits`: Lista todos los hábitos del usuario
- `habitEntries(habitId)`: Obtiene entradas de un hábito específico
- `habitWithEntries(habitId)`: Obtiene un hábito con sus entradas

### Mutations
- `createHabit(input)`: Crea un nuevo hábito
- `updateHabit(id, input)`: Actualiza un hábito existente
- `deleteHabit(id)`: Elimina un hábito
- `logHabitEntry(habitId, date, status, note)`: Registra una entrada de hábito
- `deleteHabitEntry(id)`: Elimina una entrada de hábito

## 🎨 UI/UX

- Diseño responsive con Tailwind CSS
- Iconos de Lucide React
- Estados visuales claros para diferentes tipos de progreso
- Tooltips y feedback visual inmediato

## 🔮 Próximos Pasos

1. **Integración con el sistema de autenticación**: Reemplazar los IDs mock con autenticación real
2. **Permisos y roles**: Implementar `canViewGrowth`, `canEditHabit`
3. **Notificaciones**: Recordatorios para completar hábitos
4. **Analytics avanzado**: Gráficos de tendencias y patrones
5. **Gamificación**: Insignias, niveles y recompensas
6. **Exportación de datos**: PDF/CSV con estadísticas

## 🐛 Notas de Desarrollo

- Los datos actualmente son mock - reemplazar con llamadas GraphQL reales
- El sistema asume un solo tenant y usuario por simplicidad
- La validación de fechas se puede mejorar con Zod
- Considerar implementar caching para mejor rendimiento

## 📦 Dependencias Principales

- **Next.js 15**: Framework React
- **Prisma**: ORM y gestión de base de datos
- **Apollo Server/Client**: GraphQL
- **Tailwind CSS**: Estilos
- **Lucide React**: Iconos
- **date-fns**: Manipulación de fechas
- **TypeScript**: Tipado estático 