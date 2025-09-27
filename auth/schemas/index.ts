import * as z from "zod";

export const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(1, {
        message: "Password is required"
    }),
});
