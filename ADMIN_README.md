# Gainz Factory - Admin Dashboard

## 🎯 Descripción

El Admin Dashboard de Gainz Factory es una interfaz completa para administrar todos los aspectos de la plataforma fitness. Permite gestionar usuarios, ejercicios, recetas, contenido multimedia, servicios y más.

## 🚀 Configuración Inicial

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Base de Datos
```bash
# Generar el cliente de Prisma
npm run db:generate

# Aplicar migraciones
npm run db:push

# Poblar la base de datos con datos iniciales
npm run db:seed-admin
```

### 3. Variables de Entorno
Asegúrate de tener configurado tu archivo `.env` con:
```env
DATABASE_URL="tu_url_de_base_de_datos"
JWT_SECRET="tu_secret_key"
JWT_URL="http://localhost:3000"
```

## 👥 Usuarios de Prueba

Después de ejecutar el seeding, tendrás estos usuarios disponibles:

### Admin User
- **Email:** bolligerfitness@gmail.com
- **Password:** admin123
- **Rol:** ADMIN
- **Acceso:** Panel de administración completo

### Usuario Regular
- **Email:** rodrigovdev01@gmail.com
- **Password:** user123
- **Rol:** USER
- **Suscripciones:** Todos los planes (Fitness, Nutrición, Mindset)
- **Datos:** Hábitos, rutinas, progreso de ejemplo

## 🎛️ Funcionalidades del Admin Dashboard

### 1. Dashboard Principal (`/admin`)
- Métricas generales de la plataforma
- KPIs principales (usuarios, ingresos, retención)
- Actividad reciente
- Acciones rápidas

### 2. Gestión de Usuarios (`/admin/users`)
- Ver todos los usuarios registrados
- Cambiar roles (USER, COACH, ADMIN)
- Activar/desactivar usuarios
- Filtrar por rol y estado
- Editar información de usuarios

### 3. Gestión de Ejercicios (`/admin/exercises`)
- Biblioteca completa de ejercicios
- Crear, editar y eliminar ejercicios
- Filtrar por tipo, nivel e intensidad
- Gestionar músculos objetivo
- Subir videos e imágenes

### 4. Gestión de Recetas (`/admin/recipes`)
- Catálogo de recetas saludables
- Marcar como premium/gratuito
- Filtrar por objetivo y nivel
- Gestionar contenido multimedia

### 5. Gestión de Contenido (`/admin/content`)
- Videos, PDFs, eBooks y audio
- Organizar por módulos y episodios
- Control de acceso premium
- Categorización por temas

### 6. Gestión de Servicios (`/admin/services`)
- Planes de coaching y servicios
- Configurar precios y duración
- Activar/desactivar servicios
- Niveles de servicio (LOW/HIGH)

## 🔐 Seguridad y Permisos

### Autenticación
- Solo usuarios con rol `ADMIN` pueden acceder al dashboard
- Verificación de token en cada endpoint
- Redirección automática si no es admin

### Autorización
- Middleware de verificación de roles
- Endpoints protegidos con validación de permisos
- Logs de actividad administrativa

## 📊 Datos de Ejemplo Incluidos

### Ejercicios (8)
- Press de Banca, Sentadillas, Peso Muerto
- Flexiones, Plancha, Burpees
- Mountain Climbers, Estiramientos

### Recetas (5)
- Batido Proteico Post-Entreno
- Ensalada de Pollo Mediterránea
- Bowl Vegano de Quinoa
- Salmón Keto con Espárragos
- Avena Overnight de Chocolate

### Contenido Multimedia (4)
- Video: Fundamentos del Mindset Fitness
- PDF: Guía Completa de Nutrición
- Audio: Meditación para Atletas
- Video: Técnicas de Ejercicio Avanzadas

### Servicios (4)
- Consulta Nutricional Básica ($50)
- Plan de Entrenamiento Personalizado ($150)
- Coaching de Mindset ($200)
- Seguimiento Semanal ($75)

### Hábitos de Usuario (5)
- Ejercicio Matutino (30 min)
- Meditación (10 min)
- Agua (2 litros)
- Lectura (20 páginas)
- Sueño (8 horas)

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Base de datos
npm run db:push          # Aplicar cambios de esquema
npm run db:generate      # Generar cliente Prisma
npm run db:seed-admin    # Poblar con datos de admin
npm run db:reset         # Resetear y poblar base de datos

# Linting
npm run lint
```

## 🎨 Tecnologías Utilizadas

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS, Framer Motion
- **Backend:** Prisma, PostgreSQL
- **Autenticación:** NextAuth.js
- **UI Components:** Lucide React, ShadCN
- **Estado:** React Hooks, Local Storage

## 📱 Responsive Design

El admin dashboard está completamente optimizado para:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔄 Flujo de Trabajo Recomendado

1. **Configuración inicial:** Ejecutar `npm run db:reset`
2. **Login como admin:** bolligerfitness@gmail.com
3. **Explorar funcionalidades:** Navegar por las diferentes secciones
4. **Gestionar contenido:** Crear ejercicios, recetas y contenido
5. **Monitorear usuarios:** Revisar actividad y progreso
6. **Analizar métricas:** Usar el dashboard principal para insights

## 🚨 Notas Importantes

- Los datos de ejemplo incluyen 7 días de progreso simulado
- Las contraseñas están hasheadas con bcryptjs
- Los tickets de suscripción tienen validez de 1 año
- El usuario regular tiene acceso completo a todos los planes
- Los hábitos incluyen datos de tracking de la última semana

## 📞 Soporte

Para cualquier problema o pregunta sobre el admin dashboard, revisa:
1. Los logs de la consola del navegador
2. Los logs del servidor en la terminal
3. La documentación de Prisma y Next.js
4. Los tipos de TypeScript para validación de datos
