# GAINZ FACTORY - Plataforma Completa de Transformación Física y Mental

## 📋 ÍNDICE
1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Módulos Principales](#módulos-principales)
4. [Especificaciones Técnicas](#especificaciones-técnicas)
5. [Experiencia de Usuario](#experiencia-de-usuario)
6. [Panel de Administración](#panel-de-administración)
7. [Sistema de Equipos](#sistema-de-equipos)
8. [Funcionalidades Avanzadas](#funcionalidades-avanzadas)
9. [Roadmap de Implementación](#roadmap-de-implementación)

---

## 🎯 VISIÓN GENERAL

**Gainz Factory** es una plataforma integral de transformación física y mental que combina:
- Programas personalizados de entrenamiento
- Nutrición y dietas especializadas
- Desarrollo mental y mindset
- Coaching personalizado
- Comunidad y soporte social
- Herramientas de seguimiento y análisis

### Objetivos Principales
- Crear una experiencia de transformación completa (Transformation OS)
- Personalizar contenido según objetivos y nivel del usuario
- Facilitar el seguimiento de coach-usuario
- Construir una comunidad activa y motivadora
- Escalar el negocio con múltiples servicios y productos

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### Backend
- **Framework**: Next.js 14 con App Router
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: JWT + NextAuth.js
- **API**: RESTful APIs con validación completa
- **Archivos**: AWS S3 o Cloudinary
- **Notificaciones**: Email + Push notifications

### Frontend
- **Framework**: Next.js 14 + React 18
- **Styling**: Tailwind CSS + Framer Motion
- **Estado**: Zustand + React Query
- **UI Components**: Shadcn/ui + Lucide Icons
- **Responsive**: Mobile-first design

### Infraestructura
- **Hosting**: Vercel + Neon Database
- **CDN**: Vercel Edge Network
- **Monitoreo**: Vercel Analytics + Sentry
- **CI/CD**: GitHub Actions

---

## 🧩 MÓDULOS PRINCIPALES

### 1. TRANSFORMATION OS (Dashboard Principal)
**Objetivo**: Experiencia personalizada de transformación

#### Características:
- **Dashboard Personalizado**: Vista única según objetivos del usuario
- **Progreso Visual**: Gráficos y métricas de evolución
- **Programas Activos**: Programmes asignados con progreso
- **Calendario Integrado**: Entrenamientos, nutrición, citas
- **Hábitos y Tracking**: Sistema gamificado
- **Métricas Personales**: Peso, medidas, fotos de progreso
- **AI Coach**: Asistente virtual personalizado

#### Componentes:
```typescript
interface TransformationOS {
  userProfile: UserProfile
  activeProgrammes: Programme[]
  weeklySchedule: CalendarEvent[]
  progressMetrics: ProgressMetrics
  habits: Habit[]
  aiInteractions: AIInteraction[]
  notifications: Notification[]
}
```

### 2. ADMIN LIBRARY (Biblioteca de Contenido)
**Objetivo**: Gestión centralizada de todo el contenido

#### Secciones:
- **Physical Activity**: Ejercicios, Workouts, Cardio
- **Videos**: Contenido educativo y motivacional
- **Nutrition**: Recetas, dietas, planes nutricionales
- **Programmes**: Programas estructurados
- **Documents**: PDFs, ebooks, guías
- **Forms**: Formularios dinámicos

#### API Endpoints:
```
GET/POST /api/admin/physical-activity
GET/POST /api/admin/videos
GET/POST /api/admin/nutrition
GET/POST /api/admin/documents
GET/POST /api/admin/programmes
GET/POST /api/admin/forms
```

### 3. USER ASSIGNMENT SYSTEM
**Objetivo**: Asignación personalizada de contenido

#### Características:
- **Perfil Detallado**: Objetivos, nivel, preferencias
- **Asignación Manual**: Coach asigna contenido específico
- **Asignación Automática**: IA sugiere contenido basado en perfil
- **Programmes en Cascada**: Programas que se activan automáticamente
- **Seguimiento Personalizado**: Progress tracking individual

#### Modelos de Base de Datos:
```prisma
model UserAssignment {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  contentType String    // "programme", "exercise", "nutrition", etc.
  contentId   String
  assignedBy  String    // Coach ID
  assignedAt  DateTime  @default(now())
  isActive    Boolean   @default(true)
  notes       String?
}

model ProgrammeSequence {
  id              String    @id @default(cuid())
  programmeId     String
  nextProgrammeId String?
  autoStart       Boolean   @default(false)
  delayDays       Int       @default(0)
}
```

### 4. CALENDAR SYSTEM
**Objetivo**: Gestión completa de tiempo y actividades

#### Características:
- **Vista Mensual/Semanal/Día**: Múltiples vistas
- **Eventos Integrados**: Programmes, workouts, citas
- **Sincronización**: Google Calendar, Outlook
- **Recordatorios**: Push notifications y emails
- **Disponibilidad**: Gestión de horarios de coaches
- **Citas**: Scheduling con coaches y especialistas

#### Componentes:
```typescript
interface CalendarEvent {
  id: string
  type: 'workout' | 'nutrition' | 'mindset' | 'session' | 'meeting'
  title: string
  startTime: DateTime
  endTime: DateTime
  location?: string
  participants: User[]
  programme?: Programme
  status: 'scheduled' | 'completed' | 'cancelled'
}
```

### 5. TEAM MANAGEMENT
**Objetivo**: Gestión de coaches y colaboradores

#### Roles de Equipo:
- **Trainers**: Especialistas en ejercicio físico
- **Nutritionists**: Expertos en nutrición
- **Yoga Instructors**: Instructores de yoga y mindfulness
- **Life Coaches**: Coaches de desarrollo personal
- **Content Creators**: Creadores de contenido

#### Características:
- **Perfiles de Especialistas**: Bio, especialidades, horarios
- **Asignación de Clientes**: Gestión de cartera de clientes
- **Comunicación**: Chat interno, videollamadas
- **Comisiones**: Sistema de pagos y comisiones
- **Disponibilidad**: Calendario de disponibilidad

#### Modelos:
```prisma
model TeamMember {
  id          String    @id @default(cuid())
  userId      String    @unique
  user        User      @relation(fields: [userId], references: [id])
  role        TeamRole
  specialty   String[]
  bio         String?
  experience  Int       // años de experiencia
  rating      Float     @default(0)
  isActive    Boolean   @default(true)
  clients     User[]    @relation("CoachClient")
  schedules   Schedule[]
}

enum TeamRole {
  TRAINER
  NUTRITIONIST
  YOGA_INSTRUCTOR
  LIFE_COACH
  CONTENT_CREATOR
}
```

### 6. BUSINESS MANAGEMENT
**Objetivo**: Gestión comercial y de productos

#### Secciones:
- **Plans**: Planes de suscripción
- **Products**: Productos físicos/digitales
- **Services**: Servicios personalizados
- **Pricing**: Gestión de precios
- **Orders**: Pedidos y ventas
- **Analytics**: Métricas de negocio

---

## 🔧 ESPECIFICACIONES TÉCNICAS

### Base de Datos - Modelos Principales

```prisma
// Usuario Principal
model User {
  id                    String    @id @default(cuid())
  email                 String    @unique
  firstName             String
  lastName              String
  role                  UserRole  @default(USER)
  teamRole              TeamRole?
  
  // Profile Data
  profileImageUrl       String?
  bio                   String?
  objectives            String[]
  fitnessLevel          UserLevel?
  preferences           Json?
  
  // Relationships
  programmes            UserProgramme[]
  assignments           UserAssignment[]
  calendarEvents        CalendarEvent[]
  progressMetrics       ProgressMetrics[]
  habits                Habit[]
  teamMember            TeamMember?
  coach                 Coach?
  clients               User[]     @relation("CoachClient")
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

// Programmes Mejorados
model Programme {
  id              String    @id @default(cuid())
  title           String
  description     String?
  category        ContentCategory
  level           UserLevel?
  duration        Int?      // semanas
  isActive        Boolean   @default(true)
  isPublic        Boolean   @default(false)
  autoSequence    Boolean   @default(false) // Para programmes en cascada
  
  // Relaciones
  weeklyPlans     WeeklyPlan[]
  userProgrammes  UserProgramme[]
  sequences       ProgrammeSequence[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

// Sistema de Asignación
model UserProgramme {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  programmeId   String
  programme     Programme @relation(fields: [programmeId], references: [id])
  assignedBy    String?   // Coach ID
  startDate     DateTime
  endDate       DateTime?
  status        String    @default("active") // active, completed, paused
  progress      Float     @default(0) // 0-100%
  
  @@unique([userId, programmeId])
}

// Calendario
model CalendarEvent {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  type        String    // workout, nutrition, mindset, session, meeting
  title       String
  description String?
  startTime   DateTime
  endTime     DateTime
  location    String?
  programmeId String?
  programme   Programme?
  isRecurring Boolean   @default(false)
  recurrence  Json?     // Configuración de recurrencia
  
  createdAt   DateTime  @default(now())
}

// Métricas de Progreso
model ProgressMetrics {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  metricType  String    // weight, body_fat, muscle_mass, etc.
  value       Float
  unit        String    // kg, %, cm, etc.
  date        DateTime
  notes       String?
  photoUrl    String?
  
  createdAt   DateTime  @default(now())
}
```

### APIs Principales

#### Admin APIs
```typescript
// Physical Activity
GET/POST /api/admin/physical-activity
GET/PUT/DELETE /api/admin/physical-activity/[id]

// Videos
GET/POST /api/admin/videos
GET/PUT/DELETE /api/admin/videos/[id]

// Nutrition
GET/POST /api/admin/nutrition
GET/PUT/DELETE /api/admin/nutrition/[id]

// Documents
GET/POST /api/admin/documents
GET/PUT/DELETE /api/admin/documents/[id]

// Team Management
GET/POST /api/admin/team
GET/PUT/DELETE /api/admin/team/[id]
```

#### User APIs
```typescript
// Dashboard
GET /api/user/dashboard
GET /api/user/progress
GET /api/user/programmes

// Calendar
GET/POST /api/user/calendar
GET/PUT/DELETE /api/user/calendar/[id]

// Assignments
GET /api/user/assignments
POST /api/user/assignments/complete

// Team
GET /api/user/coaches
POST /api/user/coaches/[id]/book
```

---

## 🎨 EXPERIENCIA DE USUARIO

### Transformation OS Dashboard

#### Componentes Principales:
1. **Header Personalizado**
   - Avatar y nombre
   - Nivel actual y XP
   - Notificaciones
   - Acceso rápido

2. **Métricas de Progreso**
   - Gráficos de evolución
   - Fotos before/after
   - Objetivos vs. Realidad
   - Streaks y logros

3. **Programas Activos**
   - Cards de programmes activos
   - Progreso semanal
   - Próximas tareas
   - Quick actions

4. **Calendario Integrado**
   - Vista semanal/mensual
   - Eventos coloreados por tipo
   - Drag & drop para reprogramar
   - Recordatorios

5. **Hábitos y Tracking**
   - Lista de hábitos diarios
   - Check-in rápido
   - Streaks visuales
   - Motivación personalizada

### Mobile Experience
- **App-like**: PWA con instalación
- **Offline**: Funcionalidad básica offline
- **Push Notifications**: Recordatorios y motivación
- **Quick Actions**: Acciones rápidas desde home screen

---

## 👥 PANEL DE ADMINISTRACIÓN

### Estructura de Navegación

```
📊 Dashboard
├── 📈 Analytics
├── 👥 Users
├── 🏋️ Physical Activity
├── 🎥 Videos
├── 🥗 Nutrition
├── 📋 Programmes
├── 📄 Documents
├── 📝 Forms
├── 👨‍🏫 Team
├── 💼 Business
│   ├── Plans
│   ├── Products
│   ├── Services
│   └── Orders
├── 💬 Community
│   ├── Blog
│   ├── Forums
│   └── Testimonials
└── ⚙️ Settings
```

### Funcionalidades Clave

#### Content Management
- **Bulk Operations**: Operaciones masivas
- **Content Templates**: Plantillas reutilizables
- **Version Control**: Control de versiones
- **Approval Workflow**: Flujo de aprobación
- **Analytics**: Métricas de contenido

#### User Management
- **User Profiles**: Perfiles detallados
- **Assignment System**: Sistema de asignación
- **Progress Tracking**: Seguimiento de progreso
- **Communication**: Herramientas de comunicación
- **Billing**: Gestión de facturación

---

## 👨‍🏫 SISTEMA DE EQUIPOS

### Roles y Permisos

#### Trainers
- **Permisos**: Gestión de ejercicios, workouts, programmes físicos
- **Clientes**: Asignación de clientes
- **Herramientas**: Calendario, chat, progress tracking
- **Comisiones**: Sistema de pagos por cliente

#### Nutritionists
- **Permisos**: Gestión de nutrición, dietas, recetas
- **Clientes**: Seguimiento nutricional
- **Herramientas**: Meal planning, tracking nutricional
- **Comisiones**: Pagos por consultas y seguimiento

#### Yoga Instructors
- **Permisos**: Contenido de yoga, mindfulness, meditación
- **Clientes**: Clases grupales e individuales
- **Herramientas**: Scheduling, video calls
- **Comisiones**: Por clases y programas

#### Life Coaches
- **Permisos**: Contenido de mindset, desarrollo personal
- **Clientes**: Coaching personalizado
- **Herramientas**: Session scheduling, progress tracking
- **Comisiones**: Por sesiones y programas

### Team Dashboard
- **Client Portfolio**: Cartera de clientes
- **Schedule Management**: Gestión de horarios
- **Communication Hub**: Centro de comunicación
- **Performance Metrics**: Métricas de rendimiento
- **Earnings**: Dashboard de ganancias

---

## 🚀 FUNCIONALIDADES AVANZADAS

### AI Integration
- **Personalized Recommendations**: Recomendaciones personalizadas
- **Progress Analysis**: Análisis de progreso con IA
- **Chatbot Assistant**: Asistente virtual
- **Content Generation**: Generación de contenido con IA
- **Predictive Analytics**: Analytics predictivos

### Gamification
- **XP System**: Sistema de experiencia
- **Achievements**: Logros y badges
- **Leaderboards**: Tablas de clasificación
- **Challenges**: Desafíos semanales/mensuales
- **Rewards**: Sistema de recompensas

### Community Features
- **Social Feed**: Feed social
- **Groups**: Grupos por objetivos
- **Challenges**: Desafíos comunitarios
- **Success Stories**: Historias de éxito
- **Mentorship**: Sistema de mentoría

### Advanced Analytics
- **User Behavior**: Análisis de comportamiento
- **Content Performance**: Rendimiento de contenido
- **Business Metrics**: Métricas de negocio
- **Predictive Modeling**: Modelado predictivo
- **Custom Reports**: Reportes personalizados

---

## 📅 ROADMAP DE IMPLEMENTACIÓN

### Fase 1: Foundation (4-6 semanas)
- [x] Sistema de Programmes y Forms
- [ ] Transformation OS Dashboard básico
- [ ] Calendar System
- [ ] User Assignment System
- [ ] Admin Library structure

### Fase 2: Team & Business (3-4 semanas)
- [ ] Team Management System
- [ ] Business Management
- [ ] Advanced Admin Panel
- [ ] Coach-Client Communication
- [ ] Payment Integration

### Fase 3: Community & AI (4-5 semanas)
- [ ] Community Features
- [ ] Blog & Forums
- [ ] AI Integration
- [ ] Gamification
- [ ] Mobile App (PWA)

### Fase 4: Advanced Features (3-4 semanas)
- [ ] Advanced Analytics
- [ ] Predictive Features
- [ ] API Integrations
- [ ] Third-party Tools
- [ ] Performance Optimization

### Fase 5: Launch & Scale (2-3 semanas)
- [ ] Testing & QA
- [ ] Performance Optimization
- [ ] Security Audit
- [ ] Launch Preparation
- [ ] Marketing Integration

---

## 🛠️ HERRAMIENTAS Y TECNOLOGÍAS

### Development Tools
- **IDE**: VS Code con extensiones
- **Version Control**: Git + GitHub
- **Project Management**: GitHub Projects
- **Documentation**: Notion + Markdown
- **Design**: Figma + Shadcn/ui

### Monitoring & Analytics
- **Error Tracking**: Sentry
- **Analytics**: Vercel Analytics + Google Analytics
- **Performance**: Vercel Speed Insights
- **Uptime**: UptimeRobot
- **Logs**: Vercel Logs

### Third-party Integrations
- **Payments**: Stripe
- **Email**: Resend/SendGrid
- **Storage**: AWS S3/Cloudinary
- **Calendar**: Google Calendar API
- **Notifications**: OneSignal
- **Video**: Vimeo/YouTube API

---

## 📊 MÉTRICAS DE ÉXITO

### User Engagement
- **Daily Active Users**: 80%+ de usuarios activos diarios
- **Session Duration**: 15+ minutos promedio
- **Retention Rate**: 70%+ retención a 30 días
- **Programme Completion**: 60%+ completion rate

### Business Metrics
- **Conversion Rate**: 5%+ de trial a paid
- **Churn Rate**: <5% mensual
- **ARPU**: $50+ por usuario
- **Team Utilization**: 80%+ utilización de coaches

### Technical Performance
- **Page Load Time**: <2 segundos
- **Uptime**: 99.9%+
- **Error Rate**: <0.1%
- **Mobile Performance**: 90+ Lighthouse score

---

## 🎯 CONCLUSIÓN

Esta especificación define una plataforma completa de transformación física y mental que combina:

1. **Personalización Extrema**: Contenido adaptado a cada usuario
2. **Experiencia Integral**: Desde ejercicio hasta mindset
3. **Soporte Profesional**: Coaches y especialistas
4. **Comunidad Activa**: Motivación y apoyo social
5. **Tecnología Avanzada**: IA y analytics predictivos

La implementación seguirá un enfoque iterativo, priorizando las funcionalidades core y expandiendo gradualmente hacia características avanzadas.

**Objetivo Final**: Crear la plataforma líder en transformación personal, combinando tecnología, expertise humano y comunidad para maximizar los resultados de los usuarios.
