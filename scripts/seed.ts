#!/usr/bin/env tsx

/**
 * Seed Script para Gainz Factory
 * Inicializa la base de datos con los datos de Rodrigo (tu usuario)
 */

import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Gainz Factory database seed...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.$transaction([
    prisma.aIInteraction.deleteMany(),
    prisma.journalEntry.deleteMany(),
    prisma.userGoal.deleteMany(),
    prisma.coach.deleteMany(),
    prisma.ticket.deleteMany(),
    prisma.routineExercise.deleteMany(),
    prisma.workoutRoutine.deleteMany(),
    prisma.exercise.deleteMany(),
    prisma.forumComment.deleteMany(),
    prisma.forumPost.deleteMany(),
    prisma.blogPost.deleteMany(),
    prisma.mediaProgress.deleteMany(),
    prisma.mediaContent.deleteMany(),
    prisma.service.deleteMany(),
    prisma.recipe.deleteMany(),
    prisma.habitStreak.deleteMany(),
    prisma.habitEntry.deleteMany(),
    prisma.habit.deleteMany(),
    prisma.dailyScore.deleteMany(),
    prisma.challenge.deleteMany(),
    prisma.user.deleteMany(),
  ])

  console.log('✅ Database cleared')

  // Create users
  console.log('👥 Creating users...')
  const hashedPassword = await hash('password123', 12)

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'rodrigo@gainzfactory.com',
        password: hashedPassword,
        firstName: 'Rodrigo',
        lastName: 'Vasquez de Velasco',
        bio: 'Founder of Gainz Factory. Passionate about helping people transform their lives through discipline and purpose.',
        phoneNumber: '+1234567890',
        profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        isActive: true,
        emailVerified: new Date(),
        emailVerifiedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'chepa@gainzfactory.com',
        password: hashedPassword,
        firstName: 'Sebastian',
        lastName: 'Diaz',
        bio: 'Nutrition coach and wellness expert. Helping people build sustainable healthy habits.',
        phoneNumber: '+1234567891',
        profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        isActive: true,
        emailVerified: new Date(),
        emailVerifiedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'carlos@gainzfactory.com',
        password: hashedPassword,
        firstName: 'Carlos',
        lastName: 'Martinez',
        bio: 'Strength coach and personal trainer. Specialized in functional training and muscle building.',
        phoneNumber: '+1234567892',
        profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isActive: true,
        emailVerified: new Date(),
        emailVerifiedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'ana@gainzfactory.com',
        password: hashedPassword,
        firstName: 'Ana',
        lastName: 'Lopez',
        bio: 'Mindset coach and meditation teacher. Guiding people towards spiritual growth and mental clarity.',
        phoneNumber: '+1234567893',
        profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        isActive: true,
        emailVerified: new Date(),
        emailVerifiedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'user1@gainzfactory.com',
        password: hashedPassword,
        firstName: 'Alex',
        lastName: 'Johnson',
        bio: 'Fitness enthusiast on a journey to transform my life through discipline and purpose.',
        phoneNumber: '+1234567894',
        profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        isActive: true,
        emailVerified: new Date(),
        emailVerifiedAt: new Date(),
      },
    }),
  ])

  const [rodrigo, maria, carlos, ana, alex] = users
  console.log('✅ Users created')

  // Create coaches
  console.log('🏋️ Creating coaches...')
  const coaches = await Promise.all([
    prisma.coach.create({
      data: {
        userId: maria.id,
        specialty: 'Nutrition & Wellness',
        bio: 'Certified nutritionist with 8+ years of experience helping people build sustainable healthy habits.',
        isVisible: true,
      },
    }),
    prisma.coach.create({
      data: {
        userId: carlos.id,
        specialty: 'Strength Training & Muscle Building',
        bio: 'NASM certified personal trainer specializing in functional training and muscle development.',
        isVisible: true,
      },
    }),
    prisma.coach.create({
      data: {
        userId: ana.id,
        specialty: 'Mindset & Spiritual Growth',
        bio: 'Mindfulness coach and meditation teacher helping people find inner peace and purpose.',
        isVisible: true,
      },
    }),
  ])

  console.log('✅ Coaches created')

  // Create habits for Alex
  console.log('📝 Creating habits...')
  const habits = await Promise.all([
    prisma.habit.create({
      data: {
        userId: alex.id,
        name: 'Morning Meditation',
        description: 'Start the day with 10 minutes of mindfulness meditation',
        category: 'MORNING_ROUTINE',
        frequency: 'DAILY',
        trackingType: 'DURATION',
        targetCount: 1,
        targetValue: 10,
        targetUnit: 'minutes',
        points: 5,
        color: '#8B5CF6',
        icon: '🧘',
        isActive: true,
        order: 1,
      },
    }),
    prisma.habit.create({
      data: {
        userId: alex.id,
        name: 'Drink 8 Glasses of Water',
        description: 'Stay hydrated throughout the day',
        category: 'NUTRITION',
        frequency: 'DAILY',
        trackingType: 'NUMERIC',
        targetCount: 1,
        targetValue: 8,
        targetUnit: 'glasses',
        points: 3,
        color: '#3B82F6',
        icon: '💧',
        isActive: true,
        order: 2,
      },
    }),
    prisma.habit.create({
      data: {
        userId: alex.id,
        name: 'Strength Training',
        description: 'Complete a full body workout',
        category: 'PHYSICAL_TRAINING',
        frequency: 'WEEKLY',
        trackingType: 'BINARY',
        targetCount: 3,
        points: 10,
        color: '#EF4444',
        icon: '💪',
        isActive: true,
        order: 3,
      },
    }),
    prisma.habit.create({
      data: {
        userId: alex.id,
        name: 'Read 30 Minutes',
        description: 'Read personal development or educational content',
        category: 'PERSONAL_DEVELOPMENT',
        frequency: 'DAILY',
        trackingType: 'DURATION',
        targetCount: 1,
        targetValue: 30,
        targetUnit: 'minutes',
        points: 4,
        color: '#10B981',
        icon: '📚',
        isActive: true,
        order: 4,
      },
    }),
    prisma.habit.create({
      data: {
        userId: alex.id,
        name: 'Deep Work Session',
        description: 'Focus on important tasks without distractions',
        category: 'DEEP_WORK',
        frequency: 'DAILY',
        trackingType: 'DURATION',
        targetCount: 1,
        targetValue: 90,
        targetUnit: 'minutes',
        points: 8,
        color: '#F59E0B',
        icon: '🎯',
        isActive: true,
        order: 5,
      },
    }),
  ])

  console.log('✅ Habits created')

  // Create habit entries for the last 30 days
  console.log('📊 Creating habit entries...')
  const habitEntries = []
  const today = new Date()
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Morning Meditation - 80% completion rate
    if (Math.random() < 0.8) {
      habitEntries.push(
        prisma.habitEntry.create({
          data: {
            habitId: habits[0].id,
            date: date,
            status: 'COMPLETED',
            value: 10 + Math.floor(Math.random() * 5), // 10-15 minutes
            note: 'Great morning session',
            timeSpent: 10 + Math.floor(Math.random() * 5),
            difficulty: 2 + Math.floor(Math.random() * 2),
            mood: 7 + Math.floor(Math.random() * 3),
          },
        })
      )
    }

    // Water intake - 90% completion rate
    if (Math.random() < 0.9) {
      habitEntries.push(
        prisma.habitEntry.create({
          data: {
            habitId: habits[1].id,
            date: date,
            status: 'COMPLETED',
            value: 6 + Math.floor(Math.random() * 4), // 6-10 glasses
            note: 'Stayed hydrated',
            difficulty: 1 + Math.floor(Math.random() * 2),
            mood: 6 + Math.floor(Math.random() * 4),
          },
        })
      )
    }

    // Strength Training - 70% completion rate (weekly habit)
    if (Math.random() < 0.7 && i % 7 < 3) {
      habitEntries.push(
        prisma.habitEntry.create({
          data: {
            habitId: habits[2].id,
            date: date,
            status: 'COMPLETED',
            note: 'Great workout session',
            timeSpent: 45 + Math.floor(Math.random() * 30),
            difficulty: 3 + Math.floor(Math.random() * 2),
            mood: 8 + Math.floor(Math.random() * 2),
          },
        })
      )
    }

    // Reading - 85% completion rate
    if (Math.random() < 0.85) {
      habitEntries.push(
        prisma.habitEntry.create({
          data: {
            habitId: habits[3].id,
            date: date,
            status: 'COMPLETED',
            value: 25 + Math.floor(Math.random() * 20), // 25-45 minutes
            note: 'Interesting chapter',
            timeSpent: 25 + Math.floor(Math.random() * 20),
            difficulty: 2 + Math.floor(Math.random() * 2),
            mood: 6 + Math.floor(Math.random() * 4),
          },
        })
      )
    }

    // Deep Work - 75% completion rate
    if (Math.random() < 0.75) {
      habitEntries.push(
        prisma.habitEntry.create({
          data: {
            habitId: habits[4].id,
            date: date,
            status: 'COMPLETED',
            value: 60 + Math.floor(Math.random() * 60), // 60-120 minutes
            note: 'Productive session',
            timeSpent: 60 + Math.floor(Math.random() * 60),
            difficulty: 4 + Math.floor(Math.random() * 2),
            mood: 7 + Math.floor(Math.random() * 3),
          },
        })
      )
    }
  }

  await Promise.all(habitEntries)
  console.log('✅ Habit entries created')

  // Create daily scores for the last 30 days
  console.log('🏆 Creating daily scores...')
  const dailyScores = []
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const totalPoints = 15 + Math.floor(Math.random() * 20) // 15-35 points
    const completedHabits = 3 + Math.floor(Math.random() * 3) // 3-6 habits
    const totalHabits = 5
    
    dailyScores.push(
      prisma.dailyScore.create({
        data: {
          userId: alex.id,
          date: date,
          totalPoints: totalPoints,
          completedHabits: completedHabits,
          totalHabits: totalHabits,
          morningScore: Math.floor(Math.random() * 10),
          physicalScore: Math.floor(Math.random() * 15),
          nutritionScore: Math.floor(Math.random() * 8),
          workScore: Math.floor(Math.random() * 12),
          developmentScore: Math.floor(Math.random() * 10),
          socialScore: Math.floor(Math.random() * 6),
          reflectionScore: Math.floor(Math.random() * 8),
          sleepScore: Math.floor(Math.random() * 10),
          percentile: 60 + Math.floor(Math.random() * 30),
          rank: 1 + Math.floor(Math.random() * 100),
        },
      })
    )
  }

  await Promise.all(dailyScores)
  console.log('✅ Daily scores created')

  // Create challenges
  console.log('🎯 Creating challenges...')
  const challenges = await Promise.all([
    prisma.challenge.create({
      data: {
        userId: alex.id,
        name: '30 Days of Meditation',
        description: 'Build a consistent meditation practice',
        category: 'MORNING_ROUTINE',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        targetValue: 30,
        currentValue: 24,
        isCompleted: false,
        reward: 'Inner peace and mental clarity',
      },
    }),
    prisma.challenge.create({
      data: {
        userId: alex.id,
        name: '90 Days of Strength Training',
        description: 'Build muscle and strength consistently',
        category: 'PHYSICAL_TRAINING',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
        targetValue: 90,
        currentValue: 67,
        isCompleted: false,
        reward: 'Transformed physique and confidence',
      },
    }),
  ])

  console.log('✅ Challenges created')

  // Create exercises
  console.log('💪 Creating exercises...')
  const exercises = await Promise.all([
    prisma.exercise.create({
      data: {
        name: 'Push-ups',
        description: 'Classic bodyweight exercise for chest, shoulders, and triceps',
        type: 'STRENGTH',
        intensity: 'MEDIUM',
        level: 'BEGINNER',
        technique: 'Keep your body in a straight line, lower your chest to the ground, then push back up',
        videoUrl: 'https://example.com/pushups.mp4',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Squats',
        description: 'Fundamental lower body exercise',
        type: 'STRENGTH',
        intensity: 'MEDIUM',
        level: 'BEGINNER',
        technique: 'Stand with feet shoulder-width apart, lower your body as if sitting back into a chair',
        videoUrl: 'https://example.com/squats.mp4',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Plank',
        description: 'Core stability exercise',
        type: 'STRENGTH',
        intensity: 'LOW',
        level: 'BEGINNER',
        technique: 'Hold your body in a straight line from head to heels',
        videoUrl: 'https://example.com/plank.mp4',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        targetMuscles: ['Core', 'Shoulders'],
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Burpees',
        description: 'Full body conditioning exercise',
        type: 'CARDIO',
        intensity: 'HIGH',
        level: 'INTERMEDIATE',
        technique: 'Combine squat, push-up, and jump in one fluid movement',
        videoUrl: 'https://example.com/burpees.mp4',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        targetMuscles: ['Full Body'],
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Pull-ups',
        description: 'Upper body pulling exercise',
        type: 'STRENGTH',
        intensity: 'HIGH',
        level: 'ADVANCED',
        technique: 'Hang from a bar and pull your body up until your chin is over the bar',
        videoUrl: 'https://example.com/pullups.mp4',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        targetMuscles: ['Back', 'Biceps', 'Shoulders'],
      },
    }),
  ])

  console.log('✅ Exercises created')

  // Create workout routines
  console.log('🏋️ Creating workout routines...')
  const workoutRoutines = await Promise.all([
    prisma.workoutRoutine.create({
      data: {
        userId: alex.id,
        title: 'Full Body Beginner',
        objective: 'Build strength and endurance',
        level: 'BEGINNER',
        duration: 45,
        isPublic: true,
      },
    }),
    prisma.workoutRoutine.create({
      data: {
        userId: carlos.id,
        title: 'Advanced Strength Program',
        objective: 'Maximize muscle growth and strength',
        level: 'ADVANCED',
        duration: 75,
        isPublic: true,
      },
    }),
  ])

  console.log('✅ Workout routines created')

  // Create routine exercises
  console.log('📋 Creating routine exercises...')
  const routineExercises = await Promise.all([
    prisma.routineExercise.create({
      data: {
        routineId: workoutRoutines[0].id,
        exerciseId: exercises[0].id,
        order: 1,
        sets: 3,
        reps: 10,
        restSeconds: 60,
      },
    }),
    prisma.routineExercise.create({
      data: {
        routineId: workoutRoutines[0].id,
        exerciseId: exercises[1].id,
        order: 2,
        sets: 3,
        reps: 15,
        restSeconds: 60,
      },
    }),
    prisma.routineExercise.create({
      data: {
        routineId: workoutRoutines[0].id,
        exerciseId: exercises[2].id,
        order: 3,
        sets: 3,
        reps: 30,
        restSeconds: 45,
      },
    }),
  ])

  console.log('✅ Routine exercises created')

  // Create recipes
  console.log('🍳 Creating recipes...')
  const recipes = await Promise.all([
    prisma.recipe.create({
      data: {
        title: 'Protein Power Bowl',
        description: 'High-protein meal perfect for muscle building',
        objective: 'Muscle Building',
        level: 'BEGINNER',
        isPremium: false,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        videoUrl: 'https://example.com/protein-bowl.mp4',
      },
    }),
    prisma.recipe.create({
      data: {
        title: 'Green Smoothie Bowl',
        description: 'Nutrient-packed breakfast for energy and vitality',
        objective: 'Weight Loss',
        level: 'BEGINNER',
        isPremium: false,
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
        videoUrl: 'https://example.com/smoothie-bowl.mp4',
      },
    }),
    prisma.recipe.create({
      data: {
        title: 'Advanced Meal Prep Guide',
        description: 'Complete meal prep system for busy professionals',
        objective: 'Muscle Building',
        level: 'ADVANCED',
        isPremium: true,
        imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
        videoUrl: 'https://example.com/meal-prep.mp4',
      },
    }),
  ])

  console.log('✅ Recipes created')

  // Create services
  console.log('🎯 Creating services...')
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Nutrition Consultation',
        description: 'Personalized nutrition plan and guidance',
        level: 'HIGH',
        price: 150.00,
        duration: 60,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Personal Training Session',
        description: 'One-on-one training with certified coach',
        level: 'HIGH',
        price: 200.00,
        duration: 60,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Mindset Coaching',
        description: 'Spiritual and mental growth guidance',
        level: 'HIGH',
        price: 120.00,
        duration: 45,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Basic Fitness Assessment',
        description: 'Initial fitness evaluation and recommendations',
        level: 'LOW',
        price: 50.00,
        duration: 30,
        isActive: true,
      },
    }),
  ])

  console.log('✅ Services created')

  // Create media content
  console.log('📺 Creating media content...')
  const mediaContent = await Promise.all([
    prisma.mediaContent.create({
      data: {
        title: 'Mindset 101: Building Mental Resilience',
        type: 'video',
        url: 'https://example.com/mindset-101.mp4',
        topic: 'Mindset',
        module: 'Mindset Fundamentals',
        episode: 1,
        isPremium: false,
      },
    }),
    prisma.mediaContent.create({
      data: {
        title: 'Nutrition Myths Debunked',
        type: 'video',
        url: 'https://example.com/nutrition-myths.mp4',
        topic: 'Nutrition',
        module: 'Nutrition Basics',
        episode: 1,
        isPremium: false,
      },
    }),
    prisma.mediaContent.create({
      data: {
        title: 'Advanced Strength Training Techniques',
        type: 'video',
        url: 'https://example.com/advanced-strength.mp4',
        topic: 'Exercises',
        module: 'Advanced Training',
        episode: 1,
        isPremium: true,
      },
    }),
    prisma.mediaContent.create({
      data: {
        title: 'Daily Meditation Guide',
        type: 'pdf',
        url: 'https://example.com/meditation-guide.pdf',
        topic: 'Spirituality',
        module: 'Spiritual Growth',
        episode: null,
        isPremium: false,
      },
    }),
  ])

  console.log('✅ Media content created')

  // Create media progress
  console.log('📊 Creating media progress...')
  const mediaProgress = await Promise.all([
    prisma.mediaProgress.create({
      data: {
        userId: alex.id,
        mediaId: mediaContent[0].id,
        watchedAt: new Date(),
        progress: 0.75,
      },
    }),
    prisma.mediaProgress.create({
      data: {
        userId: alex.id,
        mediaId: mediaContent[1].id,
        watchedAt: new Date(),
        progress: 1.0,
      },
    }),
  ])

  console.log('✅ Media progress created')

  // Create blog posts
  console.log('📝 Creating blog posts...')
  const blogPosts = await Promise.all([
    prisma.blogPost.create({
      data: {
        title: 'The Science of Habit Formation',
        content: 'Understanding how habits work and how to build lasting positive behaviors...',
        authorId: rodrigo.id,
        tags: ['habits', 'psychology', 'productivity'],
      },
    }),
    prisma.blogPost.create({
      data: {
        title: '10 Nutrition Myths That Are Holding You Back',
        content: 'Debunking common nutrition misconceptions that prevent people from reaching their goals...',
        authorId: maria.id,
        tags: ['nutrition', 'myths', 'health'],
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'Building Mental Toughness Through Training',
        content: 'How physical training builds mental resilience and character...',
        authorId: carlos.id,
        tags: ['mindset', 'training', 'mental-toughness'],
      },
    }),
  ])

  console.log('✅ Blog posts created')

  // Create forum posts
  console.log('💬 Creating forum posts...')
  const forumPosts = await Promise.all([
    prisma.forumPost.create({
      data: {
        userId: alex.id,
        title: 'Tips for staying consistent with morning routine?',
        content: 'I\'m struggling to maintain my morning routine. Any advice from the community?',
        category: 'mindset',
      },
    }),
    prisma.forumPost.create({
      data: {
        userId: alex.id,
        title: 'Best protein sources for muscle building',
        content: 'Looking for recommendations on high-quality protein sources for my muscle building goals.',
        category: 'nutrition',
      },
    }),
  ])

  console.log('✅ Forum posts created')

  // Create forum comments
  console.log('💭 Creating forum comments...')
  const forumComments = await Promise.all([
    prisma.forumComment.create({
      data: {
        postId: forumPosts[0].id,
        userId: maria.id,
        content: 'Start small! Begin with just 5 minutes and gradually increase. Consistency beats intensity every time.',
      },
    }),
    prisma.forumComment.create({
      data: {
        postId: forumPosts[0].id,
        userId: carlos.id,
        content: 'I agree with Maria. Also, prepare everything the night before to reduce friction in the morning.',
      },
    }),
    prisma.forumComment.create({
      data: {
        postId: forumPosts[1].id,
        userId: maria.id,
        content: 'Great question! I recommend lean meats, eggs, Greek yogurt, and plant-based options like lentils and quinoa.',
      },
    }),
  ])

  console.log('✅ Forum comments created')

  // Create tickets
  console.log('🎫 Creating tickets...')
  const tickets = await Promise.all([
    prisma.ticket.create({
      data: {
        userId: alex.id,
        type: 'premium_access',
        expiresAt: new Date('2024-12-31'),
        isUsed: false,
      },
    }),
    prisma.ticket.create({
      data: {
        userId: alex.id,
        type: 'personal_coaching',
        expiresAt: new Date('2024-06-30'),
        isUsed: false,
      },
    }),
  ])

  console.log('✅ Tickets created')

  // Create user goals
  console.log('🎯 Creating user goals...')
  const userGoals = await Promise.all([
    prisma.userGoal.create({
      data: {
        userId: alex.id,
        goal: 'Gain 10 pounds of muscle mass',
        targetDate: new Date('2024-06-30'),
      },
    }),
    prisma.userGoal.create({
      data: {
        userId: alex.id,
        goal: 'Improve mental clarity and reduce stress',
        targetDate: new Date('2024-12-31'),
      },
    }),
  ])

  console.log('✅ User goals created')

  // Create journal entries
  console.log('📖 Creating journal entries...')
  const journalEntries = await Promise.all([
    prisma.journalEntry.create({
      data: {
        userId: alex.id,
        date: new Date('2024-01-15'),
        prompt: 'What am I grateful for today?',
        content: 'I\'m grateful for my health, my supportive family, and the opportunity to work on myself every day.',
        mood: 8,
      },
    }),
    prisma.journalEntry.create({
      data: {
        userId: alex.id,
        date: new Date('2024-01-16'),
        prompt: 'What challenges did I overcome today?',
        content: 'I completed my workout even though I was tired. It reminded me that discipline is a choice.',
        mood: 7,
      },
    }),
    prisma.journalEntry.create({
      data: {
        userId: alex.id,
        date: new Date('2024-01-17'),
        prompt: 'What am I looking forward to tomorrow?',
        content: 'I\'m excited to try the new meditation technique I learned and to continue building my morning routine.',
        mood: 9,
      },
    }),
  ])

  console.log('✅ Journal entries created')

  // Create AI interactions
  console.log('🤖 Creating AI interactions...')
  const aiInteractions = await Promise.all([
    prisma.aIInteraction.create({
      data: {
        userId: alex.id,
        type: 'workout_routine',
        prompt: 'I want a beginner-friendly full body workout routine',
        response: 'Here\'s a great beginner full body routine: 3 sets of 10 push-ups, 3 sets of 15 squats, 3 sets of 30-second planks. Rest 60 seconds between sets.',
      },
    }),
    prisma.aIInteraction.create({
      data: {
        userId: alex.id,
        type: 'nutrition',
        prompt: 'What should I eat before a morning workout?',
        response: 'For a morning workout, try a light snack 30-60 minutes before: banana with almond butter, Greek yogurt with berries, or a protein smoothie.',
      },
    }),
    prisma.aIInteraction.create({
      data: {
        userId: alex.id,
        type: 'mindset',
        prompt: 'How can I stay motivated when I don\'t feel like working out?',
        response: 'Focus on consistency over intensity. Start with just 5 minutes. Remember your "why" and how good you\'ll feel afterward. Discipline beats motivation every time.',
      },
    }),
  ])

  console.log('✅ AI interactions created')

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- ${users.length} users created`)
  console.log(`- ${coaches.length} coaches created`)
  console.log(`- ${habits.length} habits created`)
  console.log(`- ${habitEntries.length} habit entries created`)
  console.log(`- ${dailyScores.length} daily scores created`)
  console.log(`- ${challenges.length} challenges created`)
  console.log(`- ${exercises.length} exercises created`)
  console.log(`- ${workoutRoutines.length} workout routines created`)
  console.log(`- ${routineExercises.length} routine exercises created`)
  console.log(`- ${recipes.length} recipes created`)
  console.log(`- ${services.length} services created`)
  console.log(`- ${mediaContent.length} media content items created`)
  console.log(`- ${mediaProgress.length} media progress records created`)
  console.log(`- ${blogPosts.length} blog posts created`)
  console.log(`- ${forumPosts.length} forum posts created`)
  console.log(`- ${forumComments.length} forum comments created`)
  console.log(`- ${tickets.length} tickets created`)
  console.log(`- ${userGoals.length} user goals created`)
  console.log(`- ${journalEntries.length} journal entries created`)
  console.log(`- ${aiInteractions.length} AI interactions created`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 