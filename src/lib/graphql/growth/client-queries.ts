import { gql } from '@apollo/client';

// Fragments para campos básicos
export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    email
    firstName
    lastName
    bio
    profileImageUrl
    isActive
    createdAt
  }
`;

export const HABIT_FRAGMENT = gql`
  fragment HabitFields on Habit {
    id
    userId
    name
    description
    category
    frequency
    targetCount
    trackingType
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
`;

export const HABIT_ENTRY_FRAGMENT = gql`
  fragment HabitEntryFields on HabitEntry {
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
  }
`;

export const HABIT_STREAK_FRAGMENT = gql`
  fragment HabitStreakFields on HabitStreak {
    id
    habitId
    startDate
    endDate
    length
    isActive
    createdAt
  }
`;

export const DAILY_SCORE_FRAGMENT = gql`
  fragment DailyScoreFields on DailyScore {
    id
    userId
    date
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
    createdAt
  }
`;

export const CHALLENGE_FRAGMENT = gql`
  fragment ChallengeFields on Challenge {
    id
    userId
    name
    description
    category
    startDate
    endDate
    targetValue
    currentValue
    isCompleted
    reward
    progress
    createdAt
  }
`;

// ===== QUERIES PRINCIPALES =====

export const GET_MY_HABITS = gql`
  query GetMyHabits {
    myHabits {
      ...HabitFields
      entries(limit: 7) {
        ...HabitEntryFields
      }
      streaks(active: true) {
        ...HabitStreakFields
      }
    }
  }
  ${HABIT_FRAGMENT}
  ${HABIT_ENTRY_FRAGMENT}
  ${HABIT_STREAK_FRAGMENT}
`;

export const GET_HABIT_DETAIL = gql`
  query GetHabitDetail($id: ID!) {
    habitWithEntries(habitId: $id) {
      ...HabitFields
      entries {
        ...HabitEntryFields
      }
      streaks {
        ...HabitStreakFields
      }
    }
  }
  ${HABIT_FRAGMENT}
  ${HABIT_ENTRY_FRAGMENT}
  ${HABIT_STREAK_FRAGMENT}
`;

export const GET_HABITS_BY_CATEGORY = gql`
  query GetHabitsByCategory($category: HabitCategory!) {
    habitsByCategory(category: $category) {
      ...HabitFields
      entries(limit: 7) {
        ...HabitEntryFields
      }
      streaks(active: true) {
        ...HabitStreakFields
      }
    }
  }
  ${HABIT_FRAGMENT}
  ${HABIT_ENTRY_FRAGMENT}
  ${HABIT_STREAK_FRAGMENT}
`;

// ===== QUERIES DE DASHBOARD =====

export const GET_TODAY_SCORE = gql`
  query GetTodayScore {
    todayScore {
      ...DailyScoreFields
    }
  }
  ${DAILY_SCORE_FRAGMENT}
`;

export const GET_WEEKLY_SCORES = gql`
  query GetWeeklyScores {
    weeklyScores {
      ...DailyScoreFields
    }
  }
  ${DAILY_SCORE_FRAGMENT}
`;

export const GET_MONTHLY_SCORES = gql`
  query GetMonthlyScores {
    monthlyScores {
      ...DailyScoreFields
    }
  }
  ${DAILY_SCORE_FRAGMENT}
`;

// ===== QUERIES DE CHALLENGES =====

export const GET_ACTIVE_CHALLENGES = gql`
  query GetActiveChallenges {
    activeChallenges {
      ...ChallengeFields
    }
  }
  ${CHALLENGE_FRAGMENT}
`;

export const GET_COMPLETED_CHALLENGES = gql`
  query GetCompletedChallenges {
    completedChallenges {
      ...ChallengeFields
    }
  }
  ${CHALLENGE_FRAGMENT}
`;

// ===== QUERIES DE ESTADÍSTICAS =====

export const GET_CATEGORY_STATS = gql`
  query GetCategoryStats {
    categoryStats {
      category
      totalHabits
      completedToday
      averageScore
      streak
    }
  }
`;

export const GET_LONGEST_STREAKS = gql`
  query GetLongestStreaks {
    longestStreaks {
      ...HabitStreakFields
      habit {
        ...HabitFields
      }
    }
  }
  ${HABIT_STREAK_FRAGMENT}
  ${HABIT_FRAGMENT}
`;

// ===== MUTACIONES DE HÁBITOS =====

export const CREATE_HABIT = gql`
  mutation CreateHabit($input: NewHabitInput!) {
    createHabit(input: $input) {
      ...HabitFields
    }
  }
  ${HABIT_FRAGMENT}
`;

export const UPDATE_HABIT = gql`
  mutation UpdateHabit($id: ID!, $input: UpdateHabitInput!) {
    updateHabit(id: $id, input: $input) {
      ...HabitFields
    }
  }
  ${HABIT_FRAGMENT}
`;

export const DELETE_HABIT = gql`
  mutation DeleteHabit($id: ID!) {
    deleteHabit(id: $id)
  }
`;

// ===== MUTACIONES DE ENTRADAS =====

export const LOG_HABIT_ENTRY = gql`
  mutation LogHabitEntry($input: LogHabitEntryInput!) {
    logHabitEntry(input: $input) {
      ...HabitEntryFields
      habit {
        ...HabitFields
      }
    }
  }
  ${HABIT_ENTRY_FRAGMENT}
  ${HABIT_FRAGMENT}
`;

export const DELETE_HABIT_ENTRY = gql`
  mutation DeleteHabitEntry($id: ID!) {
    deleteHabitEntry(id: $id)
  }
`;

// ===== MUTACIONES DE CHALLENGES =====

export const CREATE_CHALLENGE = gql`
  mutation CreateChallenge($input: NewChallengeInput!) {
    createChallenge(input: $input) {
      ...ChallengeFields
    }
  }
  ${CHALLENGE_FRAGMENT}
`;

export const UPDATE_CHALLENGE_PROGRESS = gql`
  mutation UpdateChallengeProgress($id: ID!, $progress: Int!) {
    updateChallengeProgress(id: $id, progress: $progress) {
      ...ChallengeFields
    }
  }
  ${CHALLENGE_FRAGMENT}
`;

export const COMPLETE_CHALLENGE = gql`
  mutation CompleteChallenge($id: ID!) {
    completeChallenge(id: $id) {
      ...ChallengeFields
    }
  }
  ${CHALLENGE_FRAGMENT}
`;

// ===== MUTACIONES DE PUNTUACIÓN =====

export const RECALCULATE_DAILY_SCORE = gql`
  mutation RecalculateDailyScore($date: String!) {
    recalculateDailyScore(date: $date) {
      ...DailyScoreFields
    }
  }
  ${DAILY_SCORE_FRAGMENT}
`;

export const RESET_TODAY_PROGRESS = gql`
  mutation ResetTodayProgress {
    resetTodayProgress {
      success
      message
      resetsCount
    }
  }
`;

// ===== QUERIES AUXILIARES =====

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

export const AUTHENTICATE_USER = gql`
  query AuthenticateUser($email: String!, $password: String!) {
    authenticateUser(email: $email, password: $password) {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_HABIT_ENTRIES = gql`
  query GetHabitEntries($habitId: ID!) {
    habitEntries(habitId: $habitId) {
      ...HabitEntryFields
    }
  }
  ${HABIT_ENTRY_FRAGMENT}
`;

// ===== QUERIES DE DASHBOARD COMPLETO =====

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    todayScore {
      ...DailyScoreFields
    }
    categoryStats {
      category
      totalHabits
      completedToday
      averageScore
      streak
    }
    activeChallenges {
      ...ChallengeFields
    }
    myHabits {
      ...HabitFields
      entries(limit: 1) {
        ...HabitEntryFields
      }
    }
  }
  ${DAILY_SCORE_FRAGMENT}
  ${CHALLENGE_FRAGMENT}
  ${HABIT_FRAGMENT}
  ${HABIT_ENTRY_FRAGMENT}
`; 