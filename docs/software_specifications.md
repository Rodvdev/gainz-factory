📄 Gainz Factory — Software Specification Document

🧭 Overview

Gainz Factory is a holistic digital platform designed to guide users through physical, mental, and spiritual transformation over a period of at least 3 months. It combines advanced habit tracking, customized workout routines, educational content, community support, and premium coaching services.

The core of the platform is the Habit Engine, which powers all gamification, scoring, and personalized tracking. All other modules — such as Recipes, Workouts, Challenges, Services, and Community — revolve around and reinforce this engine.

⸻

📦 Modules

1. User Management

Handles authentication, registration, profile management, and tracking of personal data.

Key Features:
	•	Authentication with email/password
	•	Profile with personal details (name, bio, image, phone)
	•	Active status
	•	Email verification, password recovery
	•	Role-based access for admin/coaches

2. Habit Tracking Engine (Core)

Tracks daily habits with flexible tracking types and advanced analytics.

Entities:
	•	Habit: defined per user with frequency, category, target values, points, icons, etc.
	•	HabitEntry: daily tracking input (value, time spent, mood, etc.)
	•	HabitStreak: active streaks based on completion
	•	DailyScore: daily point system across 8 life categories
	•	Challenge: multi-day targets with optional rewards and progress counters

Gamification:
	•	Streaks
	•	Daily Win Scores
	•	Category-based scoring (nutrition, sleep, training, etc.)

3. Workout & Exercise Module

Provides a structured library of exercises and enables custom routine generation based on user goals.

Entities:
	•	Exercise: type, level, target muscles, intensity, technique, video/image
	•	WorkoutRoutine: generated or custom routines
	•	RoutineExercise: exercises in each routine with order, reps, sets, rest

Personalization:
	•	Routines filtered by user level, goal, and availability
	•	AI assistant to suggest workouts based on form input

4. Recipe Module

Healthy meals organized by nutritional goals and levels.

Entities:
	•	Recipe: title, description, goal, premium status, image/video

Features:
	•	Public and premium recipes
	•	Connection to user goals
	•	Recipe search/filter by objective

5. Services Module

Offers coaching and advisory services of varying intensities.

Entities:
	•	Service: name, level (low/high), price, duration, status

6. Media Library

Hub of educational content: videos, PDFs, eBooks, etc.

Entities:
	•	MediaContent: topic (Mindset, Nutrition, Spirituality), type, module/episode
	•	MediaProgress: user-specific watch progress tracking

Features:
	•	Módulo-based video series (e.g., “Mindset 101”)
	•	Progress bar per user
	•	Premium and public access

7. Community & Forum

Connects users to share experiences, ask questions, and grow together.

Entities:
	•	ForumPost: title, content, category, user
	•	ForumComment: replies by other users

Features:
	•	Categories (e.g., mindset, nutrition, training)
	•	Threaded conversations
	•	Admin moderation

8. Blog & Content Publishing

Platform for posting long-form educational content.

Entities:
	•	BlogPost: title, tags, content, author

Features:
	•	Informational posts (e.g., nutrition myths, deep work routines)
	•	Coach-authored articles

9. Ticketing System

Controls access to premium features via redeemable or paid tickets.

Entities:
	•	Ticket: type (access, routine, coaching), expiration, usage status

Use cases:
	•	Gated content (recipes, media, services)
	•	Personalized program access

10. Journaling & Reflection (Future)

Adds personal reflections to track emotional and spiritual growth.

Entities:
	•	JournalEntry: user-generated reflections tied to a date, mood, and prompts

Use cases:
	•	Daily mindset review
	•	Emotional wellbeing tracking
	•	Integrated with habits

11. Goal Tracking & Progress Forecasting (Future)

Models for long-term goal tracking and AI-based prediction of progress.

Entities:
	•	UserGoal: target transformation goals (e.g., lose 5kg, gain muscle)
	•	ProgressForecast: AI-generated estimate of progress/time remaining

12. Coach Management (Future)

Allows assigning verified coaches with specialties and access privileges.

Entities:
	•	Coach: linked to user, defines bio, specialty, availability

⸻

🧠 Intelligence Layer (AI Assistant)

Functions:
	•	Generate workout routines based on form
	•	Answer common fitness, nutrition, and spirituality questions
	•	Provide feedback based on progress

Future Features:
	•	Adaptive coaching
	•	Conversational agent for motivation and reflection
	•	AI logging (interactions stored in AIInteraction model)

⸻

🧘 Spirituality & Mindset Focus

Gainz Factory is not just physical. Users gain access to:
	•	Journaling prompts
	•	Breathwork and meditation practices
	•	Mindset coaching videos and tips
	•	Reflections tracked via habits

⸻

🎮 Gamification Mechanics
	•	Streaks
	•	Daily category scores
	•	Challenges with rewards
	•	XP/Level system (future phase)

⸻

🗂️ Data Model Summary
	•	25+ Prisma Models including: User, Habit, DailyScore, Challenge, Exercise, Recipe, Service, MediaContent, ForumPost, BlogPost, Ticket, JournalEntry, UserGoal, Coach, AIInteraction, etc.
	•	Enums: HabitCategory, TrackingType, HabitFrequency, EntryStatus, ServiceLevel, ExerciseType, IntensityLevel, UserLevel

⸻

🔐 Access Control
	•	Public vs Premium access (via Ticket)
	•	Role-based access (admin, coach, user)
	•	Certain modules gated for advanced users

⸻

🌐 Technology Stack
	•	Backend: Prisma + PostgreSQL
	•	API: GraphQL (Apollo)
	•	Frontend: Next.js 15 + TypeScript + Tailwind + ShadCN
	•	Hosting: Vercel + Railway (Postgres)
	•	Authentication: NextAuth + (Wallet-based coming soon)

⸻

📈 Future Modules (Phase 2+)
	•	Progress forecasting and predictions
	•	AI-guided spiritual reflection journal
	•	NFT/membership-based access
	•	Coach dashboards & analytics
	•	App mobile (React Native or Expo)
	•	Coach/User messaging system
	•	Leaderboards and progress analytics

⸻

📌 Final Notes

Gainz Factory is more than a habit app. It is a life transformation operating system rooted in discipline, purpose, and truth. The system is modular, extensible, and built to evolve with the user across time.

Everything — from habits to routines to spiritual growth — works en conjunto to help the user reach their highest potential.