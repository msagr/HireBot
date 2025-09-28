import NextAuth, {DefaultSession} from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";

import { getUserById } from "./data/user";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
        
        // For credentials, check if user exists and email is verified
        if (user.id) {
            const existingUser = await getUserById(user.id);
            return !!(existingUser?.emailVerified);
        }
        
        return false;
    },
    async session({ token, session }) {
        if (token.sub && session.user) {
            session.user.id = token.sub;
        }
        if (token.role && session.user) {
            session.user.role = token.role;
        }
        return session;
    },
    async jwt({ token }) {
        if (!token.sub) return token;
        const existingUser = await getUserById(token.sub);

        if (!existingUser) return token;
        token.role = existingUser.role;

        return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});