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
  trustHost: true,
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
}

const { handlers, signIn, signOut, auth } = NextAuth(config)

export { handlers, signIn, signOut, auth }
