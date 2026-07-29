import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

// Simple in-memory user storage (for demo purposes)
// In production, use a real database
const users = new Map<string, { email: string; password: string; name: string }>()

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text", required: false },
      },
      authorize: async (credentials) => {
        console.log("Authorize called with:", { email: credentials.email, hasName: !!credentials.name })
        const email = credentials.email as string
        const password = credentials.password as string
        const name = credentials.name as string | undefined

        if (!email || !password) {
          throw new Error("Email and password are required")
        }

        // If name is provided, this is a signup request
        if (name) {
          console.log("Signup request for:", email)
          if (users.has(email)) {
            throw new Error("User already exists")
          }
          users.set(email, { email, password, name })
          console.log("User created successfully")
          return { id: email, email, name }
        }

        // This is a login request
        console.log("Login request for:", email)
        const user = users.get(email)
        if (!user || user.password !== password) {
          console.log("Login failed: user not found or wrong password")
          throw new Error("Invalid email or password")
        }

        console.log("Login successful")
        return { id: user.email, email: user.email, name: user.name }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
