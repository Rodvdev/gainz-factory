# 🎨 Sistema de Diseño - Onboarding Gainz Factory

## 📋 Resumen del Estilo

Basado en el diseño de `page.tsx`, `Hero.tsx` y `Header.tsx`, el onboarding seguirá un sistema de diseño consistente y moderno.

## 🎯 Principios de Diseño

### 1. **Paleta de Colores**
```css
/* Colores Principales */
--primary-red: #DC2626 (red-600)
--primary-red-hover: #B91C1C (red-700)
--primary-red-light: #EF4444 (red-500)

/* Colores Neutros */
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-300: #D1D5DB
--gray-400: #9CA3AF
--gray-500: #6B7280
--gray-600: #4B5563
--gray-700: #374151
--gray-800: #1F2937
--gray-900: #111827

/* Colores de Fondo */
--bg-primary: #FFFFFF
--bg-secondary: #F9FAFB (gray-50)
--bg-tertiary: #F3F4F6 (gray-100)
```

### 2. **Tipografía**
```css
/* Títulos Principales */
font-family: system-ui, -apple-system, sans-serif
font-size: 2.5rem - 4rem (text-4xl to text-6xl)
font-weight: 700 (font-bold)
line-height: 1.1 (leading-tight)

/* Subtítulos */
font-size: 1.125rem - 1.25rem (text-lg to text-xl)
font-weight: 400
line-height: 1.6 (leading-relaxed)

/* Texto de Cuerpo */
font-size: 0.875rem - 1rem (text-sm to text-base)
font-weight: 400
line-height: 1.5
```

### 3. **Espaciado y Layout**
```css
/* Contenedores */
max-width: 6xl (1152px)
padding: 1rem (px-4) en móvil, 1.5rem (px-6) en tablet, 2rem (px-8) en desktop

/* Espaciado Vertical */
py-8: 2rem (32px) - Espaciado entre secciones
py-12: 3rem (48px) - Espaciado de secciones principales
py-20: 5rem (80px) - Espaciado de secciones grandes

/* Grid System */
grid-cols-1: Móvil
md:grid-cols-2: Tablet
lg:grid-cols-3: Desktop
gap-6: 1.5rem (24px) entre elementos
```

### 4. **Componentes de Interfaz**

#### **Botones Primarios**
```css
/* Estilo Principal */
bg-red-600 hover:bg-red-700
text-white
font-semibold
px-8 py-4
rounded-lg
transition-colors duration-200
shadow-lg hover:shadow-xl
transform hover:-translate-y-1
transition-all duration-200

/* Botones Secundarios */
border border-gray-300 hover:border-gray-400
text-gray-700
font-semibold
px-8 py-4
rounded-lg
transition-colors duration-200
```

#### **Cards y Contenedores**
```css
/* Cards Principales */
bg-white
backdrop-blur-sm
border-2 border-gray-200 hover:border-gray-300
rounded-2xl
p-8
transition-all duration-300
hover:scale-[1.02]
hover:shadow-2xl
overflow-hidden

/* Efectos de Hover */
group-hover:opacity-100
transition-opacity duration-300
```

#### **Inputs y Formularios**
```css
/* Inputs */
w-full
px-4 py-3
border border-gray-300
rounded-lg
focus:ring-2 focus:ring-red-500
focus:border-red-500
transition-colors duration-200
text-gray-900
placeholder-gray-500
```

### 5. **Efectos Visuales**

#### **Gradientes**
```css
/* Gradiente de Fondo */
bg-gradient-to-r from-gray-900 to-black
bg-gradient-to-br from-gray-50/50 to-gray-100/50

/* Gradiente de Texto */
bg-gradient-to-r from-red-600 to-red-500
bg-clip-text text-transparent
```

#### **Animaciones**
```css
/* Transiciones Suaves */
transition-all duration-300
transition-colors duration-200
transition-opacity duration-300

/* Hover Effects */
hover:scale-[1.02]
hover:-translate-y-1
hover:shadow-xl
```

#### **Backdrop Blur**
```css
backdrop-blur-xl
backdrop-blur-lg
backdrop-blur-sm
```

### 6. **Iconografía**
- **Lucide React Icons**: Consistencia con el sistema existente
- **Tamaños**: 20px (w-5 h-5), 24px (w-6 h-6), 32px (w-8 h-8)
- **Colores**: gray-400 hover:gray-600, red-500 para acentos

### 7. **Responsive Design**

#### **Breakpoints**
```css
/* Móvil First */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

#### **Adaptaciones**
- **Móvil**: Stack vertical, padding reducido, texto más grande
- **Tablet**: Grid 2 columnas, espaciado medio
- **Desktop**: Grid 3 columnas, espaciado completo

### 8. **Estados de Interacción**

#### **Loading States**
```css
opacity-50
cursor-not-allowed
animate-pulse
```

#### **Error States**
```css
border-red-500
text-red-600
bg-red-50
```

#### **Success States**
```css
border-green-500
text-green-600
bg-green-50
```

### 9. **Componentes Específicos del Onboarding**

#### **Progress Bar**
```css
w-full bg-gray-200 rounded-full h-2
bg-gradient-to-r from-red-500 to-red-600
transition-all duration-500
```

#### **Step Indicators**
```css
w-8 h-8 rounded-full
bg-gray-300 text-gray-600
bg-red-600 text-white (active)
transition-all duration-300
```

#### **Card de Objetivo/Hábito**
```css
group relative p-6
bg-white border-2 border-gray-200
hover:border-red-300
rounded-xl
transition-all duration-300
hover:scale-[1.02]
hover:shadow-lg
```

### 10. **Accesibilidad**
- **Contraste**: Mínimo 4.5:1 para texto normal
- **Focus States**: Visible con ring-2 ring-red-500
- **Keyboard Navigation**: Tab order lógico
- **Screen Readers**: Labels apropiados

## 🚀 Implementación

Este sistema de diseño se aplicará a todas las páginas del onboarding:
1. `/onboarding/welcome`
2. `/onboarding/register`
3. `/onboarding/verify`
4. `/onboarding/objectives`
5. `/onboarding/questionnaire`
6. `/onboarding/habits`
7. `/onboarding/schedule`
8. `/onboarding/profile`
9. `/onboarding/complete`

Cada página mantendrá la consistencia visual mientras proporciona una experiencia de usuario fluida y motivadora.
