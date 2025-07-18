import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { getServerSession } from "next-auth/next"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import jwt, { JwtPayload } from "jsonwebtoken"
import { User } from "@prisma/client"
import { Session } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        const user = await db.user.findUnique({
          where: { email: credentials.email }
        })
        
        if (!user || !user.isActive) {
          return null
        }
        
        const passwordMatch = await bcrypt.compare(credentials.password, user.password)
        if (!passwordMatch) {
          return null
        }
        
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.profileImageUrl,
          firstName: user.firstName,
          lastName: user.lastName
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
    verifyRequest: "/auth/verify"
  },
  callbacks: {
    async jwt({ token, user }: { token: JwtToken; user: User }) {
      if (user) {
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JwtToken }) {
      if (token) {
        session.user.id = token.sub!
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Get current user from session (for GraphQL context)
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return null
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        bio: true,
        phoneNumber: true,
        profileImageUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user || !user.isActive) {
      return null
    }

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// JWT verification function for API routes
export async function verifyAuth(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as JwtPayload & { userId?: string }
    
    if (!decoded.userId) {
      return null
    }

    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true
      }
    })

    if (!user || !user.isActive) {
      return null
    }

    return user
  } catch (error) {
    console.error('Auth verification error:', error)
    return null
  }
}

// Create a demo user for development (temporary solution)
export function createDemoUser() {
  return {
    id: 'demo-user-123',
    email: 'demo@gainzfactory.com',
    firstName: 'Demo',
    lastName: 'User',
    bio: 'Demo user for Gainz Factory development',
    phoneNumber: '+51 123 456 789',
    profileImageUrl: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
} 