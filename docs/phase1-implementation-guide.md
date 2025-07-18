# 🚀 Phase 1: Core Foundation Implementation Guide

## 📋 Overview
Transform Gainz Factory into a functional habit tracking platform with authentication, core habit engine, and user dashboard over 4 weeks.

---

## 🗓️ Week 1: Authentication & User Onboarding

### 🔐 Day 1-2: NextAuth.js Setup & Configuration

#### 1. Install Dependencies
```bash
npm install next-auth @auth/prisma-adapter nodemailer
npm install -D @types/nodemailer
```

#### 2. Configure NextAuth.js
**File: `src/lib/auth.ts`**
```typescript
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        if (!user || !await bcrypt.compare(credentials.password, user.password)) {
          return null
        }
        
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.profileImageUrl
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error"
  }
}
```

#### 3. Authentication Pages
**File: `src/app/(auth)/signin/page.tsx`**
```typescript
"use client"
import { signIn, getSession } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    })
    
    if (result?.ok) {
      router.push("/dashboard")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Bienvenido a <span className="text-red-500">Gainz Factory</span>
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-red-500"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-red-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  )
}
```

### 🎯 Day 3-4: User Registration & Email Verification

#### 1. Registration API
**File: `src/app/api/auth/register/route.ts`**
```typescript
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json()
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Usuario ya existe" },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        emailVerified: null
      }
    })
    
    // Send verification email
    await sendVerificationEmail(user.email, user.id)
    
    return NextResponse.json({
      message: "Usuario creado. Revisa tu email para verificar tu cuenta."
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
```

### 🌟 Day 5-7: Onboarding Flow

#### 1. Welcome & Goal Setting
**File: `src/app/(auth)/onboarding/page.tsx`**
```typescript
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const steps = [
  { id: 1, title: "Bienvenido", component: WelcomeStep },
  { id: 2, title: "Objetivos", component: GoalsStep },
  { id: 3, title: "Hábitos", component: HabitsStep },
  { id: 4, title: "Perfil", component: ProfileStep }
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [userData, setUserData] = useState({})
  const router = useRouter()

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const CurrentStepComponent = steps[currentStep - 1].component

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Progress Bar */}
      <div className="w-full bg-gray-900 h-2">
        <div 
          className="bg-red-500 h-2 transition-all duration-500"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent 
              data={userData}
              setData={setUserData}
              onNext={nextStep}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
```

---

## 🗓️ Week 2: Habit Engine Core

### 📝 Day 8-10: Habit Management System

#### 1. Habit CRUD Operations
**File: `src/lib/graphql/habits/mutations.ts`**
```typescript
import { gql } from '@apollo/client'

export const CREATE_HABIT = gql`
  mutation CreateHabit($input: CreateHabitInput!) {
    createHabit(input: $input) {
      id
      name
      description
      category
      frequency
      trackingType
      targetCount
      points
      color
      icon
      isActive
    }
  }
`

export const UPDATE_HABIT = gql`
  mutation UpdateHabit($id: ID!, $input: UpdateHabitInput!) {
    updateHabit(id: $id, input: $input) {
      id
      name
      description
      category
      frequency
      trackingType
      targetCount
      points
      color
      icon
      isActive
    }
  }
`
```

#### 2. Habit Categories & Templates
**File: `src/lib/habits/templates.ts`**
```typescript
export const HABIT_TEMPLATES = {
  MORNING_ROUTINE: [
    {
      name: "Meditación matutina",
      description: "5-10 minutos de meditación al despertar",
      trackingType: "DURATION",
      targetCount: 10,
      targetUnit: "minutos",
      points: 2,
      color: "#8B5CF6",
      icon: "🧘"
    },
    {
      name: "Vaso de agua",
      description: "Hidratación inmediata al despertar",
      trackingType: "BINARY",
      targetCount: 1,
      points: 1,
      color: "#3B82F6",
      icon: "💧"
    }
  ],
  PHYSICAL_TRAINING: [
    {
      name: "Entrenamiento",
      description: "Sesión de ejercicio físico",
      trackingType: "DURATION",
      targetCount: 45,
      targetUnit: "minutos",
      points: 3,
      color: "#EF4444",
      icon: "💪"
    }
  ]
}
```

### 📊 Day 11-14: Daily Tracking Interface

#### 1. Quick Log Component
**File: `src/components/habits/QuickLog.tsx`**
```typescript
"use client"
import { useState } from "react"
import { useMutation } from "@apollo/client"
import { LOG_HABIT_ENTRY } from "@/lib/graphql/habits/mutations"

interface QuickLogProps {
  habits: Habit[]
  date: string
}

export default function QuickLog({ habits, date }: QuickLogProps) {
  const [entries, setEntries] = useState<Record<string, any>>({})
  const [logEntry] = useMutation(LOG_HABIT_ENTRY)

  const handleHabitComplete = async (habitId: string, value?: number) => {
    try {
      await logEntry({
        variables: {
          habitId,
          date,
          status: "COMPLETED",
          value,
          timeSpent: value // for duration tracking
        }
      })
      
      setEntries(prev => ({
        ...prev,
        [habitId]: { completed: true, value }
      }))
    } catch (error) {
      console.error("Error logging habit:", error)
    }
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">
        Hábitos de Hoy
      </h3>
      
      <div className="space-y-3">
        {habits.map(habit => (
          <HabitQuickLogItem
            key={habit.id}
            habit={habit}
            isCompleted={entries[habit.id]?.completed}
            onComplete={handleHabitComplete}
          />
        ))}
      </div>
    </div>
  )
}
```

---

## 🗓️ Week 3: Scoring & Gamification

### 🏆 Day 15-17: Daily Score System

#### 1. Score Calculation Engine
**File: `src/lib/scoring/calculator.ts`**
```typescript
import { HabitCategory, HabitEntry } from "@prisma/client"

export interface CategoryScore {
  category: HabitCategory
  points: number
  maxPoints: number
  percentage: number
}

export class ScoreCalculator {
  static calculateDailyScore(
    entries: HabitEntry[], 
    habits: Habit[]
  ): {
    totalPoints: number
    categoryScores: CategoryScore[]
    overallPercentage: number
  } {
    const categoryTotals: Record<HabitCategory, { points: number, maxPoints: number }> = {
      MORNING_ROUTINE: { points: 0, maxPoints: 0 },
      PHYSICAL_TRAINING: { points: 0, maxPoints: 0 },
      NUTRITION: { points: 0, maxPoints: 0 },
      DEEP_WORK: { points: 0, maxPoints: 0 },
      PERSONAL_DEVELOPMENT: { points: 0, maxPoints: 0 },
      SOCIAL_CHARISMA: { points: 0, maxPoints: 0 },
      REFLECTION: { points: 0, maxPoints: 0 },
      SLEEP_RECOVERY: { points: 0, maxPoints: 0 }
    }

    // Calculate points per category
    habits.forEach(habit => {
      categoryTotals[habit.category].maxPoints += habit.points
      
      const entry = entries.find(e => e.habitId === habit.id)
      if (entry?.status === "COMPLETED") {
        categoryTotals[habit.category].points += habit.points
      }
    })

    const categoryScores: CategoryScore[] = Object.entries(categoryTotals).map(
      ([category, { points, maxPoints }]) => ({
        category: category as HabitCategory,
        points,
        maxPoints,
        percentage: maxPoints > 0 ? (points / maxPoints) * 100 : 0
      })
    )

    const totalPoints = categoryScores.reduce((sum, cat) => sum + cat.points, 0)
    const totalMaxPoints = categoryScores.reduce((sum, cat) => sum + cat.maxPoints, 0)
    const overallPercentage = totalMaxPoints > 0 ? (totalPoints / totalMaxPoints) * 100 : 0

    return {
      totalPoints,
      categoryScores,
      overallPercentage
    }
  }
}
```

### 🎯 Day 18-21: Challenge System

#### 1. Challenge Management
**File: `src/components/challenges/ChallengeCard.tsx`**
```typescript
interface ChallengeCardProps {
  challenge: Challenge
  progress: number
}

export default function ChallengeCard({ challenge, progress }: ChallengeCardProps) {
  const progressPercentage = (progress / challenge.targetValue) * 100
  const daysRemaining = Math.ceil(
    (new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{challenge.name}</h3>
        <span className="text-sm text-gray-400">{daysRemaining} días restantes</span>
      </div>
      
      <p className="text-gray-300 mb-4">{challenge.description}</p>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{progress} / {challenge.targetValue}</span>
          <span>{progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>
      
      {challenge.reward && (
        <div className="text-sm text-yellow-400">
          🏆 Recompensa: {challenge.reward}
        </div>
      )}
    </div>
  )
}
```

---

## 🗓️ Week 4: Dashboard & Navigation

### 📊 Day 22-25: Main User Dashboard

#### 1. Dashboard Layout
**File: `src/app/(dashboard)/dashboard/page.tsx`**
```typescript
"use client"
import { useQuery } from "@apollo/client"
import { GET_USER_DASHBOARD_DATA } from "@/lib/graphql/dashboard/queries"
import QuickLog from "@/components/habits/QuickLog"
import DailyScore from "@/components/dashboard/DailyScore"
import ProgressChart from "@/components/dashboard/ProgressChart"
import ActiveChallenges from "@/components/challenges/ActiveChallenges"

export default function DashboardPage() {
  const { data, loading, error } = useQuery(GET_USER_DASHBOARD_DATA, {
    variables: { date: new Date().toISOString().split('T')[0] }
  })

  if (loading) return <DashboardSkeleton />
  if (error) return <ErrorMessage error={error.message} />

  const { habits, dailyScore, challenges, recentEntries } = data.userDashboard

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            ¡Buenos días, {data.currentUser.firstName}! 👋
          </h1>
          <p className="text-gray-400">
            Es hora de trabajar en tu transformación
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Log */}
          <div className="lg:col-span-2">
            <QuickLog habits={habits} date={new Date().toISOString().split('T')[0]} />
          </div>
          
          {/* Daily Score */}
          <div>
            <DailyScore score={dailyScore} />
          </div>
          
          {/* Progress Chart */}
          <div className="lg:col-span-2">
            <ProgressChart entries={recentEntries} />
          </div>
          
          {/* Active Challenges */}
          <div>
            <ActiveChallenges challenges={challenges} />
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 🧭 Day 26-28: Navigation & Sidebar

#### 1. Sidebar Component
**File: `src/components/layout/Sidebar.tsx`**
```typescript
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/utilities/ui"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'Hábitos', href: '/habits', icon: '✅' },
  { name: 'Rutinas', href: '/workouts', icon: '💪' },
  { name: 'Recetas', href: '/recipes', icon: '🥗' },
  { name: 'Desafíos', href: '/challenges', icon: '🏆' },
  { name: 'Mindset', href: '/mindset', icon: '🧠' },
  { name: 'Comunidad', href: '/community', icon: '👥' },
  { name: 'Progreso', href: '/progress', icon: '📊' }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-800">
        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">GF</span>
        </div>
        <div>
          <h1 className="text-white font-bold">Gainz Factory</h1>
          <p className="text-gray-400 text-sm">Transformation OS</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-red-500 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
```

---

## 🔧 Implementation Checklist

### Week 1: Authentication & Onboarding
- [ ] NextAuth.js configuration
- [ ] User registration API
- [ ] Email verification system
- [ ] Password reset functionality
- [ ] Social login (Google)
- [ ] Onboarding flow (4 steps)
- [ ] Goal setting wizard
- [ ] Initial habit templates

### Week 2: Habit Engine
- [ ] Habit CRUD operations
- [ ] Category-based organization
- [ ] Tracking types (binary, numeric, duration, rating, text)
- [ ] Habit templates system
- [ ] Daily tracking interface
- [ ] Quick-log functionality
- [ ] Mood and difficulty tracking
- [ ] Streak calculation

### Week 3: Scoring & Gamification
- [ ] Daily score calculation engine
- [ ] 8-category scoring system
- [ ] Point algorithms
- [ ] Progress charts
- [ ] Achievement system
- [ ] Challenge management
- [ ] Multi-day challenges
- [ ] Reward tracking

### Week 4: Dashboard & Navigation
- [ ] Main dashboard layout
- [ ] Daily overview widgets
- [ ] Progress visualization
- [ ] Motivational content
- [ ] Responsive sidebar navigation
- [ ] Module-based navigation
- [ ] Quick actions
- [ ] Mobile responsiveness

---

## 🎨 UI/UX Implementation Notes

### Design System Components
- **Colors**: Red (#EF4444), Black (#000000), White (#FFFFFF)
- **Typography**: Poppins for headings, Inter for body text
- **Components**: ShadCN base + custom Gainz Factory styling
- **Icons**: Lucide React + emoji for personality
- **Animations**: Framer Motion for smooth transitions

### Key UX Principles
1. **Motivational**: Every interaction inspires transformation
2. **Progressive**: Information revealed as needed
3. **Personalized**: Content adapts to user preferences
4. **Accessible**: WCAG 2.1 AA compliance
5. **Responsive**: Seamless mobile experience

### Error Handling
- Clear, friendly error messages
- Fallback states for loading/error
- Guided recovery with helpful suggestions
- Toast notifications for actions

---

This implementation guide provides the foundation for Phase 1 development. Each week builds upon the previous, creating a solid habit tracking platform that embodies the Gainz Factory vision of holistic transformation. 