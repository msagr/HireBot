"use server";

import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const resendVerificationEmail = async (email: string) => {
    try {
        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            return { error: "Email not found!" };
        }

        if (existingUser.emailVerified) {
            return { error: "Email is already verified!" };
        }

        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { success: "Verification email resent!" };
    } catch (error) {
        console.error("Resend verification error:", error);
        return { error: "Failed to resend verification email" };
    }
};
