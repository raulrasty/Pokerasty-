import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./prisma"

const config = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
  checks: ["state"],
  wellKnown: undefined,
  issuer: undefined,
}),
    Google,
  ],
  pages: {
    signIn: "/login",
  },
  debug: true,
}
const { handlers, signIn, signOut, auth } = NextAuth(config)

export { handlers, signIn, signOut, auth }