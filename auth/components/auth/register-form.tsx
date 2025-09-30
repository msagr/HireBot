"use client";

import * as z from "zod";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";

import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { register } from "@/actions/register";
import { resendVerificationEmail } from "@/actions/resend-verification";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [showResend, setShowResend] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const searchParams = useSearchParams();
    const emailParam = searchParams.get("email");

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown((current) => current - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: emailParam ? String(emailParam) : "",
            password: "",
            name: "",
        }
    });

    const handleResendEmail = async (email: string) => {
        setError("");
        setSuccess("");
        
        const { error: resendError, success: resendSuccess } = await resendVerificationEmail(email);
        
        if (resendError) {
            setError(resendError);
        } else if (resendSuccess) {
            setShowResend(false);
            setResendCooldown(60); // 1 minute cooldown
            setSuccess(resendSuccess);
            
            // Hide the success message after 5 seconds
            setTimeout(() => {
                setSuccess("");
            }, 5000);
        }
    };

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");
        
        startTransition(() => {
            register(values)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success);
                    if (data.success) {
                        setShowResend(true);
                    }
                });
        });
    };
    
    return (
        <CardWrapper
            headerLabel="Create an account"
            backButtonLabel="Already have an account?"
            backButtonHref="/auth/login"
            showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPending}
                                            placeholder="John Doe"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPending}
                                            placeholder="john@example.com"
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPending}
                                            placeholder="********"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error || ""} />
                    <FormSuccess message={success || ""} />
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                    >
                        Register
                    </Button>
                    
                    {/* {showResend && (
                        <div className="text-center mt-4">
                            <p className="text-sm text-muted-foreground mb-2">
                                Didn&apos;t receive a verification email?
                            </p>
                            <Button
                                type="button"
                                variant="link"
                                className="p-0 h-auto text-sm"
                                disabled={resendCooldown > 0}
                                onClick={() => handleResendEmail(form.getValues("email"))}
                            >
                                {resendCooldown > 0 
                                    ? `Resend in ${resendCooldown}s` 
                                    : 'Resend verification email'}
                            </Button>
                        </div>
                    )} */}
                </form>
            </Form>
        </CardWrapper>
    );
};