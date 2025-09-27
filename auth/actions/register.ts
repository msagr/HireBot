"use server";

import z from "zod";
import { db } from "../lib/db";
import { RegisterSchema } from "../schemas";
import bcrypt  from "bcryptjs";

import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    try {
        const validatedFields = RegisterSchema.safeParse(values);
        if(!validatedFields.success) {
            return { error: "Invalid fields!", success: undefined };
        }

        const { email, password, name } = validatedFields.data;
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await getUserByEmail(email);

        if(existingUser) {
            return { error: "Email already in use !", success: undefined };
        }

        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        });

        // TODO: send verification token email
        return { success: "User created!", error: undefined };
        
    } catch (error) {
        console.error("Login error:", error);
        return { error: 'An error occurred during login', success: undefined };
    }
};