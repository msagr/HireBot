"use server";

import z from "zod";
import { LoginSchema } from "../schemas";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    try {
        const validatedFields = LoginSchema.safeParse(values);
        if(!validatedFields.success) {
            return { error: "Invalid fields!", success: undefined };
        }

        return { success: "Email sent!", error: undefined };
        
    } catch (error) {
        console.error("Login error:", error);
        return { error: 'An error occurred during login', success: undefined };
    }
};