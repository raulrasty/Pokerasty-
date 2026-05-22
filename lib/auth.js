import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./prisma"

const config = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      checks: ["none"],
    }),
  ],
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
      if (token) {
        session.user.id = token.id
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
}

const { handlers, signIn, signOut, auth } = NextAuth(config)

export { handlers, signIn, signOut, auth }
