// Sistema de autenticación para Gainz Factory
// Integrado con GraphQL para obtener usuarios reales de la base de datos

import { apolloClient } from './apollo-client';
import { gql } from '@apollo/client';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profileImageUrl?: string;
  isActive: boolean;
}

// GraphQL query para obtener un usuario por ID
const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      bio
      profileImageUrl
      isActive
    }
  }
`;

// GraphQL query para obtener todos los usuarios activos
const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      email
      firstName
      lastName
      bio
      profileImageUrl
      isActive
    }
  }
`;

// GraphQL query para autenticar usuario
const AUTHENTICATE_USER = gql`
  query AuthenticateUser($email: String!, $password: String!) {
    authenticateUser(email: $email, password: $password) {
      id
      email
      firstName
      lastName
      bio
      profileImageUrl
      isActive
    }
  }
`;

// Cache local para el usuario actual
let currentUserCache: AuthUser | null = null;

// Usuario por defecto (Rodrigo) para fallback
const FALLBACK_USER: AuthUser = {
  id: 'rodrigo-gainz-factory',
  email: 'rodrigo@gainzfactory.com',
  firstName: 'Rodrigo',
  lastName: 'Rodriguez',
  bio: 'Founder & CEO de Gainz Factory',
  isActive: true,
};

// Función para obtener el usuario actual desde la base de datos
export async function getCurrentUser(): Promise<AuthUser> {
  // Si ya tenemos el usuario en cache, devolverlo
  if (currentUserCache) {
    return currentUserCache;
  }

  try {
    // Intentar obtener el usuario desde localStorage
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('currentUserId');
      
      if (storedUserId) {
        const { data } = await apolloClient.query({
          query: GET_USER_BY_ID,
          variables: { id: storedUserId },
          fetchPolicy: 'cache-first',
        });

        if (data?.user && data.user.isActive) {
          currentUserCache = data.user;
          return data.user;
        }
      }
    }

    // Si no hay usuario en localStorage o no se encuentra, usar el fallback
    currentUserCache = FALLBACK_USER;
    
    // Guardar en localStorage para próximas sesiones
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUserId', FALLBACK_USER.id);
    }

    return FALLBACK_USER;

  } catch (error) {
    console.error('Error obteniendo usuario actual:', error);
    
    // En caso de error, usar fallback
    currentUserCache = FALLBACK_USER;
    return FALLBACK_USER;
  }
}

// Función síncrona para obtener usuario (usa cache o fallback)
export function getCurrentUserSync(): AuthUser {
  return currentUserCache || FALLBACK_USER;
}

// Función para obtener todos los usuarios disponibles
export async function getAllUsers(): Promise<AuthUser[]> {
  try {
    const { data } = await apolloClient.query({
      query: GET_ALL_USERS,
      fetchPolicy: 'cache-first',
    });

    return data?.users?.filter((user: AuthUser) => user.isActive) || [FALLBACK_USER];
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return [FALLBACK_USER];
  }
}

// Función para cambiar de usuario
export async function switchUser(userId: string): Promise<void> {
  try {
    const { data } = await apolloClient.query({
      query: GET_USER_BY_ID,
      variables: { id: userId },
      fetchPolicy: 'network-only', // Forzar nueva consulta
    });

    if (data?.user && data.user.isActive) {
      currentUserCache = data.user;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUserId', userId);
        // Recargar la página para que se actualicen todas las queries
        window.location.reload();
      }
    } else {
      throw new Error('Usuario no encontrado o inactivo');
    }
  } catch (error) {
    console.error('Error cambiando usuario:', error);
    throw error;
  }
}

// Función para autenticar usuario (para futuro login)
export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    const { data } = await apolloClient.query({
      query: AUTHENTICATE_USER,
      variables: { email, password },
      fetchPolicy: 'network-only',
    });

    if (data?.authenticateUser) {
      currentUserCache = data.authenticateUser;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUserId', data.authenticateUser.id);
      }

      return data.authenticateUser;
    }

    return null;
  } catch (error) {
    console.error('Error autenticando usuario:', error);
    return null;
  }
}

// Hook para obtener usuario actual en componentes React
export function useCurrentUser(): AuthUser {
  // Por ahora retorna la versión síncrona
  // En el futuro se puede convertir en un hook que use useQuery
  return getCurrentUserSync();
}

// Verificar si un usuario está autenticado
export function isAuthenticated(): boolean {
  const user = getCurrentUserSync();
  return user !== null && user.isActive;
}

// Función para logout
export function logout(): void {
  currentUserCache = null;
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('userSession');
    
    // Limpiar cache de Apollo
    apolloClient.clearStore();
    
    // Redirigir al home
    window.location.href = '/';
  }
}

// Función para invalidar cache del usuario (útil para refresh)
export function invalidateUserCache(): void {
  currentUserCache = null;
}

// Función para inicializar el usuario (llamar al inicio de la app)
export async function initializeAuth(): Promise<AuthUser> {
  try {
    const user = await getCurrentUser();
    console.log('🔐 Usuario autenticado:', user.firstName, user.lastName);
    return user;
  } catch (error) {
    console.error('❌ Error inicializando autenticación:', error);
    return FALLBACK_USER;
  }
} 