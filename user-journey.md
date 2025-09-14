graph TD
    A["🏠 Landing Page<br/>¿Listo para transformar tu vida?"] --> B["🔴 Comenzar Ahora<br/>(Actualmente va a Instagram)"]
    
    B --> C["📱 Instagram Contact<br/>(Flujo actual)"]
    B --> D["🎯 Onboarding Ideal<br/>(Propuesto)"]
    
    D --> E["📝 Registro<br/>Nombre, Email, Contraseña"]
    E --> F["✉️ Verificación Email<br/>Confirmar cuenta"]
    F --> G["🎯 Configuración de Objetivos<br/>¿Qué quieres lograr?"]
    
    G --> H{"🎯 Tipo de Objetivo"}
    H -->|Fitness| I["💪 Objetivos Fitness<br/>Pérdida peso, ganancia músculo"]
    H -->|Nutrición| J["🥗 Objetivos Nutrición<br/>Hábitos alimenticios"]
    H -->|Mindset| K["🧠 Objetivos Mindset<br/>Desarrollo personal"]
    
    I --> L["📊 Cuestionario Inicial<br/>Nivel actual, experiencia"]
    J --> L
    K --> L
    
    L --> M["🎯 Selección de Hábitos<br/>3-5 hábitos iniciales"]
    M --> N["📅 Configuración Horarios<br/>Cuándo hacer cada hábito"]
    N --> O["👤 Completar Perfil<br/>Foto, bio, preferencias"]
    O --> P["🎉 Bienvenida Personalizada<br/>¡Listo para transformarte!"]
    
    P --> Q["🏠 Dashboard Principal<br/>Vista general del progreso"]
    
    Q --> R["📈 Componentes Dashboard"]
    R --> S["⭐ Puntuación Diaria<br/>85 puntos hoy"]
    R --> T["🔥 Rachas Activas<br/>21 días de meditación"]
    R --> U["🏆 Desafíos<br/>30 días de meditación"]
    R --> V["📊 Progreso Semanal<br/>Gráfico de evolución"]
    
    Q --> W["🚀 Acciones Rápidas"]
    W --> X["📝 Log Rápido<br/>Registrar hábito completado"]
    W --> Y["➕ Nuevo Hábito<br/>Crear hábito personalizado"]
    W --> Z["🏆 Ver Desafíos<br/>Explorar desafíos disponibles"]
    
    style A fill:#000,stroke:#ef4444,stroke-width:3px,color:#fff
    style B fill:#ef4444,stroke:#000,stroke-width:2px,color:#fff
    style D fill:#10b981,stroke:#000,stroke-width:2px,color:#fff
    style Q fill:#000,stroke:#ef4444,stroke-width:3px,color:#fff
    style P fill:#8b5cf6,stroke:#000,stroke-width:2px,color:#fff
