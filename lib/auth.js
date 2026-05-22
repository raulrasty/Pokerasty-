import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./prisma"

const config = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
  ],
  pages: {
    signIn: "/login",
  },
}

const { handlers, signIn, signOut, auth } = NextAuth(config)

export { handlers, signIn, signOut, auth }