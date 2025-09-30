import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";

import { getUserById } from "./data/user";
import { db } from "@/lib/db";
import authConfig from "@/auth.config"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role?: string
      image?: string | null
    } & DefaultSession["user"]
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
        await db.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() }
        })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
        // Allow OAuth sign in without email verification
        if (account?.provider !== 'credentials') {
            return true;
        }
        
        const existingUser = (user.id) ? await getUserById(user.id) : null;
        
        if (!existingUser?.emailVerified) return false;

        // TODO: 2FA check
        return true;
    },
    async session({ token, session }) {
        if (token.sub && session.user) {
            session.user.id = token.sub;
        }
        if (token.role && session.user) {
            session.user.role = token.role as string;
        }
        if (session.user) {
            session.user.name = token.name || null;
            session.user.email = token.email as string;
            session.user.image = token.picture as string | undefined;
        }
        return session;
    },
    async jwt({ token }) {
        if (!token.sub) return token;
        const existingUser = await getUserById(token.sub);

        if (!existingUser) return token;
        
        token.role = existingUser.role;
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.picture = existingUser.image || undefined;

        return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
});