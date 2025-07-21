import { gql } from '@apollo/client';

// Profile queries
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      email
      firstName
      lastName
      bio
      phoneNumber
      profileImageUrl
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    userProfile {
      id
      email
      firstName
      lastName
      bio
      phoneNumber
      profileImageUrl
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROFILE_STATS = gql`
  query GetProfileStats {
    profileStats {
      totalDays
      currentStreak
      longestStreak
      completedHabits
      totalPoints
      averageScore
      satisfactionRating
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      firstName
      lastName
      bio
      phoneNumber
      profileImageUrl
      updatedAt
    }
  }
`;

// Calendar queries
export const GET_CALENDAR_DATA = gql`
  query GetCalendarData($month: Int!, $year: Int!) {
    calendarData(month: $month, year: $year) {
      date
      completedHabits
      totalHabits
      points
      completionPercentage
      hasStreak
      entries {
        id
        status
        habit {
          id
          name
          category
          points
        }
      }
    }
  }
`;

export const GET_CALENDAR_DAY = gql`
  query GetCalendarDay($date: String!) {
    calendarDay(date: $date) {
      date
      completedHabits
      totalHabits
      points
      completionPercentage
      hasStreak
      entries {
        id
        status
        value
        note
        timeSpent
        difficulty
        mood
        habit {
          id
          name
          category
          trackingType
          points
        }
      }
    }
  }
`;

export const GET_MONTHLY_STATS = gql`
  query GetMonthlyStats($month: Int!, $year: Int!) {
    monthlyStats(month: $month, year: $year) {
      month
      year
      totalDays
      activeDays
      averageCompletion
      longestStreak
      totalPoints
      categoryBreakdown {
        category
        totalHabits
        completedToday
        averageScore
        streak
      }
    }
  }
`;

// Habit queries for dashboard integration
export const GET_MY_HABITS = gql`
  query GetMyHabits {
    myHabits {
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
      currentStreak
      entries(limit: 7) {
        id
        date
        status
        value
        note
      }
      streaks(active: true) {
        id
        length
        startDate
        isActive
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_HABITS_BY_CATEGORY = gql`
  query GetHabitsByCategory($category: HabitCategory!) {
    habitsByCategory(category: $category) {
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
      currentStreak
      entries(limit: 7) {
        id
        date
        status
        value
        note
      }
      streaks(active: true) {
        id
        length
        startDate
        isActive
      }
    }
  }
`;

export const LOG_HABIT_ENTRY = gql`
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
        category
        points
      }
    }
  }
`;

export const CREATE_HABIT = gql`
  mutation CreateHabit($input: NewHabitInput!) {
    createHabit(input: $input) {
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
      currentStreak
      createdAt
      updatedAt
    }
  }
`;

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
      targetValue
      targetUnit
      points
      color
      icon
      isActive
      order
      currentStreak
      updatedAt
    }
  }
`;

export const DELETE_HABIT = gql`
  mutation DeleteHabit($id: ID!) {
    deleteHabit(id: $id)
  }
`;

// Challenge queries
export const GET_ACTIVE_CHALLENGES = gql`
  query GetActiveChallenges {
    activeChallenges {
      id
      name
      description
      category
      startDate
      endDate
      targetValue
      currentValue
      isCompleted
      reward
      createdAt
    }
  }
`;

export const CREATE_CHALLENGE = gql`
  mutation CreateChallenge($input: NewChallengeInput!) {
    createChallenge(input: $input) {
      id
      name
      description
      category
      startDate
      endDate
      targetValue
      currentValue
      isCompleted
      reward
      createdAt
    }
  }
`;

// Dashboard and statistics queries
export const GET_TODAY_SCORE = gql`
  query GetTodayScore {
    todayScore {
      id
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
    }
  }
`;

export const GET_WEEKLY_SCORES = gql`
  query GetWeeklyScores {
    weeklyScores {
      id
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
    }
  }
`;

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
      id
      length
      startDate
      endDate
      isActive
      habit {
        id
        name
        category
        color
        icon
      }
    }
  }
`;

// Utility mutations
export const RESET_TODAY_PROGRESS = gql`
  mutation ResetTodayProgress {
    resetTodayProgress {
      success
      message
      resetsCount
    }
  }
`;

export const RECALCULATE_DAILY_SCORE = gql`
  mutation RecalculateDailyScore($date: String!) {
    recalculateDailyScore(date: $date) {
      id
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
    }
  }
`; 