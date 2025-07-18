export interface User {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profileImageUrl?: string;
  isActive: boolean;
}

export interface Coach {
  id: string;
  userId: string;
  specialty?: string;
  bio?: string;
  isVisible: boolean;
  createdAt: string;
  user: User;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  objective?: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isPremium: boolean;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
}

export interface GetVisibleCoachesData {
  visibleCoaches: Coach[];
}

export interface GetAllRecipesData {
  allRecipes: Recipe[];
}

export interface GetPublicRecipesData {
  publicRecipes: Recipe[];
} 