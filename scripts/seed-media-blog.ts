import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎬 Seeding media content and blog posts...')

  // Get the first user for authoring blog posts
  const user = await prisma.user.findFirst()
  
  if (!user) {
    console.error('❌ No users found. Please run user seeding first.')
    return
  }

  // Seed Media Content
  console.log('📺 Creating media content...')
  
  const mediaContent = await Promise.all([
    // Mindset Videos
    prisma.mediaContent.create({
      data: {
        title: 'Mindset 101: Construyendo Resistencia Mental',
        type: 'video',
        url: 'https://example.com/mindset-101.mp4',
        topic: 'Mindset',
        module: 'Fundamentos del Mindset',
        episode: 1,
        isPremium: false,
      },
    }),
    prisma.mediaContent.create({
      data: {
        title: 'La Ciencia de la Disciplina',
        type: 'video',
        url: 'https://example.com/disciplina-ciencia.mp4',
        topic: 'Mindset',
        module: 'Fundamentos del Mindset',
        episode: 2,
        isPremium: false,
      },
    }),
    prisma.mediaContent.create({
      data: {
        title: 'Técnicas Avanzadas de Visualización',
        type: 'video',
        url: 'https://example.com/visualizacion-avanzada.mp4',
        topic: 'Mindset',
        module: 'Mindset Avanzado',
        episode: 1,
        isPremium: true,
      },
    }),

    // Nutrition Content
    prisma.mediaContent.create({
      data: {
        title: 'Mitos Nutricionales Desmentidos',
        type: 'video',
        url: 'https://example.com/mitos-nutricion.mp4',
        topic: 'Nutrición',
        module: 'Nutrición Básica',
        episode: 1,
        isPremium: false,
      },
    }),
    prisma.mediaContent.create({
      data: {
        title: 'Guía Completa de Macronutrientes',
        type: 'pdf',
        url: 'https://example.com/guia-macronutrientes.pdf',
        topic: 'Nutrición',
        module: 'Nutrición Básica',
        episode: null,
        isPremium: false,
      },
    }),
    prisma.mediaContent.create({
      data: {
        title: 'Estrategias de Nutrición para Atletas',
        type: 'ebook',
        url: 'https://example.com/nutricion-atletas.pdf',
        topic: 'Nutrición',
        module: 'Nutrición Avanzada',
        episode: null,
        isPremium: true,
      },
    }),

    // Exercise Content
    prisma.mediaContent.create({
      data: {
        title: 'Técnicas de Entrenamiento de Fuerza',
        type: 'video',
        url: 'https://example.com/fuerza-tecnicas.mp4',
        topic: 'Ejercicios',
        module: 'Entrenamiento Básico',
        episode: 1,
        isPremium: false,
      },
    }),
    prisma.mediaContent.create({
      data: {
        title: 'Rutinas de Entrenamiento Avanzado',
        type: 'video',
        url: 'https://example.com/rutinas-avanzadas.mp4',
        topic: 'Ejercicios',
        module: 'Entrenamiento Avanzado',
        episode: 1,
        isPremium: true,
      },
    }),
    prisma.mediaContent.create({
      data: {
        title: 'Guía de Movilidad y Flexibilidad',
        type: 'pdf',
        url: 'https://example.com/movilidad-guia.pdf',
        topic: 'Ejercicios',
        module: 'Recuperación',
        episode: null,
        isPremium: false,
      },
    }),

    // Spirituality Content
    prisma.mediaContent.create({
      data: {
        title: 'Meditación Diaria: Guía para Principiantes',
        type: 'audio',
        url: 'https://example.com/meditacion-principiantes.mp3',
        topic: 'Espiritualidad',
        module: 'Crecimiento Espiritual',
        episode: 1,
        isPremium: false,
      },
    }),
    prisma.mediaContent.create({
      data: {
        title: 'Técnicas de Respiración Consciente',
        type: 'video',
        url: 'https://example.com/respiracion-consciente.mp4',
        topic: 'Espiritualidad',
        module: 'Crecimiento Espiritual',
        episode: 2,
        isPremium: false,
      },
    }),
    prisma.mediaContent.create({
      data: {
        title: 'Prácticas Espirituales Avanzadas',
        type: 'ebook',
        url: 'https://example.com/practicas-espirituales.pdf',
        topic: 'Espiritualidad',
        module: 'Espiritualidad Avanzada',
        episode: null,
        isPremium: true,
      },
    }),
  ])

  console.log(`✅ Created ${mediaContent.length} media content items`)

  // Seed Blog Posts
  console.log('📝 Creating blog posts...')
  
  const blogPosts = await Promise.all([
    prisma.blogPost.create({
      data: {
        title: '5 Mitos Nutricionales que Te Están Frenando',
        content: `
# 5 Mitos Nutricionales que Te Están Frenando

La nutrición está llena de mitos y malentendidos que pueden sabotear tus objetivos de transformación. En este artículo, desmentimos los 5 mitos más comunes que encontramos en nuestra comunidad.

## 1. "Las grasas te hacen gordo"

Este es uno de los mitos más persistentes. La realidad es que las grasas saludables son esenciales para:
- Absorción de vitaminas liposolubles
- Producción hormonal
- Saciedad y control del apetito

## 2. "Debes comer cada 2-3 horas"

No existe evidencia científica que respalde la necesidad de comer frecuentemente para "acelerar el metabolismo". Lo importante es el total de calorías y la calidad de los alimentos.

## 3. "Los carbohidratos son el enemigo"

Los carbohidratos son la principal fuente de energía del cuerpo. La clave está en elegir carbohidratos complejos y controlar las porciones.

## 4. "Todos los suplementos son necesarios"

La mayoría de nutrientes deben venir de alimentos integrales. Los suplementos solo deben usarse para llenar vacíos específicos en tu dieta.

## 5. "Las dietas detox son efectivas"

Tu hígado y riñones ya hacen un trabajo excelente desintoxicando tu cuerpo. Las dietas "detox" suelen ser marketing y pueden ser contraproducentes.

## Conclusión

Enfócate en una alimentación balanceada, variada y sostenible a largo plazo. Si tienes dudas específicas, consulta con un profesional en nutrición.
        `,
        tags: ['nutrición', 'mitos', 'salud', 'alimentación'],
        authorId: user.id,
      },
    }),

    prisma.blogPost.create({
      data: {
        title: 'La Ciencia Detrás de la Formación de Hábitos',
        content: `
# La Ciencia Detrás de la Formación de Hábitos

Los hábitos son la base de toda transformación duradera. Entender cómo se forman puede ayudarte a crear cambios positivos que perduren en el tiempo.

## El Bucle del Hábito

Según Charles Duhigg, todo hábito se compone de tres elementos:

### 1. La Señal (Cue)
Es el disparador que le dice a tu cerebro que entre en modo automático. Puede ser:
- Un momento específico del día
- Una ubicación
- Una emoción
- La presencia de ciertas personas

### 2. La Rutina
Es el comportamiento en sí mismo. Puede ser físico, mental o emocional.

### 3. La Recompensa
Es el beneficio que obtienes del hábito, que ayuda a tu cerebro a recordar este bucle en el futuro.

## Cómo Formar Nuevos Hábitos

### Comienza Pequeño
James Clear sugiere la regla del 1%: mejora solo un 1% cada día. Los cambios pequeños se acumulan en grandes resultados.

### Apilamiento de Hábitos
Conecta un nuevo hábito con uno ya establecido:
"Después de [hábito actual], haré [nuevo hábito]"

### Diseña tu Entorno
Haz que los hábitos buenos sean fáciles y los malos difíciles:
- Deja el libro que quieres leer sobre tu almohada
- Guarda el teléfono en otra habitación antes de dormir

## Rompiendo Malos Hábitos

1. **Identifica la recompensa**: ¿Qué necesidad satisface este hábito?
2. **Cambia la rutina**: Mantén la misma señal y recompensa, pero cambia el comportamiento
3. **Encuentra reemplazos saludables**: Satisface la misma necesidad de forma positiva

## La Importancia de la Paciencia

Los estudios muestran que formar un nuevo hábito puede tomar entre 18 y 254 días, con un promedio de 66 días. Sé paciente contigo mismo.

## Aplicación Práctica

En Gainz Factory, diseñamos nuestro sistema de hábitos basado en esta ciencia:
- Categorización clara de hábitos
- Sistema de recompensas y puntos
- Seguimiento de rachas
- Recordatorios personalizables

Recuerda: no se trata de perfección, sino de consistencia.
        `,
        tags: ['hábitos', 'psicología', 'productividad', 'ciencia'],
        authorId: user.id,
      },
    }),

    prisma.blogPost.create({
      data: {
        title: 'Entrenamiento de Fuerza para Principiantes: Tu Guía Completa',
        content: `
# Entrenamiento de Fuerza para Principiantes: Tu Guía Completa

Si eres nuevo en el entrenamiento de fuerza, este artículo te dará las bases sólidas que necesitas para comenzar de manera segura y efectiva.

## ¿Por Qué Entrenar Fuerza?

El entrenamiento de fuerza no es solo para culturistas. Los beneficios incluyen:
- Aumento de masa muscular y fuerza
- Mejora de la densidad ósea
- Aceleración del metabolismo
- Mejor funcionalidad en la vida diaria
- Reducción del riesgo de lesiones

## Principios Fundamentales

### 1. Sobrecarga Progresiva
Debes incrementar gradualmente la demanda sobre tus músculos:
- Aumentar peso
- Añadir repeticiones
- Agregar series
- Mejorar la técnica

### 2. Especificidad
Tu entrenamiento debe alinearse con tus objetivos específicos.

### 3. Recuperación
Los músculos crecen durante el descanso, no durante el entrenamiento.

## Los Ejercicios Básicos

### Movimientos Fundamentales:
1. **Sentadilla (Squat)**: Fortalece piernas y core
2. **Press de Banca**: Desarrolla pecho, hombros y tríceps
3. **Peso Muerto (Deadlift)**: Trabaja toda la cadena posterior
4. **Press Militar**: Fortalece hombros y core
5. **Remo**: Desarrolla espalda y bíceps

## Programa de Inicio (Semanas 1-4)

### Frecuencia: 3 días por semana
**Día A:**
- Sentadilla: 3 series x 8-10 reps
- Press de banca: 3 series x 8-10 reps
- Remo con barra: 3 series x 8-10 reps

**Día B:**
- Peso muerto: 3 series x 5-6 reps
- Press militar: 3 series x 8-10 reps
- Dominadas asistidas: 3 series x 5-8 reps

Alterna entre Día A y Día B, descansando al menos un día entre sesiones.

## Consejos de Seguridad

1. **Aprende la técnica correcta** antes de aumentar peso
2. **Calienta siempre** antes de entrenar
3. **Usa un compañero de entrenamiento** o entrenador para ejercicios pesados
4. **Escucha a tu cuerpo**: el dolor es una señal de alarma
5. **Progresa gradualmente**: aumenta peso solo cuando puedas completar todas las series y repeticiones

## Nutrición para el Entrenamiento de Fuerza

- **Proteína**: 1.6-2.2g por kg de peso corporal
- **Carbohidratos**: Para energía y recuperación
- **Grasas saludables**: 20-30% de tus calorías totales
- **Hidratación**: Al menos 2-3 litros de agua al día

## Expectativas Realistas

### Mes 1-2:
- Mejoras en técnica y coordinación
- Ligeros aumentos de fuerza
- Mejor activación muscular

### Mes 3-6:
- Aumentos notables de fuerza
- Cambios visibles en composición corporal
- Mejora en confianza y motivación

## Errores Comunes a Evitar

1. Intentar progresar demasiado rápido
2. Ignorar la técnica por levantar más peso
3. No descansar lo suficiente
4. Compararse con otros
5. Abandonar después de pocas semanas

## Conclusión

El entrenamiento de fuerza es una de las mejores inversiones que puedes hacer en tu salud. Comienza despacio, mantén la consistencia y los resultados llegarán.

En Gainz Factory, tenemos programas estructurados y progresivos diseñados específicamente para principiantes. ¡Comienza tu transformación hoy!
        `,
        tags: ['entrenamiento', 'fuerza', 'principiantes', 'fitness', 'guía'],
        authorId: user.id,
      },
    }),

    prisma.blogPost.create({
      data: {
        title: 'Mindfulness y Meditación: Herramientas para la Transformación Personal',
        content: `
# Mindfulness y Meditación: Herramientas para la Transformación Personal

En un mundo cada vez más acelerado, el mindfulness y la meditación se han convertido en herramientas esenciales para el bienestar mental y la transformación personal.

## ¿Qué es el Mindfulness?

El mindfulness o atención plena es la práctica de estar completamente presente en el momento actual, sin juzgar. Es observar tus pensamientos, emociones y sensaciones tal como son.

## Beneficios Científicamente Comprobados

### Para la Mente:
- Reducción del estrés y ansiedad
- Mejora de la concentración y memoria
- Mayor regulación emocional
- Reducción de pensamientos rumiantes

### Para el Cuerpo:
- Disminución de la presión arterial
- Fortalecimiento del sistema inmune
- Mejor calidad del sueño
- Reducción de la inflamación

## Tipos de Meditación

### 1. Meditación de Atención Plena
Observar la respiración sin intentar cambiarla.

### 2. Meditación de Bondad Amorosa
Cultivar sentimientos de amor y compasión hacia uno mismo y otros.

### 3. Meditación Caminando
Practicar mindfulness mientras caminas lentamente.

### 4. Body Scan
Dirigir la atención sistemáticamente a diferentes partes del cuerpo.

## Cómo Empezar: Guía para Principiantes

### Semana 1-2: Establece la Base
- **Duración**: 5-10 minutos diarios
- **Técnica**: Respiración consciente
- **Horario**: Mismo momento cada día

### Semana 3-4: Profundiza la Práctica
- **Duración**: 10-15 minutos
- **Técnica**: Añade body scan
- **Observación**: Nota pensamientos sin juzgar

### Semana 5-8: Expande tu Práctica
- **Duración**: 15-20 minutos
- **Técnicas**: Varía entre diferentes tipos
- **Integración**: Practica mindfulness en actividades diarias

## Técnica Básica de Respiración Consciente

1. **Siéntate cómodamente** con la espalda recta
2. **Cierra los ojos** o fija la mirada en un punto
3. **Respira naturalmente** y observa cada inhalación y exhalación
4. **Cuando tu mente divague**, gentilmente regresa la atención a la respiración
5. **No juzgues** los pensamientos que surjan

## Integrando Mindfulness en la Vida Diaria

### Mindful Eating:
- Come sin distracciones
- Mastica lentamente
- Observa sabores, texturas y sensaciones

### Mindful Walking:
- Camina más despacio de lo usual
- Observa cada paso
- Nota los sonidos y sensaciones del entorno

### Mindful Technology:
- Toma pausas conscientes entre tareas
- Practica la respiración antes de revisar el teléfono
- Establece momentos libres de dispositivos

## Superando Obstáculos Comunes

### "No puedo dejar de pensar"
Los pensamientos son normales. El objetivo no es detenerlos, sino observarlos.

### "No tengo tiempo"
Incluso 3-5 minutos pueden marcar la diferencia. La calidad importa más que la cantidad.

### "Me aburro o me inquieto"
Estas sensaciones también son objeto de observación mindful.

## Herramientas y Recursos

### Apps Recomendadas:
- Headspace
- Calm
- Insight Timer
- Ten Percent Happier

### Libros Fundamentales:
- "El Poder del Ahora" - Eckhart Tolle
- "Dondequiera que vayas, ahí estás" - Jon Kabat-Zinn
- "Mindfulness en la Vida Cotidiana" - Thich Nhat Hanh

## Creando un Espacio de Meditación

- **Elige un lugar tranquilo** en tu hogar
- **Mantén el espacio limpio y ordenado**
- **Añade elementos que te inspiren** (velas, plantas, cojines)
- **Elimina distracciones** (silencia el teléfono)

## La Ciencia Detrás de la Práctica

Los estudios de neuroimagen muestran que la meditación regular puede:
- Aumentar la densidad de materia gris en áreas relacionadas con la memoria y el aprendizaje
- Reducir el tamaño de la amígdala (centro del miedo y estrés)
- Fortalecer las conexiones entre la corteza prefrontal y otras áreas del cerebro

## Construyendo una Práctica Sostenible

### Consejos para la Consistencia:
1. **Empieza pequeño**: Mejor 5 minutos diarios que 30 minutos una vez por semana
2. **Vincula con hábitos existentes**: Medita después de lavarte los dientes
3. **Sé compasivo contigo mismo**: No te castigues por días perdidos
4. **Encuentra comunidad**: Únete a grupos de meditación o apps con funciones sociales

## Conclusión

El mindfulness y la meditación no son solo prácticas espirituales, sino herramientas científicamente validadas para mejorar tu bienestar general. Como cualquier habilidad, requieren práctica constante.

En Gainz Factory, integramos prácticas de mindfulness en nuestro sistema de hábitos para apoyar tu transformación holística. ¡Comienza hoy con solo 5 minutos!
        `,
        tags: ['mindfulness', 'meditación', 'bienestar', 'espiritualidad', 'salud mental'],
        authorId: user.id,
      },
    }),

    prisma.blogPost.create({
      data: {
        title: 'Cómo Crear un Plan de Alimentación Sostenible',
        content: `
# Cómo Crear un Plan de Alimentación Sostenible

Un plan de alimentación sostenible no es una dieta temporal, sino un estilo de vida que puedes mantener a largo plazo mientras alcanzas tus objetivos de salud.

## Principios de una Alimentación Sostenible

### 1. Flexibilidad
Tu plan debe adaptarse a diferentes situaciones: viajes, eventos sociales, cambios en la rutina.

### 2. Disfrute
Si no disfrutas lo que comes, no será sostenible. Encuentra formas saludables de satisfacer tus antojos.

### 3. Simplicidad
Complicar demasiado las cosas lleva al abandono. Mantén las recetas y preparaciones simples.

### 4. Equilibrio
Incluye todos los grupos de alimentos en proporciones adecuadas.

## Pasos para Crear Tu Plan

### Paso 1: Evalúa tu Situación Actual
- **Registra tu alimentación** durante una semana
- **Identifica patrones**: ¿Cuándo comes más? ¿Qué te genera antojos?
- **Nota emociones**: ¿Comes por hambre o por otras razones?

### Paso 2: Define Objetivos Realistas
En lugar de "perder 20 kilos", enfócate en:
- Comer 5 porciones de frutas y verduras al día
- Beber 8 vasos de agua diarios
- Cocinar en casa 5 días por semana

### Paso 3: Calcula tus Necesidades
**Metabolismo Basal (TMB):**
- Hombres: TMB = 88.362 + (13.397 × peso) + (4.799 × altura) - (5.677 × edad)
- Mujeres: TMB = 447.593 + (9.247 × peso) + (3.098 × altura) - (4.330 × edad)

**Factor de Actividad:**
- Sedentario: TMB × 1.2
- Ligera actividad: TMB × 1.375
- Moderada actividad: TMB × 1.55
- Alta actividad: TMB × 1.725

### Paso 4: Distribución de Macronutrientes
**Para mantenimiento:**
- Proteínas: 25-30%
- Carbohidratos: 40-45%
- Grasas: 25-30%

**Para pérdida de grasa:**
- Proteínas: 30-35%
- Carbohidratos: 30-40%
- Grasas: 25-30%

## Estructura de Comidas

### Desayuno Balanceado
- **Proteína**: Huevos, yogurt griego, protein powder
- **Carbohidratos complejos**: Avena, pan integral, frutas
- **Grasas saludables**: Aguacate, nueces, semillas

### Almuerzo Nutritivo
- **Proteína magra**: Pollo, pescado, legumbres
- **Verduras**: Al menos la mitad del plato
- **Carbohidratos**: Arroz integral, quinoa, batata

### Cena Ligera
- **Proteína**: Pescado, tofu, pavo
- **Verduras**: Ensaladas grandes, vegetales cocidos
- **Carbohidratos limitados**: Si entrenas en la noche

### Snacks Inteligentes
- Frutas con frutos secos
- Yogurt con bayas
- Vegetables con hummus
- Batidos de proteína

## Lista de Compras Básica

### Proteínas:
- Pollo, pavo, pescado
- Huevos
- Legumbres (lentejas, garbanzos, frijoles)
- Yogurt griego
- Queso cottage

### Carbohidratos:
- Avena
- Arroz integral
- Quinoa
- Batatas
- Frutas variadas

### Grasas Saludables:
- Aguacate
- Aceite de oliva extra virgen
- Frutos secos y semillas
- Pescados grasos

### Verduras:
- Espinacas, kale
- Brócoli, coliflor
- Pimientos, tomates
- Zanahorias, apio
- Cebolla, ajo

## Meal Prep: Preparación de Comidas

### Domingo de Preparación:
1. **Planifica el menú** de la semana
2. **Haz la lista de compras**
3. **Prepara proteínas** en lotes
4. **Corta verduras** y guárdalas
5. **Cocina granos** en cantidades grandes

### Contenedores Inteligentes:
- Divide en porciones apropiadas
- Usa contenedores de vidrio
- Etiqueta con fechas
- Congela porciones para emergencias

## Manejando Situaciones Sociales

### Restaurantes:
- Revisa el menú online antes de ir
- Pide aderezos y salsas aparte
- Opta por métodos de cocción saludables
- No tengas miedo de hacer modificaciones

### Eventos Sociales:
- Come algo saludable antes de ir
- Enfócate en la socialización, no en la comida
- Elige bebidas bajas en calorías
- Practica el control de porciones

## Estrategias para Antojos

### Antojos de Dulce:
- Frutas con canela
- Yogurt griego con bayas
- Chocolate negro (85% cacao)
- Batidos con frutas congeladas

### Antojos de Salado:
- Palomitas caseras
- Vegetales con hummus
- Frutos secos en porciones controladas
- Aceitunas

## Hidratación Adecuada

- **Al despertar**: 1-2 vasos de agua
- **Antes de comidas**: 1 vaso (ayuda con la saciedad)
- **Durante ejercicio**: 150-250ml cada 15-20 minutos
- **Meta diaria**: 35ml por kg de peso corporal

## Suplementación Básica

### Esenciales:
- **Vitamina D3**: 1000-2000 IU diarias
- **Omega-3**: 1-2g diarios
- **Multivitamínico**: Como seguro nutricional

### Opcionales según objetivos:
- **Proteína en polvo**: Si no alcanzas requerimientos
- **Creatina**: 3-5g diarios para rendimiento
- **Magnesio**: Para mejor sueño y recuperación

## Monitoreando el Progreso

### Métricas Útiles:
- **Peso corporal**: Misma hora, mismas condiciones
- **Fotografías**: Cada 2-4 semanas
- **Medidas corporales**: Cintura, cadera, brazos
- **Niveles de energía**: Escala del 1-10 diaria
- **Calidad del sueño**: Horas y profundidad

### Ajustes Necesarios:
- Si no hay progreso en 2-3 semanas, reduce calorías 10-15%
- Si pierdes peso muy rápido, aumenta calorías gradualmente
- Ajusta macronutrientes según tu respuesta individual

## Manteniendo la Motivación

### Celebra Pequeñas Victorias:
- Completar una semana de meal prep
- Elegir agua en lugar de bebidas azucaradas
- Cocinar en casa más días de los planeados

### Encuentra tu "Por Qué":
- Más energía para jugar con tus hijos
- Sentirte más confident
- Mejorar tu salud a largo plazo
- Ser un ejemplo para otros

## Errores Comunes a Evitar

1. **Ser demasiado restrictivo** desde el inicio
2. **Eliminar grupos de alimentos** completamente
3. **No planificar para situaciones imprevistas**
4. **Compararte con otros** en lugar de tu progreso personal
5. **Abandonar por un desliz** en lugar de continuar

## Conclusión

Un plan de alimentación sostenible es aquel que puedes seguir por años, no por semanas. Enfócate en crear hábitos graduales y sostenibles en lugar de cambios drásticos.

Recuerda: la perfección no es el objetivo, la consistencia sí. En Gainz Factory, te ayudamos a desarrollar estos hábitos de forma gradual y sostenible.

¡Tu transformación es un maratón, no una carrera de velocidad!
        `,
        tags: ['nutrición', 'planificación', 'alimentación', 'sostenibilidad', 'salud'],
        authorId: user.id,
      },
    }),
  ])

  console.log(`✅ Created ${blogPosts.length} blog posts`)

  // Create some sample media progress for the user
  console.log('📊 Creating sample media progress...')
  
  const mediaProgress = await Promise.all([
    prisma.mediaProgress.create({
      data: {
        userId: user.id,
        mediaId: mediaContent[0].id, // Mindset 101
        progress: 0.75,
        watchedAt: new Date(),
      },
    }),
    prisma.mediaProgress.create({
      data: {
        userId: user.id,
        mediaId: mediaContent[1].id, // La Ciencia de la Disciplina
        progress: 1.0,
        watchedAt: new Date(),
      },
    }),
    prisma.mediaProgress.create({
      data: {
        userId: user.id,
        mediaId: mediaContent[3].id, // Mitos Nutricionales
        progress: 0.5,
        watchedAt: new Date(),
      },
    }),
  ])

  console.log(`✅ Created ${mediaProgress.length} media progress records`)

  console.log('🎉 Media content and blog seeding completed!')
  console.log(`
📊 Summary:
  • ${mediaContent.length} media content items created
  • ${blogPosts.length} blog posts created  
  • ${mediaProgress.length} progress records created
  
📺 Media Content by Topic:
  • Mindset: ${mediaContent.filter(m => m.topic === 'Mindset').length}
  • Nutrición: ${mediaContent.filter(m => m.topic === 'Nutrición').length}
  • Ejercicios: ${mediaContent.filter(m => m.topic === 'Ejercicios').length}
  • Espiritualidad: ${mediaContent.filter(m => m.topic === 'Espiritualidad').length}
  
📝 Blog Posts Created:
  ${blogPosts.map(post => `• ${post.title}`).join('\n  ')}
  `)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding media and blog:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 