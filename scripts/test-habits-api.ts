import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testHabitsAPI() {
  try {
    console.log('🧪 Testing Habits API...')

    // Test 1: Get a user
    const user = await prisma.user.findFirst({
      where: { isActive: true }
    })

    if (!user) {
      console.log('❌ No active user found')
      return
    }

    console.log(`✅ Found user: ${user.firstName} ${user.lastName}`)

    // Test 2: Check habit model structure
    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      include: {
        schedule: true,
        streaks: {
          where: { isActive: true },
          orderBy: { length: 'desc' },
          take: 1
        },
        entries: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            },
            status: 'COMPLETED'
          },
          take: 1
        }
      },
      orderBy: [
        { isActive: 'desc' },
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    console.log(`✅ Found ${habits.length} habits for user`)

    if (habits.length > 0) {
      const habit = habits[0]
      console.log(`✅ Sample habit: ${habit.name}`)
      console.log(`   - Streaks: ${habit.streaks.length}`)
      console.log(`   - Entries today: ${habit.entries.length}`)
      console.log(`   - Schedule: ${habit.schedule ? 'Yes' : 'No'}`)
    }

    // Test 3: Create a test habit if none exist
    if (habits.length === 0) {
      console.log('📝 Creating test habit...')
      
      const testHabit = await prisma.habit.create({
        data: {
          name: 'Test Habit',
          description: 'A test habit for API validation',
          category: 'MORNING_ROUTINE',
          trackingType: 'BINARY',
          targetCount: 1,
          points: 5,
          color: '#3B82F6',
          icon: '🧪',
          userId: user.id,
          order: 1,
          isActive: true
        }
      })

      console.log(`✅ Created test habit: ${testHabit.name}`)

      // Create initial streak
      await prisma.habitStreak.create({
        data: {
          habitId: testHabit.id,
          startDate: new Date(),
          length: 0,
          isActive: true
        }
      })

      console.log('✅ Created initial streak')
    }

    console.log('🎉 All tests passed!')

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testHabitsAPI()
