import { gql } from '@apollo/client';

export const PUBLIC_SCHEMA = gql`
  type Recipe {
    id: ID!
    title: String!
    description: String
    objective: String
    level: UserLevel
    isPremium: Boolean!
    imageUrl: String
    videoUrl: String
    createdAt: String!
  }

  type Coach {
    id: ID!
    userId: String!
    specialty: String
    bio: String
    isVisible: Boolean!
    createdAt: String!
    user: User!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    bio: String
    profileImageUrl: String
    isActive: Boolean!
  }

  enum UserLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }

  type Query {
    # Recetas públicas (no premium)
    publicRecipes: [Recipe!]!
    
    # Todas las recetas (para mostrar premium con badge)
    allRecipes: [Recipe!]!
    
    # Receta por ID
    recipe(id: ID!): Recipe
    
    # Coaches visibles
    visibleCoaches: [Coach!]!
    
    # Coach por ID
    coach(id: ID!): Coach
  }
`;

export const PUBLIC_QUERIES = {
  GET_PUBLIC_RECIPES: gql`
    query GetPublicRecipes {
      publicRecipes {
        id
        title
        description
        objective
        level
        isPremium
        imageUrl
        videoUrl
        createdAt
      }
    }
  `,
  
  GET_ALL_RECIPES: gql`
    query GetAllRecipes {
      allRecipes {
        id
        title
        description
        objective
        level
        isPremium
        imageUrl
        videoUrl
        createdAt
      }
    }
  `,
  
  GET_RECIPE: gql`
    query GetRecipe($id: ID!) {
      recipe(id: $id) {
        id
        title
        description
        objective
        level
        isPremium
        imageUrl
        videoUrl
        createdAt
      }
    }
  `,
  
  GET_VISIBLE_COACHES: gql`
    query GetVisibleCoaches {
      visibleCoaches {
        id
        userId
        specialty
        bio
        isVisible
        createdAt
        user {
          id
          firstName
          lastName
          bio
          profileImageUrl
          isActive
        }
      }
    }
  `,
  
  GET_COACH: gql`
    query GetCoach($id: ID!) {
      coach(id: $id) {
        id
        userId
        specialty
        bio
        isVisible
        createdAt
        user {
          id
          firstName
          lastName
          bio
          profileImageUrl
          isActive
        }
      }
    }
  `
}; 