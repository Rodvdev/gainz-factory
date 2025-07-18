declare module "next-auth" {
  interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    image?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      firstName: string
      lastName: string
      image?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    firstName: string
    lastName: string
  }
} 