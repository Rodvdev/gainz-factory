# Gainz Factory - Complete Database Schema Diagram

```mermaid
erDiagram
    User {
        string id PK
        string email UK
        string password
        string firstName
        string lastName
        string bio
        string phoneNumber
        string profileImageUrl
        boolean isActive
        datetime emailVerified
        datetime emailVerifiedAt
        string passwordResetToken
        datetime passwordResetExpires
        datetime createdAt
        datetime updatedAt
    }

    Habit {
        string id PK
        string userId FK
        string name
        string description
        enum category
        enum frequency
        enum trackingType
        int targetCount
        float targetValue
        string targetUnit
        int points
        string color
        string icon
        boolean isActive
        int order
        datetime createdAt
        datetime updatedAt
    }

    HabitEntry {
        string id PK
        string habitId FK
        datetime date
        enum status
        float value
        string textValue
        string note
        int timeSpent
        int difficulty
        int mood
        datetime createdAt
    }

    HabitStreak {
        string id PK
        string habitId FK
        datetime startDate
        datetime endDate
        int length
        boolean isActive
        datetime createdAt
    }

    DailyScore {
        string id PK
        string userId FK
        datetime date
        int totalPoints
        int completedHabits
        int totalHabits
        int morningScore
        int physicalScore
        int nutritionScore
        int workScore
        int developmentScore
        int socialScore
        int reflectionScore
        int sleepScore
        float percentile
        int rank
        datetime createdAt
    }

    Challenge {
        string id PK
        string userId FK
        string name
        string description
        enum category
        datetime startDate
        datetime endDate
        int targetValue
        int currentValue
        boolean isCompleted
        string reward
        datetime createdAt
    }

    Recipe {
        string id PK
        string title
        string description
        string objective
        enum level
        boolean isPremium
        string imageUrl
        string videoUrl
        datetime createdAt
    }

    Service {
        string id PK
        string name
        string description
        enum level
        float price
        int duration
        boolean isActive
        datetime createdAt
    }

    MediaContent {
        string id PK
        string title
        string type
        string url
        string topic
        string module
        int episode
        boolean isPremium
        datetime createdAt
    }

    MediaProgress {
        string id PK
        string userId FK
        string mediaId FK
        datetime watchedAt
        float progress
    }

    BlogPost {
        string id PK
        string title
        string content
        string authorId FK
        string[] tags
        datetime createdAt
    }

    ForumPost {
        string id PK
        string userId FK
        string title
        string content
        string category
        datetime createdAt
    }

    ForumComment {
        string id PK
        string postId FK
        string userId FK
        string content
        datetime createdAt
    }

    Exercise {
        string id PK
        string name
        string description
        enum type
        enum intensity
        enum level
        string technique
        string videoUrl
        string imageUrl
        string[] targetMuscles
        datetime createdAt
    }

    WorkoutRoutine {
        string id PK
        string userId FK
        string title
        string objective
        enum level
        int duration
        boolean isPublic
        datetime createdAt
    }

    RoutineExercise {
        string id PK
        string routineId FK
        string exerciseId FK
        int order
        int sets
        int reps
        int restSeconds
    }

    Ticket {
        string id PK
        string userId FK
        string type
        datetime expiresAt
        boolean isUsed
        datetime createdAt
    }

    UserGoal {
        string id PK
        string userId FK
        string goal
        datetime targetDate
        datetime createdAt
    }

    JournalEntry {
        string id PK
        string userId FK
        datetime date
        string prompt
        string content
        int mood
        datetime createdAt
    }

    Coach {
        string id PK
        string userId FK
        string specialty
        string bio
        boolean isVisible
        datetime createdAt
    }

    AIInteraction {
        string id PK
        string userId FK
        string type
        string prompt
        string response
        datetime createdAt
    }

    %% Core Relationships
    User ||--o{ Habit : "has"
    User ||--o{ DailyScore : "has"
    User ||--o{ Challenge : "has"
    User ||--o{ MediaProgress : "tracks"
    User ||--o{ BlogPost : "authors"
    User ||--o{ ForumPost : "creates"
    User ||--o{ ForumComment : "comments"
    User ||--o{ WorkoutRoutine : "owns"
    User ||--o{ Ticket : "has"
    User ||--o{ UserGoal : "sets"
    User ||--o{ JournalEntry : "writes"
    User ||--o{ Coach : "becomes"
    User ||--o{ AIInteraction : "interacts"
    
    Habit ||--o{ HabitEntry : "has"
    Habit ||--o{ HabitStreak : "has"

    %% Content Relationships
    MediaContent ||--o{ MediaProgress : "tracked_by"
    ForumPost ||--o{ ForumComment : "has"
    WorkoutRoutine ||--o{ RoutineExercise : "contains"
    Exercise ||--o{ RoutineExercise : "used_in"

    %% Enums
    HabitCategory {
        MORNING_ROUTINE
        PHYSICAL_TRAINING
        NUTRITION
        DEEP_WORK
        PERSONAL_DEVELOPMENT
        SOCIAL_CHARISMA
        REFLECTION
        SLEEP_RECOVERY
    }

    HabitFrequency {
        DAILY
        WEEKLY
        MONTHLY
    }

    EntryStatus {
        COMPLETED
        SKIPPED
        PARTIAL
        FAILED
    }

    TrackingType {
        BINARY
        NUMERIC
        DURATION
        RATING
        TEXT
    }

    ServiceLevel {
        LOW
        HIGH
    }

    ExerciseType {
        STRENGTH
        CARDIO
        MOBILITY
        FLEXIBILITY
    }

    IntensityLevel {
        LOW
        MEDIUM
        HIGH
    }

    UserLevel {
        BEGINNER
        INTERMEDIATE
        ADVANCED
    }
```

## Complete Schema Overview

### Core System Entities

1. **User** - Main user entity with authentication and profile information
2. **Habit** - Habit definitions with categories, tracking types, and gamification elements
3. **HabitEntry** - Daily habit completion records with flexible value tracking
4. **HabitStreak** - Streak tracking for habit consistency
5. **DailyScore** - Daily scoring and analytics per user
6. **Challenge** - User-defined challenges and goals

### Content & Education Module

7. **Recipe** - Nutrition recipes with difficulty levels and objectives
8. **Service** - Coaching and advisory services with pricing
9. **MediaContent** - Educational content (videos, PDFs, eBooks)
10. **MediaProgress** - User progress tracking through content
11. **BlogPost** - Long-form educational articles
12. **ForumPost** - Community discussions
13. **ForumComment** - Responses to forum posts

### Fitness & Exercise Module

14. **Exercise** - Exercise library with types, intensity, and target muscles
15. **WorkoutRoutine** - User-created or AI-generated workout routines
16. **RoutineExercise** - Exercises within routines with sets, reps, and rest

### Personal Development Module

17. **UserGoal** - Long-term transformation goals
18. **JournalEntry** - Personal reflections and mindset tracking
19. **Coach** - Specialized trainers and mentors
20. **AIInteraction** - AI-assisted coaching and guidance
21. **Ticket** - Access control for premium features

### Key Features

- **Flexible Habit Tracking**: Supports binary, numeric, duration, rating, and text-based tracking
- **Gamification**: Points system, streaks, daily scoring, and challenges
- **Comprehensive Analytics**: Category-based scoring and progress tracking
- **Educational Content**: Videos, articles, and interactive learning
- **Community Support**: Forum discussions and peer support
- **AI Integration**: Personalized coaching and routine generation
- **Premium Access**: Gated content and services via ticket system
- **Coach Management**: Specialized trainers with different expertise areas

### Data Integrity

- **CASCADE Deletion**: All user-related data is automatically cleaned up
- **Referential Integrity**: Proper foreign key relationships throughout
- **Audit Trail**: Creation timestamps on all entities
- **Soft Deletes**: Active/inactive status for content management

### Relationships

- **One-to-Many**: User has many habits, scores, challenges, etc.
- **Many-to-Many**: Exercises can be used in multiple routines
- **Hierarchical**: Forum posts contain multiple comments
- **Progress Tracking**: Users track progress through various content types

This comprehensive schema supports a complete life transformation platform with physical, mental, and spiritual development components. 