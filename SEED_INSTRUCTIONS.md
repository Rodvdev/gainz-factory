# 🌱 Instrucciones para el Seeder de la Base de Datos

## 📋 Resumen

He creado un sistema completo de seeding para tu aplicación de hábitos con **todos los datos del mockup**. El seeder incluye:

### 🏗️ Datos incluidos en el seed:

1. **32 Hábitos organizados por 8 categorías:**
   - 🌅 **Rutina Matutina** (4 hábitos): Despertar temprano, meditación, journaling, hidratación
   - 💪 **Entrenamiento Físico** (4 hábitos): Fuerza, cardio, estiramientos, pasos diarios
   - 🥗 **Nutrición** (4 hábitos): Desayuno saludable, hidratación, evitar procesados, cena ligera
   - 🎯 **Trabajo Profundo** (4 hábitos): Sesiones enfocadas, sin redes sociales, planificación, Pomodoro
   - 📚 **Desarrollo Personal** (4 hábitos): Lectura, cursos online, idiomas, podcasts
   - 🤝 **Carisma Social** (4 hábitos): Llamadas familiares, cumplidos, networking, actividades sociales
   - 🛌 **Sueño y Recuperación** (4 hábitos): 8 horas de sueño, rutina nocturna, temperatura ideal, power nap
   - 🔄 **Reflexión** (4 hábitos): Revisión del día, gratitud, objetivos semanales, análisis de hábitos

2. **5 Challenges predefinidos:**
   - 21 Días de Meditación
   - Guerrero del Gimnasio (20 sesiones en 30 días)
   - Hydration Master (14 días seguidos)
   - Deep Work Champion (50 horas en un mes)
   - Bookworm (15 horas de lectura en un mes)

3. **Datos de ejemplo de los últimos 7 días:**
   - Entradas de hábitos con 70% de completitud simulada
   - Scores diarios calculados por categoría
   - Rankings y percentiles

## 🚀 Instrucciones de uso:

### 1. **Instalar dependencias nuevas:**
```bash
npm install
```

### 2. **Generar el cliente de Prisma:**
```bash
npm run db:generate
```

### 3. **Sincronizar el esquema con la base de datos:**
```bash
npm run db:push
```

### 4. **Ejecutar el seeder:**
```bash
npm run db:seed
```

## 🔧 Scripts disponibles:

```json
{
  "db:seed": "tsx scripts/seed.ts",
  "db:push": "prisma db push", 
  "db:generate": "prisma generate"
}
```

## 📊 Lo que obtienes después del seed:

1. **Usuario demo:** `demo@gainzfactory.com`
2. **32 hábitos** completamente configurados con:
   - Iconos y colores únicos
   - Puntos balanceados por dificultad
   - Tipos de tracking variados (booleano, numérico, tiempo, texto)
   - Frecuencias realistas
3. **Historial de 7 días** con datos de ejemplo
4. **5 challenges activos** listos para usar
5. **Scores calculados** por categoría y día

## 🛠️ CRUD GraphQL funcional:

El sistema incluye resolvers completos para:

### 📖 Queries:
- `myHabits` - Obtener mis hábitos con entradas recientes
- `habitWithEntries(habitId)` - Detalle de hábito con todas sus entradas
- `todayScore` - Score del día actual
- `weeklyScores` - Scores de los últimos 7 días
- `categoryStats` - Estadísticas por categoría
- `activeChallenges` - Challenges activos

### ✏️ Mutations:
- `createHabit(input)` - Crear nuevo hábito
- `updateHabit(id, input)` - Actualizar hábito
- `deleteHabit(id)` - Desactivar hábito
- `logHabitEntry(input)` - Registrar entrada de hábito
- `deleteHabitEntry(id)` - Eliminar entrada
- `createChallenge(input)` - Crear challenge
- `completeChallenge(id)` - Completar challenge
- `recalculateDailyScore(date)` - Recalcular score del día

## 🎨 Frontend conectado:

El dashboard principal (`/es/growth/habit`) ya está conectado a GraphQL y funciona con:
- Consultas en tiempo real
- Mutaciones para marcar hábitos como completados
- Fallback a datos mock si GraphQL no está disponible
- Dark mode funcional
- UI responsive y moderna

## 🔑 Variables de entorno sugeridas:

Asegúrate de tener estas variables en tu `.env`:

```env
# Usuario y tenant por defecto para el demo
USER_ID=demo-user-id
TENANT_ID=demo-tenant

# URL de tu base de datos
DATABASE_URL=your-database-url
```

## ✅ Verificación:

Después del seed, deberías poder:

1. Ver 32 hábitos organizados por categorías
2. Hacer clic en los checkboxes para marcar como completados
3. Ver las estadísticas actualizarse en tiempo real
4. Navegar entre las diferentes páginas de categorías
5. Ver los challenges activos
6. Acceder al calendario y analytics

## 🐛 Troubleshooting:

Si hay errores:

1. **Error de Prisma:** Ejecuta `npm run db:generate` y `npm run db:push`
2. **Error de GraphQL:** Verifica que el servidor Apollo esté corriendo
3. **Error de tipos:** Asegúrate de que todos los campos del schema coincidan
4. **Usuario no encontrado:** Verifica las variables USER_ID y TENANT_ID

¡Tu aplicación de hábitos está lista para usar con datos realistas! 🎉 