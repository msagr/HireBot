"use server";

import z from "zod";
import { RegisterSchema } from "../schemas";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    try {
        const validatedFields = RegisterSchema.safeParse(values);
        if(!validatedFields.success) {
            return { error: "Invalid fields!", success: undefined };
        }

        return { success: "Email sent!", error: undefined };
        
    } catch (error) {
        console.error("Login error:", error);
        return { error: 'An error occurred during login', success: undefined };
    }
};