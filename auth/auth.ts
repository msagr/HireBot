import NextAuth, {DefaultSession} from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";

import { getUserById } from "./data/user";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async signIn({ user }) {
        const existingUser = (user.id) ? await getUserById(user.id) : null;
        if (!existingUser || !existingUser.emailVerified) return false;
        return true;
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