import { gql } from '@apollo/client';

export const HABIT_SCHEMA = gql`
  # Enums
  enum HabitCategory {
    MORNING_ROUTINE
    PHYSICAL_TRAINING
    NUTRITION
    DEEP_WORK
    PERSONAL_DEVELOPMENT
    SOCIAL_CHARISMA
    REFLECTION
    SLEEP_RECOVERY
  }

  enum HabitFrequency {
    DAILY
    WEEKLY
    MONTHLY
  }

  enum TrackingType {
    BINARY
    NUMERIC
    DURATION
    RATING
    TEXT
  }

  enum EntryStatus {
    COMPLETED
    SKIPPED
    PARTIAL
    FAILED
  }

  # Types
  type Habit {
    id: ID!
    userId: String!
    name: String!
    description: String
    category: HabitCategory!
    frequency: HabitFrequency!
    trackingType: TrackingType!
    targetCount: Int!
    targetValue: Float
    targetUnit: String
    points: Int!
    color: String
    icon: String
    isActive: Boolean!
    order: Int!
    entries: [HabitEntry!]!
    streaks: [HabitStreak!]!
    createdAt: String!
    updatedAt: String!
  }

  type HabitEntry {
    id: ID!
    habitId: String!
    habit: Habit!
    date: String!
    status: EntryStatus!
    value: Float
    textValue: String
    note: String
    timeSpent: Int
    difficulty: Int
    mood: Int
    createdAt: String!
  }

  type HabitStreak {
    id: ID!
    habitId: String!
    habit: Habit!
    startDate: String!
    endDate: String
    length: Int!
    isActive: Boolean!
    createdAt: String!
  }

  type DailyScore {
    id: ID!
    userId: String!
    date: String!
    totalPoints: Int!
    completedHabits: Int!
    totalHabits: Int!
    morningScore: Int!
    physicalScore: Int!
    nutritionScore: Int!
    workScore: Int!
    developmentScore: Int!
    socialScore: Int!
    reflectionScore: Int!
    sleepScore: Int!
    percentile: Float
    rank: Int
    createdAt: String!
  }

  # Input Types
  input CreateHabitInput {
    name: String!
    description: String
    category: HabitCategory!
    frequency: HabitFrequency!
    trackingType: TrackingType!
    targetCount: Int!
    targetValue: Float
    targetUnit: String
    points: Int!
    color: String
    icon: String
    order: Int
  }

  input UpdateHabitInput {
    name: String
    description: String
    category: HabitCategory
    frequency: HabitFrequency
    trackingType: TrackingType
    targetCount: Int
    targetValue: Float
    targetUnit: String
    points: Int
    color: String
    icon: String
    isActive: Boolean
    order: Int
  }

  input LogHabitEntryInput {
    habitId: String!
    date: String!
    status: EntryStatus!
    value: Float
    textValue: String
    note: String
    timeSpent: Int
    difficulty: Int
    mood: Int
  }

  # Queries
  type Query {
    # Habit queries
    userHabits(userId: String!): [Habit!]!
    activeHabits(userId: String!): [Habit!]!
    habitsByCategory(userId: String!, category: HabitCategory!): [Habit!]!
    habit(id: ID!): Habit
    
    # Entry queries
    habitEntries(habitId: String!, startDate: String, endDate: String): [HabitEntry!]!
    dailyEntries(userId: String!, date: String!): [HabitEntry!]!
    entryById(id: ID!): HabitEntry
    
    # Streak queries
    habitStreaks(habitId: String!): [HabitStreak!]!
    activeStreaks(userId: String!): [HabitStreak!]!
    longestStreaks(userId: String!): [HabitStreak!]!
    
    # Score queries
    dailyScore(userId: String!, date: String!): DailyScore
    weeklyScores(userId: String!, startDate: String!): [DailyScore!]!
    monthlyScores(userId: String!, month: String!): [DailyScore!]!
    
    # Dashboard queries
    userDashboard(userId: String!, date: String!): UserDashboardData!
  }

  # Mutations
  type Mutation {
    # Habit mutations
    createHabit(userId: String!, input: CreateHabitInput!): Habit!
    updateHabit(id: ID!, input: UpdateHabitInput!): Habit!
    deleteHabit(id: ID!): Boolean!
    reorderHabits(userId: String!, habitIds: [String!]!): [Habit!]!
    
    # Entry mutations
    logHabitEntry(input: LogHabitEntryInput!): HabitEntry!
    updateHabitEntry(id: ID!, input: LogHabitEntryInput!): HabitEntry!
    deleteHabitEntry(id: ID!): Boolean!
    
    # Batch operations
    logMultipleEntries(entries: [LogHabitEntryInput!]!): [HabitEntry!]!
    calculateDailyScore(userId: String!, date: String!): DailyScore!
  }

  # Dashboard composite type
  type UserDashboardData {
    user: User!
    habits: [Habit!]!
    dailyEntries: [HabitEntry!]!
    dailyScore: DailyScore
    activeStreaks: [HabitStreak!]!
    weeklyProgress: [DailyScore!]!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    profileImageUrl: String
  }
`;

// Individual query and mutation definitions for client-side use
export const HABIT_QUERIES = {
  GET_USER_HABITS: gql`
    query GetUserHabits($userId: String!) {
      userHabits(userId: $userId) {
        id
        name
        description
        category
        frequency
        trackingType
        targetCount
        targetValue
        targetUnit
        points
        color
        icon
        isActive
        order
        createdAt
        updatedAt
      }
    }
  `,

  GET_ACTIVE_HABITS: gql`
    query GetActiveHabits($userId: String!) {
      activeHabits(userId: $userId) {
        id
        name
        description
        category
        trackingType
        targetCount
        targetValue
        targetUnit
        points
        color
        icon
        order
      }
    }
  `,

  GET_DAILY_ENTRIES: gql`
    query GetDailyEntries($userId: String!, $date: String!) {
      dailyEntries(userId: $userId, date: $date) {
        id
        habitId
        date
        status
        value
        textValue
        note
        timeSpent
        difficulty
        mood
        createdAt
        habit {
          id
          name
          category
          trackingType
          targetCount
          points
          color
          icon
        }
      }
    }
  `,

  GET_USER_DASHBOARD: gql`
    query GetUserDashboard($userId: String!, $date: String!) {
      userDashboard(userId: $userId, date: $date) {
        user {
          id
          firstName
          lastName
          email
          profileImageUrl
        }
        habits {
          id
          name
          description
          category
          trackingType
          targetCount
          points
          color
          icon
          order
        }
        dailyEntries {
          id
          habitId
          status
          value
          timeSpent
          mood
        }
        dailyScore {
          id
          totalPoints
          completedHabits
          totalHabits
          morningScore
          physicalScore
          nutritionScore
          workScore
          developmentScore
          socialScore
          reflectionScore
          sleepScore
          percentile
        }
        activeStreaks {
          id
          habitId
          length
          startDate
          habit {
            name
            icon
            color
          }
        }
        weeklyProgress {
          date
          totalPoints
          completedHabits
          totalHabits
        }
      }
    }
  `,

  GET_DAILY_SCORE: gql`
    query GetDailyScore($userId: String!, $date: String!) {
      dailyScore(userId: $userId, date: $date) {
        id
        totalPoints
        completedHabits
        totalHabits
        morningScore
        physicalScore
        nutritionScore
        workScore
        developmentScore
        socialScore
        reflectionScore
        sleepScore
        percentile
        rank
      }
    }
  `,

  GET_ACTIVE_STREAKS: gql`
    query GetActiveStreaks($userId: String!) {
      activeStreaks(userId: $userId) {
        id
        length
        startDate
        habit {
          id
          name
          icon
          color
          category
        }
      }
    }
  `
};

export const HABIT_MUTATIONS = {
  CREATE_HABIT: gql`
    mutation CreateHabit($userId: String!, $input: CreateHabitInput!) {
      createHabit(userId: $userId, input: $input) {
        id
        name
        description
        category
        frequency
        trackingType
        targetCount
        targetValue
        targetUnit
        points
        color
        icon
        isActive
        order
        createdAt
        updatedAt
      }
    }
  `,

  UPDATE_HABIT: gql`
    mutation UpdateHabit($id: ID!, $input: UpdateHabitInput!) {
      updateHabit(id: $id, input: $input) {
        id
        name
        description
        category
        frequency
        trackingType
        targetCount
        targetValue
        targetUnit
        points
        color
        icon
        isActive
        order
        updatedAt
      }
    }
  `,

  DELETE_HABIT: gql`
    mutation DeleteHabit($id: ID!) {
      deleteHabit(id: $id)
    }
  `,

  LOG_HABIT_ENTRY: gql`
    mutation LogHabitEntry($input: LogHabitEntryInput!) {
      logHabitEntry(input: $input) {
        id
        habitId
        date
        status
        value
        textValue
        note
        timeSpent
        difficulty
        mood
        createdAt
        habit {
          id
          name
          points
        }
      }
    }
  `,

  LOG_MULTIPLE_ENTRIES: gql`
    mutation LogMultipleEntries($entries: [LogHabitEntryInput!]!) {
      logMultipleEntries(entries: $entries) {
        id
        habitId
        status
        value
        habit {
          id
          name
          points
        }
      }
    }
  `,

  CALCULATE_DAILY_SCORE: gql`
    mutation CalculateDailyScore($userId: String!, $date: String!) {
      calculateDailyScore(userId: $userId, date: $date) {
        id
        totalPoints
        completedHabits
        totalHabits
        morningScore
        physicalScore
        nutritionScore
        workScore
        developmentScore
        socialScore
        reflectionScore
        sleepScore
      }
    }
  `,

  REORDER_HABITS: gql`
    mutation ReorderHabits($userId: String!, $habitIds: [String!]!) {
      reorderHabits(userId: $userId, habitIds: $habitIds) {
        id
        order
      }
    }
  `
}; 